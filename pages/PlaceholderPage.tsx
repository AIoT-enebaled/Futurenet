import React from 'react';
import { Link } from 'react-router-dom'; // Corrected import
import { BookOpenIcon } from '../components/icons'; // Generic icon

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <BookOpenIcon className="w-24 h-24 text-primary-400 dark:text-primary-500 mb-8" />
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{title}</h1>
      {description && (
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          {description}
        </p>
      )}
      <p className="text-gray-500 dark:text-gray-500">
        This section is currently under construction. Check back soon for updates!
      </p>
      <Link
        to="/home"
        className="mt-8 px-6 py-2 bg-primary-500 text-white font-semibold rounded-lg shadow hover:bg-primary-600 transition-colors"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default PlaceholderPage;