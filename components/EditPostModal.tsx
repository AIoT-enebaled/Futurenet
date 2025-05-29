
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Post } from '../types';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdatePost: (postData: Partial<Post>) => void;
  post: Post;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ isOpen, onClose, onUpdatePost, post }) => {
  const [title, setTitle] = useState(post.title);
  const [subtitle, setSubtitle] = useState(post.subtitle || '');
  const [body, setBody] = useState(post.body);
  const [imageUrl, setImageUrl] = useState(post.imageUrl || '');
  const [tags, setTags] = useState(post.tags?.join(', ') || '');

  useEffect(() => {
    if (isOpen) {
      setTitle(post.title);
      setSubtitle(post.subtitle || '');
      setBody(post.body);
      setImageUrl(post.imageUrl || '');
      setTags(post.tags?.join(', ') || '');
    }
  }, [isOpen, post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePost({
      title,
      subtitle: subtitle || undefined,
      body,
      imageUrl: imageUrl || undefined,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    });
    onClose();
  };

  const commonInputStyles = "mt-1 block w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple sm:text-sm text-brand-text placeholder-brand-text-muted transition-colors";
  const primaryButtonStyles = "flex items-center justify-center px-4 py-2 bg-gradient-purple-pink text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface";
  const secondaryButtonStyles = "flex items-center justify-center px-4 py-2 text-sm font-medium text-brand-text-muted bg-brand-surface-alt hover:bg-opacity-80 rounded-lg shadow-sm border border-brand-border hover:border-brand-purple/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface";


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Post: ${post.title.substring(0,30)}...`} size="xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="editPostTitleModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Title</label>
          <input type="text" id="editPostTitleModal" value={title} onChange={e => setTitle(e.target.value)} required className={commonInputStyles} />
        </div>
        <div>
          <label htmlFor="editPostSubtitleModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Subtitle (Optional)</label>
          <input type="text" id="editPostSubtitleModal" value={subtitle} onChange={e => setSubtitle(e.target.value)} className={commonInputStyles} />
        </div>
        <div>
          <label htmlFor="editPostBodyModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Body (Markdown)</label>
          <textarea id="editPostBodyModal" value={body} onChange={e => setBody(e.target.value)} rows={6} required className={`${commonInputStyles} min-h-[150px]`}></textarea>
        </div>
        <div>
          <label htmlFor="editPostImgUrlModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Image URL (Optional)</label>
          <input type="url" id="editPostImgUrlModal" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://picsum.photos/seed/myblogpost/600/400" className={commonInputStyles} />
        </div>
        <div>
          <label htmlFor="editPostTagsModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Tags (comma separated)</label>
          <input type="text" id="editPostTagsModal" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. tech, tutorial, news" className={commonInputStyles} />
        </div>
        <div className="flex justify-end space-x-3 pt-3">
          <button type="button" onClick={onClose} className={secondaryButtonStyles}>Cancel</button>
          <button type="submit" className={primaryButtonStyles}>Save Changes</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPostModal;