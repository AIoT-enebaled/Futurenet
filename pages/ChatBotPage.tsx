

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import LoadingSpinner from '../components/LoadingSpinner';
import GoProModal from '../components/GoProModal'; // New
import { ChatMessage as ChatMessageType, GroundingMetadata, User, SubscriptionTier } from '../types';
import { generateBotResponse, checkApiKey } from '../services/geminiService';
import { BOT_AVATAR_URL } from '../constants'; 
import { MessageSquareIcon, StarIcon } from '../components/icons';

interface ChatBotPageProps {
  currentUser: User | null;
  onSubscribePro: (tier: SubscriptionTier) => void; // New prop
}

const ChatBotPage: React.FC<ChatBotPageProps> = ({ currentUser, onSubscribePro }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyExists, setApiKeyExists] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [groundingMetadatas, setGroundingMetadatas] = useState<Record<string, GroundingMetadata | undefined>>({});
  const [isGoProModalOpen, setIsGoProModalOpen] = useState(false); // New state

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const keyStatus = checkApiKey();
    setApiKeyExists(keyStatus);
    if (!keyStatus) {
      setError("Gemini API Key is not configured. Please set the API_KEY environment variable.");
      setMessages(prev => (prev.some(m => m.id === 'system-error-apikey') ? prev : [...prev, {
        id: 'system-error-apikey',
        text: "I'm unable to connect right now. The API key for Gemini is missing. Please contact an administrator.",
        sender: 'system', 
        timestamp: new Date(),
      }]));
    } else if (currentUser?.is_pro_user && (messages.length === 0 || (messages.length === 1 && messages[0].id === 'system-error-apikey'))) {
       setMessages([{
        id: 'welcome-msg',
        text: "Hello! I'm the GiiT AI Assistant. How can I help you today? Ask me about GiiT, current events, or anything else! ✨",
        sender: 'bot',
        timestamp: new Date(),
      }]);
    }
  }, [currentUser, apiKeyExists, messages.length]); 


  const handleSendMessage = useCallback(async (text: string) => {
    if (!currentUser && apiKeyExists) { 
       setMessages(prev => [...prev, {
        id: `bot-login-prompt-${Date.now()}`,
        text: "Looks like you're not logged in. Please log in or register to chat with me!",
        sender: 'bot',
        timestamp: new Date(),
      }]);
      return;
    }
    if (!apiKeyExists || !currentUser || !currentUser.is_pro_user) { // Check for pro user
        setIsGoProModalOpen(true);
        return;
    }


    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
      avatar: currentUser.avatarUrl
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const historyForGemini = messages.filter(m => m.sender === 'user' || m.sender === 'bot');
      const { text: botText, groundingMetadata } = await generateBotResponse(text, historyForGemini);
      const botMessage: ChatMessageType = {
        id: `bot-${Date.now()}`,
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
      const errorBotMessage: ChatMessageType = {
        id: `error-${Date.now()}`,
        text: `Sorry, I encountered an error: ${errorMessage} 🤖💦`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentUser, apiKeyExists]);

  if (apiKeyExists === null) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner message="Initializing AI Assistant..." /></div>;
  }

  if (!currentUser?.is_pro_user && apiKeyExists) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center p-8 bg-brand-surface rounded-xl shadow-xl border border-brand-border/30">
        <StarIcon className="w-16 h-16 text-yellow-400 mb-6" />
        <h1 className="text-2xl font-bold text-brand-text mb-3">Unlock GiiT AI Assistant</h1>
        <p className="text-brand-text-muted mb-6 max-w-md">
          Our powerful AI Assistant is a Pro feature. Upgrade your account to get instant answers, generate content, and much more!
        </p>
        <button
          onClick={() => setIsGoProModalOpen(true)}
          className="px-8 py-3.5 bg-gradient-purple-pink text-white font-semibold rounded-lg shadow-xl hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface text-base md:text-lg"
        >
          Upgrade to Pro
        </button>
        <GoProModal 
            isOpen={isGoProModalOpen} 
            onClose={() => setIsGoProModalOpen(false)} 
            onSubscribe={onSubscribePro}
            featureName="GiiT AI Assistant"
        />
      </div>
    );
  }


  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] bg-brand-surface rounded-xl shadow-2xl overflow-hidden border border-brand-border/30">
      <header className="p-4 border-b border-brand-border/50 bg-brand-surface-alt/50 flex items-center space-x-2">
        <MessageSquareIcon className="w-6 h-6 text-brand-purple" />
        <h1 className="text-lg font-semibold text-brand-text">GiiT AI Assistant</h1>
        {/* FIX: Wrapped StarIcon in a span to apply the title prop for accessibility */}
        {currentUser?.is_pro_user && <span title="Pro Feature"><StarIcon className="w-4 h-4 text-yellow-400" /></span>}
      </header>
      
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} groundingMetadata={groundingMetadatas[msg.id]} />
        ))}
        {isLoading && apiKeyExists && currentUser?.is_pro_user && (
          <div className="flex justify-start mb-4">
             <div className="flex items-end gap-2.5">
                <img src={BOT_AVATAR_URL} alt="bot avatar" className="w-7 h-7 rounded-full border-2 border-brand-surface object-cover" />
                <div className="px-4 py-2.5 rounded-xl shadow-lg bg-brand-surface-alt">
                    <LoadingSpinner size="sm" message="GiiT AI is thinking..." />
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {error && apiKeyExists && currentUser?.is_pro_user && (
        <div className="p-3 bg-red-900/40 border-t border-red-700/40">
          <p className="text-red-300 text-sm text-center">{error}</p>
        </div>
      )}
      {!apiKeyExists && (
        <div className="p-3 bg-yellow-900/40 border-t border-yellow-700/40">
          <p className="text-yellow-300 text-sm text-center">
            AI features are currently unavailable (API Key missing). Admins are on it! 🛠️
          </p>
        </div>
      )}
      {!currentUser && apiKeyExists && ( // This case is less likely now due to page-level block
         <div className="p-3 bg-brand-purple/20 border-t border-brand-purple/40 text-center">
          <p className="text-brand-text text-sm">
            Please <Link to="/login" className="font-semibold hover:underline text-brand-cyan">log in</Link> or <Link to="/register" className="font-semibold hover:underline text-brand-cyan">register</Link> to chat with GiiT AI.
          </p>
        </div>
      )}

      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading}
        currentUser={currentUser}
        apiKeyExists={!!apiKeyExists} 
      />
       <GoProModal 
            isOpen={isGoProModalOpen && !currentUser?.is_pro_user} 
            onClose={() => setIsGoProModalOpen(false)} 
            onSubscribe={onSubscribePro}
            featureName="GiiT AI Assistant"
        />
    </div>
  );
};

export default ChatBotPage;