import React, { useState } from "react";
import { User, Course, LiveClass } from "../types";
import {
  GraduationCapIcon,
  VideoIcon,
  ClockIcon,
  PlayIcon,
  CheckCircleIcon,
  BarChart3Icon,
  CalendarIcon,
  TrendingUpIcon,
  BookOpenIcon,
  AwardIcon,
} from "./icons";

interface StudentDashboardProps {
  currentUser: User;
  enrolledCourses: Course[];
  upcomingClasses: LiveClass[];
  completedLessons: string[];
  onJoinClass: (classId: string) => void;
  onContinueCourse: (courseId: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  enrolledCourses,
  upcomingClasses,
  completedLessons,
  onJoinClass,
  onContinueCourse,
}) => {
  const [activeView, setActiveView] = useState<
    "overview" | "courses" | "live-classes" | "progress"
  >("overview");

  // Calculate progress statistics
  const totalLessons = enrolledCourses.reduce(
    (total, course) =>
      total +
      course.modules.reduce(
        (moduleTotal, module) => moduleTotal + module.lessons.length,
        0,
      ),
    0,
  );

  const completedLessonsCount = completedLessons.length;
  const progressPercentage =
    totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;

  const coursesInProgress = enrolledCourses.filter((course) => {
    const courseLessons = course.modules.flatMap((m) => m.lessons);
    const completedCourseLessons = courseLessons.filter((lesson) =>
      completedLessons.includes(lesson.id),
    );
    return (
      completedCourseLessons.length > 0 &&
      completedCourseLessons.length < courseLessons.length
    );
  });

  const completedCourses = enrolledCourses.filter((course) => {
    const courseLessons = course.modules.flatMap((m) => m.lessons);
    const completedCourseLessons = courseLessons.filter((lesson) =>
      completedLessons.includes(lesson.id),
    );
    return completedCourseLessons.length === courseLessons.length;
  });

  const getCourseProgress = (course: Course) => {
    const courseLessons = course.modules.flatMap((m) => m.lessons);
    const completedCourseLessons = courseLessons.filter((lesson) =>
      completedLessons.includes(lesson.id),
    );
    return courseLessons.length > 0
      ? (completedCourseLessons.length / courseLessons.length) * 100
      : 0;
  };

  const getNextLesson = (course: Course) => {
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (!completedLessons.includes(lesson.id)) {
          return { lesson, module };
        }
      }
    }
    return null;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-text">
            My Learning Dashboard
          </h1>
          <p className="text-brand-text-muted text-sm sm:text-base">
            Welcome back, {currentUser.displayName}! Continue your learning
            journey.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-brand-text-muted">Overall Progress</p>
          <p className="text-2xl font-bold text-brand-purple">
            {progressPercentage.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-brand-border">
        <nav className="flex space-x-8">
          {[
            { id: "overview", name: "Overview", icon: BarChart3Icon },
            { id: "courses", name: "My Courses", icon: GraduationCapIcon },
            { id: "live-classes", name: "Live Classes", icon: VideoIcon },
            { id: "progress", name: "Progress", icon: TrendingUpIcon },
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
                    Enrolled Courses
                  </p>
                  <p className="text-2xl font-bold text-brand-text">
                    {enrolledCourses.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-brand-surface p-6 rounded-xl border border-brand-border">
              <div className="flex items-center">
                <div className="p-2 bg-brand-cyan/20 rounded-lg">
                  <BookOpenIcon className="w-6 h-6 text-brand-cyan" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-brand-text-muted">
                    Lessons Completed
                  </p>
                  <p className="text-2xl font-bold text-brand-text">
                    {completedLessonsCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-brand-surface p-6 rounded-xl border border-brand-border">
              <div className="flex items-center">
                <div className="p-2 bg-brand-pink/20 rounded-lg">
                  <AwardIcon className="w-6 h-6 text-brand-pink" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-brand-text-muted">
                    Courses Completed
                  </p>
                  <p className="text-2xl font-bold text-brand-text">
                    {completedCourses.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-brand-surface p-6 rounded-xl border border-brand-border">
              <div className="flex items-center">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <VideoIcon className="w-6 h-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-brand-text-muted">
                    Upcoming Classes
                  </p>
                  <p className="text-2xl font-bold text-brand-text">
                    {upcomingClasses.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Learning Section */}
          <div className="bg-brand-surface p-6 rounded-xl border border-brand-border">
            <h3 className="text-lg font-semibold text-brand-text mb-4">
              Continue Learning
            </h3>
            {coursesInProgress.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coursesInProgress.slice(0, 2).map((course) => {
                  const nextLesson = getNextLesson(course);
                  const progress = getCourseProgress(course);

                  return (
                    <div
                      key={course.id}
                      className="bg-brand-bg p-4 rounded-lg border border-brand-border"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-brand-text mb-1">
                            {course.title}
                          </h4>
                          <p className="text-sm text-brand-text-muted">
                            {nextLesson
                              ? `Next: ${nextLesson.lesson.title}`
                              : "Course completed"}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-brand-purple">
                          {progress.toFixed(0)}%
                        </span>
                      </div>

                      <div className="w-full bg-brand-border rounded-full h-2 mb-3">
                        <div
                          className="bg-gradient-to-r from-brand-purple to-brand-pink h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>

                      <button
                        onClick={() => onContinueCourse(course.id)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple/80 transition-colors"
                      >
                        <PlayIcon className="w-4 h-4 mr-2" />
                        Continue Learning
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-brand-text-muted">
                No courses in progress. Enroll in a course to start learning!
              </p>
            )}
          </div>

          {/* Upcoming Live Classes */}
          <div className="bg-brand-surface p-6 rounded-xl border border-brand-border">
            <h3 className="text-lg font-semibold text-brand-text mb-4">
              Upcoming Live Classes
            </h3>
            {upcomingClasses.length > 0 ? (
              <div className="space-y-3">
                {upcomingClasses.slice(0, 3).map((liveClass) => (
                  <div
                    key={liveClass.id}
                    className="flex items-center justify-between p-3 bg-brand-bg rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <VideoIcon className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <p className="font-medium text-brand-text">
                          {liveClass.title}
                        </p>
                        <p className="text-sm text-brand-text-muted">
                          {new Date(liveClass.scheduledAt).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(liveClass.scheduledAt).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onJoinClass(liveClass.id)}
                      className="px-4 py-2 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan/80 transition-colors"
                    >
                      Join
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-brand-text-muted">No upcoming live classes</p>
            )}
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {activeView === "courses" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-brand-text">
            My Courses ({enrolledCourses.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => {
              const progress = getCourseProgress(course);
              const nextLesson = getNextLesson(course);
              const isCompleted = progress === 100;

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
                      {isCompleted && (
                        <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    <p className="text-sm text-brand-text-muted mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-brand-text-muted">
                          Progress
                        </span>
                        <span className="text-sm font-medium text-brand-purple">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-brand-border rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-brand-purple to-brand-pink h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {nextLesson && (
                      <div className="bg-brand-bg p-3 rounded-lg mb-4">
                        <p className="text-xs font-medium text-brand-cyan mb-1">
                          Next Lesson
                        </p>
                        <p className="text-sm text-brand-text">
                          {nextLesson.lesson.title}
                        </p>
                        <p className="text-xs text-brand-text-muted">
                          {nextLesson.module.title}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => onContinueCourse(course.id)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple/80 transition-colors"
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 mr-2" />
                          Review Course
                        </>
                      ) : (
                        <>
                          <PlayIcon className="w-4 h-4 mr-2" />
                          {progress === 0
                            ? "Start Course"
                            : "Continue Learning"}
                        </>
                      )}
                    </button>
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
          <h2 className="text-2xl font-semibold text-brand-text">
            Live Classes
          </h2>

          {upcomingClasses.length > 0 ? (
            <div className="space-y-4">
              {upcomingClasses.map((liveClass) => (
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
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                          SCHEDULED
                        </span>
                      </div>

                      <p className="text-brand-text-muted mb-4">
                        {liveClass.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center text-brand-text-darker">
                          <CalendarIcon className="w-4 h-4 mr-2 text-brand-cyan" />
                          {new Date(liveClass.scheduledAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-brand-text-darker">
                          <ClockIcon className="w-4 h-4 mr-2 text-brand-cyan" />
                          {new Date(liveClass.scheduledAt).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </div>
                        <div className="flex items-center text-brand-text-darker">
                          <ClockIcon className="w-4 h-4 mr-2 text-brand-cyan" />
                          {liveClass.durationMinutes} minutes
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onJoinClass(liveClass.id)}
                      className="px-6 py-2 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan/80 transition-colors ml-4"
                    >
                      Join Class
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <VideoIcon className="w-16 h-16 text-brand-text-darker mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-brand-text mb-2">
                No Upcoming Classes
              </h3>
              <p className="text-brand-text-muted">
                Your instructors haven't scheduled any live classes yet. Check
                back later!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Progress Tab */}
      {activeView === "progress" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-brand-text">
            Learning Progress
          </h2>

          <div className="bg-brand-surface p-6 rounded-xl border border-brand-border">
            <h3 className="text-lg font-semibold text-brand-text mb-4">
              Overall Progress
            </h3>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-brand-text-muted">Total Progress</span>
                <span className="text-lg font-semibold text-brand-purple">
                  {progressPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-brand-border rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-brand-purple to-brand-pink h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-brand-text-muted">
              You've completed {completedLessonsCount} out of {totalLessons}{" "}
              lessons across all your courses.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brand-text">
              Course Progress
            </h3>
            {enrolledCourses.map((course) => {
              const progress = getCourseProgress(course);
              const courseLessons = course.modules.flatMap((m) => m.lessons);
              const completedCourseLessons = courseLessons.filter((lesson) =>
                completedLessons.includes(lesson.id),
              );

              return (
                <div
                  key={course.id}
                  className="bg-brand-surface p-4 rounded-lg border border-brand-border"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-brand-text">
                      {course.title}
                    </h4>
                    <span className="text-sm font-medium text-brand-purple">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-brand-border rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-brand-purple to-brand-pink h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-brand-text-muted">
                    {completedCourseLessons.length} of {courseLessons.length}{" "}
                    lessons completed
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
