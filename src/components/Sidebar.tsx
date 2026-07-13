import React from 'react';
import { X, BookOpen, HelpCircle } from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
  isFocusMode: boolean;
  isFullscreen: boolean;
  onClose: () => void;
  sidebarTab: 'outline' | 'cheatsheet';
  onSetSidebarTab: (tab: 'outline' | 'cheatsheet') => void;
  headers: Array<{ text: string; level: number; lineIndex: number }>;
  onHeaderClick: (headerText: string, lineIndex: number) => void;
  onCheatSheetClick: (syntaxType: string) => void;
}

export default function Sidebar({
  isSidebarOpen,
  isFocusMode,
  isFullscreen,
  onClose,
  sidebarTab,
  onSetSidebarTab,
  headers,
  onHeaderClick,
  onCheatSheetClick
}: SidebarProps) {
  if (!isSidebarOpen || isFocusMode || isFullscreen) return null;

  return (
    <>
      {/* Dimmed backdrop overlay for premium look & click-outside close */}
      <div 
        className="absolute inset-0 z-20 bg-black/10 dark:bg-black/35 backdrop-blur-[2px] print-hide transition-opacity duration-350" 
        onClick={onClose} 
      />
      <div className="absolute left-0 top-0 bottom-0 w-72 z-30 bg-white dark:bg-[#161b22] rounded-r-[32px] soft-shadow-xl flex flex-col overflow-hidden border-r border-gray-100 dark:border-[#21262d] animate-slide-in-left print-hide">
        {/* Sidebar Tabs & Close Button */}
        <div className="h-14 border-b border-gray-100 dark:border-[#21262d] flex items-center justify-between px-4 gap-2.5 flex-shrink-0">
          <div className="flex bg-gray-100 dark:bg-[#21262d] p-1 rounded-full flex-1">
            <button
              onClick={() => onSetSidebarTab('outline')}
              className={`flex-1 py-1 text-center rounded-full text-xs font-bold tracking-wide transition-all duration-350 ${
                sidebarTab === 'outline'
                  ? 'bg-white dark:bg-[#161b22] text-[#111] dark:text-white soft-shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-[#111] dark:hover:text-white'
              }`}
            >
              Outline
            </button>
            <button
              onClick={() => onSetSidebarTab('cheatsheet')}
              className={`flex-1 py-1 text-center rounded-full text-xs font-bold tracking-wide transition-all duration-350 ${
                sidebarTab === 'cheatsheet'
                  ? 'bg-white dark:bg-[#161b22] text-[#111] dark:text-white soft-shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-[#111] dark:hover:text-white'
              }`}
            >
              Reference
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-250 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 active:scale-95 flex-shrink-0"
            title="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-none" data-lenis-prevent="true">
          {sidebarTab === 'outline' ? (
            <div className="space-y-3">
              <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-550 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#7485b6]" /> Table of Contents
              </div>
              {headers.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-gray-500 italic text-center py-8">
                  Add headings (e.g. # Hello) to see the outline.
                </p>
              ) : (
                <div className="space-y-0.5">
                  {headers.map((h, i) => {
                    const indentPadding = [
                      'pl-0 font-bold text-gray-800 dark:text-gray-200 text-xs',
                      'pl-3 border-l border-gray-200 dark:border-gray-850 ml-1.5 text-gray-650 dark:text-gray-400 text-xs',
                      'pl-6 border-l border-gray-200 dark:border-gray-850 ml-1.5 text-gray-500 dark:text-gray-500 text-[11px]',
                      'pl-9 border-l border-gray-200 dark:border-gray-850 ml-1.5 text-gray-450 dark:text-gray-600 text-[11px]',
                      'pl-12 border-l border-gray-200 dark:border-gray-850 ml-1.5 text-gray-400 dark:text-gray-650 text-[10px]',
                      'pl-14 border-l border-gray-200 dark:border-gray-850 ml-1.5 text-gray-400 dark:text-gray-650 text-[10px]'
                    ];
                    const cls = indentPadding[Math.min(h.level - 1, 5)];
                    return (
                      <div key={i} className="py-0.5">
                        <button
                          onClick={() => {
                            onHeaderClick(h.text, h.lineIndex);
                          }}
                          className={`w-full text-left py-1 hover:text-[#7485b6] dark:hover:text-white hover:bg-[#fcf7e6] dark:hover:bg-gray-800 rounded-lg px-2 transition-all duration-200 block truncate ${cls}`}
                          title={h.text}
                        >
                          <span className="opacity-45 mr-1 text-[10px] font-semibold text-[#7485b6]">{'#'.repeat(h.level)}</span>
                          {h.text}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-550 mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#7485b6]" /> MD Quick Reference
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'Heading', syntax: '# title', type: 'heading', icon: 'H' },
                  { name: 'Bold', syntax: '**bold**', type: 'bold', icon: 'B' },
                  { name: 'Italic', syntax: '*italic*', type: 'italic', icon: 'I' },
                  { name: 'Link', syntax: '[text](url)', type: 'link', icon: '🔗' },
                  { name: 'Code Block', syntax: '```code```', type: 'code-block', icon: '💻' },
                  { name: 'Blockquote', syntax: '> quote', type: 'blockquote', icon: '“' },
                  { name: 'Bullet List', syntax: '- bullet', type: 'list-bullet', icon: '•' },
                  { name: 'Todo List', syntax: '- [ ] task', type: 'list-todo', icon: '☑' },
                  { name: 'Table', syntax: '| col | col |', type: 'table', icon: '田' },
                  { name: 'Image', syntax: '![alt](url)', type: 'image', icon: '🖼' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onCheatSheetClick(item.type)}
                    className="text-left p-2.5 bg-gray-50 dark:bg-[#21262d]/40 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 border border-gray-100 dark:border-transparent rounded-2xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 hover:shadow-sm flex flex-col justify-between h-[68px]"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                        {item.name}
                      </span>
                      <span className="text-xs opacity-50 font-mono">
                        {item.icon}
                      </span>
                    </div>
                    <code className="text-[9px] text-gray-400 dark:text-gray-555 font-mono block truncate w-full mt-1.5">
                      {item.syntax}
                    </code>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
