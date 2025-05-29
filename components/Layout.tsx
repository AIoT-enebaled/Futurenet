
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import GlobalChatWidget from './GlobalChatWidget'; 
import GoProModal from './GoProModal'; // New import
import { User, SubscriptionTier } from '../types';
import { MessageSquareIcon, XIcon, StarIcon } from './icons'; 

interface LayoutProps {
  currentUser: User | null;
  onLogout: () => void;
  apiKeyExists: boolean; 
  onSubscribePro: (tier: SubscriptionTier) => void; // New prop
}

const Layout: React.FC<LayoutProps> = ({ currentUser, onLogout, apiKeyExists, onSubscribePro }) => {
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);
  const [isGoProModalOpen, setIsGoProModalOpen] = useState(false);

  const handleToggleChatWidget = () => {
    if (!currentUser?.is_pro_user && apiKeyExists) {
      setIsGoProModalOpen(true);
    } else if (apiKeyExists) {
      setIsChatWidgetOpen(!isChatWidgetOpen);
    } else {
      alert("AI Assistant is currently unavailable (API Key missing).");
    }
  };

  return (
    <div className="flex h-screen bg-brand-bg text-brand-text relative font-sans">
      <Sidebar currentUser={currentUser} onLogout={onLogout} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-bg">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <Outlet />
        </div>
      </main>

      {apiKeyExists && (
        <button
          onClick={handleToggleChatWidget}
          className="fixed bottom-6 right-6 bg-gradient-purple-pink text-white p-3.5 rounded-full shadow-xl hover:shadow-glow-pink focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-bg z-40 transition-all duration-300 ease-in-out hover:scale-110 active:scale-100 flex items-center"
          aria-label={isChatWidgetOpen ? "Close GiiT AI Chat" : "Open GiiT AI Chat"}
          title={isChatWidgetOpen ? "Close GiiT AI Chat" : (currentUser?.is_pro_user ? "Open GiiT AI Chat" : "Upgrade to Pro for GiiT AI")}
        >
          {isChatWidgetOpen ? <XIcon className="w-6 h-6" /> : <MessageSquareIcon className="w-6 h-6" />}
          {!currentUser?.is_pro_user && (
            <StarIcon className="w-3 h-3 fill-yellow-400 text-yellow-500 absolute -top-1 -right-1" />
          )}
        </button>
      )}

      {isChatWidgetOpen && apiKeyExists && currentUser?.is_pro_user && (
        <GlobalChatWidget
          currentUser={currentUser}
          apiKeyExists={apiKeyExists}
          onClose={() => setIsChatWidgetOpen(false)}
          onSubscribePro={onSubscribePro} // Pass through
        />
      )}
      
      <GoProModal 
        isOpen={isGoProModalOpen}
        onClose={() => setIsGoProModalOpen(false)}
        onSubscribe={onSubscribePro}
        featureName="GiiT AI Assistant"
      />
    </div>
  );
};

export default Layout;
