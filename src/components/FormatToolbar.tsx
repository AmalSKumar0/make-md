import React from 'react';
import { 
  Undo, 
  Redo, 
  Bold, 
  Italic, 
  Heading, 
  Quote, 
  Code, 
  Link, 
  List, 
  ListOrdered 
} from 'lucide-react';

interface FormatToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onInsertFormatting: (type: 'bold' | 'italic' | 'heading' | 'quote' | 'code' | 'link' | 'bullet' | 'number') => void;
}

export default function FormatToolbar({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onInsertFormatting
}: FormatToolbarProps) {
  return (
    <div className="px-4 md:px-6 py-2 border-b border-gray-100 dark:border-[#21262d] bg-[#fbfbfa]/60 dark:bg-[#161b22]/60 flex items-center gap-1 overflow-x-auto flex-shrink-0 scrollbar-none">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
          canUndo 
            ? 'hover:bg-[#7485b6]/10 text-gray-600 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-[#a5d6ff] hover:scale-110 active:scale-90' 
            : 'text-gray-300 dark:text-gray-650 cursor-not-allowed'
        }`}
        title="Undo (Ctrl+Z)"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
          canRedo 
            ? 'hover:bg-[#7485b6]/10 text-gray-600 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-[#a5d6ff] hover:scale-110 active:scale-90' 
            : 'text-gray-300 dark:text-gray-650 cursor-not-allowed'
        }`}
        title="Redo (Ctrl+Y)"
      >
        <Redo className="w-4 h-4" />
      </button>
      
      <div className="w-[1px] h-4 bg-gray-200 dark:bg-[#21262d] mx-1"></div>
      
      <button
        onClick={() => onInsertFormatting('bold')}
        className="p-2 hover:bg-[#7485b6]/10 text-gray-600 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-[#a5d6ff] rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center"
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => onInsertFormatting('italic')}
        className="p-2 hover:bg-[#7485b6]/10 text-gray-600 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-[#a5d6ff] rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center"
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      
      <div className="w-[1px] h-4 bg-gray-200 dark:bg-[#21262d] mx-1"></div>
      
      <button
        onClick={() => onInsertFormatting('heading')}
        className="p-2 hover:bg-[#7485b6]/10 text-gray-600 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-[#a5d6ff] rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center"
        title="Heading"
      >
        <Heading className="w-4 h-4" />
      </button>
      <button
        onClick={() => onInsertFormatting('quote')}
        className="p-2 hover:bg-[#7485b6]/10 text-gray-600 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-[#a5d6ff] rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center"
        title="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        onClick={() => onInsertFormatting('code')}
        className="p-2 hover:bg-[#7485b6]/10 text-gray-600 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-[#a5d6ff] rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center"
        title="Code Block"
      >
        <Code className="w-4 h-4" />
      </button>
      
      <div className="w-[1px] h-4 bg-gray-200 dark:bg-[#21262d] mx-1"></div>
      
      <button
        onClick={() => onInsertFormatting('link')}
        className="p-2 hover:bg-[#7485b6]/10 text-gray-600 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-[#a5d6ff] rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center"
        title="Link"
      >
        <Link className="w-4 h-4" />
      </button>
      <button
        onClick={() => onInsertFormatting('bullet')}
        className="p-2 hover:bg-[#7485b6]/10 text-gray-600 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-[#a5d6ff] rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center"
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => onInsertFormatting('number')}
        className="p-2 hover:bg-[#7485b6]/10 text-gray-600 dark:text-gray-400 hover:text-[#7485b6] dark:hover:text-[#a5d6ff] rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 flex items-center justify-center"
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
    </div>
  );
}
