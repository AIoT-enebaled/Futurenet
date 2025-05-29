
import React, { useEffect, useRef, useState } from 'react';
import { MessengerChat, MessengerMessage, User, MessengerUser, TypingIndicator, ChatMessage as BotChatMessage } from '../types'; // Renamed ChatMessage to BotChatMessage
import MessengerMessageDisplay from './MessengerMessageDisplay';
import MessengerInput from './MessengerInput';
import { PhoneIcon, VideoIcon as VideoCallIcon, MessageSquareIcon, UsersIcon, DotIcon, ChevronLeftIcon } from './icons'; 
import { MOCK_MESSENGER_USERS, BOT_AVATAR_URL } from '../constants'; // Removed MOCK_ALL_MESSAGES import
import { generateBotResponse } from '../services/geminiService'; 
import { useNavigate } from 'react-router-dom'; // For back button on mobile


interface MessengerChatViewProps {
  chat: MessengerChat | null;
  currentUser: User | null;
  onSendMessage: (chatId: string, messageText: string, type: 'text' | 'image' | 'voice' | 'doc') => void;
  isLoading: boolean;
  isMobileView: boolean; 
  allMessages: MessengerMessage[]; // New prop
}

const getLastSeenDisplay = (lastSeenValue?: string | Date): string => {
  if (typeof lastSeenValue === 'string') {
    return lastSeenValue; // "Online" or "2 hours ago"
  }
  if (lastSeenValue instanceof Date) {
    // More sophisticated date formatting could be added here
    const now = new Date();
    const diffMs = now.getTime() - lastSeenValue.getTime();
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 1) return 'Last seen just now';
    if (diffMins < 60) return `Last seen ${diffMins}m ago`;
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `Last seen ${diffHours}h ago`;
    return `Last seen ${lastSeenValue.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
  }
  return 'Offline'; 
};

export const MessengerChatView: React.FC<MessengerChatViewProps> = ({ chat, currentUser, onSendMessage, isLoading, isMobileView, allMessages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<MessengerMessage[]>([]);
  
  useEffect(() => {
    if (chat) {
      // Filter messages for the current chat from the passed 'allMessages' prop
      const chatMessages = allMessages.filter(m => m.chatId === chat.id)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      setMessages(chatMessages);
    } else {
      setMessages([]);
    }
  }, [chat, allMessages]); // Depend on chat and allMessages

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  // Placeholder for AI response generation if the chat is with GiiT AI
  const handleAIMessage = async (chatId: string, userMessageText: string) => {
    if (!currentUser || !chat || chat.type !== 'ai') return;

    const aiLogicUser = MOCK_MESSENGER_USERS.find(u => u.id === 'giit-ai');
    if (!aiLogicUser) return;

    // FIX: Ensure historyForGemini objects include 'id' and match BotChatMessage type.
    const historyForGemini: BotChatMessage[] = messages
      .filter(m => m.senderId === currentUser.id || m.senderId === aiLogicUser.id)
      .map(m => ({
          id: m.id, // Added missing 'id' property
          text: m.text || '', 
          sender: m.senderId === currentUser.id ? 'user' : 'bot',
          timestamp: m.timestamp,
          // avatar and other optional ChatMessage fields can be added if needed by geminiService
      }));
      
    try {
        const { text: botText } = await generateBotResponse(userMessageText, historyForGemini);
        const botMessage: MessengerMessage = {
            id: `msg-ai-${Date.now()}`,
            chatId: chatId,
            senderId: aiLogicUser.id,
            text: botText,
            timestamp: new Date(),
            isAIMessage: true,
            status: 'sent' 
        };
        // This should ideally be handled by a global state update or passed up to MessengerPage
        // For now, locally adding to this component's state for display.
        // setMessages(prev => [...prev, botMessage]); // This is handled by parent: App -> MessengerPage -> MessengerChatView via allMessages prop
        // And also call the onSendMessage prop if it's meant to update the global state
        onSendMessage(chatId, botText, 'text'); // This might cause duplicate messages if not handled carefully
    } catch (error) {
        console.error("AI response error:", error);
        const errorMessage: MessengerMessage = {
            id: `msg-ai-err-${Date.now()}`,
            chatId: chatId,
            senderId: aiLogicUser.id,
            text: "Sorry, I couldn't process that. Please try again.",
            timestamp: new Date(),
            isAIMessage: true,
            status: 'sent'
        };
        // setMessages(prev => [...prev, errorMessage]); // Handled by parent
        onSendMessage(chatId, "Sorry, I couldn't process that. Please try again.", 'text');
    }
  };
  
  const navigate = useNavigate(); // For back button on mobile

  if (!chat && isMobileView) {
    // On mobile, if no chat is selected, this view might not even be rendered.
    // Or it could show a prompt to select a chat.
    // This case is primarily handled by MessengerPage logic determining what to render.
    return null; 
  }

  const otherParticipant = chat?.type === 'private' ? chat.participants.find(p => p.id !== currentUser?.id) : null;
  const chatName = chat?.type === 'group' ? chat.name : chat?.type === 'ai' ? chat.name : otherParticipant?.name;
  const chatAvatar = chat?.avatarUrl || (otherParticipant?.avatarUrl || BOT_AVATAR_URL);
  const onlineStatus = chat?.type === 'ai' ? 'Online' : (otherParticipant?.isOnline ? 'Online' : getLastSeenDisplay(otherParticipant?.lastSeen));


 return (
    <div className="flex flex-col h-full bg-brand-bg">
      {chat ? (
        <>
          <header className="p-3.5 border-b border-brand-border/50 flex items-center justify-between bg-brand-surface shadow-sm">
            <div className="flex items-center">
              {isMobileView && (
                <button onClick={() => navigate('/messenger')} className="mr-2 p-1.5 text-brand-text-muted hover:text-brand-text rounded-full hover:bg-brand-surface-alt transition-colors" aria-label="Back to chat list">
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
              )}
              <img src={chatAvatar} alt={chatName} className="w-9 h-9 rounded-full object-cover border-2 border-brand-border/40" />
              <div className="ml-2.5">
                <h2 className="text-sm sm:text-md font-semibold text-brand-text truncate" title={chatName}>{chatName}</h2>
                <p className="text-xs text-brand-text-muted">{onlineStatus}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <button title="Voice Call (TBD)" className="p-2 text-brand-text-muted hover:text-brand-cyan rounded-full hover:bg-brand-surface-alt transition-colors" aria-label="Start voice call">
                <PhoneIcon className="w-5 h-5" />
              </button>
              <button title="Video Call (TBD)" className="p-2 text-brand-text-muted hover:text-brand-cyan rounded-full hover:bg-brand-surface-alt transition-colors" aria-label="Start video call">
                <VideoCallIcon className="w-5 h-5" />
              </button>
            </div>
          </header>

          <div ref={messagesEndRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
            {messages.map((msg) => (
              <MessengerMessageDisplay key={msg.id} message={msg} currentUserId={currentUser?.id || null} />
            ))}
             {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="flex items-end gap-2">
                  <img src={BOT_AVATAR_URL} alt="bot avatar" className="w-6 h-6 rounded-full border-2 border-brand-surface object-cover" />
                  <div className="px-3 py-1.5 rounded-xl shadow-lg bg-brand-surface-alt">
                    <DotIcon className="w-5 h-5 text-brand-text-muted animate-pulse" />
                  </div>
                </div>
              </div>
            )}
            {chat.typing && chat.typing.filter(t => t.userId !== currentUser?.id).map(typingUser => (
                 <div key={typingUser.userId} className="flex justify-start mb-3">
                    <div className="flex items-end gap-2">
                    <img src={MOCK_MESSENGER_USERS.find(u=>u.id === typingUser.userId)?.avatarUrl || BOT_AVATAR_URL} alt="typing user avatar" className="w-6 h-6 rounded-full border-2 border-brand-surface object-cover" />
                    <div className="px-3 py-1.5 rounded-xl shadow-lg bg-brand-surface-alt">
                        <p className="text-xs text-brand-text-muted italic">{typingUser.userName} is typing
                            <span className="animate-pulse inline-block ml-1">.</span>
                            <span className="animate-pulse inline-block animation-delay-200">.</span>
                            <span className="animate-pulse inline-block animation-delay-400">.</span>
                        </p>
                    </div>
                    </div>
                </div>
            ))}
          </div>
          <MessengerInput
            onSendMessage={(messageText, type) => {
                onSendMessage(chat.id, messageText, type);
                 if (chat.type === 'ai') {
                    // Simulate AI thinking and responding
                    // This would ideally be handled in MessengerPage or a service
                    setTimeout(async () => {
                        await handleAIMessage(chat.id, messageText);
                    }, 500 + Math.random() * 1000);
                 }
            }}
            isLoading={isLoading}
            currentUser={currentUser}
            isChatActive={!!chat}
          />
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <MessageSquareIcon className="w-16 h-16 text-brand-text-darker mb-4" />
          <p className="text-xl font-semibold text-brand-text">Select a chat</p>
          <p className="text-brand-text-muted">Or start a new conversation to begin messaging.</p>
        </div>
      )}
    </div>
  );
};
