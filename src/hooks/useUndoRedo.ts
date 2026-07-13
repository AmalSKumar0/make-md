import { useState, useCallback, useRef, useEffect } from 'react';

interface HistoryEntry {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

export function useUndoRedo(
  initialValue: string,
  onPersist?: (val: string) => void
) {
  const [present, setPresent] = useState(initialValue);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const pastRef = useRef<HistoryEntry[]>([]);
  const futureRef = useRef<HistoryEntry[]>([]);
  
  const lastCommitTimeRef = useRef<number>(Date.now());
  const lastValRef = useRef<string>(initialValue);

  // Track selection state globally for the active editor textarea
  const selectionRef = useRef({ start: 0, end: 0 });

  useEffect(() => {
    const handleSelectionChange = () => {
      const textarea = document.querySelector('textarea');
      if (textarea && document.activeElement === textarea) {
        selectionRef.current = {
          start: textarea.selectionStart,
          end: textarea.selectionEnd,
        };
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const updateStacksState = () => {
    setCanUndo(pastRef.current.length > 0);
    setCanRedo(futureRef.current.length > 0);
  };

  const update = useCallback((newVal: string, forceCommit = false, silent = false) => {
    if (newVal === lastValRef.current && !forceCommit) return;

    const now = Date.now();
    const timePassed = now - lastCommitTimeRef.current;

    // Check if space, enter, tab, or a transition to deletion
    const isWhitespaceChange =
      newVal.length - lastValRef.current.length === 1 &&
      (newVal.endsWith(' ') || newVal.endsWith('\n') || newVal.endsWith('\t'));

    if (!silent && (forceCommit || timePassed > 1200 || isWhitespaceChange)) {
      pastRef.current.push({
        value: lastValRef.current,
        selectionStart: selectionRef.current.start,
        selectionEnd: selectionRef.current.end,
      });
      futureRef.current = []; // Clear redo stack on new edit
      lastCommitTimeRef.current = now;
    }

    lastValRef.current = newVal;
    setPresent(newVal);
    if (onPersist) {
      onPersist(newVal);
    }
    updateStacksState();
  }, [onPersist]);

  const commitCurrentState = useCallback(() => {
    const lastHistoryEntry = pastRef.current[pastRef.current.length - 1];
    if (!lastHistoryEntry || lastHistoryEntry.value !== present) {
      pastRef.current.push({
        value: present,
        selectionStart: selectionRef.current.start,
        selectionEnd: selectionRef.current.end,
      });
      futureRef.current = [];
      lastCommitTimeRef.current = Date.now();
      updateStacksState();
    }
  }, [present]);

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;

    const previous = pastRef.current.pop()!;
    
    // Save current state into future stack
    futureRef.current.push({
      value: present,
      selectionStart: selectionRef.current.start,
      selectionEnd: selectionRef.current.end,
    });

    lastValRef.current = previous.value;
    setPresent(previous.value);
    if (onPersist) {
      onPersist(previous.value);
    }

    // Restore selection
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(previous.selectionStart, previous.selectionEnd);
      }
    }, 0);

    lastCommitTimeRef.current = Date.now();
    updateStacksState();
  }, [present, onPersist]);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;

    const next = futureRef.current.pop()!;
    
    // Save current state into past stack
    pastRef.current.push({
      value: present,
      selectionStart: selectionRef.current.start,
      selectionEnd: selectionRef.current.end,
    });

    lastValRef.current = next.value;
    setPresent(next.value);
    if (onPersist) {
      onPersist(next.value);
    }

    // Restore selection
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(next.selectionStart, next.selectionEnd);
      }
    }, 0);

    lastCommitTimeRef.current = Date.now();
    updateStacksState();
  }, [present, onPersist]);

  const resetHistory = useCallback((newVal: string) => {
    pastRef.current = [];
    futureRef.current = [];
    lastValRef.current = newVal;
    setPresent(newVal);
    if (onPersist) {
      onPersist(newVal);
    }
    lastCommitTimeRef.current = Date.now();
    updateStacksState();
  }, [onPersist]);

  return {
    value: present,
    setValue: update,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
    commitCurrentState,
  };
}
