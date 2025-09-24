import React from 'react';

interface FooterProps {
  processName: string | null;
  lastRequestCost: number;
  remainingRpm: number;
  remainingRpd: number;
  rpmQuota: number;
  rpdQuota: number;
  isRateLimited: boolean;
  lockoutSecondsRemaining: number;
  isDailyLimitReached: boolean;
}

const Footer: React.FC<FooterProps> = ({ 
  processName, 
  lastRequestCost,
  remainingRpm,
  remainingRpd,
  rpmQuota,
  rpdQuota,
  isRateLimited,
  lockoutSecondsRemaining,
  isDailyLimitReached,
}) => {

  return (
    <footer className="py-4 px-6 text-center border-t border-border-light dark:border-border-dark mt-auto space-y-3">
      {processName && (
        <p className="text-sm font-semibold text-content-light dark:text-content-dark mb-1 animate-pulse">
          Proses: {processName}
        </p>
      )}

      {lastRequestCost > 0 && (
        <div className="text-sm text-content-light dark:text-content-dark">
          <p>Biaya Proses Terakhir: <span className="font-semibold">{lastRequestCost} Panggilan API</span></p>
        </div>
      )}

      <div className="w-full max-w-md mx-auto p-3 bg-primary-light dark:bg-gray-800 rounded-lg shadow-inner text-xs">
        <div className="flex justify-around items-center gap-2">
          <div className="text-center">
            <div className="font-bold text-content-light dark:text-content-dark">RPM Tersisa</div>
            <div className={`font-semibold ${remainingRpm > 0 ? 'text-gray-600 dark:text-gray-400' : 'text-red-500'}`}>{remainingRpm} / {rpmQuota}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-content-light dark:text-content-dark">RPD Sesi Tersisa</div>
            <div className={`font-semibold ${remainingRpd > 0 ? 'text-gray-600 dark:text-gray-400' : 'text-red-500'}`}>{remainingRpd.toLocaleString()} / {rpdQuota.toLocaleString()}</div>
          </div>
          <div className="text-center font-semibold">
            {isDailyLimitReached ? (
              <div className="text-yellow-600 dark:text-yellow-400">
                <div>Batas Harian</div>
                <div>Tercapai</div>
              </div>
            ) : isRateLimited ? (
              <div className="text-red-500">
                <div>Limit</div>
                <div>{lockoutSecondsRemaining}s</div>
              </div>
            ) : (
              <div className="text-green-500">
                <div>Status</div>
                <div>Siap</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm text-content-light dark:text-content-dark">
          Developer: 
          <a 
            href="https://m.facebook.com/RomanArzha/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-semibold text-primary hover:underline"
          >
            Masjawasyndrom
          </a>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Klik Masjawasyndrom untuk lapor bug
        </p>
      </div>
    </footer>
  );
};

export default Footer;