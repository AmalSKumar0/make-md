/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import EditorView from './components/EditorView';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('makemd_dark_mode', false);
  
  // Loading Screen States
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [fadeLoader, setFadeLoader] = useState(false);

  useEffect(() => {
    // Router popstate listener
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // Simulated progressive loader
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.floor(Math.random() * 20) + 10;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 70);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const fadeTimeout = setTimeout(() => {
        setFadeLoader(true);
      }, 200);
      const removeTimeout = setTimeout(() => {
        setShowLoader(false);
      }, 700);
      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(removeTimeout);
      };
    }
  }, [progress]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navigate = (to: string) => {
    window.history.pushState({}, '', to);
    setPath(to);
  };

  const isEditorView = path.startsWith('/editor');

  return (
    <>
      {/* High-Fidelity Loading Screen */}
      {showLoader && (
        <div 
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fcfaf5] dark:bg-[#0d1117] transition-all duration-500 ease-out ${
            fadeLoader ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
          }`}
        >
          <div className="flex flex-col items-center max-w-xs w-full px-6">
            <div className="w-16 h-16 bg-white dark:bg-[#161b22] border border-gray-200/50 dark:border-[#30363d]/50 rounded-[22px] flex items-center justify-center soft-shadow-lg mb-6 animate-pulse">
              <svg className="w-8 h-8 text-[#7485b6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="font-serif text-3xl font-semibold tracking-tight text-[#111] dark:text-white mb-2">
              Make.md
            </h2>
            <p className="text-gray-400 dark:text-gray-500 text-[10px] tracking-wider uppercase mb-8 font-medium">
              Elegant Markdown Editor
            </p>
            <div className="w-40 h-[3px] bg-gray-200 dark:bg-[#30363d] rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-[#7485b6] rounded-full transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Pages Router */}
      {isEditorView ? (
        <EditorView onBack={() => navigate('/')} isDarkMode={isDarkMode} onToggleTheme={toggleDarkMode} />
      ) : (
        <Landing onStart={() => navigate('/editor')} isDarkMode={isDarkMode} onToggleTheme={toggleDarkMode} />
      )}
    </>
  );
}
