
import React from 'react';
import { User } from '../types';
import { EditIcon } from '../components/icons'; // UserCircleIcon removed as avatar is displayed
import { Link } from 'react-router-dom';

interface ProfilePageProps {
  currentUser: User | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser }) => {
  if (!currentUser) {
    return (
        <div className="text-center p-8 sm:p-12 bg-brand-surface rounded-xl shadow-2xl border border-brand-border/30">
            <h1 className="text-2xl font-bold text-brand-text mb-3">Profile Not Found</h1>
            <p className="text-brand-text-muted mb-6">It seems you're not logged in. Please log in to view your profile.</p>
            <Link 
              to="/login"
              className="px-6 py-2.5 bg-gradient-purple-pink text-white font-semibold rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105"
            >
              Go to Login
            </Link>
        </div>
    );
  }

  return (
    <div className="bg-brand-surface shadow-2xl rounded-xl p-6 sm:p-8 md:p-10 max-w-3xl mx-auto border border-brand-border/30">
      <div className="flex flex-col items-center sm:flex-row sm:items-start">
        <div className="relative mb-6 sm:mb-0 sm:mr-8">
            <img 
              src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName)}&background=7C3AED&color=fff&size=128`} 
              alt={`${currentUser.displayName}'s avatar`}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-brand-purple shadow-lg"
            />
            <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-brand-surface ${currentUser.role === 'admin' ? 'bg-brand-pink' : 'bg-brand-cyan'}`} title={currentUser.role === 'admin' ? 'Admin Status' : 'Online Status (mock)'}></div>
        </div>
        <div className="text-center sm:text-left flex-grow">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text break-all">{currentUser.displayName}</h1>
          <p className={`text-md font-medium capitalize ${currentUser.role === 'admin' ? 'text-brand-pink' : 'text-brand-cyan'}`}>
            {currentUser.role || 'Member'}
          </p>
          <p className="text-sm text-brand-text-muted mt-1 break-all">{currentUser.email}</p>
          <p className="text-xs text-brand-text-darker mt-0.5">GiiT ID: <span className="font-mono select-all">{currentUser.id}</span></p>
          
          <button 
            onClick={() => alert("Edit Profile feature coming soon!")}
            className="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-gradient-to-r from-brand-purple to-brand-pink hover:shadow-glow-purple focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface transition-all duration-300 transform hover:scale-105 active:scale-100"
          >
            <EditIcon className="w-4 h-4 mr-2" /> Edit Profile
          </button>
        </div>
      </div>

      <hr className="my-8 border-brand-border/40" />

      <div>
        <h2 className="text-xl font-semibold text-brand-text mb-4">My Activity (Placeholder)</h2>
        <ul className="space-y-3">
          <li className="p-3.5 bg-brand-bg/70 rounded-lg text-sm text-brand-text-muted border border-brand-border/30 hover:border-brand-purple/50 transition-colors">Posted in "General Discussion" - 2 hours ago</li>
          <li className="p-3.5 bg-brand-bg/70 rounded-lg text-sm text-brand-text-muted border border-brand-border/30 hover:border-brand-purple/50 transition-colors">Reacted to "Hackathon Announcement" - 1 day ago</li>
          <li className="p-3.5 bg-brand-bg/70 rounded-lg text-sm text-brand-text-muted border border-brand-border/30 hover:border-brand-purple/50 transition-colors">Joined "Frontend Wizards" team - 3 days ago</li>
        </ul>
      </div>
       <div className="mt-8">
        <h2 className="text-xl font-semibold text-brand-text mb-4">Account Settings (Placeholder)</h2>
        <div className="space-y-2">
            <button className="text-sm text-brand-cyan hover:text-brand-pink hover:underline transition-colors">Change Password</button><br/>
            <button className="text-sm text-brand-cyan hover:text-brand-pink hover:underline transition-colors">Notification Preferences</button><br/>
            <button className="text-sm text-red-400 hover:text-red-300 hover:underline transition-colors">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;