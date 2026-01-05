'use client';

import { useState, useEffect } from 'react';

export default function FileViewer({ file }) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!file || !file.url) return;

    const fileType = file.name.split('.').pop().toLowerCase();
    
    if (['txt', 'md'].includes(fileType)) {
      fetch(file.url)
        .then(res => res.text())
        .then(text => {
          setContent(text);
          setIsLoading(false);
        })
        .catch(() => {
          setContent('Error loading file.');
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [file]);

  const fileType = file.name.split('.').pop().toLowerCase();
  
  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }
  
  if (['png', 'jpg', 'jpeg', 'gif'].includes(fileType)) {
    return (
      <div className="p-4 flex items-center justify-center h-full">
        <img src={file.url} alt={file.name} className="max-w-full max-h-full" />
      </div>
    );
  }

  if (['txt', 'md'].includes(fileType)) {
    return (
      <div className="p-4 whitespace-pre-wrap font-mono text-xs">
        {content}
      </div>
    );
  }

  // Fallback for other file types
  return (
    <div className="p-4">
      <p>Cannot preview this file type.</p>
      <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        Download {file.name}
      </a>
    </div>
  );
}