'use client';

import { useEffect, useState } from 'react';
import styles from './DateDisplay.module.scss';

export default function DateDisplay() {
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const date = now.toLocaleDateString('ky-KG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long',
      });

      const time = now.toLocaleTimeString('ky-KG', {
        hour: '2-digit',
        minute: '2-digit'
      });

      setDateStr(date);
      setTimeStr(time);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.dateDisplay}>
      <span className={styles.weekday}>{dateStr.split(',')[0]}, </span>
      {dateStr.split(',')[1]?.trim()},
      <span className={styles.location}> Бишкек</span>
      <span className={styles.ubakyt}> убактысы</span>
      <span className={styles.time}> {timeStr}</span>
    </div>
  );
}