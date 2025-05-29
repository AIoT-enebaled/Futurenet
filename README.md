# 🌐 GiiT Community Web App (Prototype)
Your All-in-One Platform for Learning, Collaboration, Real-Time Communication, and AI Assistance.
# About GiiT.
# *GiiT (Genius Institute of Information Technology)* is a young Ugandan startup on a mission to scale digital education across Africa. We offer private, hybrid (online/physical) coding and tech classes for kids aged 5 and up—ranging from computer basics to advanced topics in Data and Computer Science. Our flexible programs include cohort-based learning, holiday tech bootcamps, and personalized homeschooling support, empowering the next generation of innovators.


The GiiT Community App is a next-generation, cloud-powered platform built to empower developers, learners, educators, and communities. It combines the best of learning management systems, messaging apps, collaboration hubs, AI tools, and SaaS-based access control — all in one streamlined experience.

Whether you're building projects, chatting with your team, joining a live event, exploring the latest in tech, or studying Data Science — this app brings all the tools to your fingertips with real-time functionality and scalable infrastructure.

# 🔥 Core Features
# 🛡️ Authentication & Roles
Secure JWT-based login and registration 
Firebase Auth integration

# Role-based permissions: Admin, Moderator, Member Unique GiiT ID for each user

# 💬 Real-Time Messaging (Messenger/WhatsApp-Style)
Private and group chatrooms

Threaded replies, emoji reactions

Voice & video calling (WebRTC)

Share images, audio, documents, and voice notes

Create text and voice channels for structured communication

# 🧠 GiiT Chatbot & GenAI (PRO)
Conversational assistant built with Hugging Face or Gemini Flash

Help with learning topics, app support, and documentation queries

Available only to PRO subscribers

Team leaders can subscribe for their members via SaaS model

# 📚 Learning Platform
Full course library from beginner topics to advanced Data Science

Individual course purchase support

Dynamic course catalog with previews

Ideal for self-paced learning and community training

# 📖 Blogs & Community Posts
Full-featured blog system with markdown, media, and reactions

Community-driven posts with real-time comments

Clean grid layout and post history/editing features

# 👥 Teams, Study Hubs & Projects
Join or create collaborative teams

Private study hubs for focused learning

Share GitHub/Replit links and auto-import projects

Google Meet or built-in video rooms for live collaboration

# 🌍 Discover & Explore
Find trending topics in science, gaming, entertainment, education, and music
Cards, tags, and content previews for easy navigation

# 📆 Events & Google Meet Integration.
Host or join events with automatic Google Meet link generation
Event calendar and RSVP system

# 📈 Analytics Dashboard
Track community engagement, course progress, blog reach
Charts and visual insights for admins and moderators

# ☁️ Cloud-Native Architecture (BaaS)
Firebase or Supabase for database, auth, and storage.

Firestore / Supabase DB for structured cloud data.

Firebase Functions / Supabase Edge Functions for serverless backend.

Stripe / Paystack for payments and SaaS subscription control.

Built for high concurrency, fast loading, and seamless scalability (like YouTube or Netflix)

# 🔐 Security Highlights
Real-time database rules to protect data.
No bypassing subscriptions or access roles
OAuth and token-based API access only
Firestore/Supabase security rules and verification layers

# 🛠️ Tech Stack
Layer	Stack
Frontend	React.js / Next.js / Streamlit / Reflex
Auth	Firebase Auth + JWT
Backend	Firebase / Supabase (BaaS)
Realtime	Firestore / Supabase Realtime / WebRTC
Media	Firebase Storage / Supabase Storage
AI	Hugging Face / Gemini Flash API
Payment	Stripe / Paystack
UI	Tailwind CSS + Custom Animations

# 📦 Getting Started
## Clone the project
### git clone https://github.com/your-username/chatroom.git
cd giit-community-app

# Install dependencies
npm install

# Run locally
npm run dev.
## 🤝 Contributing.
#### We welcome contributions! Whether it's fixing bugs, adding features, or improving documentation — feel free to fork and submit a pull request.

# 📃 License
MIT License – Free to use and customize for community empowerment.


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
