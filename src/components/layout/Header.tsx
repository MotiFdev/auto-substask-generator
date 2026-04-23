import React from 'react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="max-w-4xl mx-auto px-4 py-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Performance Advertising LLC
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Auto Subtask Generator
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleTheme}
          className="p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:text-gray-900 hover:border-gray-300 transition-colors"
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2.25a.75.75 0 0 1 .75.75v1.386a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75Zm0 17.25a.75.75 0 0 1 .75.75v1.25a.75.75 0 0 1-1.5 0v-1.25a.75.75 0 0 1 .75-.75Zm9.75-7.5a.75.75 0 0 1-.75.75h-1.386a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75Zm-17.25 0a.75.75 0 0 1-.75.75H2.5a.75.75 0 0 1 0-1.5h1.25a.75.75 0 0 1 .75.75Zm13.257 6.007a.75.75 0 0 1 1.06 0l.884.884a.75.75 0 1 1-1.06 1.06l-.884-.883a.75.75 0 0 1 0-1.061ZM5.3 5.3a.75.75 0 0 1 1.06 0l.884.883A.75.75 0 0 1 6.18 7.244L5.3 6.36a.75.75 0 0 1 0-1.06Zm13.257-1.06a.75.75 0 0 1 0 1.06l-.884.884a.75.75 0 0 1-1.06-1.061l.883-.883a.75.75 0 0 1 1.061 0ZM7.245 17.672a.75.75 0 0 1 0 1.06l-.884.884a.75.75 0 0 1-1.06-1.06l.883-.884a.75.75 0 0 1 1.061 0ZM12 6.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.82A8.25 8.25 0 0 0 20.03 12.88a.75.75 0 0 1 .82.162.75.75 0 0 1 .164.825A9.75 9.75 0 1 1 8.703 1.554a.75.75 0 0 1 .825.164Z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;