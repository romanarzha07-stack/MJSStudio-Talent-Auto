import React from 'react';

// Simple XIcon for the close button
const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div 
      className="w-full max-w-xl mx-auto my-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg flex items-start justify-between" 
      role="alert"
    >
      <div>
        <h3 className="font-bold">Kesalahan</h3>
        <p>{message}</p>
      </div>
      <button 
        onClick={onDismiss} 
        className="p-1 rounded-full hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Tutup pesan kesalahan"
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ErrorAlert;