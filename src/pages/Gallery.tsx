import { useState, useMemo } from 'react';
import { MoodCategory } from '@/types/emotion';
import { MoodEntry, useEntries } from '@/hooks/useEntries';
import { HeatMap, MoodFilter, GalleryGrid, EntryDetail } from '@/components/gallery';
import { differenceInDays } from 'date-fns';
// import { useAuthStore } from '@/store/useAuthStore';
// Assumes PaywallModal exists or will be implemented. We can mock it or leave placeholder
// import { PaywallModal } from '@/components/subscription/PaywallModal';
import { useToastStore } from '@/store/useToastStore';

export default function Gallery() {
  const [selectedMood, setSelectedMood] = useState<MoodCategory | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  // TODO: Implement PaywallModal in Phase 6
  // const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  
  const { addToast } = useToastStore();

  const isPro = false;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useEntries(selectedMood);

  const entries = useMemo(() => {
    return data?.pages.flat() || [];
  }, [data]);

  const handleEntryClick = (entry: MoodEntry) => {
    const daysOld = differenceInDays(new Date(), new Date(entry.created_at));
    const isLocked = daysOld > 7 && !isPro;

    if (isLocked) {
      // Show Paywall
      // setIsPaywallOpen(true);
      // fallback in case PaywallModal isn't implemented fully yet
      addToast('info', 'Cette mémoire est archivée. Passez à la version Pro pour y accéder.');
    } else {
      setSelectedEntry(entry);
    }
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
        <p className="text-[var(--error)]">Oups, impossible de charger vos mémoires.</p>
        <p className="text-sm text-[var(--muted-2)] mt-2">Vérifiez votre connexion internet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] md:min-h-screen relative pb-20 md:pb-8">
      {/* Header & HeatMap container - sticky for easy access */}
      <div className="sticky top-0 z-20 bg-[var(--bg)]/90 backdrop-blur-md pt-6 md:pt-8 px-4 md:px-8 pb-4 space-y-6 md:space-y-8 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold text-[var(--cream)]">
            Galerie
          </h1>
          {/* Possible filter or settings icon here */}
        </div>

        <HeatMap 
          entries={entries.map(e => ({ 
            created_at: e.created_at, 
            mood_category: e.mood_category 
          }))} 
          days={isPro ? 30 : 14} // Pro sees more history on heatmap
        />
        
        <MoodFilter 
          selectedMood={selectedMood} 
          onSelect={setSelectedMood} 
        />
      </div>

      {/* Grid container */}
      <div className="px-4 md:px-8 pt-6 flex-1">
        <GalleryGrid 
          entries={entries}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={!!hasNextPage}
          fetchNextPage={fetchNextPage}
          onEntryClick={handleEntryClick}
        />
      </div>

      {/* Modals & Overlays */}
      <EntryDetail 
        entry={selectedEntry} 
        onClose={() => setSelectedEntry(null)} 
      />

      {/* 
        <PaywallModal 
          isOpen={isPaywallOpen} 
          onClose={() => setIsPaywallOpen(false)} 
          feature="archive"
        /> 
      */}
    </div>
  );
}
