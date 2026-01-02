'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '50px 40px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#fff3cd',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '40px',
        }}>
          ⚠️
        </div>
        <h1 style={{
          fontSize: 'clamp(22px, 5vw, 28px)',
          fontWeight: '700',
          color: '#1a1a1a',
          margin: '0 0 12px',
        }}>
          Ката чыкты
        </h1>
        <p style={{
          fontSize: 'clamp(14px, 3vw, 16px)',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6',
        }}>
          Бир нерсе туура эмес болуп кетти. Кайра аракет кылып көрүңүз.
        </p>
        <div style={{
          display: 'flex',
          gap: '12px',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <button
            onClick={() => reset()}
            style={{
              width: '100%',
              maxWidth: '280px',
              padding: '14px 30px',
              backgroundColor: '#0033a0',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 51, 160, 0.3)',
            }}
          >
            Кайра аракет кылуу
          </button>
          <Link
            href="/"
            style={{
              width: '100%',
              maxWidth: '280px',
              padding: '14px 30px',
              backgroundColor: '#f0f0f0',
              color: '#1a1a1a',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '15px',
              display: 'block',
              boxSizing: 'border-box',
            }}
          >
            Башкы бетке кайтуу
          </Link>
        </div>
      </div>
    </div>
  );
}