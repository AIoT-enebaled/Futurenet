
import React, { useState, useCallback } from 'react';
import { SendIcon, MicIcon, PaperclipIcon, StarIcon } from './icons';
import { User } from '../types';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  currentUser: User | null; 
  apiKeyExists: boolean; 
  // No need for onSubscribePro here, parent (ChatBotPage/GlobalChatWidget) will handle modal.
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, currentUser, apiKeyExists }) => {
  const [inputValue, setInputValue] = useState('');

  const isProUser = !!currentUser?.is_pro_user;
  const canInteract = !!currentUser && apiKeyExists && isProUser;
  
  let placeholderText = "AI features unavailable (API Key missing)";
  if (apiKeyExists) {
    if (!currentUser) {
      placeholderText = "Please log in to chat with GiiT AI.";
    } else if (!isProUser) {
      placeholderText = "Upgrade to Pro to use GiiT AI Assistant.";
    } else {
      placeholderText = "Type your message to GiiT AI...";
    }
  }


  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim() && !isLoading && canInteract) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  }, [inputValue, isLoading, onSendMessage, canInteract]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-brand-surface border-t border-brand-border/50">
      <div className={`flex items-end bg-brand-bg rounded-xl p-1.5 border border-brand-border/50 shadow-lg  transition-all 
                      ${canInteract ? 'focus-within:ring-2 focus-within:ring-brand-purple focus-within:border-brand-purple' 
                                   : 'opacity-70 cursor-not-allowed'}`}>
         <button
            type="button"
            title={!canInteract ? "Upgrade to Pro to attach files" : "Attach file (feature coming soon)"}
            className="p-2.5 rounded-full text-brand-text-muted hover:text-brand-cyan hover:bg-brand-surface-alt disabled:text-brand-text-darker disabled:cursor-not-allowed transition-colors"
            disabled={!canInteract || isLoading}
          >
            <PaperclipIcon className="w-5 h-5" />
            {!isProUser && currentUser && <StarIcon className="w-2.5 h-2.5 absolute bottom-1 right-1 text-yellow-400" />}
        </button>
        <button
            type="button"
            title={!canInteract ? "Upgrade to Pro for voice notes" : "Record voice note (feature coming soon)"}
            className="p-2.5 rounded-full text-brand-text-muted hover:text-brand-cyan hover:bg-brand-surface-alt disabled:text-brand-text-darker disabled:cursor-not-allowed transition-colors"
            disabled={!canInteract || isLoading}
          >
            <MicIcon className="w-5 h-5" />
             {!isProUser && currentUser && <StarIcon className="w-2.5 h-2.5 absolute bottom-1 right-1 text-yellow-400" />}
        </button>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          className="flex-grow p-2.5 bg-transparent text-brand-text placeholder-brand-text-muted focus:outline-none resize-none max-h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent text-sm"
          rows={1}
          disabled={!canInteract || isLoading || !apiKeyExists}
          style={{caretColor: 'var(--tw-color-brand-purple)'}}
          aria-label="Chat message input"
        />
        <button
          type="submit"
          disabled={!canInteract || isLoading || !inputValue.trim()}
          className="p-2.5 rounded-full text-brand-purple hover:text-brand-pink disabled:text-brand-text-darker disabled:cursor-not-allowed transition-colors duration-200 transform hover:scale-110 active:scale-100"
          aria-label="Send message"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
