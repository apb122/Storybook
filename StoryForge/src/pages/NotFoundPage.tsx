import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-950 text-gray-100">
      <h1 className="text-6xl font-bold text-indigo-500 mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">Page not found</p>
      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};
