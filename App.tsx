

import React, { useState, useEffect } from 'react'; 
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import ChatBotPage from './pages/ChatBotPage';
import ProjectsPage from './pages/ProjectsPage';
import { BlogPage } from './pages/BlogPage'; 
import SinglePostPage from './pages/SinglePostPage'; 
import TeamsPage from './pages/TeamsPage';
import SingleTeamPage from './pages/SingleTeamPage'; 
import DocsPage from './pages/DocsPage';
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage'; 
import ProfilePage from './pages/ProfilePage'; 
import EventsPage from './pages/EventsPage';
import AnalyticsPage from './pages/AnalyticsPage'; 
import { MessengerPage } from './pages/MessengerPage';
import SettingsPage from './pages/SettingsPage'; 
import SubscriptionPage from './pages/SubscriptionPage'; 
import LearningPage from './pages/LearningPage'; // New
import CoursePage from './pages/CoursePage'; // New
import MyCoursesPage from './pages/MyCoursesPage'; // New
import InstructorDashboardPage from './pages/InstructorDashboardPage'; // New

import { NAV_ITEMS, TEAM_ITEMS_DATA, POST_ITEMS_DATA, PROJECT_ITEMS_DATA, MOCK_MESSENGER_CHATS, MOCK_ALL_MESSAGES, COURSES_DATA, COURSE_INSTRUCTORS_DATA, COURSE_CATEGORIES_DATA } from './constants';
import { User, Team, Post, Project, AppSettings, SubscriptionTier, MessengerChat, MessengerMessage, Course, CoursePurchase, CourseInstructor, CourseCategory } from './types'; 
import { checkApiKey } from './services/geminiService'; 

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [apiKeyExists, setApiKeyExists] = useState<boolean>(false);
  
  // Centralized state for dynamic data
  const [teams, setTeams] = useState<Team[]>(TEAM_ITEMS_DATA);
  const [posts, setPosts] = useState<Post[]>(POST_ITEMS_DATA);
  const [projects, setProjects] = useState<Project[]>(PROJECT_ITEMS_DATA);

  // Learning Platform State
  const [courses, setCourses] = useState<Course[]>(COURSES_DATA);
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>(() => {
    const stored = localStorage.getItem('giitPurchasedCourses');
    return stored ? JSON.parse(stored) : [];
  });
  const [courseInstructors, setCourseInstructors] = useState<CourseInstructor[]>(COURSE_INSTRUCTORS_DATA);
  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>(COURSE_CATEGORIES_DATA);

  useEffect(() => {
    localStorage.setItem('giitPurchasedCourses', JSON.stringify(purchasedCourses));
  }, [purchasedCourses]);


  // Messenger State
  const [chats, setChats] = useState<MessengerChat[]>(() => {
    const storedChats = localStorage.getItem('giitMessengerChats');
    try {
      return storedChats ? JSON.parse(storedChats) : MOCK_MESSENGER_CHATS;
    } catch (e) {
      console.error("Error parsing chats from localStorage", e);
      return MOCK_MESSENGER_CHATS;
    }
  });

  const [allMessages, setAllMessages] = useState<MessengerMessage[]>(() => {
    const storedAllMessages = localStorage.getItem('giitMessengerAllMessages');
    let initialAllMessages = MOCK_ALL_MESSAGES;
    if (storedAllMessages) {
      try {
        const parsedMessages = JSON.parse(storedAllMessages) as MessengerMessage[];
        initialAllMessages = parsedMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp), 
        }));
      } catch (e) {
        console.error("Error parsing allMessages from localStorage", e);
      }
    }
    return initialAllMessages;
  });

  useEffect(() => {
    localStorage.setItem('giitMessengerChats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('giitMessengerAllMessages', JSON.stringify(allMessages));
  }, [allMessages]);


  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const storedSettings = localStorage.getItem('giitAppSettings');
    return storedSettings ? JSON.parse(storedSettings) : { theme: 'dark', notificationSounds: true };
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('giitUser');
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Assign instructor role if applicable (mock logic)
        if (parsedUser.email === 'instructor.drcode@giit.com') {
             parsedUser.role = 'instructor';
             parsedUser.instructorId = 'instr-dr-code';
        }
        setCurrentUser(parsedUser);
    }
    setApiKeyExists(checkApiKey());

    if (appSettings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [appSettings.theme]);

  const handleLogin = (user: User) => {
    const userToLogin : User = {
      ...user,
      is_pro_user: user.email === 'geniusinstitute2024@gmail.com' ? true : (user.is_pro_user || false),
      pro_expiry_date: user.email === 'geniusinstitute2024@gmail.com' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : (user.pro_expiry_date || null),
      subscribed_tier: user.email === 'geniusinstitute2024@gmail.com' ? 'pro_individual' : (user.subscribed_tier || 'free'),
      role: user.email === 'geniusinstitute2024@gmail.com' ? 'admin' : (user.email === 'instructor.drcode@giit.com' ? 'instructor' : user.role || 'member'),
      instructorId: user.email === 'instructor.drcode@giit.com' ? 'instr-dr-code' : user.instructorId,
    };
    setCurrentUser(userToLogin);
    localStorage.setItem('giitUser', JSON.stringify(userToLogin));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('giitUser');
  };
  
  const handleRegister = (userWithPassword: User) => {
    const storedUsersString = localStorage.getItem('giitRegisteredUsers');
    const registeredUsers: User[] = storedUsersString ? JSON.parse(storedUsersString) : [];
    
    if (registeredUsers.find(u => u.email === userWithPassword.email)) {
        console.error("User with this email already exists."); 
        throw new Error("User with this email already exists.");
    }
    
    const userToRegister: User = {
      ...userWithPassword,
      is_pro_user: false,
      pro_expiry_date: null,
      subscribed_tier: 'free' as SubscriptionTier,
      role: userWithPassword.email === 'instructor.drcode@giit.com' ? 'instructor' : userWithPassword.role || 'member',
      instructorId: userWithPassword.email === 'instructor.drcode@giit.com' ? 'instr-dr-code' : undefined,
    };

    registeredUsers.push(userToRegister); 
    localStorage.setItem('giitRegisteredUsers', JSON.stringify(registeredUsers));

    const { password, ...userWithoutPassword } = userToRegister;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('giitUser', JSON.stringify(userWithoutPassword));
  };

  const handleUpdateUser = (updatedUserData: Partial<Omit<User, 'id' | 'role' | 'password'>>) => {
    if (!currentUser) return;
    const newUserState = { ...currentUser, ...updatedUserData };
    setCurrentUser(newUserState);
    localStorage.setItem('giitUser', JSON.stringify(newUserState));
    
    const storedUsersString = localStorage.getItem('giitRegisteredUsers');
    if (storedUsersString) {
        let registeredUsers: User[] = JSON.parse(storedUsersString);
        const userIndex = registeredUsers.findIndex(u => u.id === currentUser.id);
        if (userIndex > -1) {
            const existingPassword = registeredUsers[userIndex].password;
            registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...updatedUserData };
            if(existingPassword) registeredUsers[userIndex].password = existingPassword;
            localStorage.setItem('giitRegisteredUsers', JSON.stringify(registeredUsers));
        }
    }
  };

  const handleUpdateAppSettings = (updatedSettings: Partial<AppSettings>) => {
    setAppSettings(prevSettings => {
      const newSettings = { ...prevSettings, ...updatedSettings };
      localStorage.setItem('giitAppSettings', JSON.stringify(newSettings));
      if (newSettings.theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
      return newSettings;
    });
  };

  const handleSubscribePro = (tier: SubscriptionTier) => {
    if (!currentUser) return;
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); 
    
    const updatedUser = {
      ...currentUser,
      is_pro_user: true,
      pro_expiry_date: expiryDate.toISOString(),
      subscribed_tier: tier,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('giitUser', JSON.stringify(updatedUser));

     const storedUsersString = localStorage.getItem('giitRegisteredUsers');
    if (storedUsersString) {
        let registeredUsers: User[] = JSON.parse(storedUsersString);
        const userIndex = registeredUsers.findIndex(u => u.id === currentUser.id);
        if (userIndex > -1) {
            registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...updatedUser };
            localStorage.setItem('giitRegisteredUsers', JSON.stringify(registeredUsers));
        }
    }
    alert(`Successfully subscribed to ${tier}! GenAI features unlocked.`);
  };

  const handleCancelPro = () => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      is_pro_user: false,
      pro_expiry_date: null,
      subscribed_tier: 'free' as SubscriptionTier,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('giitUser', JSON.stringify(updatedUser));
    
    const storedUsersString = localStorage.getItem('giitRegisteredUsers');
    if (storedUsersString) {
        let registeredUsers: User[] = JSON.parse(storedUsersString);
        const userIndex = registeredUsers.findIndex(u => u.id === currentUser.id);
        if (userIndex > -1) {
            registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...updatedUser};
            localStorage.setItem('giitRegisteredUsers', JSON.stringify(registeredUsers));
        }
    }
    alert("Subscription cancelled. Pro features are now disabled.");
  };

  // Team CRUD
  const handleCreateTeam = (teamData: Omit<Team, 'id' | 'createdAt' | 'membersCount' | 'members' | 'channels' | 'files'>) => {
    if (!currentUser) return;
    const newTeam: Team = {
      id: `team-${Date.now()}`, ...teamData, createdAt: new Date().toISOString(), membersCount: 1,
      members: [{ id: currentUser.id, name: currentUser.displayName, avatarUrl: currentUser.avatarUrl, role: 'owner' }],
      channels: [{id: `gen-${Date.now()}`, name: 'general', type: 'text'}], files: [],
    };
    setTeams(prev => [newTeam, ...prev]);
  };
  const handleUpdateTeam = (teamId: string, updatedData: Partial<Team>) => setTeams(prev => prev.map(t => t.id === teamId ? { ...t, ...updatedData, membersCount: updatedData.members?.length || t.membersCount } : t));
  const handleDeleteTeam = (teamId: string) => setTeams(prev => prev.filter(t => t.id !== teamId));

  // Post CRUD
  const handleCreatePost = (postData: Omit<Post, 'id' | 'createdAt' | 'reactions' | 'comments'>) => {
    if (!currentUser) return;
    const newPost: Post = {
        id: `post-${Date.now()}`, ...postData, author: postData.author || currentUser.displayName, createdAt: new Date().toISOString(),
        reactions: { heart: 0, thumbsUp: 0, fire: 0, clap: 0 }, comments: [],
    };
    setPosts(prev => [newPost, ...prev]);
  };
  const handleUpdatePost = (postId: string, updatedData: Partial<Post>) => setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updatedData } : p));
  const handleDeletePost = (postId: string) => setPosts(prev => prev.filter(p => p.id !== postId));

  // Project CRUD
  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
     if (!currentUser) return;
    const newProject: Project = { id: `proj-${Date.now()}`, ...projectData, owner: projectData.owner || currentUser.displayName, createdAt: new Date().toISOString() };
    setProjects(prev => [newProject, ...prev]);
  };
  const handleUpdateProject = (projectId: string, updatedData: Partial<Project>) => setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updatedData } : p));
  const handleDeleteProject = (projectId: string) => setProjects(prev => prev.filter(p => p.id !== projectId));

  // Learning Platform Handlers
  const handlePurchaseCourse = (courseId: string, isProCourse?: boolean) => {
    if (!currentUser) {
      alert("Please log in to purchase or enroll in courses.");
      return;
    }
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    if (course.isProCourse && !currentUser.is_pro_user) {
      // Trigger GoProModal or similar logic
      handleSubscribePro('pro_individual'); // For now, just mock subscribe
      // After mock subscription, re-check and add if now Pro
      // This part is a bit simplified; real flow might involve modal then purchase
      if(currentUser.is_pro_user || !course.isProCourse) { // re-check needed if modal was used
         if (!purchasedCourses.includes(courseId)) {
            setPurchasedCourses(prev => [...prev, courseId]);
            alert(`Enrolled in Pro course: ${course.title}!`);
         } else {
            alert(`Already enrolled in ${course.title}.`);
         }
      } else {
          alert(`Upgrade to Pro to access ${course.title}.`);
      }
      return;
    }
    
    if (!purchasedCourses.includes(courseId)) {
      setPurchasedCourses(prev => [...prev, courseId]);
      alert(`Successfully purchased/enrolled in: ${course.title}!`);
    } else {
      alert(`You are already enrolled in ${course.title}.`);
    }
  };
  
  const handleUpdateCourse = (courseId: string, updatedData: Partial<Course>) => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === courseId ? { ...course, ...updatedData } : course
      )
    );
  };

  const handleCreateCourseByInstructor = (newCourseData: Omit<Course, 'id'|'rating'|'reviewsCount'|'reviews'>) => {
    if(!currentUser || currentUser.role !== 'instructor') {
        alert("Only instructors can create courses.");
        return;
    }
    const fullNewCourse: Course = {
        id: `course-${Date.now()}`,
        ...newCourseData,
        rating: 0,
        reviewsCount: 0,
        reviews: [],
    };
    setCourses(prev => [fullNewCourse, ...prev]);
    alert(`Course "${fullNewCourse.title}" created successfully!`);
  };

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout currentUser={currentUser} onLogout={handleLogout} apiKeyExists={apiKeyExists} onSubscribePro={handleSubscribePro} />}>
          <Route path="/" element={<Navigate to={NAV_ITEMS.find(item => item.isHome)?.path || '/home'} replace />} />
          {/* FIX: Ensure HomePage component receives the 'courses' prop as defined in its props interface. */}
          <Route path="/home" element={<HomePage currentUser={currentUser} onSubscribePro={handleSubscribePro} courses={courses.slice(0,3)} />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/chat" element={<ChatBotPage currentUser={currentUser} onSubscribePro={handleSubscribePro}/>} />
          <Route 
            path="/messenger" 
            element={<MessengerPage currentUser={currentUser} chats={chats} setChats={setChats} allMessages={allMessages} setAllMessages={setAllMessages} />} 
          />
          <Route 
            path="/messenger/:chatId" 
            element={<MessengerPage currentUser={currentUser} chats={chats} setChats={setChats} allMessages={allMessages} setAllMessages={setAllMessages} />} 
          />
          <Route 
            path="/projects" 
            element={<ProjectsPage currentUser={currentUser} projects={projects} onCreateProject={handleCreateProject} onUpdateProject={handleUpdateProject} onDeleteProject={handleDeleteProject} onSubscribePro={handleSubscribePro} />} 
          />
          <Route 
            path="/blog" 
            element={<BlogPage currentUser={currentUser} posts={posts} onCreatePost={handleCreatePost} onDeletePost={handleDeletePost} onUpdatePost={handleUpdatePost} onSubscribePro={handleSubscribePro} />} 
          />
          <Route 
            path="/blog/:postId" 
            element={<SinglePostPage currentUser={currentUser} posts={posts} onUpdatePost={handleUpdatePost} onDeletePost={handleDeletePost} />} 
          />
          <Route 
            path="/teams" 
            element={<TeamsPage currentUser={currentUser} teams={teams} onCreateTeam={handleCreateTeam} />} 
          />
          <Route 
            path="/teams/:teamId" 
            element={<SingleTeamPage currentUser={currentUser} teams={teams} onUpdateTeam={handleUpdateTeam} onDeleteTeam={handleDeleteTeam} onSubscribePro={handleSubscribePro} />} 
          /> 
          <Route path="/events" element={<EventsPage currentUser={currentUser} />} /> 
          <Route path="/docs" element={<DocsPage />} />
          <Route 
            path="/analytics" 
            element={currentUser?.role === 'admin' ? <AnalyticsPage /> : <Navigate to="/home" replace />} 
          />
          <Route 
            path="/settings" 
            element={currentUser ? <SettingsPage currentUser={currentUser} onUpdateUser={handleUpdateUser} appSettings={appSettings} onUpdateAppSettings={handleUpdateAppSettings} /> : <Navigate to="/login" replace />}
          />
          <Route 
            path="/subscription"
            element={currentUser ? <SubscriptionPage currentUser={currentUser} onCancelPro={handleCancelPro} teams={teams.filter(team => team.members?.some(m => m.id === currentUser?.id && m.role === 'owner'))} /> : <Navigate to="/login" replace />}
          />
           {/* Learning Platform Routes */}
          <Route 
            path="/learning" 
            element={<LearningPage currentUser={currentUser} courses={courses} purchasedCourses={purchasedCourses} onPurchaseCourse={handlePurchaseCourse} onSubscribePro={handleSubscribePro} />} 
          />
          <Route 
            path="/learning/courses/:courseId" 
            element={<CoursePage currentUser={currentUser} courses={courses} purchasedCourses={purchasedCourses} onPurchaseCourse={handlePurchaseCourse} onSubscribePro={handleSubscribePro} onUpdateCourse={handleUpdateCourse} />} 
          />
          <Route 
            path="/learning/my-courses" 
            element={currentUser ? <MyCoursesPage currentUser={currentUser} courses={courses} purchasedCourses={purchasedCourses} /> : <Navigate to="/login" replace />} 
          />
          <Route
            path="/learning/instructor-dashboard"
            element={currentUser?.role === 'instructor' ? <InstructorDashboardPage currentUser={currentUser} courses={courses} instructors={courseInstructors} onCreateCourse={handleCreateCourseByInstructor} onUpdateCourse={handleUpdateCourse} /> : <Navigate to="/learning" replace />}
          />

          <Route path="/login" element={!currentUser ? <LoginPage onLogin={handleLogin} /> : <Navigate to={currentUser.role === 'admin' && currentUser.is_pro_user ? "/analytics" : "/profile"} replace />} />
          <Route path="/register" element={!currentUser ? <RegisterPage onRegister={handleRegister} /> : <Navigate to="/profile" replace />} />
          <Route path="/profile" element={currentUser ? <ProfilePage currentUser={currentUser} /> : <Navigate to="/login" replace />} />
          
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;