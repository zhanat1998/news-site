'use client';

import { useEffect, useState } from 'react';
import styles from './DateDisplay.module.scss';

export default function DateDisplay() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long',
      };
      const date = now.toLocaleDateString('ky-KG', options);
      const time = now.toLocaleTimeString('ky-KG', {
        hour: '2-digit',
        minute: '2-digit'
      });
      setCurrentTime(`${date}, Бишкек убактысы ${time}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.dateDisplay}>
      {currentTime}
    </div>
  );
}