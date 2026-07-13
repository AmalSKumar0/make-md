import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Sun, 
  Moon, 
  Download, 
  ChevronDown, 
  FileText, 
  FileCode, 
  Copy, 
  Check, 
  Printer, 
  Eye, 
  FileEdit, 
  Layout 
} from 'lucide-react';

interface EditorHeaderProps {
  onBack: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  activeTab: 'editor' | 'preview';
  onChangeActiveTab: (tab: 'editor' | 'preview') => void;
  layout: 'split' | 'editor' | 'preview';
  onChangeLayout: (layout: 'split' | 'editor' | 'preview') => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  filename: string;
  onChangeFilename: (name: string) => void;
  isFocusMode: boolean;
  isFullscreen: boolean;
  onOpenDownloadModal: () => void;
  onExport: (format: 'md' | 'html' | 'copy-html' | 'print') => void;
  copiedExport: boolean;
}

export default function EditorHeader({
  onBack,
  isSidebarOpen,
  onToggleSidebar,
  activeTab,
  onChangeActiveTab,
  layout,
  onChangeLayout,
  isDarkMode,
  onToggleTheme,
  filename,
  onChangeFilename,
  isFocusMode,
  isFullscreen,
  onOpenDownloadModal,
  onExport,
  copiedExport
}: EditorHeaderProps) {
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  return (
    <header className={`h-16 flex-shrink-0 flex justify-between items-center px-4 md:px-6 max-w-[1600px] mx-auto w-full relative transition-all duration-300 ${
      isFocusMode || isFullscreen ? 'opacity-0 h-0 overflow-hidden pointer-events-none' : 'opacity-100'
    }`}>
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={onBack}
          className="w-8 h-8 bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-gray-100 rounded-full flex items-center justify-center soft-shadow transition-all duration-300 hover:scale-110 active:scale-90 hover:shadow-md hover:-translate-y-0.5"
          title="Back to home"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Sidebar Toggle button on desktop */}
        <button
          onClick={onToggleSidebar}
          className={`hidden md:flex w-8 h-8 rounded-full items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 ${
            isSidebarOpen 
              ? 'bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-gray-100 soft-shadow' 
              : 'bg-gray-100 dark:bg-[#21262d] text-gray-500 dark:text-gray-400 hover:text-[#111] dark:hover:text-white border border-gray-200/40 dark:border-transparent'
          }`}
          title="Toggle Sidebar (Outline & Markdown)"
        >
          <BookOpen className="w-4 h-4" />
        </button>
        
        {/* Logo only on mobile */}
        <div className="flex sm:hidden items-center gap-2">
          <div className="w-5 h-5 bg-[#7485b6] rounded-full flex items-center justify-center text-white">
            <FileText className="w-3 h-3" />
          </div>
          <h1 className="text-base font-bold tracking-tight text-gray-800 dark:text-gray-200">Make.md</h1>
        </div>
      </div>
      
      {/* Mobile / Tablet Single Toggle Button - Context aware */}
      <div className={`flex md:hidden absolute left-1/2 -translate-x-1/2 top-[72px] z-40 transition-all duration-300 ${
        isFullscreen ? 'opacity-0 pointer-events-none scale-95 translate-y-2' : 'opacity-100'
      }`}>
        {activeTab === 'editor' ? (
          <button 
            className="bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-gray-100 px-4 h-8 rounded-full font-semibold text-xs soft-shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 hover:-translate-y-0.5"
            onClick={() => onChangeActiveTab('preview')}
          >
            <Eye className="w-3.5 h-3.5" /> Preview Mode
          </button>
        ) : (
          <button 
            className="bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-gray-100 px-4 h-8 rounded-full font-semibold text-xs soft-shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 hover:-translate-y-0.5"
            onClick={() => onChangeActiveTab('editor')}
          >
            <FileEdit className="w-3.5 h-3.5" /> Editor Mode
          </button>
        )}
      </div>

      {/* Layout controls on desktop */}
      <div className="hidden md:flex items-center gap-2">
        <button 
          onClick={() => onChangeLayout('split')}
          className={`h-8 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 hover:scale-105 active:scale-95 ${
            layout === 'split' 
              ? 'bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-gray-100' 
              : 'bg-gray-100 dark:bg-[#21262d] text-gray-500 dark:text-gray-400 hover:text-[#111] dark:hover:text-white'
          }`}
        >
          <Layout className="w-3.5 h-3.5" /> Split
        </button>
        <button 
          onClick={() => onChangeLayout('preview')}
          className={`h-8 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 hover:scale-105 active:scale-95 ${
            layout === 'preview' 
              ? 'bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-gray-100' 
              : 'bg-gray-100 dark:bg-[#21262d] text-gray-500 dark:text-gray-400 hover:text-[#111] dark:hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" /> Preview
        </button>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleTheme}
          className="w-8 h-8 bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-gray-100 rounded-full flex items-center justify-center soft-shadow transition-all duration-300 hover:scale-110 active:scale-90 hover:shadow-md hover:-translate-y-0.5"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* Mobile Download Button */}
        <button
          onClick={onOpenDownloadModal}
          className="sm:hidden w-8 h-8 bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-gray-100 rounded-full flex items-center justify-center soft-shadow transition-all duration-300 hover:scale-110 active:scale-90 hover:shadow-md"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        {/* Desktop Save & Export Dropdown */}
        <div className="hidden sm:flex items-center gap-2 relative">
          <div className="h-8 flex items-center bg-white dark:bg-[#161b22] rounded-full px-3 soft-shadow-sm border border-gray-100 dark:border-[#21262d]">
            <input 
              type="text" 
              value={filename}
              onChange={(e) => onChangeFilename(e.target.value)}
              placeholder="Filename"
              className="bg-transparent border-none outline-none text-xs font-medium text-gray-700 dark:text-gray-300 w-20 sm:w-24"
            />
            <span className="text-gray-400 text-xs font-medium">.md</span>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="h-8 px-4 rounded-full bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-gray-100 flex items-center gap-1.5 text-xs font-medium transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md hover:-translate-y-0.5"
            >
              <Download className="w-3 h-3" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
            </button>

            {showExportDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportDropdown(false)} />
                <div className="absolute top-10 right-0 w-48 bg-white dark:bg-[#161b22] rounded-2xl soft-shadow-lg border border-gray-100 dark:border-[#21262d] py-2 z-50 overflow-hidden animate-fade-in-up">
                  <button 
                    onClick={() => { onExport('md'); setShowExportDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5" /> Export Markdown (.md)
                  </button>
                  <button 
                    onClick={() => { onExport('html'); setShowExportDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors flex items-center gap-2"
                  >
                    <FileCode className="w-3.5 h-3.5" /> Export HTML (.html)
                  </button>
                  <button 
                    onClick={() => { onExport('copy-html'); setShowExportDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors flex items-center gap-2 justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Copy className="w-3.5 h-3.5" /> Copy HTML Render
                    </span>
                    {copiedExport && <Check className="w-3 h-3 text-green-500" />}
                  </button>
                  <button 
                    onClick={() => { onExport('print'); setShowExportDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors flex items-center gap-2"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print / Export PDF
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
