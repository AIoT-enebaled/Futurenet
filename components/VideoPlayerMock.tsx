
import React from 'react';
import { MOCK_YOUTUBE_VIDEO_ID, MOCK_VIMEO_VIDEO_ID } from '../constants';
import { VideoIcon, PlayCircleIcon } from './icons';

interface VideoPlayerMockProps {
  videoUrl?: string; // Expects full YouTube or Vimeo URL, or a specific ID
  title?: string;
}

const VideoPlayerMock: React.FC<VideoPlayerMockProps> = ({ videoUrl, title }) => {
  let videoId: string | null = null;
  let platform: 'youtube' | 'vimeo' | 'other' | null = null;

  if (videoUrl) {
    if (videoUrl.includes('youtube.com/watch?v=') || videoUrl.includes('youtu.be/')) {
      const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      videoId = match ? match[1] : MOCK_YOUTUBE_VIDEO_ID;
      platform = 'youtube';
    } else if (videoUrl.includes('vimeo.com/')) {
      const match = videoUrl.match(/vimeo\.com\/(\d+)/);
      videoId = match ? match[1] : MOCK_VIMEO_VIDEO_ID;
      platform = 'vimeo';
    } else if (/^[a-zA-Z0-9_-]{11}$/.test(videoUrl)) { // Assume YouTube ID if just an ID
        videoId = videoUrl;
        platform = 'youtube';
    } else if (/^\d+$/.test(videoUrl)) { // Assume Vimeo ID if just numbers
        videoId = videoUrl;
        platform = 'vimeo';
    } else {
        platform = 'other'; // Generic video link
    }
  } else { // Default to a mock YouTube video if no URL
    videoId = MOCK_YOUTUBE_VIDEO_ID;
    platform = 'youtube';
  }

  const embedUrl = platform === 'youtube' 
    ? `https://www.youtube.com/embed/${videoId}`
    : platform === 'vimeo' 
    ? `https://player.vimeo.com/video/${videoId}`
    : videoUrl; // For 'other' or if videoId extraction failed but full URL exists

  if (platform === 'other' && videoUrl) {
    return (
        <div className="aspect-video bg-brand-bg rounded-lg border border-brand-border/30 flex flex-col items-center justify-center p-4 text-center">
            <VideoIcon className="w-12 h-12 text-brand-text-muted mb-3" />
            <p className="text-brand-text font-semibold mb-1">{title || 'Video Content'}</p>
            <p className="text-xs text-brand-text-muted mb-3">This video is hosted on an external platform.</p>
            <a 
                href={videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-brand-cyan text-white text-sm font-medium rounded-md hover:bg-opacity-80 transition-colors"
            >
                <PlayCircleIcon className="w-4 h-4 mr-2" /> Watch Video
            </a>
        </div>
    );
  }
  
  return (
    <div className="aspect-video bg-brand-bg rounded-lg overflow-hidden border border-brand-border/30 shadow-lg">
      {videoId && (platform === 'youtube' || platform === 'vimeo') ? (
        <iframe
          width="100%"
          height="100%"
          src={embedUrl}
          title={title || 'Course Video Lecture'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-brand-bg text-brand-text-muted">
            <VideoIcon className="w-12 h-12 mr-2"/> Video content unavailable or an error occurred.
        </div>
      )}
    </div>
  );
};

export default VideoPlayerMock;
