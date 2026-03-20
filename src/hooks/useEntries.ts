import { useInfiniteQuery } from '@tanstack/react-query';
import { insforge } from '@/lib/insforge';
import { MoodCategory } from '@/types/emotion';
import { ExportFormat } from '@/types/frame';

// The type representing a single mood entry row from the DB
export interface MoodEntry {
  id: string;
  user_id: string;
  created_at: string;
  mood_category: MoodCategory;
  mood_text: string | null;
  intensity_score: number | null;
  style_id: string;
  style_config: {
    theme?: string;
    textColor?: 'light' | 'dark';
    subtext?: string;
    tag?: string;
  };
  image_url: string | null;
  export_format: ExportFormat;
  is_shared_globally: boolean;
  ai_generated: boolean;
  ai_prompt: string | null;
}

const PAGE_SIZE = 20;

export function useEntries(moodFilter: MoodCategory | null = null) {
  return useInfiniteQuery({
    queryKey: ['entries', moodFilter],
    queryFn: async ({ pageParam = 0 }) => {
      let query = insforge.database
        .from('mood_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

      if (moodFilter) {
        query = query.eq('mood_category', moodFilter);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as MoodEntry[];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length; // Next page index
    },
  });
}
