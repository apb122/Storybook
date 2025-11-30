import { useEffect, useRef } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useStoryStore } from '@/state/store';

function App() {
  const isDirtyRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsub = useStoryStore.subscribe(() => {
      isDirtyRef.current = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // Debounce is 1000ms, so we wait 2000ms to be safe
      timeoutRef.current = setTimeout(() => {
        isDirtyRef.current = false;
      }, 2000);
    });

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      unsub();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
