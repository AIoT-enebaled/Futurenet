
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Team, User, Channel, TeamMember, SharedFile, ChatMessage as TeamChatMessage, SingleTeamPageProps, SubscriptionTier } from '../types'; 
import { USER_AVATAR_URL, BOT_AVATAR_URL, GUEST_AVATAR_URL } from '../constants';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import EditTeamModal from '../components/EditTeamModal'; 
import GoProModal from '../components/GoProModal'; 
import { UsersIcon, HashIcon, Volume2Icon, VideoIcon, MessageSquareIcon, FileIcon as GFileIcon, UploadCloudIcon, PlusCircleIcon, ChevronLeftIcon, SendIcon, PaperclipIcon, MicIcon, TrashIcon, LogInIcon, EditIcon, SettingsIcon, UsersPlusIcon, StarIcon } from '../components/icons';

// Mock Chat Message Component for Team Chat (simplified)
interface TeamChatMessageDisplayProps {
  message: TeamChatMessage;
  currentUser: User | null;
}
const TeamChatMessageDisplay: React.FC<TeamChatMessageDisplayProps> = ({ message, currentUser }) => {
  const isSenderSystem = message.sender === 'system' || message.sender === 'Team Bot';
  const isCurrentUserSender = currentUser ? (message.sender === 'user' && message.avatar === currentUser.avatarUrl) || message.sender === currentUser.displayName : message.sender === 'user';
  const alignment = isCurrentUserSender ? 'justify-end' : 'justify-start';
  
  let bgColor, textColor;
  if (isCurrentUserSender) {
    bgColor = 'bg-gradient-to-br from-brand-purple to-brand-pink';
    textColor = 'text-white';
  } else if (isSenderSystem) {
    bgColor = 'bg-transparent';
    textColor = 'text-brand-text-muted italic';
  } else {
    bgColor = 'bg-brand-surface-alt';
    textColor = 'text-brand-text';
  }
  
  const avatar = message.avatar || (isCurrentUserSender ? (currentUser?.avatarUrl || USER_AVATAR_URL) : BOT_AVATAR_URL);
  const senderName = isCurrentUserSender ? "You" : message.sender;

  if (isSenderSystem) {
    return (
      <div className="text-center my-2.5">
        <p className={`px-3 py-1 inline-block rounded-full text-xs ${bgColor} ${textColor}`}>{message.text}</p>
      </div>
    );
  }
  return (
    <div className={`flex ${alignment} mb-3 w-full`}>
      <div className={`flex items-end gap-2 ${isCurrentUserSender ? 'flex-row-reverse' : ''} max-w-lg`}>
        {!isSenderSystem && <img src={avatar} alt={`${senderName} avatar`} className="w-6 h-6 rounded-full flex-shrink-0 self-end object-cover border border-brand-border/40 shadow-sm" />}
        <div className={`px-3 py-1.5 rounded-xl shadow-md ${bgColor} ${textColor} ${isCurrentUserSender ? 'rounded-br-none' : 'rounded-bl-none'}`}>
          {!isCurrentUserSender && !message.isAIMessage && <p className="text-xs font-semibold mb-0.5 text-brand-cyan">{senderName}</p>}
          <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
          <p className={`text-xs mt-0.5 ${isCurrentUserSender ? 'text-right opacity-75' : `text-left ${textColor === 'text-white' ? 'opacity-75' : 'text-brand-text-darker'}`}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
};

type ActiveMainTab = 'chat' | 'members' | 'files';

interface ExtendedSingleTeamPageProps extends SingleTeamPageProps {
  onSubscribePro: (tier: SubscriptionTier) => void;
}


const SingleTeamPage: React.FC<ExtendedSingleTeamPageProps> = ({ currentUser, teams, onUpdateTeam, onDeleteTeam, onSubscribePro }) => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  
  const [team, setTeam] = useState<Team | null | undefined>(undefined); 
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<ActiveMainTab>('chat');
  
  const [teamMessages, setTeamMessages] = useState<TeamChatMessage[]>([]);
  const [teamChatInput, setTeamChatInput] = useState('');
  const teamMessagesEndRef = useRef<HTMLDivElement>(null);

  const [showCreateChannelForm, setShowCreateChannelForm] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'text' | 'voice'>('text');
  
  const [showInviteMemberForm, setShowInviteMemberForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false);
  const [isGoProModalOpen, setIsGoProModalOpen] = useState(false);
  const [isMeetModalOpen, setIsMeetModalOpen] = useState(false);


  const [isInVoiceCall, setIsInVoiceCall] = useState(false);
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [voiceCallError, setVoiceCallError] = useState<string | null>(null);


  useEffect(() => {
    const foundTeam = teams.find(t => t.id === teamId);
    setTeam(foundTeam ? {...foundTeam} : null); 
    if (foundTeam?.channels && foundTeam.channels.length > 0) {
      const firstTextChannel = foundTeam.channels.find(c => c.type === 'text');
      setActiveChannel(firstTextChannel || foundTeam.channels[0]);
      setActiveMainTab('chat');
    } else if (foundTeam) {
      setActiveMainTab('members');
    }
  }, [teamId, teams]);


  const canPerformAdminActions = currentUser && team?.members?.some(m => m.id === currentUser.id && (m.role === 'owner' || m.role === 'admin'));
  const isTeamOwner = currentUser && team?.members?.some(m => m.id === currentUser.id && m.role === 'owner');
  const isCurrentUserMember = currentUser && team?.members?.some(m => m.id === currentUser.id);


  useEffect(() => {
    if (activeChannel && team) {
      const baseMessages: TeamChatMessage[] = [
        { id: `sys-${activeChannel.id}-welcome`, text: `Welcome to ${activeChannel.type === 'text' ? '#' : '🔊 '}${activeChannel.name} in ${team.name}!`, sender: 'system', timestamp: new Date(), isAIMessage: false },
      ];
      if (activeChannel.type === 'text') {
        baseMessages.push({ id: `bot-${activeChannel.id}-mock`, text: 'This is a mock chat. Messages are not persisted. Feel free to test!', sender: 'Team Bot', timestamp: new Date(), avatar: BOT_AVATAR_URL, isAIMessage: true });
      }
      if (activeChannel.type === 'voice') {
        baseMessages.push({ id: `bot-${activeChannel.id}-voice-info`, text: 'This voice channel uses your microphone for a local test (loopback). You should hear yourself if it connects successfully. Full multi-user voice chat is not yet implemented.', sender: 'Team Bot', timestamp: new Date(), avatar: BOT_AVATAR_URL, isAIMessage: true });
      }
      setTeamMessages(baseMessages);
    } else {
      setTeamMessages([]);
    }
    teamMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChannel, team]);

   useEffect(() => {
    teamMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [teamMessages]);

  const handleSelectChannel = (channel: Channel) => {
    setActiveChannel(channel);
    setActiveMainTab('chat');
    if (isInVoiceCall && channel.type !== 'voice') { 
        handleToggleVoiceCall(); // Leave current voice call if switching to a non-voice channel
    }
  };

  const handleTeamChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamChatInput.trim() || !currentUser || !activeChannel || activeChannel.type !== 'text' || !isCurrentUserMember) return;
    const newMessage: TeamChatMessage = {
      id: `tc-${Date.now()}`,
      text: teamChatInput.trim(),
      sender: currentUser.displayName, 
      timestamp: new Date(),
      avatar: currentUser.avatarUrl || USER_AVATAR_URL,
      isAIMessage: false,
    };
    setTeamMessages(prev => [...prev, newMessage]);
    setTeamChatInput('');
  };

  const handleCreateChannelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim() || !team || !canPerformAdminActions) return;
    const newChan: Channel = { id: `chan-${Date.now()}`, name: newChannelName.trim().toLowerCase().replace(/\s+/g, '-'), type: newChannelType };
    const updatedChannels = [...(team.channels || []), newChan];
    onUpdateTeam(team.id, { channels: updatedChannels }); 
    setNewChannelName('');
    setShowCreateChannelForm(false);
  };
  
  const handleInviteMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!inviteEmail.trim() || !team || !canPerformAdminActions || !currentUser) return;
    const newMember: TeamMember = {
        id: `usr-${Date.now()}`, name: inviteEmail.split('@')[0], avatarUrl: `https://picsum.photos/seed/${inviteEmail}/40/40`, role: 'member'
    };
    const updatedMembers = [...(team.members || []), newMember];
    onUpdateTeam(team.id, { members: updatedMembers, membersCount: updatedMembers.length });
    alert(`Mock user ${newMember.name} added to team ${team.name}. In a real app, an invitation would be sent to ${inviteEmail}.`);
    setInviteEmail('');
    setShowInviteMemberForm(false);
  };

  const handleFileUploadMock = () => {
    if (!currentUser || !isCurrentUserMember || !team) return;
    const fileName = prompt("Enter mock file name (e.g., 'project-plan.pdf'):");
    if (fileName) {
      const newFile: SharedFile = {
        id: `file-${Date.now()}`, name: fileName, type: fileName.split('.').pop() || 'unknown',
        size: `${(Math.random() * 10).toFixed(1)} MB`, uploadedBy: currentUser.displayName,
        uploadedAt: new Date().toISOString(), url: '#'
      };
      const updatedFiles = [...(team.files || []), newFile];
      onUpdateTeam(team.id, { files: updatedFiles });
       alert(`Mock file "${fileName}" added to team files.`);
    }
  };

  const handleTeamUpdate = (updatedData: Partial<Team>) => {
    if (!team) return;
    onUpdateTeam(team.id, updatedData);
    setTeam(prevTeam => prevTeam ? { ...prevTeam, ...updatedData } : null);
  };

  const handleTeamDelete = () => {
    if (!team || !isTeamOwner) return;
    if (window.confirm(`Are you sure you want to permanently delete the team "${team.name}"? This action cannot be undone.`)) {
        onDeleteTeam(team.id);
        navigate('/teams');
    }
  };

  const handleJoinTeam = () => {
    if (!currentUser || !team || team.isPrivate || isCurrentUserMember) return;

    const newMember: TeamMember = {
        id: currentUser.id,
        name: currentUser.displayName,
        avatarUrl: currentUser.avatarUrl,
        role: 'member',
    };

    const updatedMembers = [...(team.members || []), newMember];
    onUpdateTeam(team.id, {
        members: updatedMembers,
        membersCount: updatedMembers.length,
    });
  };

  const handleSummarizeChat = () => {
    if (!currentUser?.is_pro_user) {
        setIsGoProModalOpen(true);
        return;
    }
    alert("Mock: AI Chat Summary would be generated for Pro users here!");
  };

  const handleStartGoogleMeet = () => {
    if (!isCurrentUserMember && !currentUser) {
        alert("Please log in and join the team to start a Google Meet.");
        return;
    }
     setIsMeetModalOpen(true);
  };

  const confirmAndOpenGoogleMeet = () => {
    window.open('https://meet.new', '_blank');
    setIsMeetModalOpen(false);
  };


  const handleToggleVoiceCall = async () => {
    console.log("[GiiT Voice] handleToggleVoiceCall triggered. Current state isInVoiceCall:", isInVoiceCall);
    setVoiceCallError(null);

    if (!currentUser || !isCurrentUserMember) {
        const errorMsg = "You must be logged in and a member of this team to join the voice channel.";
        console.error("[GiiT Voice] Error:", errorMsg);
        setVoiceCallError(errorMsg);
        setTeamMessages(prev => [...prev, { id: `sys-vc-err-${Date.now()}`, text: errorMsg, sender: 'system', timestamp: new Date() }]);
        return;
    }

    if (isInVoiceCall) {
        console.log("[GiiT Voice] Attempting to LEAVE voice call.");
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                track.stop();
                console.log(`[GiiT Voice] Track ${track.kind} (${track.id}) stopped.`);
            });
            localStreamRef.current = null;
            console.log("[GiiT Voice] Local stream stopped and cleared.");
        }
        if (audioElementRef.current) {
            audioElementRef.current.pause();
            audioElementRef.current.srcObject = null;
            console.log("[GiiT Voice] Audio element paused and srcObject cleared.");
        }
        setIsInVoiceCall(false);
        console.log("[GiiT Voice] Left voice call successfully. isInVoiceCall: false");
         setTeamMessages(prev => [...prev, { id: `sys-vc-left-${Date.now()}`, text: `${currentUser.displayName} left the voice channel.`, sender: 'system', timestamp: new Date() }]);
    } else {
        console.log("[GiiT Voice] Attempting to JOIN voice call.");
         setTeamMessages(prev => [...prev, { id: `sys-vc-joining-${Date.now()}`, text: `${currentUser.displayName} is attempting to join the voice channel...`, sender: 'system', timestamp: new Date() }]);
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            const errorMsg = "Your browser doesn't support microphone access (getUserMedia API is not available). Please use a modern browser like Chrome or Firefox.";
            console.error("[GiiT Voice] Error:", errorMsg);
            setVoiceCallError(errorMsg);
            setTeamMessages(prev => [...prev, { id: `sys-vc-err-${Date.now()}`, text: errorMsg, sender: 'system', timestamp: new Date() }]);
            return;
        }
        try {
            console.log("[GiiT Voice] Requesting microphone access via getUserMedia...");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("[GiiT Voice] Microphone access GRANTED. Stream object:", stream);
            
            if (!stream) {
                 const noStreamError = "Failed to obtain a valid audio stream from the microphone. Ensure it's not in use by another app or disabled.";
                 console.error("[GiiT Voice]", noStreamError);
                 setVoiceCallError(noStreamError);
                 setTeamMessages(prev => [...prev, { id: `sys-vc-err-${Date.now()}`, text: noStreamError, sender: 'system', timestamp: new Date() }]);
                 setIsInVoiceCall(false);
                 return;
            }
            localStreamRef.current = stream;

            if (audioElementRef.current) {
                console.log("[GiiT Voice] Audio element ref exists. Setting srcObject for local playback.");
                audioElementRef.current.srcObject = stream;
                audioElementRef.current.muted = false; 
                audioElementRef.current.volume = 1.0; 
                
                console.log("[GiiT Voice] Attempting to play audio element...");
                await audioElementRef.current.play(); 
                console.log("[GiiT Voice] Audio playback STARTED successfully.");
                setIsInVoiceCall(true);
                setVoiceCallError(null);
                setTeamMessages(prev => [...prev, { id: `sys-vc-joined-${Date.now()}`, text: `${currentUser.displayName} joined the voice channel. Microphone is active (local loopback test). You should hear yourself.`, sender: 'system', timestamp: new Date() }]);

            } else {
                const noAudioElError = "Audio element could not be accessed. This is unexpected. Please try refreshing the page.";
                console.error("[GiiT Voice] Error:", noAudioElError);
                setVoiceCallError(noAudioElError);
                setTeamMessages(prev => [...prev, { id: `sys-vc-err-${Date.now()}`, text: noAudioElError, sender: 'system', timestamp: new Date() }]);
                stream.getTracks().forEach(track => track.stop()); 
                localStreamRef.current = null;
                setIsInVoiceCall(false);
            }
        } catch (err) {
            console.error("[GiiT Voice] Error during getUserMedia or playback:", err);
            let specificErrorMsg = "An unknown error occurred while accessing the microphone.";
            if (err instanceof Error) {
                switch (err.name) {
                    case "NotFoundError": case "DevicesNotFoundError":
                        specificErrorMsg = "No microphone found. Please ensure one is connected, enabled in your OS, and not disabled in browser site settings.";
                        break;
                    case "NotAllowedError": case "PermissionDeniedError":
                        specificErrorMsg = "Microphone access was denied. Please allow access in your browser's site settings for this page and refresh.";
                        break;
                    case "AbortError":
                        specificErrorMsg = "Microphone access request was aborted by the browser or another process. Please try again.";
                        break;
                    case "NotReadableError":
                         specificErrorMsg = "Microphone is currently in use by another application or there's a hardware error preventing access. Please check your system settings and close other apps using the mic.";
                        break;
                    case "SecurityError":
                        specificErrorMsg = "Microphone access is blocked due to security settings in your browser or operating system.";
                        break;
                    case "TypeError":
                        specificErrorMsg = "There was a type error trying to use the microphone. Ensure your browser is up to date.";
                         break;
                    default:
                        specificErrorMsg = `Error accessing microphone: ${err.message}. Try checking browser permissions.`;
                }
            }
            setVoiceCallError(specificErrorMsg);
            setTeamMessages(prev => [...prev, { id: `sys-vc-err-${Date.now()}`, text: specificErrorMsg, sender: 'system', timestamp: new Date() }]);
            setIsInVoiceCall(false);
            if (localStreamRef.current) { 
                localStreamRef.current.getTracks().forEach(track => track.stop());
                localStreamRef.current = null;
                console.log("[GiiT Voice] Cleaned up stream after getUserMedia error.");
            }
        }
    }
};
  
  const commonInputStyles = "w-full px-2.5 py-2 text-xs border border-brand-border/70 rounded-md bg-brand-bg text-brand-text placeholder-brand-text-muted focus:ring-1 focus:ring-brand-purple focus:border-brand-purple focus:outline-none transition-colors";
  const smallButtonStyles = "px-2.5 py-1.5 text-xs text-white rounded-md transition-colors duration-200 shadow-sm hover:shadow-md";
  const primaryJoinButtonStyles = "w-full mt-1.5 px-3 py-1.5 text-xs text-white rounded-md transition-colors duration-200 shadow-sm hover:shadow-md bg-gradient-to-r from-brand-purple to-brand-pink hover:shadow-glow-pink flex items-center justify-center";
  const secondaryLoginButtonStyles = "w-full mt-1.5 px-3 py-1.5 text-xs text-brand-text-muted rounded-md transition-colors duration-200 shadow-sm hover:shadow-md bg-brand-surface hover:text-brand-text border border-brand-border/70 hover:border-brand-purple/70 flex items-center justify-center";
  const proFeatureButtonStyles = "text-xs inline-flex items-center text-brand-cyan hover:text-brand-pink transition-colors px-2 py-1 rounded-md border border-brand-cyan/50 hover:border-brand-pink/50 bg-brand-surface-alt/50 disabled:opacity-60 disabled:cursor-not-allowed";


  if (team === undefined) {
    return <div className="flex justify-center items-center h-[calc(100vh-8rem)]"><LoadingSpinner message="Loading team details..." /></div>;
  }
  if (!team) {
    return (
      <div className="text-center p-8 bg-brand-surface rounded-lg shadow-xl h-[calc(100vh-8rem)] flex flex-col justify-center items-center border border-brand-border/30">
        <UsersIcon className="w-16 h-16 text-brand-text-darker mb-4" />
        <h1 className="text-2xl font-bold text-brand-text mb-3">Team Not Found</h1>
        <p className="text-brand-text-muted mb-6">The team hub you are looking for does not exist or you may not have access.</p>
        <Link to="/teams" className="inline-flex items-center px-6 py-2.5 bg-gradient-purple-pink text-white font-semibold rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105" title="Go back to all teams">
          <ChevronLeftIcon className="w-5 h-5 mr-1.5" /> Back to Team Hubs
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] bg-brand-bg text-brand-text overflow-hidden rounded-xl shadow-2xl border border-brand-border/30">
      <aside className="w-64 sm:w-72 flex-shrink-0 bg-brand-surface border-r border-brand-border/40 flex flex-col">
        <header className="p-3.5 sm:p-4 border-b border-brand-border/40">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center min-w-0">
                {team.imageUrl ? 
                    <img src={team.imageUrl} alt={team.name} className="w-7 h-7 sm:w-8 sm:h-8 rounded-md mr-2 object-cover flex-shrink-0 border border-brand-border/30"/>
                    : <UsersIcon className="w-7 h-7 sm:w-8 sm:h-8 mr-2 text-brand-purple flex-shrink-0"/> 
                }
                <h2 className="text-md sm:text-lg font-semibold truncate text-brand-text" title={team.name}>{team.name}</h2>
            </div>
            {isTeamOwner && (
                <button onClick={() => setIsEditTeamModalOpen(true)} title="Edit Team Details" className="p-1 text-brand-text-muted hover:text-brand-cyan flex-shrink-0 rounded-full hover:bg-brand-surface-alt transition-colors">
                    <SettingsIcon className="w-4 h-4"/>
                </button>
            )}
          </div>
          <p className="text-xs text-brand-text-muted truncate" title={team.description}>{team.description}</p>
           <div className="mt-2.5 space-x-1.5 flex flex-wrap gap-y-1.5">
            <button 
              onClick={handleStartGoogleMeet} 
              title={`Start Google Meet for ${team.name}`}
              className={`${smallButtonStyles} bg-blue-600 hover:bg-blue-500 inline-flex items-center ${(!isCurrentUserMember && !currentUser) ? 'opacity-60 cursor-not-allowed' : ''}`} 
              disabled={!isCurrentUserMember && !currentUser}
            >
              <VideoIcon className="w-3.5 h-3.5 mr-1"/> Meet
            </button>
            <button 
              onClick={() => alert("This 'Call' button is a mock for general team WebRTC calls (feature TBD) and is different from the 'Voice Channel' feature below for local mic testing. Team: " + team.name)} 
              title={`Join WebRTC Call (Mock Feature) for ${team.name}`}
              className={`${smallButtonStyles} bg-green-600 hover:bg-green-500 inline-flex items-center ${(!isCurrentUserMember && !currentUser) ? 'opacity-60 cursor-not-allowed' : ''}`} 
              disabled={!isCurrentUserMember && !currentUser}
            >
              <Volume2Icon className="w-3.5 h-3.5 mr-1"/> Call (Mock)
            </button>
          </div>
          {!team.isPrivate && !isCurrentUserMember && currentUser && (
            <button
                onClick={handleJoinTeam}
                title={`Join ${team.name} team`}
                className={primaryJoinButtonStyles}
            >
                <UsersPlusIcon className="w-3.5 h-3.5 mr-1.5" /> Join Team
            </button>
          )}
          {!team.isPrivate && !currentUser && (
             <Link
                to="/login"
                title={`Log in to join ${team.name}`}
                className={secondaryLoginButtonStyles}
            >
                <LogInIcon className="w-3.5 h-3.5 mr-1.5" /> Log in to Join
            </Link>
          )}
        </header>
        
        <nav className="flex-1 p-2.5 sm:p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
          <div className="flex justify-between items-center mb-1 px-1">
            <h3 className="text-xs font-semibold uppercase text-brand-text-darker tracking-wide">Channels</h3>
            {canPerformAdminActions && (
              <button onClick={() => setShowCreateChannelForm(s => !s)} className="p-1 rounded-full hover:bg-brand-surface-alt" title={showCreateChannelForm ? "Cancel Create Channel" : "Create Channel"}>
                <PlusCircleIcon className="w-4 h-4 text-brand-text-muted hover:text-brand-cyan"/>
              </button>
            )}
          </div>
          {showCreateChannelForm && canPerformAdminActions && (
            <form onSubmit={handleCreateChannelSubmit} className="p-2.5 mb-2 bg-brand-bg rounded-md text-sm space-y-2 border border-brand-border/50 shadow-sm">
              <input type="text" value={newChannelName} onChange={e => setNewChannelName(e.target.value)} placeholder="Channel name (e.g. general)" required title="Enter new channel name" className={commonInputStyles}/>
              <select value={newChannelType} onChange={e => setNewChannelType(e.target.value as 'text' | 'voice')} title="Select channel type" className={`${commonInputStyles} py-1.5`}>
                <option value="text">Text Channel</option>
                <option value="voice">Voice Channel</option>
              </select>
              <button type="submit" title="Add new channel" className={`${smallButtonStyles} w-full bg-brand-purple hover:bg-brand-pink`}>Add</button>
            </form>
          )}
          {(team.channels?.length || 0) > 0 ? team.channels?.map(channel => (
            <button 
              key={channel.id} 
              onClick={() => handleSelectChannel(channel)}
              title={`Switch to ${channel.name} ${channel.type} channel`}
              className={`w-full flex items-center px-2.5 py-1.5 rounded-md text-sm transition-colors group ${activeChannel?.id === channel.id ? 'bg-gradient-purple-pink text-white font-medium shadow-md' : 'text-brand-text-muted hover:bg-brand-surface-alt hover:text-brand-text'}`}
            >
              {channel.type === 'text' ? <HashIcon className={`w-4 h-4 mr-1.5 flex-shrink-0 ${activeChannel?.id === channel.id ? 'opacity-100' : 'opacity-70 group-hover:text-brand-cyan'}`} /> : <Volume2Icon className={`w-4 h-4 mr-1.5 flex-shrink-0 ${activeChannel?.id === channel.id ? 'opacity-100' : 'opacity-70 group-hover:text-brand-cyan'}`} />}
              <span className="truncate">{channel.name}</span>
              {channel.unreadCount && channel.unreadCount > 0 && <span className="ml-auto text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5 font-normal">{channel.unreadCount}</span>}
            </button>
          )) : <p className="px-2.5 py-1.5 text-xs text-brand-text-muted">No channels yet.</p>}
        </nav>
         <div className="p-3 border-t border-brand-border/40 mt-auto">
            {isTeamOwner && (
                 <button onClick={handleTeamDelete} title="Delete this team" className="w-full text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md py-1.5 mb-2 transition-colors flex items-center justify-center">
                    <TrashIcon className="w-3.5 h-3.5 mr-1" /> Delete Team
                </button>
            )}
            <button onClick={() => navigate("/teams")} title="Go back to all teams" className="w-full text-xs text-brand-cyan hover:text-brand-pink hover:bg-brand-surface-alt rounded-md py-1.5 transition-colors flex items-center justify-center">
              <ChevronLeftIcon className="w-3.5 h-3.5 mr-1" /> Back to All Teams
            </button>
          </div>
      </aside>

      <main className="flex-1 flex flex-col bg-brand-bg">
        <div className="flex border-b border-brand-border/50 bg-brand-surface">
          <button 
            onClick={() => setActiveMainTab('chat')} 
            title={activeChannel ? `View chat for ${activeChannel.name}` : "Select a channel to chat"}
            className={`px-3.5 sm:px-4 py-3 text-xs sm:text-sm font-medium ${activeMainTab === 'chat' ? 'border-b-2 border-brand-purple text-brand-purple' : 'text-brand-text-muted hover:text-brand-text transition-colors'}`}
            disabled={!activeChannel}
          >
            Chat {activeChannel?.type === 'text' ? `#${activeChannel.name}` : activeChannel?.type === 'voice' ? `🔊 ${activeChannel.name}` : ''}
          </button>
          <button onClick={() => setActiveMainTab('members')} title="View team members" className={`px-3.5 sm:px-4 py-3 text-xs sm:text-sm font-medium ${activeMainTab === 'members' ? 'border-b-2 border-brand-purple text-brand-purple' : 'text-brand-text-muted hover:text-brand-text transition-colors'}`}>
            Members ({team.membersCount})
          </button>
          <button onClick={() => setActiveMainTab('files')} title="View shared files" className={`px-3.5 sm:px-4 py-3 text-xs sm:text-sm font-medium ${activeMainTab === 'files' ? 'border-b-2 border-brand-purple text-brand-purple' : 'text-brand-text-muted hover:text-brand-text transition-colors'}`}>
            Files ({team.files?.length || 0})
          </button>
        </div>

        {activeMainTab === 'chat' && ( <>
            {!activeChannel && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                    <MessageSquareIcon className="w-16 h-16 text-brand-text-darker mb-4"/>
                    <h3 className="text-xl font-semibold text-brand-text">No Channel Selected</h3>
                    <p className="text-brand-text-muted">Select a channel from the sidebar to start collaborating.</p>
                </div>
            )}
            {activeChannel?.type === 'text' && (
              <>
                <header className="p-3 sm:p-3.5 border-b border-brand-border/50 flex justify-between items-center bg-brand-surface">
                  <h3 className="text-sm sm:text-md font-semibold flex items-center text-brand-text"><HashIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 text-brand-text-muted"/> {activeChannel.name}</h3>
                  <button onClick={handleSummarizeChat} className={proFeatureButtonStyles} title="Summarize Chat (Pro Feature)">
                    <StarIcon className="w-3 h-3 mr-1 text-yellow-400"/> Summarize Chat
                  </button>
                </header>
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5 bg-brand-bg scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
                  {teamMessages.map(msg => <TeamChatMessageDisplay key={msg.id} message={msg} currentUser={currentUser}/>)}
                  <div ref={teamMessagesEndRef} />
                </div>
                {currentUser && isCurrentUserMember ? (
                  <form onSubmit={handleTeamChatSubmit} className="p-2.5 sm:p-3 border-t border-brand-border/50 bg-brand-surface">
                    <div className="flex items-center bg-brand-bg rounded-lg p-1 border border-brand-border/70 focus-within:ring-1 focus-within:ring-brand-purple transition-all">
                      <button type="button" title="Attach file (TBD)" className="p-2 text-brand-text-muted hover:text-brand-cyan rounded-full transition-colors"><PaperclipIcon className="w-4 h-4 sm:w-5 sm:h-5"/></button>
                      <input
                        type="text"
                        value={teamChatInput}
                        onChange={(e) => setTeamChatInput(e.target.value)}
                        placeholder={`Message #${activeChannel.name}`}
                        className="flex-grow p-2 bg-transparent text-brand-text placeholder-brand-text-muted focus:outline-none text-sm"
                        aria-label={`Message input for ${activeChannel.name}`}
                      />
                      <button type="button" title="Record voice (TBD)" className="p-2 text-brand-text-muted hover:text-brand-cyan rounded-full transition-colors"><MicIcon className="w-4 h-4 sm:w-5 sm:h-5"/></button>
                      <button type="submit" disabled={!teamChatInput.trim()} title="Send message" className="p-2 text-brand-purple hover:text-brand-pink rounded-full disabled:text-brand-text-darker disabled:cursor-not-allowed transition-colors transform hover:scale-110"><SendIcon className="w-5 h-5 sm:w-6 sm:h-6"/></button>
                    </div>
                  </form>
                ) : (
                  <div className="p-3 border-t border-brand-border/50 text-center text-sm text-brand-text-muted bg-brand-surface">
                    {!currentUser ? 
                      <p>Please <Link to="/login" className="text-brand-cyan hover:underline font-medium" title="Log in">log in</Link> to chat.</p> :
                      <p>You must be a member of this team to participate in the chat.</p> 
                    }
                  </div>
                )}
              </>
            )}
            {activeChannel?.type === 'voice' && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-brand-bg text-center">
                <Volume2Icon className="w-16 h-16 text-brand-text-darker mb-4"/>
                <h3 className="text-xl font-semibold text-brand-text">Voice Channel: {activeChannel.name}</h3>
                
                {isInVoiceCall && (
                    <p className="text-green-400 my-2 animate-pulse">Microphone active. You should hear yourself (local test).</p>
                )}
                {voiceCallError && !isInVoiceCall && (
                    <p className="text-red-400 my-2 max-w-sm p-2 bg-red-900/20 rounded-md border border-red-700/30">{voiceCallError}</p>
                )}
                {!isInVoiceCall && !voiceCallError && (
                    <p className="text-brand-text-muted my-2 max-w-sm">
                        Join the voice channel to test your microphone (local loopback).
                    </p>
                )}

                <button
                    onClick={handleToggleVoiceCall}
                    title={isInVoiceCall ? "Leave Voice Channel" : "Join Voice Channel (Mic Test)"}
                    className={`mt-3 px-5 py-2.5 text-white rounded-lg shadow-lg inline-flex items-center transition-all duration-300 transform hover:scale-105 
                        ${isInVoiceCall ? 'bg-red-600 hover:bg-red-500 hover:shadow-[0_0_25px_0px_rgba(220,38,38,0.5)]' : 'bg-gradient-to-r from-green-500 to-brand-cyan hover:shadow-glow-cyan'}
                        ${(!isCurrentUserMember && !!currentUser) ? 'opacity-60 cursor-not-allowed' : ''} ${!currentUser ? 'opacity-60 cursor-not-allowed' : ''}`}
                     disabled={!currentUser || !isCurrentUserMember}
                >
                    <MicIcon className="w-5 h-5 mr-2"/> {isInVoiceCall ? 'Leave Voice Channel' : 'Join Voice Channel'}
                </button>
                 {!isCurrentUserMember && currentUser && <p className="text-xs text-brand-text-muted mt-2">You must be a member of this team to join voice chat.</p>}
                 {!currentUser && <p className="text-xs text-brand-text-muted mt-2">Please <Link to="/login" className="text-brand-cyan hover:underline font-medium" title="Log in">log in</Link> to join voice chat.</p>}
                 <audio ref={audioElementRef} playsInline autoPlay className="hidden"></audio>
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5 w-full max-w-md scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent mt-4">
                  {teamMessages.filter(msg => msg.sender === 'system').map(msg => <TeamChatMessageDisplay key={msg.id} message={msg} currentUser={currentUser}/>)}
                </div>
              </div>
            )}
          </>)}
        {activeMainTab === 'members' && ( <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-brand-bg scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-brand-text">Team Members</h3>
                {canPerformAdminActions && (
                    <button onClick={() => setShowInviteMemberForm(s => !s)} title={showInviteMemberForm ? "Cancel invite" : "Invite New Member"} className={`${smallButtonStyles} bg-green-600 hover:bg-green-500 inline-flex items-center`}>
                        <PlusCircleIcon className="w-4 h-4 mr-1.5"/> Invite Member
                    </button>
                )}
            </div>
            {showInviteMemberForm && canPerformAdminActions && (
                <form onSubmit={handleInviteMemberSubmit} className="p-3 mb-4 bg-brand-surface rounded-md text-sm space-y-2 border border-brand-border/50 shadow-sm">
                    <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="User's email to invite" required title="Enter email of user to invite" className={`${commonInputStyles} text-sm`} aria-label="Invite member by email"/>
                    <button type="submit" title="Send invite" className={`${smallButtonStyles} w-full bg-brand-purple hover:bg-brand-pink`}>Send Invite</button>
                </form>
            )}
            <ul className="space-y-2.5">
              {(team.members?.length || 0) > 0 ? team.members?.map(member => (
                <li key={member.id} className="flex items-center justify-between p-3 bg-brand-surface rounded-lg hover:bg-brand-surface-alt border border-brand-border/30 hover:border-brand-purple/40 transition-all duration-200">
                  <div className="flex items-center">
                    <img src={member.avatarUrl || GUEST_AVATAR_URL} alt={member.name} className="w-9 h-9 rounded-full object-cover mr-3 border-2 border-brand-border/50"/>
                    <div>
                        <span className="text-sm font-medium text-brand-text">{member.name}</span>
                        <span className={`block text-xs capitalize ${member.role === 'owner' ? 'text-brand-pink' : member.role === 'admin' ? 'text-brand-cyan' : 'text-brand-text-muted'}`}>{member.role}</span>
                    </div>
                  </div>
                  {canPerformAdminActions && member.id !== currentUser?.id && (
                    <div className="flex space-x-1">
                        <button title="Edit role (TBD)" className="p-1.5 text-brand-text-muted hover:text-brand-cyan rounded-full hover:bg-brand-bg transition-colors"><EditIcon className="w-3.5 h-3.5"/></button>
                        <button title="Remove member (TBD)" className="p-1.5 text-brand-text-muted hover:text-brand-pink rounded-full hover:bg-brand-bg transition-colors"><TrashIcon className="w-3.5 h-3.5"/></button>
                    </div>
                  )}
                </li>
              )) : <p className="text-sm text-brand-text-muted py-4 text-center">No members found. Invite some!</p>}
            </ul>
          </div>)}
        {activeMainTab === 'files' && ( <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-brand-bg scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-brand-text">Shared Files</h3>
                {isCurrentUserMember && currentUser && (
                    <button onClick={handleFileUploadMock} title="Upload a new file" className={`${smallButtonStyles} bg-blue-600 hover:bg-blue-500 inline-flex items-center`}>
                        <UploadCloudIcon className="w-4 h-4 mr-1.5"/> Upload File
                    </button>
                )}
            </div>
             {!isCurrentUserMember && currentUser && <p className="text-xs text-brand-text-muted mb-3">You must be a member of this team to upload files.</p>}
             {!currentUser && <p className="text-xs text-brand-text-muted mb-3">Please <Link to="/login" className="text-brand-cyan hover:underline font-medium" title="Log in">log in</Link> to upload files.</p>}

            <ul className="space-y-2.5">
              {(team.files?.length || 0) > 0 ? team.files?.map(file => (
                <li key={file.id} className="flex items-center justify-between p-3 bg-brand-surface rounded-lg hover:bg-brand-surface-alt border border-brand-border/30 hover:border-brand-cyan/40 transition-all duration-200">
                  <div className="flex items-center truncate mr-2">
                    <GFileIcon className="w-6 h-6 mr-3 text-brand-cyan flex-shrink-0"/>
                    <div className="truncate">
                        <span className="text-sm font-medium text-brand-text truncate block" title={file.name}>{file.name}</span>
                        <span className="text-xs text-brand-text-muted">
                            {file.size} - By {file.uploadedBy} on {new Date(file.uploadedAt).toLocaleDateString()}
                        </span>
                    </div>
                  </div>
                  <a href={file.url || '#'} download={file.name} title={`Download ${file.name}`} className="p-1.5 text-brand-text-muted hover:text-brand-cyan rounded-full hover:bg-brand-bg transition-colors">
                    <UploadCloudIcon className="w-4 h-4 transform rotate-180"/> {/* Download icon */}
                  </a>
                </li>
              )) : <p className="text-sm text-brand-text-muted py-4 text-center">No files shared in this team hub yet.</p>}
            </ul>
          </div>)}
      </main>
      {team && <EditTeamModal isOpen={isEditTeamModalOpen} onClose={() => setIsEditTeamModalOpen(false)} team={team} onUpdateTeam={handleTeamUpdate} />}
      <GoProModal 
        isOpen={isGoProModalOpen}
        onClose={() => setIsGoProModalOpen(false)}
        onSubscribe={onSubscribePro}
        featureName="AI Chat Summary"
      />
      <Modal isOpen={isMeetModalOpen} onClose={() => setIsMeetModalOpen(false)} title="Start Google Meet">
          <div className="text-center">
            <p className="text-brand-text-muted mb-6">
              This will open a new Google Meet session in a new browser tab.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setIsMeetModalOpen(false)}
                className="px-6 py-2.5 text-sm font-medium text-brand-text-muted bg-brand-surface-alt hover:bg-opacity-80 rounded-lg shadow-sm border border-brand-border hover:border-brand-purple/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface"
              >
                Cancel
              </button>
              <button
                onClick={confirmAndOpenGoogleMeet}
                className="px-6 py-2.5 bg-gradient-purple-pink text-white font-semibold rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface"
              >
                Proceed to Google Meet
              </button>
            </div>
          </div>
        </Modal>
    </div>
  );
};

export default SingleTeamPage;
