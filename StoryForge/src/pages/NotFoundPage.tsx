import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-sf-bg text-sf-text">
      <h1 className="text-6xl font-bold text-sf-text-muted mb-4">404</h1>
      <p className="text-xl text-sf-text mb-8">Page not found</p>
      <Link to="/" className="btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
};
