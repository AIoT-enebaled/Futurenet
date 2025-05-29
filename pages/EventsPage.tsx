
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Event, User } from '../types';
import { EVENT_ITEMS_DATA } from '../constants';
import { CalendarIcon, PlusCircleIcon, VideoIcon, MapPinIcon, Share2Icon, UsersIcon, LogInIcon } from '../components/icons';
import Modal from '../components/Modal'; // Import Modal

interface EventCardProps {
  event: Event;
  currentUser: User | null;
}

const EventCard: React.FC<EventCardProps> = ({ event, currentUser }) => {
  const eventDate = new Date(event.dateTime);
  const isPastEvent = eventDate < new Date();

  const handleAttendMock = () => {
    if (!currentUser) {
      alert("Please log in to mark attendance.");
      return;
    }
    alert(`Mock attendance for "${event.title}". You would be marked as attending this event.`);
  };
  
  const handleShareMock = () => {
      if(navigator.share) {
          navigator.share({
              title: event.title,
              text: `${event.title} - ${event.description.substring(0,100)}... Check it out!`,
              url: window.location.href // Or a specific event link if available
          }).catch(console.error);
      } else {
          alert("Share functionality not supported on this browser, or use copy link (TBD). Event: " + event.title);
      }
  }

  return (
    <div className={`bg-brand-surface rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${isPastEvent ? 'opacity-60' : 'hover:shadow-glow-cyan transform hover:-translate-y-1.5 border border-brand-border/30 hover:border-brand-cyan/40'}`}>
      {event.imageUrl && <img className="w-full h-48 object-cover" src={event.imageUrl} alt={event.title} />}
      <div className="p-5">
        <div className="mb-3">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
            event.category === 'workshop' ? 'bg-blue-600/20 text-blue-300 border-blue-600/40' :
            event.category === 'seminar' ? 'bg-purple-600/20 text-purple-300 border-purple-600/40' :
            event.category === 'hackathon' ? 'bg-pink-600/20 text-pink-300 border-pink-600/40' :
            event.category === 'social' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
            'bg-brand-bg text-brand-text-muted border-brand-border/50'
          } uppercase tracking-wider`}>{event.category || 'General'}</span>
          {isPastEvent && <span className="ml-2 px-2.5 py-1 text-xs font-semibold rounded-full bg-brand-text-darker/50 text-brand-text-muted border border-brand-border/40">Past</span>}
        </div>
        <h3 className="text-xl font-semibold text-brand-text mb-1.5 line-clamp-2" title={event.title}>{event.title}</h3>
        <p className="text-xs text-brand-text-muted mb-2.5">
          {eventDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="text-brand-text-muted text-sm mb-4 leading-relaxed line-clamp-3 h-16">{event.description}</p>
        
        {event.location && (
          <div className="flex items-center text-sm text-brand-text-muted mb-1.5">
            <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0 text-brand-cyan" /> {event.location}
          </div>
        )}
        {event.meetLink && (
          <div className="flex items-center text-sm text-brand-text-muted mb-3">
            <VideoIcon className="w-4 h-4 mr-2 flex-shrink-0 text-green-400" /> 
            <a href={event.meetLink} target="_blank" rel="noopener noreferrer" title={`Join Google Meet for ${event.title}`} className="text-brand-cyan hover:text-brand-pink hover:underline transition-colors">
              Join Google Meet
            </a>
          </div>
        )}
        {event.attendees && <p className="text-xs text-brand-text-muted mb-3">{event.attendees.length} attending (mock)</p>}
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-border/20">
          <button 
            onClick={handleAttendMock} 
            disabled={!currentUser || isPastEvent}
            title={isPastEvent ? 'Event has ended' : (currentUser ? `Attend ${event.title}` : 'Log in to attend')}
            className={`px-3.5 py-2 text-xs bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold rounded-md shadow-md hover:shadow-glow-pink disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-300 transform ${!isPastEvent ? "hover:scale-105" : ""} focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface`}
          >
            {isPastEvent ? 'Event Ended' : (currentUser ? 'Attend (Mock)' : 'Log in to Attend')}
          </button>
          <button onClick={handleShareMock} title={`Share ${event.title}`} className="p-1.5 text-brand-text-muted hover:text-brand-cyan rounded-full hover:bg-brand-surface-alt transition-colors">
            <Share2Icon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface EventsPageProps {
  currentUser: User | null;
}

const commonInputStyles = "mt-1 block w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple sm:text-sm text-brand-text placeholder-brand-text-muted transition-colors";
const primaryButtonStyles = "flex items-center justify-center bg-gradient-purple-pink text-white font-semibold py-2.5 px-5 rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface";
const secondaryButtonStyles = "flex items-center justify-center bg-brand-surface text-brand-text-muted font-semibold py-2.5 px-5 rounded-lg shadow-md hover:bg-brand-surface-alt hover:text-brand-text border border-brand-border/70 hover:border-brand-purple/70 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface";


const EventsPage: React.FC<EventsPageProps> = ({ currentUser }) => {
  const [events, setEvents] = useState<Event[]>(EVENT_ITEMS_DATA);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Changed from showCreateForm
  const [newEvent, setNewEvent] = useState<Partial<Event>>({ 
    title: '', description: '', dateTime: '', location: '', meetLink: '', category: 'meeting', attendees: [] 
  });

  useEffect(() => {
    if (currentUser && isCreateModalOpen) {
      setNewEvent(prev => ({ ...prev, createdBy: currentUser.displayName }));
    }
  }, [currentUser, isCreateModalOpen]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (newEvent.title && newEvent.description && newEvent.dateTime) {
      const eventToAdd: Event = {
        id: `evt-${Date.now()}`,
        title: newEvent.title,
        description: newEvent.description,
        dateTime: newEvent.dateTime,
        location: newEvent.location,
        meetLink: newEvent.meetLink,
        createdBy: currentUser.displayName,
        attendees: newEvent.attendees || [],
        imageUrl: newEvent.imageUrl || `https://picsum.photos/seed/event-${Date.now()}/400/250`,
        category: newEvent.category,
      };
      setEvents(prev => [eventToAdd, ...prev].sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()));
      setNewEvent({ title: '', description: '', dateTime: '', location: '', meetLink: '', createdBy: currentUser.displayName, category: 'meeting', attendees: [] });
      setIsCreateModalOpen(false);
    }
  };

  const generateMockMeetLink = () => {
    const randomStr = Math.random().toString(36).substring(2, 8);
    setNewEvent(prev => ({ ...prev, meetLink: `https://meet.google.com/mock-${randomStr}` }));
  };

  const sortedEvents = [...events].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="w-10 h-10 text-brand-purple" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-text">Community Calendar</h1>
            <p className="text-brand-text-muted text-sm sm:text-base">Upcoming workshops, seminars, and meetups at GiiT.</p>
          </div>
        </div>
        {currentUser ? (
          <button
            onClick={() => setIsCreateModalOpen(true)} // Open modal
            title="Create New Event"
            className={primaryButtonStyles}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Create Event
          </button>
        ) : (
          <Link
            to="/login"
            title="Log in to Create Event"
            className={secondaryButtonStyles}
          >
            <LogInIcon className="w-5 h-5 mr-2" />
            Log in to Create
          </Link>
        )}
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Schedule New Event" size="lg">
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div>
              <label htmlFor="eventTitleModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Event Title</label>
              <input type="text" id="eventTitleModal" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} required className={commonInputStyles} placeholder="e.g., AI Workshop"/>
            </div>
            <div>
              <label htmlFor="eventDescModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Description</label>
              <textarea id="eventDescModal" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} rows={3} required className={commonInputStyles} placeholder="What's the event about?"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="eventDateTimeModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Date & Time</label>
                <input type="datetime-local" id="eventDateTimeModal" value={newEvent.dateTime} onChange={e => setNewEvent({...newEvent, dateTime: e.target.value})} required className={`${commonInputStyles} dark:[color-scheme:dark]`} />
              </div>
              <div>
                <label htmlFor="eventLocationModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Location</label>
                <input type="text" id="eventLocationModal" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className={commonInputStyles} placeholder="e.g., Room 101 or Online" />
              </div>
            </div>
             <div>
                <label htmlFor="eventCategoryModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Category</label>
                <select id="eventCategoryModal" value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value as Event['category']})} className={commonInputStyles}>
                    <option value="meeting">Meeting</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminar</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="social">Social</option>
                </select>
            </div>
            <div>
              <label htmlFor="eventMeetLinkModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Google Meet Link (Optional)</label>
              <div className="flex items-center">
                <input type="url" id="eventMeetLinkModal" value={newEvent.meetLink} onChange={e => setNewEvent({...newEvent, meetLink: e.target.value})} placeholder="https://meet.google.com/..." className={`${commonInputStyles} rounded-r-none`} />
                <button type="button" onClick={generateMockMeetLink} title="Generate Mock Google Meet Link" className="px-3 py-2.5 bg-brand-cyan text-white text-sm rounded-r-lg hover:bg-opacity-80 h-[46px] border border-brand-cyan whitespace-nowrap">Gen. Mock</button>
              </div>
            </div>
             <div>
              <label htmlFor="eventImgUrlModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Image URL (Optional)</label>
              <input type="url" id="eventImgUrlModal" value={newEvent.imageUrl} onChange={e => setNewEvent({...newEvent, imageUrl: e.target.value})} placeholder="https://example.com/event-banner.jpg (auto-generates if blank)" className={commonInputStyles} />
            </div>
            <div>
                <label htmlFor="eventAttendeesModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Invite Attendees (Emails, comma-separated - Mock)</label>
                <input type="text" id="eventAttendeesModal" onChange={e => setNewEvent({...newEvent, attendees: e.target.value.split(',').map(s => s.trim()).filter(s => s)})} placeholder="user1@example.com, user2@example.com" className={commonInputStyles}/>
            </div>
            <div className="flex justify-end space-x-3 pt-3">
                 <button type="button" onClick={() => setIsCreateModalOpen(false)} className={`${secondaryButtonStyles} py-2 px-4 text-sm`}>Cancel</button>
                <button type="submit" title="Create Event" className={`${primaryButtonStyles} py-2 px-4 text-sm`}>Create Event</button>
            </div>
          </form>
      </Modal>

      {sortedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {sortedEvents.map((event: Event) => (
            <EventCard key={event.id} event={event} currentUser={currentUser} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <CalendarIcon className="w-16 h-16 text-brand-text-darker mx-auto mb-4" />
          <p className="text-xl text-brand-text-muted">No events scheduled yet.</p>
          <p className="text-sm text-brand-text-darker mt-1">{currentUser ? "Why not create one and gather the community?" : "Log in to create an event."}</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;