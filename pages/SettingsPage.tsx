
import React, { useState, useEffect } from 'react';
import { SettingsPageProps, User } from '../types';
import { SettingsIcon, UserCircleIcon, LockIcon, BellIcon, ShieldIcon, Link2Icon, ActivityIcon, SunIcon, MoonIcon, EditIcon } from '../components/icons';
import Modal from '../components/Modal';

type SettingsTab = 'profile' | 'account' | 'notifications' | 'privacy' | 'integrations' | 'admin';

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, onUpdateUser, appSettings, onUpdateAppSettings }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  
  // Profile States
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [username, setUsername] = useState(currentUser.username || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [email, setEmail] = useState(currentUser.email); // Email change might need verification logic
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  
  const [feedbackMessage, setFeedbackMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    setDisplayName(currentUser.displayName);
    setUsername(currentUser.username || '');
    setBio(currentUser.bio || '');
    setEmail(currentUser.email);
    setAvatarUrl(currentUser.avatarUrl || '');
  }, [currentUser]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onUpdateUser({ displayName, username, bio, email, avatarUrl });
      setFeedbackMessage({type: 'success', text: 'Profile updated successfully!'});
    } catch (error) {
      setFeedbackMessage({type: 'error', text: 'Failed to update profile. Please try again.'});
    }
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleThemeToggle = () => {
    onUpdateAppSettings({ theme: appSettings.theme === 'dark' ? 'light' : 'dark' });
  };
  
  const handleNotificationSoundToggle = () => {
    onUpdateAppSettings({ notificationSounds: !appSettings.notificationSounds });
  };

  const commonInputStyles = "block w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple sm:text-sm text-brand-text placeholder-brand-text-muted transition-colors";
  const primaryButtonStyles = "flex items-center justify-center px-5 py-2.5 bg-gradient-purple-pink text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface disabled:opacity-70 disabled:cursor-not-allowed";
  
  const tabItems: { id: SettingsTab; name: string; icon: React.ElementType }[] = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'account', name: 'Account', icon: LockIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy & Security', icon: ShieldIcon },
    { id: 'integrations', name: 'Integrations', icon: Link2Icon },
    ...(currentUser.role === 'admin' ? [{ id: 'admin' as SettingsTab, name: 'Admin Controls', icon: ActivityIcon }] : [])
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="flex items-center space-x-4">
              <img 
                src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=7C3AED&color=fff&size=96`} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4 border-brand-purple shadow-md"
              />
              <div>
                <label htmlFor="avatarUrl" className="block text-sm font-medium text-brand-text-muted mb-1">Avatar URL</label>
                <input type="url" id="avatarUrl" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://example.com/avatar.png" className={`${commonInputStyles} max-w-md`} />
                 <button type="button" onClick={() => alert("File upload coming soon!")} className="mt-2 text-xs text-brand-cyan hover:underline">Upload Image (soon)</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-brand-text-muted mb-1">Display Name</label>
                <input type="text" id="displayName" value={displayName} onChange={e => setDisplayName(e.target.value)} required className={commonInputStyles} />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-brand-text-muted mb-1">Username</label>
                <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="your_unique_username" className={commonInputStyles} />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-text-muted mb-1">Email Address</label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className={commonInputStyles} />
               <p className="text-xs text-brand-text-darker mt-1">Email change might require verification (mock for now).</p>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-brand-text-muted mb-1">Bio</label>
              <textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Tell us a bit about yourself..." className={commonInputStyles}></textarea>
            </div>

            <h3 className="text-lg font-semibold text-brand-text pt-4 border-t border-brand-border/30">Appearance & Sounds</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-brand-bg rounded-lg border border-brand-border/40">
                    <span className="text-sm text-brand-text-muted">Theme</span>
                    <button type="button" onClick={handleThemeToggle} className="p-2 rounded-full hover:bg-brand-surface-alt transition-colors text-brand-text-muted" aria-label={`Switch to ${appSettings.theme === 'dark' ? 'light' : 'dark'} mode`}>
                        {appSettings.theme === 'dark' ? <SunIcon className="w-5 h-5 text-yellow-400"/> : <MoonIcon className="w-5 h-5 text-brand-purple"/>}
                    </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-brand-bg rounded-lg border border-brand-border/40">
                    <span className="text-sm text-brand-text-muted">Notification Sounds</span>
                    <label htmlFor="notifSoundToggle" className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="notifSoundToggle" className="sr-only peer" checked={appSettings.notificationSounds} onChange={handleNotificationSoundToggle} />
                        <div className="w-11 h-6 bg-brand-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-purple rounded-full peer dark:bg-brand-border peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-brand-border peer-checked:bg-brand-purple"></div>
                    </label>
                </div>
            </div>
            
            {feedbackMessage && (
              <div className={`p-3 rounded-md text-sm text-center ${feedbackMessage.type === 'success' ? 'bg-green-600/20 text-green-300 border border-green-600/40' : 'bg-red-700/20 text-red-300 border border-red-700/40'}`}>
                {feedbackMessage.text}
              </div>
            )}

            <div className="pt-5">
              <button type="submit" className={primaryButtonStyles}>
                Save Profile Changes
              </button>
            </div>
          </form>
        );
      case 'account': return <div className="text-brand-text-muted">Account management options (change password, 2FA, delete account) will be here. Mock UI for now.</div>;
      case 'notifications': return <div className="text-brand-text-muted">Notification preferences (mentions, messages, DMs) will be here. Mock UI for now.</div>;
      case 'privacy': return <div className="text-brand-text-muted">Privacy settings (who can see profile, send messages, block users) will be here. Mock UI for now.</div>;
      case 'integrations': return <div className="text-brand-text-muted">App integrations (Google, GitHub, etc.) will be here. Mock UI for now.</div>;
      case 'admin': return currentUser.role === 'admin' ? <div className="text-brand-text-muted">Admin-specific controls (audit logs, user reports) will be here. Mock UI for now.</div> : null;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <SettingsIcon className="w-10 h-10 text-brand-purple" />
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-text">Settings</h1>
          <p className="text-brand-text-muted text-sm sm:text-base">Manage your GiiT FutureNet preferences and account details.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
        {/* Sidebar Navigation for Settings */}
        <aside className="md:w-1/4 lg:w-1/5 flex-shrink-0">
          <nav className="space-y-1.5 sticky top-20">
            {tabItems.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group
                  ${activeTab === tab.id 
                    ? 'bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-md' 
                    : 'text-brand-text-muted hover:bg-brand-surface-alt hover:text-brand-text'}`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <tab.icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors duration-200 ${activeTab === tab.id ? 'text-white' : 'text-brand-text-darker group-hover:text-brand-cyan'}`} />
                {tab.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:w-3/4 lg:w-4/5">
          <div className="p-6 sm:p-8 bg-brand-surface rounded-xl shadow-xl border border-brand-border/30 min-h-[calc(100vh-15rem)]">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
