

import React, { useState, useEffect, useCallback } from 'react';
import { generateVisualCreatorImage } from '../services/geminiService';
import ErrorAlert from '../components/ErrorAlert';
import type { WatermarkPosition } from '../types';

interface AutoImagePageProps {
  updateFooter: (status: object) => void;
}

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const ExpandIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 20.25v-4.5m0 4.5h-4.5m4.5 0L15 15m-6 0l-3.75 3.75M9 9l3.75-3.75M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9" />
    </svg>
);

const triggerDownload = (imageDataUri: string, index: number) => {
    if (!imageDataUri) return;
    const link = document.createElement('a');
    link.href = imageDataUri;
    const mimeType = imageDataUri.substring(imageDataUri.indexOf(":") + 1, imageDataUri.indexOf(";"));
    const extension = mimeType.split('/')[1] || 'png';
    link.download = `mjs-visual-creator-${index}-${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

interface ImagePreviewModalProps {
  src: string;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ src, onClose }) => {
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-w-[90vw] max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt="Pratinjau gambar yang dibuat" className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
      </div>
      <button
        ref={closeButtonRef}
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white bg-black/30 rounded-full hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Tutup pratinjau"
      >
        <XIcon className="w-6 h-6" />
      </button>
    </div>
  );
};


const GENERATING_MESSAGES = [
    "Menggabungkan gambar referensi...",
    "Melukis dengan piksel...",
    "Merender mahakarya Anda...",
    "Memberi sentuhan akhir...",
    "Visi Anda hampir menjadi nyata...",
];

const VisualCreatorLoadingIndicator: React.FC = () => {
    const messages = GENERATING_MESSAGES;
    const [message, setMessage] = useState(messages[0]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            setMessage(messages[messageIndex]);
        }, 2500);

        let progressValue = 0;
        const progressInterval = setInterval(() => {
            const target = 98;
            if (progressValue < target) {
                const increment = Math.random() * (2 - (progressValue / 50));
                progressValue += Math.max(0.2, increment);
            }
            setProgress(Math.min(progressValue, target));
        }, 250);

        return () => {
            clearInterval(messageInterval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <div className="text-center text-content-light dark:text-content-dark w-full max-w-sm p-4 animate-fade-in">
            <h3 className="text-xl font-bold text-primary mb-4">
                Membuat...
            </h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2 shadow-inner overflow-hidden">
                <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-200 ease-linear"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={Math.round(progress)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Proses pembuatan"
                ></div>
            </div>
            <p className="text-sm mt-2 text-gray-500 font-semibold">{Math.round(progress)}%</p>
            <p className="mt-4 text-lg font-semibold h-12 flex items-center justify-center transition-opacity duration-300">
                {message}
            </p>
        </div>
    );
};
const UploadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
);

interface ImageUploaderProps {
    label: string;
    image: { file: File, preview: string } | null;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    isCircular?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, image, onFileChange, onRemove, isCircular = false }) => {
    const inputId = `file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`;
    const baseClasses = "relative group flex flex-col items-center justify-center bg-primary-light dark:bg-gray-800 border-2 border-dashed border-border-light dark:border-border-dark hover:border-primary transition-all duration-300 cursor-pointer";
    const shapeClasses = isCircular ? "rounded-full w-32 h-32" : "rounded-lg w-full h-32";

    return (
        <div className="flex flex-col items-center gap-2 w-full">
            <h4 className="font-semibold text-sm text-content-light dark:text-content-dark">{label}</h4>
            <div className={`${baseClasses} ${shapeClasses}`}>
                <input type="file" id={inputId} className="hidden" accept="image/*" onChange={onFileChange} />
                {image ? (
                    <>
                        <img 
                            src={image.preview} 
                            alt={`Pratinjau ${label}`}
                            className={`object-cover w-full h-full ${isCircular ? 'rounded-full' : 'rounded-lg'}`}
                        />
                        <button 
                            onClick={(e) => { e.stopPropagation(); onRemove(); }}
                            className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Hapus gambar ${label}`}
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <label htmlFor={inputId} className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-gray-500 group-hover:text-primary">
                        <UploadIcon className="w-8 h-8 mb-1" />
                        <span className="text-xs text-center">{image?.file.name ?? "Klik untuk mengunggah"}</span>
                    </label>
                )}
            </div>
             {!isCircular && image && <span className="text-xs text-gray-400 truncate w-40 text-center">{image.file.name}</span>}
        </div>
    );
};

interface WatermarkSettingsProps {
    isWatermarkEnabled: boolean;
    setIsWatermarkEnabled: (enabled: boolean) => void;
    watermarkText: string;
    setWatermarkText: (text: string) => void;
    watermarkOpacity: number;
    setWatermarkOpacity: (opacity: number) => void;
    watermarkPosition: WatermarkPosition;
    setWatermarkPosition: (position: WatermarkPosition) => void;
}

const WatermarkSettings: React.FC<WatermarkSettingsProps> = ({
    isWatermarkEnabled, setIsWatermarkEnabled,
    watermarkText, setWatermarkText,
    watermarkOpacity, setWatermarkOpacity,
    watermarkPosition, setWatermarkPosition
}) => {
    const positions: WatermarkPosition[] = [
        'top-left', 'top-center', 'top-right',
        'middle-left', 'middle-center', 'middle-right',
        'bottom-left', 'bottom-center', 'bottom-right'
    ];
    
    const PositionIcon: React.FC<{position: WatermarkPosition}> = ({ position }) => {
        const [y, x] = position.split('-');
        const cx = x === 'left' ? '4.5' : x === 'center' ? '8' : '11.5';
        const cy = y === 'top' ? '4.5' : y === 'middle' ? '8' : '11.5';
        return (
             <svg viewBox="0 0 16 16" className="w-full h-full">
                <rect x="2" y="2" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1" rx="1"/>
                <circle cx={cx} cy={cy} r="1.5" fill="currentColor"/>
            </svg>
        )
    }

    return (
        <details className="p-4 bg-primary-light dark:bg-gray-800 rounded-lg shadow-inner group">
            <summary className="font-semibold text-content-light dark:text-content-dark cursor-pointer list-none flex justify-between items-center">
                Pengaturan Watermark
                <svg className="w-5 h-5 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="mt-4 space-y-4 animate-fade-in">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isWatermarkEnabled}
                        onChange={(e) => setIsWatermarkEnabled(e.target.checked)}
                        className="form-checkbox h-5 w-5 rounded text-primary focus:ring-primary-dark"
                    />
                    <span className="font-medium text-sm text-content-light dark:text-content-dark">Aktifkan Watermark</span>
                </label>
                <div className={!isWatermarkEnabled ? 'opacity-50 pointer-events-none' : ''}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="watermark-text" className="block text-sm font-medium mb-1 text-content-light dark:text-content-dark">Teks Watermark</label>
                            <input
                                id="watermark-text"
                                type="text"
                                value={watermarkText}
                                onChange={(e) => setWatermarkText(e.target.value)}
                                className="w-full p-2 border border-border-light dark:border-border-dark rounded-md bg-bkg-light dark:bg-gray-700 text-content-light dark:text-content-dark"
                            />
                        </div>
                        <div>
                            <label htmlFor="watermark-opacity" className="flex justify-between text-sm font-medium mb-1 text-content-light dark:text-content-dark">
                                <span>Opacity</span>
                                <span>{Math.round(watermarkOpacity * 100)}%</span>
                            </label>
                            <input
                                id="watermark-opacity"
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={watermarkOpacity}
                                onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-content-light dark:text-content-dark">Posisi</label>
                            <div className="grid grid-cols-3 gap-2 max-w-[150px]">
                                {positions.map(pos => (
                                    <button
                                        key={pos}
                                        onClick={() => setWatermarkPosition(pos)}
                                        className={`p-2 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-primary ${watermarkPosition === pos ? 'bg-primary text-white border-primary-dark' : 'bg-bkg-light dark:bg-gray-700 border-border-light dark:border-border-dark hover:border-primary'}`}
                                        title={pos.replace('-', ' ')}
                                    >
                                        <PositionIcon position={pos} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </details>
    )
};


interface InputPanelProps {
    faceImage: { file: File, preview: string } | null;
    outfitImage: { file: File, preview:string } | null;
    backgroundImage: { file: File, preview: string } | null;
    prompt: string;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'face' | 'outfit' | 'background') => void;
    onRemove: (type: 'face' | 'outfit' | 'background') => void;
    setPrompt: (prompt: string) => void;
    onGenerate: () => void;
    onRegenerate: () => void;
    isLoading: boolean;
    watermarkSettings: WatermarkSettingsProps;
    isRateLimited: boolean;
    lockoutSecondsRemaining: number;
    isDailyLimitReached: boolean;
    isLocked: boolean;
    hasGenerated: boolean;
    onReset: () => void;
    numberOfVariations: number;
    setNumberOfVariations: (num: number) => void;
}

const InputPanel: React.FC<InputPanelProps> = (props) => {
    const { onGenerate, onRegenerate, isLoading, prompt, watermarkSettings, isRateLimited, lockoutSecondsRemaining, isDailyLimitReached, isLocked, hasGenerated, onReset, numberOfVariations, setNumberOfVariations } = props;
    const canGenerate = prompt.trim().length > 0 && (props.faceImage || props.outfitImage || props.backgroundImage);
    
    const getButtonTitle = () => {
        if (isDailyLimitReached) return "Batas request harian telah tercapai.";
        if (isRateLimited) return `Rate limit aktif. Tunggu ${lockoutSecondsRemaining} detik.`;
        if (isLocked) return "Input terkunci. Klik 'Atur Ulang' atau 'Buat Ulang' untuk melanjutkan.";
        if (!canGenerate) {
            return "Harap isi prompt dan unggah setidaknya satu gambar referensi.";
        }
        return "Buat Gambar";
    };

    const getRegenerateButtonTitle = () => {
        if (isDailyLimitReached) return "Batas request harian telah tercapai.";
        if (isRateLimited) return `Rate limit aktif. Tunggu ${lockoutSecondsRemaining} detik.`;
        if (isLoading) return "Proses sedang berjalan...";
        return "Buat ulang dengan input yang sama";
    };

    return (
        <div className="w-full lg:w-1/2 p-4 space-y-4 overflow-y-auto">
            <fieldset disabled={isLocked} className="space-y-4">
                <div className="p-4 bg-primary-light dark:bg-gray-800 rounded-lg shadow-inner">
                     <ImageUploader label="Referensi Wajah" image={props.faceImage} onFileChange={(e) => props.onFileChange(e, 'face')} onRemove={() => props.onRemove('face')} isCircular />
                </div>
                <div className="p-4 bg-primary-light dark:bg-gray-800 rounded-lg shadow-inner">
                     <ImageUploader label="Referensi Outfit" image={props.outfitImage} onFileChange={(e) => props.onFileChange(e, 'outfit')} onRemove={() => props.onRemove('outfit')} />
                </div>
                <div className="p-4 bg-primary-light dark:bg-gray-800 rounded-lg shadow-inner">
                     <ImageUploader label="Referensi Background" image={props.backgroundImage} onFileChange={(e) => props.onFileChange(e, 'background')} onRemove={() => props.onRemove('background')} />
                </div>

                <div className="p-4 bg-primary-light dark:bg-gray-800 rounded-lg shadow-inner">
                    <label htmlFor="prompt" className="font-semibold text-content-light dark:text-content-dark">Masukkan Prompt</label>
                    <textarea
                        id="prompt"
                        value={props.prompt}
                        onChange={(e) => props.setPrompt(e.target.value)}
                        rows={8}
                        className="mt-2 w-full p-3 bg-bkg-light dark:bg-gray-700 border border-border-light dark:border-border-dark rounded-md text-content-light dark:text-content-dark placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition"
                        placeholder="Contoh: 'Potret poster sinematik cahaya rendah untuk seorang pemuda Sunda 23 tahun, rambut pendek rapi, mengenakan kaos hitam dan jaket denim...'"
                    />
                </div>

                <div className="p-4 bg-primary-light dark:bg-gray-800 rounded-lg shadow-inner">
                    <h3 className="font-semibold mb-3 text-content-light dark:text-content-dark">Variasi</h3>
                    <div className="flex justify-around items-center text-content-light dark:text-content-dark">
                        {[1, 2, 3, 4].map(num => (
                            <label key={num} className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                                <input
                                    type="radio"
                                    name="variations-auto"
                                    value={num}
                                    checked={numberOfVariations === num}
                                    onChange={() => setNumberOfVariations(num)}
                                    className="form-radio text-primary dark:bg-gray-600 border-gray-500"
                                />
                                <span className="font-medium">{num}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <WatermarkSettings {...watermarkSettings} />
            </fieldset>

            <div className="pt-4 sticky bottom-0 bg-bkg-light dark:bg-bkg-dark py-2">
                 <button 
                    onClick={onGenerate}
                    disabled={isLoading || !canGenerate || isRateLimited || isDailyLimitReached || isLocked}
                    className={`w-full bg-primary hover:bg-primary-dark text-white font-bold text-lg py-3 px-4 rounded-lg transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${isLoading && !hasGenerated ? 'bg-primary/80 animate-pulse' : 'disabled:bg-gray-400'}`}
                    title={getButtonTitle()}
                >
                    {isLoading && !hasGenerated ? (
                        <>
                            <span>Membuat...</span>
                            <div className="flex items-center justify-center gap-1.5 ml-2">
                                <span className="h-2 w-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 rounded-full bg-white animate-bounce"></span>
                            </div>
                        </>
                    ) : isRateLimited ? (
                        `Tunggu (${lockoutSecondsRemaining}s)`
                    ) : 'Buat Gambar'}
                </button>
                {hasGenerated && (
                    <>
                        <button
                            onClick={onRegenerate}
                            disabled={isLoading || isRateLimited || isDailyLimitReached}
                            className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                            title={getRegenerateButtonTitle()}
                        >
                            {isLoading ? (
                                <>
                                    <span>Membuat Ulang...</span>
                                    <div className="flex items-center justify-center gap-1.5 ml-2">
                                        <span className="h-2 w-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="h-2 w-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="h-2 w-2 rounded-full bg-white animate-bounce"></span>
                                    </div>
                                </>
                            ) : 'Buat Ulang'}
                        </button>
                        <button
                            onClick={onReset}
                            className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
                        >
                            Atur Ulang
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

interface ImageCardProps {
  src: string;
  index: number;
  onPreview: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ src, index, onPreview }) => {
    const aspectClass = 'aspect-[9/16]';

    return (
        <div className={`group relative w-full ${aspectClass} bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg`}>
            <img src={src} alt={`Visual yang dibuat ${index + 1}`} className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <button
                    className="p-3 bg-white/20 text-white rounded-full hover:bg-white/40 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Pratinjau gambar"
                    onClick={onPreview}
                >
                    <ExpandIcon className="w-8 h-8" />
                </button>
                <button
                    className="p-3 bg-white/20 text-white rounded-full hover:bg-white/40 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Unduh gambar"
                    onClick={() => triggerDownload(src, index + 1)}
                >
                    <DownloadIcon className="w-8 h-8" />
                </button>
            </div>
        </div>
    );
};


interface OutputPanelProps {
    isLoading: boolean;
    error: string | null;
    onDismissError: () => void;
    generatedImages: string[] | null;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ isLoading, error, onDismissError, generatedImages }) => {
    const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);

    return (
        <div className="w-full lg:w-1/2 p-4 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
            {isLoading && !generatedImages && (
                <VisualCreatorLoadingIndicator />
            )}
            {error && <ErrorAlert message={error} onDismiss={onDismissError} />}
            {!isLoading && !generatedImages && !error && (
                <div className="text-center p-8 border-2 border-dashed border-border-light dark:border-border-dark rounded-lg">
                    <h2 className="text-xl font-semibold text-content-light dark:text-content-dark">MJS Visual Creator</h2>
                    <p className="text-gray-500 mt-2">Gambar buatan Anda akan muncul di sini.</p>
                </div>
            )}
            {generatedImages && (
                <div className="w-full max-w-2xl mx-auto animate-fade-in space-y-4">
                     <div className={`grid gap-4 ${generatedImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {generatedImages.map((src, index) => (
                            <ImageCard
                                key={src.slice(-20) + index}
                                src={src}
                                index={index}
                                onPreview={() => setPreviewImageSrc(src)}
                            />
                        ))}
                    </div>
                </div>
            )}
            {previewImageSrc && (
                <ImagePreviewModal src={previewImageSrc} onClose={() => setPreviewImageSrc(null)} />
            )}
        </div>
    );
};

const RPM_QUOTA = 15;
const RPD_QUOTA = 1500;
const PROACTIVE_COOLDOWN_MS = 5000;
const RATE_LIMIT_COOLDOWN_MS = 61000;

interface GenerationArgs {
    faceFile: File | null;
    outfitFile: File | null;
    backgroundFile: File | null;
    prompt: string;
    numberOfVariations: number;
    isWatermarkEnabled: boolean;
    watermarkText: string;
    watermarkOpacity: number;
    watermarkPosition: WatermarkPosition;
}

const AutoImagePage: React.FC<AutoImagePageProps> = ({ updateFooter }) => {
  const [faceImage, setFaceImage] = useState<{ file: File, preview: string } | null>(null);
  const [outfitImage, setOutfitImage] = useState<{ file: File, preview: string } | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<{ file: File, preview: string } | null>(null);
  const [prompt, setPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [numberOfVariations, setNumberOfVariations] = useState(1);
  const [isWatermarkEnabled, setIsWatermarkEnabled] = useState(true);
  const [watermarkText, setWatermarkText] = useState('MJSSTUDIO');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.6);
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>('bottom-center');
  const [requestTimestamps, setRequestTimestamps] = useState<number[]>([]);
  const [sessionRequestCount, setSessionRequestCount] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [rateLimitLockoutUntil, setRateLimitLockoutUntil] = useState<number | null>(null);
  const [lockoutSecondsRemaining, setLockoutSecondsRemaining] = useState(0);
  const [lastGenerationArgs, setLastGenerationArgs] = useState<GenerationArgs | null>(null);

  const handleReset = useCallback(() => {
    if (faceImage) URL.revokeObjectURL(faceImage.preview);
    if (outfitImage) URL.revokeObjectURL(outfitImage.preview);
    if (backgroundImage) URL.revokeObjectURL(backgroundImage.preview);
    setFaceImage(null);
    setOutfitImage(null);
    setBackgroundImage(null);
    setPrompt("");
    setGeneratedImages(null);
    setError(null);
    setIsLocked(false);
    setNumberOfVariations(1);
    setLastGenerationArgs(null);
    updateFooter({ processName: null, lastRequestCost: 0 });
  }, [faceImage, outfitImage, backgroundImage, updateFooter]);

  useEffect(() => {
    return () => {
        if (faceImage) URL.revokeObjectURL(faceImage.preview);
        if (outfitImage) URL.revokeObjectURL(outfitImage.preview);
        if (backgroundImage) URL.revokeObjectURL(backgroundImage.preview);
    }
  }, [faceImage, outfitImage, backgroundImage]);

  useEffect(() => {
      updateFooter({
          remainingRpm: Math.max(0, RPM_QUOTA - rpm),
          remainingRpd: Math.max(0, RPD_QUOTA - sessionRequestCount),
          isRateLimited: lockoutSecondsRemaining > 0,
          lockoutSecondsRemaining: lockoutSecondsRemaining,
          isDailyLimitReached: sessionRequestCount >= RPD_QUOTA,
      });
  }, [rpm, sessionRequestCount, lockoutSecondsRemaining, updateFooter]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const oneMinuteAgo = now - 60000;
      const recentTimestamps = requestTimestamps.filter(ts => ts > oneMinuteAgo);
      setRpm(recentTimestamps.length);

      let rpmLockoutEnd = 0;
      if (recentTimestamps.length >= RPM_QUOTA) {
        const oldestRequest = recentTimestamps[0];
        rpmLockoutEnd = oldestRequest + 60001;
      }
      
      const imperativeLockoutEnd = rateLimitLockoutUntil || 0;
      const finalLockoutEnd = Math.max(rpmLockoutEnd, imperativeLockoutEnd);

      if (finalLockoutEnd > now) {
        const remaining = Math.ceil((finalLockoutEnd - now) / 1000);
        setLockoutSecondsRemaining(remaining);
      } else {
        setLockoutSecondsRemaining(0);
        if (rateLimitLockoutUntil && rateLimitLockoutUntil <= now) {
          setRateLimitLockoutUntil(null);
          if (error && error.includes("Rate limit")) {
             setError(null);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [rateLimitLockoutUntil, requestTimestamps, error]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'face' | 'outfit' | 'background') => {
      const file = e.target.files?.[0];
      if (!file) return;

      const newImage = { file, preview: URL.createObjectURL(file) };

      switch(type) {
          case 'face':
              if (faceImage) URL.revokeObjectURL(faceImage.preview);
              setFaceImage(newImage);
              break;
          case 'outfit':
              if (outfitImage) URL.revokeObjectURL(outfitImage.preview);
              setOutfitImage(newImage);
              break;
          case 'background':
              if (backgroundImage) URL.revokeObjectURL(backgroundImage.preview);
              setBackgroundImage(newImage);
              break;
      }
  };

  const handleRemove = (type: 'face' | 'outfit' | 'background') => {
      switch(type) {
          case 'face':
              if (faceImage) URL.revokeObjectURL(faceImage.preview);
              setFaceImage(null);
              break;
          case 'outfit':
              if (outfitImage) URL.revokeObjectURL(outfitImage.preview);
              setOutfitImage(null);
              break;
          case 'background':
              if (backgroundImage) URL.revokeObjectURL(backgroundImage.preview);
              setBackgroundImage(null);
              break;
      }
  };

  const runGeneration = useCallback(async (args: GenerationArgs, isRegeneration: boolean) => {
    if (lockoutSecondsRemaining > 0) {
        setError(`Rate limit aktif. Silakan tunggu ${lockoutSecondsRemaining} detik.`);
        return;
    }
    if (sessionRequestCount >= RPD_QUOTA) {
        setError("Batas request harian sesi ini telah tercapai.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);
    updateFooter({ processName: isRegeneration ? 'Membuat Ulang Visual...' : 'Membuat Visual...', lastRequestCost: 0 });
    
    if (!isRegeneration) {
        setLastGenerationArgs(args);
    }

    try {
        const result = await generateVisualCreatorImage(
            args.faceFile,
            args.outfitFile,
            args.backgroundFile,
            args.prompt,
            args.numberOfVariations,
            args.isWatermarkEnabled,
            args.watermarkText,
            args.watermarkOpacity,
            args.watermarkPosition
        );
        setGeneratedImages(result);
        setIsLocked(true);
        
        const cost = result.length;
        const now = Date.now();
        const newTimestamps = Array(cost).fill(now);
        setRequestTimestamps(prev => [...prev, ...newTimestamps]);
        setSessionRequestCount(prev => prev + cost);
        updateFooter({ lastRequestCost: cost });
        setRateLimitLockoutUntil(Date.now() + PROACTIVE_COOLDOWN_MS);

    } catch (err) {
        console.error(err);
        const errorString = (err instanceof Error ? err.message : String(err));
        let displayMessage = "Terjadi kesalahan saat pembuatan gambar.";
        if (errorString.includes('quota') || errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('429')) {
            displayMessage = "Rate limit tercapai. Silakan coba lagi nanti.";
            setRateLimitLockoutUntil(Date.now() + RATE_LIMIT_COOLDOWN_MS);
        } else if (errorString.toLowerCase().includes('xhr error')) {
            displayMessage = "Terjadi masalah jaringan atau koneksi ke server. Harap periksa koneksi internet Anda dan coba lagi.";
        }
        setError(displayMessage);
    } finally {
        setIsLoading(false);
        updateFooter({ processName: null });
    }
  }, [updateFooter, lockoutSecondsRemaining, sessionRequestCount]);


  const handleGenerate = useCallback(() => {
    const currentArgs: GenerationArgs = {
        faceFile: faceImage?.file ?? null,
        outfitFile: outfitImage?.file ?? null,
        backgroundFile: backgroundImage?.file ?? null,
        prompt,
        numberOfVariations,
        isWatermarkEnabled,
        watermarkText,
        watermarkOpacity,
        watermarkPosition
    };
    runGeneration(currentArgs, false);
  }, [faceImage, outfitImage, backgroundImage, prompt, numberOfVariations, isWatermarkEnabled, watermarkText, watermarkOpacity, watermarkPosition, runGeneration]);

  const handleRegenerate = useCallback(() => {
      if (lastGenerationArgs) {
          runGeneration(lastGenerationArgs, true);
      }
  }, [lastGenerationArgs, runGeneration]);

  const watermarkSettings = {
    isWatermarkEnabled, setIsWatermarkEnabled,
    watermarkText, setWatermarkText,
    watermarkOpacity, setWatermarkOpacity,
    watermarkPosition, setWatermarkPosition
  }

  return (
    <main className="flex-grow flex flex-col lg:flex-row">
        <InputPanel
            faceImage={faceImage}
            outfitImage={outfitImage}
            backgroundImage={backgroundImage}
            prompt={prompt}
            onFileChange={handleFileChange}
            onRemove={handleRemove}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            onRegenerate={handleRegenerate}
            isLoading={isLoading}
            watermarkSettings={watermarkSettings}
            isRateLimited={lockoutSecondsRemaining > 0}
            lockoutSecondsRemaining={lockoutSecondsRemaining}
            isDailyLimitReached={sessionRequestCount >= RPD_QUOTA}
            isLocked={isLocked}
            hasGenerated={!!generatedImages}
            onReset={handleReset}
            numberOfVariations={numberOfVariations}
            setNumberOfVariations={setNumberOfVariations}
        />
        <OutputPanel 
            isLoading={isLoading}
            error={error}
            onDismissError={() => setError(null)}
            generatedImages={generatedImages}
        />
    </main>
  );
};

export default AutoImagePage;