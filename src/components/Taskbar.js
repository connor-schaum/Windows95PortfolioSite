'use client';

import { useState, useEffect } from 'react';

export default function Taskbar({ 
  openWindows, 
  onWindowClick, 
  activeWindowId,
  onStartMenuToggle,
  isStartMenuOpen,
  timeFormat = '24h'
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    if (timeFormat === '12h') {
      return currentTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return currentTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
  };

  return (
    <div className="win95-taskbar fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between">
      <button
        className="win95-start-button"
        onClick={onStartMenuToggle}
      >
        <span className="mr-1">Start</span>
      </button>
      <div className="flex-1 flex gap-1 ml-2 overflow-x-auto">
        {openWindows.map((window) => (
          <button
            key={window.id}
            className={`win95-button px-2 h-[22px] whitespace-nowrap ${
              activeWindowId === window.id ? 'border-2 inset' : ''
            }`}
            onClick={() => onWindowClick(window.id)}
          >
            {window.title}
          </button>
        ))}
      </div>
      <div className="win95-time-tray">
        {formatTime()}
      </div>
    </div>
  );
}

