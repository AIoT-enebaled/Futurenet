
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Team } from '../types';

interface EditTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTeam: (teamData: Partial<Team>) => void;
  team: Team;
}

const EditTeamModal: React.FC<EditTeamModalProps> = ({ isOpen, onClose, onUpdateTeam, team }) => {
  const [name, setName] = useState(team.name);
  const [description, setDescription] = useState(team.description);
  const [imageUrl, setImageUrl] = useState(team.imageUrl || '');
  const [isPrivate, setIsPrivate] = useState(team.isPrivate);

  useEffect(() => {
    if (isOpen) {
      setName(team.name);
      setDescription(team.description);
      setImageUrl(team.imageUrl || '');
      setIsPrivate(team.isPrivate);
    }
  }, [isOpen, team]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTeam({
      name,
      description,
      imageUrl: imageUrl || undefined, 
      isPrivate,
    });
    onClose();
  };
  
  const commonInputStyles = "mt-1 block w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple sm:text-sm text-brand-text placeholder-brand-text-muted transition-colors";
  const primaryButtonStyles = "flex items-center justify-center px-4 py-2 bg-gradient-purple-pink text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface";
  const secondaryButtonStyles = "flex items-center justify-center px-4 py-2 text-sm font-medium text-brand-text-muted bg-brand-surface-alt hover:bg-opacity-80 rounded-lg shadow-sm border border-brand-border hover:border-brand-purple/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface";


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Team: ${team.name.substring(0,30)}...`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="editTeamNameModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Team Name</label>
          <input
            type="text"
            id="editTeamNameModal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={commonInputStyles}
          />
        </div>
        <div>
          <label htmlFor="editTeamDescModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Description</label>
          <textarea
            id="editTeamDescModal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
            className={commonInputStyles}
          />
        </div>
        <div>
          <label htmlFor="editTeamImgModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Team Image URL (Optional)</label>
          <input
            type="url"
            id="editTeamImgModal"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://picsum.photos/seed/myteam/100/100"
            className={commonInputStyles}
          />
        </div>
        <div className="flex items-center pt-1">
          <input
            id="editTeamPrivateModal"
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="h-4 w-4 text-brand-purple bg-brand-bg border-brand-border rounded focus:ring-brand-purple focus:ring-offset-brand-surface cursor-pointer"
          />
          <label htmlFor="editTeamPrivateModal" className="ml-2 block text-sm text-brand-text cursor-pointer">Make this team private (invite-only)</label>
        </div>
        <div className="flex justify-end space-x-3 pt-3">
          <button type="button" onClick={onClose} className={secondaryButtonStyles}>Cancel</button>
          <button type="submit" className={primaryButtonStyles}>Save Changes</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTeamModal;