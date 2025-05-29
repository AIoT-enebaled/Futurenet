
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Post, User, BlogPageProps, Comment as CommentType, SubscriptionTier } from '../types'; 
import { PlusCircleIcon, Edit3Icon, HeartIcon, ThumbsUpIcon, MessageCircleIcon, EditIcon, Trash2Icon, LogInIcon, StarIcon, ImageIcon } from '../components/icons'; // Added ImageIcon
import Modal from '../components/Modal'; 
import GoProModal from '../components/GoProModal';
import { generateImageFromPrompt } from '../services/geminiService'; // Added for image generation
import LoadingSpinner from '../components/LoadingSpinner'; // For image generation loading

interface PostCardProps {
  post: Post;
  onAddReaction: (postId: string, reactionType: 'heart' | 'thumbsUp' | 'fire' | 'clap') => void;
  onDeletePost: (postId: string) => void; 
  onEditPostRedirect: (postId: string) => void; 
  isOwner: boolean;
  currentUser: User | null;
}
const PostCard: React.FC<PostCardProps> = ({ post, onAddReaction, onDeletePost, onEditPostRedirect, isOwner, currentUser }) => {
  const handleReactionClick = (reactionType: 'heart' | 'thumbsUp' | 'fire' | 'clap') => {
    if (!currentUser) {
      alert("Please log in to react to posts."); 
      return;
    }
    onAddReaction(post.id, reactionType);
  };
  
  return (
  <article className="bg-brand-surface rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-glow-purple transform hover:-translate-y-1.5 border border-brand-border/30 hover:border-brand-purple/40 flex flex-col">
    {post.imageUrl && (
      <div className="w-full h-56 bg-brand-bg overflow-hidden">
        <img className="w-full h-full object-cover" src={post.imageUrl} alt={post.title} />
      </div>
    )}
    <div className="p-5 sm:p-6 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2">
        <Link to={`/blog/${post.id}`} title={`Read more about ${post.title}`}>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-text hover:text-brand-cyan transition-colors cursor-pointer line-clamp-2">{post.title}</h2>
        </Link>
        {isOwner && (
            <div className="flex items-center space-x-1.5 flex-shrink-0 ml-2">
                <button onClick={() => onEditPostRedirect(post.id)} title="Edit Post" className="p-1.5 rounded-full hover:bg-brand-surface-alt text-brand-text-muted hover:text-brand-cyan transition-colors">
                    <EditIcon className="w-4 h-4" />
                </button>
                <button onClick={() => onDeletePost(post.id)} title="Delete Post" className="p-1.5 rounded-full hover:bg-brand-surface-alt text-brand-text-muted hover:text-brand-pink transition-colors">
                    <Trash2Icon className="w-4 h-4" />
                </button>
            </div>
        )}
      </div>
      {post.subtitle && <p className="text-sm sm:text-md text-brand-text-muted mb-3 line-clamp-2">{post.subtitle}</p>}
      <p className="text-brand-text text-sm mb-4 leading-relaxed line-clamp-3 flex-grow">{post.body.substring(0, 200)}...</p>
      
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => (
            <span key={tag} className="px-2.5 py-0.5 bg-brand-bg text-brand-text-muted rounded-full text-xs font-medium border border-brand-border/40">
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="mt-auto pt-4 border-t border-brand-border/20">
        <div className="flex flex-wrap justify-between items-center mb-3 text-xs text-brand-text-darker">
            <div className="truncate pr-2">
              <span>By {post.author}</span> | <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                <button 
                    onClick={() => handleReactionClick('heart')} 
                    className={`flex items-center text-brand-text-muted transition-colors ${currentUser ? 'hover:text-brand-pink' : 'cursor-not-allowed opacity-70'}`}
                    disabled={!currentUser}
                    title={!currentUser ? "Log in to Heart" : "Heart"}
                >
                    <HeartIcon className={`w-4 h-4 mr-1 ${currentUser && post.reactions.heart ? 'fill-brand-pink text-brand-pink' : 'text-brand-text-darker group-hover:text-brand-pink'}`} /> {post.reactions.heart || 0}
                </button>
                <button 
                    onClick={() => handleReactionClick('thumbsUp')}
                    className={`flex items-center text-brand-text-muted transition-colors ${currentUser ? 'hover:text-brand-cyan' : 'cursor-not-allowed opacity-70'}`}
                    disabled={!currentUser}
                    title={!currentUser ? "Log in to Thumbs Up" : "Thumbs Up"}
                >
                    <ThumbsUpIcon className={`w-4 h-4 mr-1 ${currentUser && post.reactions.thumbsUp ? 'fill-brand-cyan text-brand-cyan' : 'text-brand-text-darker group-hover:text-brand-cyan'}`} /> {post.reactions.thumbsUp || 0}
                </button>
                <Link to={`/blog/${post.id}#comments`} title="View Comments" className="flex items-center text-brand-text-muted hover:text-brand-purple transition-colors">
                    <MessageCircleIcon className="w-4 h-4 mr-1" /> {post.comments?.length || 0}
                </Link>
            </div>
        </div>
        <Link to={`/blog/${post.id}`} title={`Read more about ${post.title}`} className="text-sm text-brand-purple hover:text-brand-pink font-semibold transition-colors inline-block">Read more &rarr;</Link>
      </div>
    </div>
  </article>
  );
};

interface ExtendedBlogPageProps extends BlogPageProps {
  onSubscribePro: (tier: SubscriptionTier) => void;
}

export const BlogPage: React.FC<ExtendedBlogPageProps> = ({ currentUser, posts, onCreatePost, onDeletePost, onUpdatePost, onSubscribePro }) => {
  const [localPosts, setLocalPosts] = useState<Post[]>(posts); 
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPostData, setNewPostData] = useState<Omit<Post, 'id' | 'createdAt' | 'reactions' | 'comments'>>({ 
      title: '', subtitle: '', body: '', author: '', imageUrl: '', tags: []
  });
  const navigate = useNavigate();
  const [isGoProModalOpen, setIsGoProModalOpen] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageGenerationError, setImageGenerationError] = useState<string | null>(null);


  useEffect(() => {
    setLocalPosts(posts.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, [posts]);

  useEffect(() => {
    if (currentUser && isCreateModalOpen) { 
        setNewPostData(prev => ({...prev, author: currentUser.displayName, imageUrl: prev.imageUrl || '' })); // Ensure imageUrl is initialized
    }
  }, [currentUser, isCreateModalOpen]);

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (newPostData.title && newPostData.body) {
      onCreatePost({...newPostData, imageUrl: newPostData.imageUrl || `https://picsum.photos/seed/blog-${newPostData.title.replace(/\s+/g, '-')}/600/400`});
      setNewPostData({ title: '', subtitle: '', body: '', author: currentUser.displayName, imageUrl: '', tags: [] });
      setIsCreateModalOpen(false);
      setImageGenerationError(null);
    }
  };
  
  const handleAddReaction = (postId: string, reactionType: 'heart' | 'thumbsUp' | 'fire' | 'clap') => {
    if (!currentUser) return; 
    
    const postToUpdate = localPosts.find(p => p.id === postId);
    if (!postToUpdate) return;

    const updatedReactions = {
        ...postToUpdate.reactions,
        [reactionType]: (postToUpdate.reactions[reactionType] || 0) + 1,
    };
    
    setLocalPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId
          ? { ...p, reactions: updatedReactions }
          : p
      )
    );
    onUpdatePost(postId, { reactions: updatedReactions });
  };

  const handleEditPostRedirect = (postId: string) => {
    navigate(`/blog/${postId}?edit=true`); 
  };

  const handleDeletePostCard = (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDeletePost(postId);
    }
  };

  const handleGenerateWithAIClick = async (fieldToUpdate: 'body' | 'title' | 'image') => {
    if (!currentUser?.is_pro_user) {
      setIsGoProModalOpen(true);
      return;
    }

    if (fieldToUpdate === 'image') {
      const imagePrompt = prompt("Enter a description for the image you want to generate:", newPostData.title || "A futuristic technology concept");
      if (imagePrompt) {
        setIsGeneratingImage(true);
        setImageGenerationError(null);
        try {
          const generatedImageUrl = await generateImageFromPrompt(imagePrompt);
          setNewPostData(prev => ({ ...prev, imageUrl: generatedImageUrl }));
        } catch (error: any) {
          console.error("Image generation failed:", error);
          setImageGenerationError(error.message || "Failed to generate image.");
        } finally {
          setIsGeneratingImage(false);
        }
      }
      return;
    }

    // Text generation (mock for now, can be integrated with generateBotResponse later if needed)
    let mockContent = '';
    if (fieldToUpdate === 'body') {
        mockContent = `AI-Generated Body: Discussing the nuances of '${newPostData.title || 'New Post'}'. This insightful article explores key concepts, practical applications, and future trends. It includes well-structured paragraphs, bullet points for clarity, and a concluding summary. Perfect for engaging the GiiT community! 🚀`;
        setNewPostData(prev => ({ ...prev, body: mockContent }));
    } else if (fieldToUpdate === 'title') {
        mockContent = `AI Title: The Future of ${newPostData.tags?.[0] || 'Tech'} - An In-Depth Analysis`;
        setNewPostData(prev => ({ ...prev, title: mockContent }));
    }
    alert(`Mock AI generated ${fieldToUpdate}! Actual text generation can be implemented using geminiService.`);
  };
  
  const commonInputStyles = "mt-1 block w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple sm:text-sm text-brand-text placeholder-brand-text-muted transition-colors";
  const primaryButtonStyles = "flex items-center justify-center bg-gradient-purple-pink text-white font-semibold py-2.5 px-5 rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface";
  const secondaryButtonStyles = "flex items-center justify-center bg-brand-surface text-brand-text-muted font-semibold py-2.5 px-5 rounded-lg shadow-md hover:bg-brand-surface-alt hover:text-brand-text border border-brand-border/70 hover:border-brand-purple/70 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface";
  const aiButtonStyles = "text-xs inline-flex items-center text-brand-cyan hover:text-brand-pink transition-colors ml-2 px-2 py-1 rounded-md border border-brand-cyan/50 hover:border-brand-pink/50 bg-brand-surface-alt/50 disabled:opacity-50 disabled:cursor-not-allowed";


  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <Edit3Icon className="w-10 h-10 text-brand-purple" />
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-text">GiiT Insights</h1>
            <p className="text-brand-text-muted text-sm sm:text-base">News, articles, and updates from the GiiT community pulse.</p>
          </div>
        </div>
        {currentUser ? (
          <button
            onClick={() => {
              setIsCreateModalOpen(true);
              setNewPostData({ title: '', subtitle: '', body: '', author: currentUser.displayName, imageUrl: '', tags: [] }); // Reset form
              setImageGenerationError(null);
            }}
            title="Create New Post"
            className={primaryButtonStyles}
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Create Post
          </button>
        ) : (
           <Link
            to="/login"
            title="Log in to Create Post"
            className={secondaryButtonStyles}
          >
            <LogInIcon className="w-5 h-5 mr-2" />
            Log in to Create
          </Link>
        )}
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Compose New Insight" size="xl">
          <form onSubmit={handleCreatePostSubmit} className="space-y-4">
            <div>
              <label htmlFor="postTitleModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Title</label>
               <div className="flex items-center">
                <input type="text" id="postTitleModal" value={newPostData.title} onChange={e => setNewPostData({...newPostData, title: e.target.value})} required className={commonInputStyles} placeholder="Your Post Title"/>
                <button type="button" onClick={() => handleGenerateWithAIClick('title')} className={aiButtonStyles} title="Generate Title with AI (Pro)">
                    <StarIcon className="w-3 h-3 mr-1 text-yellow-400"/> AI
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="postSubtitleModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Subtitle (Optional)</label>
              <input type="text" id="postSubtitleModal" value={newPostData.subtitle} onChange={e => setNewPostData({...newPostData, subtitle: e.target.value})} className={commonInputStyles} placeholder="A catchy subtitle"/>
            </div>
            <div>
              <label htmlFor="postBodyModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Body (Markdown supported)</label>
              <textarea id="postBodyModal" value={newPostData.body} onChange={e => setNewPostData({...newPostData, body: e.target.value})} rows={6} required className={`${commonInputStyles} min-h-[150px]`} placeholder="Share your thoughts..."></textarea>
              <button type="button" onClick={() => handleGenerateWithAIClick('body')} className={`${aiButtonStyles} mt-1`} title="Generate Body with AI (Pro)">
                    <StarIcon className="w-3 h-3 mr-1 text-yellow-400"/> Generate with AI
              </button>
            </div>
            
            <div>
              <label htmlFor="postImgModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Image</label>
              <div className="flex items-center space-x-2">
                <input type="url" id="postImgModal" value={newPostData.imageUrl} onChange={e => setNewPostData({...newPostData, imageUrl: e.target.value})} placeholder="Paste URL or generate with AI" className={commonInputStyles} />
                <button type="button" onClick={() => handleGenerateWithAIClick('image')} className={`${aiButtonStyles} whitespace-nowrap py-2.5`} title="Generate Image with AI (Pro)" disabled={isGeneratingImage}>
                  {isGeneratingImage ? <LoadingSpinner size="sm" color="cyan"/> : <><ImageIcon className="w-3.5 h-3.5 mr-1"/><StarIcon className="w-3 h-3 mr-1 text-yellow-400"/>Gen. Image</>}
                </button>
              </div>
              {isGeneratingImage && <p className="text-xs text-brand-cyan mt-1">Generating image, please wait...</p>}
              {imageGenerationError && <p className="text-xs text-red-400 mt-1">{imageGenerationError}</p>}
              {newPostData.imageUrl && !isGeneratingImage && (
                <div className="mt-2 p-2 border border-brand-border rounded-md bg-brand-bg max-w-xs">
                  <p className="text-xs text-brand-text-muted mb-1">Image Preview:</p>
                  <img src={newPostData.imageUrl} alt="Post preview" className="rounded max-h-40 w-auto object-contain" />
                </div>
              )}
            </div>

             <div>
              <label htmlFor="postTagsModal" className="block text-sm font-medium text-brand-text-muted mb-0.5">Tags (comma separated)</label>
              <input type="text" id="postTagsModal" value={newPostData.tags?.join(', ')} onChange={e => setNewPostData({...newPostData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})} placeholder="e.g. tech, tutorial, news" className={commonInputStyles} />
            </div>
            <div className="flex justify-end space-x-3 pt-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className={`${secondaryButtonStyles} py-2 px-4 text-sm`}>Cancel</button>
                <button type="submit" title="Submit New Post" className={`${primaryButtonStyles} py-2 px-4 text-sm`} disabled={isGeneratingImage}>Create Post</button>
            </div>
          </form>
      </Modal>

      {localPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {localPosts.map((postItem: Post) => (
            <PostCard
              key={postItem.id}
              post={postItem}
              onAddReaction={handleAddReaction}
              onDeletePost={handleDeletePostCard} 
              onEditPostRedirect={handleEditPostRedirect} 
              isOwner={(postItem.author === currentUser?.displayName && !!currentUser) || (currentUser?.role === 'admin')}
              currentUser={currentUser}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Edit3Icon className="w-16 h-16 text-brand-text-darker mx-auto mb-4" />
          <p className="text-xl text-brand-text-muted">No insights published yet.</p>
          <p className="text-sm text-brand-text-darker mt-1">{currentUser ? "Be the first to share one!" : "Log in to publish an insight."}</p>
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
