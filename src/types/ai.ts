import type { MoodCategory } from './emotion';

/** Response structure from the Claude AI generator */
export interface AIGeneratedContent {
  main_text: string;
  sub_text: string;
  tag: string;
  suggested_mood: MoodCategory;
  suggested_style: string;
  confidence: number;
}
