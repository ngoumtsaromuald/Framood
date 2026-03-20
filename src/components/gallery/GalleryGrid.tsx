import { MoodEntry } from '@/hooks/useEntries';
import { EntryCard } from './EntryCard';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface GalleryGridProps {
  entries: MoodEntry[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  onEntryClick: (entry: MoodEntry) => void;
}

export function GalleryGrid({
  entries,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  onEntryClick,
}: GalleryGridProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading && entries.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-[var(--gold)]" size={32} />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-lg border border-dashed border-[var(--border)] bg-[var(--card)]">
        <p className="mt-3 text-md font-body text-[var(--muted-2)]">
          Aucune mémoire trouvée.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onClick={onEntryClick}
          />
        ))}
      </div>

      {/* Loading indicator for next page / Intersection target */}
      <div ref={ref} className="h-10 flex justify-center items-center pb-8">
        {isFetchingNextPage ? (
          <Loader2 className="animate-spin text-[var(--gold)]" size={24} />
        ) : hasNextPage ? (
          <span className="text-sm text-[var(--muted)]">Plus de mémoires...</span>
        ) : null}
      </div>
    </div>
  );
}
