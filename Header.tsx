import React, { useState, useEffect } from 'react';
import type { Theme } from '../types';
import type { Page } from '../App';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
  onMenuClick: () => void;
  title: string;
  currentPage: Page;
  onNavigateHome: () => void;
}

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, onMenuClick, title, currentPage, onNavigateHome }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`
      sticky top-0 z-30 py-4 px-6 text-center relative border-b transition-all duration-300
      ${isScrolled 
        ? 'bg-bkg-light/80 dark:bg-bkg-dark/80 backdrop-blur-sm border-border-light dark:border-border-dark' 
        : 'bg-bkg-light dark:bg-bkg-dark border-transparent'
      }
    `}>
      <div className="absolute top-1/2 left-4 -translate-y-1/2 flex items-center gap-2">
         <button
          onClick={onMenuClick}
          className="p-2 rounded-full bg-primary-light dark:bg-border-dark text-primary-dark dark:text-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-bkg-dark"
          aria-label="Open menu"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        {currentPage !== 'mjsstudio-creative' && (
          <button
            onClick={onNavigateHome}
            className="p-2 rounded-full bg-primary-light dark:bg-border-dark text-primary-dark dark:text-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-bkg-dark"
            aria-label="Go to Home"
          >
            <HomeIcon className="w-6 h-6" />
          </button>
        )}
      </div>
      <h1 className="text-xl md:text-2xl font-bold text-content-light dark:text-content-dark">
        {title}
      </h1>
      <div className="absolute top-1/2 right-4 -translate-y-1/2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-primary-light dark:bg-border-dark text-primary-dark dark:text-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-bkg-dark"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
      </div>
    </header>
  );
};

export default Header;