
import React from 'react';
import { Link } from 'react-router-dom';
import { Course, User } from '../types';
import { COURSE_INSTRUCTORS_DATA, COURSE_CATEGORIES_DATA } from '../constants';
import { GraduationCapIcon, PlayCircleIcon, StarIcon, DollarSignIcon, BarChart3Icon, CheckCircleIcon } from './icons';

interface CourseCardProps {
  course: Course;
  currentUser: User | null;
  isEnrolled: boolean;
  onEnrollClick: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, currentUser, isEnrolled, onEnrollClick }) => {
  const instructor = COURSE_INSTRUCTORS_DATA.find(ins => ins.id === course.instructorId);
  const primaryCategory = COURSE_CATEGORIES_DATA.find(cat => cat.id === course.categoryIds[0]);

  return (
    <div className="bg-brand-surface rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-glow-cyan transform hover:-translate-y-1.5 border border-brand-border/30 hover:border-brand-cyan/40 flex flex-col h-full">
      <Link to={`/learning/courses/${course.id}`} className="block group">
        <div className="relative">
            <img 
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
                src={course.imageUrl || 'https://picsum.photos/seed/courseplaceholder/400/225'} 
                alt={course.title} 
            />
            {course.isProCourse && (
                 <span className="absolute top-2 right-2 bg-yellow-400 text-brand-bg text-xs font-bold px-2 py-0.5 rounded-full shadow-md flex items-center">
                    <StarIcon className="w-3 h-3 mr-1"/> PRO
                </span>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <PlayCircleIcon className="w-12 h-12 text-white/80" />
            </div>
        </div>
      </Link>
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {primaryCategory && (
            <div className="flex items-center mb-1.5">
                {primaryCategory.icon && <primaryCategory.icon className="w-3.5 h-3.5 mr-1.5 text-brand-cyan flex-shrink-0" />}
                <span className="text-xs font-semibold text-brand-cyan uppercase tracking-wider">{primaryCategory.name}</span>
            </div>
        )}
        <Link to={`/learning/courses/${course.id}`} className="block group mb-1.5">
          <h3 className="text-md sm:text-lg font-semibold text-brand-text group-hover:text-brand-purple transition-colors line-clamp-2" title={course.title}>{course.title}</h3>
        </Link>
        {instructor && <p className="text-xs text-brand-text-muted mb-2">By {instructor.name}</p>}
        
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-text-muted mb-3">
            <span className="flex items-center" title="Difficulty"><BarChart3Icon className="w-3.5 h-3.5 mr-1 text-brand-text-darker"/> {course.difficulty}</span>
            <span className="flex items-center" title="Duration"><GraduationCapIcon className="w-3.5 h-3.5 mr-1 text-brand-text-darker"/> {course.durationHours} hrs</span>
            {course.rating && <span className="flex items-center" title="Rating"><StarIcon className="w-3.5 h-3.5 mr-1 text-yellow-400 fill-current"/> {course.rating.toFixed(1)}</span>}
        </div>

        <div className="mt-auto pt-3 border-t border-brand-border/20">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold text-brand-purple">
              {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
            </p>
            {isEnrolled || course.price === 0 ? (
                 <Link 
                    to={`/learning/courses/${course.id}`}
                    className="px-3 py-1.5 text-xs bg-green-600/80 text-white font-semibold rounded-md hover:bg-green-500 transition-colors flex items-center shadow-sm"
                    title="Go to Course"
                >
                    <CheckCircleIcon className="w-3.5 h-3.5 mr-1"/> Enrolled
                </Link>
            ) : (
                 <button 
                    onClick={() => onEnrollClick(course)}
                    disabled={!currentUser && course.price > 0 && !course.isProCourse} // Disable if not logged in & paid course & not pro
                    title={!currentUser && course.price > 0 && !course.isProCourse ? "Log in to enroll" : "Enroll Now"}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors shadow-sm
                        ${!currentUser && course.price > 0 && !course.isProCourse 
                            ? 'bg-brand-border text-brand-text-darker cursor-not-allowed' 
                            : 'bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:shadow-glow-pink transform hover:scale-105'
                        }`}
                >
                    Enroll Now
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
