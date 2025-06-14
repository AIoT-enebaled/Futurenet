import React, { useState } from 'react';
import { AuthService } from '../services/firebase'; // Adjust path relative to LoginPage.tsx
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router-dom
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authService = new AuthService();
  const { currentUser } = useAuth(); // Get the current user from AuthContext

  // If the user is already logged in, redirect them away from the login page
  // This check runs on render
  if (currentUser) {
    navigate('/', { replace: true }); // Redirect to home or dashboard if already logged in
    return null; // Prevent rendering the login form
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await authService.signIn(email, password); // signIn updates the auth state, which AuthProvider listens to
      // The AuthProvider's listener will update the currentUser state,
      // and the check at the top of this component will handle the navigation.
      console.log('Login successful (auth state updated)');
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/register">Register here</a></p>
    </div>
  );
};

export default LoginPage;