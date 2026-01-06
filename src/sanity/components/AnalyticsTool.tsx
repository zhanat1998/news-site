'use client'

import { useEffect } from 'react'

export function AnalyticsTool() {
  useEffect(() => {
    // Автоматтык түрдө аналитика барагына өтүү
    window.location.href = '/stats-x7k9m2p4q8'
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: '1.1rem', color: '#666' }}>
        Аналитика барагына өтүүдө...
      </p>
    </div>
  )
}