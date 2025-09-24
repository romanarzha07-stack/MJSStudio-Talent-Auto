import React, { useEffect, useState } from 'react';

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onDismiss, duration = 6000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300); // Wait for fade-out animation
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, duration, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };
  
  if (!message && !isVisible) return null;

  return (
    <div 
        aria-live="assertive"
        className={`fixed inset-0 flex items-center justify-center p-4 pointer-events-none z-50`}
    >
      <div
        className={`
          max-w-sm w-full bg-gray-800 text-white dark:bg-primary-light dark:text-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden
          transition-all duration-300 ease-in-out
          ${isVisible ? 'transform opacity-100 scale-100' : 'transform opacity-0 scale-95'}
        `}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-semibold">
                Pesan Developer
              </p>
              <p className="mt-1 text-sm opacity-90">
                {message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={handleDismiss}
                className="rounded-md inline-flex text-gray-300 dark:text-gray-500 hover:text-white dark:hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-primary-light"
                aria-label="Close"
              >
                <span className="sr-only">Close</span>
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;