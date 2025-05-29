
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { LogInIcon } from '../components/icons';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === 'geniusinstitute2024@gmail.com' && password === 'Geniusinstitute2024') {
      const adminUser: User = {
       id: 'giit-admin-main-001', 
       email: email,
       displayName: 'GiiT Main Admin',
       avatarUrl: 'https://picsum.photos/seed/giitMainAdmin/100/100', 
       role: 'admin',
     };
     onLogin(adminUser);
     navigate('/analytics'); 
     return;
   }

    const storedUsersString = localStorage.getItem('giitRegisteredUsers');
    let registeredUsers: User[] = []; // Default to empty array

    if (storedUsersString && storedUsersString !== "null") { // Explicitly check for "null" string
        try {
            const parsedData = JSON.parse(storedUsersString);
            if (Array.isArray(parsedData)) {
                registeredUsers = parsedData;
            } else {
                console.warn("[LoginPage] 'giitRegisteredUsers' from localStorage was not an array after parsing:", parsedData);
                // Keep registeredUsers as empty array if parsedData is not an array (e.g., if it was 'null' which parses to null object)
            }
        } catch (parseError) {
            console.error("[LoginPage] Error parsing 'giitRegisteredUsers' from localStorage:", parseError);
            // Optionally clear the corrupted item: localStorage.removeItem('giitRegisteredUsers');
            // Keep registeredUsers as empty array
        }
    }
    
    const foundRegisteredUser = registeredUsers.find(u => u.email === email && u.password === password);

    if (foundRegisteredUser) {
      const { password: _, ...userToLogin } = foundRegisteredUser;
      onLogin(userToLogin);
      navigate(userToLogin.role === 'admin' ? "/analytics" : "/profile");
      return;
    }

    if (email === 'user@example.com' && password === 'password123') {
      const mockUser: User = {
        id: 'giit-user-001',
        email: email,
        displayName: 'Demo User',
        avatarUrl: 'https://picsum.photos/seed/demoUser/100/100',
        role: 'member',
      };
      onLogin(mockUser);
      navigate('/profile');
    }
    else {
      setError('Invalid email or password. Please check your credentials or register if you are a new user.');
    }
  };
  
  const commonInputStyles = "appearance-none relative block w-full px-4 py-3 border border-brand-border placeholder-brand-text-muted text-brand-text bg-brand-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple focus:z-10 sm:text-sm shadow-sm transition-colors";

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 bg-brand-surface shadow-2xl rounded-xl border border-brand-border/30">
        <div>
          <LogInIcon className="mx-auto h-12 w-auto text-brand-purple" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-text">
            Access Your GiiT Account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-center text-sm text-red-400 bg-red-900/30 p-3 rounded-md border border-red-700/40">{error}</p>}
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={commonInputStyles}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={commonInputStyles}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <a href="#" title="Password reset (Feature TBD)" className="font-medium text-brand-cyan hover:text-brand-pink transition-colors">
              Forgot your password?
            </a>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-purple-pink hover:shadow-glow-pink focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface transition-all duration-300 transform hover:scale-105 active:scale-100"
            >
              Sign in
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-brand-text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-brand-cyan hover:text-brand-pink hover:underline transition-colors">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
