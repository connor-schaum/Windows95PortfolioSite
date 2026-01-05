'use client';

import { useState, useEffect } from 'react';

export default function Settings({ settings, onSettingsChange }) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [wallpapers, setWallpapers] = useState([]);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    // Load available wallpapers - only the ones that exist in the folder
    const availableWallpapers = [
      { name: 'Default (Teal)', value: 'default', url: null },
      { name: 'Logo', value: 'logo', url: '/wallpapers/Logo.jpg' },
      { name: 'Grassy', value: 'grassy', url: '/wallpapers/Grassy.jpg' },
    ];

    setWallpapers(availableWallpapers);
  }, []);
  
  const handleFontSizeChange = (size) => {
    const newSettings = { ...localSettings, fontSize: size };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings); 
  };

  const handleTimeFormatChange = (format) => {
    const newSettings = { ...localSettings, timeFormat: format };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleWallpaperChange = (wallpaper) => {
    const newSettings = { ...localSettings, wallpaper: wallpaper.value, wallpaperUrl: wallpaper.url };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="h-full p-4 overflow-auto">
      <div className="space-y-6">
      <div>
          <h3 className="text-sm font-bold mb-2">Font Size</h3>
          <div className="flex gap-2">
            {[10, 11, 12, 14, 16].map((size) => (
              <button
                key={size}
                className={`win95-button px-3 py-1 ${
                  localSettings.fontSize === size ? 'border-2 inset' : ''
                }`}
                onClick={() => handleFontSizeChange(size)}
              >
                {size}px
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold mb-2">Time Format</h3>
          <div className="flex gap-2">
            <button
              className={`win95-button px-3 py-1 ${
                localSettings.timeFormat === '12h' ? 'border-2 inset' : ''
              }`}
              onClick={() => handleTimeFormatChange('12h')}
            >
              12 Hour (Normal)
            </button>
            <button
              className={`win95-button px-3 py-1 ${
                localSettings.timeFormat === '24h' ? 'border-2 inset' : ''
              }`}
              onClick={() => handleTimeFormatChange('24h')}
            >
              24 Hour (Military)
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold mb-2">Wallpaper</h3>
          <div className="space-y-2">
            {wallpapers.map((wallpaper) => (
              <div
                key={wallpaper.value}
                className={`p-2 border-2 ${
                  localSettings.wallpaper === wallpaper.value
                    ? 'border-inset bg-gray-200'
                    : 'border-outset bg-white'
                } cursor-pointer hover:bg-gray-100`}
                onClick={() => handleWallpaperChange(wallpaper)}
                style={{
                  border: localSettings.wallpaper === wallpaper.value
                    ? '2px inset #c0c0c0'
                    : '2px outset #c0c0c0'
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-16 h-12 border border-gray-400"
                    style={{
                      background: wallpaper.url
                        ? `url(${wallpaper.url})`
                        : wallpaper.value === 'default' 
                        ? '#008080'
                        : '#008080',
                      backgroundSize: wallpaper.url ? 'cover' : 'auto',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                  <span className="text-xs">{wallpaper.name}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Add wallpapers to <code>public/wallpapers/</code> folder
          </div>
        </div>
      </div>
    </div>
  );
}

