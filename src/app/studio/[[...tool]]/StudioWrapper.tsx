'use client';

import { useEffect, useRef } from 'react';
import { NextStudio } from 'next-sanity/studio';
import type { Config } from 'sanity';
import './studio.css';

interface StudioWrapperProps {
  config: Config;
}

export default function StudioWrapper({ config }: StudioWrapperProps) {
  const hasAuthenticated = useRef(false);

  useEffect(() => {
    // Sanity Studio DOM'до пайда болгонун текшерүү
    // Login экраны эмес, чыныгы studio жүктөлгөндө
    const checkAuth = () => {
      // Sanity Studio authenticated болгондо бул элементтер пайда болот
      const studioNavbar = document.querySelector('[data-testid="studio-navbar"]');
      const studioLayout = document.querySelector('[data-ui="Navbar"]');
      const paneHeader = document.querySelector('[data-ui="PaneHeader"]');

      if ((studioNavbar || studioLayout || paneHeader) && !hasAuthenticated.current) {
        hasAuthenticated.current = true;
        sessionStorage.setItem('sanity_studio_authenticated', 'true');
        window.dispatchEvent(new CustomEvent('sanity-admin-authenticated'));
      }
    };

    // Дароо текшерүү
    checkAuth();

    // DOM өзгөрүүлөрүн байкоо
    const observer = new MutationObserver(() => {
      checkAuth();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return <NextStudio config={config} />;
}