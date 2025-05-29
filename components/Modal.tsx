


import React, { useEffect } from 'react';
import { XIcon } from './icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'; // Added more sizes
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-bg/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose} 
    >
      <div 
        className={`bg-brand-surface rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out w-full ${sizeClasses[size]} border border-brand-border/50 animate-scale-up`}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-brand-border/40 bg-brand-surface-alt/30 rounded-t-xl">
          <h3 id="modal-title" className="text-lg font-semibold text-brand-text">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-brand-text-muted bg-transparent hover:bg-brand-bg hover:text-brand-pink rounded-lg text-sm p-1.5 ml-auto inline-flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-brand-pink"
            aria-label="Close modal"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;