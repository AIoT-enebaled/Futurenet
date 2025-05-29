
import React from 'react';
import { MessengerMessage, MessengerUser } from '../types';
import { MOCK_MESSENGER_USERS } from '../constants'; 
import { CheckCheckIcon, FileIcon, PlayCircleIcon } from './icons';

interface MessengerMessageDisplayProps {
  message: MessengerMessage;
  currentUserId: string | null;
}

const MessengerMessageDisplay: React.FC<MessengerMessageDisplayProps> = ({ message, currentUserId }) => {
  const isCurrentUserSender = message.senderId === currentUserId;
  const sender = MOCK_MESSENGER_USERS.find(u => u.id === message.senderId) || { name: 'Unknown User', avatarUrl: `https://ui-avatars.com/api/?name=Unknown&background=random&color=fff&size=40` };

  const alignment = isCurrentUserSender ? 'items-end' : 'items-start';
  
  let bubbleColor;
  if (isCurrentUserSender) {
    bubbleColor = 'bg-gradient-to-br from-brand-purple to-brand-pink text-white';
  } else if (message.isAIMessage) {
    bubbleColor = 'bg-gradient-to-br from-brand-cyan to-brand-purple text-white';
  } else {
    bubbleColor = 'bg-brand-surface-alt text-brand-text';
  }
  
  const bubbleRounded = isCurrentUserSender ? 'rounded-tr-none' : 'rounded-tl-none';

  const renderMessageContent = () => {
    if (message.imageUrl) {
      return <img src={message.imageUrl} alt="Sent image" className="max-w-[200px] sm:max-w-xs rounded-md my-1 max-h-60 object-contain border border-black/10" />;
    }
    if (message.videoUrl) { // Mock
      return <p className="text-xs italic">[Mock Video: A cool tech demo.mp4]</p>; 
    }
    if (message.audioUrl) { // Mock
      return (
        <div className={`flex items-center space-x-2 p-2 ${isCurrentUserSender ? 'bg-white/10' : 'bg-brand-bg/50'} rounded-md`}>
          <PlayCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-current opacity-80" />
          <span className="text-xs">Voice Note (0:15)</span>
        </div>
      );
    }
    if (message.docUrl) { // Mock
      return (
        <a href={message.docUrl || "#"} target="_blank" rel="noopener noreferrer" className={`flex items-center space-x-2 p-2 ${isCurrentUserSender ? 'bg-white/10' : 'bg-brand-bg/50'} rounded-md hover:brightness-110 transition-all`}>
          <FileIcon className="w-5 h-5 sm:w-6 sm:h-6 text-current opacity-80" />
          <span className="text-xs underline">{message.docName || "Shared_Document.pdf"}</span>
        </a>
      );
    }
    return <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>;
  };

  return (
    <div className={`flex flex-col w-full mb-3 ${alignment}`}>
      <div className={`flex items-end gap-2 ${isCurrentUserSender ? 'flex-row-reverse' : 'flex-row'} max-w-[75%] sm:max-w-[70%]`}>
        {(!isCurrentUserSender || message.isAIMessage) && (
          <img src={sender.avatarUrl} alt={sender.name} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover self-end flex-shrink-0 border-2 border-brand-surface" />
        )}
        <div className={`px-3.5 py-2 rounded-xl shadow-md ${bubbleColor} ${bubbleRounded}`}>
          {!isCurrentUserSender && !message.isAIMessage && (
            <p className="text-xs font-semibold mb-0.5 text-brand-cyan">{sender.name}</p>
          )}
          {renderMessageContent()}
        </div>
      </div>
      <div className={`mt-1 text-xs flex items-center ${isCurrentUserSender ? 'justify-end pr-1' : `justify-start ${message.isAIMessage ? 'ml-8 sm:ml-9' : 'ml-8 sm:ml-9'}`}`}>
        <span className={`${isCurrentUserSender ? 'text-white/70' : 'text-brand-text-darker'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        {isCurrentUserSender && message.status && (
          <CheckCheckIcon className={`w-4 h-4 ml-1 ${message.status === 'read' ? 'text-brand-cyan' : (message.status === 'delivered' ? 'text-white/60' : 'text-white/40')}`} />
        )}
      </div>
    </div>
  );
};

export default MessengerMessageDisplay;