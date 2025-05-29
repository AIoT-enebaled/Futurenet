
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { Post, Comment as CommentType, User, SinglePostPageProps } from '../types'; 
import { GUEST_AVATAR_URL } from '../constants';
import { HeartIcon, ThumbsUpIcon, MessageCircleIcon, EditIcon, Trash2Icon, ChevronLeftIcon, SendCommentIcon, UserCircleIcon as AvatarPlaceholder } from '../components/icons'; 
import LoadingSpinner from '../components/LoadingSpinner';
import EditPostModal from '../components/EditPostModal'; 

const SinglePostPage: React.FC<SinglePostPageProps> = ({ currentUser, posts, onUpdatePost, onDeletePost }) => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const location = useLocation(); // For checking query params
  
  const [post, setPost] = useState<Post | null | undefined>(undefined); 
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null); 
  const [newReply, setNewReply] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const foundPost = posts.find(p => p.id === postId);
    setPost(foundPost ? {...foundPost} : null); // Simulate async load if needed, or just set

    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('edit') === 'true' && foundPost && ((currentUser && foundPost.author === currentUser.displayName) || currentUser?.role === 'admin')) {
      setIsEditModalOpen(true);
      // Optionally remove the query param after opening modal
      navigate(location.pathname, { replace: true });
    }

  }, [postId, posts, currentUser, location.search, location.pathname, navigate]);


  const handleReaction = (reactionType: 'heart' | 'thumbsUp' | 'fire' | 'clap') => {
    if (!currentUser) {
      alert("Please log in to react to this post.");
      return;
    }
    if (!post) return;
    
    const updatedReactions = {
        ...post.reactions,
        [reactionType]: (post.reactions[reactionType] || 0) + 1,
    };
    onUpdatePost(post.id, { reactions: updatedReactions });
    setPost(prevPost => prevPost ? { ...prevPost, reactions: updatedReactions } : null);
  };
  
  const handleCommentSubmit = (e: React.FormEvent, parentCommentId?: string) => {
    e.preventDefault();
    const commentText = parentCommentId ? newReply : newComment;

    if (!commentText.trim() || !post || !currentUser) return;

    const newCommentData: CommentType = {
      id: `cmt-${Date.now()}`,
      author: currentUser.displayName,
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
      avatarUrl: currentUser.avatarUrl || GUEST_AVATAR_URL,
      replies: []
    };

    const addReplyRecursive = (comments: CommentType[], targetId: string, reply: CommentType): CommentType[] => {
      return comments.map(comment => {
        if (comment.id === targetId) {
          return { ...comment, replies: [...(comment.replies || []), reply] };
        }
        if (comment.replies && comment.replies.length > 0) {
          return { ...comment, replies: addReplyRecursive(comment.replies, targetId, reply) };
        }
        return comment;
      });
    };
    
    let updatedComments: CommentType[];
    if (parentCommentId) {
        updatedComments = addReplyRecursive(post.comments || [], parentCommentId, newCommentData);
        setNewReply('');
        setReplyTo(null);
    } else {
        updatedComments = [...(post.comments || []), newCommentData];
        setNewComment('');
    }
    onUpdatePost(post.id, { comments: updatedComments });
    setPost(prevPost => prevPost ? { ...prevPost, comments: updatedComments } : null);
  };

  const isPostOwner = currentUser && post && (post.author === currentUser.displayName || currentUser.role === 'admin');

  const handleDeleteClick = () => {
    if (!post || !isPostOwner) return;
    if (window.confirm(`Are you sure you want to delete the post "${post.title}"? This action cannot be undone.`)) {
      onDeletePost(post.id);
      navigate('/blog');
    }
  };

  const handlePostUpdate = (updatedData: Partial<Post>) => {
    if(!post) return;
    onUpdatePost(post.id, updatedData);
    // Update local post state immediately for responsiveness
    setPost(prev => prev ? {...prev, ...updatedData} : null);
    setIsEditModalOpen(false);
  };

  const commonInputStyles = "block w-full px-3.5 py-2.5 bg-brand-bg border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple sm:text-sm text-brand-text placeholder-brand-text-muted transition-colors";

  if (post === undefined) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner message="Loading post..." /></div>;
  }

  if (!post) {
    return (
      <div className="text-center p-8 sm:p-12 bg-brand-surface rounded-xl shadow-2xl border border-brand-border/30">
        <h1 className="text-2xl font-bold text-brand-text mb-3">Post Not Found</h1>
        <p className="text-brand-text-muted mb-6">The insight you are looking for does not exist or may have been removed.</p>
        <Link to="/blog" className="inline-flex items-center px-6 py-2.5 bg-gradient-purple-pink text-white font-semibold rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105">
          <ChevronLeftIcon className="w-5 h-5 mr-1.5" /> Back to Insights
        </Link>
      </div>
    );
  }
  
  const renderComments = (comments: CommentType[], level = 0): JSX.Element[] => {
    return comments.map(comment => (
      <div key={comment.id} className={`py-3.5 ${level > 0 ? `ml-${level * 3} sm:ml-${level * 5} pl-3 sm:pl-4 border-l-2 border-brand-border/20` : ''}`}>
        <div className="flex items-start space-x-3">
          {comment.avatarUrl ? (
            <img 
              src={comment.avatarUrl} 
              alt={comment.author} 
              className="w-8 h-8 rounded-full object-cover mt-0.5 flex-shrink-0 border-2 border-brand-border/40"
            />
          ) : (
            <AvatarPlaceholder className="w-8 h-8 rounded-full text-brand-text-muted mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1">
            <div className="bg-brand-bg/70 rounded-lg p-3 border border-brand-border/30 shadow-sm">
              <p className="text-sm font-semibold text-brand-text">{comment.author}</p>
              <p className="text-sm text-brand-text-muted whitespace-pre-wrap break-words">{comment.text}</p>
            </div>
            <div className="text-xs text-brand-text-darker mt-1.5 flex items-center space-x-3">
              <span>{new Date(comment.createdAt).toLocaleString([], {dateStyle: 'short', timeStyle: 'short'})}</span>
              {currentUser && <button onClick={() => { setReplyTo(comment.id); setNewReply(''); }} className="hover:underline text-brand-cyan transition-colors">Reply</button>}
            </div>
          </div>
        </div>
        {replyTo === comment.id && currentUser && (
          <form onSubmit={(e) => handleCommentSubmit(e, comment.id)} className={`mt-3 ml-${(level + 1) * 2} sm:ml-${(level + 1) * 4} flex items-center space-x-2`}>
             <img 
                src={currentUser.avatarUrl || GUEST_AVATAR_URL} 
                alt="Your avatar" 
                className="w-7 h-7 rounded-full object-cover flex-shrink-0 border-2 border-brand-border/40"
            />
            <input
              type="text"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder={`Reply to ${comment.author}...`}
              className={`flex-grow p-2 text-sm rounded-md ${commonInputStyles} `}
              aria-label={`Reply to ${comment.author}`}
            />
            <button type="submit" className="p-2.5 bg-brand-purple text-white rounded-md hover:bg-brand-pink disabled:opacity-60 transition-colors" disabled={!newReply.trim()} aria-label="Send reply">
              <SendCommentIcon className="w-4 h-4" />
            </button>
          </form>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2.5">
            {renderComments(comment.replies, level + 1)}
          </div>
        )}
      </div>
    ));
  };


  return (
    <div className="max-w-4xl mx-auto bg-brand-surface shadow-2xl rounded-xl overflow-hidden my-4 sm:my-6 border border-brand-border/30">
      <div className="p-4 sm:p-6">
        <button onClick={() => navigate('/blog')} className="mb-4 inline-flex items-center text-sm text-brand-cyan hover:text-brand-pink hover:underline transition-colors font-medium">
          <ChevronLeftIcon className="w-5 h-5 mr-1" /> Back to Insights
        </button>
      </div>

      {post.imageUrl && <img className="w-full h-64 md:h-96 object-cover border-y border-brand-border/20" src={post.imageUrl} alt={post.title} />}
      
      <article className="p-5 sm:p-6 md:p-8">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-text mb-2 break-words leading-tight">{post.title}</h1>
          {post.subtitle && <p className="text-lg sm:text-xl text-brand-text-muted mb-3 break-words">{post.subtitle}</p>}
          <div className="flex flex-wrap items-center justify-between text-sm text-brand-text-darker">
            <div>
              <span>By <strong className="text-brand-text-muted font-medium">{post.author}</strong></span> | <span>{new Date(post.createdAt).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            {isPostOwner && (
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <button onClick={() => setIsEditModalOpen(true)} title="Edit Post" className="p-1.5 rounded-full hover:bg-brand-surface-alt text-brand-text-muted hover:text-brand-cyan transition-colors">
                  <EditIcon className="w-4 h-4" />
                </button>
                <button onClick={handleDeleteClick} title="Delete Post" className="p-1.5 rounded-full hover:bg-brand-surface-alt text-brand-text-muted hover:text-brand-pink transition-colors">
                  <Trash2Icon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </header>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-brand-bg text-brand-text-muted rounded-full text-xs font-semibold border border-brand-border/40">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div 
          className="prose prose-lg dark:prose-invert max-w-none text-brand-text-muted leading-relaxed whitespace-pre-line break-words
                     prose-headings:text-brand-text prose-a:text-brand-cyan hover:prose-a:text-brand-pink prose-strong:text-brand-text
                     prose-blockquote:border-brand-purple prose-blockquote:text-brand-text-muted
                     prose-code:bg-brand-bg prose-code:text-brand-pink prose-code:p-1 prose-code:rounded-md prose-code:text-sm prose-code:border prose-code:border-brand-border/50
                     prose-ul:list-disc prose-ul:marker:text-brand-purple prose-li:my-1
                     prose-img:rounded-lg prose-img:border prose-img:border-brand-border/30 prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: post.body.replace(/(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/)([a-zA-Z0-9_-]+))/g, (match, p1, p2) => {
            if (p1.includes('youtube.com') || p1.includes('youtu.be')) {
              return `<div class="aspect-video my-4 rounded-lg overflow-hidden border border-brand-border/30 shadow-lg"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/${p2}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
            } else if (p1.includes('vimeo.com')) {
              return `<div class="aspect-video my-4 rounded-lg overflow-hidden border border-brand-border/30 shadow-lg"><iframe src="https://player.vimeo.com/video/${p2}" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
            }
            return match; 
          }).replace(/\n/g, '<br />') }}
        >
        </div>

        <hr className="my-8 border-brand-border/40" />

        <div className="flex items-center justify-start space-x-5 sm:space-x-6 mb-8">
            <button 
                onClick={() => handleReaction('heart')} 
                disabled={!currentUser}
                title={!currentUser ? "Log in to react" : "Heart"}
                className={`flex items-center text-sm text-brand-text-muted transition-colors group ${!currentUser ? 'cursor-not-allowed opacity-60' : 'hover:text-brand-pink'}`}
            >
                <HeartIcon className={`w-5 h-5 mr-1.5 ${currentUser && post.reactions.heart ? 'fill-brand-pink text-brand-pink' : 'text-brand-text-darker group-hover:text-brand-pink'}`} /> {post.reactions.heart || 0}
            </button>
            <button 
                onClick={() => handleReaction('thumbsUp')}
                disabled={!currentUser}
                title={!currentUser ? "Log in to react" : "Thumbs Up"}
                className={`flex items-center text-sm text-brand-text-muted transition-colors group ${!currentUser ? 'cursor-not-allowed opacity-60' : 'hover:text-brand-cyan'}`}
            >
                <ThumbsUpIcon className={`w-5 h-5 mr-1.5 ${currentUser && post.reactions.thumbsUp ? 'fill-brand-cyan text-brand-cyan' : 'text-brand-text-darker group-hover:text-brand-cyan'}`} /> {post.reactions.thumbsUp || 0}
            </button>
        </div>
        
        <section aria-labelledby="comments-title" id="comments">
          <h2 id="comments-title" className="text-xl sm:text-2xl font-semibold text-brand-text mb-5 flex items-center">
            <MessageCircleIcon className="w-6 h-6 inline mr-2.5 text-brand-purple flex-shrink-0" />
            Comments ({post.comments?.reduce((acc, comment) => acc + 1 + (comment.replies?.length || 0), 0) || 0})
          </h2>

          {currentUser ? (
            <form onSubmit={handleCommentSubmit} className="mb-6 flex items-start space-x-3">
              <img 
                  src={currentUser.avatarUrl || GUEST_AVATAR_URL} 
                  alt="Your avatar" 
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0 border-2 border-brand-border/40"
              />
              <div className="flex-1">
                  <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts..."
                      rows={3}
                      className={`${commonInputStyles} `}
                      aria-label="Write a comment"
                  />
                  <button 
                      type="submit" 
                      className="mt-2.5 px-5 py-2 bg-gradient-purple-pink text-white text-sm font-semibold rounded-md shadow-md hover:shadow-glow-pink disabled:opacity-60 transition-all duration-300 transform hover:scale-105"
                      disabled={!newComment.trim()}
                  >
                      Post Comment
                  </button>
              </div>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-brand-bg/70 rounded-md text-center border border-brand-border/40">
              <p className="text-brand-text-muted">
                Please <Link to="/login" className="text-brand-cyan hover:underline font-semibold">log in</Link> or <Link to="/register" className="text-brand-cyan hover:underline font-semibold">register</Link> to post a comment.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {post.comments && post.comments.length > 0 
              ? renderComments(post.comments.slice().sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())) // Show newest comments first
              : <p className="text-brand-text-muted">No comments yet. {currentUser ? "Be the first to comment!" : ""}</p>
            }
          </div>
        </section>
      </article>
      {isEditModalOpen && post && (
        <EditPostModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            post={post}
            onUpdatePost={handlePostUpdate}
        />
      )}
    </div>
  );
};

export default SinglePostPage;