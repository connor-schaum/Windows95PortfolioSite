'use client';

import { useState, useEffect } from 'react';

const defaultSettings = {
  fontSize: 12,
  timeFormat: '24h', // '12h' or '24h'
  wallpaper: 'default',
  wallpaperUrl: null
};

export function useSettings() {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('win95-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('win95-settings', JSON.stringify(newSettings));
  };

  return [settings, updateSettings];
}

