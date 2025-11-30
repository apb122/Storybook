import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export const ErrorBoundary: React.FC = () => {
  const error = useRouteError();

  let errorMessage: string;
  let errorTitle: string;

  if (isRouteErrorResponse(error)) {
    // Handle specific HTTP errors
    errorTitle = `${error.status} ${error.statusText}`;
    errorMessage = error.data?.message || 'Something went wrong.';

    if (error.status === 404) {
      errorTitle = 'Page Not Found';
      errorMessage = "The page you're looking for doesn't exist or has been moved.";
    }
  } else if (error instanceof Error) {
    // Handle Javascript errors
    errorTitle = 'Application Error';
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorTitle = 'Error';
    errorMessage = error;
  } else {
    errorTitle = 'Unknown Error';
    errorMessage = 'An unexpected error occurred.';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sf-bg p-4">
      <div className="max-w-md w-full bg-sf-surface border border-sf-border rounded-lg shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-sf-danger/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-sf-danger" />
        </div>

        <h1 className="text-2xl font-bold text-sf-text mb-2">{errorTitle}</h1>
        <p className="text-sf-text-muted mb-8">{errorMessage}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>
          <Link to="/app/dashboard" className="btn-primary flex items-center justify-center gap-2">
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {import.meta.env.DEV && error instanceof Error && (
          <div className="mt-8 text-left">
            <details className="text-xs text-sf-text-muted bg-sf-bg p-4 rounded border border-sf-border overflow-auto max-h-48">
              <summary className="cursor-pointer font-medium mb-2">Stack Trace</summary>
              <pre className="whitespace-pre-wrap font-mono">{error.stack}</pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};
