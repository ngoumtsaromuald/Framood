import { create } from 'zustand';
import type { MoodCategory } from '@/types/emotion';
import type { AIGeneratedContent } from '@/types/ai';
import type { ExportFormat } from '@/types/frame';
import { generateContent, createFallbackContent } from '@/lib/ai-generator';
import { resolveStyle } from '@/lib/emotion-engine';
import { FRAMES } from '@/components/frames';

interface StudioState {
  // Check-in
  selectedMood: MoodCategory | null;
  intensity: number;
  moodDescription: string;

  // AI content
  aiContent: AIGeneratedContent | null;
  isGenerating: boolean;
  generationError: string | null;

  // Studio
  selectedFrameId: string;
  selectedTheme: string;
  text: string;
  subtext: string;
  tag: string;
  exportFormat: ExportFormat;

  // Actions
  setMood: (mood: MoodCategory) => void;
  setIntensity: (n: number) => void;
  setMoodDescription: (desc: string) => void;
  generateAIContent: () => Promise<void>;
  applyAIContent: (content: AIGeneratedContent) => void;
  setFrame: (id: string, theme?: string) => void;
  setText: (text: string) => void;
  setSubtext: (sub: string) => void;
  setTag: (tag: string) => void;
  setExportFormat: (f: ExportFormat) => void;
  reset: () => void;
}

const initialState = {
  selectedMood: null as MoodCategory | null,
  intensity: 5,
  moodDescription: '',
  aiContent: null as AIGeneratedContent | null,
  isGenerating: false,
  generationError: null as string | null,
  selectedFrameId: FRAMES[0]!.id,
  selectedTheme: FRAMES[0]!.themes?.[0]?.cls ?? '',
  text: '',
  subtext: '',
  tag: '',
  exportFormat: 'story' as ExportFormat,
};

export const useStudioStore = create<StudioState>((set, get) => ({
  ...initialState,

  setMood: (mood) => set({ selectedMood: mood }),

  setIntensity: (n) => set({ intensity: n }),

  setMoodDescription: (desc) => set({ moodDescription: desc }),

  generateAIContent: async () => {
    const { selectedMood, intensity, moodDescription } = get();
    if (!selectedMood) return;

    set({ isGenerating: true, generationError: null });

    try {
      const content = await generateContent(
        moodDescription || selectedMood,
        selectedMood,
        intensity,
      );
      const state = get();
      // Resolve the suggested style to a valid frame
      // For now treat as free user (isPro: false) — will integrate subscription later
      const frame = resolveStyle(content.suggested_style, selectedMood, false);

      set({
        aiContent: content,
        isGenerating: false,
        text: content.main_text,
        subtext: content.sub_text,
        tag: content.tag,
        selectedFrameId: frame.id,
        selectedTheme: frame.themes?.[0]?.cls ?? state.selectedTheme,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('[Framood] AI generation failed:', message);

      // Fallback: use raw text in a default style
      const fallback = createFallbackContent(
        get().moodDescription || '',
        selectedMood,
      );

      const frame = resolveStyle(fallback.suggested_style, selectedMood, false);
      set({
        aiContent: fallback,
        isGenerating: false,
        generationError: message,
        text: fallback.main_text,
        subtext: fallback.sub_text,
        tag: fallback.tag,
        selectedFrameId: frame.id,
        selectedTheme: frame.themes?.[0]?.cls ?? '',
      });
    }
  },

  applyAIContent: (content) => {
    const mood = get().selectedMood || content.suggested_mood;
    const frame = resolveStyle(content.suggested_style, mood, false);
    set({
      aiContent: content,
      text: content.main_text,
      subtext: content.sub_text,
      tag: content.tag,
      selectedFrameId: frame.id,
      selectedTheme: frame.themes?.[0]?.cls ?? '',
    });
  },

  setFrame: (id, theme) => {
    const frame = FRAMES.find((f) => f.id === id);
    if (!frame) return;
    set({
      selectedFrameId: id,
      selectedTheme: theme ?? frame.themes?.[0]?.cls ?? '',
    });
  },

  setText: (text) => set({ text }),
  setSubtext: (sub) => set({ subtext: sub }),
  setTag: (tag) => set({ tag }),
  setExportFormat: (f) => set({ exportFormat: f }),

  reset: () => set(initialState),
}));
