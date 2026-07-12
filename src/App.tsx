/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Landing from './components/Landing';
import EditorView from './components/EditorView';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  const [view, setView] = useState<'landing' | 'editor'>('landing');
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('makemd_dark_mode', false);

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

  return (
    <>
      {view === 'landing' ? (
        <Landing onStart={() => setView('editor')} isDarkMode={isDarkMode} onToggleTheme={toggleDarkMode} />
      ) : (
        <EditorView onBack={() => setView('landing')} isDarkMode={isDarkMode} onToggleTheme={toggleDarkMode} />
      )}
    </>
  );
}
