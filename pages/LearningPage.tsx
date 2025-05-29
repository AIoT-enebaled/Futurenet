
import React, { useState, useMemo } from 'react';
import { Course, User, LearningPageProps, CourseCategory as CourseCategoryType, CourseDifficulty } from '../types';
import { COURSE_CATEGORIES_DATA, COURSE_DIFFICULTY_LEVELS } from '../constants';
import CourseCard from '../components/CourseCard';
import { GraduationCapIcon, SearchIcon, FilterIcon, ChevronDownIcon } from '../components/icons';
import GoProModal from '../components/GoProModal';

const LearningPage: React.FC<LearningPageProps> = ({ currentUser, courses, purchasedCourses, onPurchaseCourse, onSubscribePro }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<CourseDifficulty | null>(null);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [isGoProModalOpen, setIsGoProModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = !categoryFilter || course.categoryIds.includes(categoryFilter);
      const matchesDifficulty = !difficultyFilter || course.difficulty === difficultyFilter;
      const matchesPrice = priceFilter === 'all' || 
                           (priceFilter === 'free' && course.price === 0) ||
                           (priceFilter === 'paid' && course.price > 0);
      return matchesSearch && matchesCategory && matchesDifficulty && matchesPrice;
    });
  }, [courses, searchTerm, categoryFilter, difficultyFilter, priceFilter]);

  const handleEnrollClick = (course: Course) => {
    if (course.isProCourse && !currentUser?.is_pro_user && course.price > 0) { // Pro course that isn't free
      setIsGoProModalOpen(true);
    } else {
      onPurchaseCourse(course.id, course.isProCourse);
    }
  };
  
  const commonButtonStyles = "px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm rounded-lg font-medium transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface";
  const activeFilterButtonStyles = "bg-gradient-purple-pink text-white shadow-lg hover:shadow-glow-pink focus:ring-brand-purple";
  const inactiveFilterButtonStyles = "bg-brand-bg text-brand-text-muted hover:bg-brand-surface-alt hover:text-brand-text border border-brand-border focus:ring-brand-cyan";


  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <GraduationCapIcon className="w-10 h-10 text-brand-purple" />
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-text">GiiT Learning Hub</h1>
          <p className="text-brand-text-muted text-sm sm:text-base">Expand your knowledge with courses curated by GiiT experts.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search courses by title, keyword, or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-brand-border bg-brand-bg text-brand-text rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple placeholder-brand-text-muted transition-colors"
          aria-label="Search courses"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-text-muted" />
      </div>

      {/* Filters Toggle for Mobile */}
      <div className="md:hidden">
        <button 
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center py-2.5 px-4 bg-brand-surface-alt text-brand-text rounded-lg shadow-md border border-brand-border hover:border-brand-purple transition-colors"
        >
            <FilterIcon className="w-5 h-5 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            <ChevronDownIcon className={`w-5 h-5 ml-auto transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {/* Filter Section */}
      <div className={`${showFilters ? 'block' : 'hidden'} md:block p-4 bg-brand-surface rounded-xl border border-brand-border/30 shadow-lg space-y-4`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
                <label htmlFor="categoryFilter" className="block text-sm font-medium text-brand-text-muted mb-1">Category</label>
                <select 
                    id="categoryFilter" 
                    value={categoryFilter || ''} 
                    onChange={e => setCategoryFilter(e.target.value || null)}
                    className="w-full p-2.5 border border-brand-border bg-brand-bg text-brand-text rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple text-sm transition-colors"
                >
                    <option value="">All Categories</option>
                    {COURSE_CATEGORIES_DATA.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
            </div>
            {/* Difficulty Filter */}
            <div>
                <label htmlFor="difficultyFilter" className="block text-sm font-medium text-brand-text-muted mb-1">Difficulty</label>
                <select 
                    id="difficultyFilter" 
                    value={difficultyFilter || ''} 
                    onChange={e => setDifficultyFilter(e.target.value as CourseDifficulty || null)}
                    className="w-full p-2.5 border border-brand-border bg-brand-bg text-brand-text rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple text-sm transition-colors"
                >
                    <option value="">All Difficulties</option>
                    {COURSE_DIFFICULTY_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                </select>
            </div>
            {/* Price Filter */}
            <div>
                <label htmlFor="priceFilter" className="block text-sm font-medium text-brand-text-muted mb-1">Price</label>
                <select 
                    id="priceFilter" 
                    value={priceFilter} 
                    onChange={e => setPriceFilter(e.target.value as 'all' | 'free' | 'paid')}
                    className="w-full p-2.5 border border-brand-border bg-brand-bg text-brand-text rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-purple focus:border-brand-purple text-sm transition-colors"
                >
                    <option value="all">All Prices</option>
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                </select>
            </div>
        </div>
      </div>


      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredCourses.map((course: Course) => (
            <CourseCard 
                key={course.id} 
                course={course} 
                currentUser={currentUser} 
                isEnrolled={purchasedCourses.includes(course.id)}
                onEnrollClick={() => handleEnrollClick(course)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <GraduationCapIcon className="w-20 h-20 text-brand-text-darker mx-auto mb-6" />
          <p className="text-xl font-semibold text-brand-text-muted">No courses match your current filters.</p>
          <p className="text-sm text-brand-text-darker mt-2">Try adjusting your search or filter criteria, or check back later for new courses!</p>
        </div>
      )}
       <GoProModal
        isOpen={isGoProModalOpen}
        onClose={() => setIsGoProModalOpen(false)}
        onSubscribe={onSubscribePro}
        featureName="this Pro course"
      />
    </div>
  );
};

export default LearningPage;
