import React, { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import SubtaskForm from './components/generator/SubtaskForm';
import GeneratedOutput from './components/generator/GeneratedOutput';
import type { SubtaskOutput } from './types/subtask.types';

type ThemeMode = 'light' | 'dark';

const App: React.FC = () => {
  const [generatedData, setGeneratedData] = useState<SubtaskOutput[] | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme') as ThemeMode | null;

    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const handleGenerate = (data: SubtaskOutput[]): void => {
    setGeneratedData(data);
  };

  const handleReset = (): void => {
    setGeneratedData(null);
  };

  const toggleTheme = (): void => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'theme-dark bg-slate-950 text-gray-100' : 'bg-white text-gray-900'}`}>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Generate Subtask
            </h2>
            {!generatedData ? (
              <SubtaskForm onGenerate={handleGenerate} />
            ) : (
              <GeneratedOutput data={generatedData} onReset={handleReset} />
            )}
          </div>
        </div>
      </main>
      <footer className="border-t border-gray-100 py-6 mt-8">
        <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
          <span>made with</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 text-red-500"
            aria-hidden="true"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>John Elylar Tan @2026</span>
        </p>
      </footer>
    </div>
  );
};

export default App;