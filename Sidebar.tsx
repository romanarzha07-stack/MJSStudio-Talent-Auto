import React from 'react';
import type { Page } from '../App';

const CreativeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const AutoImageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

const TalentIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentPage, onNavigate }) => {
  const handleNavigation = (page: Page) => {
    onNavigate(page);
    onClose();
  };

  const linkClasses = "flex items-center gap-3 p-3 rounded-lg text-lg font-semibold transition-colors";
  const activeClasses = "bg-primary-light dark:bg-gray-700 text-primary-dark dark:text-primary-light";
  const inactiveClasses = "text-content-light dark:text-content-dark hover:bg-primary-light/50 dark:hover:bg-gray-700/50";

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
        data-testid="sidebar-backdrop"
      />
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-bkg-light dark:bg-bkg-dark shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <div className="p-4 flex items-center justify-between border-b border-border-light dark:border-border-dark">
          <h2 id="sidebar-title" className="text-xl font-bold text-content-light dark:text-content-dark">Menu</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-primary-light dark:hover:bg-gray-700" aria-label="Close menu">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); handleNavigation('mjsstudio-creative'); }} 
                className={`${linkClasses} ${currentPage === 'mjsstudio-creative' ? activeClasses : inactiveClasses}`}
                aria-current={currentPage === 'mjsstudio-creative' ? 'page' : undefined}
              >
                <CreativeIcon className="w-6 h-6" />
                MJSSTUDIO CREATIVE
              </a>
            </li>
            <li>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); handleNavigation('auto-image'); }} 
                className={`${linkClasses} ${currentPage === 'auto-image' ? activeClasses : inactiveClasses}`}
                aria-current={currentPage === 'auto-image' ? 'page' : undefined}
              >
                <AutoImageIcon className="w-6 h-6" />
                MJS Visual Creator
              </a>
            </li>
            <li>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); handleNavigation('mjstalent-automodel'); }} 
                className={`${linkClasses} ${currentPage === 'mjstalent-automodel' ? activeClasses : inactiveClasses}`}
                aria-current={currentPage === 'mjstalent-automodel' ? 'page' : undefined}
              >
                <TalentIcon className="w-6 h-6" />
                MJSTalent AutoModel
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
