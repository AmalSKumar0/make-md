import { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, Download, Eye, FileEdit, Info, Upload, FileText, ChevronDown, Layout, Bold, Italic, Heading, Quote, Code, List, ListOrdered, Link, Maximize2, Minimize2, Moon, Sun, Copy, Printer, Check, HelpCircle, FileCode, Keyboard, Sparkles, BookOpen, Menu, X } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useElementSmoothScroll } from '../hooks/useSmoothScroll';
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
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorScrollRef = useRef<HTMLDivElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);

  useElementSmoothScroll(editorScrollRef, true);
  useElementSmoothScroll(previewScrollRef, true);

  // Advanced feature states
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'outline' | 'cheatsheet'>('outline');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isTypewriterMode, setIsTypewriterMode] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(window.innerWidth > 1024);
  }, []);

  // 1. Parse Outline headings in real-time
  const headers = useMemo(() => {
    const lines = content.split('\n');
    const items: { text: string; level: number; lineIndex: number }[] = [];
    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        // Strip markdown syntax from the outline text for display
        const text = match[2].replace(/[#*`_\-~[\]()]/g, '').trim();
        if (text) {
          items.push({
            level: match[1].length,
            text,
            lineIndex: index,
          });
        }
      }
    });
    return items;
  }, [content]);

  // Scroll editor and preview to heading line
  const handleHeaderClick = (headerText: string, lineIndex: number) => {
    const textarea = editorContainerRef.current?.querySelector('textarea');
    if (textarea) {
      const lines = content.split('\n');
      let charIndex = 0;
      for (let i = 0; i < lineIndex; i++) {
        charIndex += lines[i].length + 1; // +1 for newline character
      }
      textarea.focus();
      textarea.setSelectionRange(charIndex, charIndex + lines[lineIndex].length);

      const textHeight = textarea.scrollHeight;
      const totalLines = lines.length;
      const scrollPos = (lineIndex / totalLines) * textHeight;
      if (editorScrollRef.current) {
        editorScrollRef.current.scrollTop = Math.max(0, scrollPos - 120);
      }
    }

    const previewDiv = previewScrollRef.current;
    if (previewDiv) {
      const headings = previewDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headingElement = Array.from(headings).find(
        (el) => el.textContent?.trim() === headerText
      );
      if (headingElement) {
        headingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // 2. Real-time statistics calculations
  const stats = useMemo(() => {
    const text = content.trim();
    const chars = content.length;
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { chars, words, readingTime };
  }, [content]);

  // 3. Interactive Cheat Sheet insert handler
  const handleCheatSheetClick = (syntaxType: string) => {
    const textarea = editorContainerRef.current?.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = '';
    let offset = 0;

    switch (syntaxType) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        offset = 2;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        offset = 1;
        break;
      case 'heading':
        replacement = `\n## ${selectedText || 'Heading'}\n`;
        offset = 4;
        break;
      case 'link':
        replacement = `[${selectedText || 'Link text'}](https://example.com)`;
        offset = 1;
        break;
      case 'code-block':
        replacement = `\n\`\`\`javascript\n${selectedText || '// Code goes here'}\n\`\`\`\n`;
        offset = 16;
        break;
      case 'blockquote':
        replacement = `\n> ${selectedText || 'Quote text'}\n`;
        offset = 3;
        break;
      case 'list-bullet':
        replacement = `\n- ${selectedText || 'List item'}\n`;
        offset = 3;
        break;
      case 'list-todo':
        replacement = `\n- [ ] ${selectedText || 'Todo item'}\n`;
        offset = 8;
        break;
      case 'table':
        replacement = `\n| Column 1 | Column 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n`;
        offset = 2;
        break;
      case 'image':
        replacement = `![${selectedText || 'Alt text'}](https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500)`;
        offset = 2;
        break;
    }

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);
    setIsSidebarOpen(false);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + offset, start + replacement.length - offset);
    }, 0);
  };

  // 4. Typewriter scrolling carets handler
  const handleEditorSelectionChange = () => {
    if (!isTypewriterMode || !editorScrollRef.current) return;
    const textarea = editorContainerRef.current?.querySelector('textarea');
    if (!textarea) return;

    const textBeforeCursor = textarea.value.substring(0, textarea.selectionStart);
    const cursorLine = textBeforeCursor.split('\n').length - 1;
    const lines = textarea.value.split('\n');
    const totalLines = lines.length;

    const totalHeight = textarea.scrollHeight;
    const lineHeight = totalHeight / totalLines;

    const containerHeight = editorScrollRef.current.clientHeight;
    const targetScroll = cursorLine * lineHeight - containerHeight / 2 + lineHeight / 2;

    editorScrollRef.current.scrollTop = Math.max(0, targetScroll);
  };

  // 5. Multi-format export actions
  const handleExport = async (format: 'md' | 'html' | 'copy-html' | 'print') => {
    setShowExportDropdown(false);
    
    if (format === 'md') {
      handleDownload();
    } else if (format === 'html') {
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename || 'document'}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css">
  <style>
    body {
      box-sizing: border-box;
      min-width: 200px;
      max-width: 980px;
      margin: 0 auto;
      padding: 45px;
      background-color: #fcfaf5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }
    @media (max-width: 767px) {
      body {
        padding: 15px;
      }
    }
  </style>
</head>
<body class="markdown-body">
  ${document.querySelector('.markdown-body')?.innerHTML || content}
</body>
</html>`;
      const file = new Blob([htmlContent], { type: 'text/html' });
      const element = document.createElement('a');
      element.href = URL.createObjectURL(file);
      element.download = `${filename || 'untitled'}.html`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else if (format === 'copy-html') {
      const renderEl = document.querySelector('.markdown-body');
      if (renderEl) {
        try {
          await navigator.clipboard.writeText(renderEl.innerHTML);
          setCopiedExport(true);
          setTimeout(() => setCopiedExport(false), 2000);
        } catch (err) {
          console.error('Failed to copy HTML:', err);
        }
      }
    } else if (format === 'print') {
      window.print();
    }
  };

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
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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
              onClick={() => setActiveTab('preview')}
            >
              <Eye className="w-3.5 h-3.5" /> Preview Mode
            </button>
          ) : (
            <button 
              className="bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-gray-100 px-4 h-8 rounded-full font-semibold text-xs soft-shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 hover:-translate-y-0.5"
              onClick={() => setActiveTab('editor')}
            >
              <FileEdit className="w-3.5 h-3.5" /> Editor Mode
            </button>
          )}
        </div>

        {/* Layout controls on desktop */}
        <div className="hidden md:flex items-center gap-2">
          <button 
            onClick={() => setLayout('split')}
            className={`h-8 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 hover:scale-105 active:scale-95 ${layout === 'split' ? 'bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-gray-100' : 'bg-gray-100 dark:bg-[#21262d] text-gray-500 dark:text-gray-400 hover:text-[#111] dark:hover:text-white'}`}
          >
            <Layout className="w-3.5 h-3.5" /> Split
          </button>
          <button 
            onClick={() => setLayout('preview')}
            className={`h-8 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 hover:scale-105 active:scale-95 ${layout === 'preview' ? 'bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-gray-100' : 'bg-gray-100 dark:bg-[#21262d] text-gray-500 dark:text-gray-400 hover:text-[#111] dark:hover:text-white'}`}
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
            onClick={() => setShowDownloadModal(true)}
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
                onChange={(e) => setFilename(e.target.value)}
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
                      onClick={() => handleExport('md')}
                      className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5" /> Export Markdown (.md)
                    </button>
                    <button 
                      onClick={() => handleExport('html')}
                      className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors flex items-center gap-2"
                    >
                      <FileCode className="w-3.5 h-3.5" /> Export HTML (.html)
                    </button>
                    <button 
                      onClick={() => handleExport('copy-html')}
                      className="w-full text-left px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white font-medium transition-colors flex items-center gap-2 justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Copy className="w-3.5 h-3.5" /> Copy HTML Render
                      </span>
                      {copiedExport && <Check className="w-3 h-3 text-green-500" />}
                    </button>
                    <button 
                      onClick={() => handleExport('print')}
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
            {/* Main Content */}
      <main className="flex-1 flex overflow-hidden p-2 md:p-3 lg:p-4 pt-0 gap-2 lg:gap-4 max-w-[1600px] mx-auto w-full relative justify-center">
        {/* Left Sidebar (Outline / Cheat Sheet) - Floats over the layout to avoid dynamic resizing of the editor */}
        {isSidebarOpen && !isFocusMode && !isFullscreen && (
          <>
            {/* Dimmed backdrop overlay for premium look & click-outside close */}
            <div 
              className="absolute inset-0 z-20 bg-black/10 dark:bg-black/35 backdrop-blur-[2px] print-hide transition-opacity duration-350" 
              onClick={() => setIsSidebarOpen(false)} 
            />
            <div className="absolute left-0 top-0 bottom-0 w-72 z-30 bg-white dark:bg-[#161b22] rounded-r-[32px] soft-shadow-xl flex flex-col overflow-hidden border-r border-gray-100 dark:border-[#21262d] animate-slide-in-left print-hide">
              {/* Sidebar Tabs & Close Button */}
              <div className="h-14 border-b border-gray-100 dark:border-[#21262d] flex items-center justify-between px-4 gap-2.5 flex-shrink-0">
                <div className="flex bg-gray-100 dark:bg-[#21262d] p-1 rounded-full flex-1">
                  <button
                    onClick={() => setSidebarTab('outline')}
                    className={`flex-1 py-1 text-center rounded-full text-xs font-bold tracking-wide transition-all duration-350 ${
                      sidebarTab === 'outline'
                        ? 'bg-white dark:bg-[#161b22] text-[#111] dark:text-white soft-shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-[#111] dark:hover:text-white'
                    }`}
                  >
                    Outline
                  </button>
                  <button
                    onClick={() => setSidebarTab('cheatsheet')}
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
                  onClick={() => setIsSidebarOpen(false)}
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
                    <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
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
                            'pl-3 border-l border-gray-200 dark:border-gray-800 ml-1.5 text-gray-600 dark:text-gray-450 text-xs',
                            'pl-6 border-l border-gray-200 dark:border-gray-800 ml-1.5 text-gray-500 dark:text-gray-500 text-[11px]',
                            'pl-9 border-l border-gray-200 dark:border-gray-800 ml-1.5 text-gray-450 dark:text-gray-600 text-[11px]',
                            'pl-12 border-l border-gray-200 dark:border-gray-800 ml-1.5 text-gray-400 dark:text-gray-650 text-[10px]',
                            'pl-14 border-l border-gray-200 dark:border-gray-800 ml-1.5 text-gray-400 dark:text-gray-650 text-[10px]'
                          ];
                          const cls = indentPadding[Math.min(h.level - 1, 5)];
                          return (
                            <div key={i} className="py-0.5">
                              <button
                                onClick={() => {
                                  handleHeaderClick(h.text, h.lineIndex);
                                  if (window.innerWidth < 768) setIsSidebarOpen(false);
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
                    <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
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
                          onClick={() => handleCheatSheetClick(item.type)}
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
                          <code className="text-[9px] text-gray-400 dark:text-gray-500 font-mono block truncate w-full mt-1.5">
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
        )}

        {/* Editor Panel */}
        <div 
          ref={editorContainerRef}
          className={`overflow-hidden transition-all duration-300 print-hide bg-white dark:bg-[#161b22] ${
            isFullscreen
              ? (layout === 'preview' || activeTab === 'preview'
                  ? 'hidden'
                  : 'fixed inset-0 z-50 p-4 md:p-6 lg:p-8 max-w-none rounded-none flex flex-col h-full')
              : `relative max-w-3xl w-full mx-auto flex flex-col h-full rounded-[32px] soft-shadow-lg ${
                  layout === 'preview' ? 'hidden' : 'flex'
                } ${activeTab === 'preview' ? 'hidden md:flex' : 'flex'}`
          }`}
        >
          <div className="h-14 border-b border-gray-100 dark:border-[#21262d] flex items-center justify-between px-4 md:px-6 flex-shrink-0">
            <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              {isFocusMode ? 'Focus Mode' : isFullscreen ? 'Zen Editor' : 'Editor'}
              {isFullscreen && (
                <span className="hidden sm:inline-block text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-400 font-normal px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Press Esc to exit
                </span>
              )}
            </span>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Unified Hamburger Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
                  className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
                    showHamburgerMenu
                      ? 'bg-[#111] dark:bg-white text-white dark:text-[#111]'
                      : 'bg-gray-100 dark:bg-[#21262d] text-gray-500 dark:text-gray-400 hover:text-[#111] dark:hover:text-white'
                  }`}
                  title="Options Menu"
                >
                  <Menu className="w-4 h-4" />
                </button>

                {showHamburgerMenu && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowHamburgerMenu(false)} />
                    <div className="absolute top-10 right-0 w-56 bg-white dark:bg-[#161b22] rounded-2xl soft-shadow-lg border border-gray-100 dark:border-[#21262d] py-2 z-30 overflow-hidden animate-scale-in">
                      
                      {/* Document Actions */}
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        Actions
                      </div>
                      <button 
                        onClick={() => { fileInputRef.current?.click(); setShowHamburgerMenu(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 transition-colors text-left"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Import file
                      </button>

                      {/* Templates Submenu */}
                      <div className="h-[1px] bg-gray-105 dark:bg-[#21262d] my-1" />
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Quick Templates
                      </div>
                      
                      <div className="max-h-36 overflow-y-auto scrollbar-none">
                        {[
                          { name: 'README.md', key: 'readme', filename: 'README' },
                          { name: 'Meeting Notes', key: 'meeting', filename: 'Meeting_Notes' },
                          { name: 'Changelog', key: 'changelog', filename: 'CHANGELOG' },
                          { name: 'Daily Journal', key: 'journal', filename: 'Journal' },
                          { name: 'Blog Post', key: 'blog', filename: 'Blog_Post' },
                          { name: 'Documentation', key: 'docs', filename: 'Documentation' },
                          { name: 'Task List', key: 'tasks', filename: 'Tasks' },
                        ].map((t) => (
                          <button
                            key={t.key}
                            onClick={() => {
                              setContent(TEMPLATES[t.key as keyof typeof TEMPLATES]);
                              setFilename(t.filename);
                              setShowHamburgerMenu(false);
                            }}
                            className="w-full text-left pl-7 pr-4 py-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-400 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 transition-colors block truncate"
                          >
                            {t.name}
                          </button>
                        ))}
                      </div>

                      {/* Preferences */}
                      <div className="h-[1px] bg-gray-105 dark:bg-[#21262d] my-1" />
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        Preferences
                      </div>

                      <button 
                        onClick={() => { setIsFocusMode(!isFocusMode); setShowHamburgerMenu(false); }}
                        className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          Focus Mode
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full ${isFocusMode ? 'bg-[#7485b6]' : 'bg-transparent'}`} />
                      </button>

                      <button 
                        onClick={() => { setIsTypewriterMode(!isTypewriterMode); setShowHamburgerMenu(false); }}
                        className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Keyboard className="w-3.5 h-3.5" />
                          Typewriter Mode
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full ${isTypewriterMode ? 'bg-[#7485b6]' : 'bg-transparent'}`} />
                      </button>

                      <button 
                        onClick={() => { setIsFullscreen(!isFullscreen); setShowHamburgerMenu(false); }}
                        className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-[#fcf7e6] dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Maximize2 className="w-3.5 h-3.5" />
                          Zen Mode
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full ${isFullscreen ? 'bg-[#7485b6]' : 'bg-transparent'}`} />
                      </button>

                    </div>
                  </>
                )}
              </div>

              {/* Hidden Import file input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileImport} 
                accept=".md,.txt" 
                className="hidden" 
              />
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

          <div ref={editorScrollRef} className="flex-1 overflow-y-auto" data-lenis-prevent="true">
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
              onKeyUp={handleEditorSelectionChange}
              onMouseUp={handleEditorSelectionChange}
            />
          </div>

          {/* Statistics HUD Floating Badge */}
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/80 dark:bg-black/75 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-300 soft-shadow transition-all duration-300 hover:scale-105 hover:bg-white dark:hover:bg-black select-none pointer-events-auto">
            <span>{stats.words} words</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            <span>{stats.chars} chars</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            <span>{stats.readingTime} min read</span>
          </div>
        </div>

        {/* Preview Panel */}
        <div className={`bg-white dark:bg-[#161b22] overflow-hidden print-full ${
          isFullscreen
            ? (layout === 'preview' || activeTab === 'preview'
                ? 'fixed inset-0 z-50 p-4 md:p-6 lg:p-8 max-w-none rounded-none flex flex-col h-full'
                : 'hidden')
            : `flex-grow h-full rounded-[32px] soft-shadow-lg flex-col w-full mx-auto ${
                layout === 'preview' ? 'max-w-none' : 'max-w-3xl'
              } ${
                isFocusMode ? 'hidden' : ''
              } ${
                layout === 'editor' ? 'hidden' : 'flex'
              } ${activeTab === 'editor' ? 'hidden md:flex' : 'flex'}`
        }`}>
          <div className="h-14 border-b border-gray-100 dark:border-[#21262d] flex items-center justify-between px-6 flex-shrink-0 print-hide">
            <span className="font-semibold text-gray-800 dark:text-gray-200">Preview</span>
            {isFullscreen && (
              <button 
                onClick={() => setIsFullscreen(false)}
                className="px-3 py-1 text-xs font-semibold bg-gray-150 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-650 dark:text-gray-300 rounded-full transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Minimize2 className="w-3 h-3" /> Exit Zen
              </button>
            )}
          </div>
          <div ref={previewScrollRef} className="flex-1 overflow-y-auto print-overflow-visible" data-lenis-prevent="true">
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
                className="flex-1 h-8 rounded-full text-xs font-semibold bg-gray-100 dark:bg-[#21262d] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleDownload();
                  setShowDownloadModal(false);
                }}
                className="flex-1 h-8 rounded-full text-xs font-semibold bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-gray-100 transition-all flex items-center justify-center"
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
