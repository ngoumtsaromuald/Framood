import { cn } from '@/lib/cn';
import { EMOTIONS, MoodCategory } from '@/types/emotion';
import { useMemo } from 'react';
import { format, subDays } from 'date-fns';

interface HeatMapProps {
  entries: { created_at: string; mood_category: MoodCategory }[];
  days?: number;
}

export function HeatMap({ entries, days = 30 }: HeatMapProps) {
  // Generate an array of the last `days` days
  const heatMapDays = useMemo(() => {
    const today = new Date();
    const result = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateString = format(date, 'yyyy-MM-dd');
      
      // Find the first entry for this day (if any)
      const entryForDay = entries.find(
        (e) => format(new Date(e.created_at), 'yyyy-MM-dd') === dateString
      );

      result.push({
        date,
        mood: entryForDay ? entryForDay.mood_category : null,
      });
    }
    
    return result;
  }, [entries, days]);

  return (
    <div className="w-full space-y-2">
      <h3 className="text-sm font-medium" style={{ color: 'var(--muted-2)' }}>
        Bande de chaleur ({days} derniers jours)
      </h3>
      <div className="flex w-full gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {heatMapDays.map((day, idx) => {
          const emotionConfig = day.mood ? EMOTIONS[day.mood] : null;
          
          return (
            <div
              key={idx}
              className={cn(
                "h-8 flex-1 min-w-[8px] rounded-sm transition-opacity duration-300",
                !day.mood && "opacity-20"
              )}
              style={{
                backgroundColor: emotionConfig ? emotionConfig.accent : 'var(--border)',
              }}
              title={day.mood ? `${format(day.date, 'dd/MM')} - ${emotionConfig?.label}` : format(day.date, 'dd/MM')}
            />
          );
        })}
      </div>
    </div>
  );
}
