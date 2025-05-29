
import React, { useState } from 'react';
import Modal from './Modal';
import { MessengerUser } from '../types';
import { MOCK_MESSENGER_USERS } from '../constants';
import { UsersIcon, XIcon, SearchIcon } from './icons';

interface CreateGroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (groupName: string, selectedUsers: MessengerUser[]) => void;
  currentUser: MessengerUser | null;
}

const CreateGroupChatModal: React.FC<CreateGroupChatModalProps> = ({ isOpen, onClose, onCreateGroup, currentUser }) => {
  const [groupName, setGroupName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<MessengerUser[]>(currentUser ? [currentUser] : []);
  
  const commonInputStyles = "block w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple sm:text-sm text-brand-text placeholder-brand-text-muted transition-colors";
  const primaryButtonStyles = "flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-green-500 to-brand-cyan text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-glow-cyan transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-brand-surface";
  const secondaryButtonStyles = "flex items-center justify-center px-4 py-2 text-sm font-medium text-brand-text-muted bg-brand-surface-alt hover:bg-opacity-80 rounded-lg shadow-sm border border-brand-border hover:border-brand-purple/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface";


  const availableUsers = MOCK_MESSENGER_USERS.filter(
    user => user.id !== 'giit-ai' && 
            !selectedUsers.find(su => su.id === user.id) &&
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleUser = (user: MessengerUser) => {
    if (selectedUsers.find(su => su.id === user.id)) {
      if (user.id === currentUser?.id) return; 
      setSelectedUsers(selectedUsers.filter(su => su.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim() && selectedUsers.length >= 2) { 
      onCreateGroup(groupName.trim(), selectedUsers);
      onClose();
      setGroupName('');
      setSelectedUsers(currentUser ? [currentUser] : []);
    } else if (selectedUsers.length < 2) {
        alert("Please select at least one other member for the group chat.");
    } else if (!groupName.trim()){
        alert("Please enter a name for your group chat.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Group Chat" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="groupNameModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Group Name</label>
          <input
            type="text"
            id="groupNameModal"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            className={`${commonInputStyles} mt-1`}
            placeholder="e.g., Project Alpha Team"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-text-muted mb-0.5">Add Members</label>
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 my-2 p-2.5 bg-brand-bg/70 rounded-md border border-brand-border/50">
              {selectedUsers.map(user => (
                <span key={user.id} className="flex items-center bg-brand-purple/40 text-brand-text text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                  {user.name}
                  {user.id !== currentUser?.id && (
                    <button type="button" onClick={() => handleToggleUser(user)} className="ml-1.5 text-brand-pink hover:text-red-400 transition-colors" aria-label={`Remove ${user.name} from group`}>
                      <XIcon className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
          <div className="relative mt-1">
            <input
                type="text"
                placeholder="Search users to add..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${commonInputStyles} pl-10`}
                aria-label="Search users to add to group"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-text-muted" />
          </div>
        </div>
        {availableUsers.length > 0 && (
          <ul className="max-h-48 overflow-y-auto border border-brand-border/50 rounded-md scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
            {availableUsers.map((user) => (
              <li key={user.id} className="border-b border-brand-border/30 last:border-b-0">
                <button
                  type="button"
                  onClick={() => handleToggleUser(user)}
                  className="w-full flex items-center p-2.5 text-left hover:bg-brand-surface-alt transition-colors group focus:outline-none focus:ring-1 focus:ring-brand-purple"
                  aria-label={`Add ${user.name} to group`}
                >
                  <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full mr-3 object-cover border-2 border-brand-border/50 group-hover:border-brand-cyan/70 transition-colors" />
                  <span className="text-sm font-medium text-brand-text group-hover:text-brand-cyan transition-colors">{user.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {searchTerm && availableUsers.length === 0 && (
             <p className="text-sm text-brand-text-muted text-center py-2">No users found matching "{searchTerm}".</p>
        )}
        <div className="flex justify-end space-x-3 pt-3">
           <button type="button" onClick={onClose} className={secondaryButtonStyles}>Cancel</button>
          <button
            type="submit"
            disabled={!groupName.trim() || selectedUsers.length < 2}
            className={primaryButtonStyles}
          >
            Create Group
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateGroupChatModal;