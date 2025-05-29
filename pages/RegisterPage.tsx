
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { UserCircleIcon } from '../components/icons'; 

interface RegisterPageProps {
  onRegister: (user: User) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const storedUsersString = localStorage.getItem('giitRegisteredUsers');
    const registeredUsers: User[] = storedUsersString ? JSON.parse(storedUsersString) : [];
    if (registeredUsers.find(u => u.email === email)) {
        setError('An account with this email already exists. Please log in or use a different email.');
        return;
    }

    // Determine role based on email domain for mock purposes
    let role: User['role'] = 'member';
    if (email.endsWith('@giitadmin.com')) { // Example admin domain
        role = 'admin';
    }

    const mockNewUser: User = {
      id: `giit-usr-${Date.now().toString().slice(-6)}`, 
      email: email,
      displayName: displayName,
      password: password, 
      avatarUrl: `https://picsum.photos/seed/${email.split('@')[0]}/100/100`, 
      role: role,
    };

    try {
      onRegister(mockNewUser);
      navigate(role === 'admin' ? "/analytics" : "/profile"); // Navigate admin to analytics
    } catch (regError: any) {
      setError(regError.message || "Registration failed. Please try again.");
    }
  };
  
  const commonInputStyles = "appearance-none relative block w-full px-4 py-3 border border-brand-border placeholder-brand-text-muted text-brand-text bg-brand-bg rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple focus:z-10 sm:text-sm shadow-sm transition-colors";


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 sm:p-10 bg-brand-surface shadow-2xl rounded-xl border border-brand-border/30">
        <div>
          <UserCircleIcon className="mx-auto h-12 w-auto text-brand-purple" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-text">
            Join the GiiT FutureNet
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-center text-sm text-red-400 bg-red-900/30 p-3 rounded-md border border-red-700/40">{error}</p>}
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="display-name" className="sr-only">Display Name</label>
              <input
                id="display-name"
                name="displayName"
                type="text"
                required
                className={commonInputStyles}
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
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
                autoComplete="new-password"
                required
                className={commonInputStyles}
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={commonInputStyles}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-purple-pink hover:shadow-glow-pink focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface transition-all duration-300 transform hover:scale-105 active:scale-100"
            >
              Create Account
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-brand-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-cyan hover:text-brand-pink hover:underline transition-colors">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;