'use client';

import { useState, useEffect } from 'react';

export default function Window({ 
  id, 
  title, 
  children, 
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 600, height: 400 },
  onClose,
  onMinimize,
  isMinimized = false,
  isActive = false,
  onFocus,
  onPositionChange,
  onSizeChange
}) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [prevSize, setPrevSize] = useState(initialSize);
  const [prevPosition, setPrevPosition] = useState(initialPosition);

  // Update position when initialPosition changes
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition.x, initialPosition.y]);

  // Update size when initialSize changes
  useEffect(() => {
    setSize(initialSize);
  }, [initialSize.width, initialSize.height]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return;
    e.preventDefault();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    onFocus?.();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && !isMaximized) {
        const newPosition = {
          x: Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - size.width)),
          y: Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - size.height - 28))
        };
        setPosition(newPosition);
        onPositionChange?.(id, newPosition);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, isMaximized, size, position, id, onPositionChange]);

  const handleMaximize = () => {
    if (isMaximized) {
      setSize(prevSize);
      setPosition(prevPosition);
      setIsMaximized(false);
    } else {
      setPrevSize(size);
      setPrevPosition(position);
      setSize({ width: window.innerWidth - 4, height: window.innerHeight - 32 });
      setPosition({ x: 0, y: 0 });
      setIsMaximized(true);
    }
    onFocus?.();
  };

  if (isMinimized) {
    return null;
  }

  return (
    <div
      className="win95-window fixed z-40"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: isActive ? 50 : 40,
      }}
      onClick={onFocus}
    >
      <div
        className="win95-titlebar"
        onMouseDown={handleMouseDown}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
          <div className="window-controls flex gap-1 items-center" style={{ flexShrink: 0 }}>
            <button
              className="win95-button text-xs"
              onClick={onMinimize}
              title="Minimize"
              style={{ 
                minWidth: '16px', 
                height: '16px', 
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: '1'
              }}
            >
              _
            </button>
            <button
              className="win95-button text-xs"
              onClick={handleMaximize}
              title="Maximize"
              style={{ 
                minWidth: '16px', 
                height: '16px', 
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: '1'
              }}
            >
              □
            </button>
            <button
              className="win95-button text-xs"
              onClick={onClose}
              title="Close"
              style={{ 
                minWidth: '16px', 
                height: '16px', 
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: '1'
              }}
            >
              ×
            </button>
          </div>
        </div>
        <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-[#ffffff] border-b-[#ffffff] p-1 h-[calc(100%-22px)] overflow-auto">
          {children}
        </div>
      </div>
  );
}

