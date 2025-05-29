


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ChatMessage from './ChatMessage';
import LoadingSpinner from './LoadingSpinner';
import GoProModal from './GoProModal'; // New
import { ChatMessage as ChatMessageType, GroundingMetadata, User, SubscriptionTier } from '../types';
import { generateBotResponse } from '../services/geminiService';
import { SendIcon, XIcon, MessageSquareIcon, StarIcon } from './icons'; 
import { BOT_AVATAR_URL } from '../constants';

interface GlobalChatWidgetProps {
  currentUser: User | null;
  apiKeyExists: boolean;
  onClose: () => void;
  onSubscribePro: (tier: SubscriptionTier) => void; // New prop
}

const GlobalChatWidget: React.FC<GlobalChatWidgetProps> = ({ currentUser, apiKeyExists, onClose, onSubscribePro }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [groundingMetadatas, setGroundingMetadatas] = useState<Record<string, GroundingMetadata | undefined>>({});
  const [isGoProModalOpen, setIsGoProModalOpen] = useState(false); // New

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!apiKeyExists) {
      setMessages([{
        id: 'widget-system-error-apikey',
        text: "AI Assistant is currently unavailable (API key missing).",
        sender: 'system',
        timestamp: new Date(),
      }]);
    } else if (currentUser?.is_pro_user && messages.length === 0) { // Only init welcome if pro
       setMessages([{
        id: 'widget-welcome-msg',
        text: "Hi there! I'm GiiT AI. How can I assist you today? ✨",
        sender: 'bot',
        timestamp: new Date(),
      }]);
    }
  }, [apiKeyExists, messages.length, currentUser?.is_pro_user]);


  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    if (!currentUser && apiKeyExists) { // User not logged in
      setMessages(prev => [...prev, {
        id: `bot-login-prompt-${Date.now()}`,
        text: "Please log in or register to chat with me!",
        sender: 'bot',
        timestamp: new Date(),
      }]);
      return;
    }
    
    if (!apiKeyExists || !currentUser || !currentUser.is_pro_user) { // Not Pro
        setIsGoProModalOpen(true);
        return;
    }


    const userMessage: ChatMessageType = {
      id: `widget-user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
      avatar: currentUser?.avatarUrl
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const historyForGemini = messages.filter(m => m.sender === 'user' || m.sender === 'bot');
      const { text: botText, groundingMetadata } = await generateBotResponse(text, historyForGemini);
      const botMessage: ChatMessageType = {
        id: `widget-bot-${Date.now()}`,
        text: botText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      if (groundingMetadata) {
        setGroundingMetadatas(prev => ({...prev, [botMessage.id]: groundingMetadata}));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setMessages(prevMessages => [...prevMessages, {
        id: `widget-error-${Date.now()}`,
        text: `Apologies, I encountered an issue: ${errorMessage} 🤖💦`,
        sender: 'bot',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentUser, apiKeyExists, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    handleSendMessage(inputValue);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };


  return (
    <div className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] max-h-[480px] bg-brand-surface rounded-xl shadow-2xl flex flex-col z-50 border border-brand-border/50 transition-all duration-300 ease-in-out animate-slide-in-right-widget">
      
      <header className="p-3.5 border-b border-brand-border/50 flex justify-between items-center bg-brand-surface-alt/30 rounded-t-xl">
        <div className="flex items-center space-x-2">
            <MessageSquareIcon className="w-5 h-5 text-brand-purple"/>
            <h2 className="text-md font-semibold text-brand-text">GiiT AI Assistant</h2>
            {currentUser?.is_pro_user && <span title="Pro Feature"><StarIcon className="w-3.5 h-3.5 text-yellow-400" /></span>}
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-brand-surface-alt text-brand-text-muted hover:text-brand-text transition-colors" aria-label="Close chat widget">
          <XIcon className="w-5 h-5" />
        </button>
      </header>
      
      { !currentUser?.is_pro_user && apiKeyExists ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <StarIcon className="w-12 h-12 text-yellow-400 mb-4"/>
            <p className="text-brand-text font-semibold mb-2">Unlock with Pro!</p>
            <p className="text-brand-text-muted text-sm mb-4">Upgrade to Pro to access the GiiT AI Assistant.</p>
            <button 
                onClick={() => { setIsGoProModalOpen(true); }}
                className="px-6 py-2 bg-gradient-purple-pink text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-glow-pink transition-all"
            >
                Upgrade to Pro
            </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
            {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} groundingMetadata={groundingMetadatas[msg.id]} />
            ))}
            {isLoading && apiKeyExists && (currentUser || !currentUser) && ( 
            <div className="flex justify-start mb-3">
                <div className="flex items-end gap-2">
                    <img src={BOT_AVATAR_URL} alt="bot avatar" className="w-6 h-6 rounded-full border-2 border-brand-surface object-cover" />
                    <div className="px-3 py-1.5 rounded-xl shadow-lg bg-brand-surface-alt">
                        <LoadingSpinner size="sm" message="Thinking..." />
                    </div>
                </div>
            </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      )}
      
      {error && apiKeyExists && currentUser?.is_pro_user && (
        <div className="p-2.5 bg-red-900/40 border-t border-red-700/40">
          <p className="text-red-300 text-xs text-center">{error}</p>
        </div>
      )}
       {!currentUser && apiKeyExists && !(!currentUser?.is_pro_user && apiKeyExists) && ( // Show login prompt if not showing upgrade prompt
         <div className="p-2.5 bg-brand-purple/20 border-t border-brand-purple/40 text-center">
          <p className="text-brand-text text-xs">
            Please <Link to="/login" className="font-semibold hover:underline text-brand-cyan" onClick={onClose}>log in</Link> or <Link to="/register" className="font-semibold hover:underline text-brand-cyan" onClick={onClose}>register</Link> to chat.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-2.5 border-t border-brand-border/50">
        <div className="flex items-center bg-brand-bg rounded-lg p-1 border border-brand-border/70 focus-within:ring-1 focus-within:ring-brand-purple transition-all">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={!apiKeyExists ? "AI unavailable" : (!currentUser ? "Log in to chat..." : (!currentUser.is_pro_user ? "Upgrade to Pro..." : "Ask GiiT AI..."))}
            className="flex-grow p-2 bg-transparent text-sm text-brand-text placeholder-brand-text-muted focus:outline-none resize-none max-h-20 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent"
            rows={1}
            disabled={!apiKeyExists || isLoading || !currentUser?.is_pro_user}
            style={{caretColor: 'var(--tw-color-brand-purple)'}}
            aria-label="Chat message input for GiiT AI Assistant"
          />
          <button
            type="submit"
            disabled={!apiKeyExists || isLoading || !inputValue.trim() || !currentUser?.is_pro_user}
            className="p-2 text-brand-purple hover:text-brand-pink rounded-full disabled:text-brand-text-darker disabled:cursor-not-allowed transition-colors transform hover:scale-110 active:scale-100"
            aria-label="Send message to GiiT AI Assistant"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
      <GoProModal 
        isOpen={isGoProModalOpen}
        onClose={() => setIsGoProModalOpen(false)}
        onSubscribe={onSubscribePro}
        featureName="GiiT AI Assistant"
      />
    </div>
  );
};

export default GlobalChatWidget;