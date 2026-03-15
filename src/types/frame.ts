import type { ComponentType } from 'react';

/** Props shared by all 40 Frame components */
export interface FrameProps {
  text: string;
  subtext?: string;
  tag?: string;
  theme?: string;
  textColor?: 'light' | 'dark';
  photoUrl?: string;
  rotation?: number;
}

/** Theme option for styles that support multiple themes */
export interface ThemeOption {
  cls: string;
  label: string;
  gradient: string;
}

/** Metadata for a single frame style in the registry */
export interface FrameMeta {
  id: string;
  label: string;
  component: ComponentType<FrameProps>;
  isPro: boolean;
  moods: string[];
  hasPhoto: boolean;
  hasThemes: boolean;
  themes?: ThemeOption[];
  noGrain: boolean;
  noVignette: boolean;
}
