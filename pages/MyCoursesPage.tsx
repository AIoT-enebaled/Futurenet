import React from "react";
import { useNavigate } from "react-router-dom";
import { MyCoursesPageProps } from "../types";
import StudentDashboard from "../components/StudentDashboard";

const MyCoursesPage: React.FC<MyCoursesPageProps> = ({
  currentUser,
  courses,
  purchasedCourses,
}) => {
  const navigate = useNavigate();
  const enrolledCourses = courses.filter(
    (course) => purchasedCourses.includes(course.id) || course.price === 0,
  );

  // Mock data for demonstration
  const upcomingClasses = [
    {
      id: "class-1",
      courseId: enrolledCourses[0]?.id || "course-1",
      title: "React Hooks Deep Dive",
      description: "Live discussion and Q&A about React Hooks",
      instructorId: "instructor-1",
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      durationMinutes: 90,
      status: "scheduled" as const,
      maxAttendees: 50,
      attendees: [],
      isRecorded: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "class-2",
      courseId: enrolledCourses[1]?.id || "course-2",
      title: "JavaScript Fundamentals Live Session",
      description: "Interactive coding session covering JS basics",
      instructorId: "instructor-2",
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      durationMinutes: 60,
      status: "scheduled" as const,
      maxAttendees: 30,
      attendees: [],
      isRecorded: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Mock completed lessons for demonstration
  const completedLessons = [
    "lesson-1",
    "lesson-2",
    "lesson-3",
    "lesson-4",
    "lesson-5",
  ];

  const handleJoinClass = (classId: string) => {
    navigate(`/learning/live-class/${classId}`);
  };

  const handleContinueCourse = (courseId: string) => {
    navigate(`/learning/course/${courseId}`);
  };

  return (
    <StudentDashboard
      currentUser={currentUser}
      enrolledCourses={enrolledCourses}
      upcomingClasses={upcomingClasses}
      completedLessons={completedLessons}
      onJoinClass={handleJoinClass}
      onContinueCourse={handleContinueCourse}
    />
  );
};

export default MyCoursesPage;
