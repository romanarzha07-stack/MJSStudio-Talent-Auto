import React, { useState, useEffect, useCallback } from 'react';
import { 
    generateBaseModel, 
    generateModelPoses,
    describeProductFromImage,
    implementProductOnModel,
    base64ToFile
} from '../services/geminiService';
import ErrorAlert from '../components/ErrorAlert';

// --- Configuration ---
const RPM_QUOTA = 15;
const RPD_QUOTA = 1500;
const RATE_LIMIT_COOLDOWN_MS = 61000;

// --- New Pose Library ---
const POSE_PROMPTS = [
    "Joyful", "Winking", "Presenting", "Surprised", "Sad", "Angry", 
    "Thoughtful", "Double Point", "Shushing", "Brilliant Idea", "Peep", "Show Clothes"
];
const POSE_DESCRIPTIONS: { [key: string]: string } = {
    "Joyful": "A half-body portrait of the subject with a genuine, joyful smile, eyes bright with happiness.",
    "Winking": "A half-body portrait of the subject giving a playful wink to the camera, with a charming smirk.",
    "Presenting": "A half-body portrait of the subject presenting something to the side with open palms, as if showing off a product. Their expression is friendly and inviting.",
    "Surprised": "A half-body portrait of the subject with a look of pleasant surprise, eyes wide and mouth slightly open in an 'o' shape.",
    "Sad": "A half-body portrait of the subject with a convincingly sad and melancholic expression, looking slightly downcast.",
    "Angry": "A half-body portrait of the subject with a look of controlled anger, eyebrows furrowed and a firm expression on their lips.",
    "Thoughtful": "A half-body portrait of the subject in a thoughtful pose, with a hand on their chin, looking off to the side as if deep in thought.",
    "Double Point": "A half-body portrait of the subject confidently pointing towards the camera with both index fingers, with an energetic and engaging expression.",
    "Shushing": "A half-body portrait of the subject making a 'shushing' gesture, with one index finger held up to their lips, looking mysteriously at the camera.",
    "Brilliant Idea": "A half-body portrait of the subject having a 'eureka' moment, with a finger pointing upwards and a bright, inspired expression on their face.",
    "Peep": "A half-body portrait of the subject peeking from behind an imaginary wall or from the side of the frame, with a curious or playful expression.",
    "Show Clothes": "A half-body portrait where the subject is subtly drawing attention to their clothing, perhaps by holding the lapel of a jacket or smoothing their shirt, with a proud expression."
};


// --- Helper & Icon Components ---
const UploadIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>);
const PoseIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>);
const ShoppingBagIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>);
const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>);
const ExpandIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 20.25v-4.5m0 4.5h-4.5m4.5 0L15 15m-6 0l-3.75 3.75M9 9l3.75-3.75M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9" /></svg>);
const XIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);

const LoadingSpinner: React.FC = () => (<div className="w-8 h-8 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>);

// --- Image Preview Modal ---
interface ImagePreviewModalProps {
  src: string;
  onClose: () => void;
}
const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ src, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative max-w-[90vw] max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt="Pratinjau Gambar" className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-2xl"/>
      </div>
      <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white bg-black/30 rounded-full hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white" aria-label="Tutup Pratinjau">
        <XIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

// --- Download Helper ---
const triggerDownload = (imageDataUri: string, prefix: string) => {
    const link = document.createElement('a');
    link.href = imageDataUri;
    const mimeType = imageDataUri.substring(imageDataUri.indexOf(":") + 1, imageDataUri.indexOf(";"));
    const extension = mimeType.split('/')[1] || 'png';
    link.download = `mjs-talent-${prefix}-${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// --- Loading States & Indicator ---
type LoadingState = 'idle' | 'generating_base' | 'generating_variations' | 'describing_product' | 'implementing_product';

const LOADING_MESSAGES: { [key in Exclude<LoadingState, 'idle'>]: string[] } = {
    generating_base: ["Membuat model dasar...", "Membentuk talent digital Anda...", "Menyiapkan kanvas..."],
    generating_variations: ["Menghasilkan 12 pose unik...", "Menganimasikan model Anda...", "Menangkap setiap ekspresi..."],
    describing_product: ["Menganalisis gambar produk...", "Mengekstrak detail fashion...", "Memahami gaya produk..."],
    implementing_product: ["Memakaikan produk ke model...", "Membuat 6 adegan komersial...", "Merender hasil akhir..."],
};

const AutoModelLoadingIndicator: React.FC<{ state: LoadingState }> = ({ state }) => {
    const messages = state !== 'idle' ? LOADING_MESSAGES[state] : [];
    const [message, setMessage] = useState(messages[0]);

    useEffect(() => {
        if (state !== 'idle' && messages.length > 1) {
            let i = 0;
            const interval = setInterval(() => {
                i = (i + 1) % messages.length;
                setMessage(messages[i]);
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [state, messages]);

    if (state === 'idle') return null;

    return (
        <div className="text-center p-8 w-full flex flex-col items-center justify-center h-full animate-fade-in">
            <LoadingSpinner />
            <p className="mt-4 font-semibold text-lg text-content-light dark:text-content-dark">{message}</p>
        </div>
    );
};


// --- Page Props & Component ---
interface MJSTalentAutoModelPageProps {
  updateFooter: (status: object) => void;
}

const MJSTalentAutoModelPage: React.FC<MJSTalentAutoModelPageProps> = ({ updateFooter }) => {
  // --- STATE MANAGEMENT ---
  const [inputType, setInputType] = useState<'text' | 'reference'>('reference');
  const [referenceType, setReferenceType] = useState<'realistic' | 'non-realistic'>('realistic');
  const [talentDescription, setTalentDescription] = useState('');
  const [outfitGeneration, setOutfitGeneration] = useState<'auto' | 'describe'>('auto');
  const [talentReference, setTalentReference] = useState<{ file: File, preview: string } | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<'white' | 'black' | null>(null);
  const [baseModelImage, setBaseModelImage] = useState<string | null>(null);
  const [poseVariations, setPoseVariations] = useState<(string | null)[]>([]);
  const [showProductSection, setShowProductSection] = useState(false);
  const [outfitReference, setOutfitReference] = useState<{ file: File, preview: string } | null>(null);
  const [productDescription, setProductDescription] = useState('');
  const [implementedImages, setImplementedImages] = useState<string[]>([]);
  const [isBaseModelGenerated, setIsBaseModelGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  
  // Rate limiting state
  const [requestTimestamps, setRequestTimestamps] = useState<number[]>([]);
  const [sessionRequestCount, setSessionRequestCount] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [rateLimitLockoutUntil, setRateLimitLockoutUntil] = useState<number | null>(null);
  const [lockoutSecondsRemaining, setLockoutSecondsRemaining] = useState(0);

  // --- RATE LIMITING AND FOOTER EFFECTS ---
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
      
      const imperativeLockoutEnd = rateLimitLockoutUntil || 0;
      if (imperativeLockoutEnd > now) {
        setLockoutSecondsRemaining(Math.ceil((imperativeLockoutEnd - now) / 1000));
      } else {
        setLockoutSecondsRemaining(0);
        if (rateLimitLockoutUntil && rateLimitLockoutUntil <= now) setRateLimitLockoutUntil(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [rateLimitLockoutUntil, requestTimestamps]);

  const handleCost = (cost: number) => {
    const now = Date.now();
    const newTimestamps = Array(cost).fill(now);
    setRequestTimestamps(prev => [...prev.slice(-100), ...newTimestamps]);
    setSessionRequestCount(prev => prev + cost);
    updateFooter({ lastRequestCost: cost });
  };

  // --- HANDLERS ---
  const handleTalentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (talentReference) URL.revokeObjectURL(talentReference.preview);
    setTalentReference({ file, preview: URL.createObjectURL(file) });
  };

  const handleOutfitFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (outfitReference) URL.revokeObjectURL(outfitReference.preview);
    setOutfitReference({ file, preview: URL.createObjectURL(file) });
    setImplementedImages([]);
  };

  const handleGenerateBaseModel = useCallback(async () => {
    if (!backgroundColor) return;
    setLoadingState('generating_base');
    setError(null);
    updateFooter({ processName: 'Membuat Base Model...', lastRequestCost: 0 });
    try {
        const image = await generateBaseModel(inputType, talentDescription, outfitGeneration, talentReference?.file, referenceType, backgroundColor);
        setBaseModelImage(image);
        setIsBaseModelGenerated(true);
        handleCost(1);
    } catch (err) { setError(err instanceof Error ? err.message : "Gagal membuat base model."); } 
    finally { setLoadingState('idle'); updateFooter({ processName: null }); }
  }, [inputType, talentDescription, outfitGeneration, talentReference, referenceType, backgroundColor, updateFooter]);

  const handleGenerateVariations = useCallback(async () => {
    if (!baseModelImage) return;
    setLoadingState('generating_variations');
    setError(null);
    updateFooter({ processName: 'Membuat Variasi Pose...', lastRequestCost: 0 });
    
    // Initialize with placeholders for progressive loading
    setPoseVariations(Array(POSE_PROMPTS.length).fill(null));

    try {
        const modelFile = base64ToFile(baseModelImage, 'base_model.png');
        
        const onProgress = (image: string, index: number) => {
            setPoseVariations(prev => {
                const newVariations = [...prev];
                newVariations[index] = image;
                return newVariations;
            });
        };
        
        await generateModelPoses(
            modelFile, 
            POSE_PROMPTS.map(p => POSE_DESCRIPTIONS[p]), 
            backgroundColor!, 
            onProgress
        );
        
        handleCost(POSE_PROMPTS.length);

    } catch (err) { 
        setError(err instanceof Error ? err.message : "Gagal membuat variasi pose.");
        setPoseVariations([]); // Clear placeholders on total failure
    }
    finally { 
        setLoadingState('idle'); 
        updateFooter({ processName: null }); 
    }
  }, [baseModelImage, backgroundColor, updateFooter]);

  const handleDescribeProduct = useCallback(async () => {
    if (!outfitReference) return;
    setLoadingState('describing_product');
    setError(null);
    updateFooter({ processName: 'Mendeskripsikan Produk...', lastRequestCost: 0 });
    try {
        const description = await describeProductFromImage(outfitReference.file);
        setProductDescription(description);
        handleCost(1);
    } catch(err) { setError(err instanceof Error ? err.message : "Gagal mendeskripsikan produk."); }
    finally { setLoadingState('idle'); updateFooter({ processName: null }); }
  }, [outfitReference, updateFooter]);

  const handleImplementProduct = useCallback(async () => {
    if (!baseModelImage || !outfitReference || !productDescription) return;
    setLoadingState('implementing_product');
    setImplementedImages([]); // Clear previous results
    setError(null);
    updateFooter({ processName: 'Mengimplementasikan Produk...', lastRequestCost: 0 });
    try {
        const images = await implementProductOnModel(baseModelImage, outfitReference.file, productDescription);
        setImplementedImages(images);
        handleCost(images.length);
    } catch (err) { setError(err instanceof Error ? err.message : "Gagal mengimplementasikan produk."); }
    finally { setLoadingState('idle'); updateFooter({ processName: null }); }
  }, [baseModelImage, outfitReference, productDescription, updateFooter]);

  const handleResetInputs = () => {
    if (talentReference) URL.revokeObjectURL(talentReference.preview);
    setBaseModelImage(null);
    setPoseVariations([]);
    setShowProductSection(false);
    setOutfitReference(null);
    setProductDescription('');
    setImplementedImages([]);
    setIsBaseModelGenerated(false);
    updateFooter({ processName: null, lastRequestCost: 0 });
  };
  
  const isStep1Valid = ((inputType === 'text' && talentDescription.trim() !== '') || (inputType === 'reference' && talentReference !== null)) && backgroundColor !== null;
  const isLoading = loadingState !== 'idle';
  
  // --- RENDER LOGIC ---
  return (
    <main className="flex-grow flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/3 p-4 space-y-4 border-r border-border-light dark:border-border-dark flex flex-col">
        <fieldset disabled={isBaseModelGenerated || isLoading} className="space-y-4">
            <div className="p-4 bg-primary-light dark:bg-gray-800 rounded-lg shadow-inner">
                <h2 className="text-xl font-bold">Langkah 1: Tentukan Talent</h2>
                <div className="flex gap-2 mt-4">
                    {(['reference', 'text'] as const).map(type => ( <button key={type} onClick={() => setInputType(type)} className={`w-full p-2 rounded-lg font-semibold transition-transform transform hover:scale-105 ${inputType === type ? 'bg-primary text-white shadow-md' : 'bg-bkg-light dark:bg-gray-700'}`}>{type === 'reference' ? 'Referensi Gambar' : 'Deskripsi Teks'}</button>))}
                </div>
                {inputType === 'text' ? (
                    <div className="mt-4 animate-fade-in space-y-3">
                        <textarea value={talentDescription} onChange={e => setTalentDescription(e.target.value)} placeholder="Contoh: Pria Asia 25 tahun dengan rambut hitam pendek..." rows={4} className="w-full p-2 border rounded-md bg-bkg-light dark:bg-gray-700 border-border-light dark:border-border-dark"/>
                        <div className="flex gap-2">
                           {(['auto', 'describe'] as const).map(opt => ( <button key={opt} onClick={() => setOutfitGeneration(opt)} className={`w-full p-2 text-sm rounded-lg font-semibold transition-transform transform hover:scale-105 ${outfitGeneration === opt ? 'bg-primary text-white shadow-md' : 'bg-bkg-light dark:bg-gray-700'}`}>{opt === 'auto' ? 'AI Otomatisasi Outfit' : 'Deskripsikan Outfit'}</button>))}
                        </div>
                        <p className="text-xs text-gray-500">Jika 'Deskripsikan Outfit', sertakan detail pakaian dalam deskripsi di atas.</p>
                    </div>
                ) : (
                    <div className="mt-4 animate-fade-in space-y-4">
                        <div className="flex gap-2">
                            {(['realistic', 'non-realistic'] as const).map(type => (<button key={type} onClick={() => setReferenceType(type)} className={`w-full p-2 rounded-lg font-semibold transition-transform transform hover:scale-105 ${referenceType === type ? 'bg-primary text-white shadow-md' : 'bg-bkg-light dark:bg-gray-700'}`}>{type === 'realistic' ? 'Model Realistis' : 'Non-Realistis'}</button>))}
                        </div>
                        <label htmlFor="talent-upload" className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${talentReference ? 'border-primary' : 'border-border-light dark:border-border-dark'}`}>
                            {talentReference ? ( <img src={talentReference.preview} alt="Talent Preview" className="w-full h-full object-cover rounded-lg" /> ) : ( <div className="text-center text-gray-500"><UploadIcon className="w-10 h-10 mx-auto" /><p>Klik untuk mengunggah</p></div> )}
                        </label>
                        <input id="talent-upload" type="file" className="hidden" accept="image/*" onChange={handleTalentFileChange} />
                    </div>
                )}
            </div>
            <div className="p-4 bg-primary-light dark:bg-gray-800 rounded-lg shadow-inner">
                <h3 className="font-semibold mb-2">Pilih Background (Wajib)</h3>
                <div className="flex gap-2">
                    {(['white', 'black'] as const).map(color => (<button key={color} onClick={() => setBackgroundColor(color)} className={`w-full p-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${backgroundColor === color ? 'ring-2 ring-primary' : 'bg-bkg-light dark:bg-gray-700'}`}><div className={`w-5 h-5 rounded-full border ${color === 'white' ? 'bg-white' : 'bg-black'}`}></div>{color === 'white' ? 'Putih' : 'Hitam'}</button>))}
                </div>
            </div>
        </fieldset>
        
        <div className="mt-auto pt-4 space-y-2">
             <button onClick={handleGenerateBaseModel} disabled={!isStep1Valid || isLoading || isBaseModelGenerated} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loadingState === 'generating_base' ? <> <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Memproses...</> : 'Generate Base Model'}
             </button>
             {isBaseModelGenerated && (<button onClick={handleResetInputs} disabled={isLoading} className="w-full bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed">Atur Ulang</button>)}
        </div>
      </div>

      <div className="w-full lg:w-2/3 p-4 flex flex-col items-center bg-gray-100 dark:bg-gray-900 overflow-y-auto">
        <div className="w-full max-w-4xl space-y-6">
            {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
            
            {loadingState === 'generating_base' && !baseModelImage && <AutoModelLoadingIndicator state={loadingState} />}

            {!isLoading && !baseModelImage && (
                <div className="text-center text-gray-500 p-8 flex flex-col items-center justify-center h-full">
                    <h3 className="text-2xl font-semibold">Selamat Datang di MJSTalent AutoModel</h3>
                    <p className="mt-2 max-w-md mx-auto">Hasil Anda akan muncul di sini. Mulai dengan mengisi detail di panel kiri dan klik "Generate Base Model".</p>
                </div>
            )}

            {baseModelImage && (
                <div className="space-y-4 animate-fade-in">
                    <h2 className="text-2xl font-bold text-center">Base Model Anda</h2>
                    <div className="relative group w-64 h-64 mx-auto">
                        <img src={baseModelImage} alt="Generated Base Model" className="w-full h-full object-cover rounded-lg shadow-lg"/>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 gap-4 rounded-lg">
                            <button onClick={handleGenerateVariations} disabled={isLoading} className="flex flex-col items-center gap-1 text-white disabled:opacity-50 transition-transform transform hover:scale-110">
                                <PoseIcon className="w-10 h-10" /> <span className="text-xs font-semibold">Generate Pose</span>
                            </button>
                            <button onClick={() => setShowProductSection(s => !s)} disabled={isLoading} className="flex flex-col items-center gap-1 text-white disabled:opacity-50 transition-transform transform hover:scale-110">
                                <ShoppingBagIcon className="w-10 h-10" /> <span className="text-xs font-semibold">Implementasi Produk</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {poseVariations.length > 0 && (
                <div className="space-y-4 animate-fade-in">
                    <h2 className="text-2xl font-bold text-center">Variasi Pose</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {poseVariations.map((src, index) => (
                            <div key={index} className="relative group aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md">
                                {src ? (
                                    <>
                                        <img src={src} alt={`Pose Variation ${index+1}`} className="w-full h-full object-cover rounded-lg" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 gap-2 rounded-lg">
                                            <button onClick={() => setPreviewImageSrc(src)} className="p-2 bg-white/20 text-white rounded-full hover:bg-white/40 transition-transform transform hover:scale-110" title="Preview"><ExpandIcon className="w-5 h-5"/></button>
                                            <button onClick={() => triggerDownload(src, `pose-${POSE_PROMPTS[index]}`)} className="p-2 bg-white/20 text-white rounded-full hover:bg-white/40 transition-transform transform hover:scale-110" title="Download"><DownloadIcon className="w-5 h-5"/></button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showProductSection && (
                <div className="space-y-4 p-4 bg-primary-light dark:bg-gray-800 rounded-lg shadow-inner animate-fade-in">
                    <h2 className="text-2xl font-bold text-center">Implementasi Produk</h2>
                    <div className="grid md:grid-cols-2 gap-4 items-start">
                        <div className="space-y-2">
                             <label htmlFor="outfit-upload" className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${outfitReference ? 'border-primary' : 'border-border-light dark:border-border-dark'}`}>
                                {outfitReference ? <img src={outfitReference.preview} alt="Pratinjau Produk" className="w-full h-full object-contain rounded-lg p-2" /> : <div className="text-center text-gray-500"><UploadIcon className="w-8 h-8 mx-auto" /><p className="text-sm">Unggah Gambar Produk</p></div>}
                            </label>
                            <input id="outfit-upload" type="file" className="hidden" accept="image/*" onChange={handleOutfitFileChange} />
                        </div>
                        <div className="space-y-2">
                             <button onClick={handleDescribeProduct} disabled={!outfitReference || isLoading} className="w-full bg-blue-500 text-white font-bold py-2 px-3 rounded-lg transition-colors hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center gap-2">
                               {loadingState === 'describing_product' ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Mendeskripsikan...</> : "Deskripsikan Produk (Wajib)"}
                            </button>
                            <textarea value={productDescription} readOnly placeholder="Deskripsi produk dari AI akan muncul di sini..." rows={4} className="w-full p-2 border rounded-md bg-bkg-light dark:bg-gray-700 border-border-light dark:border-border-dark"/>
                        </div>
                    </div>
                    <button onClick={handleImplementProduct} disabled={!productDescription || isLoading} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2">
                        {loadingState === 'implementing_product' ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Memproses 6 Gambar...</> : "Generate Implementasi Produk"}
                    </button>

                    {loadingState === 'implementing_product' && <AutoModelLoadingIndicator state={loadingState} />}
                    {implementedImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                            {implementedImages.map((src, index) => (
                               <div key={index} className="relative group aspect-square">
                                    <img src={src} alt={`Implemented Product ${index+1}`} className="w-full h-full object-cover rounded-lg shadow-md" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 gap-2 rounded-lg">
                                        <button onClick={() => setPreviewImageSrc(src)} className="p-2 bg-white/20 text-white rounded-full hover:bg-white/40 transition-transform transform hover:scale-110" title="Preview"><ExpandIcon className="w-5 h-5"/></button>
                                        <button onClick={() => triggerDownload(src, `product-${index + 1}`)} className="p-2 bg-white/20 text-white rounded-full hover:bg-white/40 transition-transform transform hover:scale-110" title="Download"><DownloadIcon className="w-5 h-5"/></button>
                                    </div>
                               </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
      {previewImageSrc && ( <ImagePreviewModal src={previewImageSrc} onClose={() => setPreviewImageSrc(null)} /> )}
    </main>
  );
};

export default MJSTalentAutoModelPage;
