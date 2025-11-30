console.log('🚀 [StoryForge] Starting application...');
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { ErrorBoundary } from 'react-error-boundary';

function Fallback({ error }: { error: Error }) {
  return (
    <div role="alert" style={{ padding: '20px', color: 'red' }}>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <pre>{error.stack}</pre>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={Fallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
