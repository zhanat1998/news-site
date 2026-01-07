'use client';

import { useEffect } from 'react';
import { NextStudio } from 'next-sanity/studio';
import type { Config } from 'sanity';

interface StudioWrapperProps {
  config: Config;
}

export default function StudioWrapper({ config }: StudioWrapperProps) {
  useEffect(() => {
    // Studio ийгиликтүү жүктөлдү - колдонуучу Sanity'ге кирген
    // Session storage'да белги коюу
    sessionStorage.setItem('sanity_studio_authenticated', 'true');
  }, []);

  return <NextStudio config={config} />;
}