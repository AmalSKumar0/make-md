import React from 'react';

interface MobileDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  filename: string;
  onChangeFilename: (name: string) => void;
  onDownload: () => void;
}

export default function MobileDownloadModal({
  isOpen,
  onClose,
  filename,
  onChangeFilename,
  onDownload
}: MobileDownloadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 sm:hidden backdrop-blur-sm">
      <div className="bg-white dark:bg-[#161b22] w-full max-w-sm rounded-[24px] p-6 soft-shadow-lg border border-gray-100 dark:border-[#21262d]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Save Markdown File</h3>
        <div className="flex items-center bg-gray-50 dark:bg-[#0d1117] rounded-xl p-2 border border-gray-200 dark:border-[#30363d] mb-6">
          <input 
            type="text" 
            value={filename}
            onChange={(e) => onChangeFilename(e.target.value)}
            placeholder="Filename"
            className="bg-transparent border-none outline-none px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 w-full"
            autoFocus
          />
          <span className="text-gray-400 text-sm font-medium pr-3">.md</span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 h-8 rounded-full text-xs font-semibold bg-gray-100 dark:bg-[#21262d] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onDownload();
              onClose();
            }}
            className="flex-1 h-8 rounded-full text-xs font-semibold bg-[#111] dark:bg-white text-white dark:text-[#111] hover:bg-black dark:hover:bg-gray-100 transition-all flex items-center justify-center"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
