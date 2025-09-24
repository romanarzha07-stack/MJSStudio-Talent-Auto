import React, { useEffect } from 'react';
import type { Page } from '../App';

const CustomCreativityIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 4C22.059 4 14 12.059 14 22C14 28.528 18.02 34.05 24 36.417V42H28V48H36V42H40V36.417C45.98 34.05 50 28.528 50 22C50 12.059 41.941 4 32 4Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
        <path d="M28 52H36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M32 2V0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M50 14L52 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 14L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8"/>
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

interface MJSStudioCreativePageProps {
  updateFooter: (status: object) => void;
  onNavigate: (page: Page) => void;
}

const MJSStudioCreativePage: React.FC<MJSStudioCreativePageProps> = ({ updateFooter, onNavigate }) => {
  useEffect(() => {
    updateFooter({ processName: null, lastRequestCost: 0 });
  }, [updateFooter]);

  const navButtons = [
    { page: 'auto-image', label: 'MJS Visual Creator', icon: AutoImageIcon },
    { page: 'mjstalent-automodel', label: 'MJSTalent AutoModel', icon: TalentIcon },
  ];

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-full max-w-4xl space-y-12">
        
        <section className="space-y-4">
          <CustomCreativityIcon className="w-20 h-20 mx-auto text-primary" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-content-light dark:text-content-dark">
            Selamat Datang di MJSstudio Creative
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Gerbang Anda menuju kreativitas tanpa batas. Kami senang Anda ada di sini! Silakan jelajahi semua alat yang tersedia, bereksperimen sesuka hati, dan nikmati proses mewujudkan visi Anda menjadi nyata dengan kekuatan AI.
          </p>
          <div className="pt-4">
            <button 
              onClick={() => onNavigate('auto-image')}
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold text-lg rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              Mulai Berkreasi
            </button>
          </div>
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            {navButtons.map(({ page, label, icon: Icon }) => (
              <button 
                key={page}
                onClick={() => onNavigate(page as Page)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-light dark:bg-gray-700 text-primary-dark dark:text-primary-light rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="border-t border-border-light dark:border-border-dark w-1/4 mx-auto"></div>
        
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div
            className="bg-primary-light dark:bg-gray-800 p-6 rounded-lg shadow-inner text-center"
          >
            <div>
              <h2 className="text-xl font-bold">Hi, Saya Masjawasyndrom</h2>
              <p className="mt-2 text-content-light dark:text-content-dark">
                Aplikasi ini dikembangkan dengan penuh semangat. Tujuannya adalah untuk menyediakan alat bantu kreatif yang kuat dan mudah diakses bagi semua orang. Terima kasih telah mendukung proyek ini!
              </p>
            </div>
          </div>
          
          <div className="bg-primary-light dark:bg-gray-800 p-6 rounded-lg shadow-inner text-center">
             <h2 className="text-xl font-bold">Terhubung & Beri Masukan</h2>
             <p className="mt-2 text-content-light dark:text-content-dark">
              Punya ide, menemukan bug, atau hanya ingin menyapa? Ikuti perkembangan terbaru dan jadilah bagian dari komunitas kami.
             </p>
             <p className="mt-4 text-center font-semibold">
                ikuti Facebook kami
             </p>
             <a 
                href="https://web.facebook.com/RomanArzha/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-2 w-full block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                MASJAWASYNDROM
             </a>
          </div>
        </section>
      </div>
    </main>
  );
};

export default MJSStudioCreativePage;
