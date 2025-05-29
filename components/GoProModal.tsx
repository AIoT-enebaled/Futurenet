
import React from 'react';
import Modal from './Modal';
import { StarIcon, CheckCircleIcon } from './icons';
import { SubscriptionTier } from '../types';

interface GoProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (tier: SubscriptionTier) => void; // To handle mock subscription
  featureName?: string; // Optional: specific feature user tried to access
}

const GoProModal: React.FC<GoProModalProps> = ({ isOpen, onClose, onSubscribe, featureName }) => {
  const proFeatures = [
    "Access to GiiT GenAI Assistant",
    "Advanced Project Collaboration Tools",
    "Priority Support",
    "Enhanced Analytics (for Admins/Team Leads)",
    "Exclusive Content & Workshops",
    "Increased Storage (Mock)",
  ];

  const handleSubscribeClick = (tier: SubscriptionTier) => {
    onSubscribe(tier);
    onClose(); // Close modal after "subscribing"
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Unlock GiiT Pro Features!" size="lg">
      <div className="space-y-6 text-center">
        <StarIcon className="w-16 h-16 text-yellow-400 mx-auto" />
        <h3 className="text-2xl font-semibold text-brand-text">
          {featureName ? `Upgrade to Pro to use ${featureName}!` : "Go Pro with GiiT FutureNet!"}
        </h3>
        <p className="text-brand-text-muted">
          Elevate your GiiT experience with our Pro subscription. Get exclusive access to powerful tools and features designed to boost your productivity and collaboration.
        </p>

        <div className="text-left bg-brand-bg/50 p-4 rounded-lg border border-brand-border/40">
          <h4 className="text-md font-semibold text-brand-text mb-2">Pro Benefits Include:</h4>
          <ul className="space-y-1.5">
            {proFeatures.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-brand-text-muted">
                <CheckCircleIcon className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        <p className="text-xs text-brand-text-darker">
          Choose a plan that works for you. For team/group subscriptions, please contact sales (mock).
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
          <button
            onClick={() => handleSubscribeClick('pro_individual')}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-purple-pink text-white font-semibold rounded-lg shadow-lg hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface"
          >
            Upgrade to Pro (Individual)
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-brand-text-muted bg-brand-surface-alt hover:bg-opacity-80 rounded-lg shadow-sm border border-brand-border hover:border-brand-purple/50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GoProModal;
