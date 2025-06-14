import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CourseService, Course } from '../services/firebase';
import { Link } from 'react-router-dom';

const MyCoursesPage: React.FC = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!authLoading && currentUser) {
        setCoursesLoading(true);
        setError(null);
        try {
          const courseService = new CourseService();
          const userCourses = await courseService.getUserCourses(currentUser.uid);
          setCourses(userCourses);
        } catch (err: any) {
          console.error('Failed to fetch user courses:', err);
          setError('Failed to load your courses. Please try again.');
        } finally {
          setCoursesLoading(false);
      }
    } else if (!authLoading && currentUser) {
      setCourses([]);
      setCoursesLoading(false);
    }
  };

    fetchCourses();
  }, [currentUser, authLoading]);

  if (authLoading || coursesLoading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <h2>My Courses</h2>
      {courses.length === 0 ? (
        <p>You are not currently enrolled in any courses.</p>
      ) : (
        <ul>
          {courses.map(course => (
            <li key={course.id}>
              <Link to={`/courses/${course.id}`}>{course.title} by {course.instructorName}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
