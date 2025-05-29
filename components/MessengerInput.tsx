
import React, { useState, useCallback } from 'react';
import { SendIcon, MicIcon, PaperclipIcon, SmileIcon } from './icons';
import { User } from '../types';

interface MessengerInputProps {
  onSendMessage: (messageText: string, type: 'text' | 'image' | 'voice' | 'doc') => void;
  isLoading: boolean;
  currentUser: User | null;
  isChatActive: boolean;
}

const MessengerInput: React.FC<MessengerInputProps> = ({ onSendMessage, isLoading, currentUser, isChatActive }) => {
  const [inputValue, setInputValue] = useState('');

  const canInteract = !!currentUser && isChatActive;

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim() && !isLoading && canInteract) {
      onSendMessage(inputValue.trim(), 'text');
      setInputValue('');
    }
  }, [inputValue, isLoading, onSendMessage, canInteract]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleMockAction = (type: 'image' | 'voice' | 'doc' | 'emoji') => {
    if (!canInteract || isLoading) return;
    alert(`Mock: ${type} functionality for Messenger is TBD.`);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-brand-surface border-t border-brand-border/50">
      <div className="flex items-end bg-brand-bg rounded-xl p-1.5 shadow-lg border border-brand-border/50 focus-within:ring-2 focus-within:ring-brand-purple transition-all">
        <button
          type="button"
          title="Emoji (TBD)"
          onClick={() => handleMockAction('emoji')}
          className="p-2.5 rounded-full text-brand-text-muted hover:text-brand-cyan hover:bg-brand-surface-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={!canInteract || isLoading}
          aria-label="Add emoji"
        >
          <SmileIcon className="w-5 h-5" />
        </button>
        <button
          type="button"
          title="Attach file (TBD)"
          onClick={() => handleMockAction('doc')}
          className="p-2.5 rounded-full text-brand-text-muted hover:text-brand-cyan hover:bg-brand-surface-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={!canInteract || isLoading}
          aria-label="Attach file"
        >
          <PaperclipIcon className="w-5 h-5" />
        </button>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={!isChatActive ? "Select a chat to start messaging" : (canInteract ? "Type a message..." : "Please log in to send messages.")}
          className="flex-grow p-2.5 bg-transparent text-brand-text placeholder-brand-text-muted focus:outline-none resize-none max-h-24 text-sm scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent"
          rows={1}
          disabled={!canInteract || isLoading}
          style={{ caretColor: 'var(--tw-color-brand-purple)' }}
          aria-label="Message input"
        />
        {inputValue.trim() ? (
            <button
            type="submit"
            disabled={!canInteract || isLoading || !inputValue.trim()}
            className="p-2.5 rounded-full text-brand-purple hover:text-brand-pink disabled:text-brand-text-darker disabled:cursor-not-allowed transition-colors duration-200 transform hover:scale-110 active:scale-100"
            title="Send message"
            aria-label="Send message"
            >
            <SendIcon className="w-5 h-5" />
            </button>
        ) : (
            <button
            type="button"
            title="Record voice note (TBD)"
            onClick={() => handleMockAction('voice')}
            className="p-2.5 rounded-full text-brand-purple hover:text-brand-pink disabled:text-brand-text-darker disabled:cursor-not-allowed transition-colors duration-200 transform hover:scale-110 active:scale-100"
            disabled={!canInteract || isLoading}
            aria-label="Record voice note"
            >
            <MicIcon className="w-5 h-5" />
            </button>
        )}
      </div>
    </form>
  );
};

export default MessengerInput;