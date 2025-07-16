import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../types";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "../services/mockAuthService";
import { UserCircleIcon } from "../components/icons";

interface RegisterPageProps {
  onRegister: (user: User) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!displayName.trim()) {
      setError("Please enter your display name");
      return;
    }

    try {
      setLoading(true);

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, { displayName: displayName.trim() });

      // Convert to app User type
      const newUser: User = {
        id: user.uid,
        email: user.email,
        displayName: displayName.trim(),
        username: displayName.toLowerCase().replace(/\s+/g, ""),
        avatarUrl: undefined,
        role: "member",
        is_pro_user: false,
        pro_expiry_date: null,
        subscribed_tier: "free",
      };

      onRegister(newUser);
      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.message === "auth/email-already-in-use") {
        setError("An account with this email address already exists.");
      } else if (error.message === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.");
      } else if (error.message === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gradient-purple-pink">
            <UserCircleIcon className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-text">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-brand-text-muted">
            Or{" "}
            <Link
              to="/login"
              className="font-medium text-brand-purple hover:text-brand-pink transition-colors"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-brand-text mb-1"
              >
                Display Name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="relative block w-full px-3 py-2 border border-brand-border rounded-md placeholder-brand-text-muted text-brand-text bg-brand-bg focus:outline-none focus:ring-brand-purple focus:border-brand-purple focus:z-10 sm:text-sm"
                placeholder="Enter your display name"
              />
            </div>

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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-3 py-2 border border-brand-border rounded-md placeholder-brand-text-muted text-brand-text bg-brand-bg focus:outline-none focus:ring-brand-purple focus:border-brand-purple focus:z-10 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-brand-text mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="relative block w-full px-3 py-2 border border-brand-border rounded-md placeholder-brand-text-muted text-brand-text bg-brand-bg focus:outline-none focus:ring-brand-purple focus:border-brand-purple focus:z-10 sm:text-sm"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="text-xs text-brand-text-muted">
            By creating an account, you agree to our terms of service and
            privacy policy.
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-purple-pink hover:shadow-glow-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-purple disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
