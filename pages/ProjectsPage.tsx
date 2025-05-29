
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Project, User, ProjectsPageProps, SubscriptionTier } from '../types'; 
import { PlusCircleIcon, BriefcaseIcon, LogInIcon, ExternalLinkIcon, EditIcon, Trash2Icon, ArrowDownUpIcon, StarIcon } from '../components/icons';
import Modal from '../components/Modal'; 
import EditProjectModal from '../components/EditProjectModal'; 
import GoProModal from '../components/GoProModal'; // New

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  isOwner: boolean;
}
const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete, isOwner }) => (
  <div className="bg-brand-surface rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-glow-purple transform hover:-translate-y-1.5 border border-brand-border/30 hover:border-brand-purple/40 flex flex-col">
    <img className="w-full h-48 object-cover" src={project.imageUrl} alt={project.title} />
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-xl font-semibold text-brand-text line-clamp-2" title={project.title}>{project.title}</h3>
        {isOwner && (
          <div className="flex space-x-1 flex-shrink-0 ml-2">
            <button onClick={() => onEdit(project)} title="Edit Project" className="p-1.5 text-brand-text-muted hover:text-brand-cyan rounded-full hover:bg-brand-surface-alt transition-colors"><EditIcon className="w-4 h-4"/></button>
            <button onClick={() => onDelete(project.id)} title="Delete Project" className="p-1.5 text-brand-text-muted hover:text-brand-pink rounded-full hover:bg-brand-surface-alt transition-colors"><Trash2Icon className="w-4 h-4"/></button>
          </div>
        )}
      </div>
      <p className="text-brand-text-muted text-sm mb-3 leading-relaxed line-clamp-3 flex-grow">{project.description}</p>
      {project.link && (
        <a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-sm text-brand-cyan hover:text-brand-pink mb-3 group transition-colors"
            title={`View project: ${project.title} (opens in new tab)`}
        >
          View Project <ExternalLinkIcon className="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-0.5 transition-transform" />
        </a>
      )}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map(tag => (
            <span key={tag} className="px-2.5 py-0.5 bg-brand-bg text-brand-text-muted rounded-full text-xs font-medium border border-brand-border/40">
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div className="text-xs text-brand-text-darker mt-auto pt-3 border-t border-brand-border/20">
        <span className="truncate">By {project.owner}</span> | <span>{new Date(project.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  </div>
);

interface ExtendedProjectsPageProps extends ProjectsPageProps {
  onSubscribePro: (tier: SubscriptionTier) => void;
}

const ProjectsPage: React.FC<ExtendedProjectsPageProps> = ({ currentUser, projects, onCreateProject, onUpdateProject, onDeleteProject, onSubscribePro }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [newProjectData, setNewProjectData] = useState<Omit<Project, 'id' | 'createdAt'>>({ 
      title: '', description: '', link: '', owner: '', imageUrl: '', tags: [] 
  });
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [isGoProModalOpen, setIsGoProModalOpen] = useState(false);


  useEffect(() => {
    if (currentUser && (isCreateModalOpen || projectToEdit)) {
        setNewProjectData(prev => ({...prev, owner: currentUser.displayName}));
    }
  }, [currentUser, isCreateModalOpen, projectToEdit]);

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return; 
    if (newProjectData.title && newProjectData.description) {
      onCreateProject({...newProjectData, imageUrl: newProjectData.imageUrl || `https://picsum.photos/seed/proj-${newProjectData.title.replace(/\s+/g, '-')}/400/300`});
      setNewProjectData({ title: '', description: '', link: '', owner: currentUser.displayName, imageUrl: '', tags: [] });
      setIsCreateModalOpen(false);
    }
  };

  const handleEditProjectSubmit = (updatedData: Partial<Project>) => {
    if (!projectToEdit) return;
    onUpdateProject(projectToEdit.id, updatedData);
    setProjectToEdit(null);
  };
  
  const handleDeleteProjectClick = (projectId: string) => {
    if(window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
        onDeleteProject(projectId);
    }
  };

  const openEditModal = (project: Project) => {
    setProjectToEdit(project);
  };

  const handleGenerateWithAIClick = (fieldToUpdate: 'description' | 'title') => {
      if (!currentUser?.is_pro_user) {
          setIsGoProModalOpen(true);
          return;
      }
      // Mock AI generation
      const mockContent = `This is an AI-generated ${fieldToUpdate} for '${newProjectData.title || 'New Project'}'. It's innovative, collaborative, and uses cutting-edge tech! ✨`;
      if (fieldToUpdate === 'description') {
          setNewProjectData(prev => ({ ...prev, description: mockContent }));
          if (projectToEdit) setProjectToEdit(prev => prev ? {...prev, description: mockContent} : null);
      } else if (fieldToUpdate === 'title') {
           setNewProjectData(prev => ({ ...prev, title: `AI Project: ${Date.now().toString().slice(-4)}` }));
           if (projectToEdit) setProjectToEdit(prev => prev ? {...prev, title: `AI Project: ${Date.now().toString().slice(-4)}`} : null);
      }
      alert(`Mock AI generated ${fieldToUpdate}!`);
  };

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [projects, sortOrder]);

  const commonInputStyles = "mt-1 block w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple sm:text-sm text-brand-text placeholder-brand-text-muted transition-colors";
  const primaryButtonStyles = "flex items-center justify-center bg-gradient-purple-pink text-white font-semibold py-2.5 px-5 rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface";
  const secondaryButtonStyles = "flex items-center justify-center bg-brand-surface text-brand-text-muted font-semibold py-2.5 px-5 rounded-lg shadow-md hover:bg-brand-surface-alt hover:text-brand-text border border-brand-border/70 hover:border-brand-purple/70 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface";
  const aiButtonStyles = "text-xs inline-flex items-center text-brand-cyan hover:text-brand-pink transition-colors ml-2 px-2 py-1 rounded-md border border-brand-cyan/50 hover:border-brand-pink/50 bg-brand-surface-alt/50";

  const renderFormFields = (data: Omit<Project, 'id' | 'createdAt'>, setData: React.Dispatch<React.SetStateAction<Omit<Project, 'id' | 'createdAt'>>> | ((updateFn: (prev: Project | null) => Project | null) => void)) => (
     <>
        <div>
            <label htmlFor="projTitle" className="block text-sm font-medium text-brand-text-muted mb-0.5">Project Title</label>
            <div className="flex items-center">
                <input type="text" id="projTitle" value={data.title} onChange={e => typeof setData === 'function' ? (setData as Function)( (prev: any) => ({...prev, title: e.target.value})) : ''} required className={commonInputStyles} placeholder="e.g., AI Powered Chatbot"/>
                <button type="button" onClick={() => handleGenerateWithAIClick('title')} className={aiButtonStyles} title="Generate Title with AI (Pro)">
                    <StarIcon className="w-3 h-3 mr-1 text-yellow-400"/> AI
                </button>
            </div>
        </div>
        <div>
            <label htmlFor="projDesc" className="block text-sm font-medium text-brand-text-muted mb-0.5">Description</label>
            <textarea id="projDesc" value={data.description} onChange={e => typeof setData === 'function' ? (setData as Function)( (prev: any) => ({...prev, description: e.target.value})) : ''} rows={3} required className={commonInputStyles} placeholder="Briefly describe your project..."></textarea>
            <button type="button" onClick={() => handleGenerateWithAIClick('description')} className={`${aiButtonStyles} mt-1`} title="Generate Description with AI (Pro)">
                <StarIcon className="w-3 h-3 mr-1 text-yellow-400"/> Generate with AI
            </button>
        </div>
        <div>
            <label htmlFor="projLink" className="block text-sm font-medium text-brand-text-muted mb-0.5">Project Link (e.g., GitHub, Replit)</label>
            <input type="url" id="projLink" value={data.link} onChange={e => typeof setData === 'function' ? (setData as Function)( (prev: any) => ({...prev, link: e.target.value})) : ''} className={commonInputStyles} placeholder="https://github.com/your/project"/>
        </div>
        <div>
            <label htmlFor="projImg" className="block text-sm font-medium text-brand-text-muted mb-0.5">Image URL (Optional)</label>
            <input type="url" id="projImg" value={data.imageUrl} onChange={e => typeof setData === 'function' ? (setData as Function)( (prev: any) => ({...prev, imageUrl: e.target.value})) : ''} placeholder="https://example.com/image.png (auto-generates if blank)" className={commonInputStyles} />
        </div>
        <div>
            <label htmlFor="projTags" className="block text-sm font-medium text-brand-text-muted mb-0.5">Tags (comma separated)</label>
            <input type="text" id="projTags" value={data.tags?.join(', ')} onChange={e => typeof setData === 'function' ? (setData as Function)( (prev: any) => ({...prev, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})) : ''} placeholder="e.g. react, nodejs, ai" className={commonInputStyles} />
        </div>
     </>
  );


  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <BriefcaseIcon className="w-10 h-10 text-brand-purple" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-text">Projects Hub</h1>
            <p className="text-brand-text-muted text-sm sm:text-base">Explore and share innovative projects from the GiiT community.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
            title={`Sort by ${sortOrder === 'newest' ? 'Oldest First' : 'Newest First'}`}
            className="flex items-center text-sm text-brand-text-muted hover:text-brand-cyan py-2 px-3 bg-brand-surface rounded-lg shadow-md border border-brand-border/50 hover:border-brand-cyan/50 transition-colors focus:outline-none focus:ring-1 focus:ring-brand-cyan"
          >
            <ArrowDownUpIcon className="w-4 h-4 mr-1.5" />
            Sort: {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
          </button>
          {currentUser ? (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              title="Add New Project"
              className={primaryButtonStyles}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Add Project
            </button>
          ) : (
            <Link
              to="/login"
              title="Log in to Add Project"
              className={secondaryButtonStyles}
            >
              <LogInIcon className="w-5 h-5 mr-2" />
              Log in to Add
            </Link>
          )}
        </div>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Showcase Your Project" size="lg">
          <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
            {renderFormFields(newProjectData, setNewProjectData as any)}
            <div className="mt-4 p-3 bg-brand-bg/70 rounded-md border border-brand-border/50">
                <p className="text-xs text-brand-text-muted">Or <button type="button" className="text-brand-cyan hover:underline" onClick={() => alert('GitHub/Replit import coming soon!')}>import from GitHub/Replit (Coming Soon)</button></p>
            </div>
            <div className="flex justify-end space-x-3 pt-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className={`${secondaryButtonStyles} py-2 px-4 text-sm`}>Cancel</button>
                <button type="submit" title="Submit New Project" className={`${primaryButtonStyles} py-2 px-4 text-sm`}>Add Project</button>
            </div>
          </form>
      </Modal>

      {projectToEdit && (
        <EditProjectModal 
            isOpen={!!projectToEdit}
            onClose={() => setProjectToEdit(null)}
            project={projectToEdit}
            onUpdateProject={handleEditProjectSubmit}
            // Pass handleGenerateWithAIClick or similar if EditProjectModal also has AI generation
            // For simplicity, AI generation is only in the create modal for this example.
            // To add to EditProjectModal, it would need similar state handling and props.
        />
      )}

      {sortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {sortedProjects.map((project: Project) => (
            <ProjectCard 
                key={project.id} 
                project={project} 
                onEdit={openEditModal}
                onDelete={handleDeleteProjectClick}
                isOwner={(project.owner === currentUser?.displayName && !!currentUser) || (currentUser?.role === 'admin')}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BriefcaseIcon className="w-16 h-16 text-brand-text-darker mx-auto mb-4" />
          <p className="text-xl text-brand-text-muted">No projects showcased yet.</p>
          <p className="text-sm text-brand-text-darker mt-1">{currentUser ? "Be the first to add one!" : "Log in to add your project."}</p>
        </div>
      )}
      <GoProModal 
        isOpen={isGoProModalOpen}
        onClose={() => setIsGoProModalOpen(false)}
        onSubscribe={onSubscribePro}
        featureName="AI Content Generation"
      />
    </div>
  );
};

export default ProjectsPage;
