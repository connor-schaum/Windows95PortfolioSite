'use client';

import { useState } from 'react';

export default function FileExplorer({ path, files, onNavigate, onFileClick }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDoubleClick = (item) => {
    if (item.type === 'folder') {
      onNavigate(item.path);
    } else {
      onFileClick?.(item);
    }
  };

  const handleUp = () => {
    if (!path) return; // Already at root
    const parts = path.split('\\').filter(Boolean);
    if (parts.length > 0) {
      parts.pop();
      const newPath = parts.length > 0 ? parts.join('\\') : '';
      onNavigate(newPath);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 p-2 border-b border-gray-400">
        <button className="win95-button" onClick={handleUp}>
          ↑ Up
        </button>
        <div className="flex-1 bg-white border border-inset p-1 text-xs">
          {path || 'Desktop'}
        </div>
      </div>
      <div className="flex-1 file-list overflow-auto">
        {path && path.length > 0 && (
          <div
            className="file-item"
            onDoubleClick={handleUp}
            onClick={() => setSelectedItem('..')}
          >
            <span>📁</span>
            <span>..</span>
          </div>
        )}
        {files && files.length > 0 ? (
          files.map((file) => (
            <div
              key={file.path}
              className={`file-item ${selectedItem === file.path ? 'selected' : ''}`}
              onClick={() => setSelectedItem(file.path)}
              onDoubleClick={() => handleDoubleClick(file)}
            >
              <span>{file.icon || (file.type === 'folder' ? '📁' : '📄')}</span>
              <span>{file.name}</span>
            </div>
          ))
        ) : (
          <div className="p-4 text-xs text-gray-500 text-center">
            This folder is empty
          </div>
        )}
      </div>
    </div>
  );
}

