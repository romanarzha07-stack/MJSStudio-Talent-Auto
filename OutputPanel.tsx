import React, { useState, useEffect, useMemo, useRef } from 'react';
import ErrorAlert from './ErrorAlert';
import type { SubjectInputType } from '../types';

// =================================================================
// START: New Image Preview Modal Component (and its dependencies)
// =================================================================
const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface ImagePreviewModalProps {
  src: string;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ src, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Focus the close button when the modal opens for accessibility
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-preview-title"
    >
      <div 
        className="relative max-w-[90vw] max-h-[90vh] p-4"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <h2 id="image-preview-title" className="sr-only">Pratinjau Gambar</h2>
        <img 
          src={src} 
          alt="Pratinjau gambar yang dibuat" 
          className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />
      </div>
      <button
        ref={closeButtonRef}
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white bg-black/30 rounded-full hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Tutup pratinjau gambar"
      >
        <XIcon className="w-6 h-6" />
      </button>
    </div>
  );
};
// ===============================================================
// END: New Image Preview Modal Component
// ===============================================================

// =================================================================
// START: New Image Edit Modal Component
// =================================================================
interface ImageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  prompt: string;
  setPrompt: (p: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}

const ImageEditModal: React.FC<ImageEditModalProps> = ({ isOpen, onClose, imageSrc, prompt, setPrompt, onSubmit, isLoading, error }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      textareaRef.current?.focus();
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-edit-title"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-bkg-light dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg m-4 flex flex-col max-h-[90vh]"
      >
        <header className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
          <h2 id="image-edit-title" className="text-lg font-bold">Edit Gambar Ajaib</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-primary-light dark:hover:bg-gray-700" aria-label="Tutup edit">
            <XIcon className="w-5 h-5" />
          </button>
        </header>
        <div className="p-4 flex-grow overflow-y-auto space-y-4">
          <div className="w-48 mx-auto rounded-lg overflow-hidden shadow-md">
            <img src={imageSrc} alt="Gambar untuk diedit" className="w-full h-full object-cover" />
          </div>
          <div>
            <label htmlFor="edit-prompt" className="block text-sm font-medium mb-2">Deskripsikan perubahan yang Anda inginkan:</label>
            <textarea
              ref={textareaRef}
              id="edit-prompt"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Contoh: tambahkan efek hujan, ubah suasana jadi malam hari, ganti warna baju jadi merah..."
              className="w-full p-2 border border-border-light dark:border-border-dark rounded-md bg-bkg-light dark:bg-gray-700 text-content-light dark:text-content-dark placeholder-gray-400 focus:ring-2 focus:ring-primary"
            />
          </div>
          {error && <div className="text-sm p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 rounded-md">{error}</div>}
        </div>
        <footer className="p-4 border-t border-border-light dark:border-border-dark flex justify-end gap-3">
          <button onClick={onClose} className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold transition-colors">Batal</button>
          <button
            onClick={onSubmit}
            disabled={isLoading || !prompt.trim()}
            className="py-2 px-4 rounded-lg bg-primary text-white hover:bg-primary-dark font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
            {isLoading ? 'Memproses...' : 'Terapkan Perubahan'}
          </button>
        </footer>
      </div>
    </div>
  );
};
// ===============================================================
// END: New Image Edit Modal Component
// ===============================================================


const LOADING_MESSAGES = [
    "Membuat mahakarya fashion Anda...",
    "Memanaskan kanvas digital...",
    "Mencampur palet warna...",
    "Membuat sketsa desain...",
    "Memfokuskan lensa...",
    "Merender detail akhir...",
];

// --- Helper Components & Functions for Download Action ---

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const ExpandIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 20.25v-4.5m0 4.5h-4.5m4.5 0L15 15m-6 0l-3.75 3.75M9 9l3.75-3.75M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9" />
    </svg>
);

const RegenerateIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0M2.985 19.644A8.25 8.25 0 0114.648 8.02l-3.182 3.182m0 0l-3.182-3.182m3.182 3.182L8.02 14.648" />
    </svg>
);

const MagicWandIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 00-1.622-3.385m-5.043-.025a15.998 15.998 0 01-3.388-1.621m-5.043.025a15.998 15.998 0 00-3.388 1.622m5.043-.025a15.998 15.998 0 01-1.622 3.385m-1.622 3.385a15.998 15.998 0 001.622 3.385m3.388-1.622a15.998 15.998 0 00-5.043.025z" />
    </svg>
);

const triggerDownload = (imageDataUri: string, prefix: string) => {
    if (!imageDataUri) return;
    const link = document.createElement('a');
    link.href = imageDataUri;
    const mimeType = imageDataUri.substring(imageDataUri.indexOf(":") + 1, imageDataUri.indexOf(";"));
    const extension = mimeType.split('/')[1] || 'png';
    link.download = `${prefix}-${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

interface ImageWithDownloadProps {
  src: string;
  alt: string;
  filenamePrefix: string;
  isLoading?: boolean;
  onPreview: () => void;
  onRegenerate: () => void;
  onEdit: () => void;
  tooltipText?: string;
}

const ImageWithDownload: React.FC<ImageWithDownloadProps> = ({ src, alt, filenamePrefix, isLoading = false, onPreview, onRegenerate, onEdit, tooltipText }) => {
  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerDownload(src, filenamePrefix);
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview();
  };

  const handleRegenerateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRegenerate();
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const aspectClass = 'aspect-[9/16]';

  return (
    <div className={`relative group w-full ${aspectClass} bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      
      {!isLoading && (
        <div 
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4" 
        >
          <div className="flex flex-col items-center gap-4 text-center">
            {tooltipText && (
              <div className="w-max max-w-full px-3 py-1.5 bg-black/70 text-white text-xs font-semibold rounded-md shadow-lg">
                {tooltipText}
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              <button
                className="p-3 bg-white/20 text-white rounded-full hover:bg-white/40 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label={`Pratinjau ${alt}`}
                onClick={handlePreviewClick}
              >
                <ExpandIcon className="w-7 h-7" />
              </button>
              <button
                className="p-3 bg-white/20 text-white rounded-full hover:bg-white/40 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label={`Unduh ${alt}`}
                onClick={handleDownloadClick}
              >
                <DownloadIcon className="w-7 h-7" />
              </button>
               <button
                className="p-3 bg-white/20 text-white rounded-full hover:bg-white/40 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label={`Edit ${alt}`}
                onClick={handleEditClick}
              >
                <MagicWandIcon className="w-7 h-7" />
              </button>
              <button
                className="p-3 bg-white/20 text-white rounded-full hover:bg-white/40 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label={`Buat Ulang ${alt}`}
                onClick={handleRegenerateClick}
              >
                <RegenerateIcon className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isLoading && (
         <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
             <LoadingIndicator />
         </div>
      )}
    </div>
  );
};


// --- Main Components ---

const LoadingIndicator: React.FC = () => {
    const [message, setMessage] = useState(LOADING_MESSAGES[0]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
            setMessage(LOADING_MESSAGES[messageIndex]);
        }, 2000);

        let progressValue = 0;
        const progressInterval = setInterval(() => {
            if (progressValue < 95) {
                const increment = Math.random() * (5 - (progressValue / 20)); // Slow down increment
                progressValue += Math.max(0.5, increment);
            }
            setProgress(Math.min(progressValue, 95));
        }, 250);

        return () => {
            clearInterval(messageInterval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <div className="text-center text-content-light dark:text-content-dark w-full max-w-xs p-4">
            <p className="mt-4 text-lg font-semibold h-12 flex items-center justify-center">{message}</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2 shadow-inner">
                <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-200 ease-linear"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={Math.round(progress)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Progres pembuatan"
                ></div>
            </div>
            <p className="text-sm mt-2 text-gray-500">{Math.round(progress)}%</p>
        </div>
    );
};

const MannequinViewer: React.FC<{ yaw: number; pitch: number }> = ({ yaw, pitch }) => {
    return (
        <div className="w-full h-48 flex items-center justify-center p-4" style={{ perspective: '1000px' }}>
            <div className="relative w-24 h-48" style={{ transformStyle: 'preserve-3d', transform: `rotateX(${-pitch}deg) rotateY(${yaw}deg)` }}>
                {/* Mannequin Body */}
                <div className="absolute w-16 h-40 bg-gray-300 dark:bg-gray-600 rounded-lg top-1/2 left-1/2" style={{ transform: 'translate(-50%, -50%)' }}></div>
                <div className="absolute w-8 h-8 bg-gray-400 dark:bg-gray-500 rounded-full top-4 left-1/2" style={{ transform: 'translateX(-50%)' }}></div>
                {/* Camera Icon orbiting the mannequin */}
                <div className="absolute top-1/2 left-1/2 w-8 h-8" style={{ transform: `translate(-50%, -50%) translateZ(150px)` }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};


const CameraAngleControl: React.FC<{
    onAngleChange: (prompt: string) => void;
    isAnglePreviewLoading: boolean;
    isRateLimited: boolean;
    lockoutSecondsRemaining: number;
    isDailyLimitReached: boolean;
}> = ({ onAngleChange, isAnglePreviewLoading, isRateLimited, lockoutSecondsRemaining, isDailyLimitReached }) => {
    const [yaw, setYaw] = useState(0);
    const [pitch, setPitch] = useState(0);

    const generatedPrompt = useMemo(() => {
        const getYawDescription = (y: number) => {
            const angle = (y + 360) % 360; // Normalize to 0-360
            if (angle > 337.5 || angle <= 22.5) return "from the front";
            if (angle > 22.5 && angle <= 67.5) return "from the front right";
            if (angle > 67.5 && angle <= 112.5) return "from the right side";
            if (angle > 112.5 && angle <= 157.5) return "from the back right";
            if (angle > 157.5 && angle <= 202.5) return "from behind";
            if (angle > 202.5 && angle <= 247.5) return "from the back left";
            if (angle > 247.5 && angle <= 292.5) return "from the left side";
            if (angle > 292.5 && angle <= 337.5) return "from the front left";
            return "";
        };

        const getPitchDescription = (p: number) => {
            if (p > 75) return ", from directly above (top-bottom view)";
            if (p > 45) return ", from a high angle";
            if (p > 15) return ", from slightly above";
            if (p < -75) return ", from directly below (bottom-up view)";
            if (p < -45) return ", from a low angle";
            if (p < -15) return ", from slightly below";
            return ", at eye-level";
        };
        
        const yawText = getYawDescription(yaw);
        const pitchText = getPitchDescription(pitch);

        return `Camera Perspective: The image should be a shot taken ${yawText}${pitchText}.`;
    }, [yaw, pitch]);
    
    const handleSubmit = () => {
        onAngleChange(generatedPrompt);
    };
    
    const getButtonTitle = () => {
        if (isDailyLimitReached) return "Batas request harian telah tercapai.";
        if (isRateLimited) return `Rate limit aktif. Tunggu ${lockoutSecondsRemaining} detik.`;
        if (isAnglePreviewLoading) return "Sedang memproses perubahan sudut...";
        return "Ganti sudut pandang kamera";
    };

    return (
        <div className="w-full p-4 bg-bkg-light dark:bg-gray-800 rounded-lg shadow-md space-y-4">
            <h3 className="text-lg font-semibold text-center text-content-light dark:text-content-dark">
                Kontrol Angle Kamera
            </h3>
            
            <MannequinViewer yaw={yaw} pitch={pitch} />

            <div className="space-y-4">
                <div>
                    <label htmlFor="yaw-slider" className="flex justify-between text-sm font-medium text-content-light dark:text-content-dark">
                        <span>Yaw (Horizontal)</span>
                        <span>{yaw}°</span>
                    </label>
                    <input
                        id="yaw-slider"
                        type="range"
                        min="-180"
                        max="180"
                        value={yaw}
                        onChange={(e) => setYaw(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        aria-label="Yaw angle control"
                    />
                </div>
                <div>
                    <label htmlFor="pitch-slider" className="flex justify-between text-sm font-medium text-content-light dark:text-content-dark">
                        <span>Pitch (Vertical)</span>
                        <span>{pitch}°</span>
                    </label>
                    <input
                        id="pitch-slider"
                        type="range"
                        min="-90"
                        max="90"
                        value={pitch}
                        onChange={(e) => setPitch(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        aria-label="Pitch angle control"
                    />
                </div>
            </div>
            
            <div className="text-center space-y-2">
                <p className="text-sm font-semibold text-content-light dark:text-content-dark">Pratinjau Prompt Sudut:</p>
                <p className="text-xs p-2 bg-primary-light dark:bg-gray-700 rounded border border-border-light dark:border-border-dark text-gray-500 dark:text-gray-400">
                    {generatedPrompt}
                </p>
            </div>
            
            <button
                onClick={handleSubmit}
                disabled={isAnglePreviewLoading || isRateLimited || isDailyLimitReached}
                className="w-full font-semibold py-2 px-3 rounded-lg transition-colors bg-primary text-white hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                title={getButtonTitle()}
            >
                {isAnglePreviewLoading ? (
                    <>
                        <span>Prose Ganti Angle...</span>
                        <div className="flex items-center justify-center gap-1.5 ml-2">
                            <span className="h-2 w-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 rounded-full bg-white animate-bounce"></span>
                        </div>
                    </>
                ) : isRateLimited ? (
                    `Tunggu (${lockoutSecondsRemaining}s)`
                ) : (
                    'Ganti Angle'
                )}
            </button>
        </div>
    );
};

interface OutputPanelProps {
    isLoading: boolean;
    generatedImages: string[] | null;
    activeVariationIndex: number;
    onSelectVariation: (index: number) => void;
    onRegenerate: () => void;
    onRegenerateVariation: (index: number) => void;
    regeneratingIndex: number | null;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onAngleChange: (prompt: string) => void;
    anglePreviewImage: string | null;
    isAnglePreviewLoading: boolean;
    anglePreviewPrompt: string | null;
    error: string | null;
    onDismissError: () => void;
    isRateLimited: boolean;
    lockoutSecondsRemaining: number;
    isDailyLimitReached: boolean;
    placeholderTitle?: string;
    placeholderSubtitle?: string;
    subjectInputType?: SubjectInputType;
    onInitiateEdit: (index: number) => void;
    isEditingImage: boolean;
    editPrompt: string;
    setEditPrompt: (p: string) => void;
    onApplyEdit: () => void;
    editError: string | null;
    editingImageInfo: { index: number, src: string } | null;
    setEditingImageInfo: (info: { index: number, src: string } | null) => void;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ 
    isLoading, 
    generatedImages,
    activeVariationIndex,
    onSelectVariation,
    onRegenerate,
    onRegenerateVariation,
    regeneratingIndex,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    onAngleChange,
    anglePreviewImage,
    isAnglePreviewLoading,
    anglePreviewPrompt,
    error,
    onDismissError,
    isRateLimited,
    lockoutSecondsRemaining,
    isDailyLimitReached,
    placeholderTitle = "Hasil Fashion Anda Akan Muncul di Sini",
    placeholderSubtitle = "Isi detail di kiri dan klik 'Buat Fashion' untuk memulai.",
    subjectInputType,
    onInitiateEdit,
    isEditingImage,
    editPrompt,
    setEditPrompt,
    onApplyEdit,
    editError,
    editingImageInfo,
    setEditingImageInfo,
}) => {
    const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);
    const baseButtonClasses = "font-bold py-2 px-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center";
    
    const getRegenerateButtonTitle = () => {
        if (isDailyLimitReached) return "Batas request harian telah tercapai.";
        if (isRateLimited) return `Rate limit aktif. Tunggu ${lockoutSecondsRemaining} detik.`;
        if (isLoading || regeneratingIndex !== null) return "Proses sedang berjalan...";
        return "Buat ulang semua variasi dengan pengaturan yang sama";
    };

    const tooltipText = useMemo(() => {
        if (subjectInputType === 'couple') {
            return 'maaf jika fashion yang dipakai terkadang ngaco ya hehehee.';
        }
        if (subjectInputType === 'text' || subjectInputType === 'photo') {
            return 'Jangan lupa follow Facebook MASJAWASYNDROM ya';
        }
        return undefined;
    }, [subjectInputType]);


    return (
        <div className="w-full lg:w-1/2 p-4 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
            {isLoading && !generatedImages && (
                <LoadingIndicator />
            )}
            
            {error && !generatedImages && (
                <ErrorAlert message={error} onDismiss={onDismissError} />
            )}

            {!isLoading && !generatedImages && !error && (
                <div className="text-center p-8 border-2 border-dashed border-border-light dark:border-border-dark rounded-lg">
                    <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">{placeholderTitle}</h2>
                    <p className="text-gray-500 mt-2">{placeholderSubtitle}</p>
                </div>
            )}

            {generatedImages && (
                <div className="w-full space-y-4 max-w-xl mx-auto">
                    {error && (
                        <ErrorAlert message={error} onDismiss={onDismissError} />
                    )}
                    <div className="p-2 bg-bkg-light dark:bg-gray-800 rounded-lg shadow-md">
                        <div className="flex justify-center gap-2 flex-wrap text-sm">
                            <button onClick={onUndo} disabled={isLoading || regeneratingIndex !== null || !canUndo} className={`${baseButtonClasses} bg-gray-500 hover:bg-gray-600 text-white`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-1">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                                </svg>
                                Urungkan
                            </button>
                             <button onClick={onRedo} disabled={isLoading || regeneratingIndex !== null || !canRedo} className={`${baseButtonClasses} bg-gray-500 hover:bg-gray-600 text-white`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-1">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
                                </svg>
                                Ulangi
                            </button>
                            <button 
                                onClick={onRegenerate} 
                                disabled={isLoading || regeneratingIndex !== null || isRateLimited || isDailyLimitReached} 
                                className={`${baseButtonClasses} bg-blue-500 hover:bg-blue-600 text-white`}
                                title={getRegenerateButtonTitle()}
                            >
                                {isLoading && regeneratingIndex === null ? (
                                    <>
                                        <span>Membuat Ulang...</span>
                                        <div className="flex items-center justify-center gap-1.5 ml-2">
                                            <span className="h-2 w-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="h-2 w-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="h-2 w-2 rounded-full bg-white animate-bounce"></span>
                                        </div>
                                    </>
                                ) : (
                                    'Buat Ulang'
                                )}
                            </button>
                        </div>
                    </div>

                    <div className={`grid gap-4 ${generatedImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {generatedImages.map((src, index) => (
                             <div 
                                key={index} 
                                className={`rounded-lg cursor-pointer transition-all duration-200 ${activeVariationIndex === index ? 'ring-4 ring-primary ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900' : ''}`}
                                onClick={() => onSelectVariation(index)}
                             >
                                <ImageWithDownload
                                    src={src}
                                    alt={`Variasi Fashion ${index + 1}`}
                                    filenamePrefix={`mjs-fashion-studio-${index + 1}`}
                                    isLoading={isLoading || regeneratingIndex === index}
                                    onPreview={() => setPreviewImageSrc(src)}
                                    onRegenerate={() => onRegenerateVariation(index)}
                                    onEdit={() => onInitiateEdit(index)}
                                    tooltipText={tooltipText}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Angle Controls */}
                    <CameraAngleControl 
                        onAngleChange={onAngleChange}
                        isAnglePreviewLoading={isAnglePreviewLoading}
                        isRateLimited={isRateLimited}
                        lockoutSecondsRemaining={lockoutSecondsRemaining}
                        isDailyLimitReached={isDailyLimitReached}
                    />

                    {/* Preview Section */}
                    {(isAnglePreviewLoading || anglePreviewImage) && (
                         <div className="mt-4 w-full space-y-2">
                             <h3 className="text-lg font-semibold text-center">Pratinjau Sudut</h3>
                            {isAnglePreviewLoading ? (
                                <div className={`relative w-full max-w-xs mx-auto aspect-[9/16] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg`}>
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <LoadingIndicator />
                                    </div>
                                </div>
                            ) : anglePreviewImage && (
                                <div className="max-w-xs mx-auto">
                                    <ImageWithDownload
                                        src={anglePreviewImage}
                                        alt="Pratinjau Sudut Kamera"
                                        filenamePrefix="mjs-fashion-angle-preview"
                                        onPreview={() => setPreviewImageSrc(anglePreviewImage)}
                                        onRegenerate={() => {}} // No-op for angle preview
                                        onEdit={() => {}} // No-op for angle preview
                                        tooltipText={tooltipText}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {previewImageSrc && (
                <ImagePreviewModal src={previewImageSrc} onClose={() => setPreviewImageSrc(null)} />
            )}
            {editingImageInfo && (
              <ImageEditModal
                isOpen={!!editingImageInfo}
                onClose={() => setEditingImageInfo(null)}
                imageSrc={editingImageInfo.src}
                prompt={editPrompt}
                setPrompt={setEditPrompt}
                onSubmit={onApplyEdit}
                isLoading={isEditingImage}
                error={editError}
              />
            )}
        </div>
    );
};