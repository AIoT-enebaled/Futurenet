

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Course, User, CoursePageProps, CourseLesson, CourseModule, CourseReview } from '../types';
import { COURSE_INSTRUCTORS_DATA, COURSE_CATEGORIES_DATA, GUEST_AVATAR_URL } from '../constants';
import VideoPlayerMock from '../components/VideoPlayerMock';
import LoadingSpinner from '../components/LoadingSpinner';
import GoProModal from '../components/GoProModal';
// FIX: Added ChevronDownIcon to imports
import { ChevronLeftIcon, GraduationCapIcon, PlayCircleIcon, DollarSignIcon, BarChart3Icon, ListTreeIcon, StarIcon, MessageCircleIcon, CheckCircleIcon, LockIcon, SendIcon, UserCircleIcon as AvatarPlaceholder, ChevronDownIcon } from '../components/icons';

const CoursePage: React.FC<CoursePageProps> = ({ currentUser, courses, purchasedCourses, onPurchaseCourse, onSubscribePro, onUpdateCourse }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [isGoProModalOpen, setIsGoProModalOpen] = useState(false);
  const [playingLesson, setPlayingLesson] = useState<CourseLesson | null>(null);

  const [userRating, setUserRating] = useState<number>(0);
  const [userReviewText, setUserReviewText] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);


  useEffect(() => {
    const foundCourse = courses.find(c => c.id === courseId);
    setCourse(foundCourse || null);
    if (foundCourse?.modules?.[0]) {
        setExpandedModules(new Set([foundCourse.modules[0].id]));
    }
  }, [courseId, courses]);

  const instructor = course ? COURSE_INSTRUCTORS_DATA.find(ins => ins.id === course.instructorId) : null;
  const categories = course ? COURSE_CATEGORIES_DATA.filter(cat => course.categoryIds.includes(cat.id)) : [];
  const isEnrolled = course ? purchasedCourses.includes(course.id) || (course.price === 0) : false; // Free courses are considered enrolled

  const handleEnrollClick = () => {
    if (!course) return;
    if (course.isProCourse && !currentUser?.is_pro_user && course.price > 0) {
      setIsGoProModalOpen(true);
    } else {
      onPurchaseCourse(course.id, course.isProCourse);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const canAccessLesson = (lesson: CourseLesson): boolean => {
    if (!course) return false;
    return lesson.isFreePreview || isEnrolled || (course.isProCourse && !!currentUser?.is_pro_user);
  };

  const handlePlayLesson = (lesson: CourseLesson) => {
    if (canAccessLesson(lesson)) {
      setPlayingLesson(lesson);
    } else if (course?.isProCourse && !currentUser?.is_pro_user) {
      setIsGoProModalOpen(true);
    } else if (!isEnrolled) {
      alert("Please enroll in the course to view this lesson.");
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !course || userRating === 0 || !userReviewText.trim()) {
        alert("Please provide a rating and a comment.");
        return;
    }
    setIsSubmittingReview(true);
    
    const newReview: CourseReview = {
        id: `review-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.displayName,
        userAvatar: currentUser.avatarUrl,
        rating: userRating,
        comment: userReviewText.trim(),
        createdAt: new Date().toISOString(),
    };

    const updatedReviews = [...(course.reviews || []), newReview];
    const totalRatingSum = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
    const newAverageRating = parseFloat((totalRatingSum / updatedReviews.length).toFixed(1));

    onUpdateCourse(course.id, {
        reviews: updatedReviews,
        rating: newAverageRating,
        reviewsCount: updatedReviews.length,
    });
    
    // Optimistically update local state
    setCourse(prev => prev ? {...prev, reviews: updatedReviews, rating: newAverageRating, reviewsCount: updatedReviews.length} : null);

    setUserRating(0);
    setUserReviewText('');
    setIsSubmittingReview(false);
    alert("Review submitted successfully!");
  };

  const commonInputStyles = "block w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple sm:text-sm text-brand-text placeholder-brand-text-muted transition-colors";
  const primaryButtonStyles = "px-6 py-2.5 bg-gradient-purple-pink text-white font-semibold rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface disabled:opacity-60 disabled:cursor-not-allowed";


  if (course === undefined) {
    return <div className="flex justify-center items-center h-[calc(100vh-8rem)]"><LoadingSpinner message="Loading course details..." /></div>;
  }
  if (!course) {
    return (
      <div className="text-center p-8 bg-brand-surface rounded-lg shadow-xl h-[calc(100vh-8rem)] flex flex-col justify-center items-center border border-brand-border/30">
        <GraduationCapIcon className="w-16 h-16 text-brand-text-darker mb-4" />
        <h1 className="text-2xl font-bold text-brand-text mb-3">Course Not Found</h1>
        <p className="text-brand-text-muted mb-6">The course you are looking for does not exist or may have been removed.</p>
        <Link to="/learning" className="inline-flex items-center px-6 py-2.5 bg-gradient-purple-pink text-white font-semibold rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105">
          <ChevronLeftIcon className="w-5 h-5 mr-1.5" /> Back to Learning Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Back Button */}
      <div className="px-4 pt-4 sm:px-0">
        <button onClick={() => navigate('/learning')} className="inline-flex items-center text-sm text-brand-cyan hover:text-brand-pink hover:underline transition-colors font-medium">
          <ChevronLeftIcon className="w-5 h-5 mr-1" /> Back to Learning Hub
        </button>
      </div>

      {/* Header Section */}
      <header className="bg-brand-surface p-6 sm:p-8 rounded-xl shadow-2xl border border-brand-border/30">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <img 
              src={course.imageUrl || 'https://picsum.photos/seed/courseplaceholder/400/225'} 
              alt={course.title} 
              className="w-full h-auto object-cover rounded-lg shadow-lg border border-brand-border/20"
            />
            {course.previewVideoUrl && !playingLesson && (
                <button 
                    onClick={() => setPlayingLesson({ id: 'preview', title: 'Course Preview', durationMinutes: 0, videoUrl: course.previewVideoUrl, isFreePreview: true })}
                    className="mt-4 w-full flex items-center justify-center px-4 py-2.5 bg-brand-cyan/20 text-brand-cyan hover:bg-brand-cyan/30 rounded-md font-semibold transition-colors"
                >
                    <PlayCircleIcon className="w-5 h-5 mr-2"/> Watch Preview
                </button>
            )}
          </div>
          <div className="md:w-2/3 flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-text mb-2 leading-tight">{course.title}</h1>
            {course.subtitle && <p className="text-lg text-brand-text-muted mb-3">{course.subtitle}</p>}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-brand-text-muted mb-4">
              {/* FIX: Changed UserCircleIcon to AvatarPlaceholder */}
              {instructor && <span className="flex items-center"><AvatarPlaceholder className="w-4 h-4 mr-1.5 text-brand-cyan"/> By {instructor.name}</span>}
              <span className="flex items-center"><ListTreeIcon className="w-4 h-4 mr-1.5 text-brand-cyan"/> {course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)} Lessons</span>
              <span className="flex items-center"><BarChart3Icon className="w-4 h-4 mr-1.5 text-brand-cyan"/> {course.difficulty}</span>
              {course.rating && course.reviewsCount ? (
                <span className="flex items-center">
                  <StarIcon className="w-4 h-4 mr-1 text-yellow-400 fill-current" /> 
                  {course.rating.toFixed(1)} ({course.reviewsCount} reviews)
                </span>
              ) :  <span className="flex items-center"><StarIcon className="w-4 h-4 mr-1 text-brand-text-darker"/> No reviews yet</span> }
            </div>
            <p className="text-brand-text-muted text-sm mb-5 flex-grow line-clamp-3">{course.description}</p>
            
            <div className="mt-auto flex flex-col sm:flex-row sm:items-center gap-3">
              {isEnrolled || course.price === 0 ? (
                <button className={`${primaryButtonStyles} bg-green-600 hover:bg-green-500 hover:shadow-[0_0_25px_0px_rgba(16,185,129,0.5)] flex items-center justify-center focus:ring-green-500`}>
                  <CheckCircleIcon className="w-5 h-5 mr-2"/> You're Enrolled!
                </button>
              ) : (
                <button onClick={handleEnrollClick} className={primaryButtonStyles}>
                  <DollarSignIcon className="w-5 h-5 mr-2" />
                  {course.price === 0 ? 'Enroll for Free' : `Buy for $${course.price.toFixed(2)}`}
                  {/* FIX: Wrapped StarIcon in a span with title to fix SVG prop error */}
                  {course.isProCourse && <span title="Pro Course"><StarIcon className="w-3 h-3 ml-1.5 text-yellow-300"/></span>}
                </button>
              )}
              {course.isProCourse && !currentUser?.is_pro_user && (
                  <button onClick={() => setIsGoProModalOpen(true)} className="px-4 py-2 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors">
                      <StarIcon className="w-4 h-4 mr-1.5"/> Access with Pro
                  </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Video Player Area */}
      {playingLesson && (
        <section className="p-4 sm:p-0">
            <div className="bg-brand-surface rounded-xl shadow-xl border border-brand-border/30 overflow-hidden">
                <div className="p-4 border-b border-brand-border/40">
                    <h3 className="text-lg font-semibold text-brand-text">{playingLesson.title}</h3>
                </div>
                <VideoPlayerMock videoUrl={playingLesson.videoUrl} title={playingLesson.title} />
            </div>
        </section>
      )}

      {/* Tabs */}
      <div className="px-4 sm:px-0">
        <div className="border-b border-brand-border/30 mb-6">
          <nav className="-mb-px flex space-x-4 sm:space-x-6" aria-label="Tabs">
            {['overview', 'curriculum', 'reviews'].map((tabName) => (
              <button
                key={tabName}
                onClick={() => setActiveTab(tabName as 'overview' | 'curriculum' | 'reviews')}
                className={`px-1 pb-3 text-sm sm:text-md font-medium transition-colors
                  ${activeTab === tabName 
                    ? 'border-b-2 border-brand-purple text-brand-purple' 
                    : 'border-transparent text-brand-text-muted hover:text-brand-text hover:border-brand-text-muted'}`}
                aria-current={activeTab === tabName ? 'page' : undefined}
              >
                {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 sm:px-0">
        {activeTab === 'overview' && (
          <div className="bg-brand-surface p-6 sm:p-8 rounded-xl shadow-xl border border-brand-border/30 prose prose-base md:prose-lg dark:prose-invert max-w-none prose-headings:text-brand-text prose-a:text-brand-cyan hover:prose-a:text-brand-pink prose-strong:text-brand-text prose-ul:list-disc prose-ul:marker:text-brand-purple prose-li:my-1.5 prose-p:text-brand-text-muted">
            <h3 className="text-xl font-semibold text-brand-text mb-3">Course Description</h3>
            <p>{course.description}</p>
            {/* Add more sections like "What you'll learn", "Requirements" if data exists */}
            {instructor && (<>
                <h3 className="text-xl font-semibold text-brand-text mt-6 mb-3">About the Instructor</h3>
                <div className="flex items-start gap-4 not-prose">
                    <img src={instructor.avatarUrl || GUEST_AVATAR_URL} alt={instructor.name} className="w-16 h-16 rounded-full object-cover border-2 border-brand-border/40"/>
                    <div>
                        <h4 className="font-semibold text-brand-text">{instructor.name}</h4>
                        <p className="text-sm text-brand-text-muted">{instructor.bio}</p>
                    </div>
                </div>
            </>)}
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="bg-brand-surface p-6 sm:p-8 rounded-xl shadow-xl border border-brand-border/30 space-y-4">
            {course.modules.map((module, moduleIndex) => (
              <div key={module.id} className="border-b border-brand-border/30 pb-3 last:border-b-0 last:pb-0">
                <button 
                  onClick={() => toggleModule(module.id)} 
                  className="w-full flex justify-between items-center py-2 text-left group"
                  aria-expanded={expandedModules.has(module.id)}
                >
                  <h4 className="text-lg font-semibold text-brand-text group-hover:text-brand-cyan transition-colors">
                    Module {moduleIndex + 1}: {module.title}
                  </h4>
                  {/* FIX: ChevronDownIcon was not found, ensured it's imported and used */}
                  <ChevronDownIcon className={`w-5 h-5 text-brand-text-muted transform transition-transform ${expandedModules.has(module.id) ? 'rotate-180' : ''}`} />
                </button>
                {expandedModules.has(module.id) && (
                  <ul className="mt-2 space-y-1.5 pl-4">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li key={lesson.id} className="flex justify-between items-center p-2.5 rounded-md hover:bg-brand-bg transition-colors group">
                        <div className="flex items-center">
                          {canAccessLesson(lesson) ? 
                            <PlayCircleIcon className="w-5 h-5 mr-2.5 text-brand-cyan group-hover:text-brand-pink flex-shrink-0" /> :
                            <LockIcon className="w-5 h-5 mr-2.5 text-brand-text-darker group-hover:text-yellow-400 flex-shrink-0" />
                          }
                          <span className="text-sm text-brand-text-muted group-hover:text-brand-text transition-colors">
                            {lessonIndex + 1}. {lesson.title}
                          </span>
                          {lesson.isFreePreview && !isEnrolled && <span className="ml-2 text-xs text-green-400 bg-green-500/20 px-1.5 py-0.5 rounded-full">Preview</span>}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-brand-text-darker">{lesson.durationMinutes} min</span>
                          <button onClick={() => handlePlayLesson(lesson)} className={`text-xs font-medium py-1 px-2.5 rounded-md transition-colors
                            ${canAccessLesson(lesson) ? 'bg-brand-purple/80 text-white hover:bg-brand-purple' : 'bg-brand-border text-brand-text-muted cursor-not-allowed hover:bg-brand-border/70'}`}
                            disabled={!canAccessLesson(lesson) && !lesson.isFreePreview && (isEnrolled ? false : true)} // disable if not free & not enrolled, unless it's pro & user is pro
                          >
                            {canAccessLesson(lesson) ? 'Play' : 'Unlock'}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-brand-surface p-6 sm:p-8 rounded-xl shadow-xl border border-brand-border/30">
            <h3 className="text-xl font-semibold text-brand-text mb-5">Student Reviews</h3>
            {currentUser && (isEnrolled || course.price === 0) && (
                <form onSubmit={handleReviewSubmit} className="mb-8 p-4 bg-brand-bg rounded-lg border border-brand-border/40 space-y-3">
                    <h4 className="text-md font-semibold text-brand-text">Leave a Review</h4>
                    <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-brand-text-muted mb-1">Your Rating:</label>
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} type="button" onClick={() => setUserRating(star)} aria-label={`Rate ${star} out of 5 stars`}>
                                    <StarIcon className={`w-6 h-6 cursor-pointer transition-colors ${userRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-brand-text-darker hover:text-yellow-300'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="reviewText" className="block text-sm font-medium text-brand-text-muted mb-1">Your Comment:</label>
                        <textarea 
                            id="reviewText" 
                            value={userReviewText} 
                            onChange={e => setUserReviewText(e.target.value)} 
                            rows={3} 
                            className={commonInputStyles}
                            placeholder="Share your experience with this course..."
                            required
                        />
                    </div>
                    <button type="submit" className={`${primaryButtonStyles} text-sm`} disabled={isSubmittingReview || userRating === 0 || !userReviewText.trim()}>
                        {isSubmittingReview ? <LoadingSpinner size="sm" color="white"/> : 'Submit Review'}
                    </button>
                </form>
            )}
            {(course.reviews && course.reviews.length > 0) ? (
              <div className="space-y-5">
                {course.reviews.slice().sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(review => (
                  <div key={review.id} className="flex items-start space-x-3 border-b border-brand-border/30 pb-4 last:border-b-0 last:pb-0">
                    <img src={review.userAvatar || GUEST_AVATAR_URL} alt={review.userName} className="w-10 h-10 rounded-full object-cover border-2 border-brand-border/40"/>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-semibold text-brand-text">{review.userName}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-brand-text-darker'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-brand-text-darker mb-1.5">{new Date(review.createdAt).toLocaleDateString()}</p>
                      <p className="text-sm text-brand-text-muted whitespace-pre-wrap break-words">{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-brand-text-muted">No reviews for this course yet.</p>}
          </div>
        )}
      </div>
      <GoProModal
        isOpen={isGoProModalOpen}
        onClose={() => setIsGoProModalOpen(false)}
        onSubscribe={onSubscribePro}
        featureName="this Pro course or lesson"
      />
    </div>
  );
};

export default CoursePage;