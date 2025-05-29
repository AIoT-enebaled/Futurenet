
import React from 'react';
import { DiscoverItem } from '../types';
import { DISCOVER_CATEGORIES } from '../constants';

interface DiscoverCardProps {
  item: DiscoverItem;
}

const DiscoverCard: React.FC<DiscoverCardProps> = ({ item }) => {
  const category = DISCOVER_CATEGORIES.find(cat => cat.id === item.category);

  return (
    <div className="bg-brand-surface rounded-xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-glow-cyan transform hover:-translate-y-1 border border-brand-border/30 hover:border-brand-cyan/40">
      <img className="w-full h-48 object-cover" src={item.imageUrl} alt={item.title} />
      <div className="p-5">
        {category && (
            <div className="flex items-center mb-2.5">
                {category.icon && <category.icon className="w-4 h-4 mr-2 text-brand-cyan flex-shrink-0" />}
                <span className="text-xs font-semibold text-brand-cyan uppercase tracking-wider">{category.name}</span>
            </div>
        )}
        <h3 className="text-lg font-semibold text-brand-text mb-1.5 line-clamp-2" title={item.title}>{item.title}</h3>
        <p className="text-brand-text-muted text-sm mb-3.5 leading-relaxed line-clamp-3">{item.description}</p>
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3.5">
            {item.tags.map(tag => (
              <span key={tag} className="px-2.5 py-0.5 bg-brand-bg text-brand-text-muted rounded-full text-xs font-medium border border-brand-border/40">
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center text-xs text-brand-text-darker pt-3 border-t border-brand-border/20">
            {item.author && <span className="truncate">By {item.author}</span>}
            {item.createdAt && <span className="flex-shrink-0">{new Date(item.createdAt).toLocaleDateString()}</span>}
        </div>
      </div>
    </div>
  );
};

export default DiscoverCard;