
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Team, User, TeamsPageProps } from '../types'; 
import { PlusCircleIcon, UsersIcon, LogInIcon } from '../components/icons';
import Modal from '../components/Modal'; // Import Modal

interface TeamCardProps {
  team: Team;
}
const TeamCard: React.FC<TeamCardProps> = ({ team }) => (
  <div className="bg-brand-surface rounded-xl shadow-xl overflow-hidden p-5 sm:p-6 flex flex-col items-center text-center transition-all duration-300 ease-in-out hover:shadow-glow-cyan transform hover:-translate-y-1.5 border border-brand-border/30 hover:border-brand-cyan/40">
    {team.imageUrl ? 
        <img className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mb-4 border-4 border-brand-border/40 group-hover:border-brand-cyan/60 shadow-lg" src={team.imageUrl} alt={team.name} />
        : <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-brand-bg flex items-center justify-center mb-4 border-4 border-brand-border/40 shadow-lg"><UsersIcon className="w-10 h-10 sm:w-12 sm:h-12 text-brand-text-muted"/></div>
    }
    <h3 className="text-lg sm:text-xl font-semibold text-brand-text mb-1 line-clamp-1" title={team.name}>{team.name}</h3>
    <p className="text-brand-text-muted text-sm mb-2.5 h-10 overflow-hidden text-ellipsis line-clamp-2">{team.description}</p>
    <span className={`text-xs px-2.5 py-1 rounded-full mb-3 font-medium border ${team.isPrivate ? 'bg-red-700/20 text-red-400 border-red-700/30' : 'bg-green-600/20 text-green-400 border-green-600/30'}`}>
      {team.isPrivate ? 'Private' : 'Public'}
    </span>
    <p className="text-sm text-brand-text-muted mb-4">{team.membersCount} Members</p>
    <Link 
        to={`/teams/${team.id}`} 
        title={`View Team: ${team.name}`}
        className="w-full mt-auto px-4 py-2.5 bg-gradient-to-r from-brand-cyan to-brand-purple text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-glow-cyan transition-all duration-300 transform hover:scale-105 block focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2 focus:ring-offset-brand-surface"
    >
      View Team
    </Link>
  </div>
);


const TeamsPage: React.FC<TeamsPageProps> = ({ currentUser, teams, onCreateTeam }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Changed from showCreateForm
  const [newTeamData, setNewTeamData] = useState<Omit<Team, 'id' | 'createdAt' | 'membersCount' | 'members' | 'channels' | 'files'>>({ 
      name: '', description: '', isPrivate: false, imageUrl: '' 
  });
  
  const commonInputStyles = "mt-1 block w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple sm:text-sm text-brand-text placeholder-brand-text-muted transition-colors";
  const primaryButtonStyles = "flex items-center justify-center bg-gradient-purple-pink text-white font-semibold py-2.5 px-5 rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface";
  const secondaryButtonStyles = "flex items-center justify-center bg-brand-surface text-brand-text-muted font-semibold py-2.5 px-5 rounded-lg shadow-md hover:bg-brand-surface-alt hover:text-brand-text border border-brand-border/70 hover:border-brand-purple/70 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface";


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
        setNewTeamData(prev => ({ ...prev, [name]: target.checked }));
    } else {
        setNewTeamData(prev => ({ ...prev, [name]: target.value }));
    }
  };

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (newTeamData.name && newTeamData.description) {
      onCreateTeam({...newTeamData, imageUrl: newTeamData.imageUrl || `https://picsum.photos/seed/team-${newTeamData.name.replace(/\s+/g, '-')}/100/100`});
      setNewTeamData({ name: '', description: '', isPrivate: false, imageUrl: '' });
      setIsCreateModalOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
         <div className="flex items-center space-x-3">
          <UsersIcon className="w-10 h-10 text-brand-purple" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-text">Team Hub</h1>
            <p className="text-brand-text-muted text-sm sm:text-base">Collaborate, learn, and build together in dedicated teams.</p>
          </div>
        </div>
        {currentUser ? (
          <button
            onClick={() => setIsCreateModalOpen(true)} // Changed to open modal
            title="Create New Team"
            className={primaryButtonStyles}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Create Team
          </button>
        ) : (
           <Link
            to="/login"
            title="Log in to Create Team"
            className={secondaryButtonStyles}
          >
            <LogInIcon className="w-5 h-5 mr-2" />
            Log in to Create
          </Link>
        )}
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Launch New Team" size="lg">
        <form onSubmit={handleCreateTeamSubmit} className="space-y-4">
            <div>
              <label htmlFor="teamNameModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Team Name</label>
              <input type="text" id="teamNameModal" name="name" value={newTeamData.name} onChange={handleInputChange} required className={commonInputStyles} placeholder="e.g., Frontend Wizards"/>
            </div>
            <div>
              <label htmlFor="teamDescModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Description</label>
              <textarea id="teamDescModal" name="description" value={newTeamData.description} onChange={handleInputChange} rows={3} required className={commonInputStyles} placeholder="What is this team about?"></textarea>
            </div>
             <div>
              <label htmlFor="teamImgModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Team Image URL (Optional)</label>
              <input type="url" id="teamImgModal" name="imageUrl" value={newTeamData.imageUrl} onChange={handleInputChange} placeholder="https://example.com/team-avatar.png (auto-generates if blank)" className={commonInputStyles} />
            </div>
            <div className="flex items-center pt-2">
              <input id="teamPrivateModal" name="isPrivate" type="checkbox" checked={newTeamData.isPrivate} onChange={handleInputChange} className="h-4 w-4 text-brand-purple bg-brand-bg border-brand-border rounded focus:ring-brand-purple focus:ring-offset-brand-surface cursor-pointer" />
              <label htmlFor="teamPrivateModal" className="ml-2 block text-sm text-brand-text cursor-pointer">Make this team private (invite-only)</label>
            </div>
            <div className="flex justify-end space-x-3 pt-3">
                 <button type="button" onClick={() => setIsCreateModalOpen(false)} className={`${secondaryButtonStyles} py-2 px-4 text-sm`}>Cancel</button>
                <button type="submit" title="Submit New Team" className={`${primaryButtonStyles} py-2 px-4 text-sm`}>Create Team</button>
            </div>
          </form>
      </Modal>

      {teams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {teams.map((team: Team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <UsersIcon className="w-16 h-16 text-brand-text-darker mx-auto mb-4" />
          <p className="text-xl text-brand-text-muted">No teams formed yet.</p>
           <p className="text-sm text-brand-text-darker mt-1">{currentUser ? "Why not create one and lead the way?" : "Log in to create or join a team."}</p>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
