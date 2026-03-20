import { MoodEntry } from '@/hooks/useEntries';
import { EMOTIONS } from '@/types/emotion';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/cn';
import { Lock } from 'lucide-react';

interface EntryCardProps {
  entry: MoodEntry;
  onClick: (entry: MoodEntry) => void;
}

export function EntryCard({ entry, onClick }: EntryCardProps) {
  // Mock isPro for now (Stripe integration is in Phase 6)
  const isPro = false;
  
  // 7 days limit logic
  const daysOld = differenceInDays(new Date(), new Date(entry.created_at));
  const isLocked = daysOld > 7 && !isPro;

  const emotionConfig = EMOTIONS[entry.mood_category];

  return (
    <div
      onClick={() => onClick(entry)}
      className="relative aspect-[3/4] w-full cursor-pointer rounded-md overflow-hidden bg-[var(--card)] border border-[var(--border)] group"
    >
      {/* Content wrapper with conditional blur */}
      <div
        className={cn(
          "w-full h-full flex flex-col p-4 transition-all duration-300",
          isLocked && "filter blur-md pointer-events-none opacity-50"
        )}
        style={{
          background: `linear-gradient(to bottom right, ${emotionConfig.bg}, ${emotionConfig.bg2})`
        }}
      >
        {entry.image_url ? (
          <img
            src={entry.image_url}
            alt={entry.mood_text || entry.mood_category}
            className="w-full h-full object-cover rounded shadow-md"
            loading="lazy"
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <span className="text-3xl mb-2">{emotionConfig.emoji}</span>
            <span 
              className="text-sm line-clamp-3 font-medium px-2"
              style={{ color: emotionConfig.text, fontFamily: emotionConfig.font }}
            >
              {entry.mood_text || entry.mood_category}
            </span>
          </div>
        )}

        {/* Date overlay (when no image or as a fallback overlay) */}
        {!entry.image_url && (
           <div className="absolute top-2 left-2 text-xs font-mono font-medium opacity-70"
                style={{ color: emotionConfig.text }}>
             {format(new Date(entry.created_at), 'dd MMM yyyy')}
           </div>
        )}
      </div>

      {/* Hover Overlay */}
      {!isLocked && (
         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center border border-white/10 shadow-lg">
            <Lock size={20} className="text-[var(--gold)]" />
          </div>
          <span className="mt-3 text-sm font-medium text-white shadow-black drop-shadow-md">
            Archive Pro
          </span>
        </div>
      )}
    </div>
  );
}
