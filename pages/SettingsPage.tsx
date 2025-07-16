import React, { useState, useEffect } from "react";
import { SettingsPageProps, User } from "../types";
import {
  SettingsIcon,
  UserCircleIcon,
  LockIcon,
  BellIcon,
  ShieldIcon,
  Link2Icon,
  ActivityIcon,
  SunIcon,
  MoonIcon,
  EditIcon,
  KeyIcon,
  EyeIcon,
  EyeOffIcon,
  TrashIcon,
  DatabaseIcon,
  DownloadIcon,
  SmartphoneIcon,
  GlobeIcon,
  ClockIcon,
} from "../components/icons";
import Modal from "../components/Modal";

type SettingsTab =
  | "profile"
  | "account"
  | "notifications"
  | "privacy"
  | "integrations"
  | "admin";

const SettingsPage: React.FC<SettingsPageProps> = ({
  currentUser,
  onUpdateUser,
  appSettings,
  onUpdateAppSettings,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // Profile States
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [username, setUsername] = useState(currentUser.username || "");
  const [bio, setBio] = useState(currentUser.bio || "");
  const [email, setEmail] = useState(currentUser.email); // Email change might need verification logic
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || "");

  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Account States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Notification States
  const [notificationSettings, setNotificationSettings] = useState({
    mentions: true,
    directMessages: true,
    teamUpdates: true,
    projectNotifications: true,
    emailDigest: true,
    pushNotifications: true,
    desktopNotifications: true,
    messagePreview: true,
  });

  // Privacy States
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public" as "public" | "team" | "private",
    onlineStatus: true,
    readReceipts: true,
    typingIndicators: true,
    allowDirectMessages: "everyone" as "everyone" | "team" | "none",
    searchable: true,
  });

  // Integration States
  const [connectedServices, setConnectedServices] = useState({
    google: false,
    github: false,
    slack: false,
    discord: false,
  });

  useEffect(() => {
    setDisplayName(currentUser.displayName);
    setUsername(currentUser.username || "");
    setBio(currentUser.bio || "");
    setEmail(currentUser.email);
    setAvatarUrl(currentUser.avatarUrl || "");
  }, [currentUser]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onUpdateUser({ displayName, username, bio, email, avatarUrl });
      setFeedbackMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
    } catch (error) {
      setFeedbackMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    }
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleThemeToggle = () => {
    onUpdateAppSettings({
      theme: appSettings.theme === "dark" ? "light" : "dark",
    });
  };

  const handleNotificationSoundToggle = () => {
    onUpdateAppSettings({
      notificationSounds: !appSettings.notificationSounds,
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setFeedbackMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }
    if (newPassword.length < 8) {
      setFeedbackMessage({
        type: "error",
        text: "Password must be at least 8 characters long!",
      });
      return;
    }
    // Mock password change
    setFeedbackMessage({
      type: "success",
      text: "Password changed successfully!",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyToggle = (
    key: keyof typeof privacySettings,
    value?: any,
  ) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: value !== undefined ? value : !prev[key],
    }));
  };

  const handleServiceToggle = (service: keyof typeof connectedServices) => {
    setConnectedServices((prev) => ({ ...prev, [service]: !prev[service] }));
    setFeedbackMessage({
      type: "success",
      text: `${service} ${!connectedServices[service] ? "connected" : "disconnected"} successfully!`,
    });
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleDataExport = () => {
    setFeedbackMessage({
      type: "success",
      text: "Data export started! You will receive an email when ready.",
    });
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleAccountDeletion = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      setFeedbackMessage({
        type: "error",
        text: "Account deletion is not available in demo mode.",
      });
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const commonInputStyles =
    "block w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple sm:text-sm text-brand-text placeholder-brand-text-muted transition-colors";
  const primaryButtonStyles =
    "flex items-center justify-center px-5 py-2.5 bg-gradient-purple-pink text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface disabled:opacity-70 disabled:cursor-not-allowed";

  const tabItems: { id: SettingsTab; name: string; icon: React.ElementType }[] =
    [
      { id: "profile", name: "Profile", icon: UserCircleIcon },
      { id: "account", name: "Account", icon: LockIcon },
      { id: "notifications", name: "Notifications", icon: BellIcon },
      { id: "privacy", name: "Privacy & Security", icon: ShieldIcon },
      { id: "integrations", name: "Integrations", icon: Link2Icon },
      ...(currentUser.role === "admin"
        ? [
            {
              id: "admin" as SettingsTab,
              name: "Admin Controls",
              icon: ActivityIcon,
            },
          ]
        : []),
    ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={
                  avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=7C3AED&color=fff&size=96`
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-brand-purple shadow-md"
              />
              <div>
                <label
                  htmlFor="avatarUrl"
                  className="block text-sm font-medium text-brand-text-muted mb-1"
                >
                  Avatar URL
                </label>
                <input
                  type="url"
                  id="avatarUrl"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.png"
                  className={`${commonInputStyles} max-w-md`}
                />
                <button
                  type="button"
                  onClick={() => alert("File upload coming soon!")}
                  className="mt-2 text-xs text-brand-cyan hover:underline"
                >
                  Upload Image (soon)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-brand-text-muted mb-1"
                >
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className={commonInputStyles}
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-brand-text-muted mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_unique_username"
                  className={commonInputStyles}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brand-text-muted mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={commonInputStyles}
              />
              <p className="text-xs text-brand-text-darker mt-1">
                Email change might require verification (mock for now).
              </p>
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-brand-text-muted mb-1"
              >
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell us a bit about yourself..."
                className={commonInputStyles}
              ></textarea>
            </div>

            <h3 className="text-lg font-semibold text-brand-text pt-4 border-t border-brand-border/30">
              Appearance & Sounds
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-brand-bg rounded-lg border border-brand-border/40">
                <span className="text-sm text-brand-text-muted">Theme</span>
                <button
                  type="button"
                  onClick={handleThemeToggle}
                  className="p-2 rounded-full hover:bg-brand-surface-alt transition-colors text-brand-text-muted"
                  aria-label={`Switch to ${appSettings.theme === "dark" ? "light" : "dark"} mode`}
                >
                  {appSettings.theme === "dark" ? (
                    <SunIcon className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <MoonIcon className="w-5 h-5 text-brand-purple" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-brand-bg rounded-lg border border-brand-border/40">
                <span className="text-sm text-brand-text-muted">
                  Notification Sounds
                </span>
                <label
                  htmlFor="notifSoundToggle"
                  className="relative inline-flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="notifSoundToggle"
                    className="sr-only peer"
                    checked={appSettings.notificationSounds}
                    onChange={handleNotificationSoundToggle}
                  />
                  <div className="w-11 h-6 bg-brand-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-purple rounded-full peer dark:bg-brand-border peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-brand-border peer-checked:bg-brand-purple"></div>
                </label>
              </div>
            </div>

            {feedbackMessage && (
              <div
                className={`p-3 rounded-md text-sm text-center ${feedbackMessage.type === "success" ? "bg-green-600/20 text-green-300 border border-green-600/40" : "bg-red-700/20 text-red-300 border border-red-700/40"}`}
              >
                {feedbackMessage.text}
              </div>
            )}

            <div className="pt-5">
              <button type="submit" className={primaryButtonStyles}>
                Save Profile Changes
              </button>
            </div>
          </form>
        );
      case "account":
        return (
          <div className="space-y-8">
            {/* Password Change Section */}
            <div>
              <h3 className="text-lg font-semibold text-brand-text mb-4 flex items-center">
                <KeyIcon className="w-5 h-5 mr-2 text-brand-purple" />
                Change Password
              </h3>
              <form
                onSubmit={handlePasswordChange}
                className="space-y-4 max-w-md"
              >
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-brand-text-muted mb-1"
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className={commonInputStyles}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-text-muted hover:text-brand-text"
                    >
                      {showCurrentPassword ? (
                        <EyeOffIcon className="w-4 h-4" />
                      ) : (
                        <EyeIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-brand-text-muted mb-1"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className={commonInputStyles}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-text-muted hover:text-brand-text"
                    >
                      {showNewPassword ? (
                        <EyeOffIcon className="w-4 h-4" />
                      ) : (
                        <EyeIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-brand-text-muted mb-1"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={commonInputStyles}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-brand-purple hover:bg-brand-purple/80 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Update Password
                </button>
              </form>
            </div>

            {/* Two-Factor Authentication */}
            <div className="border-t border-brand-border/30 pt-8">
              <h3 className="text-lg font-semibold text-brand-text mb-4 flex items-center">
                <SmartphoneIcon className="w-5 h-5 mr-2 text-brand-purple" />
                Two-Factor Authentication
              </h3>
              <div className="flex items-center justify-between p-4 bg-brand-bg rounded-lg border border-brand-border/40 max-w-md">
                <div>
                  <p className="text-sm font-medium text-brand-text">
                    Enable 2FA
                  </p>
                  <p className="text-xs text-brand-text-muted">
                    Add an extra layer of security
                  </p>
                </div>
                <label
                  htmlFor="twoFactorToggle"
                  className="relative inline-flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="twoFactorToggle"
                    className="sr-only peer"
                    checked={twoFactorEnabled}
                    onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  />
                  <div className="w-11 h-6 bg-brand-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-purple rounded-full peer dark:bg-brand-border peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-brand-border peer-checked:bg-brand-purple"></div>
                </label>
              </div>
              {twoFactorEnabled && (
                <div className="mt-4 p-4 bg-brand-surface rounded-lg border border-brand-border/40 max-w-md">
                  <p className="text-sm text-brand-text-muted">
                    2FA is enabled. Download an authenticator app and scan the
                    QR code to complete setup.
                  </p>
                  <button className="mt-2 text-brand-cyan hover:underline text-sm">
                    Setup Authenticator App
                  </button>
                </div>
              )}
            </div>

            {/* Account Actions */}
            <div className="border-t border-brand-border/30 pt-8">
              <h3 className="text-lg font-semibold text-brand-text mb-4 flex items-center">
                <DatabaseIcon className="w-5 h-5 mr-2 text-brand-purple" />
                Account Actions
              </h3>
              <div className="space-y-4 max-w-md">
                <button
                  onClick={handleDataExport}
                  className="flex items-center justify-between w-full p-4 bg-brand-bg rounded-lg border border-brand-border/40 hover:bg-brand-surface-alt transition-colors"
                >
                  <div className="flex items-center">
                    <DownloadIcon className="w-5 h-5 mr-3 text-brand-cyan" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-brand-text">
                        Export Data
                      </p>
                      <p className="text-xs text-brand-text-muted">
                        Download all your data
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleAccountDeletion}
                  className="flex items-center justify-between w-full p-4 bg-red-900/20 rounded-lg border border-red-700/40 hover:bg-red-900/30 transition-colors"
                >
                  <div className="flex items-center">
                    <TrashIcon className="w-5 h-5 mr-3 text-red-400" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-red-300">
                        Delete Account
                      </p>
                      <p className="text-xs text-red-400">
                        Permanently delete your account
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-brand-text mb-4 flex items-center">
                <BellIcon className="w-5 h-5 mr-2 text-brand-purple" />
                Notification Preferences
              </h3>
              <p className="text-brand-text-muted mb-6">
                Choose what notifications you want to receive and how you want
                to receive them.
              </p>

              <div className="space-y-4">
                {Object.entries({
                  mentions: "When someone mentions you",
                  directMessages: "Direct messages",
                  teamUpdates: "Team activity and updates",
                  projectNotifications: "Project notifications",
                  emailDigest: "Daily email digest",
                  pushNotifications: "Push notifications",
                  desktopNotifications: "Desktop notifications",
                  messagePreview: "Show message previews",
                }).map(([key, label]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 bg-brand-bg rounded-lg border border-brand-border/40"
                  >
                    <div>
                      <p className="text-sm font-medium text-brand-text">
                        {label}
                      </p>
                      <p className="text-xs text-brand-text-muted">
                        {key === "mentions" &&
                          "Get notified when someone @mentions you in chat or comments"}
                        {key === "directMessages" &&
                          "Receive notifications for new direct messages"}
                        {key === "teamUpdates" &&
                          "Stay updated on team member activities and status changes"}
                        {key === "projectNotifications" &&
                          "Get notified about project updates and assignments"}
                        {key === "emailDigest" &&
                          "Receive a daily summary of important activities via email"}
                        {key === "pushNotifications" &&
                          "Receive push notifications on mobile devices"}
                        {key === "desktopNotifications" &&
                          "Show desktop notifications when the app is in background"}
                        {key === "messagePreview" &&
                          "Show message content in notification previews"}
                      </p>
                    </div>
                    <label
                      htmlFor={`notif-${key}`}
                      className="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id={`notif-${key}`}
                        className="sr-only peer"
                        checked={
                          notificationSettings[
                            key as keyof typeof notificationSettings
                          ]
                        }
                        onChange={() =>
                          handleNotificationToggle(
                            key as keyof typeof notificationSettings,
                          )
                        }
                      />
                      <div className="w-11 h-6 bg-brand-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-purple rounded-full peer dark:bg-brand-border peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-brand-border peer-checked:bg-brand-purple"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Schedule */}
            <div className="border-t border-brand-border/30 pt-8">
              <h3 className="text-lg font-semibold text-brand-text mb-4 flex items-center">
                <ClockIcon className="w-5 h-5 mr-2 text-brand-purple" />
                Quiet Hours
              </h3>
              <p className="text-brand-text-muted mb-4">
                Set specific hours when you don't want to receive notifications.
              </p>
              <div className="flex items-center space-x-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-brand-text-muted mb-1">
                    From
                  </label>
                  <input
                    type="time"
                    defaultValue="22:00"
                    className={commonInputStyles}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-text-muted mb-1">
                    To
                  </label>
                  <input
                    type="time"
                    defaultValue="08:00"
                    className={commonInputStyles}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case "privacy":
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-brand-text mb-4 flex items-center">
                <ShieldIcon className="w-5 h-5 mr-2 text-brand-purple" />
                Privacy Settings
              </h3>
              <p className="text-brand-text-muted mb-6">
                Control who can see your information and how others can interact
                with you.
              </p>

              <div className="space-y-6">
                {/* Profile Visibility */}
                <div className="p-4 bg-brand-bg rounded-lg border border-brand-border/40">
                  <h4 className="text-sm font-medium text-brand-text mb-2">
                    Profile Visibility
                  </h4>
                  <p className="text-xs text-brand-text-muted mb-3">
                    Who can view your profile information
                  </p>
                  <div className="space-y-2">
                    {[
                      {
                        value: "public",
                        label: "Public",
                        desc: "Anyone can view your profile",
                      },
                      {
                        value: "team",
                        label: "Team Only",
                        desc: "Only team members can view your profile",
                      },
                      {
                        value: "private",
                        label: "Private",
                        desc: "Only you can view your profile",
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center p-2 rounded cursor-pointer hover:bg-brand-surface-alt"
                      >
                        <input
                          type="radio"
                          name="profileVisibility"
                          value={option.value}
                          checked={
                            privacySettings.profileVisibility === option.value
                          }
                          onChange={() =>
                            handlePrivacyToggle(
                              "profileVisibility",
                              option.value,
                            )
                          }
                          className="mr-3 text-brand-purple focus:ring-brand-purple"
                        />
                        <div>
                          <p className="text-sm text-brand-text">
                            {option.label}
                          </p>
                          <p className="text-xs text-brand-text-muted">
                            {option.desc}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Direct Messages */}
                <div className="p-4 bg-brand-bg rounded-lg border border-brand-border/40">
                  <h4 className="text-sm font-medium text-brand-text mb-2">
                    Direct Messages
                  </h4>
                  <p className="text-xs text-brand-text-muted mb-3">
                    Who can send you direct messages
                  </p>
                  <div className="space-y-2">
                    {[
                      {
                        value: "everyone",
                        label: "Everyone",
                        desc: "Anyone can send you messages",
                      },
                      {
                        value: "team",
                        label: "Team Only",
                        desc: "Only team members can message you",
                      },
                      {
                        value: "none",
                        label: "No One",
                        desc: "Block all direct messages",
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center p-2 rounded cursor-pointer hover:bg-brand-surface-alt"
                      >
                        <input
                          type="radio"
                          name="allowDirectMessages"
                          value={option.value}
                          checked={
                            privacySettings.allowDirectMessages === option.value
                          }
                          onChange={() =>
                            handlePrivacyToggle(
                              "allowDirectMessages",
                              option.value,
                            )
                          }
                          className="mr-3 text-brand-purple focus:ring-brand-purple"
                        />
                        <div>
                          <p className="text-sm text-brand-text">
                            {option.label}
                          </p>
                          <p className="text-xs text-brand-text-muted">
                            {option.desc}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Activity Indicators */}
                <div className="space-y-4">
                  {Object.entries({
                    onlineStatus: "Show online status",
                    readReceipts: "Send read receipts",
                    typingIndicators: "Show typing indicators",
                    searchable: "Allow others to find you in search",
                  }).map(([key, label]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 bg-brand-bg rounded-lg border border-brand-border/40"
                    >
                      <div>
                        <p className="text-sm font-medium text-brand-text">
                          {label}
                        </p>
                        <p className="text-xs text-brand-text-muted">
                          {key === "onlineStatus" &&
                            "Let others see when you're online or away"}
                          {key === "readReceipts" &&
                            "Send confirmation when you've read messages"}
                          {key === "typingIndicators" &&
                            "Show others when you're typing a message"}
                          {key === "searchable" &&
                            "Allow your profile to appear in user search results"}
                        </p>
                      </div>
                      <label
                        htmlFor={`privacy-${key}`}
                        className="relative inline-flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          id={`privacy-${key}`}
                          className="sr-only peer"
                          checked={
                            privacySettings[
                              key as keyof typeof privacySettings
                            ] as boolean
                          }
                          onChange={() =>
                            handlePrivacyToggle(
                              key as keyof typeof privacySettings,
                            )
                          }
                        />
                        <div className="w-11 h-6 bg-brand-border peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-purple rounded-full peer dark:bg-brand-border peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-brand-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-brand-border peer-checked:bg-brand-purple"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Blocked Users */}
            <div className="border-t border-brand-border/30 pt-8">
              <h3 className="text-lg font-semibold text-brand-text mb-4 flex items-center">
                <UserCircleIcon className="w-5 h-5 mr-2 text-brand-purple" />
                Blocked Users
              </h3>
              <p className="text-brand-text-muted mb-4">
                Users you've blocked will not be able to message you or see your
                profile.
              </p>
              <div className="p-4 bg-brand-bg rounded-lg border border-brand-border/40 text-center">
                <p className="text-sm text-brand-text-muted">
                  No blocked users
                </p>
                <button className="mt-2 text-brand-cyan hover:underline text-sm">
                  Manage blocked users
                </button>
              </div>
            </div>
          </div>
        );
      case "integrations":
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-brand-text mb-4 flex items-center">
                <Link2Icon className="w-5 h-5 mr-2 text-brand-purple" />
                Connected Services
              </h3>
              <p className="text-brand-text-muted mb-6">
                Connect your GiiT account with external services to enhance your
                workflow.
              </p>

              <div className="space-y-4">
                {Object.entries({
                  google: {
                    name: "Google",
                    icon: "🔍",
                    desc: "Sync with Google Calendar and Drive",
                  },
                  github: {
                    name: "GitHub",
                    icon: "📂",
                    desc: "Import repositories and sync code changes",
                  },
                  slack: {
                    name: "Slack",
                    icon: "💬",
                    desc: "Receive GiiT notifications in Slack",
                  },
                  discord: {
                    name: "Discord",
                    icon: "🎮",
                    desc: "Share activities with your Discord server",
                  },
                }).map(([key, service]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 bg-brand-bg rounded-lg border border-brand-border/40"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{service.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-brand-text">
                          {service.name}
                        </p>
                        <p className="text-xs text-brand-text-muted">
                          {service.desc}
                        </p>
                        {connectedServices[
                          key as keyof typeof connectedServices
                        ] && (
                          <p className="text-xs text-green-400 mt-1">
                            ✓ Connected
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleServiceToggle(
                          key as keyof typeof connectedServices,
                        )
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        connectedServices[key as keyof typeof connectedServices]
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-brand-purple hover:bg-brand-purple/80 text-white"
                      }`}
                    >
                      {connectedServices[key as keyof typeof connectedServices]
                        ? "Disconnect"
                        : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* API Keys */}
            <div className="border-t border-brand-border/30 pt-8">
              <h3 className="text-lg font-semibold text-brand-text mb-4 flex items-center">
                <KeyIcon className="w-5 h-5 mr-2 text-brand-purple" />
                API Access
              </h3>
              <p className="text-brand-text-muted mb-4">
                Generate API keys to integrate GiiT with your custom
                applications.
              </p>

              <div className="space-y-4 max-w-md">
                <div className="p-4 bg-brand-bg rounded-lg border border-brand-border/40">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-brand-text">
                      Personal Access Token
                    </p>
                    <button className="text-brand-cyan hover:underline text-sm">
                      Generate
                    </button>
                  </div>
                  <p className="text-xs text-brand-text-muted">
                    Use this token to authenticate API requests
                  </p>
                </div>

                <div className="p-4 bg-brand-bg rounded-lg border border-brand-border/40">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-brand-text">
                      Webhook URL
                    </p>
                    <button className="text-brand-cyan hover:underline text-sm">
                      Configure
                    </button>
                  </div>
                  <p className="text-xs text-brand-text-muted">
                    Receive real-time notifications via webhooks
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button className="text-brand-cyan hover:underline text-sm flex items-center">
                  <GlobeIcon className="w-4 h-4 mr-1" />
                  View API Documentation
                </button>
              </div>
            </div>
          </div>
        );
      case "admin":
        return currentUser.role === "admin" ? (
          <div className="text-brand-text-muted">
            Admin-specific controls (audit logs, user reports) will be here.
            Mock UI for now.
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <SettingsIcon className="w-10 h-10 text-brand-purple" />
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-text">
            Settings
          </h1>
          <p className="text-brand-text-muted text-sm sm:text-base">
            Manage your GiiT FutureNet preferences and account details.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
        {/* Sidebar Navigation for Settings */}
        <aside className="md:w-1/4 lg:w-1/5 flex-shrink-0">
          <nav className="space-y-1.5 sticky top-20">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group
                  ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-md"
                      : "text-brand-text-muted hover:bg-brand-surface-alt hover:text-brand-text"
                  }`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <tab.icon
                  className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors duration-200 ${activeTab === tab.id ? "text-white" : "text-brand-text-darker group-hover:text-brand-cyan"}`}
                />
                {tab.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:w-3/4 lg:w-4/5">
          <div className="p-6 sm:p-8 bg-brand-surface rounded-xl shadow-xl border border-brand-border/30 min-h-[calc(100vh-15rem)]">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
