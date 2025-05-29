
import React, { useState } from 'react';
import Modal from './Modal';
import { MessengerUser } from '../types';
import { MOCK_MESSENGER_USERS } from '../constants'; 
import { UserCircleIcon, SendIcon, SearchIcon } from './icons';

interface StartNewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (user: MessengerUser) => void;
  currentUser: MessengerUser | null; 
}

const StartNewChatModal: React.FC<StartNewChatModalProps> = ({ isOpen, onClose, onStartChat, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const availableUsers = MOCK_MESSENGER_USERS.filter(
    user => user.id !== currentUser?.id && 
            user.id !== 'giit-ai' && 
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Start New Direct Message" size="md">
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border border-brand-border bg-brand-bg text-brand-text rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple placeholder-brand-text-muted transition-colors"
            aria-label="Search users to start a new chat"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-text-muted" />
        </div>
        {availableUsers.length > 0 ? (
          <ul className="max-h-60 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
            {availableUsers.map((user) => (
              <li key={user.id}>
                <button
                  onClick={() => {
                    onStartChat(user);
                    onClose();
                  }}
                  className="w-full flex items-center p-2.5 text-left rounded-lg hover:bg-brand-surface-alt transition-colors group focus:outline-none focus:ring-1 focus:ring-brand-purple"
                  aria-label={`Start chat with ${user.name}`}
                >
                  <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full mr-3 object-cover border-2 border-brand-border/50 group-hover:border-brand-purple/70 transition-colors" />
                  <span className="text-sm font-medium text-brand-text group-hover:text-brand-cyan transition-colors">{user.name}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-brand-text-muted text-center py-4">No users found matching your search.</p>
        )}
      </div>
    </Modal>
  );
};

export default StartNewChatModal;