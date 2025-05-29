
import React from 'react';
import { NavItem, DiscoverCategory, DiscoverItem, Project, Post, Team, Comment, Channel, TeamMember, SharedFile, Event, MessengerUser, MessengerChat, MessengerMessage, CourseCategory, Course, CourseInstructor, CourseDifficulty } from './types';
import { 
    HomeIcon, CompassIcon, MessageSquareIcon, CalendarIcon, BookOpenIcon, BriefcaseIcon, Edit3Icon, UsersIcon, UserCircleIcon, LogInIcon, 
    MusicIcon, Gamepad2Icon, ClapperboardIcon, FlaskConicalIcon, GraduationCapIcon, VideoIcon, UsersRoundIcon, FileIcon as GFileIcon, 
    ListIcon as GListIcon, HashIcon, Volume2Icon, BarChart3Icon, ActivityIcon, MenuIcon, MessageCircleIcon as MessengerIcon, 
    SettingsIcon, CreditCardIcon, StarIcon, CodeIcon, BookOpenCheckIcon, ListTreeIcon, CheckBadgeIcon, ChartPieIcon
} from './components/icons'; 

export const NAV_ITEMS: NavItem[] = [
  { name: 'Home', path: '/home', icon: HomeIcon, isHome: true },
  { name: 'Discover', path: '/discover', icon: CompassIcon },
  { name: 'GiiT AI Chat', path: '/chat', icon: MessageSquareIcon },
  { name: 'Messenger', path: '/messenger', icon: MessengerIcon },
  { name: 'Projects', path: '/projects', icon: BriefcaseIcon },
  { name: 'Blog', path: '/blog', icon: Edit3Icon },
  { name: 'Teams', path: '/teams', icon: UsersIcon },
  { name: 'Learning', path: '/learning', icon: GraduationCapIcon },
  { name: 'Events', path: '/events', icon: CalendarIcon },
  { name: 'Docs', path: '/docs', icon: BookOpenIcon },
];

export const AUTH_NAV_ITEMS: NavItem[] = [
    { name: 'My Profile', path: '/profile', icon: UserCircleIcon },
    { name: 'My Courses', path: '/learning/my-courses', icon: BookOpenCheckIcon }, // For Learning Platform
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
    { name: 'Subscription', path: '/subscription', icon: CreditCardIcon },
    { name: 'Learning Dashboard', path: '/learning/instructor-dashboard', icon: GraduationCapIcon, isInstructor: true }, // For instructors
];

export const UNAUTH_NAV_ITEMS: NavItem[] = [
    { name: 'Login', path: '/login', icon: LogInIcon },
    { name: 'Register', path: '/register', icon: UserCircleIcon }, 
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { name: 'Analytics', path: '/analytics', icon: BarChart3Icon },
];


export const DISCOVER_CATEGORIES: DiscoverCategory[] = [
  { id: 'music', name: 'Music', icon: MusicIcon },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2Icon },
  { id: 'entertainment', name: 'Entertainment', icon: ClapperboardIcon },
  { id: 'science-tech', name: 'Science & Tech', icon: FlaskConicalIcon },
  { id: 'education', name: 'Education', icon: GraduationCapIcon },
];

export const DISCOVER_ITEMS_DATA: DiscoverItem[] = [
  { id: 'music1', title: 'Chill Lo-fi Beats', description: 'Relax and study with these calming tunes.', imageUrl: 'https://picsum.photos/seed/music1/400/300', category: 'music', tags: ['lofi', 'study', 'relax'] },
  { id: 'gaming1', title: 'Indie Game Showcase', description: 'Discover hidden gems from independent game developers.', imageUrl: 'https://picsum.photos/seed/gaming1/400/300', category: 'gaming', tags: ['indie', 'new', 'pc'] },
  { id: 'ent1', title: 'Top 10 Sci-Fi Movies of the Decade', description: 'A curated list of must-watch science fiction films.', imageUrl: 'https://picsum.photos/seed/ent1/400/300', category: 'entertainment', tags: ['movies', 'scifi', 'top10'] },
  { id: 'scitech1', title: 'The Future of AI', description: 'Exploring advancements in artificial intelligence and machine learning.', imageUrl: 'https://picsum.photos/seed/scitech1/400/300', category: 'science-tech', tags: ['ai', 'ml', 'future'] },
  { id: 'edu1', title: 'Learn React in 30 Days', description: 'A comprehensive guide to mastering React for beginners.', imageUrl: 'https://picsum.photos/seed/edu1/400/300', category: 'education', tags: ['react', 'webdev', 'learning'] },
  { id: 'music2', title: 'Energetic Workout Mix', description: 'Power through your workout with this high-energy playlist.', imageUrl: 'https://picsum.photos/seed/music2/400/300', category: 'music', tags: ['workout', 'energy', 'pop'] },
  { id: 'gaming2', title: 'Retro Gaming Night', description: 'Join us for a nostalgic trip down memory lane with classic games.', imageUrl: 'https://picsum.photos/seed/gaming2/400/300', category: 'gaming', tags: ['retro', 'classic', 'event'] },
  { id: 'scitech2', title: 'Quantum Computing Explained', description: 'A beginner-friendly introduction to the world of quantum computers.', imageUrl: 'https://picsum.photos/seed/scitech2/400/300', category: 'science-tech', tags: ['quantum', 'physics', 'tech'] },
];

export const PROJECT_ITEMS_DATA: Project[] = [
  { id: 'proj1', title: 'Community Chat App', description: 'A real-time chat application for GiiT members. Built with React and Firebase, this app allows users to join various channels, send text messages, and share images. Future plans include voice channels and project collaboration tools.', link: 'https://github.com/example/chat-app', imageUrl: 'https://picsum.photos/seed/proj1/400/300', owner: 'GiiT Dev Team', createdAt: '2023-10-01', tags: ['react', 'nodejs', 'chat'] },
  { id: 'proj2', title: 'AI Powered Learning Platform', description: 'Personalized learning paths using AI. This platform analyzes student performance and preferences to suggest custom learning modules, quizzes, and resources. It aims to make education more adaptive and effective.', imageUrl: 'https://picsum.photos/seed/proj2/400/300', owner: 'AI Research Group', createdAt: '2023-11-15', tags: ['ai', 'education', 'python'] },
  { id: 'proj3', title: 'Open Source Game Engine', description: 'A lightweight game engine for indie developers. Focusing on ease of use and performance, this engine provides tools for 2D and basic 3D game development, including a scene editor and scripting API.', link: 'https://replit.com/@example/game-engine', imageUrl: 'https://picsum.photos/seed/proj3/400/300', owner: 'Gaming Club', createdAt: '2024-01-20', tags: ['gaming', 'c++', 'opensource'] },
];

const commentsForPost1: Comment[] = [
    {id: 'c1p1', author: 'User Alpha', text: 'This looks amazing! Can\'t wait to explore all the features. Great job, GiiT Admin!', createdAt: '2024-03-01T10:00:00Z', avatarUrl: 'https://picsum.photos/seed/usera/30/30'},
    {id: 'c2p1', author: 'User Beta', text: 'Finally! A central place for all things GiiT. The AI chat sounds particularly interesting.', createdAt: '2024-03-01T10:30:00Z', avatarUrl: 'https://picsum.photos/seed/userb/30/30', replies: [
      {id: 'c3p1r1', author: 'GiiT Admin', text: 'Thanks User Beta! Let us know if you have any feedback on the AI chat.', createdAt: '2024-03-01T11:00:00Z', avatarUrl: 'https://picsum.photos/seed/giitadmin/30/30'}
    ]},
];
const commentsForPost2: Comment[] = [
    {id: 'c1p2', author: 'Data Enthusiast', text: 'Excellent guide, Dr. Code! Very clear and concise for beginners. Any recommendations for advanced topics?', createdAt: '2024-03-05T14:00:00Z', avatarUrl: 'https://picsum.photos/seed/userc/30/30'},
    {id: 'c2p2', author: 'Python Newbie', text: 'This is exactly what I was looking for. Thanks for breaking it down so well!', createdAt: '2024-03-05T16:30:00Z', avatarUrl: 'https://picsum.photos/seed/userd/30/30'},
];


export const POST_ITEMS_DATA: Post[] = [
  { 
    id: 'post1', 
    title: 'Welcome to the New GiiT Community Platform!', 
    subtitle: 'Discover all the new features and connect with peers.', 
    body: 'We are incredibly excited to launch the brand new GiiT Community Platform! This space has been designed from the ground up to foster collaboration, learning, and connection among all members of the Genius Institute of Information Technology.\n\n**What can you do here?**\n\n*   **Discover Content:** Explore a wide range of materials shared by fellow students and faculty across various categories like Music, Gaming, Science & Tech, and Education.\n*   **Chat with GiiT AI:** Our integrated AI assistant is here to help you with your queries about GiiT, platform navigation, or even general knowledge questions. It can also search the web for up-to-date information!\n*   **Showcase Projects:** Share your personal or academic projects, find collaborators, and get inspired by the work of others.\n*   **Read & Write Blog Posts:** Stay updated with GiiT news, read insightful articles from members, and contribute your own posts and tutorials.\n*   **Form & Join Teams:** Create or join teams for group projects, study sessions, or special interest groups. Collaborate effectively with dedicated team spaces (coming soon!).\n\nWe believe this platform will become an invaluable resource for your journey at GiiT. Dive in, explore, and start connecting! We look forward to seeing the amazing ways you use this space.\n\n-- The GiiT Admin Team ✨\n\n Check out this video: https://www.youtube.com/watch?v=dQw4w9WgXcQ and this one: https://vimeo.com/579348538', 
    imageUrl: 'https://picsum.photos/seed/post1/600/400', 
    author: 'GiiT Admin', 
    createdAt: '2024-03-01T09:00:00Z', 
    tags: ['announcement', 'community', 'newplatform'], 
    reactions: { heart: 25, thumbsUp: 40, fire: 10, clap: 15 }, 
    comments: commentsForPost1 
  },
  { 
    id: 'post2', 
    title: 'Getting Started with Python for Data Science', 
    subtitle: 'A beginner\'s comprehensive guide to setting up your environment and learning basic syntax.', 
    body: 'Python has become the de facto language for Data Science due to its simplicity, versatility, and the vast ecosystem of libraries available. This guide will walk you through the initial steps to get you started on your Data Science journey with Python.\n\n**1. Setting up your Environment:**\n\n*   **Install Python:** Download the latest version from [python.org](https://python.org) or use a distribution like Anaconda, which comes pre-packaged with many useful data science libraries.\n*   **Virtual Environments:** It\'s highly recommended to use virtual environments (e.g., `venv` or `conda environments`) to manage dependencies for different projects. This prevents conflicts between library versions.\n*   **Essential Libraries:** Install core libraries like NumPy (for numerical operations), Pandas (for data manipulation and analysis), Matplotlib and Seaborn (for data visualization), and Scikit-learn (for machine learning).\n   ```bash\n   pip install numpy pandas matplotlib seaborn scikit-learn jupyter\n   ```\n\n**2. Python Basics for Data Science:**\n\n*   **Data Types:** Understand fundamental data types like integers, floats, strings, lists, tuples, and dictionaries.\n*   **Control Flow:** Learn `if-else` statements and loops (`for`, `while`) for controlling the execution of your code.\n*   **Functions:** Define reusable blocks of code with functions to make your scripts modular and readable.\n\n**3. Introduction to Pandas:**\n\nPandas is your go-to library for working with structured data. Key concepts include:\n\n*   **Series:** A one-dimensional labeled array.\n*   **DataFrame:** A two-dimensional labeled data structure with columns of potentially different types (like a spreadsheet or SQL table).\n*   **Data Loading:** Pandas can read data from various file formats like CSV, Excel, JSON, SQL databases, etc. (`pd.read_csv()`, `pd.read_excel()`)\n*   **Basic Operations:** Data selection, filtering, sorting, grouping, and aggregation.\n\nThis is just the tip of the iceberg. The journey into data science is continuous learning and practice. Happy coding!\n\n-- Dr. Code 💻 \n Embedding a test video: https://www.youtube.com/watch?v=abcdef12345', 
    author: 'Dr. Code', 
    createdAt: '2024-03-05T12:30:00Z', 
    tags: ['python', 'data-science', 'tutorial', 'beginner'], 
    reactions: { heart: 15, thumbsUp: 30, fire: 5, clap: 12 },
    comments: commentsForPost2,
    imageUrl: 'https://picsum.photos/seed/post2py/600/400',
  },
  { 
    id: 'post3', 
    title: 'Hackathon Announcement: AI for Good', 
    subtitle: 'Join us for an exciting weekend of innovation and collaboration to solve real-world problems using AI!', 
    body: 'Get ready, GiiT innovators! We\'re thrilled to announce our upcoming **"AI for Good" Hackathon!**\n\n**Dates:** April 5th - April 7th, 2024\n**Location:** GiiT Main Auditorium & Virtual Participation\n\nThis is your chance to team up, brainstorm, and build AI-powered solutions that can make a positive impact on society. Whether you\'re passionate about healthcare, education, environmental sustainability, or social justice, we want to see your creative ideas come to life.\n\n**Why Participate?**\n\n*   **Solve Real Problems:** Tackle challenges that matter.\n*   **Learn & Grow:** Enhance your AI, coding, and teamwork skills.\n*   **Win Prizes:** Exciting prizes and recognition for top teams.\n*   **Network:** Connect with peers, mentors, and industry professionals.\n\n**Themes (Examples):**\n\n*   AI in Healthcare Accessibility\n*   Sustainable AI for Environmental Protection\n*   AI-driven Tools for Inclusive Education\n*   Ethical AI and Bias Mitigation\n\nRegistrations open next week! Keep an eye on the Events page for more details and the registration link. Start forming your teams and brainstorming ideas!\n\nLet\'s innovate for a better future, together!\n\n-- GiiT Events Team 🚀', 
    imageUrl: 'https://picsum.photos/seed/post3/600/400', 
    author: 'Events Team', 
    createdAt: '2024-03-10T15:00:00Z', 
    tags: ['hackathon', 'ai', 'event', 'innovation'], 
    reactions: { heart: 50, thumbsUp: 70, fire: 25, clap: 30 } 
  },
];

const team1Members: TeamMember[] = [
    { id: 'user1', name: 'Alice Wonderland', avatarUrl: 'https://picsum.photos/seed/alice/40/40', role: 'owner' },
    { id: 'user2', name: 'Bob The Builder', avatarUrl: 'https://picsum.photos/seed/bob/40/40', role: 'admin' },
    { id: 'user3', name: 'Charlie Brown', avatarUrl: 'https://picsum.photos/seed/charlie/40/40', role: 'member' },
];
const team1Channels: Channel[] = [
    { id: 'chan1t1', name: 'general', type: 'text', unreadCount: 3 },
    { id: 'chan2t1', name: 'frontend-discussion', type: 'text' },
    { id: 'chan3t1', name: 'project-brainstorm', type: 'text', unreadCount: 1 },
    { id: 'chan4t1', name: 'weekly-sync', type: 'voice' },
];
const team1Files: SharedFile[] = [
    { id: 'file1t1', name: 'project-brief.pdf', type: 'pdf', size: '1.2 MB', uploadedBy: 'Alice', uploadedAt: '2023-09-05', url: '#' },
    { id: 'file2t1', name: 'design-mockups.zip', type: 'zip', size: '15.7 MB', uploadedBy: 'Bob', uploadedAt: '2023-09-10', url: '#' },
];

const team2Members: TeamMember[] = [
    { id: 'user4', name: 'Diana Prince', avatarUrl: 'https://picsum.photos/seed/diana/40/40', role: 'owner' },
];
const team2Channels: Channel[] = [
    { id: 'chan1t2', name: 'backend-arch', type: 'text' },
    { id: 'chan2t2', name: 'database-talk', type: 'text', unreadCount: 5 },
    { id: 'chan3t2', name: 'dev-ops-hangout', type: 'voice' },
];


export const TEAM_ITEMS_DATA: Team[] = [
    { 
      id: 'team1', name: 'Frontend Wizards', 
      description: 'Crafting amazing user experiences with modern web technologies. This team focuses on React, Tailwind, and Next.js.', 
      membersCount: 3, isPrivate: false, imageUrl: 'https://picsum.photos/seed/team1/100/100', createdAt: '2023-09-01',
      members: team1Members, channels: team1Channels, files: team1Files
    },
    { 
      id: 'team2', name: 'Backend Ninjas', 
      description: 'Building robust and scalable systems to power GiiT applications. We specialize in Python, Django, and PostgreSQL.', 
      membersCount: 1, isPrivate: true, imageUrl: 'https://picsum.photos/seed/team2/100/100', createdAt: '2023-08-15',
      members: team2Members, channels: team2Channels, files: []
    },
    { 
      id: 'team3', name: 'AI Innovators', 
      description: 'Exploring the frontiers of Artificial Intelligence and Machine Learning. Join us for discussions on LLMs, computer vision, and more.', 
      membersCount: 12, isPrivate: false, imageUrl: 'https://picsum.photos/seed/team3/100/100', createdAt: '2023-10-10',
      members: [], channels: [{id: 'ai-gen', name: 'general-ai', type: 'text'}, {id: 'ai-voice', name: 'research-sync', type: 'voice'}], files: []
    },
];


export const BOT_AVATAR_URL = 'https://picsum.photos/seed/giitbot/40/40';
export const USER_AVATAR_URL = 'https://picsum.photos/seed/giituser/40/40';
export const GUEST_AVATAR_URL = 'https://picsum.photos/seed/guestuser/30/30';

export const MOCK_YOUTUBE_VIDEO_ID = 'dQw4w9WgXcQ'; 
export const MOCK_VIMEO_VIDEO_ID = '579348538'; 


const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(14, 0, 0, 0); 

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);
nextWeek.setHours(10, 30, 0, 0); 

const nextMonth = new Date();
nextMonth.setMonth(nextMonth.getMonth() + 1);
nextMonth.setDate(15);
nextMonth.setHours(18,0,0,0); 


export const EVENT_ITEMS_DATA: Event[] = [
  {
    id: 'event1',
    title: 'Guest Lecture: AI in Modern Web Development',
    description: 'Join us for an insightful session with Dr. Eva Core, a leading AI researcher, discussing the impact of AI on web technologies.',
    dateTime: tomorrow.toISOString().slice(0, 16), 
    location: 'GiiT Auditorium & Online',
    meetLink: 'https://meet.google.com/mock-abc-def-ghi',
    createdBy: 'GiiT Admin',
    category: 'seminar',
    imageUrl: 'https://picsum.photos/seed/event1/400/250',
    attendees: ['Admin GiiT', 'Demo User']
  },
  {
    id: 'event2',
    title: 'Workshop: Mastering Tailwind CSS',
    description: 'A hands-on workshop for all skill levels to learn advanced techniques and best practices in Tailwind CSS.',
    dateTime: nextWeek.toISOString().slice(0, 16),
    location: 'Room 301, Tech Park',
    createdBy: 'Frontend Wizards Team',
    category: 'workshop',
    imageUrl: 'https://picsum.photos/seed/event2/400/250',
  },
  {
    id: 'event3',
    title: 'GiiT Community Hackathon Kick-off',
    description: 'The official start of the "AI for Good" Hackathon. Team formation, theme announcements, and mentor introductions.',
    dateTime: new Date('2024-04-05T09:00:00').toISOString().slice(0,16), 
    location: 'Online via GiiT Portal',
    meetLink: 'https://meet.google.com/mock-jkl-mno-pqr',
    createdBy: 'Events Team',
    category: 'hackathon',
    imageUrl: 'https://picsum.photos/seed/event3/400/250',
    attendees: ['Demo User']
  },
   {
    id: 'event4',
    title: 'Monthly Tech Meetup',
    description: 'Casual meetup for GiiT students and faculty. Discuss latest tech trends, network, and share project ideas.',
    dateTime: nextMonth.toISOString().slice(0, 16),
    location: 'GiiT Cafeteria',
    createdBy: 'Student Council',
    category: 'social',
    imageUrl: 'https://picsum.photos/seed/event4/400/250',
  }
];

// MOCK MESSENGER DATA
export const MOCK_MESSENGER_USERS: MessengerUser[] = [
  { id: 'user1', name: 'Alice Wonderland', avatarUrl: 'https://picsum.photos/seed/alice/40/40', isOnline: true },
  { id: 'user2', name: 'Bob The Builder', avatarUrl: 'https://picsum.photos/seed/bob/40/40', isOnline: false, lastSeen: '2 hours ago' },
  { id: 'user3', name: 'Charlie Brown', avatarUrl: 'https://picsum.photos/seed/charlie/40/40', isOnline: true },
  { id: 'user4', name: 'Diana Prince', avatarUrl: 'https://picsum.photos/seed/diana/40/40', isOnline: false, lastSeen: 'yesterday' },
  { id: 'giit-ai', name: 'GiiT AI Assistant', avatarUrl: BOT_AVATAR_URL, isOnline: true },
  { id: 'instructor-dr-code', name: 'Dr. Code', avatarUrl: 'https://picsum.photos/seed/drcode/40/40', isOnline: true }, // Mock Instructor
];

const createMockMessage = (chatId: string, senderId: string, text: string, minsAgo: number, status?: 'sent' | 'delivered' | 'read'): MessengerMessage => ({
  id: `msg-${chatId}-${senderId}-${Date.now() - minsAgo * 60000}`,
  chatId,
  senderId,
  text,
  timestamp: new Date(Date.now() - minsAgo * 60000),
  status: status || (senderId === 'currentUser' ? 'read' : 'sent'), // Mock status
  isAIMessage: senderId === 'giit-ai',
});

export const MOCK_MESSENGER_CHATS: MessengerChat[] = [
  {
    id: 'chat1-alice',
    type: 'private',
    participants: [MOCK_MESSENGER_USERS[0]], 
    lastMessage: createMockMessage('chat1-alice', 'user1', 'Hey, how are you doing?', 5, 'read'),
    unreadCount: 0,
    avatarUrl: MOCK_MESSENGER_USERS[0].avatarUrl,
  },
  {
    id: 'chat2-bob',
    type: 'private',
    participants: [MOCK_MESSENGER_USERS[1]], 
    lastMessage: createMockMessage('chat2-bob', 'user2', 'See you tomorrow at the meeting!', 30, 'delivered'),
    unreadCount: 1,
    avatarUrl: MOCK_MESSENGER_USERS[1].avatarUrl,
  },
  {
    id: 'chat3-group-study',
    type: 'group',
    name: 'Frontend Study Group',
    participants: [MOCK_MESSENGER_USERS[0], MOCK_MESSENGER_USERS[2], MOCK_MESSENGER_USERS[3]], 
    avatarUrl: 'https://picsum.photos/seed/groupStudy/40/40',
    lastMessage: createMockMessage('chat3-group-study', 'user3', 'Can someone explain React Hooks?', 120),
    unreadCount: 3,
  },
  {
    id: 'chat4-giit-ai',
    type: 'ai',
    name: 'GiiT AI Assistant',
    participants: [MOCK_MESSENGER_USERS.find(u=>u.id === 'giit-ai')!], 
    avatarUrl: BOT_AVATAR_URL,
    lastMessage: createMockMessage('chat4-giit-ai', 'giit-ai', 'I can help with that. What specifically about GiiT?', 2, 'read'),
    unreadCount: 0,
  }
];

export const MOCK_ALL_MESSAGES: MessengerMessage[] = [
    createMockMessage('chat1-alice', 'currentUser', 'Hi Alice, are you free later?', 10, 'read'),
    createMockMessage('chat1-alice', 'user1', 'Hey! Yes, I should be. What\'s up?', 8, 'read'),
    createMockMessage('chat1-alice', 'currentUser', 'Just wanted to discuss the project.', 6, 'read'),
    MOCK_MESSENGER_CHATS.find(c=>c.id==='chat1-alice')?.lastMessage!,

    createMockMessage('chat2-bob', 'user2', 'Did you finish the report?', 60, 'delivered'),
    createMockMessage('chat2-bob', 'currentUser', 'Almost, just a few more sections.', 55, 'delivered'),
    MOCK_MESSENGER_CHATS.find(c=>c.id==='chat2-bob')?.lastMessage!,

    createMockMessage('chat3-group-study', 'user4', 'Welcome to the study group!', 240),
    MOCK_MESSENGER_CHATS.find(c=>c.id==='chat3-group-study')?.lastMessage!,

    createMockMessage('chat4-giit-ai', 'currentUser', 'Tell me about GiiT.', 5, 'read'),
    MOCK_MESSENGER_CHATS.find(c=>c.id==='chat4-giit-ai')?.lastMessage!,
].filter(Boolean) as MessengerMessage[]; // Filter out undefined lastMessages


// Learning Platform Data
export const COURSE_INSTRUCTORS_DATA: CourseInstructor[] = [
    { id: 'instr-dr-code', name: 'Dr. Code', avatarUrl: MOCK_MESSENGER_USERS.find(u => u.id === 'instructor-dr-code')?.avatarUrl, bio: 'Lead Data Scientist & Python enthusiast with 10+ years of experience.'},
    { id: 'instr-web-wiz', name: 'Web Wizard', avatarUrl: 'https://picsum.photos/seed/webwiz/80/80', bio: 'Full-stack developer specializing in modern JavaScript frameworks.' },
    { id: 'instr-ai-guru', name: 'AI Guru', avatarUrl: 'https://picsum.photos/seed/aiguru/80/80', bio: 'Machine Learning engineer passionate about teaching complex AI concepts simply.'}
];

export const COURSE_CATEGORIES_DATA: CourseCategory[] = [
    { id: 'cat-prog-scratch', name: 'Programming from Scratch', icon: CodeIcon },
    { id: 'cat-web-dev', name: 'Web Development', icon: CodeIcon },
    { id: 'cat-python-beg', name: 'Python for Beginners', icon: CodeIcon },
    { id: 'cat-data-analysis', name: 'Data Analysis', icon: BarChart3Icon },
    { id: 'cat-ml-ai', name: 'Machine Learning & AI', icon: FlaskConicalIcon },
    { id: 'cat-deep-learn', name: 'Deep Learning', icon: FlaskConicalIcon },
    { id: 'cat-projects', name: 'Projects & Capstone', icon: BriefcaseIcon },
];

export const COURSE_DIFFICULTY_LEVELS: CourseDifficulty[] = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

export const COURSES_DATA: Course[] = [
  {
    id: 'course-py-ds',
    title: 'Python for Data Science: Zero to Hero',
    subtitle: 'Master Python fundamentals and essential libraries for data analysis and visualization.',
    description: 'This comprehensive course takes you from basic Python syntax to advanced data manipulation with Pandas and stunning visualizations with Matplotlib and Seaborn. Perfect for aspiring data scientists, analysts, and anyone looking to harness the power of Python for data.',
    instructorId: 'instr-dr-code',
    categoryIds: ['cat-python-beg', 'cat-data-analysis'],
    difficulty: 'Beginner',
    durationHours: 40,
    price: 49.99,
    isProCourse: false,
    imageUrl: 'https://picsum.photos/seed/coursepyds/400/225',
    previewVideoUrl: MOCK_YOUTUBE_VIDEO_ID,
    rating: 4.8,
    reviewsCount: 120,
    reviews: [],
    modules: [
      { id: 'pymod1', title: 'Module 1: Python Fundamentals', lessons: [{id: 'pyl1', title: 'Introduction to Python', durationMinutes: 15, isFreePreview: true}, {id: 'pyl2', title: 'Variables & Data Types', durationMinutes: 25}]},
      { id: 'pymod2', title: 'Module 2: Control Flow & Functions', lessons: [{id: 'pyl3', title: 'Conditional Statements', durationMinutes: 30}, {id: 'pyl4', title: 'Loops and Iterations', durationMinutes: 40}]},
      { id: 'pymod3', title: 'Module 3: Introduction to Pandas', lessons: [{id: 'pyl5', title: 'Pandas Series & DataFrames', durationMinutes: 60}]},
    ],
    tags: ['python', 'pandas', 'data science', 'numpy', 'matplotlib']
  },
  {
    id: 'course-react-adv',
    title: 'Advanced React & State Management',
    subtitle: 'Deep dive into React Hooks, Context API, Redux, and performance optimization techniques.',
    description: 'Take your React skills to the next level. This course covers advanced patterns, state management solutions like Redux and Zustand, and best practices for building scalable and performant React applications.',
    instructorId: 'instr-web-wiz',
    categoryIds: ['cat-web-dev'],
    difficulty: 'Advanced',
    durationHours: 30,
    price: 79.99,
    isProCourse: true,
    imageUrl: 'https://picsum.photos/seed/coursereactadv/400/225',
    rating: 4.9,
    reviewsCount: 95,
    reviews: [],
    modules: [
      { id: 'reactmod1', title: 'Module 1: Advanced Hooks', lessons: [{id: 'reactl1', title: 'Custom Hooks Deep Dive', durationMinutes: 45}]},
      { id: 'reactmod2', title: 'Module 2: State Management with Redux', lessons: [{id: 'reactl2', title: 'Redux Toolkit Essentials', durationMinutes: 90, isFreePreview: true}]},
    ],
    tags: ['react', 'redux', 'hooks', 'web development', 'javascript']
  },
  {
    id: 'course-ml-tf',
    title: 'Machine Learning with TensorFlow',
    subtitle: 'Build and train neural networks for real-world applications using TensorFlow and Keras.',
    description: 'Learn the fundamentals of machine learning and deep learning. This hands-on course will guide you through building various models like CNNs and RNNs using TensorFlow, with practical projects.',
    instructorId: 'instr-ai-guru',
    categoryIds: ['cat-ml-ai', 'cat-deep-learn'],
    difficulty: 'Intermediate',
    durationHours: 50,
    price: 99.00,
    isProCourse: true,
    imageUrl: 'https://picsum.photos/seed/coursemltf/400/225',
    previewVideoUrl: MOCK_VIMEO_VIDEO_ID,
    rating: 4.7,
    reviewsCount: 150,
    reviews: [],
    modules: [
        {id: 'mlmod1', title: 'Intro to ML & TensorFlow', lessons: [{id: 'mll1', title: 'Core Concepts', durationMinutes: 60, isFreePreview: true}]},
        {id: 'mlmod2', title: 'Building Neural Networks', lessons: [{id: 'mll2', title: 'CNNs for Image Recognition', durationMinutes: 120}]}
    ],
    tags: ['machine learning', 'tensorflow', 'ai', 'deep learning', 'python']
  },
  {
    id: 'course-html-css-js',
    title: 'Web Development Bootcamp: HTML, CSS, JavaScript',
    subtitle: 'The ultimate beginner course to build modern responsive websites from scratch.',
    description: 'Start your web development journey here! Learn HTML5, CSS3, Flexbox, Grid, and modern JavaScript (ES6+) to create beautiful and interactive websites. Numerous projects and exercises included.',
    instructorId: 'instr-web-wiz',
    categoryIds: ['cat-web-dev', 'cat-prog-scratch'],
    difficulty: 'Beginner',
    durationHours: 60,
    price: 0, // Free course
    imageUrl: 'https://picsum.photos/seed/coursewebboot/400/225',
    rating: 4.9,
    reviewsCount: 2500,
    reviews: [],
    modules: [
        {id: 'webmod1', title: 'HTML Essentials', lessons: [{id: 'webl1', title: 'Structuring Web Pages', durationMinutes: 45, isFreePreview: true}]},
        {id: 'webmod2', title: 'CSS Styling', lessons: [{id: 'webl2', title: 'Flexbox and Grid Layouts', durationMinutes: 90}]},
        {id: 'webmod3', title: 'JavaScript Fundamentals', lessons: [{id: 'webl3', title: 'DOM Manipulation', durationMinutes: 75, isFreePreview: true}]},
    ],
    tags: ['html', 'css', 'javascript', 'web development', 'frontend']
  }
];
