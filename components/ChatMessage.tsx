
import React from 'react';
import { ChatMessage as ChatMessageType, GroundingChunk } from '../types';
import { BOT_AVATAR_URL, USER_AVATAR_URL } from '../constants';
import { ExternalLinkIcon } from './icons';

interface ChatMessageProps {
  message: ChatMessageType;
  groundingMetadata?: { groundingChunks?: GroundingChunk[] };
}

const isImageUrl = (url: string): boolean => {
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, groundingMetadata }) => {
  const isUser = message.sender === 'user';
  const alignment = isUser ? 'justify-end' : 'justify-start';
  
  let bgColor, textColor;
  if (isUser) {
    bgColor = 'bg-gradient-to-br from-brand-purple to-brand-pink';
    textColor = 'text-white';
  } else if (message.sender === 'system') {
    bgColor = 'bg-transparent';
    textColor = 'text-brand-text-muted italic';
  } else { // bot
    bgColor = 'bg-brand-surface-alt';
    textColor = 'text-brand-text';
  }
  
  const avatarUrl = message.sender === 'bot' ? BOT_AVATAR_URL : (message.avatar || USER_AVATAR_URL);

  const renderMessageContent = (text: string) => {
    if (message.imageUrl || (typeof text === 'string' && isImageUrl(text))) {
        const imgSrc = message.imageUrl || text;
        return (
            <img 
                src={imgSrc} 
                alt="Shared content" 
                className="max-w-xs md:max-w-sm rounded-lg my-1 max-h-72 object-contain border border-brand-border/20 shadow-md" 
                onError={(e) => (e.currentTarget.style.display = 'none')} 
            />
        );
    }
    return <p className="text-sm whitespace-pre-wrap break-words">{text}</p>;
  };
  
  if (message.sender === 'system') {
    return (
      <div className="text-center my-3.5 w-full">
        <span className={`px-3.5 py-1.5 text-xs rounded-full ${bgColor} ${textColor}`}>{message.text}</span>
      </div>
    );
  }

  return (
    <div className={`flex ${alignment} mb-4 w-full`}>
      <div className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : ''} max-w-xl lg:max-w-2xl`}>
        <img src={avatarUrl} alt={`${message.sender} avatar`} className="w-7 h-7 rounded-full flex-shrink-0 self-end shadow-md border-2 border-brand-surface object-cover" />
        <div className="flex flex-col">
            <div className={`px-4 py-2.5 rounded-xl shadow-lg ${bgColor} ${textColor} ${isUser ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                {renderMessageContent(message.text)}
            </div>
            {message.sender === 'bot' && groundingMetadata?.groundingChunks && groundingMetadata.groundingChunks.length > 0 && (
                <div className={`mt-1.5 text-xs ${textColor} ${isUser ? 'text-right' : 'text-left'}`}>
                    <p className="font-semibold mb-1 text-brand-text-muted">Sources:</p>
                    <ul className="list-none pl-0.5 space-y-1">
                    {groundingMetadata.groundingChunks.map((chunk, index) => (
                        chunk.web?.uri && (
                        <li key={index} className="truncate">
                            <a
                            href={chunk.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-cyan hover:text-brand-pink flex items-center group transition-colors"
                            title={chunk.web.title || chunk.web.uri}
                            >
                            <ExternalLinkIcon className="w-3 h-3 mr-1.5 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity" />
                            <span className="truncate">{chunk.web.title || chunk.web.uri}</span>
                            </a>
                        </li>
                        )
                    ))}
                    </ul>
                </div>
            )}
            <p className={`text-xs mt-1 ${isUser ? 'text-right opacity-80' : 'text-left text-brand-text-darker'}`}>
                 {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;