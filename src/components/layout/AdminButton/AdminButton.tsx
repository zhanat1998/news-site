'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './AdminButton.module.scss';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;

// IndexedDB'ден Sanity auth токенин алуу
async function getSanityAuthToken(): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      // Sanity auth маалыматтарын IndexedDB'де сактайт
      const request = indexedDB.open('sanity-auth', 1);

      request.onerror = () => resolve(null);

      request.onsuccess = () => {
        try {
          const db = request.result;
          if (!db.objectStoreNames.contains('tokens')) {
            resolve(null);
            return;
          }

          const transaction = db.transaction('tokens', 'readonly');
          const store = transaction.objectStore('tokens');
          const getRequest = store.get('token');

          getRequest.onsuccess = () => {
            const result = getRequest.result;
            resolve(result?.token || result?.accessToken || null);
          };

          getRequest.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      };

      request.onupgradeneeded = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

// localStorage'дон backup текшерүү
function getLocalStorageToken(): string | null {
  try {
    // Sanity ар кандай ключтарда сактоосу мүмкүн
    const keys = [
      `__sanity_${projectId}_authToken__`,
      'sanitySession',
      '@sanity/auth-token',
    ];

    for (const key of keys) {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          const parsed = JSON.parse(value);
          return parsed?.token || parsed?.accessToken || value;
        } catch {
          return value;
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

export default function AdminButton() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  async function checkAdminStatus() {
    try {
      // 1. SessionStorage текшерүү (Studio'го кирген болсо)
      const studioAuth = sessionStorage.getItem('sanity_studio_authenticated');
      if (studioAuth === 'true') {
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }

      // 2. IndexedDB'ден токен издөө
      let token = await getSanityAuthToken();

      // 3. localStorage'дон backup издөө
      if (!token) {
        token = getLocalStorageToken();
      }

      if (!token) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      // 4. API менен текшерүү
      const response = await fetch('/api/check-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      setIsAdmin(data.isAdmin);
    } catch {
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }

  // Жүктөлүп жатканда же админ эмес болсо - эч нерсе көрсөтпө
  if (isLoading || !isAdmin) {
    return null;
  }

  return (
    <Link href="/studio" className={styles.adminButton}>
      АДМИН
    </Link>
  );
}