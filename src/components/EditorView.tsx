import { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, Download, Eye, FileEdit, Info, Upload, FileText, ChevronDown, Layout, Bold, Italic, Heading, Quote, Code, List, ListOrdered, Link, Maximize2, Minimize2, Moon, Sun } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';
import MarkdownPreview from './MarkdownPreview';

interface EditorViewProps {
  onBack: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const DEFAULT_MARKDOWN = `# Welcome to Make.md

A **soft UI**, distraction-free markdown editor.

## Features
- Real-time preview
- Soft syntax highlighting
- One-click download
- Character & word count
- Drag and drop .md file import

> "Good design is making something intelligible and memorable. Great design is making something memorable and meaningful."

### Code Example
\`\`\`javascript
function greet() {
  console.log("Hello, soft UI world!");
}
greet();
\`\`\`

| Feature | Support |
|---------|---------|
| Markdown| Yes     |
| GFM     | Yes     |
`;

const TEMPLATES = {
  readme: `# Project Name

A concise and beautiful description of what this project does.

## Installation

\`\`\`bash
npm install make-md
\`\`\`

## Usage

\`\`\`javascript
import { makeMd } from 'make-md';

// Start writing beautifully
makeMd();
\`\`\`

## Features
- Real-time preview
- Soft UI aesthetic
- Drag and drop import
`,
  meeting: `# Meeting Notes: [Topic]

**Date:** ${new Date().toLocaleDateString()}
**Attendees:** Person A, Person B, Person C

## Agenda
1. Update on current milestone
2. Review of the new design specs
3. Next steps

## Discussion Summary
- Key point 1 discussed during the meeting.
- Key point 2 discussed during the meeting.

## Action Items
- [ ] **@PersonA** - Implement the sidebar updates
- [ ] **@PersonB** - Write test suites
- [ ] **@PersonC** - Deploy to staging
`,
  changelog: `# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - ${new Date().toLocaleDateString()}

### Added
- Beautiful plain beige background (#fcf7e6)
- Drag and drop .md file import support
- Character and word live counters
- Multi-layout selection (Split / Write / Preview)

### Changed
- Improved syntax highlighting contrast
- Upgraded file rename bar interaction
`,
  journal: `# Daily Log // ${new Date().toLocaleDateString()}

**Mood:** Calm & Focused 
**Today's Goals:**
- [ ] Draft the product specification
- [ ] Design the neumorphic UI states

## Morning Reflection
Today feels like a great day to build beautiful software. Let's start with a clean slate.

## Progress Notes
- Drafted the core modules
- Styled the code viewer
`,
  blog: `# Title of Your Blog Post

*Published on ${new Date().toLocaleDateString()} by [Your Name]*

![Banner Image](https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80)

## Introduction
Start with an engaging hook. Introduce the main topic and what the reader will learn or gain from reading this article. Keep it clear, concise, and interesting.

## The Core Problem
Explain why this topic matters. Discuss the challenges or questions that developers, writers, or creators face in this area.

> "A quote or highlighted statement adds great visual break and authority to your blog layout."

## Actionable Solutions
Provide concrete steps, tips, or guidelines.

1. **Step One:** Detail the first action.
2. **Step Two:** Elaborate on the second action.
3. **Step Three:** Wrap it up with the final step.

### Code Demonstration
If you have a code snippet, place it here:

\`\`\`typescript
const logMessage = (msg: string): void => {
  console.log(\`[Blog] \${msg}\`);
};
\`\`\`

## Conclusion
Summarize the key takeaways and encourage reader engagement. Ask a question or provide a Call to Action (CTA)!
`,
  docs: `# API & Feature Documentation

Welcome to the official developer documentation. This reference guide describes the setup, configuration, and interface details.

## Quick Start

### 1. Installation
Install the package using your favorite package manager:

\`\`\`bash
npm install make-md-sdk
\`\`\`

### 2. Initialization
Initialize the library in your entry file:

\`\`\`typescript
import { Editor } from 'make-md-sdk';

const editor = new Editor({
  element: '#editor-container',
  theme: 'beige'
});
\`\`\`

---

## Configuration Reference

The constructor accepts a \`Config\` configuration object:

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| \`element\` | \`string\` | \`undefined\` | The CSS selector target |
| \`theme\` | \`'beige' \\| 'dark'\` | \`'beige'\` | Visual theme interface |
| \`autoSave\` | \`boolean\` | \`true\` | Keep state in localStorage |

---

## Error Handling

All methods return a \`Promise\` and throw standard errors if parameters are incorrect.

\`\`\`javascript
try {
  await editor.save();
} catch (error) {
  console.error("Failed to save content:", error.message);
}
\`\`\`
`,
  tasks: `# Project Roadmap & Tasks

Use this dashboard to track milestones, tasks, and feature progress.

## 🚀 Active Sprint
- [x] Integrate localStorage auto-save hook
- [x] Refine beige plain background (#fcf7e6)
- [ ] Add Blog Post, Documentation, and Task List skeletons
- [ ] Implement dark/light theme switchers

## 📅 Backlog
- [ ] Drag and drop preview sizing
- [ ] Export to PDF / HTML formatters
- [ ] Collaborative real-time cursor syncing

## 🛠️ Code Maintenance
- [x] Run linter validation rules
- [ ] Refactor Prism token highlights
- [ ] Add end-to-end testing coverage
`
};

export default function EditorView({ onBack, isDarkMode, onToggleTheme }: EditorViewProps) {
  const [content, setContent] = useLocalStorage<string>('makemd_editor_content', DEFAULT_MARKDOWN);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor'); // For mobile
  const [layout, setLayout] = useLocalStorage<'split' | 'editor' | 'preview'>('makemd_editor_layout', 'split'); // For desktop
  const [filename, setFilename] = useLocalStorage<string>('makemd_editor_filename', 'untitled');
  const [showTemplates, setShowTemplates] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const insertFormatting = (type: 'bold' | 'italic' | 'link' | 'bullet' | 'number' | 'heading' | 'quote' | 'code') => {
    const textarea = editorContainerRef.current?.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    let selectionOffsetStart = 0;
    let selectionOffsetEnd = 0;

    switch (type) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        selectionOffsetStart = 2;
        selectionOffsetEnd = replacement.length - 2;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        selectionOffsetStart = 1;
        selectionOffsetEnd = replacement.length - 1;
        break;
      case 'link':
        replacement = `[${selectedText || 'link text'}](https://example.com)`;
        selectionOffsetStart = 1;
        selectionOffsetEnd = (selectedText || 'link text').length + 1;
        break;
      case 'bullet':
        replacement = selectedText
          ? selectedText.split('\n').map(line => `- ${line}`).join('\n')
          : '- list item';
        selectionOffsetStart = 2;
        selectionOffsetEnd = replacement.length;
        break;
      case 'number':
        replacement = selectedText
          ? selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n')
          : '1. list item';
        selectionOffsetStart = 3;
        selectionOffsetEnd = replacement.length;
        break;
      case 'heading':
        replacement = `\n## ${selectedText || 'Heading'}\n`;
        selectionOffsetStart = 4;
        selectionOffsetEnd = replacement.length - 1;
        break;
      case 'quote':
        replacement = `\n> ${selectedText || 'Blockquote'}\n`;
        selectionOffsetStart = 3;
        selectionOffsetEnd = replacement.length - 1;
        break;
      case 'code':
        replacement = `\`\`\`\n${selectedText || 'code'}\n\`\`\``;
        selectionOffsetStart = 4;
        selectionOffsetEnd = replacement.length - 4;
        break;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + selectionOffsetStart, start + selectionOffsetEnd);
    }, 0);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${filename || 'untitled'}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setContent(text);
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setFilename(nameWithoutExt);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.md') || file.name.endsWith('.txt'))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setContent(text);
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setFilename(nameWithoutExt);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div 
      className="h-screen flex flex-col bg-[#fcf7e6] dark:bg-[#0d1117] font-sans overflow-hidden relative transition-colors duration-300"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-[#7485b6]/20 backdrop-blur-sm z-50 flex items-center justify-center border-4 border-dashed border-[#7485b6] m-4 rounded-[32px] pointer-events-none">
          <div className="bg-white px-8 py-6 rounded-2xl soft-shadow-lg flex flex-col items-center gap-3">
            <Upload className="w-12 h-12 text-[#7485b6] animate-bounce" />
            <p className="font-bold text-gray-800 text-lg">Drop your Markdown file here</p>
            <p className="text-sm text-gray-500">Supports .md and .txt files</p>
          </div>
        </div>
      )}

      {/* Top Toolbar */}
      <header className="h-16 flex-shrink-0 flex justify-between items-center px-4 md:px-6 max-w-[1600px] mx-auto w-full relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white dark:bg-[#161b22] dark:border dark:border-[#21262d] rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-gray-200 soft-shadow transition-all duration-300 hover:scale-110 active:scale-90 hover:shadow-md hover:-translate-y-0.5"
            title="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {/* Logo only on mobile */}
          <div className="flex sm:hidden items-center gap-2">
            <div className="w-6 h-6 bg-[#7485b6] rounded-full flex items-center justify-center text-white">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-gray-800 dark:text-gray-200">Make.md</h1>
          </div>
        </div>
        
        {/* Mobile / Tablet Single Toggle Button - Context aware */}
        <div className={`flex md:hidden absolute left-1/2 -translate-x-1/2 top-[72px] z-40 transition-all duration-300 ${
          isFullscreen ? 'opacity-0 pointer-events-none scale-95 translate-y-2' : 'opacity-100'
        }`}>
          {activeTab === 'editor' ? (
            <button 
              className="bg-white dark:bg-[#161b22] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#30363d] px-6 py-2 rounded-full font-semibold text-xs soft-shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 hover:-translate-y-0.5"
              onClick={() => setActiveTab('preview')}
            >
              <Eye className="w-4 h-4 text-[#7485b6]" /> Preview Mode
            </button>
          ) : (
            <button 
              className="bg-white dark:bg-[#161b22] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#30363d] px-6 py-2 rounded-full font-semibold text-xs soft-shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 hover:-translate-y-0.5"
              onClick={() => setActiveTab('editor')}
            >
              <FileEdit className="w-4 h-4 text-[#7485b6]" /> Editor Mode
            </button>
          )}
        </div>

        {/* Layout controls on desktop */}
        <div className="hidden md:flex items-center bg-white/60 dark:bg-[#161b22]/60 p-1 rounded-full soft-shadow-sm border border-gray-100 dark:border-[#21262d]">
          <button 
            onClick={() => setLayout('split')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 hover:scale-105 active:scale-95 ${layout === 'split' ? 'bg-[#7485b6] text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
          >
            <Layout className="w-3.5 h-3.5" /> Split
          </button>
          <button 
            onClick={() => setLayout('preview')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 hover:scale-105 active:scale-95 ${layout === 'preview' ? 'bg-[#7485b6] text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onToggleTheme}
            className="w-10 h-10 bg-white dark:bg-[#161b22] dark:border dark:border-[#21262d] rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-gray-200 soft-shadow transition-all duration-300 hover:scale-110 active:scale-90 hover:shadow-md hover:-translate-y-0.5"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile Download Button */}
          <button
            onClick={() => setShowDownloadModal(true)}
            className="sm:hidden w-10 h-10 bg-white dark:bg-[#161b22] dark:border dark:border-[#21262d] rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-gray-200 soft-shadow transition-all duration-300 hover:scale-110 active:scale-90 hover:shadow-md"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Desktop Save Input */}
          <div className="hidden sm:flex items-center bg-white dark:bg-[#161b22] rounded-full p-0.5 soft-shadow-sm border border-gray-100 dark:border-[#21262d]">
             <input 
               type="text" 
               value={filename}
               onChange={(e) => setFilename(e.target.value)}
               placeholder="Filename"
               className="bg-transparent border-none outline-none px-3 py-1 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 w-20 sm:w-28"
             />
             <span className="text-gray-400 text-xs sm:text-sm font-medium pr-2">.md</span>
             <button 
               onClick={handleDownload}
               className="flex items-center gap-1.5 bg-[#7485b6] text-white px-3 sm:px-4 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md hover:-translate-y-0.5"
             >
               <Download className="w-3.5 h-3.5" />
               <span className="hidden sm:inline">Save</span>
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden p-2 md:p-3 lg:p-4 pt-0 gap-2 lg:gap-4 max-w-[1600px] mx-auto w-full">
        {/* Editor Panel */}
        <div 
          ref={editorContainerRef}
          className={`overflow-hidden transition-all duration-300 ${
            isFullscreen 
              ? 'fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#161b22] p-0 md:p-6 lg:p-8' 
              : `flex-1 h-full bg-white dark:bg-[#161b22] rounded-[32px] soft-shadow-lg flex-col ${
                  layout === 'preview' ? 'hidden' : 'flex'
                } ${activeTab === 'preview' ? 'hidden md:flex' : 'flex'}`
          }`}
        >
          <div className="h-14 border-b border-gray-100 dark:border-[#21262d] flex items-center justify-between px-4 md:px-6 flex-shrink-0">
            <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              {isFullscreen ? 'Zen Editor' : 'Editor'}
              {isFullscreen && (
                <span className="hidden sm:inline-block text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-400 font-normal px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Press Esc to exit
                </span>
              )}
            </span>
            <div className="flex items-center gap-3">
              {/* Templates dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors px-2.5 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Templates"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Templates</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>
                
                {showTemplates && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowTemplates(false)} />
                    <div className="absolute top-8 right-0 w-48 bg-white dark:bg-[#161b22] rounded-2xl soft-shadow-lg border border-gray-100 dark:border-[#21262d] py-2 z-20 overflow-hidden">
                      <button 
                        onClick={() => { setContent(TEMPLATES.readme); setFilename('README'); setShowTemplates(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                      >
                        📝 README.md
                      </button>
                      <button 
                        onClick={() => { setContent(TEMPLATES.meeting); setFilename('Meeting_Notes'); setShowTemplates(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                      >
                        👥 Meeting Notes
                      </button>
                      <button 
                        onClick={() => { setContent(TEMPLATES.changelog); setFilename('CHANGELOG'); setShowTemplates(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                      >
                        🚀 Changelog
                      </button>
                      <button 
                        onClick={() => { setContent(TEMPLATES.journal); setFilename('Journal'); setShowTemplates(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                      >
                        📔 Daily Journal
                      </button>
                      <button 
                        onClick={() => { setContent(TEMPLATES.blog); setFilename('Blog_Post'); setShowTemplates(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                      >
                        ✍️ Blog Post
                      </button>
                      <button 
                        onClick={() => { setContent(TEMPLATES.docs); setFilename('Documentation'); setShowTemplates(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                      >
                        📖 Documentation
                      </button>
                      <button 
                        onClick={() => { setContent(TEMPLATES.tasks); setFilename('Tasks'); setShowTemplates(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                      >
                        📋 Task List
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="w-[1px] h-3 bg-gray-200 dark:bg-[#21262d]"></div>

              {/* Import button */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-all duration-300 px-2.5 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 active:scale-95"
                title="Import .md or .txt file"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileImport} 
                accept=".md,.txt" 
                className="hidden" 
                
              />
              
              <div className="w-[1px] h-3 bg-gray-200 dark:bg-[#21262d]"></div>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`flex items-center gap-1.5 text-xs transition-all duration-300 px-2.5 py-1.5 rounded-full hover:scale-105 active:scale-95 ${
                  isFullscreen 
                    ? 'bg-[#7485b6]/15 text-[#7485b6] dark:bg-[#7485b6]/30 dark:text-[#a5d6ff] font-medium' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-[#7485b6] hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title={isFullscreen ? "Exit Zen Mode" : "Enter Zen Mode / Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isFullscreen ? 'Exit Zen' : 'Zen Mode'}</span>
              </button>
            </div>
          </div>
          {/* Format Toolbar */}
          <div className="px-4 md:px-6 py-2 border-b border-gray-100 dark:border-[#21262d] bg-[#fbfbfa]/60 dark:bg-[#161b22]/60 flex items-center gap-1 overflow-x-auto flex-shrink-0 scrollbar-none">
            <button
              onClick={() => insertFormatting('bold')}
              className="p-2 hover:bg-[#7485b6]/10 text-gray-600 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-[#a5d6ff] rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertFormatting('italic')}
              className="p-2 hover:bg-[#7485b6]/10 text-gray-600 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-[#a5d6ff] rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-gray-200 dark:bg-[#21262d] mx-1"></div>
            <button
              onClick={() => insertFormatting('heading')}
              className="p-2 hover:bg-[#7485b6]/10 text-gray-600 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-[#a5d6ff] rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center"
              title="Heading"
            >
              <Heading className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertFormatting('quote')}
              className="p-2 hover:bg-[#7485b6]/10 text-gray-600 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-[#a5d6ff] rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center"
              title="Blockquote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertFormatting('code')}
              className="p-2 hover:bg-[#7485b6]/10 text-gray-600 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-[#a5d6ff] rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center"
              title="Code Block"
            >
              <Code className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-gray-200 dark:bg-[#21262d] mx-1"></div>
            <button
              onClick={() => insertFormatting('link')}
              className="p-2 hover:bg-[#7485b6]/10 text-gray-600 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-[#a5d6ff] rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center"
              title="Link"
            >
              <Link className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertFormatting('bullet')}
              className="p-2 hover:bg-[#7485b6]/10 text-gray-600 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-[#a5d6ff] rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertFormatting('number')}
              className="p-2 hover:bg-[#7485b6]/10 text-gray-600 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-[#a5d6ff] rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Editor
              value={content}
              onValueChange={setContent}
              highlight={(code) => Prism.highlight(code, Prism.languages.markdown, 'markdown')}
              padding={isMobile ? 12 : 32}
              className="font-mono text-[15px] min-h-full outline-none text-gray-700 dark:text-[#c9d1d9] leading-relaxed"
              textareaClassName="focus:outline-none"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
              }}
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className={`flex-1 h-full bg-white dark:bg-[#161b22] rounded-[32px] soft-shadow-lg flex-col overflow-hidden ${
          layout === 'editor' ? 'hidden' : 'flex'
        } ${activeTab === 'editor' ? 'hidden md:flex' : 'flex'}`}>
          <div className="h-14 border-b border-gray-100 dark:border-[#21262d] flex items-center justify-between px-6 flex-shrink-0">
            <span className="font-semibold text-gray-800 dark:text-gray-200">Preview</span>
          </div>
          <div className="flex-1 overflow-y-auto">
             <MarkdownPreview content={content} />
          </div>
        </div>
      </main>

      {/* Mobile Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 sm:hidden backdrop-blur-sm">
          <div className="bg-white dark:bg-[#161b22] w-full max-w-sm rounded-[24px] p-6 soft-shadow-lg border border-gray-100 dark:border-[#21262d]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Save Markdown File</h3>
            <div className="flex items-center bg-gray-50 dark:bg-[#0d1117] rounded-xl p-2 border border-gray-200 dark:border-[#30363d] mb-6">
              <input 
                type="text" 
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Filename"
                className="bg-transparent border-none outline-none px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-full"
                autoFocus
              />
              <span className="text-gray-400 text-sm font-medium pr-3">.md</span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDownloadModal(false)}
                className="flex-1 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleDownload();
                  setShowDownloadModal(false);
                }}
                className="flex-1 py-2.5 bg-[#7485b6] text-white rounded-xl font-medium transition-transform active:scale-95"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
