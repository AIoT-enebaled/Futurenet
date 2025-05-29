
import React from 'react';
import { Link } from 'react-router-dom';
import { MyCoursesPageProps, Course } from '../types';
import CourseCard from '../components/CourseCard'; 
import { BookOpenCheckIcon, GraduationCapIcon } from '../components/icons';

const MyCoursesPage: React.FC<MyCoursesPageProps> = ({ currentUser, courses, purchasedCourses }) => {
  const enrolledCourses = courses.filter(course => purchasedCourses.includes(course.id) || course.price === 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <BookOpenCheckIcon className="w-10 h-10 text-brand-purple" />
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-text">My Learning Journey</h1>
          <p className="text-brand-text-muted text-sm sm:text-base">Continue learning and track your progress with enrolled courses.</p>
        </div>
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {enrolledCourses.map((course: Course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              currentUser={currentUser}
              isEnrolled={true} // All courses here are considered enrolled
              onEnrollClick={() => { /* Already enrolled, maybe link to course page or resume */ }} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-brand-surface rounded-xl shadow-xl border border-brand-border/30">
          <GraduationCapIcon className="w-20 h-20 text-brand-text-darker mx-auto mb-6" />
          <p className="text-xl font-semibold text-brand-text-muted">You haven't enrolled in any courses yet.</p>
          <p className="text-sm text-brand-text-darker mt-2 mb-6">Explore our catalog and start your learning adventure!</p>
          <Link
            to="/learning"
            className="px-6 py-2.5 bg-gradient-purple-pink text-white font-semibold rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105"
          >
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;
