
export interface NavItem {
  name: string;
  path: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  isHome?: boolean;
  isAuth?: boolean; 
  isUnauth?: boolean; 
  isInstructor?: boolean; // For instructor-specific nav items
}

export interface FileInfo {
  name: string;
  type: string; // MIME type
  size: number; // bytes
  url?: string; // For downloadable files (mock)
}

export interface VoiceNoteInfo {
  duration: number; // seconds
  audioSrc?: string; // mock audio source or data URL
  waveform?: number[]; // mock waveform data
}
export interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  avatar?: string; 
  imageUrl?: string;
  fileInfo?: FileInfo; 
  voiceNoteInfo?: VoiceNoteInfo; 
  // FIX: Added isAIMessage property to ChatMessage interface
  isAIMessage?: boolean; 
}

export interface DiscoverCategory {
  id: string;
  name: string;
  icon?: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode; 
}

export interface DiscoverItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string; 
  tags?: string[];
  author?: string;
  createdAt?: string;
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web: GroundingChunkWeb;
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string; 
  imageUrl: string;
  owner: string; // User ID or name
  createdAt: string; // ISO date string
  tags?: string[];
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
  avatarUrl?: string;
  replies?: Comment[]; 
}

export interface Post {
  id: string;
  title: string;
  subtitle?: string;
  body: string; 
  imageUrl?: string;
  author: string; // User ID or name
  createdAt: string; // ISO date string
  tags?: string[];
  reactions: {
    heart?: number;
    thumbsUp?: number;
    fire?: number;
    clap?: number;
  };
  comments?: Comment[];
}

export interface TeamMember {
    id: string; // User ID
    name: string;
    avatarUrl?: string;
    role: 'owner' | 'admin' | 'member';
}

export interface Channel {
    id: string;
    name: string;
    type: 'text' | 'voice';
    unreadCount?: number; 
}

export interface SharedFile {
    id: string;
    name: string;
    type: string; 
    size: string; 
    uploadedBy: string; // User name
    uploadedAt: string; // ISO date string
    url?: string; 
}

export interface Team {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  isPrivate: boolean;
  imageUrl?: string;
  createdAt: string; // ISO date string
  members?: TeamMember[];
  channels?: Channel[];
  files?: SharedFile[];
}

export type SubscriptionTier = 'free' | 'pro_individual' | 'pro_team' | 'subscription_all_courses';

export interface User {
  id: string; 
  email: string;
  displayName: string;
  username?: string; 
  bio?: string; 
  avatarUrl?: string;
  role?: 'admin' | 'member' | 'moderator' | 'instructor'; 
  password?: string; 
  is_pro_user?: boolean; 
  pro_expiry_date?: string | null; 
  subscribed_tier?: SubscriptionTier;
  instructorId?: string; // If user is an instructor, their instructor profile ID
}

export interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: string; 
  location?: string; 
  meetLink?: string;
  createdBy: string; 
  attendees?: string[]; 
  imageUrl?: string;
  category?: 'workshop' | 'seminar' | 'social' | 'hackathon' | 'meeting';
}

// Messenger Types
export interface MessengerUser {
  id: string;
  name: string;
  avatarUrl: string;
  isOnline?: boolean;
  lastSeen?: string | Date; 
}

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface MessengerMessage {
  id: string;
  chatId: string;
  senderId: string; 
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string; 
  docUrl?: string;
  docName?: string;
  timestamp: Date;
  status?: MessageStatus; 
  isAIMessage?: boolean; 
}

export interface MessengerChat {
  id: string;
  type: 'private' | 'group' | 'ai'; 
  name?: string; 
  participants: MessengerUser[]; 
  lastMessage?: MessengerMessage;
  unreadCount?: number;
  avatarUrl?: string; 
  isMuted?: boolean;
  typing?: TypingIndicator[];
}

export interface TypingIndicator {
  userId: string;
  userName: string;
}

// App Settings
export interface AppSettings {
  theme: 'light' | 'dark';
  notificationSounds: boolean;
}

// Page specific props
export interface TeamsPageProps {
  currentUser: User | null;
  teams: Team[];
  onCreateTeam: (teamData: Omit<Team, 'id' | 'createdAt' | 'membersCount' | 'members' | 'channels' | 'files'>) => void;
}

export interface SingleTeamPageProps {
  currentUser: User | null;
  teams: Team[];
  onUpdateTeam: (teamId: string, updatedData: Partial<Team>) => void;
  onDeleteTeam: (teamId: string) => void;
}

export interface BlogPageProps {
  currentUser: User | null;
  posts: Post[];
  onCreatePost: (postData: Omit<Post, 'id' | 'createdAt' | 'reactions' | 'comments'>) => void;
  onDeletePost: (postId: string) => void; 
  onUpdatePost: (postId: string, updatedData: Partial<Post>) => void; 
}

export interface SinglePostPageProps {
  currentUser: User | null;
  posts: Post[];
  onUpdatePost: (postId: string, updatedData: Partial<Post>) => void;
  onDeletePost: (postId: string) => void;
}

export interface ProjectsPageProps {
  currentUser: User | null;
  projects: Project[];
  onCreateProject: (projectData: Omit<Project, 'id' | 'createdAt'>) => void;
  onUpdateProject: (projectId: string, updatedData: Partial<Project>) => void;
  onDeleteProject: (projectId: string) => void;
}

export interface SettingsPageProps {
  currentUser: User; 
  onUpdateUser: (updatedUserData: Partial<Omit<User, 'id' | 'role' | 'password'>>) => void;
  appSettings: AppSettings;
  onUpdateAppSettings: (updatedSettings: Partial<AppSettings>) => void;
}

export interface SubscriptionPageProps {
    currentUser: User;
    onCancelPro: () => void; 
    teams: Team[]; 
    onUpdateTeamMemberProStatus?: (teamId: string, memberId: string, isPro: boolean) => void; 
}

export interface PricingTier {
    name: string;
    priceMonthly: string;
    priceAnnually?: string;
    features: string[];
    ctaText: string;
    tierId: SubscriptionTier | 'contact_sales' | 'subscription_all_courses';
    isPopular?: boolean;
    annualDiscountText?: string;
}

// Learning Platform Types
export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface CourseCategory {
  id: string;
  name: string;
  icon?: React.ElementType; // e.g., CodeIcon
}

export interface CourseInstructor {
  id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  // socialLinks?: { platform: string, url: string }[];
}

export interface CourseLesson {
  id: string;
  title: string;
  durationMinutes: number;
  videoUrl?: string; // Mock, or actual URL
  description?: string;
  isFreePreview?: boolean;
  // quizId?: string;
  // downloadableMaterials?: { name: string, url: string }[];
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
  description?: string;
}

export interface CourseReview {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number; // 1-5
    comment: string;
    createdAt: string; // ISO Date
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  instructorId: string; 
  categoryIds: string[]; 
  difficulty: CourseDifficulty;
  durationHours: number; // Total course duration
  price: number; // 0 for free
  imageUrl?: string;
  previewVideoUrl?: string; // Short preview
  modules: CourseModule[];
  tags?: string[];
  isProCourse?: boolean; // Requires Pro subscription OR direct purchase
  rating?: number; // Average rating 0-5
  reviewsCount?: number;
  reviews?: CourseReview[];
  // learningObjectives?: string[];
  // requirements?: string[];
  // targetAudience?: string[];
  // certificateAvailable?: boolean;
  // publishedAt?: string; // ISO Date
}

export interface CoursePurchase { // Mock structure
  courseId: string;
  userId: string;
  purchasedAt: string; // ISO Date
  // accessExpiresAt?: string; // For time-limited access
}


export interface LearningPageProps {
  currentUser: User | null;
  courses: Course[];
  purchasedCourses: string[]; // Array of course IDs
  onPurchaseCourse: (courseId: string, isProCourse?: boolean) => void;
  onSubscribePro: (tier: SubscriptionTier) => void; // For "Go Pro" modal
}

export interface CoursePageProps {
  currentUser: User | null;
  courses: Course[];
  purchasedCourses: string[];
  onPurchaseCourse: (courseId: string, isProCourse?: boolean) => void;
  onSubscribePro: (tier: SubscriptionTier) => void;
  onUpdateCourse: (courseId: string, updatedData: Partial<Course>) => void; // For reviews
}

export interface MyCoursesPageProps {
  currentUser: User | null;
  courses: Course[];
  purchasedCourses: string[];
}

export interface InstructorDashboardPageProps {
    currentUser: User; // Must be an instructor
    courses: Course[];
    instructors: CourseInstructor[];
    onCreateCourse: (newCourse: Omit<Course, 'id' | 'rating' | 'reviewsCount' | 'reviews'>) => void;
    onUpdateCourse: (courseId: string, updatedData: Partial<Course>) => void;
}
