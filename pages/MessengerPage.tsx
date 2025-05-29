
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, MessengerChat, MessengerUser, MessengerMessage } from '../types';
import { MOCK_MESSENGER_USERS, BOT_AVATAR_URL } from '../constants';
import ChatListItem from '../components/ChatListItem';
import { MessengerChatView } from '../components/MessengerChatView';
import StartNewChatModal from '../components/StartNewChatModal';
import CreateGroupChatModal from '../components/CreateGroupChatModal';
import { PlusCircleIcon, UsersPlusIcon, SearchIcon, MessageSquareIcon, LogInIcon } from '../components/icons';
import { Link } from 'react-router-dom';


interface MessengerPageProps {
  currentUser: User | null;
  chats: MessengerChat[];
  setChats: React.Dispatch<React.SetStateAction<MessengerChat[]>>;
  allMessages: MessengerMessage[];
  setAllMessages: React.Dispatch<React.SetStateAction<MessengerMessage[]>>;
}

export const MessengerPage: React.FC<MessengerPageProps> = ({ 
    currentUser, 
    chats, 
    setChats, 
    allMessages, 
    setAllMessages 
}) => {
  const { chatId: activeChatIdFromParams } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();

  const [activeChat, setActiveChat] = useState<MessengerChat | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);


  const currentMessengerUser: MessengerUser | null = currentUser 
    ? MOCK_MESSENGER_USERS.find(u => u.id === currentUser.id) || 
      { id: currentUser.id, name: currentUser.displayName, avatarUrl: currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName)}&background=random&color=fff&size=40`, isOnline: true } 
    : null;


  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (activeChatIdFromParams) {
      const chatIndex = chats.findIndex(c => c.id === activeChatIdFromParams);
  
      if (chatIndex !== -1) {
        const foundChat = chats[chatIndex];
  
        if (activeChat?.id !== foundChat.id) {
          setActiveChat(foundChat);
        }
  
        if ((foundChat.unreadCount || 0) > 0) {
          setChats(prevChats => {
            const newChats = [...prevChats]; 
            if (newChats[chatIndex] && newChats[chatIndex].id === activeChatIdFromParams) {
                 newChats[chatIndex] = { ...newChats[chatIndex], unreadCount: 0 };
            }
            return newChats;
          });
        }
      } else {
        if (activeChat !== null) {
          setActiveChat(null);
        }
      }
    } else {
      if (activeChat !== null && !isMobileView) { 
         // setActiveChat(null); // Potentially keep showing last active on desktop
      } else if (activeChat !== null && isMobileView) {
        setActiveChat(null);
      }
    }
  }, [activeChatIdFromParams, chats, activeChat, isMobileView, setChats]);


  const handleSelectChat = (chatId: string) => {
    const chatToSelect = chats.find(c => c.id === chatId);
    if (chatToSelect) {
      setActiveChat(chatToSelect); 
      if ((chatToSelect.unreadCount || 0) > 0) {
          setChats(prevChats => prevChats.map(c => c.id === chatId ? {...c, unreadCount: 0} : c));
      }
      navigate(`/messenger/${chatId}`); 
    }
  };

  const handleSendMessage = (chatId: string, messageText: string, type: 'text' | 'image' | 'voice' | 'doc') => {
    if (!currentUser) return;
    
    setIsLoading(true); 
    setTimeout(() => {
      const newMessage: MessengerMessage = {
        id: `msg-${Date.now()}`,
        chatId,
        senderId: currentUser.id,
        text: type === 'text' ? messageText : undefined,
        imageUrl: type === 'image' ? messageText : undefined, 
        timestamp: new Date(),
        status: 'sent', 
      };
      
      setAllMessages(prev => [...prev, newMessage]);
      setChats(prevChats => prevChats.map(c => 
        c.id === chatId 
          ? { ...c, lastMessage: newMessage, typing: c.typing?.filter(t => t.userId !== currentUser.id) } 
          : c
      ));
      setIsLoading(false);

      const currentChat = chats.find(c => c.id === chatId);
      if (currentChat && currentChat.type !== 'ai') {
        const otherParticipants = currentChat.participants.filter(p => p.id !== currentUser.id);
        if (otherParticipants.length > 0) {
          const randomParticipant = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
          setChats(prev => prev.map(c => c.id === chatId ? {...c, typing: [...(c.typing || []), {userId: randomParticipant.id, userName: randomParticipant.name}]} : c));

          setTimeout(() => {
            const mockReply: MessengerMessage = {
              id: `msg-reply-${Date.now()}`,
              chatId,
              senderId: randomParticipant.id,
              text: `Got it! "${messageText.substring(0, 20)}..."`,
              timestamp: new Date(),
              status: 'delivered'
            };
            setAllMessages(prev => [...prev, mockReply]);
            setChats(prevChats => prevChats.map(c => 
              c.id === chatId 
                ? { ...c, lastMessage: mockReply, unreadCount: (c.id === activeChat?.id ? 0 : (c.unreadCount || 0) + 1), typing: c.typing?.filter(t => t.userId !== randomParticipant.id) } 
                : c
            ));
          }, 1500 + Math.random() * 2000);
        }
      }
    }, 500);
  };


  const handleStartNewChat = (userToChatWith: MessengerUser) => {
    if (!currentMessengerUser) return;

    const existingChat = chats.find(c => 
      c.type === 'private' && 
      c.participants.length === 2 && 
      c.participants.some(p => p.id === currentMessengerUser.id) &&
      c.participants.some(p => p.id === userToChatWith.id)
    );

    if (existingChat) {
      handleSelectChat(existingChat.id);
    } else {
      const newChatId = `chat-priv-${Date.now()}`;
      const newPrivateChat: MessengerChat = {
        id: newChatId,
        type: 'private',
        participants: [currentMessengerUser, userToChatWith], 
        lastMessage: undefined,
        unreadCount: 0,
        avatarUrl: userToChatWith.avatarUrl, 
        name: userToChatWith.name 
      };
      setChats(prevChats => [newPrivateChat, ...prevChats]);
      handleSelectChat(newChatId);
    }
    setIsNewChatModalOpen(false);
  };

  const handleCreateGroup = (groupName: string, selectedUsers: MessengerUser[]) => {
    if (!currentMessengerUser) return;

    const newGroupId = `chat-grp-${Date.now()}`;
    const newGroupChat: MessengerChat = {
        id: newGroupId,
        type: 'group',
        name: groupName,
        participants: selectedUsers, 
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(groupName)}&background=7C3AED&color=fff&size=40`, 
        lastMessage: undefined,
        unreadCount: 0,
    };
    setChats(prevChats => [newGroupChat, ...prevChats]);
    handleSelectChat(newGroupId);
    setIsCreateGroupModalOpen(false);
  };


  const filteredChats = chats
    .filter(chat => {
      if (!searchTerm) return true;
      if (chat.name?.toLowerCase().includes(searchTerm.toLowerCase())) return true;
      if (chat.type === 'private') {
        const otherParticipant = chat.participants.find(p => p.id !== currentUser?.id);
        return otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    })
    .sort((a, b) => {
        const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
        const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
        return timeB - timeA; 
    });

  if (!currentUser) {
    return (
         <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center p-8 bg-brand-surface rounded-xl shadow-xl border border-brand-border/30">
            <LogInIcon className="w-16 h-16 text-brand-purple mb-6" />
            <h1 className="text-2xl font-bold text-brand-text mb-3">Access Denied</h1>
            <p className="text-brand-text-muted mb-6">Please log in to use the GiiT Messenger.</p>
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
     <div className="flex h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] bg-brand-surface text-brand-text overflow-hidden rounded-xl shadow-2xl border border-brand-border/30">
        {(!isMobileView || (isMobileView && !activeChatIdFromParams)) && (
            <aside className={`w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-brand-border/40 flex flex-col bg-brand-surface ${isMobileView && activeChatIdFromParams ? 'hidden' : 'flex'}`}>
                <header className="p-3.5 border-b border-brand-border/50 flex items-center justify-between sticky top-0 bg-brand-surface/90 backdrop-blur-sm z-10">
                    <div className="flex items-center">
                        <MessageSquareIcon className="w-6 h-6 text-brand-purple mr-2 flex-shrink-0"/>
                        <h1 className="text-lg font-semibold text-brand-text">Messenger</h1>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button onClick={() => setIsCreateGroupModalOpen(true)} title="Create New Group Chat" className="p-2 text-brand-text-muted hover:text-brand-cyan rounded-full hover:bg-brand-surface-alt transition-colors">
                            <UsersPlusIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => setIsNewChatModalOpen(true)} title="Start New Direct Message" className="p-2 text-brand-text-muted hover:text-brand-cyan rounded-full hover:bg-brand-surface-alt transition-colors">
                            <PlusCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                </header>
                <div className="p-2.5 border-b border-brand-border/50">
                    <div className="relative">
                        <input
                        type="text"
                        placeholder="Search chats or start new..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-brand-border bg-brand-bg text-brand-text rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple placeholder-brand-text-muted text-sm transition-colors"
                        />
                        <SearchIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
                {filteredChats.length > 0 ? (
                    filteredChats.map(chat => (
                    <ChatListItem 
                        key={chat.id} 
                        chat={chat} 
                        isSelected={activeChat?.id === chat.id} 
                        onSelectChat={handleSelectChat}
                        currentUserId={currentUser?.id || null}
                    />
                    ))
                ) : (
                    <p className="p-4 text-center text-sm text-brand-text-muted">
                    {searchTerm ? 'No chats match your search.' : 'No chats yet. Start a new conversation!'}
                    </p>
                )}
                </nav>
            </aside>
        )}

        {(!isMobileView || (isMobileView && !!activeChatIdFromParams)) && (
             <main className={`flex-1 flex flex-col bg-brand-bg ${isMobileView && !activeChatIdFromParams ? 'hidden' : 'flex'}`}>
                <MessengerChatView 
                    chat={activeChat} 
                    currentUser={currentUser}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    isMobileView={isMobileView}
                    allMessages={allMessages} 
                />
            </main>
        )}


        {currentMessengerUser && (
            <>
                <StartNewChatModal 
                    isOpen={isNewChatModalOpen} 
                    onClose={() => setIsNewChatModalOpen(false)}
                    onStartChat={handleStartNewChat}
                    currentUser={currentMessengerUser}
                />
                <CreateGroupChatModal
                    isOpen={isCreateGroupModalOpen}
                    onClose={() => setIsCreateGroupModalOpen(false)}
                    onCreateGroup={handleCreateGroup}
                    currentUser={currentMessengerUser}
                />
            </>
        )}
    </div>
  );
};
