import React, { useState, useEffect, useCallback } from 'react';
import type { Theme } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import AutoImagePage from './pages/AutoImagePage';
import MJSTalentAutoModelPage from './pages/MJSTalentAutoModelPage';
import MJSStudioCreativePage from './pages/MJSStudioCreativePage';

const RPM_QUOTA = 15;
const RPD_QUOTA = 1500;

export type Page = 'mjsstudio-creative' | 'auto-image' | 'mjstalent-automodel';

function App() {
  // Global UI State
  const [theme, setTheme] = useState<Theme>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('mjsstudio-creative');

  // Shared Footer State
  const [footerState, setFooterState] = useState({
    processName: null,
    lastRequestCost: 0,
    remainingRpm: RPM_QUOTA,
    remainingRpd: RPD_QUOTA,
    isRateLimited: false,
    lockoutSecondsRemaining: 0,
    isDailyLimitReached: false,
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleNavigateHome = () => {
    setCurrentPage('mjsstudio-creative');
  };
  
  const updateFooter = useCallback((updates: object) => {
      setFooterState(prevState => ({ ...prevState, ...updates }));
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
        case 'mjsstudio-creative':
            return <MJSStudioCreativePage updateFooter={updateFooter} onNavigate={handleNavigate} />;
        case 'auto-image':
            return <AutoImagePage updateFooter={updateFooter} />;
        case 'mjstalent-automodel':
            return <MJSTalentAutoModelPage updateFooter={updateFooter} />;
        default:
            return <MJSStudioCreativePage updateFooter={updateFooter} onNavigate={handleNavigate} />;
    }
  }

  const headerTitle =
    currentPage === 'mjsstudio-creative' ? "MJSstudio Creative" :
    currentPage === 'auto-image' ? "MJS Visual Creator" :
    currentPage === 'mjstalent-automodel' ? "MJSTalent AutoModel" :
    "MJS STUDIO AI"; // Fallback title

  return (
    <div className="min-h-screen flex flex-col bg-bkg-light dark:bg-bkg-dark text-content-light dark:text-content-dark font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={toggleSidebar} 
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onMenuClick={toggleSidebar} 
        title={headerTitle} 
        currentPage={currentPage}
        onNavigateHome={handleNavigateHome}
      />
      
      {renderCurrentPage()}

      <Footer 
        processName={footerState.processName} 
        lastRequestCost={footerState.lastRequestCost}
        remainingRpm={footerState.remainingRpm}
        remainingRpd={footerState.remainingRpd}
        rpmQuota={RPM_QUOTA}
        rpdQuota={RPD_QUOTA}
        isRateLimited={footerState.isRateLimited}
        lockoutSecondsRemaining={footerState.lockoutSecondsRemaining}
        isDailyLimitReached={footerState.isDailyLimitReached}
      />
    </div>
  );
}

export default App;
