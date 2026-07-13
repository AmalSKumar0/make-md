import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface EditorFooterProps {
  stats: {
    words: number;
    chars: number;
    readingTime: number;
  };
  formatStatus: 'idle' | 'success' | 'already_formatted' | 'cached' | 'error';
  formatError: string;
  isFormatting: boolean;
  onFormat: () => void;
}

export default function EditorFooter({
  stats,
  formatStatus,
  formatError,
  isFormatting,
  onFormat
}: EditorFooterProps) {
  return (
    <div className="h-12 border-t border-gray-100 dark:border-[#21262d] bg-[#fbfbfa]/65 dark:bg-[#161b22]/65 backdrop-blur-md px-4 flex items-center justify-between flex-shrink-0 z-10">
      {/* Left: Statistics */}
      <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 select-none">
        <span>{stats.words} words</span>
        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
        <span>{stats.chars} chars</span>
        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
        <span>{stats.readingTime} min read</span>
      </div>

      {/* Right: AI Format button */}
      <div className="flex items-center gap-2">
        {formatStatus === 'error' && (
          <span className="text-[10px] text-red-500 font-semibold max-w-[150px] sm:max-w-[240px] truncate" title={formatError}>
            {formatError}
          </span>
        )}
        {formatStatus === 'success' && (
          <span className="text-[10px] text-green-500 font-semibold">
            Formatted!
          </span>
        )}
        {formatStatus === 'cached' && (
          <span className="text-[10px] text-green-500 font-semibold">
            Formatted! (cached)
          </span>
        )}
        {formatStatus === 'already_formatted' && (
          <span className="text-[10px] text-[#7485b6] dark:text-[#8b9bb4] font-semibold">
            Already formatted!
          </span>
        )}

        <button
          onClick={onFormat}
          disabled={isFormatting}
          className={`h-7 px-3.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
            isFormatting
              ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-550 cursor-wait'
              : formatStatus === 'success' || formatStatus === 'cached' || formatStatus === 'already_formatted'
              ? ''
              : formatStatus === 'error'
              ? ''
              : 'bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-gray-100 soft-shadow-sm'
          }`}
          title="Format Markdown with Grok AI"
        >
          {isFormatting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
