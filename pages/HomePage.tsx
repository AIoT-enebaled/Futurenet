


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// FIX: Added Course to import for HomePageProps
import { User, PricingTier, SubscriptionTier, Course } from '../types';
import { StarIcon, CheckCircleIcon } from '../components/icons';
import GoProModal from '../components/GoProModal';


interface PricingCardProps {
  tier: PricingTier;
  isAnnual: boolean;
  onGetStarted: (tierId: SubscriptionTier | 'contact_sales') => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ tier, isAnnual, onGetStarted }) => {
  const price = isAnnual && tier.priceAnnually ? tier.priceAnnually : tier.priceMonthly;
  return (
    <div className={`bg-brand-surface p-6 rounded-xl shadow-2xl border border-brand-border/30 flex flex-col ${tier.isPopular ? 'border-brand-purple shadow-glow-purple relative ring-2 ring-brand-purple' : 'hover:shadow-glow-cyan hover:border-brand-cyan/40 transform hover:-translate-y-1 transition-all duration-300'}`}>
      {tier.isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-purple-pink text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-semibold text-brand-text mb-2">{tier.name}</h3>
      <div className="mb-5">
        <span className="text-4xl font-extrabold text-brand-text">{price}</span>
        <span className="text-brand-text-muted">/{isAnnual ? 'year' : 'month'}</span>
        {isAnnual && tier.annualDiscountText && (
            <p className="text-xs text-green-400 mt-1">{tier.annualDiscountText}</p>
        )}
      </div>
      <ul className="space-y-2.5 mb-8 flex-grow">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start text-sm text-brand-text-muted">
            <CheckCircleIcon className="w-4 h-4 mr-2 mt-0.5 text-green-400 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onGetStarted(tier.tierId)}
        className={`w-full mt-auto py-3 px-6 font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface
          ${tier.isPopular ? 'bg-gradient-purple-pink text-white hover:shadow-glow-pink focus:ring-brand-purple' 
                          : 'bg-brand-surface-alt text-brand-text border-2 border-brand-cyan/50 hover:border-brand-cyan hover:shadow-glow-cyan focus:ring-brand-cyan'}`}
      >
        {tier.ctaText}
      </button>
    </div>
  );
};

interface HomePageProps {
    currentUser: User | null;
    onSubscribePro: (tier: SubscriptionTier) => void;
    courses: Course[];
}

const HomePage: React.FC<HomePageProps> = ({ currentUser, onSubscribePro, courses }) => {
  const [isAnnualPricing, setIsAnnualPricing] = useState(false);
  const [isGoProModalOpen, setIsGoProModalOpen] = useState(false);
  const [selectedTierForModal, setSelectedTierForModal] = useState<SubscriptionTier>('pro_individual');


  const pricingTiers: PricingTier[] = [
    {
      name: 'Free Explorer',
      priceMonthly: '$0',
      features: [
        'Basic community access',
        'Public chat channels',
        'View projects & posts',
        'Limited direct messaging',
      ],
      ctaText: 'Get Started',
      tierId: 'free',
    },
    {
      name: 'Pro Innovator',
      priceMonthly: '$10',
      priceAnnually: '$99',
      annualDiscountText: 'Save 17% annually!',
      features: [
        'All Free features, plus:',
        'GiiT GenAI Assistant Access',
        'Priority support',
        'Unlimited direct & group messaging',
        'Create private projects & teams',
        'Advanced analytics (mock)',
        'Pro Member Badge',
      ],
      ctaText: 'Upgrade to Pro',
      tierId: 'pro_individual',
      isPopular: true,
    },
    {
      name: 'Team Accelerator',
      priceMonthly: 'Custom',
      features: [
        'All Pro features, plus:',
        'GenAI access for all team members',
        'Centralized team billing',
        'Team management tools',
        'Bulk license management',
        'Dedicated onboarding support',
      ],
      ctaText: 'Contact Sales',
      tierId: 'contact_sales',
    },
  ];

  const handlePricingCtaClick = (tierId: SubscriptionTier | 'contact_sales') => {
    if (tierId === 'free') {
      // Navigate to register or dashboard if logged in
      // For now, just log
      console.log("Selected Free tier");
      // Potentially navigate('/register') or navigate('/dashboard')
    } else if (tierId === 'pro_individual' || tierId === 'pro_team') {
      setSelectedTierForModal(tierId);
      setIsGoProModalOpen(true);
    } else if (tierId === 'contact_sales') {
      alert("Mock: You would be redirected to a sales contact form or Calendly link for Team Accelerator plan.");
    }
  };
  
  const handleActualSubscription = (tier: SubscriptionTier) => {
      onSubscribePro(tier); // Call the App.tsx function to update user state
      setIsGoProModalOpen(false);
  };


  return (
    <div className="space-y-20 pb-10">
      {/* Hero Section */}
      <div className="text-center py-12 px-6 md:py-20 md:px-10 bg-brand-surface rounded-2xl shadow-2xl border border-brand-border/20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan mb-6 animate-gradient-x-homepage">
          Welcome to the GiiT FutureNet!
        </h1>
        
        <p className="text-lg md:text-xl text-brand-text-muted mb-10 max-w-3xl mx-auto leading-relaxed">
          Connect, collaborate, and innovate with the brightest minds at the Genius Institute of Information Technology. 
          Explore new horizons, chat with our AI, and build the future, together.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-6 flex flex-col sm:flex-row justify-center items-center">
          <Link
            to="/discover"
            className="px-8 py-3.5 bg-gradient-purple-pink text-white font-semibold rounded-lg shadow-xl hover:shadow-glow-pink transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-brand-surface text-base md:text-lg"
          >
            Explore Discoveries
          </Link>
          <Link
            to={currentUser?.is_pro_user ? "/chat" : "#"} // Link to chat if Pro, else could open modal
            onClick={() => !currentUser?.is_pro_user && setIsGoProModalOpen(true)}
            className="px-8 py-3.5 bg-brand-surface-alt text-brand-text font-semibold rounded-lg shadow-xl hover:bg-opacity-80 border-2 border-brand-cyan/50 hover:border-brand-cyan hover:shadow-glow-cyan transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:ring-offset-2 focus:ring-offset-brand-surface text-base md:text-lg flex items-center"
          >
            Engage GiiT AI
            {!currentUser?.is_pro_user && <StarIcon className="w-4 h-4 ml-2 text-yellow-400" />}
          </Link>
        </div>
        <div className="mt-16 md:mt-20 p-6 md:p-8 bg-brand-bg/50 rounded-xl border border-brand-border/30 shadow-inner">
          <h2 className="text-2xl md:text-3xl font-semibold text-brand-text mb-4">What is GiiT?</h2>
          <p className="text-brand-text-muted md:text-lg leading-relaxed">
              The Genius Institute of Information Technology (GiiT) is at the forefront of tech education, dedicated to nurturing innovation and cultivating excellence. 
              This FutureNet platform is your dynamic space to interact with peers, access cutting-edge resources, and engage with our intelligent AI assistant for insights and support.
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-text mb-4">Flexible Plans for Everyone</h2>
          <p className="text-lg text-brand-text-muted max-w-2xl mx-auto">
            Choose the GiiT FutureNet plan that best suits your needs, from exploring freely to unlocking powerful Pro features.
          </p>
          <div className="mt-8 flex justify-center items-center space-x-2">
            <span className={`font-medium ${!isAnnualPricing ? 'text-brand-purple' : 'text-brand-text-muted'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnualPricing(!isAnnualPricing)}
              aria-pressed={isAnnualPricing}
              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-brand-purple ${isAnnualPricing ? 'bg-brand-purple' : 'bg-brand-border'}`}
            >
              <span className="sr-only">Use setting</span>
              <span aria-hidden="true" className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${isAnnualPricing ? 'translate-x-5' : 'translate-x-0'}`}></span>
            </button>
            <span className={`font-medium ${isAnnualPricing ? 'text-brand-purple' : 'text-brand-text-muted'}`}>Annually</span>
            {isAnnualPricing && <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Save up to 17%!</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
            <PricingCard 
              key={tier.name} 
              tier={tier} 
              isAnnual={isAnnualPricing}
              onGetStarted={handlePricingCtaClick} 
            />
          ))}
        </div>
      </section>
      <GoProModal 
        isOpen={isGoProModalOpen}
        onClose={() => setIsGoProModalOpen(false)}
        onSubscribe={() => handleActualSubscription(selectedTierForModal)} // Pass only the selected tier
        featureName="GiiT AI Assistant & Pro Features"
      />
    </div>
  );
};

export default HomePage;