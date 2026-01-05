'use client';

import { useState, useEffect } from 'react';
import Desktop from '@/components/Desktop';
import Window from '@/components/Window';
import Taskbar from '@/components/Taskbar';
import FileExplorer from '@/components/FileExplorer';
import StartMenu from '@/components/StartMenu';
import LoginScreen from '@/components/LoginScreen';
import Settings from '@/components/Settings';
import InternetExplorer from '@/components/InternetExplorer';
import MSPaint from '@/components/MSPaint';
import { useSettings } from '@/hooks/useSettings';
import FileViewer from '@/components/FileViewer';

export default function Home() {
  const [settings, updateSettings] = useSettings();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [windowCounter, setWindowCounter] = useState(0);
  const [fileSystem, setFileSystem] = useState({
    '': [
      { name: 'My Computer', type: 'folder', path: 'My Computer', icon: '💻' }
    ],
    'My Computer': [
      { name: 'Local Disk (C:)', type: 'folder', path: 'My Computer\\Local Disk (C:)', icon: '💾' }
    ],
    'My Computer\\Local Disk (C:)': [
      { name: 'Users', type: 'folder', path: 'My Computer\\Local Disk (C:)\\Users', icon: '👥' }
    ],
    'My Computer\\Local Disk (C:)\\Users': [
      { name: 'Connor', type: 'folder', path: 'My Computer\\Local Disk (C:)\\Users\\Connor', icon: '👤' }
    ],
    'My Computer\\Local Disk (C:)\\Users\\Connor': []
  });

  // Load file structure on mount
  useEffect(() => {
    fetch('/file-structure.json')
      .then(res => res.json())
      .then(data => {
        setFileSystem(data);
      })
      .catch(err => {
        console.error('Failed to load file structure:', err);
        // Keep the default empty structure
      });
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${settings.fontSize}px`;
  }, [settings.fontSize]);

  function getFilesForPath(path) {
    return fileSystem[path] || [];
  }

  const [iconPositions, setIconPositions] = useState({
    'my-computer': { x: 20, y: 20 },
    'internet-explorer': { x: 20, y: 120 },
    'mspaint': { x: 20, y: 220 }
  });

  const desktopIcons = [
    { id: 'my-computer', label: 'My Computer', icon: '💻', path: 'My Computer' },
    { id: 'internet-explorer', label: 'Internet Explorer', icon: '🌐', app: 'internet-explorer' },
    { id: 'mspaint', label: 'Paint', icon: '🎨', app: 'mspaint' }
  ];

  const handleIconPositionChange = (iconId, newPosition) => {
    setIconPositions(prev => ({
      ...prev,
      [iconId]: newPosition
    }));
  };

  const openWindow = (title, content, initialPath = null) => {
    const id = `window-${windowCounter}`;
    const newWindow = {
      id,
      title,
      content,
      path: initialPath,
      isMinimized: false,
      position: { x: 100 + (openWindows.length * 30), y: 100 + (openWindows.length * 30) },
      size: { width: 600, height: 400 }
    };
    setOpenWindows([...openWindows, newWindow]);
    setActiveWindowId(id);
    setWindowCounter(windowCounter + 1);
    return id;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsStartMenuOpen(false);
  };

  const handleWindowPositionChange = (windowId, newPosition) => {
    setOpenWindows(openWindows.map(w => 
      w.id === windowId ? { ...w, position: newPosition } : w
    ));
  };

  const handleWindowSizeChange = (windowId, newSize) => {
    setOpenWindows(openWindows.map(w => 
      w.id === windowId ? { ...w, size: newSize } : w
    ));
  };

  const closeWindow = (id) => {
    setOpenWindows(openWindows.filter(w => w.id !== id));
    if (activeWindowId === id) {
      const remaining = openWindows.filter(w => w.id !== id);
      setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  const minimizeWindow = (id) => {
    setOpenWindows(openWindows.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
    if (activeWindowId === id) {
      const remaining = openWindows.filter(w => w.id !== id);
      setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  const restoreWindow = (id) => {
    setOpenWindows(openWindows.map(w => 
      w.id === id ? { ...w, isMinimized: false } : w
    ));
    setActiveWindowId(id);
  };

  const handleNavigate = (windowId, newPath) => {
    setOpenWindows(openWindows.map(w => 
      w.id === windowId 
        ? { ...w, path: newPath }
        : w
    ));
  };

  const handleIconDoubleClick = (icon) => {
    if (icon.path) {
      openWindow(icon.label, null, icon.path);
    } else if (icon.app === 'internet-explorer') {
      // Check if Internet Explorer is already open
      const existingIE = openWindows.find(w => w.id === 'internet-explorer');
      if (existingIE) {
        setActiveWindowId('internet-explorer');
        if (existingIE.isMinimized) {
          restoreWindow('internet-explorer');
        }
      } else {
        openWindow(
          'Internet Explorer',
          <InternetExplorer />,
          null
        );
        // Set the ID manually so we can find it later
        setOpenWindows(prev => prev.map((w, idx) => 
          idx === prev.length - 1 ? { ...w, id: 'internet-explorer' } : w
        ));
      }
    } else if (icon.app === 'mspaint') {
      // Check if Paint is already open
      const existingPaint = openWindows.find(w => w.id === 'mspaint');
      if (existingPaint) {
        setActiveWindowId('mspaint');
        if (existingPaint.isMinimized) {
          restoreWindow('mspaint');
        }
      } else {
        openWindow(
          'Paint - Untitled',
          <MSPaint />,
          null
        );
        // Set the ID manually so we can find it later
        setOpenWindows(prev => prev.map((w, idx) => 
          idx === prev.length - 1 ? { ...w, id: 'mspaint' } : w
        ));
      }
    }
  };

  const handleFileClick = (file) => {
    if (!file.url) return;

    const fileType = file.name.split('.').pop().toLowerCase();

    if (fileType === 'pdf') {
      window.open(file.url, '_blank');
    } else if (['txt', 'md', 'png', 'jpg', 'jpeg', 'gif'].includes(fileType)) {
      openWindow(file.name, <FileViewer file={file} />);
    } else {
      // For other files, offer to download
      const link = document.createElement('a');
      link.href = file.url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  const openDocuments = () => {
    // Open directly to Connor folder
    openWindow('Connor', null, 'My Computer\\Local Disk (C:)\\Users\\Connor');
    setIsStartMenuOpen(false);
  };
  const openSettings = () => {
    // Check if settings window is already open
    const existingSettings = openWindows.find(w => w.id === 'settings-window');
    if (existingSettings) {
      setActiveWindowId('settings-window');
      if (existingSettings.isMinimized) {
        restoreWindow('settings-window');
      }
    } else {
      openWindow(
        'Settings',
        <Settings settings={settings} onSettingsChange={updateSettings} />,
        null
      );
      // Set the ID manually so we can find it later
      setOpenWindows(prev => prev.map((w, idx) => 
        idx === prev.length - 1 ? { ...w, id: 'settings-window' } : w
      ));
    }
    setIsStartMenuOpen(false);
  };


  const startMenuItems = [
    { label: 'Programs', icon: '📂', onClick: () => {} },
    { label: 'Documents', icon: '📄', onClick: openDocuments },
    { label: 'Settings', icon: '⚙️', onClick: openSettings },
    { label: 'Find', icon: '🔍', onClick: () => {} },
    { label: 'Help', icon: '❓', onClick: () => {} },
    { label: 'Run...', icon: '▶️', onClick: () => {} },
    { label: 'Shut Down...', icon: '⏻', onClick: handleLogout }
  ];

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Desktop 
        icons={desktopIcons}
        onIconDoubleClick={handleIconDoubleClick}
        wallpaper={settings.wallpaper}
        wallpaperUrl={settings.wallpaperUrl}
        iconPositions={iconPositions}
        onIconPositionChange={handleIconPositionChange}
      />
      
      {openWindows.map((window) => {
        const currentPath = window.path !== null ? window.path : '';
        // Get the last part of the path for the title, or use the original title
        const pathParts = currentPath.split('\\').filter(Boolean);
        const displayTitle = pathParts.length > 0 ? pathParts[pathParts.length - 1] : window.title;
        return (
          <Window
            key={window.id}
            id={window.id}
            title={displayTitle}
            isActive={activeWindowId === window.id}
            isMinimized={window.isMinimized}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onFocus={() => setActiveWindowId(window.id)}
            initialPosition={window.position || { x: 100 + (openWindows.indexOf(window) * 30), y: 100 + (openWindows.indexOf(window) * 30) }}
            initialSize={window.size || { width: 600, height: 400 }}
            onPositionChange={handleWindowPositionChange}
            onSizeChange={handleWindowSizeChange}
          >
            {window.path !== null && (
              <FileExplorer 
                path={window.path}
                files={getFilesForPath(window.path)}
                onNavigate={(newPath) => handleNavigate(window.id, newPath)}
                onFileClick={handleFileClick}
              />
            )}
            {window.content}
          </Window>
        );
      })}

      <Taskbar
        openWindows={openWindows}
        activeWindowId={activeWindowId}
        onWindowClick={(id) => {
          const window = openWindows.find(w => w.id === id);
          if (window?.isMinimized) {
            restoreWindow(id);
          } else {
            setActiveWindowId(id);
          }
        }}
        onStartMenuToggle={() => setIsStartMenuOpen(!isStartMenuOpen)}
        isStartMenuOpen={isStartMenuOpen}
        timeFormat={settings.timeFormat}
      />

      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        menuItems={startMenuItems}
      />
    </div>
  );
}
