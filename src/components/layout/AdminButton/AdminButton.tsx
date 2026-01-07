'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './AdminButton.module.scss';

export default function AdminButton() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminStatus = useCallback(() => {
    // SessionStorage текшерүү (Studio'го кирген болсо)
    const studioAuth = sessionStorage.getItem('sanity_studio_authenticated');
    if (studioAuth === 'true') {
      setIsAdmin(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAdminStatus();

    // Custom event тыңшоо - Studio'дон auth болгондо
    const handleAdminAuth = () => {
      setIsAdmin(true);
      setIsLoading(false);
    };

    window.addEventListener('sanity-admin-authenticated', handleAdminAuth);

    return () => {
      window.removeEventListener('sanity-admin-authenticated', handleAdminAuth);
    };
  }, [checkAdminStatus]);

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