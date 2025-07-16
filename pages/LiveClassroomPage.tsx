import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LiveClassroomPageProps,
  LiveClass,
  ChatMessage,
  ClassMaterial,
  User,
} from "../types";
import {
  VideoIcon,
  MicIcon,
  MicOffIcon,
  PhoneOffIcon,
  MessageSquareIcon,
  UsersIcon,
  ScreenShareIcon,
  SettingsIcon,
  SendIcon,
  FileIcon,
  UploadCloudIcon,
  DownloadIcon,
  RecordIcon,
  ClockIcon,
  UserIcon,
} from "../components/icons";

interface LiveClassroomPageMockProps {
  currentUser: User;
  liveClasses: LiveClass[];
  onSendMessage: (
    classId: string,
    message: string,
    targetUserId?: string,
  ) => void;
  onUpdateClassStatus: (classId: string, status: LiveClass["status"]) => void;
  onUploadMaterial: (
    classId: string,
    material: Omit<ClassMaterial, "id" | "uploadedAt" | "uploadedBy">,
  ) => void;
}

const LiveClassroomPage: React.FC<LiveClassroomPageMockProps> = ({
  currentUser,
  liveClasses,
  onSendMessage,
  onUpdateClassStatus,
  onUploadMaterial,
}) => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();

  const [liveClass, setLiveClass] = useState<LiveClass | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(
    null,
  );

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const foundClass = liveClasses.find((c) => c.id === classId);
    setLiveClass(foundClass || null);
  }, [classId, liveClasses]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [liveClass?.chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !liveClass) return;

    onSendMessage(liveClass.id, chatMessage, selectedParticipant || undefined);
    setChatMessage("");
  };

  const handleEndClass = () => {
    if (!liveClass) return;
    if (confirm("Are you sure you want to end this class?")) {
      onUpdateClassStatus(liveClass.id, "completed");
      navigate("/learning/instructor-dashboard");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !liveClass) return;

    // Mock file upload
    const material: Omit<ClassMaterial, "id" | "uploadedAt" | "uploadedBy"> = {
      title: file.name,
      type: file.type.includes("image")
        ? "image"
        : file.type.includes("video")
          ? "video"
          : file.type.includes("pdf")
            ? "document"
            : "document",
      url: URL.createObjectURL(file),
    };

    onUploadMaterial(liveClass.id, material);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop recording
  };

  const isInstructor =
    currentUser.role === "instructor" ||
    liveClass?.instructorId === currentUser.id;

  if (!liveClass) {
    return (
      <div className="flex items-center justify-center h-screen bg-brand-surface">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-text mb-4">
            Class Not Found
          </h1>
          <button
            onClick={() => navigate("/learning")}
            className="px-6 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple/80"
          >
            Back to Learning Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-brand-surface flex flex-col">
      {/* Top Bar */}
      <div className="bg-brand-bg border-b border-brand-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-brand-text">
            {liveClass.title}
          </h1>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              liveClass.status === "live"
                ? "bg-red-500/20 text-red-400"
                : liveClass.status === "scheduled"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-gray-500/20 text-gray-400"
            }`}
          >
            {liveClass.status === "live" && "🔴 LIVE"}
            {liveClass.status === "scheduled" && "⏰ Scheduled"}
            {liveClass.status === "completed" && "✅ Completed"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-brand-text-muted flex items-center">
            <UsersIcon className="w-4 h-4 mr-1" />
            {
              liveClass.attendees.filter((a) => a.status === "joined").length
            }{" "}
            participants
          </span>
          {isInstructor && (
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-lg transition-colors ${
                isRecording
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : "bg-brand-surface-alt text-brand-text-muted hover:bg-brand-border"
              }`}
              title={isRecording ? "Stop Recording" : "Start Recording"}
            >
              <RecordIcon className="w-5 h-5" />
            </button>
          )}
          {isInstructor && (
            <button
              onClick={handleEndClass}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              End Class
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col bg-black relative">
          {/* Mock Video Feed */}
          <div className="flex-1 flex items-center justify-center relative">
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <VideoIcon className="w-24 h-24 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-semibold mb-2">
                  Live Class in Progress
                </p>
                <p className="text-gray-300">
                  Mock video feed - Real implementation would show actual video
                </p>
              </div>
            </div>

            {/* Screen sharing indicator */}
            {isScreenSharing && (
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">
                📺 Screen Sharing
              </div>
            )}

            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-lg text-sm flex items-center">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                Recording
              </div>
            )}
          </div>

          {/* Video Controls */}
          <div className="bg-gray-900 p-4 flex items-center justify-center space-x-4">
            <button
              onClick={() => setIsAudioOn(!isAudioOn)}
              className={`p-3 rounded-full transition-colors ${
                isAudioOn
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
              title={isAudioOn ? "Mute" : "Unmute"}
            >
              {isAudioOn ? (
                <MicIcon className="w-5 h-5" />
              ) : (
                <MicOffIcon className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-full transition-colors ${
                isVideoOn
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
              title={isVideoOn ? "Turn off camera" : "Turn on camera"}
            >
              <VideoIcon className="w-5 h-5" />
            </button>

            {isInstructor && (
              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 rounded-full transition-colors ${
                  isScreenSharing
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
                title="Share screen"
              >
                <ScreenShareIcon className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => setShowChat(!showChat)}
              className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              title="Toggle chat"
            >
              <MessageSquareIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              title="Show participants"
            >
              <UsersIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowMaterials(!showMaterials)}
              className="p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              title="Class materials"
            >
              <FileIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        {(showChat || showParticipants || showMaterials) && (
          <div className="w-80 bg-brand-bg border-l border-brand-border flex flex-col">
            {/* Sidebar Tabs */}
            <div className="border-b border-brand-border flex">
              <button
                onClick={() => {
                  setShowChat(true);
                  setShowParticipants(false);
                  setShowMaterials(false);
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium border-r border-brand-border ${
                  showChat
                    ? "bg-brand-surface text-brand-text"
                    : "text-brand-text-muted hover:bg-brand-surface-alt"
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => {
                  setShowChat(false);
                  setShowParticipants(true);
                  setShowMaterials(false);
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium border-r border-brand-border ${
                  showParticipants
                    ? "bg-brand-surface text-brand-text"
                    : "text-brand-text-muted hover:bg-brand-surface-alt"
                }`}
              >
                People
              </button>
              <button
                onClick={() => {
                  setShowChat(false);
                  setShowParticipants(false);
                  setShowMaterials(true);
                }}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  showMaterials
                    ? "bg-brand-surface text-brand-text"
                    : "text-brand-text-muted hover:bg-brand-surface-alt"
                }`}
              >
                Materials
              </button>
            </div>

            {/* Chat Panel */}
            {showChat && (
              <div className="flex-1 flex flex-col">
                <div
                  className="flex-1 overflow-y-auto p-4 space-y-3"
                  ref={chatContainerRef}
                >
                  {liveClass.chatMessages?.map((message) => (
                    <div key={message.id} className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-brand-cyan">
                          {message.userName}
                        </span>
                        <span className="text-xs text-brand-text-muted">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-brand-text bg-brand-surface p-2 rounded">
                        {message.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-brand-border p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 bg-brand-surface border border-brand-border rounded-lg text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple/80"
                    >
                      <SendIcon className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Participants Panel */}
            {showParticipants && (
              <div className="flex-1 overflow-y-auto p-4">
                <h3 className="text-sm font-semibold text-brand-text mb-3">
                  Participants (
                  {
                    liveClass.attendees.filter((a) => a.status === "joined")
                      .length
                  }
                  )
                </h3>
                <div className="space-y-2">
                  {liveClass.attendees
                    .filter((attendee) => attendee.status === "joined")
                    .map((attendee) => (
                      <div
                        key={attendee.userId}
                        className="flex items-center justify-between p-2 bg-brand-surface rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <UserIcon className="w-5 h-5 text-brand-text-muted" />
                          <span className="text-sm text-brand-text">
                            User {attendee.userId.slice(-4)}
                          </span>
                          {attendee.role === "instructor" && (
                            <span className="text-xs bg-brand-purple text-white px-2 py-0.5 rounded">
                              Instructor
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-brand-text-muted">
                            Online
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Materials Panel */}
            {showMaterials && (
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-brand-border">
                  {isInstructor && (
                    <div className="space-y-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple/80 text-sm"
                      >
                        <UploadCloudIcon className="w-4 h-4 mr-2" />
                        Upload Material
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.mov"
                      />
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <h3 className="text-sm font-semibold text-brand-text mb-3">
                    Class Materials
                  </h3>
                  <div className="space-y-2">
                    {liveClass.materials?.map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between p-2 bg-brand-surface rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <FileIcon className="w-4 h-4 text-brand-text-muted" />
                          <span className="text-sm text-brand-text">
                            {material.title}
                          </span>
                        </div>
                        <button
                          onClick={() => window.open(material.url, "_blank")}
                          className="p-1 text-brand-cyan hover:text-brand-pink"
                          title="Download"
                        >
                          <DownloadIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {(!liveClass.materials ||
                      liveClass.materials.length === 0) && (
                      <p className="text-sm text-brand-text-muted">
                        No materials uploaded yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveClassroomPage;
