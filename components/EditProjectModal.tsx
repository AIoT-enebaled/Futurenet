
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Project } from '../types';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateProject: (projectData: Partial<Project>) => void;
  project: Project;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, onUpdateProject, project }) => {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [link, setLink] = useState(project.link || '');
  const [imageUrl, setImageUrl] = useState(project.imageUrl || '');
  const [tags, setTags] = useState(project.tags?.join(', ') || '');

  useEffect(() => {
    if (isOpen) {
      setTitle(project.title);
      setDescription(project.description);
      setLink(project.link || '');
      setImageUrl(project.imageUrl || '');
      setTags(project.tags?.join(', ') || '');
    }
  }, [isOpen, project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProject({
      title,
      description,
      link: link || undefined,
      imageUrl: imageUrl || undefined,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    });
    onClose();
  };

  const commonInputStyles = "mt-1 block w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple sm:text-sm text-brand-text placeholder-brand-text-muted transition-colors";
  const primaryButtonStyles = "flex items-center justify-center px-4 py-2 bg-gradient-purple-pink text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface";
  const secondaryButtonStyles = "flex items-center justify-center px-4 py-2 text-sm font-medium text-brand-text-muted bg-brand-surface-alt hover:bg-opacity-80 rounded-lg shadow-sm border border-brand-border hover:border-brand-purple/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Project: ${project.title.substring(0,30)}...`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="editProjTitleModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Title</label>
          <input type="text" id="editProjTitleModal" value={title} onChange={e => setTitle(e.target.value)} required className={commonInputStyles} />
        </div>
        <div>
          <label htmlFor="editProjDescModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Description</label>
          <textarea id="editProjDescModal" value={description} onChange={e => setDescription(e.target.value)} rows={3} required className={commonInputStyles}></textarea>
        </div>
        <div>
          <label htmlFor="editProjLinkModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Project Link (e.g., GitHub, Replit)</label>
          <input type="url" id="editProjLinkModal" value={link} onChange={e => setLink(e.target.value)} className={commonInputStyles} />
        </div>
         <div>
          <label htmlFor="editProjImgModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Image URL (Optional)</label>
          <input type="url" id="editProjImgModal" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://picsum.photos/seed/myproject/400/300" className={commonInputStyles} />
        </div>
         <div>
            <label htmlFor="editProjTagsModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Tags (comma separated)</label>
            <input type="text" id="editProjTagsModal" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. react, nodejs, ai" className={commonInputStyles} />
        </div>
         <div className="mt-4 p-3 bg-brand-bg/70 rounded-md border border-brand-border/50">
            <p className="text-xs text-brand-text-muted">Note: Direct import from GitHub/Replit (Coming Soon) would appear here.</p>
        </div>
        <div className="flex justify-end space-x-3 pt-3">
          <button type="button" onClick={onClose} className={secondaryButtonStyles}>Cancel</button>
          <button type="submit" className={primaryButtonStyles}>Save Changes</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProjectModal;