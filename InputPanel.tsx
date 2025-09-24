import React, { useState, useMemo, useEffect } from 'react';
import type { 
    SubjectInputType, 
    FashionCategory, 
    SelectedCategories, 
    FashionReferences,
    ReferenceFile,
    CoupleInputMode,
    WatermarkPosition
} from '../types';
import { FASHION_CATEGORIES } from '../types';

// --- START: Single Person Pose Library Components ---

const StandingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v10" />
    <path d="M9 22v-5l-2-2" />
    <path d="M15 22v-5l2-2" />
    <path d="M9 12l-2-3" />
    <path d="M15 12l2-3" />
  </svg>
);

const WalkingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="2" />
        <path d="M12 6v7" />
        <path d="M14 13l-4 8" />
        <path d="M10 13L8 21" />
        <path d="M10 11l4-3" />
        <path d="M14 8l-4-3" />
    </svg>
);

const LeaningIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="5" r="2" />
        <path d="M10 7v10" />
        <path d="M12 22L8 17" />
        <path d="M10 12l-4-2" />
        <path d="M16 3v18" />
    </svg>
);

const SittingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v5" />
        <path d="M9 12h6l-3 7z" />
        <path d="M5 18h14" />
    </svg>
);

const DynamicIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7l2 5 4 2-5 3-3-5z" />
        <path d="M10 12l-2 5-4 2 5 3 3-5z" />
    </svg>
);

const OverShoulderIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12c-2 0-4-2-4-4s2-4 4-4 4 2 4 4" />
        <path d="M16 12v6c0 2-2 4-4 4s-4-2-4-4v-6" />
        <path d="M12 14l-2 4h4l-2-4z" />
    </svg>
);

const CrouchingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v5" />
        <path d="M9 12l-2 6" />
        <path d="M15 12l2 6" />
        <path d="M7 18h10" />
        <path d="M9 22l-2-4" />
        <path d="M15 22l2-4" />
    </svg>
);

const HandsInPocketsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v10" />
        <path d="M9 22v-6" />
        <path d="M15 22v-6" />
        <path d="M8 12h-2c-1 0-2 1-2 2v2" />
        <path d="M16 12h2c1 0 2 1 2 2v2" />
    </svg>
);

const ProfileViewIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="5" r="2" />
        <path d="M9 7v12" />
        <path d="M9 22v-3" />
        <path d="M6 16l3-1" />
        <path d="M9 11l3-2" />
    </svg>
);

const JumpingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7l-2 5h4l-2-5z" />
        <path d="M10 12l-2 7" />
        <path d="M14 12l2 7" />
        <path d="M8 19l-3-2" />
        <path d="M16 19l3-2" />
    </svg>
);

const LyingDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="11" r="2" />
        <path d="M8 11h12" />
        <path d="M18 13l-3 4" />
        <path d="M15 13l-3 4" />
        <path d="M4 17h16" />
    </svg>
);

const KneelingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v8" />
        <path d="M9 15l-3 7" />
        <path d="M15 15v7" />
        <path d="M9 10l-3-2" />
        <path d="M15 10l3-2" />
        <path d="M8 22h8" />
    </svg>
);

const HandsOnHipsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v9" />
        <path d="M9 22v-6" />
        <path d="M15 22v-6" />
        <path d="M8 16c-2 0-3-2-3-4v-1" />
        <path d="M16 16c2 0 3-2 3-4v-1" />
    </svg>
);

const LookingUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="2" />
        <path d="M12 9v11" />
        <path d="M9 22v-6" />
        <path d="M15 22v-6" />
        <path d="M9 14l-3-2" />
        <path d="M15 14l3-2" />
        <path d="M11 5l1-2 1 2" />
    </svg>
);

const DetailFocusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v8" />
        <path d="M12 15h-1a2 2 0 100 4h1" />
        <path d="M12 15h1a2 2 0 110 4h-1" />
        <path d="M9 12l-4 1" />
        <path d="M5 13V9" />
    </svg>
);

const ArmsCrossedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v13" />
        <path d="M9 22v-6" />
        <path d="M15 22v-6" />
        <path d="M8 12l8-2" />
        <path d="M16 12l-8-2" />
    </svg>
);

const LeaningForwardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7l-2 10" />
        <path d="M14 17l-2-10" />
        <path d="M7 22h10" />
        <path d="M8 17l-3-2" />
        <path d="M16 17l3-2" />
    </svg>
);

const TwirlingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4" />
        <path d="M12 11c-4 0-4 6 0 6s4-6 0-6z" />
        <path d="M10 22l-2-2" />
        <path d="M14 22l2-2" />
        <path d="M2 17h20" />
    </svg>
);

const ReachingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v12" />
        <path d="M9 22v-6" />
        <path d="M15 22v-6" />
        <path d="M10 10l-4 -3" />
        <path d="M14 10l4 -3" />
    </svg>
);

const PropIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="5" r="2" />
        <path d="M9 7v10" />
        <path d="M7 22v-5" />
        <path d="M11 22v-5" />
        <path d="M15 10h4v12h-4z" />
    </svg>
);

const HairFlipIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12c-2 0-4-2-4-4s2-4 4-4 4 2 4 4" />
        <path d="M16 12v6c0 2-2 4-4 4s-4-2-4-4v-6" />
        <path d="M3 10c4 0 6 2 8 2" />
        <path d="M21 10c-4 0-6 2-8 2" />
    </svg>
);

const LowAngleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="2" />
        <path d="M12 9v11" />
        <path d="M10 22l-2-6" />
        <path d="M14 22l2-6" />
        <path d="M5 18h14" />
    </svg>
);

const HighAngleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v10" />
        <path d="M9 17l-2 5" />
        <path d="M15 17l2 5" />
        <path d="M7 22h10" />
    </svg>
);

const RunningIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="5" r="2" />
        <path d="M14 7l-3 7" />
        <path d="M11 14l-4 7" />
        <path d="M18 13l-4-2" />
        <path d="M7 14l3-4" />
    </svg>
);

const SingleDancingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v8" />
        <path d="M15 15l4 4" />
        <path d="M9 15l-4 4" />
        <path d="M8 12h8" />
    </svg>
);

const BlowingBubblesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v10" />
    <path d="M9 22v-5l-2-2" />
    <path d="M15 22v-5l2-2" />
    <path d="M14 9a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
    <circle cx="16" cy="7" r="1" />
    <circle cx="17" cy="10" r="1.5" />
  </svg>
);

const HandOnFaceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="6" r="2" />
        <path d="M12 8v12" />
        <path d="M9 22v-6" />
        <path d="M15 22v-6" />
        <path d="M14 10h-4v2c0 1.1.9 2 2 2s2-.9 2-2v-2z" />
    </svg>
);

const FixingCollarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v13" />
        <path d="M9 22v-6" />
        <path d="M15 22v-6" />
        <path d="M9 9l-2-2" />
        <path d="M15 9l2-2" />
    </svg>
);

const OneLegUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="5" r="2" />
        <path d="M10 7v13" />
        <path d="M10 22L7 18" />
        <path d="M13 22V15l3-3" />
        <path d="M18 3v18" />
    </svg>
);

const HeroIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v13" />
        <path d="M9 22 l-2-4" />
        <path d="M15 22 l2-4" />
        <path d="M7 18h10" />
    </svg>
);

const POSES = [
  { name: "Pose Percaya Diri", description: "A full-body shot of the model standing confidently, one hand on their hip, looking directly at the camera with a slight smile.", icon: StandingIcon, },
  { name: "Gerakan Berjalan", description: "A full-body action shot of the model walking towards the camera, capturing a natural stride and the movement of the clothes.", icon: WalkingIcon, },
  { name: "Bersandar Santai", description: "The model is leaning casually against a textured wall, one leg crossed over the other, looking away from the camera.", icon: LeaningIcon, },
  { name: "Duduk Elegan", description: "The model is sitting elegantly on a simple stool or chair, with legs crossed, showcasing the full outfit from a seated perspective.", icon: SittingIcon, },
  { name: "Aksi Dinamis", description: "A dynamic and energetic pose, perhaps mid-jump or a dramatic turn, highlighting the flow and fit of the garments.", icon: DynamicIcon, },
  { name: "Lihat ke Belakang", description: "The model is facing away from the camera but looking back over their shoulder, creating a sense of intrigue and highlighting the back details of the outfit.", icon: OverShoulderIcon, },
  { name: "Berjongkok", description: "A low-angle, full-body shot of the model in a crouching or squatting position, often used to emphasize footwear or create a dynamic, grounded look.", icon: CrouchingIcon, },
  { name: "Tangan di Saku", description: "A casual, full-body pose with the model's hands placed in their pockets, conveying a relaxed and confident attitude.", icon: HandsInPocketsIcon, },
  { name: "Tampak Samping", description: "A full-body shot of the model from the side (profile view), highlighting the silhouette and shape of the outfit.", icon: ProfileViewIcon, },
  { name: "Pose Melompat", description: "A high-energy, full-body shot of the model mid-jump, capturing the clothing in motion and creating a joyful and free-spirited feel.", icon: JumpingIcon, },
  { name: "Pose Berbaring", description: "The model is lying down on a clean surface, either on their back or side, in an elegant and relaxed manner, suitable for editorial or high-fashion looks.", icon: LyingDownIcon, },
  { name: "Pose Berlutut", description: "A full-body shot with the model kneeling on one or both knees, creating a strong and composed look. This pose is great for showcasing details on trousers or long skirts.", icon: KneelingIcon, },
  { name: "Tangan di Pinggul", description: "A classic power pose. The model stands with both hands firmly on their hips, feet slightly apart, exuding confidence and strength.", icon: HandsOnHipsIcon, },
  { name: "Pose Menengadah", description: "The model is looking upwards, away from the camera, with a thoughtful or hopeful expression. This pose can create a sense of aspiration and elegance.", icon: LookingUpIcon, },
  { name: "Fokus Detail", description: "A close-up or medium shot focusing on a specific detail of the outfit, such as a collar, cuff, or texture of the fabric, with the model's hands interacting with it.", icon: DetailFocusIcon, },
  { name: "Tangan Bersilang", description: "The model stands with arms crossed over their chest, projecting a cool, confident, or assertive attitude. A simple yet powerful full-body stance.", icon: ArmsCrossedIcon, },
  { name: "Condong ke Depan", description: "The model is leaning forward towards the camera, often resting their elbows on their knees if seated, or on a surface if standing. Creates an intimate and engaging feel.", icon: LeaningForwardIcon, },
  { name: "Pose Berputar", description: "A dynamic shot capturing the model in the middle of a twirl or spin, perfect for dresses, skirts, or coats to showcase their movement and volume.", icon: TwirlingIcon, },
  { name: "Pose Meraih", description: "Model meregangkan atau meraih ke atas, menciptakan garis yang panjang dan elegan, menonjolkan fleksibilitas pakaian.", icon: ReachingIcon, },
  { name: "Dengan Properti", description: "Model berinteraksi secara alami dengan properti sederhana (seperti kursi atau tangga), menambahkan konteks dan narasi.", icon: PropIcon, },
  { name: "Kibasan Rambut", description: "Menangkap gerakan rambut yang dinamis saat model mengibaskan rambutnya, menciptakan energi dan keaktifan.", icon: HairFlipIcon, },
  { name: "Sudut Rendah", description: "Tembakan diambil dari sudut rendah, membuat model terlihat kuat, tinggi, dan dominan.", icon: LowAngleIcon, },
  { name: "Sudut Tinggi", description: "Tembakan diambil dari sudut tinggi, seringkali memberikan nuansa lembut, introspektif, atau unik pada potret.", icon: HighAngleIcon, },
  { name: "Pose Berlari", description: "Tangkapan aksi dinamis dari model yang sedang berlari, baik ke arah atau menjauhi kamera, menampilkan pakaian dalam gerakan penuh.", icon: RunningIcon, },
  { name: "Pose Menari", description: "Model dalam pose tarian yang ekspressif, menunjukkan kebebasan dan gerakan, ideal untuk pakaian yang mengalir.", icon: SingleDancingIcon, },
  { name: "Meniup Gelembung", description: "Tembakan seluruh badan yang unik dari model yang sedang meniup gelembung sabun, menciptakan suasana ceria dan seperti mimpi. Pakaian harus terlihat jelas.", icon: BlowingBubblesIcon, },
  { name: "Tangan di Wajah", description: "Model dengan lembut meletakkan tangan di wajah, dagu, atau pipi, menciptakan suasana yang bijaksana, misterius, atau lembut.", icon: HandOnFaceIcon, },
  { name: "Merapikan Pakaian", description: "Pose candid di mana model tampak sedang merapikan kerah, dasi, atau lengan bajunya, menambahkan sentuhan keaslian.", icon: FixingCollarIcon, },
  { name: "Satu Kaki Naik", description: "Pose santai di mana model bersandar di dinding dengan satu kaki diangkat dan telapak kaki menempel di dinding.", icon: OneLegUpIcon, },
  { name: "Pose Pahlawan", description: "Model berdiri tegak dengan kaki sedikit terbuka, menatap ke kejauhan, memancarkan kekuatan dan aura heroik.", icon: HeroIcon, },
];

// --- END: Single Person Pose Library Components ---

// --- START: Couple Pose Library Components ---
const HoldingHandsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 10v1a2 2 0 002 2h6a2 2 0 002-2v-1"/>
        <circle cx="8" cy="6" r="2" />
        <circle cx="16" cy="6" r="2" />
        <path d="M8 8v10"/>
        <path d="M16 8v10"/>
    </svg>
);
const EmbraceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="5" r="2" />
        <circle cx="15" cy="5" r="2" />
        <path d="M9 7v10" />
        <path d="M15 7v10" />
        <path d="M6 14h12" />
        <path d="M18 12l-3 3-3-3" />
    </svg>
);
const BackToBackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="5" r="2" />
        <circle cx="16" cy="5" r="2" />
        <path d="M8 7v13" />
        <path d="M16 7v13" />
        <path d="M12 7v13" />
    </svg>
);
const LiftingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v10" />
        <path d="M9 22v-6h6v6" />
        <circle cx="9" cy="11" r="2" />
        <path d="M9 13v-4" />
    </svg>
);
const DancingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="6" r="2" />
        <circle cx="16" cy="6" r="2" />
        <path d="M8 8l-2 12" />
        <path d="M16 8l2 12" />
        <path d="M10 12l4-2" />
        <path d="M14 12l-4 2" />
    </svg>
);
const CoupleSittingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="5" r="2" />
        <path d="M8 7v5" />
        <path d="M6 12h4l-2 7z" />
        <circle cx="16" cy="5" r="2" />
        <path d="M16 7v5" />
        <path d="M14 12h4l-2 7z" />
        <path d="M4 19h16" />
    </svg>
);
const PiggybackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="2" />
        <path d="M12 9v11" />
        <path d="M9 22v-6" />
        <path d="M15 22v-6" />
        <circle cx="12" cy="4" r="2" />
        <path d="M12 6c-2 2-2 4 0 4" />
    </svg>
);
const ForeheadTouchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="2" />
        <circle cx="15" cy="8" r="2" />
        <path d="M9 10v8" />
        <path d="M15 10v8" />
        <path d="M12 6a3 3 0 00-3-3h-1" />
        <path d="M12 6a3 3 0 013-3h1" />
    </svg>
);
const SerenadeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="14" r="2" />
        <path d="M8 16v-5l6-2" />
        <path d="M14 9v11" />
        <circle cx="14" cy="5" r="2" />
        <path d="M18 13a4 4 0 01-4 4h-2" />
    </svg>
);

const DipKissIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="6" r="2" />
        <circle cx="14" cy="4" r="2" />
        <path d="M8 8v10" />
        <path d="M14 6l-6 10" />
        <path d="M12 22L8 18" />
    </svg>
);

const NoseToNoseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="2" />
        <circle cx="15" cy="7" r="2" />
        <path d="M9 9v10" />
        <path d="M15 9v10" />
        <path d="M11 9.5s-1 2 1 2" />
        <path d="M13 9.5s1 2 -1 2" />
    </svg>
);

const LeadingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="5" r="2" />
        <path d="M16 7v10" />
        <circle cx="8" cy="6" r="2" />
        <path d="M8 8v9" />
        <path d="M12 12H8" />
    </svg>
);

const CradleFaceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="2" />
        <path d="M12 9v11" />
        <path d="M9 13c-2 0-3 1-3 3" />
        <path d="M15 13c2 0 3 1 3 3" />
    </svg>
);

const ForeheadKissIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="15" cy="6" r="2" />
        <path d="M15 8v12" />
        <circle cx="9" cy="8" r="2" />
        <path d="M9 10v10" />
        <path d="M11 5 a2 2 0 0 0 2 2" />
    </svg>
);

const BridalCarryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="6" r="2" />
        <path d="M12 8v12" />
        <path d="M9 22v-5" />
        <path d="M15 22v-5" />
        <circle cx="10" cy="12" r="2" />
        <path d="M12 12H8" />
        <path d="M12 15h4" />
    </svg>
);

const HighFiveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="6" r="2" />
        <path d="M8 8v12" />
        <circle cx="16" cy="6" r="2" />
        <path d="M16 8v12" />
        <path d="M10 12l4-2" />
    </svg>
);

const SideHugIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="6" r="2" />
        <path d="M9 8v12" />
        <circle cx="15" cy="6" r="2" />
        <path d="M15 8v12" />
        <path d="M12 14h-5" />
    </svg>
);

const PointingIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="6" r="2" />
        <path d="M8 8v12" />
        <circle cx="14" cy="6" r="2" />
        <path d="M14 8v12" />
        <path d="M10 11l4-2h4" />
    </svg>
);

const UmbrellaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 14a10 10 0 0120 0" />
        <path d="M12 14v8" />
        <circle cx="9" cy="18" r="1" />
        <circle cx="15" cy="18" r="1" />
    </svg>
);

const MirroredPoseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="6" r="2" />
        <path d="M7 8v12" />
        <path d="M7 14l-3 3" />
        <circle cx="17" cy="6" r="2" />
        <path d="M17 8v12" />
        <path d="M17 14l3 3" />
        <path d="M12 3v18" />
    </svg>
);

const SelfieIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="2" />
        <path d="M9 9v11" />
        <circle cx="15" cy="7" r="2" />
        <path d="M15 9v11" />
        <path d="M12 11l5-3" />
        <path d="M17 8H5" />
    </svg>
);

const COUPLE_POSES = [
    { name: "Berpegangan Tangan", description: "Mereka berjalan santai ke arah kamera, berpegangan tangan dan tersenyum satu sama lain.", icon: HoldingHandsIcon },
    { name: "Pelukan dari Belakang", description: "Mereka berpelukan, satu orang memeluk yang lain dari belakang, keduanya melihat ke kamera dengan ekspresi bahagia.", icon: EmbraceIcon },
    { name: "Punggung-ke-Punggung", description: "Mereka berdiri punggung-ke-Punggung dengan lengan disilangkan, memancarkan kepercayaan diri dan gaya.", icon: BackToBackIcon },
    { name: "Mengangkat Romantis", description: "Mereka dalam pose mengangkat yang menyenangkan dan romantis, menangkap momen kegembiraan dan cinta.", icon: LiftingIcon },
    { name: "Menari Lambat", description: "Mereka berpose menari lambat, saling menatap mata, menciptakan suasana yang intim dan elegan.", icon: DancingIcon },
    { name: "Duduk Berdampingan", description: "Mereka duduk berdampingan di bangku atau tangga, satu orang menyandarkan kepala di bahu yang lain.", icon: CoupleSittingIcon },
    { name: "Gendong di Punggung", description: "Mereka dalam pose piggyback yang ceria, penuh tawa dan energi.", icon: PiggybackIcon },
    { name: "Dahi Bertemu", description: "Mereka berdiri sangat dekat, dahi mereka bersentuhan dengan mata tertutup, menangkap momen yang tenang dan intim.", icon: ForeheadTouchIcon },
    { name: "Berbisik Rahasia", description: "Satu orang membisikkan sesuatu ke telinga yang lain, yang bereaksi dengan tawa atau senyum terkejut.", icon: SerenadeIcon },
    { name: "Melihat Matahari Terbenam", description: "Mereka melihat ke kejauhan bersama, mungkin ke arah matahari terbenam, dengan satu lengan melingkari yang lain.", icon: ProfileViewIcon },
    { name: "Tertawa Bersama", description: "Pose candid di mana mereka tertawa lepas bersama, melihat satu sama lain, bukan ke kamera.", icon: DynamicIcon },
    { name: "Pose Kekuatan", description: "Mereka berdiri berdampingan, melihat lurus ke kamera dengan ekspresi yang kuat dan percaya diri, sebagai tim yang solid.", icon: StandingIcon },
    { name: "Bersandar Santai", description: "Satu orang bersandar pada yang lain, yang berdiri tegak. Ini adalah pose yang santai namun terhubung.", icon: LeaningIcon },
    { name: "Ciuman di Pipi", description: "Pose manis di mana satu orang memberikan ciuman lembut di pipi yang lain.", icon: ForeheadTouchIcon },
    { name: "Berbagi Jaket", description: "Mereka berdekatan, berbagi satu jaket atau selimut, menciptakan perasaan hangat dan nyaman.", icon: EmbraceIcon },
    { name: "Pose Editorial", description: "Pose fashion-forward di mana mereka tidak saling berinteraksi tetapi ditempatkan secara artistik dalam bingkai, menciptakan komposisi yang kuat.", icon: ArmsCrossedIcon },
    { name: "Menatap Penuh Kasih", description: "Mereka saling berhadapan, hanya satu yang melihat ke kamera sementara yang lain menatap pasangannya dengan penuh kasih.", icon: HoldingHandsIcon },
    { name: "Berbaring di Rumput", description: "Mereka berbaring di rumput, kepala berdekatan, melihat ke atas ke kamera, menciptakan perspektif yang unik dan intim.", icon: LyingDownIcon },
    { name: "Ciuman Dip", description: "Pose tarian yang dramatis dan romantis di mana satu orang mencondongkan yang lain ke belakang untuk ciuman.", icon: DipKissIcon },
    { name: "Hidung Bertemu", description: "Pose yang manis dan intim di mana mereka saling berhadapan, hidung mereka bersentuhan dengan lembut.", icon: NoseToNoseIcon },
    { name: "Memimpin Jalan", description: "Satu orang menuntun yang lain dengan tangan, menoleh ke belakang dengan senyum, menciptakan rasa petualangan dan koneksi.", icon: LeadingIcon },
    { name: "Memegang Wajah", description: "Momen yang lembut di mana satu orang dengan penuh kasih memegang wajah pasangannya di antara kedua tangannya.", icon: CradleFaceIcon },
    { name: "Ciuman Kening", description: "Pose yang menunjukkan kepedulian dan kelembutan, di mana satu orang mencium kening pasangannya.", icon: ForeheadKissIcon },
    { name: "Gendong Mesra", description: "Pose romantis atau menyenangkan di mana satu orang menggendong yang lain (gaya pengantin).", icon: BridalCarryIcon },
    { name: "Tos", description: "Pose yang energik dan bersahabat, menangkap momen perayaan dengan tos atau kepalan tangan.", icon: HighFiveIcon },
    { name: "Pelukan Samping", description: "Pelukan santai dari samping sambil berjalan atau berdiri, menunjukkan kehangatan dan persahabatan.", icon: SideHugIcon },
    { name: "Menunjuk Sesuatu", description: "Keduanya melihat dan menunjuk ke arah yang sama, berbagi momen penemuan atau lelucon internal.", icon: PointingIcon },
    { name: "Berbagi Payung", description: "Pose klasik yang menciptakan suasana nyaman dan protektif, saat mereka berdekatan di bawah satu payung.", icon: UmbrellaIcon },
    { name: "Pose Cermin", description: "Pose artistik di mana mereka berdiri terpisah namun saling meniru pose satu sama lain, menciptakan simetri visual.", icon: MirroredPoseIcon },
    { name: "Pose Selfie", description: "Pose modern dan menyenangkan di mana pasangan mengambil foto selfie bersama, menangkap momen yang otentik.", icon: SelfieIcon },
];

interface PoseLibraryProps {
  onSelectPose: (description: string) => void;
  selectedPoseDescription: string;
  poses: { name: string; description: string; icon: React.FC<{className?: string}>; }[];
}

const PoseLibrary: React.FC<PoseLibraryProps> = ({ onSelectPose, selectedPoseDescription, poses }) => {
  return (
    <div>
        <h4 className="text-sm font-medium mb-2 text-content-light dark:text-content-dark">Pilih dari Pustaka Pose</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {poses.map(pose => {
                const isSelected = selectedPoseDescription === pose.description;
                const Icon = pose.icon;
                return (
                    <button
                        key={pose.name}
                        onClick={() => onSelectPose(pose.description)}
                        className={`p-2 border rounded-lg flex flex-col items-center justify-center space-y-1 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary
                            ${isSelected 
                                ? 'bg-primary text-white border-primary-dark' 
                                : 'bg-bkg-light dark:bg-gray-700 border-border-light dark:border-border-dark hover:border-primary'
                            }`}
                        title={pose.description}
                    >
                        <Icon className="w-8 h-8" />
                        <span className="text-xs font-semibold">{pose.name}</span>
                    </button>
                )
            })}
        </div>
    </div>
  );
};

// --- END: Pose Library Components ---

// XIcon defined inside to keep it self-contained
const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface InputPanelProps {
    subjectInputType: SubjectInputType;
    setSubjectInputType: (type: SubjectInputType) => void;
    subjectDescription: string;
    setSubjectDescription: (desc: string) => void;
    subjectReferencePhoto: File | null;
    setSubjectReferencePhoto: (file: File | null) => void;
    coupleInputMode: CoupleInputMode;
    setCoupleInputMode: (mode: CoupleInputMode) => void;
    coupleReferencePhotos: [File | null, File | null];
    setCoupleReferencePhotos: (files: [File | null, File | null]) => void;
    coupleSecondPersonDescription: string;
    setCoupleSecondPersonDescription: (desc: string) => void;
    coupleOutfitDescription: string;
    setCoupleOutfitDescription: (desc: string) => void;
    selectedCategories: SelectedCategories;
    setSelectedCategories: (cats: SelectedCategories) => void;
    fashionReferences: FashionReferences;
    setFashionReferences: (refs: FashionReferences) => void;
    fashionReferencesP2: FashionReferences;
    setFashionReferencesP2: (refs: FashionReferences) => void;
    poseDescription: string;
    setPoseDescription: (pose: string) => void;
    backgroundDescription: string;
    setBackgroundDescription: (bg: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    hasGenerated: boolean;
    onReset: () => void;
    isRateLimited: boolean;
    lockoutSecondsRemaining: number;
    isDailyLimitReached: boolean;
    numberOfVariations: number;
    setNumberOfVariations: (num: number) => void;
    generationPrompt: string | null;
    isWatermarkEnabled: boolean;
    setIsWatermarkEnabled: (enabled: boolean) => void;
    watermarkText: string;
    setWatermarkText: (text: string) => void;
    watermarkOpacity: number;
    setWatermarkOpacity: (opacity: number) => void;
    watermarkPosition: WatermarkPosition;
    setWatermarkPosition: (position: WatermarkPosition) => void;
    isLocked: boolean;
}

const SubjectInput: React.FC<Pick<InputPanelProps, 
    'subjectInputType' | 'setSubjectInputType' | 
    'subjectDescription' | 'setSubjectDescription' | 
    'subjectReferencePhoto' | 'setSubjectReferencePhoto' |
    'coupleInputMode' | 'setCoupleInputMode' | 
    'coupleReferencePhotos' | 'setCoupleReferencePhotos' | 
    'coupleSecondPersonDescription' | 'setCoupleSecondPersonDescription'
>> = (props) => {
    const { 
        subjectInputType, setSubjectInputType, 
        subjectDescription, setSubjectDescription, 
        subjectReferencePhoto, setSubjectReferencePhoto,
        coupleInputMode, setCoupleInputMode,
        coupleReferencePhotos, setCoupleReferencePhotos,
        coupleSecondPersonDescription, setCoupleSecondPersonDescription
    } = props;

    const [singlePreview, setSinglePreview] = useState<string | null>(null);
    const [couplePreviews, setCouplePreviews] = useState<[string | null, string | null]>([null, null]);

    React.useEffect(() => {
        return () => {
            if (singlePreview) URL.revokeObjectURL(singlePreview);
            couplePreviews.forEach(p => p && URL.revokeObjectURL(p));
        };
    }, []);

    const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSubjectReferencePhoto(file);
            if (singlePreview) URL.revokeObjectURL(singlePreview);
            setSinglePreview(URL.createObjectURL(file));
        }
    };

    const removeSinglePhoto = () => {
        setSubjectReferencePhoto(null);
        if (singlePreview) {
            URL.revokeObjectURL(singlePreview);
            setSinglePreview(null);
        }
    };

    const handleCoupleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
        const file = e.target.files?.[0];
        if (file) {
            // FIX: Use type assertion when spreading a tuple to maintain its type.
            const newPhotos = [...coupleReferencePhotos] as [File | null, File | null];
            newPhotos[index] = file;
            setCoupleReferencePhotos(newPhotos);

            // FIX: Use type assertion when spreading a tuple to maintain its type.
            const newPreviews = [...couplePreviews] as [string | null, string | null];
            if (newPreviews[index]) URL.revokeObjectURL(newPreviews[index]!);
            newPreviews[index] = URL.createObjectURL(file);
            setCouplePreviews(newPreviews);
        }
    };

    const removeCouplePhoto = (index: 0 | 1) => {
        // FIX: Use type assertion when spreading a tuple to maintain its type.
        const newPhotos = [...coupleReferencePhotos] as [File | null, File | null];
        newPhotos[index] = null;
        setCoupleReferencePhotos(newPhotos);

        // FIX: Use type assertion when spreading a tuple to maintain its type.
        const newPreviews = [...couplePreviews] as [string | null, string | null];
        if (newPreviews[index]) {
            URL.revokeObjectURL(newPreviews[index]!);
            newPreviews[index] = null;
        }
        setCouplePreviews(newPreviews);
    };
    
    const PhotoUploader: React.FC<{
        id: string;
        preview: string | null;
        label: string;
        onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        onRemove: () => void;
    }> = ({ id, preview, label, onFileChange, onRemove }) => (
        <div className="w-full">
            <input type="file" id={id} className="hidden" accept="image/*" onChange={onFileChange} />
            <label htmlFor={id} className="cursor-pointer w-full text-center py-2 px-4 border-2 border-dashed border-border-light dark:border-border-dark rounded-md text-primary hover:bg-gray-50 dark:hover:bg-gray-700">
                {label}
            </label>
            {preview && (
                <div className="mt-4 relative w-24 h-24">
                    <img src={preview} alt="Reference Preview" className="w-full h-full object-cover rounded-md" />
                    <button onClick={onRemove} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                        <XIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="p-4 bg-primary-light dark:bg-gray-800 rounded-lg shadow-inner">
            <h3 className="font-semibold mb-3 text-content-light dark:text-content-dark">Deskripsi Subjek</h3>
            <div className="flex flex-wrap gap-4 mb-4">
                {(['Deskripsi Teks', 'Foto Tunggal', 'Pasangan'] as const).map(option => {
                    const value: SubjectInputType = option === 'Deskripsi Teks' ? 'text' : (option === 'Foto Tunggal' ? 'photo' : 'couple');
                    return (
                        <label key={option} className="flex items-center gap-2 cursor-pointer text-sm text-content-light dark:text-content-dark">
                            <input
                                type="radio"
                                name="subjectType"
                                value={value}
                                checked={subjectInputType === value}
                                onChange={(e) => setSubjectInputType(e.target.value as SubjectInputType)}
                                className="form-radio text-primary dark:bg-gray-700 dark:border-gray-600"
                            />
                            {option}
                        </label>
                    );
                })}
            </div>
            <div key={subjectInputType} className="animate-fade-in">
                {subjectInputType === 'text' && (
                    <textarea
                        value={subjectDescription}
                        onChange={(e) => setSubjectDescription(e.target.value)}
                        placeholder="Deskripsikan subjek (misal: wanita muda, kulit sawo matang, rambut hitam panjang, pose berdiri tegak)."
                        rows={3}
                        className="w-full p-2 border border-border-light dark:border-border-dark rounded-md bg-bkg-light dark:bg-gray-700 text-content-light dark:text-content-dark placeholder-gray-400"
                    />
                )}
                {subjectInputType === 'photo' && (
                     <PhotoUploader 
                        id="subject-photo-single"
                        preview={singlePreview}
                        label="Upload Foto Referensi"
                        onFileChange={handleSingleFileChange}
                        onRemove={removeSinglePhoto}
                    />
                )}
                {subjectInputType === 'couple' && (
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-x-4 gap-y-2 p-2 bg-bkg-light dark:bg-gray-700 rounded-md">
                            {(['Satu Foto (Berdua)', 'Dua Foto (Terpisah)', 'Satu Foto + Deskripsi'] as const).map(option => {
                                const value: CoupleInputMode = option === 'Satu Foto (Berdua)' ? 'single_photo' : (option === 'Dua Foto (Terpisah)' ? 'dual_photo' : 'photo_and_text');
                                return (
                                    <label key={value} className="flex items-center gap-2 cursor-pointer text-sm">
                                        <input
                                            type="radio"
                                            name="coupleMode"
                                            value={value}
                                            checked={coupleInputMode === value}
                                            onChange={(e) => setCoupleInputMode(e.target.value as CoupleInputMode)}
                                            className="form-radio text-primary dark:bg-gray-600 border-gray-500"
                                        />
                                        {option}
                                    </label>
                                )
                            })}
                        </div>
                        
                        <div key={coupleInputMode} className="animate-fade-in">
                            {coupleInputMode === 'single_photo' && (
                                <PhotoUploader 
                                    id="subject-photo-couple-single"
                                    preview={couplePreviews[0]}
                                    label="Upload Foto Pasangan"
                                    onFileChange={(e) => handleCoupleFileChange(e, 0)}
                                    onRemove={() => removeCouplePhoto(0)}
                                />
                            )}
                            {coupleInputMode === 'dual_photo' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <PhotoUploader 
                                        id="subject-photo-couple-1"
                                        preview={couplePreviews[0]}
                                        label="Upload Foto Orang #1"
                                        onFileChange={(e) => handleCoupleFileChange(e, 0)}
                                        onRemove={() => removeCouplePhoto(0)}
                                    />
                                     <PhotoUploader 
                                        id="subject-photo-couple-2"
                                        preview={couplePreviews[1]}
                                        label="Upload Foto Orang #2"
                                        onFileChange={(e) => handleCoupleFileChange(e, 1)}
                                        onRemove={() => removeCouplePhoto(1)}
                                    />
                                </div>
                            )}
                            {coupleInputMode === 'photo_and_text' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                     <PhotoUploader 
                                        id="subject-photo-couple-text"
                                        preview={couplePreviews[0]}
                                        label="Upload Foto Orang #1"
                                        onFileChange={(e) => handleCoupleFileChange(e, 0)}
                                        onRemove={() => removeCouplePhoto(0)}
                                    />
                                    <div>
                                        <textarea
                                            value={coupleSecondPersonDescription}
                                            onChange={(e) => setCoupleSecondPersonDescription(e.target.value)}
                                            placeholder="Deskripsikan orang kedua (misal: pria Kaukasia, rambut pirang, mata biru)."
                                            rows={4}
                                            className="w-full p-2 border border-border-light dark:border-border-dark rounded-md bg-bkg-light dark:bg-gray-700 text-content-light dark:text-content-dark placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const FashionCategorySelector: React.FC<Pick<InputPanelProps, 'selectedCategories' | 'setSelectedCategories' | 'subjectInputType' | 'coupleInputMode'>> = ({ selectedCategories, setSelectedCategories, subjectInputType, coupleInputMode }) => {
    const EXCLUSIVE_CATEGORIES: FashionCategory[] = ["Pakaian Lengkap", "Kostum"];
    
    const selectedExclusiveCategory = useMemo(() => 
        EXCLUSIVE_CATEGORIES.find(cat => selectedCategories[cat]),
    [selectedCategories]);

    const isStandardCategorySelected = useMemo(() => 
        FASHION_CATEGORIES.some(cat => !EXCLUSIVE_CATEGORIES.includes(cat) && selectedCategories[cat]),
    [selectedCategories]);


    const handleCategoryChange = (category: FashionCategory) => {
        const isTogglingExclusive = EXCLUSIVE_CATEGORIES.includes(category);
        const isCurrentlySelected = !!selectedCategories[category];

        const newSelected: SelectedCategories = {};

        if (isTogglingExclusive) {
            if (!isCurrentlySelected) {
                newSelected[category] = true;
            }
        } else {
            const newStandard: SelectedCategories = {};
            FASHION_CATEGORIES.forEach(cat => {
                if (!EXCLUSIVE_CATEGORIES.includes(cat) && selectedCategories[cat]) {
                    newStandard[cat] = true;
                }
            });
            newStandard[category] = !isCurrentlySelected;
             Object.keys(newStandard).forEach(key => {
                if (newStandard[key as FashionCategory]) {
                    newSelected[key as FashionCategory] = true;
                }
            });
        }
        
        setSelectedCategories(newSelected);
    };
    
    return (
        <div className="p-4 bg-primary-light dark:bg-gray-800 rounded-lg shadow-inner">
            <h3 className="font-semibold mb-3 text-content-light dark:text-content-dark">Kategori Fashion</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {FASHION_CATEGORIES.map(category => {
                    const isThisCategoryExclusive = EXCLUSIVE_CATEGORIES.includes(category);
                    let isDisabled = false;

                    // Couple logic: single photo mode only allows exclusive categories
                    if (subjectInputType === 'couple' && coupleInputMode === 'single_photo') {
                        if (!isThisCategoryExclusive) {
                            isDisabled = true;
                        }
                    }

                    if (!isDisabled) {
                        if (selectedExclusiveCategory) {
                            isDisabled = category !== selectedExclusiveCategory;
                        } else if (isStandardCategorySelected) {
                            isDisabled = isThisCategoryExclusive;
                        }
                    }
                    
                    return (
                        <label key={category} className={`flex items-center gap-2 p-2 rounded-md border text-sm transition-colors ${selectedCategories[category] ? 'bg-primary text-white border-primary-dark' : 'bg-bkg-light dark:bg-gray-700 border-border-light dark:border-border-dark'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary'}`}>
                            <input
                                type="checkbox"
                                checked={!!selectedCategories[category]}
                                onChange={() => handleCategoryChange(category)}
                                disabled={isDisabled}
                                className="form-checkbox rounded text-primary focus:ring-primary-dark"
                            />
                            <span className="flex-1">{category}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

const ReferenceUploadArea: React.FC<{
    category: FashionCategory;
    fashionReferences: FashionReferences;
    setFashionReferences: (refs: FashionReferences) => void;
    title: string;
}> = ({ category, fashionReferences, setFashionReferences, title }) => {
    const files = fashionReferences[category] || [];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        if (newFiles.length === 0) return;

        const newReferenceFiles: ReferenceFile[] = newFiles.slice(0, 4 - files.length).map((file: File) => ({
            id: `${file.name}-${Date.now()}`,
            file,
            preview: URL.createObjectURL(file),
        }));

        setFashionReferences({
            ...fashionReferences,
            [category]: [...files, ...newReferenceFiles],
        });
    };

    const removeFile = (id: string) => {
        const fileToRemove = files.find(f => f.id === id);
        if (fileToRemove) {
            URL.revokeObjectURL(fileToRemove.preview);
        }
        setFashionReferences({
            ...fashionReferences,
            [category]: files.filter(f => f.id !== id),
        });
    };

    return (
        <div className="p-4 bg-primary-light dark:bg-gray-800 rounded-lg shadow-inner animate-fade-in">
            <h3 className="font-semibold mb-3 text-content-light dark:text-content-dark">{title}</h3>
            <input type="file" id={`upload-${category}-${title}`} className="hidden" accept="image/*" multiple onChange={handleFileChange} disabled={files.length >= 4} />
            <label htmlFor={`upload-${category}-${title}`} className={`cursor-pointer w-full text-center block py-2 px-4 border-2 border-dashed border-border-light dark:border-border-dark rounded-md mb-4 ${files.length >= 4 ? 'opacity-50 cursor-not-allowed' : 'text-primary hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                Upload Gambar Referensi ({files.length}/4)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {files.map(refFile => (
                    <div key={refFile.id} className="relative w-full aspect-square">
                        <img src={refFile.preview} alt={`Reference for ${category}`} className="w-full h-full object-cover rounded-md" />
                        <button onClick={() => removeFile(refFile.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WatermarkSettings: React.FC<Pick<
    InputPanelProps,
    'isWatermarkEnabled' | 'setIsWatermarkEnabled' |
    'watermarkText' | 'setWatermarkText' |
    'watermarkOpacity' | 'setWatermarkOpacity' |
    'watermarkPosition' | 'setWatermarkPosition'
>> = ({
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


export const InputPanel: React.FC<InputPanelProps> = (props) => {
    const { 
        subjectInputType,
        coupleInputMode,
        coupleOutfitDescription,
        setCoupleOutfitDescription,
        selectedCategories,
        poseDescription, 
        setPoseDescription, 
        backgroundDescription,
        setBackgroundDescription,
        onGenerate, 
        isLoading,
        hasGenerated,
        onReset,
        isRateLimited,
        lockoutSecondsRemaining,
        isDailyLimitReached,
        numberOfVariations,
        setNumberOfVariations,
        isLocked,
    } = props;
    
    const activeCategories = useMemo(() => FASHION_CATEGORIES.filter(cat => selectedCategories[cat]), [selectedCategories]);
    
    // Effect to manage pose description prefix for couples
    useEffect(() => {
        const prefix = 'Mereka ';
        if (subjectInputType === 'couple') {
            if (!poseDescription.startsWith(prefix) && poseDescription) {
                 // Prepend if user selected a library pose without the prefix
                setPoseDescription(prefix + poseDescription);
            } else if (!poseDescription) {
                // Set default pose for couples
                setPoseDescription(prefix);
            }
        } else {
             // Clear pose if switching away from couple
             if (poseDescription.startsWith(prefix)) {
                 setPoseDescription('');
             }
        }
    }, [subjectInputType, setPoseDescription]);


    const handleCustomCouplePoseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const userInput = e.target.value;
        const prefix = 'Mereka ';
        if (userInput.startsWith(prefix)) {
            setPoseDescription(userInput);
        } else {
            // Force prefix to remain
            setPoseDescription(prefix);
        }
    };


    const isFormValid = useMemo(() => {
        let isFashionInputValid = false;
        if (subjectInputType === 'couple' && coupleInputMode === 'single_photo') {
            isFashionInputValid = (
                (FASHION_CATEGORIES.some(cat => props.selectedCategories[cat] && (props.fashionReferences[cat]?.length ?? 0) > 0)) ||
                props.coupleOutfitDescription.trim() !== ''
            );
        } else if (subjectInputType === 'couple' && coupleInputMode === 'dual_photo') {
             isFashionInputValid = FASHION_CATEGORIES.some(cat => 
                props.selectedCategories[cat] && 
                ((props.fashionReferences[cat]?.length ?? 0) > 0 || (props.fashionReferencesP2[cat]?.length ?? 0) > 0)
            );
        }
        else {
            isFashionInputValid = FASHION_CATEGORIES.some(cat => 
                props.selectedCategories[cat] && (props.fashionReferences[cat]?.length ?? 0) > 0
            );
        }


        let isSubjectInputValid = false;
        if (props.subjectInputType === 'text') {
            isSubjectInputValid = props.subjectDescription.trim() !== '';
        } else if (props.subjectInputType === 'photo') {
            isSubjectInputValid = props.subjectReferencePhoto !== null;
        } else if (props.subjectInputType === 'couple') {
            const [photo1, photo2] = props.coupleReferencePhotos;
            if (props.coupleInputMode === 'single_photo') {
                isSubjectInputValid = photo1 !== null;
            } else if (props.coupleInputMode === 'dual_photo') {
                isSubjectInputValid = photo1 !== null && photo2 !== null;
            } else if (props.coupleInputMode === 'photo_and_text') {
                isSubjectInputValid = photo1 !== null && props.coupleSecondPersonDescription.trim() !== '';
            }
        }
        // For couples, must have valid subject AND valid fashion input
        if (subjectInputType === 'couple') {
            return isSubjectInputValid && isFashionInputValid;
        }

        return isFashionInputValid || isSubjectInputValid;
    }, [
        props.selectedCategories, 
        props.fashionReferences,
        props.fashionReferencesP2,
        props.subjectInputType, 
        props.subjectDescription, 
        props.subjectReferencePhoto,
        props.coupleInputMode,
        props.coupleReferencePhotos,
        props.coupleSecondPersonDescription,
        props.coupleOutfitDescription
    ]);

    const getButtonTitle = () => {
        if (isDailyLimitReached) return "Batas request harian telah tercapai.";
        if (isRateLimited) return `Rate limit tercapai. Tunggu ${lockoutSecondsRemaining} detik.`;
        if (!isFormValid) {
             if (subjectInputType === 'couple') return "Untuk pasangan, harap berikan referensi wajah DAN detail pakaian (baik melalui referensi gambar atau deskripsi).";
             return "Harap berikan deskripsi subjek atau pilih kategori fashion dan unggah gambar referensi.";
        }
        return "Buat gambar fashion Anda";
    };

    return (
        <div className="w-full lg:w-1/2 p-4 space-y-4 overflow-y-auto">
             <fieldset className="space-y-4" disabled={isLocked}>
                <SubjectInput {...props} />
                
                { /* Conditional Fashion Section */ }
                <FashionCategorySelector {...props} />

                {subjectInputType === 'couple' && coupleInputMode === 'single_photo' && (
                    <div className="p-4 bg-primary-light dark:bg-gray-800 rounded-lg shadow-inner animate-fade-in">
                        <h3 className="font-semibold mb-3 text-content-light dark:text-content-dark">Deskripsi Pakaian Pasangan</h3>
                        <textarea
                            value={coupleOutfitDescription}
                            onChange={(e) => setCoupleOutfitDescription(e.target.value)}
                            placeholder="Contoh: Mereka mengenakan pakaian pantai yang serasi, dengan kemeja Hawaii dan gaun musim panas."
                            rows={3}
                            className="w-full p-2 border border-border-light dark:border-border-dark rounded-md bg-bkg-light dark:bg-gray-700 text-content-light dark:text-content-dark placeholder-gray-400"
                            disabled={activeCategories.length > 0}
                        />
                         {activeCategories.length > 0 && <p className="text-xs mt-2 text-gray-500">Deskripsi dinonaktifkan karena referensi 'Pakaian Lengkap' atau 'Kostum' telah diunggah.</p>}
                    </div>
                )}
                
                {subjectInputType === 'couple' && activeCategories.length > 0 && coupleInputMode !== 'dual_photo' && (
                    <div className="p-2 -mb-2 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                            {coupleInputMode === 'single_photo' 
                                ? "Catatan: Referensi fashion ini akan diterapkan sebagai pakaian yang serasi untuk kedua subjek."
                                : "Catatan: Referensi fashion ini akan diterapkan pada subjek dari foto referensi."
                            }
                        </p>
                    </div>
                )}

                {activeCategories.map(cat => {
                    if (subjectInputType === 'couple' && coupleInputMode === 'dual_photo') {
                        const p1HasRef = (props.fashionReferences[cat]?.length ?? 0) > 0;
                        const p2HasRef = (props.fashionReferencesP2[cat]?.length ?? 0) > 0;
                        return (
                             <div key={cat} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md space-y-4 animate-fade-in">
                                <h3 className="font-semibold text-lg text-content-light dark:text-content-dark text-center border-b pb-2 border-border-light dark:border-border-dark">Referensi {cat}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ReferenceUploadArea
                                        category={cat}
                                        fashionReferences={props.fashionReferences}
                                        setFashionReferences={props.setFashionReferences}
                                        title="Orang 1"
                                    />
                                    <ReferenceUploadArea
                                        category={cat}
                                        fashionReferences={props.fashionReferencesP2}
                                        setFashionReferences={props.setFashionReferencesP2}
                                        title="Orang 2"
                                    />
                                </div>
                                {(p1HasRef && !p2HasRef) && (
                                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 italic">
                                        Catatan: Referensi Orang 1 untuk '{cat}' akan digunakan untuk kedua orang jika referensi Orang 2 tidak diunggah.
                                    </p>
                                )}
                                 {(!p1HasRef && p2HasRef) && (
                                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 italic">
                                        Catatan: Referensi Orang 2 untuk '{cat}' akan digunakan untuk kedua orang jika referensi Orang 1 tidak diunggah.
                                    </p>
                                )}
                            </div>
                        )
                    }
                    // Default behavior for single person, couple(single photo), and couple(photo+text)
                    return <ReferenceUploadArea key={cat} category={cat} fashionReferences={props.fashionReferences} setFashionReferences={props.setFashionReferences} title={`Referensi ${cat}`} />
                })}

                <div className="p-4 bg-primary-light dark:bg-gray-800 rounded-lg shadow-inner space-y-4">
                    <h3 className="font-semibold text-content-light dark:text-content-dark">Kontrol Pose</h3>
                     {subjectInputType === 'couple' ? (
                        <PoseLibrary 
                            onSelectPose={setPoseDescription} 
                            selectedPoseDescription={poseDescription}
                            poses={COUPLE_POSES}
                        />
                     ) : (
                        <PoseLibrary 
                            onSelectPose={setPoseDescription} 
                            selectedPoseDescription={poseDescription}
                            poses={POSES}
                        />
                     )}
                    <div>
                        <h4 className="text-sm font-medium mb-2 text-content-light dark:text-content-dark">Atau, Deskripsikan Pose Kustom</h4>
                        {subjectInputType === 'couple' ? (
                             <textarea
                                value={poseDescription}
                                onChange={handleCustomCouplePoseChange}
                                placeholder="Mulailah mengetik pose kustom Anda di sini."
                                rows={3}
                                className="w-full p-2 border border-border-light dark:border-border-dark rounded-md bg-bkg-light dark:bg-gray-700 text-content-light dark:text-content-dark placeholder-gray-400"
                            />
                        ) : (
                            <textarea
                                value={poseDescription}
                                onChange={(e) => setPoseDescription(e.target.value)}
                                placeholder="Default: Pose berdiri seluruh badan yang natural. Model harus terlihat percaya diri dan santai. Deskripsikan pose kustom Anda di sini."
                                rows={3}
                                className="w-full p-2 border border-border-light dark:border-border-dark rounded-md bg-bkg-light dark:bg-gray-700 text-content-light dark:text-content-dark placeholder-gray-400"
                            />
                        )}
                    </div>
                </div>
                
                <div className="p-4 bg-primary-light dark:bg-gray-800 rounded-lg shadow-inner">
                    <h3 className="font-semibold mb-3 text-content-light dark:text-content-dark">Background</h3>
                    <textarea
                        value={backgroundDescription}
                        onChange={(e) => setBackgroundDescription(e.target.value)}
                        placeholder="Default: Studio profesional, latar belakang kontras, pencahayaan dari belakang & cahaya alami dari depan. Deskripsikan latar belakang Anda di sini."
                        rows={3}
                        className="w-full p-2 border border-border-light dark:border-border-dark rounded-md bg-bkg-light dark:bg-gray-700 text-content-light dark:text-content-dark placeholder-gray-400"
                    />
                </div>

                <div className="p-4 bg-primary-light dark:bg-gray-800 rounded-lg shadow-inner">
                    <h3 className="font-semibold mb-3 text-content-light dark:text-content-dark">Variasi</h3>
                    <div className="flex justify-around items-center text-content-light dark:text-content-dark">
                        {[1, 2, 3, 4].map(num => (
                            <label key={num} className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                                <input
                                    type="radio"
                                    name="variations"
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

                <WatermarkSettings {...props} />
            </fieldset>

            <div className="pt-4 sticky bottom-0 bg-bkg-light dark:bg-bkg-dark py-2">
                <button
                    onClick={onGenerate}
                    disabled={isLoading || !isFormValid || isRateLimited || isDailyLimitReached || isLocked}
                    className={`w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isLoading ? 'bg-primary/80 animate-pulse' : 'disabled:bg-gray-400'}`}
                    title={getButtonTitle()}
                >
                    {isLoading ? (
                        <>
                            <span>Membuat</span>
                            <div className="flex items-center justify-center gap-1.5 ml-2">
                                <span className="h-2 w-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 rounded-full bg-white animate-bounce"></span>
                            </div>
                        </>
                    ) : isRateLimited ? (
                        `Tunggu (${lockoutSecondsRemaining}s)`
                    ) : (
                        'Buat Fashion'
                    )}
                </button>
                 {hasGenerated && (
                    <button
                        onClick={onReset}
                        className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors"
                    >
                        Atur Ulang Semua
                    </button>
                )}
            </div>
        </div>
    );
};