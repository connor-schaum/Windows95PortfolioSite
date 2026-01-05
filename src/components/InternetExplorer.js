'use client';

import { useState, useEffect } from 'react';

export default function InternetExplorer() {
  const [url, setUrl] = useState('https://www.wikipedia.org');
  const [currentUrl, setCurrentUrl] = useState('https://www.wikipedia.org');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatUrl = (inputUrl) => {
    let formatted = inputUrl.trim();
    if (!formatted.match(/^https?:\/\//i)) {
      formatted = 'https://' + formatted;
    }
    return formatted;
  };

  const handleGo = () => {
    try {
      const formattedUrl = formatUrl(url);
      setError(null);
      setIsLoading(true);
      setCurrentUrl(formattedUrl);
      setUrl(formattedUrl);
    } catch (err) {
      setError('Invalid URL');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUrl && currentUrl !== url) {
      setUrl(currentUrl);
    }
  }, [currentUrl]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGo();
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load page. The website may block iframe embedding.');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    // Force reload by updating the key
    setCurrentUrl(prev => prev + '?t=' + Date.now());
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleHome = () => {
    setUrl('https://www.wikipedia.org');
    setCurrentUrl('https://www.wikipedia.org');
    setError(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1 border-b border-gray-400 bg-gray-200">
        <button className="win95-button px-2 py-1 text-xs" title="Back" disabled>←</button>
        <button className="win95-button px-2 py-1 text-xs" title="Forward" disabled>→</button>
        <button className="win95-button px-2 py-1 text-xs" title="Stop" onClick={() => setIsLoading(false)}>■</button>
        <button className="win95-button px-2 py-1 text-xs" title="Refresh" onClick={handleRefresh}>↻</button>
        <button className="win95-button px-2 py-1 text-xs" title="Home" onClick={handleHome}>⌂</button>
        <div className="flex-1 flex items-center gap-1 ml-2">
          <span className="text-xs">Address:</span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-2 border-inset p-1 text-xs"
            style={{
              border: '2px inset #c0c0c0',
              padding: '2px 4px'
            }}
          />
          <button 
            className="win95-button px-2 py-1 text-xs"
            onClick={handleGo}
          >
            Go
          </button>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 border-2 border-t-[#808080] border-l-[#808080] border-r-[#ffffff] border-b-[#ffffff] overflow-hidden bg-white relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center">
              <div className="text-sm mb-2">Loading...</div>
              <div className="text-xs text-gray-600">{currentUrl}</div>
            </div>
          </div>
        )}
        {error ? (
          <div className="h-full flex items-center justify-center bg-white">
            <div className="text-center p-4">
              <div className="text-sm mb-2 text-red-600">{error}</div>
              <div className="text-xs text-gray-600 mb-4">{currentUrl}</div>
              <button className="win95-button" onClick={() => window.open(currentUrl, '_blank')}>
                Open in New Tab
              </button>
            </div>
          </div>
        ) : (
          <iframe
            key={currentUrl}
            src={currentUrl}
            className="w-full h-full border-0"
            title="Internet Explorer"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        )}
      </div>
    </div>
  );
}

