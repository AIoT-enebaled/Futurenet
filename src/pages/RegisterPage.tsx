import React, { useState } from 'react';
import { AuthService, User } from '../services/firebase'; // Adjust path relative to RegisterPage.tsx
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router-dom

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<User['role']>('student'); // Default to student - SECURE THIS IN PROD
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authService = new AuthService();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // **SECURITY NOTE:** Allowing users to select their own role like this is INSECURE for 'instructor' or 'admin'.
      // In a real application, student might be the only option here, or roles assigned by an admin.
      const newUser = await authService.signUp(email, password, displayName, role);
      console.log('User registered:', newUser);
      // Redirect to a welcome page or home page after successful registration
      navigate('/'); // Adjust redirect path as needed
    } catch (err: any) {
      console.error('Registration failed:', err);
      // Firebase Auth errors have 'code' and 'message' properties
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label htmlFor="displayName">Display Name:</label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>
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
        {/* **SECURITY NOTE:** This role selection is for demonstration. Implement securely! */}
        <div>
          <label htmlFor="role">Register as:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value as User['role'])}>
            <option value="student">Student</option>
            {/* Options below should typically NOT be available in a public registration form */}
            {/* <option value="instructor">Instructor</option> */}
            {/* <option value="admin">Admin</option> */}
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
};

export default RegisterPage;