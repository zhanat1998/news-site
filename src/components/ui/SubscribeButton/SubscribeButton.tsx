'use client';

import { useState, useEffect } from 'react';
import styles from './SubscribeButton.module.scss';

export default function SubscribeButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      // Check if OneSignal is available
      if (typeof window !== 'undefined' && window.OneSignalDeferred) {
        window.OneSignalDeferred.push(async (OneSignal: any) => {
          const permission = await OneSignal.Notifications.permission;
          const isPushEnabled = await OneSignal.User.PushSubscription.optedIn;
          setIsSubscribed(permission && isPushEnabled);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);

      if (typeof window !== 'undefined' && window.OneSignalDeferred) {
        window.OneSignalDeferred.push(async (OneSignal: any) => {
          if (isSubscribed) {
            // Unsubscribe
            await OneSignal.User.PushSubscription.optOut();
            setIsSubscribed(false);
          } else {
            // Subscribe
            await OneSignal.Notifications.requestPermission();
            const permission = await OneSignal.Notifications.permission;
            if (permission) {
              await OneSignal.User.PushSubscription.optIn();
              setIsSubscribed(true);
            }
          }
          setIsLoading(false);
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setIsLoading(false);
    }
  };

  // Don't render if notifications aren't supported
  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading}
      className={`${styles.subscribeButton} ${isSubscribed ? styles.subscribed : ''}`}
      title={isSubscribed ? 'Подписканы өчүрүү' : 'Жаңылыктарга подписка болуу'}
    >
      <span className={styles.icon}>
        {isLoading ? (
          <svg className={styles.spinner} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
          </svg>
        ) : isSubscribed ? (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
            <circle cx="18" cy="8" r="4" fill="#22c55e"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
          </svg>
        )}
      </span>
      <span className={styles.text}>
        {isLoading ? '' : isSubscribed ? 'Подписка' : 'Подписка'}
      </span>
    </button>
  );
}

// Type declaration for OneSignal
declare global {
  interface Window {
    OneSignalDeferred?: any[];
  }
}
