import React, { useState } from "react";
import { ScheduleClassModalProps, LiveClass } from "../types";
import { ClockIcon, VideoIcon, UsersIcon, CalendarIcon } from "./icons";
import Modal from "./Modal";

const ScheduleClassModal: React.FC<ScheduleClassModalProps> = ({
  isOpen,
  onClose,
  courseId,
  onScheduleClass,
}) => {
  const [classData, setClassData] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    durationMinutes: 60,
    maxAttendees: 50,
    isRecorded: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classData.title || !classData.scheduledAt) {
      alert("Please fill in all required fields");
      return;
    }

    const newClass: Omit<
      LiveClass,
      "id" | "status" | "attendees" | "createdAt" | "updatedAt"
    > = {
      courseId,
      title: classData.title,
      description: classData.description,
      instructorId: "current-instructor", // This would be passed from props in real implementation
      scheduledAt: classData.scheduledAt,
      durationMinutes: classData.durationMinutes,
      maxAttendees: classData.maxAttendees,
      isRecorded: classData.isRecorded,
      attendees: [],
      recordings: [],
      materials: [],
      chatMessages: [],
    };

    onScheduleClass(newClass);

    // Reset form
    setClassData({
      title: "",
      description: "",
      scheduledAt: "",
      durationMinutes: 60,
      maxAttendees: 50,
      isRecorded: true,
    });

    onClose();
  };

  const handleInputChange = (
    field: keyof typeof classData,
    value: string | number | boolean,
  ) => {
    setClassData((prev) => ({ ...prev, [field]: value }));
  };

  // Generate time options for scheduling
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const today = new Date().toISOString().split("T")[0];
  const commonInputStyles =
    "w-full px-3 py-2 bg-brand-bg border border-brand-border rounded-lg text-brand-text placeholder-brand-text-muted focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Live Class"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Class Title */}
        <div>
          <label
            htmlFor="classTitle"
            className="block text-sm font-medium text-brand-text mb-2"
          >
            Class Title *
          </label>
          <input
            type="text"
            id="classTitle"
            value={classData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="e.g., Introduction to React Hooks"
            className={commonInputStyles}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="classDescription"
            className="block text-sm font-medium text-brand-text mb-2"
          >
            Description
          </label>
          <textarea
            id="classDescription"
            value={classData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="What will be covered in this live class?"
            rows={3}
            className={commonInputStyles}
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="classDate"
              className="block text-sm font-medium text-brand-text mb-2"
            >
              <CalendarIcon className="w-4 h-4 inline mr-1" />
              Date *
            </label>
            <input
              type="date"
              id="classDate"
              value={classData.scheduledAt.split("T")[0] || ""}
              onChange={(e) => {
                const time = classData.scheduledAt.split("T")[1] || "10:00";
                handleInputChange("scheduledAt", `${e.target.value}T${time}`);
              }}
              min={today}
              className={commonInputStyles}
              required
            />
          </div>

          <div>
            <label
              htmlFor="classTime"
              className="block text-sm font-medium text-brand-text mb-2"
            >
              <ClockIcon className="w-4 h-4 inline mr-1" />
              Time *
            </label>
            <input
              type="time"
              id="classTime"
              value={classData.scheduledAt.split("T")[1] || ""}
              onChange={(e) => {
                const date = classData.scheduledAt.split("T")[0] || today;
                handleInputChange("scheduledAt", `${date}T${e.target.value}`);
              }}
              className={commonInputStyles}
              required
            />
          </div>
        </div>

        {/* Duration and Max Attendees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-brand-text mb-2"
            >
              <ClockIcon className="w-4 h-4 inline mr-1" />
              Duration (minutes)
            </label>
            <select
              id="duration"
              value={classData.durationMinutes}
              onChange={(e) =>
                handleInputChange("durationMinutes", parseInt(e.target.value))
              }
              className={commonInputStyles}
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
              <option value={180}>3 hours</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="maxAttendees"
              className="block text-sm font-medium text-brand-text mb-2"
            >
              <UsersIcon className="w-4 h-4 inline mr-1" />
              Max Attendees
            </label>
            <input
              type="number"
              id="maxAttendees"
              value={classData.maxAttendees}
              onChange={(e) =>
                handleInputChange("maxAttendees", parseInt(e.target.value) || 0)
              }
              min="1"
              max="1000"
              className={commonInputStyles}
            />
          </div>
        </div>

        {/* Recording Option */}
        <div className="flex items-center space-x-3 p-4 bg-brand-bg rounded-lg border border-brand-border">
          <input
            type="checkbox"
            id="recordClass"
            checked={classData.isRecorded}
            onChange={(e) => handleInputChange("isRecorded", e.target.checked)}
            className="h-4 w-4 text-brand-purple bg-brand-bg border-brand-border rounded focus:ring-brand-purple focus:ring-offset-brand-bg"
          />
          <label
            htmlFor="recordClass"
            className="flex items-center text-sm text-brand-text cursor-pointer"
          >
            <VideoIcon className="w-4 h-4 mr-2 text-brand-cyan" />
            Record this class for later viewing
          </label>
        </div>

        {/* Class Features Preview */}
        <div className="bg-brand-surface p-4 rounded-lg border border-brand-border">
          <h4 className="text-sm font-semibold text-brand-text mb-2">
            Live Class Features
          </h4>
          <ul className="text-xs text-brand-text-muted space-y-1">
            <li>• HD video and audio conferencing</li>
            <li>• Screen sharing and presentation tools</li>
            <li>• Real-time chat and Q&A</li>
            <li>• File sharing and class materials</li>
            <li>• Automatic attendance tracking</li>
            {classData.isRecorded && (
              <li>• Class recording for enrolled students</li>
            )}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-brand-text-muted bg-brand-surface-alt hover:bg-opacity-80 rounded-lg border border-brand-border hover:border-brand-purple/50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105"
          >
            Schedule Class
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ScheduleClassModal;
