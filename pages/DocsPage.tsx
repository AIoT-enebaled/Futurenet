
import React from 'react';
import { BookOpenIcon } from '../components/icons';

const DocsPage: React.FC = () => {
  const sections = [
    { id: 'welcome', title: '👋 Welcome to GiiT FutureNet!' },
    { id: 'ai-chat', title: '🤖 Engaging the GiiT AI Assistant' },
    { id: 'projects', title: '🛠️ Showcasing Projects' },
    { id: 'blog-posts', title: '✍️ GiiT Insights: Blog & Posts' },
    { id: 'teams-collaboration', title: '🤝 Team Hubs & Collaboration' },
    { id: 'events-calendar', title: '🗓️ Community Events' },
    { id: 'messenger', title: '💬 Direct & Group Messaging'},
    { id: 'general-tips', title: '💡 Platform Navigation & Tips' },
  ];

  const SectionContent: React.FC<{ sectionId: string; children: React.ReactNode }> = ({ sectionId, children }) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return null;
    return (
      <section id={sectionId} aria-labelledby={`${sectionId}-title`} className="mb-10 p-6 sm:p-8 bg-brand-surface rounded-xl shadow-xl border border-brand-border/30">
        <h2 id={`${sectionId}-title`} className="text-2xl sm:text-3xl font-semibold text-brand-text mb-5 border-b-2 pb-3 border-brand-border/40">
          {section.title}
        </h2>
        <div className="space-y-4 text-brand-text-muted leading-relaxed prose prose-base md:prose-lg dark:prose-invert max-w-none 
                        prose-headings:text-brand-text prose-a:text-brand-cyan hover:prose-a:text-brand-pink prose-strong:text-brand-text
                        prose-ul:list-disc prose-ul:marker:text-brand-purple prose-li:my-1.5 prose-p:text-brand-text-muted
                        prose-code:bg-brand-bg prose-code:text-brand-pink prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:border prose-code:border-brand-border/50
                        prose-blockquote:border-l-4 prose-blockquote:border-brand-purple prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-brand-text-muted">
          {children}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-10">
      <header className="text-center border-b-2 border-brand-border/40 pb-10 mb-12">
        <BookOpenIcon className="w-20 h-20 sm:w-24 sm:h-24 text-brand-purple mx-auto mb-6" />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-text">GiiT FutureNet Guide</h1>
        <p className="text-lg sm:text-xl text-brand-text-muted mt-4 max-w-2xl mx-auto">Your comprehensive manual to navigating and maximizing the GiiT community platform.</p>
      </header>

      <nav aria-labelledby="on-this-page-title" className="sticky top-4 z-30 bg-brand-surface/90 backdrop-blur-md py-3.5 px-4 sm:px-6 mb-10 rounded-xl shadow-lg border border-brand-border/40 -mx-2 sm:-mx-0">
        <h3 id="on-this-page-title" className="text-sm font-semibold text-brand-text mb-2.5 uppercase tracking-wider">On This Page:</h3>
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
          {sections.map(section => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="text-sm text-brand-cyan hover:text-brand-pink hover:underline transition-colors">
                {section.title.split(' ')[1].replace(':', '')} {/* Shortened title for nav */}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <SectionContent sectionId="welcome">
        <p>This platform is designed to help members of the Genius Institute of Information Technology (GiiT) connect, collaborate, and grow together. Here’s a quick overview of what you can do:</p>
        <ul>
          <li><strong>Discover:</strong> Explore content shared by the community, sorted by categories like Music, Gaming, Tech, and Education.</li>
          <li><strong>GiiT AI Chat:</strong> Interact with our helpful AI assistant for information, guidance, or just a friendly chat. Accessible via main navigation and a global widget.</li>
          <li><strong>Messenger:</strong> Engage in direct one-on-one chats or create group conversations with fellow members.</li>
          <li><strong>Projects:</strong> Showcase your projects, find collaborators, and see what others are building.</li>
          <li><strong>Blog (Insights):</strong> Read and publish articles, tutorials, and community updates.</li>
          <li><strong>Teams:</strong> Create or join teams to work on specific goals, projects, or study groups. Each team has its own chat, member list, and file sharing.</li>
          <li><strong>Events:</strong> Stay informed about upcoming GiiT events, workshops, and meetups.</li>
        </ul>
         <p className="mt-3 p-3 bg-brand-bg/70 rounded-md border border-brand-border/50 text-sm">
          <strong>Pro Tip:</strong> Make sure to complete your profile to help others connect with you!
        </p>
      </SectionContent>

      <SectionContent sectionId="ai-chat">
        <p>Our AI assistant, powered by Google's Gemini models, is here to help!</p>
        <ul>
          <li>Ask questions about GiiT, its programs, or resources.</li>
          <li>Get help navigating the platform.</li>
          <li>Inquire about recent news or events (the AI can search the web for up-to-date info).</li>
          <li>Simply type your message in the input field and press Enter or click the send button.</li>
          <li>If the AI uses web search for its answer, it will try to provide source links for you to explore further.</li>
        </ul>
        <p className="mt-3 p-3 bg-brand-bg/70 rounded-md border border-brand-border/50 text-sm">
          <strong>Note:</strong> The AI is a tool to assist you. Always cross-verify critical information if needed. For official GiiT policies, refer to formal documentation or administrators.
        </p>
      </SectionContent>
      
       <SectionContent sectionId="messenger">
        <p>Connect directly with other GiiT members or form group chats.</p>
        <ul>
          <li><strong>Starting Chats:</strong> Use the "New Chat" button to find and message users individually.</li>
          <li><strong>Group Chats:</strong> Use the "New Group" button, name your group, and add members.</li>
          <li><strong>Navigation:</strong> Your chat list appears on the left. Click any chat to open it in the main view.</li>
          <li><strong>Functionality:</strong> Send text messages. Image, voice, and document sharing are mock features for now.</li>
           <li><strong>AI Chat in Messenger:</strong> You can also find the GiiT AI Assistant in your chat list for quick access.</li>
        </ul>
      </SectionContent>

      <SectionContent sectionId="projects">
        <p>The Projects Hub is your space to share what you're working on and discover others' innovations.</p>
        <ul>
          <li><strong>Viewing Projects:</strong> Browse existing projects in a card grid. Click on a project for more details if available (currently, cards link to external sites if provided).</li>
          <li><strong>Adding a Project:</strong> Click the "Add Project" button. Fill in the title, description, and optionally a link to your project (e.g., GitHub, Replit) and an image URL. Tags help in discoverability.</li>
          <li><strong>Editing/Deleting:</strong> If you are the project owner or an admin, you'll see options to edit or delete your project submissions.</li>
        </ul>
      </SectionContent>

       <SectionContent sectionId="blog-posts">
        <p>GiiT Insights is where you share your thoughts, knowledge, and updates with the community.</p>
        <ul>
          <li><strong>Reading Posts:</strong> Browse posts in a card format. Click "Read more" to view the full content on its dedicated page.</li>
          <li><strong>Creating a Post:</strong> Click "Create Post". Add a title, an optional subtitle, and your main content in the body. You can also add an image URL and tags.</li>
          <li><strong>Interacting:</strong> Engage with posts by adding reactions (❤️, 👍) or leaving comments on the single post page. You can also reply to existing comments.</li>
          <li><strong>Editing/Deleting:</strong> Post owners and admins can edit or delete posts from the main blog page or the single post page.</li>
        </ul>
      </SectionContent>
      
      <SectionContent sectionId="teams-collaboration">
        <p>Form or join Team Hubs for focused collaboration and communication.</p>
        <ul>
          <li><strong>Viewing Teams:</strong> See a list of public and private (if you're a member) teams.</li>
          <li><strong>Creating a Team:</strong> Click "Create Team". Provide a name, description, and choose if it's public or private. An image URL can be added for personalization.</li>
          <li><strong>Team Interaction:</strong> Once on a team page:
            <ul>
                <li><strong>Channels:</strong> Admins/owners can create text and voice channels. Select a channel to interact. Text channels have a mock chat. Voice channels are placeholders.</li>
                <li><strong>Members:</strong> View the list of team members. Admins/owners can (mock) invite new members.</li>
                <li><strong>Files:</strong> A mock file sharing area. Members can (mock) upload files.</li>
            </ul>
          </li>
          <li><strong>Admin Actions:</strong> Team owners can edit team details and delete the team.</li>
        </ul>
      </SectionContent>

       <SectionContent sectionId="events-calendar">
        <p>Stay updated with all GiiT happenings.</p>
        <ul>
            <li><strong>Viewing Events:</strong> Browse upcoming and past events. Each card shows details like date, time, location, and category.</li>
            <li><strong>Creating Events:</strong> If logged in, you can create new events, providing all necessary details including an optional Google Meet link (mock generation available) and image URL.</li>
            <li><strong>Interaction:</strong> (Mock) Mark attendance for events. Use the share button to spread the word (uses browser's share API if available).</li>
        </ul>
      </SectionContent>

      <SectionContent sectionId="general-tips">
        <ul>
          <li><strong>Navigation:</strong> Use the sidebar on the left (or the hamburger menu on mobile) to navigate between different sections of the app.</li>
          <li><strong>Dark Mode:</strong> The app defaults to a dark theme, providing a comfortable viewing experience.</li>
          <li><strong>Responsiveness:</strong> The app is designed to adapt to various screen sizes, from desktop to mobile.</li>
          <li><strong>Tooltips & ARIA:</strong> We strive to make the platform accessible. Hover over icon buttons for tooltips, and we use ARIA attributes for screen readers.</li>
          <li><strong>Feedback:</strong> This platform is continuously evolving. If you have suggestions or encounter issues, please reach out to a GiiT admin or use any available feedback channels.</li>
        </ul>
        <p className="mt-3 p-3 bg-brand-bg/70 rounded-md border border-brand-border/50 text-sm">
          <strong>Enjoy your time on GiiT FutureNet!</strong> We're excited to see how you connect, create, and contribute.
        </p>
      </SectionContent>
    </div>
  );
};

export default DocsPage;