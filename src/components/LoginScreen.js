'use client';

import { useState } from 'react';

export default function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (password === 'Connor!') {
      setIsLoading(true);
      // Simulate a brief loading delay for authenticity
      setTimeout(() => {
        setIsLoading(false);
        onLogin();
      }, 500);
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  const handleCancel = () => {
    setPassword('');
    setError('');
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        background: 'linear-gradient(135deg, #000080 0%, #0000aa 50%, #000080 100%)'
      }}
    >
      <div className="win95-window" style={{ width: '400px' }}>
        <div className="win95-titlebar">
          <span>Welcome to Windows</span>
        </div>
        <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-[#ffffff] border-b-[#ffffff] p-4">
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">🪟</div>
              <div>
                <div className="font-bold text-sm mb-1">Welcome to Windows</div>
                <div className="text-xs text-gray-600">Please enter your password to continue.</div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="block text-xs mb-1 font-semibold">
                User name:
              </label>
              <input
                type="text"
                value="Connor"
                readOnly
                className="w-full border-2 border-inset p-1 text-sm bg-white"
                style={{
                  border: '2px inset #c0c0c0',
                  padding: '2px 4px'
                }}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-xs mb-1 font-semibold">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full border-2 border-inset p-1 text-sm"
                style={{
                  border: '2px inset #c0c0c0',
                  padding: '2px 4px'
                }}
                placeholder="Enter password"
              />
              {error && (
                <div className="text-xs text-red-600 mt-1">{error}</div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="win95-button"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="win95-button"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'OK'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

