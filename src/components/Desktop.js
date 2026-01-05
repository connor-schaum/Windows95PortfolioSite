'use client';

import { useState, useEffect } from 'react';

export default function Desktop({ icons, onIconDoubleClick, wallpaper = 'default', wallpaperUrl = null, iconPositions = {}, onIconPositionChange }) {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [draggedIcon, setDraggedIcon] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const getWallpaperStyle = () => {
    // If a custom wallpaper URL is provided, use it (highest priority)
    if (wallpaperUrl) {
      return {
        backgroundImage: `url(${wallpaperUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }

    // Default wallpapers (solid colors or patterns)
    const wallpapers = {
      default: {
        background: '#008080',
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.05) 2px,
            rgba(0,0,0,0.05) 4px
          )
        `
      },
      // Custom wallpapers (fallback if URL not set for some reason)
      logo: {
        backgroundImage: 'url(/wallpapers/Logo.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      },
      grassy: {
        backgroundImage: 'url(/wallpapers/Grassy.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    };

    return wallpapers[wallpaper] || wallpapers.default;
  };

  const handleIconMouseDown = (e, icon) => {
    e.stopPropagation();
    setSelectedIcon(icon.id);
    setDraggedIcon(icon.id);
    const iconElement = e.currentTarget;
    const rect = iconElement.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggedIcon) {
        const icon = icons.find(i => i.id === draggedIcon);
        if (icon) {
          const newPosition = {
            x: Math.max(10, Math.min(e.clientX - dragOffset.x, window.innerWidth - 90)),
            y: Math.max(10, Math.min(e.clientY - dragOffset.y, window.innerHeight - 100))
          };
          onIconPositionChange?.(icon.id, newPosition);
        }
      }
    };

    const handleMouseUp = () => {
      setDraggedIcon(null);
    };

    if (draggedIcon) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedIcon, dragOffset, icons, onIconPositionChange]);

  return (
    <div 
      className="fixed inset-0"
      style={getWallpaperStyle()}
      onClick={() => setSelectedIcon(null)}
    >
      {icons.map((icon) => {
        const position = iconPositions[icon.id] || icon.initialPosition || { x: 20, y: 20 };
        return (
          <div
            key={icon.id}
            className={`desktop-icon ${selectedIcon === icon.id ? 'selected' : ''}`}
            style={{
              position: 'absolute',
              left: `${position.x}px`,
              top: `${position.y}px`,
              cursor: draggedIcon === icon.id ? 'grabbing' : 'pointer'
            }}
            onMouseDown={(e) => handleIconMouseDown(e, icon)}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onIconDoubleClick(icon);
              setSelectedIcon(null);
            }}
          >
            <div className="text-4xl">{icon.icon}</div>
            <div className="desktop-icon-label">{icon.label}</div>
          </div>
        );
      })}
    </div>
  );
}

