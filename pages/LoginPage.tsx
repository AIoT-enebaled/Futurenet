import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../types";
import { LogInIcon } from "../components/icons";
import { signInWithEmailAndPassword } from "../services/mockAuthService";

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Convert mock user to app User type
      const userToLogin: User = {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        username: user.displayName.toLowerCase().replace(/\s+/g, ""),
        avatarUrl: user.photoURL || undefined,
        role:
          user.email === "walkerchristopherr549@gmail.com" ? "admin" : "member",
        is_pro_user: user.email === "walkerchristopherr549@gmail.com",
        pro_expiry_date:
          user.email === "walkerchristopherr549@gmail.com"
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : null,
        subscribed_tier:
          user.email === "walkerchristopherr549@gmail.com"
            ? "pro_individual"
            : "free",
      };

      onLogin(userToLogin);
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.message === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else if (error.message === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (userType: "admin" | "user") => {
    if (userType === "admin") {
      setEmail("admin@example.com");
      setPassword("admin123");
    } else {
      setEmail("user@example.com");
      setPassword("user123");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gradient-purple-pink">
            <LogInIcon className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-text">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-brand-text-muted">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-brand-purple hover:text-brand-pink transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Quick Login Demo Buttons */}
        <div className="bg-brand-surface-alt rounded-lg p-4 space-y-2">
          <p className="text-sm text-brand-text-muted text-center mb-3">
            Demo Login:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin("admin")}
              className="px-3 py-2 text-xs bg-brand-purple text-white rounded hover:bg-brand-purple/80 transition-colors"
            >
              Admin Login
            </button>
            <button
              onClick={() => handleQuickLogin("user")}
              className="px-3 py-2 text-xs bg-brand-cyan text-white rounded hover:bg-brand-cyan/80 transition-colors"
            >
              User Login
            </button>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brand-text mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full px-3 py-2 border border-brand-border rounded-md placeholder-brand-text-muted text-brand-text bg-brand-bg focus:outline-none focus:ring-brand-purple focus:border-brand-purple focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-brand-text mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-3 py-2 border border-brand-border rounded-md placeholder-brand-text-muted text-brand-text bg-brand-bg focus:outline-none focus:ring-brand-purple focus:border-brand-purple focus:z-10 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Link
              to="/register"
              className="text-sm text-brand-purple hover:text-brand-pink transition-colors"
            >
              Don't have an account?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-purple-pink hover:shadow-glow-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
