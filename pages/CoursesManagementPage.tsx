import React, { useState } from "react";
import { User, Course, LiveClass } from "../types";
import {
  GraduationCapIcon,
  VideoIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  DollarSignIcon,
  StarIcon,
  PlayIcon,
  PlusCircleIcon,
  EyeIcon,
  EditIcon,
  BarChart3Icon,
} from "../components/icons";
import ScheduleClassModal from "../components/ScheduleClassModal";

interface CoursesManagementPageProps {
  currentUser: User;
  courses: Course[];
  liveClasses: LiveClass[];
  onScheduleClass: (
    classData: Omit<
      LiveClass,
      "id" | "status" | "attendees" | "createdAt" | "updatedAt"
    >,
  ) => void;
  onUpdateCourse: (courseId: string, updates: Partial<Course>) => void;
}

const CoursesManagementPage: React.FC<CoursesManagementPageProps> = ({
  currentUser,
  courses,
  liveClasses,
  onScheduleClass,
  onUpdateCourse,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<
    "overview" | "courses" | "live-classes"
  >("overview");

  const instructorCourses = courses.filter(
    (course) =>
      course.instructorId === (currentUser.instructorId || currentUser.id),
  );

  const instructorLiveClasses = liveClasses.filter(
    (liveClass) =>
      liveClass.instructorId === (currentUser.instructorId || currentUser.id),
  );

  const upcomingClasses = instructorLiveClasses.filter(
    (cls) =>
      cls.status === "scheduled" && new Date(cls.scheduledAt) > new Date(),
  );

  const totalEnrollments = instructorCourses.reduce(
    (total, course) => total + (course.reviewsCount || 0),
    0,
  );

  const totalRevenue = instructorCourses.reduce(
    (total, course) => total + course.price * (course.reviewsCount || 0),
    0,
  );

  const handleScheduleClass = (courseId: string) => {
    const course = instructorCourses.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
      setIsScheduleModalOpen(true);
    }
  };

  const handleScheduleSubmit = (
    classData: Omit<
      LiveClass,
      "id" | "status" | "attendees" | "createdAt" | "updatedAt"
    >,
  ) => {
    onScheduleClass(classData);
    setIsScheduleModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <GraduationCapIcon className="w-10 h-10 text-brand-purple" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-text">
              Course Management
            </h1>
            <p className="text-brand-text-muted text-sm sm:text-base">
              Manage your courses, schedule live classes, and track performance
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-brand-border">
        <nav className="flex space-x-8">
          {[
            { id: "overview", name: "Overview", icon: BarChart3Icon },
            { id: "courses", name: "My Courses", icon: GraduationCapIcon },
            { id: "live-classes", name: "Live Classes", icon: VideoIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeView === tab.id
                  ? "border-brand-purple text-brand-purple"
                  : "border-transparent text-brand-text-muted hover:text-brand-text hover:border-brand-border"
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeView === "overview" && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-brand-surface p-6 rounded-xl border border-brand-border">
              <div className="flex items-center">
                <div className="p-2 bg-brand-purple/20 rounded-lg">
                  <GraduationCapIcon className="w-6 h-6 text-brand-purple" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-brand-text-muted">
                    Total Courses
                  </p>
                  <p className="text-2xl font-bold text-brand-text">
                    {instructorCourses.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-brand-surface p-6 rounded-xl border border-brand-border">
              <div className="flex items-center">
                <div className="p-2 bg-brand-cyan/20 rounded-lg">
                  <UsersIcon className="w-6 h-6 text-brand-cyan" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-brand-text-muted">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold text-brand-text">
                    {totalEnrollments}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-brand-surface p-6 rounded-xl border border-brand-border">
              <div className="flex items-center">
                <div className="p-2 bg-brand-pink/20 rounded-lg">
                  <VideoIcon className="w-6 h-6 text-brand-pink" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-brand-text-muted">
                    Live Classes
                  </p>
                  <p className="text-2xl font-bold text-brand-text">
                    {instructorLiveClasses.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-brand-surface p-6 rounded-xl border border-brand-border">
              <div className="flex items-center">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <DollarSignIcon className="w-6 h-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-brand-text-muted">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-brand-text">
                    ${totalRevenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="bg-brand-surface p-6 rounded-xl border border-brand-border">
            <h3 className="text-lg font-semibold text-brand-text mb-4">
              Upcoming Live Classes
            </h3>
            {upcomingClasses.length > 0 ? (
              <div className="space-y-3">
                {upcomingClasses.slice(0, 3).map((liveClass) => {
                  const course = instructorCourses.find(
                    (c) => c.id === liveClass.courseId,
                  );
                  return (
                    <div
                      key={liveClass.id}
                      className="flex items-center justify-between p-3 bg-brand-bg rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <VideoIcon className="w-5 h-5 text-brand-cyan" />
                        <div>
                          <p className="font-medium text-brand-text">
                            {liveClass.title}
                          </p>
                          <p className="text-sm text-brand-text-muted">
                            {course?.title} •{" "}
                            {new Date(
                              liveClass.scheduledAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-brand-text-muted">
                        {new Date(liveClass.scheduledAt).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-brand-text-muted">
                No upcoming classes scheduled
              </p>
            )}
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {activeView === "courses" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-brand-text">
              My Courses
            </h2>
            <button className="px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple/80 transition-colors">
              Create New Course
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructorCourses.map((course) => {
              const courseClasses = instructorLiveClasses.filter(
                (cls) => cls.courseId === course.id,
              );
              const nextClass = courseClasses
                .filter(
                  (cls) =>
                    cls.status === "scheduled" &&
                    new Date(cls.scheduledAt) > new Date(),
                )
                .sort(
                  (a, b) =>
                    new Date(a.scheduledAt).getTime() -
                    new Date(b.scheduledAt).getTime(),
                )[0];

              return (
                <div
                  key={course.id}
                  className="bg-brand-surface rounded-xl border border-brand-border overflow-hidden hover:border-brand-purple/50 transition-colors"
                >
                  <img
                    src={course.imageUrl || "https://picsum.photos/400/200"}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-brand-text line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center ml-2">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-brand-text-muted">
                          {course.rating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-brand-text-muted mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-brand-text-darker mb-4">
                      <span>${course.price}</span>
                      <span>{course.reviewsCount || 0} students</span>
                    </div>

                    {nextClass && (
                      <div className="bg-brand-bg p-3 rounded-lg mb-4">
                        <p className="text-xs font-medium text-brand-cyan mb-1">
                          Next Live Class
                        </p>
                        <p className="text-sm text-brand-text">
                          {nextClass.title}
                        </p>
                        <p className="text-xs text-brand-text-muted">
                          {new Date(nextClass.scheduledAt).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(nextClass.scheduledAt).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleScheduleClass(course.id)}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple/80 transition-colors text-sm"
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Schedule Class
                      </button>
                      <button className="p-2 text-brand-text-muted hover:text-brand-text border border-brand-border rounded-lg hover:bg-brand-bg transition-colors">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-brand-text-muted hover:text-brand-text border border-brand-border rounded-lg hover:bg-brand-bg transition-colors">
                        <EditIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Classes Tab */}
      {activeView === "live-classes" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-brand-text">
              Live Classes
            </h2>
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple/80 transition-colors flex items-center"
            >
              <PlusCircleIcon className="w-4 h-4 mr-2" />
              Schedule Class
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {instructorLiveClasses.map((liveClass) => {
              const course = instructorCourses.find(
                (c) => c.id === liveClass.courseId,
              );
              const scheduledDate = new Date(liveClass.scheduledAt);
              const isUpcoming = scheduledDate > new Date();

              return (
                <div
                  key={liveClass.id}
                  className="bg-brand-surface p-6 rounded-xl border border-brand-border"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-brand-text">
                          {liveClass.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            liveClass.status === "scheduled" && isUpcoming
                              ? "bg-blue-500/20 text-blue-400"
                              : liveClass.status === "live"
                                ? "bg-red-500/20 text-red-400"
                                : liveClass.status === "completed"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {liveClass.status.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-brand-text-muted mb-4">
                        {liveClass.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center text-brand-text-darker">
                          <GraduationCapIcon className="w-4 h-4 mr-2 text-brand-cyan" />
                          {course?.title || "Unknown Course"}
                        </div>
                        <div className="flex items-center text-brand-text-darker">
                          <CalendarIcon className="w-4 h-4 mr-2 text-brand-cyan" />
                          {scheduledDate.toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-brand-text-darker">
                          <ClockIcon className="w-4 h-4 mr-2 text-brand-cyan" />
                          {scheduledDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="flex items-center text-brand-text-darker">
                          <UsersIcon className="w-4 h-4 mr-2 text-brand-cyan" />
                          {liveClass.attendees.length}/{liveClass.maxAttendees}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {liveClass.status === "scheduled" && isUpcoming && (
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          Start Class
                        </button>
                      )}
                      {liveClass.status === "live" && (
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors animate-pulse">
                          Join Live
                        </button>
                      )}
                      <button className="p-2 text-brand-text-muted hover:text-brand-text border border-brand-border rounded-lg">
                        <EditIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {instructorLiveClasses.length === 0 && (
            <div className="text-center py-12">
              <VideoIcon className="w-16 h-16 text-brand-text-darker mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-brand-text mb-2">
                No Live Classes Yet
              </h3>
              <p className="text-brand-text-muted mb-6">
                Schedule your first live class to engage with your students in
                real-time
              </p>
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105"
              >
                Schedule Your First Class
              </button>
            </div>
          )}
        </div>
      )}

      {/* Schedule Class Modal */}
      <ScheduleClassModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedCourse(null);
        }}
        courseId={selectedCourse?.id || ""}
        onScheduleClass={handleScheduleSubmit}
      />
    </div>
  );
};

export default CoursesManagementPage;
