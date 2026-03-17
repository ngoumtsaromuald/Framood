import { EMOTIONS, type MoodCategory, type EmotionConfig } from '@/types/emotion';
import { FRAMES, getFramesForMood, getDefaultFrame } from '@/components/frames';
import type { FrameMeta } from '@/types/frame';

/** Get the emotion config for a given mood */
export function getEmotionConfig(mood: MoodCategory): EmotionConfig {
  return EMOTIONS[mood];
}

/** Get recommended styles sorted by relevance for a mood */
export function getRecommendedStyles(mood: MoodCategory, isPro: boolean): FrameMeta[] {
  const config = EMOTIONS[mood];
  const compatible = getFramesForMood(mood, isPro);

  // Sort by: compatible styles first (in order), then other available styles
  const priorityIds = config.compatibleStyles;
  const prioritized = compatible.sort((a, b) => {
    const aIdx = priorityIds.indexOf(a.id);
    const bIdx = priorityIds.indexOf(b.id);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return 0;
  });

  return prioritized;
}

/** Build the emotional context string for the AI prompt */
export function buildPromptContext(mood: MoodCategory, intensity: number): string {
  const config = EMOTIONS[mood];
  const intensityLabel =
    intensity <= 3 ? 'légère' :
    intensity <= 6 ? 'modérée' :
    'intense';

  return `Émotion : ${config.label} (intensité ${intensityLabel}, ${intensity}/10)`;
}

/** Get the best default frame for an AI-suggested style */
export function resolveStyle(suggestedStyle: string, mood: MoodCategory, isPro: boolean): FrameMeta {
  // Try to find the exact suggested style
  const exact = FRAMES.find(f => f.id === suggestedStyle && (isPro || !f.isPro));
  if (exact) return exact;

  // Fallback to default for this mood
  return getDefaultFrame(mood, isPro);
}

export { EMOTIONS, type MoodCategory, type EmotionConfig };
