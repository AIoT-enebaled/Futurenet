
import React, { useState, useMemo } from 'react';
import DiscoverCard from '../components/DiscoverCard';
import { DISCOVER_ITEMS_DATA, DISCOVER_CATEGORIES } from '../constants';
import { DiscoverItem, DiscoverCategory } from '../types';
import { CompassIcon } from '../components/icons'; // Using CompassIcon

const DiscoverPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    if (!selectedCategory) {
      return DISCOVER_ITEMS_DATA;
    }
    return DISCOVER_ITEMS_DATA.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <CompassIcon className="w-10 h-10 text-brand-purple" />
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-text">Discover Central</h1>
            <p className="text-brand-text-muted text-sm sm:text-base">Explore curated content and innovations from the GiiT community.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 p-3 bg-brand-surface rounded-xl border border-brand-border/30 shadow-md">
        <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface
              ${!selectedCategory 
                ? 'bg-gradient-purple-pink text-white shadow-lg hover:shadow-glow-pink focus:ring-brand-purple' 
                : 'bg-brand-bg text-brand-text-muted hover:bg-brand-surface-alt hover:text-brand-text border border-brand-border focus:ring-brand-cyan'}`}
            aria-pressed={!selectedCategory}
        >
            All
        </button>
        {DISCOVER_CATEGORIES.map((category: DiscoverCategory) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out flex items-center transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface
              ${selectedCategory === category.id 
                ? 'bg-gradient-purple-pink text-white shadow-lg hover:shadow-glow-pink focus:ring-brand-purple' 
                : 'bg-brand-bg text-brand-text-muted hover:bg-brand-surface-alt hover:text-brand-text border border-brand-border focus:ring-brand-cyan'}`}
            aria-pressed={selectedCategory === category.id}
          >
            {category.icon && <category.icon className="w-4 h-4 mr-1.5 flex-shrink-0" />}
            {category.name}
          </button>
        ))}
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredItems.map((item: DiscoverItem) => (
            <DiscoverCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
            <CompassIcon className="w-16 h-16 text-brand-text-darker mx-auto mb-4" />
            <p className="text-xl text-brand-text-muted">No items found in "{DISCOVER_CATEGORIES.find(c=>c.id===selectedCategory)?.name || 'this category'}".</p>
            <p className="text-sm text-brand-text-darker mt-1">Try selecting another category or checking back later!</p>
        </div>
      )}
    </div>
  );
};

export default DiscoverPage;