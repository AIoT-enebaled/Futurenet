

import React, { useState, useEffect } from 'react';
import { InstructorDashboardPageProps, Course, CourseModule, CourseLesson, CourseCategory, CourseDifficulty } from '../types';
import { COURSE_CATEGORIES_DATA, COURSE_DIFFICULTY_LEVELS } from '../constants';
// FIX: Added ListTreeIcon and StarIcon to imports
import { GraduationCapIcon, PlusCircleIcon, EditIcon, Trash2Icon, BarChart3Icon, CheckBadgeIcon, UploadCloudIcon, ListTreeIcon, StarIcon } from '../components/icons';
import Modal from '../components/Modal'; // Assuming Modal component exists

const InstructorDashboardPage: React.FC<InstructorDashboardPageProps> = ({ currentUser, courses, instructors, onCreateCourse, onUpdateCourse }) => {
  const [activeTab, setActiveTab] = useState<'my-courses' | 'create-course' | 'analytics'>('my-courses');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  
  const [newCourseData, setNewCourseData] = useState<Omit<Course, 'id' | 'rating' | 'reviewsCount' | 'reviews'>>({
    title: '',
    subtitle: '',
    description: '',
    instructorId: currentUser.instructorId || currentUser.id, // Fallback to user id if no specific instructorId
    categoryIds: [],
    difficulty: 'Beginner',
    durationHours: 0,
    price: 0,
    imageUrl: '',
    previewVideoUrl: '',
    modules: [{ id: `mod-${Date.now()}`, title: 'Module 1: Introduction', lessons: [{ id: `less-${Date.now()}`, title: 'Lesson 1: Welcome', durationMinutes: 5 }] }],
    tags: [],
    isProCourse: false,
  });

  const instructorCourses = courses.filter(course => course.instructorId === (currentUser.instructorId || currentUser.id));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: keyof typeof newCourseData) => {
    const value = e.target.value;
    setNewCourseData(prev => ({
      ...prev,
      [field]: field === 'durationHours' || field === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCourseData(prev => ({...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)}));
  };
  
  const handleCategoryChange = (categoryId: string) => {
    setNewCourseData(prev => {
        const newCategoryIds = prev.categoryIds.includes(categoryId)
            ? prev.categoryIds.filter(id => id !== categoryId)
            : [...prev.categoryIds, categoryId];
        return {...prev, categoryIds: newCategoryIds};
    });
  };

  const handleModuleChange = (moduleIndex: number, field: keyof CourseModule, value: string) => {
    setNewCourseData(prev => {
        const updatedModules = [...prev.modules];
        updatedModules[moduleIndex] = {...updatedModules[moduleIndex], [field]: value};
        return {...prev, modules: updatedModules};
    });
  };
  
  const handleLessonChange = (moduleIndex: number, lessonIndex: number, field: keyof CourseLesson, value: string | number | boolean) => {
     setNewCourseData(prev => {
        const updatedModules = [...prev.modules];
        const updatedLessons = [...updatedModules[moduleIndex].lessons];
        updatedLessons[lessonIndex] = {...updatedLessons[lessonIndex], [field]: value} as CourseLesson;
        updatedModules[moduleIndex] = {...updatedModules[moduleIndex], lessons: updatedLessons};
        return {...prev, modules: updatedModules};
    });
  };

  const addModule = () => {
    setNewCourseData(prev => ({
        ...prev,
        modules: [...prev.modules, { id: `mod-${Date.now()}`, title: `Module ${prev.modules.length + 1}`, lessons: [{ id: `less-${Date.now()}`, title: 'New Lesson', durationMinutes: 10 }]}]
    }));
  };

  const addLesson = (moduleIndex: number) => {
     setNewCourseData(prev => {
        const updatedModules = [...prev.modules];
        const targetModule = updatedModules[moduleIndex];
        targetModule.lessons = [...targetModule.lessons, { id: `less-${Date.now()}`, title: `New Lesson ${targetModule.lessons.length + 1}`, durationMinutes: 10 }];
        return {...prev, modules: updatedModules};
    });
  };
  
  const removeModule = (moduleIndex: number) => {
    setNewCourseData(prev => ({...prev, modules: prev.modules.filter((_, idx) => idx !== moduleIndex)}));
  };
  
  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
     setNewCourseData(prev => {
        const updatedModules = [...prev.modules];
        updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter((_, idx) => idx !== lessonIndex);
        return {...prev, modules: updatedModules};
    });
  };


  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseData.title || !newCourseData.description || newCourseData.categoryIds.length === 0 || newCourseData.modules.length === 0) {
        alert("Please fill in all required fields: Title, Description, at least one Category, and at least one Module.");
        return;
    }
    const coursePayload = {
        ...newCourseData,
        imageUrl: newCourseData.imageUrl || `https://picsum.photos/seed/course-${Date.now()}/400/225`,
    };
    if (courseToEdit) {
        onUpdateCourse(courseToEdit.id, coursePayload);
        alert("Course updated successfully!");
        setCourseToEdit(null);
    } else {
        onCreateCourse(coursePayload);
        alert("Course created successfully!");
    }
    setIsCreateModalOpen(false);
    // Reset form
    setNewCourseData({
        title: '', subtitle: '', description: '', instructorId: currentUser.instructorId || currentUser.id, categoryIds: [], difficulty: 'Beginner',
        durationHours: 0, price: 0, imageUrl: '', previewVideoUrl: '',
        modules: [{ id: `mod-${Date.now()}`, title: 'Module 1: Introduction', lessons: [{ id: `less-${Date.now()}`, title: 'Lesson 1: Welcome', durationMinutes: 5 }] }],
        tags: [], isProCourse: false,
    });
  };
  
  const openEditModal = (course: Course) => {
    setCourseToEdit(course);
    setNewCourseData({
        title: course.title,
        subtitle: course.subtitle || '',
        description: course.description,
        instructorId: course.instructorId,
        categoryIds: course.categoryIds,
        difficulty: course.difficulty,
        durationHours: course.durationHours,
        price: course.price,
        imageUrl: course.imageUrl || '',
        previewVideoUrl: course.previewVideoUrl || '',
        modules: course.modules.map(m => ({...m, lessons: m.lessons.map(l => ({...l}))})), // Deep copy
        tags: course.tags || [],
        isProCourse: course.isProCourse || false,
    });
    setIsCreateModalOpen(true);
  };

  const handleDeleteCourse = (courseId: string) => {
    if(window.confirm("Are you sure you want to delete this course? This is a mock action.")) {
        alert(`Mock: Course ${courseId} would be deleted.`);
        // In a real app: onUpdateCourse(courseId, {isDeleted: true}) or a dedicated delete function
    }
  };

  const commonInputStyles = "block w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple sm:text-sm text-brand-text placeholder-brand-text-muted transition-colors";
  const primaryButtonStyles = "flex items-center justify-center px-5 py-2.5 bg-gradient-purple-pink text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface disabled:opacity-70 disabled:cursor-not-allowed";
  const secondaryButtonStyles = "flex items-center justify-center px-4 py-2 text-sm font-medium text-brand-text-muted bg-brand-surface-alt hover:bg-opacity-80 rounded-lg shadow-sm border border-brand-border hover:border-brand-purple/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface";
  const tabButtonStyles = "w-full flex items-center px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group";
  const activeTabButtonStyles = "bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-md";
  const inactiveTabButtonStyles = "text-brand-text-muted hover:bg-brand-surface-alt hover:text-brand-text";


  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <GraduationCapIcon className="w-10 h-10 text-brand-purple" />
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-text">Instructor Dashboard</h1>
          <p className="text-brand-text-muted text-sm sm:text-base">Manage your courses, create new content, and view analytics.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
        <aside className="md:w-1/4 lg:w-1/5 flex-shrink-0">
          <nav className="space-y-1.5 sticky top-20">
            {/* FIX: ListTreeIcon was not found, ensured it's imported and used */}
            <button onClick={() => setActiveTab('my-courses')} className={`${tabButtonStyles} ${activeTab === 'my-courses' ? activeTabButtonStyles : inactiveTabButtonStyles}`}><ListTreeIcon className="w-5 h-5 mr-3"/>My Courses</button>
            <button onClick={() => { setCourseToEdit(null); setIsCreateModalOpen(true);}} className={`${tabButtonStyles} ${inactiveTabButtonStyles}`}><PlusCircleIcon className="w-5 h-5 mr-3"/>Create Course</button>
            <button onClick={() => setActiveTab('analytics')} className={`${tabButtonStyles} ${activeTab === 'analytics' ? activeTabButtonStyles : inactiveTabButtonStyles}`}><BarChart3Icon className="w-5 h-5 mr-3"/>Analytics</button>
          </nav>
        </aside>

        <main className="flex-1 md:w-3/4 lg:w-4/5">
          <div className="p-6 sm:p-8 bg-brand-surface rounded-xl shadow-xl border border-brand-border/30 min-h-[calc(100vh-15rem)]">
            {activeTab === 'my-courses' && (
                <div>
                    <h2 className="text-2xl font-semibold text-brand-text mb-5">My Courses ({instructorCourses.length})</h2>
                    {instructorCourses.length > 0 ? (
                        <div className="space-y-4">
                            {instructorCourses.map(course => (
                                <div key={course.id} className="p-4 bg-brand-bg rounded-lg border border-brand-border/40 flex justify-between items-center hover:border-brand-purple/50 transition-colors">
                                    <div>
                                        <h3 className="text-lg font-medium text-brand-text">{course.title}</h3>
                                        <p className="text-xs text-brand-text-muted">{course.categoryIds.map(cid => COURSE_CATEGORIES_DATA.find(c=>c.id===cid)?.name).join(', ')} | {course.difficulty}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => openEditModal(course)} className="p-2 text-brand-cyan hover:text-brand-pink rounded-full hover:bg-brand-surface-alt transition-colors" title="Edit Course"><EditIcon className="w-4 h-4"/></button>
                                        <button onClick={() => handleDeleteCourse(course.id)} className="p-2 text-red-500 hover:text-red-400 rounded-full hover:bg-brand-surface-alt transition-colors" title="Delete Course (Mock)"><Trash2Icon className="w-4 h-4"/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-brand-text-muted">You haven't created any courses yet. Click "Create Course" to get started!</p>}
                </div>
            )}
             {activeTab === 'analytics' && (
                <div>
                    <h2 className="text-2xl font-semibold text-brand-text mb-5">Course Analytics (Mock)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-brand-bg rounded-lg border border-brand-border/40">
                            <h3 className="text-lg font-medium text-brand-cyan">Total Enrollments</h3>
                            <p className="text-3xl font-bold text-brand-text">1,234</p>
                        </div>
                        <div className="p-4 bg-brand-bg rounded-lg border border-brand-border/40">
                            <h3 className="text-lg font-medium text-brand-cyan">Average Rating</h3>
                            {/* FIX: StarIcon was not found, ensured it's imported and used */}
                            <p className="text-3xl font-bold text-brand-text">4.7 <StarIcon className="w-6 h-6 inline text-yellow-400 mb-1"/></p>
                        </div>
                        <div className="p-4 bg-brand-bg rounded-lg border border-brand-border/40 md:col-span-2">
                            <h3 className="text-lg font-medium text-brand-cyan">Revenue This Month</h3>
                            <p className="text-3xl font-bold text-brand-text">$1,500.00</p>
                        </div>
                    </div>
                    <p className="text-sm text-brand-text-muted mt-4">More detailed charts and reports coming soon!</p>
                </div>
            )}
          </div>
        </main>
      </div>
      
      <Modal isOpen={isCreateModalOpen} onClose={() => { setIsCreateModalOpen(false); setCourseToEdit(null); }} title={courseToEdit ? `Edit Course: ${courseToEdit.title.substring(0,25)}...` : "Create New Course"} size="2xl">
        <form onSubmit={handleCreateCourseSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
            <div>
                <label htmlFor="courseTitle" className="block text-sm font-medium text-brand-text-muted mb-0.5">Course Title*</label>
                <input type="text" id="courseTitle" value={newCourseData.title} onChange={e => handleInputChange(e, 'title')} required className={commonInputStyles} />
            </div>
             <div>
                <label htmlFor="courseSubtitle" className="block text-sm font-medium text-brand-text-muted mb-0.5">Subtitle</label>
                <input type="text" id="courseSubtitle" value={newCourseData.subtitle} onChange={e => handleInputChange(e, 'subtitle')} className={commonInputStyles} />
            </div>
            <div>
                <label htmlFor="courseDesc" className="block text-sm font-medium text-brand-text-muted mb-0.5">Description*</label>
                <textarea id="courseDesc" value={newCourseData.description} onChange={e => handleInputChange(e, 'description')} rows={3} required className={commonInputStyles}></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="courseDuration" className="block text-sm font-medium text-brand-text-muted mb-0.5">Duration (Hours)*</label>
                    <input type="number" id="courseDuration" value={newCourseData.durationHours} onChange={e => handleInputChange(e, 'durationHours')} required min="0" step="0.5" className={commonInputStyles} />
                </div>
                <div>
                    <label htmlFor="coursePrice" className="block text-sm font-medium text-brand-text-muted mb-0.5">Price ($0 for Free)*</label>
                    <input type="number" id="coursePrice" value={newCourseData.price} onChange={e => handleInputChange(e, 'price')} required min="0" step="0.01" className={commonInputStyles} />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="courseDifficulty" className="block text-sm font-medium text-brand-text-muted mb-0.5">Difficulty Level*</label>
                    <select id="courseDifficulty" value={newCourseData.difficulty} onChange={e => setNewCourseData(prev => ({...prev, difficulty: e.target.value as CourseDifficulty}))} required className={commonInputStyles}>
                        {COURSE_DIFFICULTY_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-brand-text-muted mb-0.5">Categories* (Select at least one)</label>
                    <div className="max-h-28 overflow-y-auto p-2 border border-brand-border rounded-md bg-brand-bg space-y-1">
                        {COURSE_CATEGORIES_DATA.map(cat => (
                            <label key={cat.id} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-brand-surface-alt rounded">
                                <input type="checkbox" checked={newCourseData.categoryIds.includes(cat.id)} onChange={() => handleCategoryChange(cat.id)} className="h-4 w-4 text-brand-purple bg-brand-bg border-brand-border rounded focus:ring-brand-purple focus:ring-offset-brand-bg"/>
                                <span className="text-sm text-brand-text-muted">{cat.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <label htmlFor="courseImageUrl" className="block text-sm font-medium text-brand-text-muted mb-0.5">Cover Image URL</label>
                <input type="url" id="courseImageUrl" value={newCourseData.imageUrl} onChange={e => handleInputChange(e, 'imageUrl')} className={commonInputStyles} placeholder="https://picsum.photos/seed/mycourse/400/225"/>
            </div>
            <div>
                <label htmlFor="coursePreviewVideoUrl" className="block text-sm font-medium text-brand-text-muted mb-0.5">Preview Video URL (YouTube/Vimeo)</label>
                <input type="url" id="coursePreviewVideoUrl" value={newCourseData.previewVideoUrl} onChange={e => handleInputChange(e, 'previewVideoUrl')} className={commonInputStyles} placeholder="e.g. https://www.youtube.com/watch?v=..."/>
            </div>
             <div>
                <label htmlFor="courseTags" className="block text-sm font-medium text-brand-text-muted mb-0.5">Tags (comma-separated)</label>
                <input type="text" id="courseTags" value={newCourseData.tags?.join(', ')} onChange={handleTagChange} className={commonInputStyles} placeholder="e.g. python, web dev, ai"/>
            </div>
             <div className="flex items-center pt-2">
              <input id="coursePro" type="checkbox" checked={newCourseData.isProCourse} onChange={e => setNewCourseData(prev => ({...prev, isProCourse: e.target.checked}))} className="h-4 w-4 text-brand-purple bg-brand-bg border-brand-border rounded focus:ring-brand-purple focus:ring-offset-brand-surface cursor-pointer" />
              <label htmlFor="coursePro" className="ml-2 block text-sm text-brand-text cursor-pointer">Pro Course (Requires subscription or direct purchase)</label>
            </div>

            {/* Modules and Lessons */}
            <h3 className="text-md font-semibold text-brand-text pt-3 border-t border-brand-border/30">Curriculum*</h3>
            {newCourseData.modules.map((module, moduleIndex) => (
                <div key={module.id || moduleIndex} className="p-3 bg-brand-bg/70 rounded-md border border-brand-border/50 space-y-2">
                    <div className="flex justify-between items-center">
                        <input type="text" value={module.title} onChange={e => handleModuleChange(moduleIndex, 'title', e.target.value)} placeholder={`Module ${moduleIndex + 1} Title`} className={`${commonInputStyles} text-sm font-medium flex-grow mr-2`} />
                        <button type="button" onClick={() => removeModule(moduleIndex)} className="p-1 text-red-500 hover:text-red-400 rounded-full hover:bg-brand-surface-alt" title="Remove Module"><Trash2Icon className="w-4 h-4"/></button>
                    </div>
                    {module.lessons.map((lesson, lessonIndex) => (
                         <div key={lesson.id || lessonIndex} className="ml-4 p-2 bg-brand-surface/50 rounded border border-brand-border/30 space-y-1.5">
                             <div className="flex justify-between items-center">
                                <input type="text" value={lesson.title} onChange={e => handleLessonChange(moduleIndex, lessonIndex, 'title', e.target.value)} placeholder={`Lesson ${lessonIndex + 1} Title`} className={`${commonInputStyles} text-xs flex-grow mr-2 py-1`} />
                                <button type="button" onClick={() => removeLesson(moduleIndex, lessonIndex)} className="p-1 text-red-500 hover:text-red-400 rounded-full hover:bg-brand-bg" title="Remove Lesson"><Trash2Icon className="w-3.5 h-3.5"/></button>
                            </div>
                            <input type="number" value={lesson.durationMinutes} onChange={e => handleLessonChange(moduleIndex, lessonIndex, 'durationMinutes', parseInt(e.target.value) || 0)} placeholder="Duration (mins)" min="1" className={`${commonInputStyles} text-xs py-1`} />
                            <input type="url" value={lesson.videoUrl || ''} onChange={e => handleLessonChange(moduleIndex, lessonIndex, 'videoUrl', e.target.value)} placeholder="Video URL (optional)" className={`${commonInputStyles} text-xs py-1`} />
                            <label className="flex items-center space-x-2 text-xs text-brand-text-muted cursor-pointer">
                                <input type="checkbox" checked={lesson.isFreePreview || false} onChange={e => handleLessonChange(moduleIndex, lessonIndex, 'isFreePreview', e.target.checked)} className="h-3.5 w-3.5 text-brand-purple bg-brand-bg border-brand-border rounded focus:ring-brand-purple focus:ring-offset-brand-bg"/>
                                <span>Free Preview</span>
                            </label>
                         </div>
                    ))}
                    <button type="button" onClick={() => addLesson(moduleIndex)} className="mt-1 text-xs text-brand-cyan hover:underline">+ Add Lesson</button>
                </div>
            ))}
             <button type="button" onClick={addModule} className="mt-2 text-sm text-green-500 hover:text-green-400 hover:underline font-medium">+ Add Module</button>

            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => {setIsCreateModalOpen(false); setCourseToEdit(null);}} className={secondaryButtonStyles}>Cancel</button>
                <button type="submit" className={primaryButtonStyles}>{courseToEdit ? "Save Changes" : "Create Course"}</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default InstructorDashboardPage;