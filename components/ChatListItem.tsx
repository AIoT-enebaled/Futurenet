
import React from 'react';
import { MessengerChat } from '../types';
import { DotIcon } from './icons'; 

interface ChatListItemProps {
  chat: MessengerChat;
  isSelected: boolean;
  onSelectChat: (chatId: string) => void;
  currentUserId: string | null;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, isSelected, onSelectChat, currentUserId }) => {
  const getDisplayName = () => {
    if (chat.type === 'ai') return chat.name || 'GiiT AI';
    if (chat.type === 'group') return chat.name || 'Group Chat';
    // For private chat, find the other participant
    const otherParticipant = chat.participants.find(p => p.id !== currentUserId);
    return otherParticipant?.name || 'Unknown User';
  };

  const getAvatarUrl = () => {
    if (chat.avatarUrl) return chat.avatarUrl; 
    if (chat.type === 'private') {
      const otherParticipant = chat.participants.find(p => p.id !== currentUserId);
      return otherParticipant?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName())}&background=random&color=fff&size=40`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName())}&background=7C3AED&color=fff&size=40`; // Default group avatar
  };
  
  // For private chats, online status is of the other participant. For AI, always online. For group, might be complex (e.g. # of online members).
  const isOnline = chat.type === 'ai' ? true : (chat.type === 'private' ? chat.participants.find(p => p.id !== currentUserId)?.isOnline : false);


  return (
    <button
      onClick={() => onSelectChat(chat.id)}
      className={`w-full flex items-center p-3 text-left transition-colors duration-150 ease-in-out rounded-lg group
                  ${isSelected ? 'bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-lg' : 'hover:bg-brand-surface-alt text-brand-text'}`}
      aria-current={isSelected ? "page" : undefined}                  
    >
      <div className="relative flex-shrink-0">
        <img src={getAvatarUrl()} alt={getDisplayName()} className="w-10 h-10 rounded-full object-cover border-2 border-brand-border/30 group-hover:border-brand-purple/50 transition-colors" />
        {isOnline && chat.type !== 'group' && ( // Online indicator for private & AI chats
          <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ${isSelected ? 'bg-green-300 border-brand-purple' : 'bg-green-400 border-brand-surface'} border-2 `} title="Online"></span>
        )}
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-brand-text group-hover:text-brand-text'}`}>
            {getDisplayName()}
          </p>
          {chat.lastMessage && (
            <p className={`text-xs flex-shrink-0 ${isSelected ? 'text-white/80' : 'text-brand-text-muted'}`}>
              {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
        {chat.lastMessage ? (
          <p className={`text-xs truncate ${isSelected ? 'text-white/90' : 'text-brand-text-muted'}`}>
            {chat.lastMessage.senderId === currentUserId ? <span className={isSelected ? 'text-white/90' : 'text-brand-text-muted'}>You: </span> : ''}
            {chat.lastMessage.text || (chat.lastMessage.imageUrl ? 'Photo' : chat.lastMessage.audioUrl ? 'Voice note' : chat.lastMessage.docUrl ? 'Document' : 'New message')}
          </p>
        ) : (
          <p className={`text-xs truncate italic ${isSelected ? 'text-white/70' : 'text-brand-text-darker'}`}>No messages yet</p>
        )}
         {chat.typing && chat.typing.length > 0 && chat.typing.every(t => t.userId !== currentUserId) && (
          <p className={`text-xs truncate italic ${isSelected ? 'text-white/90' : 'text-brand-cyan'}`}>
            {chat.typing.map(t => t.userName).join(', ')} {chat.typing.length > 1 ? 'are' : 'is'} typing...
          </p>
        )}
      </div>
      {chat.unreadCount && chat.unreadCount > 0 && !isSelected && (
        <span className="ml-2 text-xs bg-brand-pink text-white font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
          {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
        </span>
      )}
    </button>
  );
};

export default ChatListItem;