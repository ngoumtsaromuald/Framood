/** Mood categories — source of truth for all emotion-related types */
export const MOOD_CATEGORIES = [
  'melancholie',
  'energie',
  'paix',
  'colere',
  'nostalgie',
  'amour',
  'anxiete',
  'gratitude',
] as const;

export type MoodCategory = (typeof MOOD_CATEGORIES)[number];

/** Emotion visual config — maps to CSS custom properties in emotions.css */
export interface EmotionConfig {
  id: MoodCategory;
  label: string;
  emoji: string;
  bg: string;
  bg2: string;
  text: string;
  accent: string;
  font: string;
  weight: number;
  spacing: string;
  transform: string;
  grain: number;
  vignette: number;
  lightLeak: number;
  compatibleStyles: string[];
}

/** All 8 emotions with their visual configuration */
export const EMOTIONS: Record<MoodCategory, EmotionConfig> = {
  melancholie: {
    id: 'melancholie',
    label: 'Mélancolie',
    emoji: '🌧️',
    bg: '#1a2744',
    bg2: '#3d5a80',
    text: '#e8eaf6',
    accent: '#90a4ae',
    font: 'Playfair Display',
    weight: 400,
    spacing: '0.02em',
    transform: 'none',
    grain: 0.45,
    vignette: 0.70,
    lightLeak: 0,
    compatibleStyles: ['cosmos', 'aquarelle', 'manuscrit', 'poetique', 'cinema'],
  },
  energie: {
    id: 'energie',
    label: 'Énergie',
    emoji: '⚡',
    bg: '#f59e0b',
    bg2: '#dc2626',
    text: '#1c1917',
    accent: '#fbbf24',
    font: 'Inter',
    weight: 900,
    spacing: '-0.02em',
    transform: 'uppercase',
    grain: 0.05,
    vignette: 0.10,
    lightLeak: 0,
    compatibleStyles: ['bold', 'neon', 'retrowave', 'street', 'glitch'],
  },
  paix: {
    id: 'paix',
    label: 'Paix',
    emoji: '🍃',
    bg: '#d1fae5',
    bg2: '#6ee7b7',
    text: '#064e3b',
    accent: '#a7f3d0',
    font: 'Cormorant Garamond',
    weight: 300,
    spacing: '0.08em',
    transform: 'none',
    grain: 0.15,
    vignette: 0.20,
    lightLeak: 0,
    compatibleStyles: ['zen', 'minimal', 'aquarelle', 'tropical', 'journal'],
  },
  colere: {
    id: 'colere',
    label: 'Colère',
    emoji: '🔥',
    bg: '#1c0a0a',
    bg2: '#7f1d1d',
    text: '#fef2f2',
    accent: '#dc2626',
    font: 'Oswald',
    weight: 700,
    spacing: '0.01em',
    transform: 'uppercase',
    grain: 0.60,
    vignette: 0.80,
    lightLeak: 0,
    compatibleStyles: ['gothic', 'glitch', 'bold', 'street', 'broadcast'],
  },
  nostalgie: {
    id: 'nostalgie',
    label: 'Nostalgie',
    emoji: '📻',
    bg: '#78350f',
    bg2: '#b45309',
    text: '#fef3c7',
    accent: '#fcd34d',
    font: 'Lora',
    weight: 400,
    spacing: '0.04em',
    transform: 'none',
    grain: 0.55,
    vignette: 0.60,
    lightLeak: 1,
    compatibleStyles: ['polaroid', 'argentique', 'vhs', 'retro', 'journal'],
  },
  amour: {
    id: 'amour',
    label: 'Amour',
    emoji: '💗',
    bg: '#4c0519',
    bg2: '#9f1239',
    text: '#fff1f2',
    accent: '#fb7185',
    font: 'Nunito',
    weight: 300,
    spacing: '0.03em',
    transform: 'none',
    grain: 0.10,
    vignette: 0.35,
    lightLeak: 0,
    compatibleStyles: ['elegant', 'poetique', 'paris', 'lofi', 'liquid'],
  },
  anxiete: {
    id: 'anxiete',
    label: 'Anxiété',
    emoji: '🌀',
    bg: '#0f2027',
    bg2: '#203a43',
    text: '#e2e8f0',
    accent: '#64748b',
    font: 'Space Mono',
    weight: 400,
    spacing: '0em',
    transform: 'none',
    grain: 0.70,
    vignette: 0.50,
    lightLeak: 0,
    compatibleStyles: ['blueprint', 'glitch', 'sms', 'ticket', 'mono'],
  },
  gratitude: {
    id: 'gratitude',
    label: 'Gratitude',
    emoji: '✨',
    bg: '#1c1403',
    bg2: '#713f12',
    text: '#fefce8',
    accent: '#facc15',
    font: 'Crimson Text',
    weight: 400,
    spacing: '0.05em',
    transform: 'none',
    grain: 0.20,
    vignette: 0.25,
    lightLeak: 0,
    compatibleStyles: ['luxe', 'philo', 'encre', 'crystal', 'minimal'],
  },
};
