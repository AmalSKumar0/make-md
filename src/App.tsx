/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import Landing from './components/Landing';
import EditorView from './components/EditorView';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSmoothScroll } from './hooks/useSmoothScroll';

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  useSmoothScroll(true);
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('makemd_dark_mode', false);
  
  // Loading Screen States
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [fadeLoader, setFadeLoader] = useState(false);

  // Dynamic loading messages
  const statusMessage = useMemo(() => {
    if (progress < 25) return 'Initializing application...';
    if (progress < 50) return 'Loading design system...';
    if (progress < 80) return 'Setting up compiler...';
    if (progress < 100) return 'Finalizing editor workspace...';
    return 'Ready!';
  }, [progress]);


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
          className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fcfaf5] dark:bg-[#0d1117] transition-all duration-500 ease-out overflow-hidden ${
            fadeLoader ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
          }`}
        >
          <div className="flex flex-col items-center max-w-xs w-full px-6 relative z-10">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-[#111] dark:text-white mb-6">
              make.amalskumar.dev
            </h2>
            
            {/* Sleek, minimal 2px progress bar */}
            <div className="w-32 h-[2px] bg-gray-200 dark:bg-[#30363d] rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-[#7485b6] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Dynamic status message */}
            <p className="mt-3 text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 text-center">
              {statusMessage}
            </p>
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
