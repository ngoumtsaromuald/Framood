import { MoodEntry } from '@/hooks/useEntries';
import { EMOTIONS } from '@/types/emotion';
import { format } from 'date-fns';
import { Download, Share2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadImage, shareImage } from '@/lib/export-engine';
import { useToastStore } from '@/store/useToastStore';
import { useState } from 'react';

interface EntryDetailProps {
  entry: MoodEntry | null;
  onClose: () => void;
}

export function EntryDetail({ entry, onClose }: EntryDetailProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { addToast } = useToastStore();

  if (!entry) return null;

  const emotionConfig = EMOTIONS[entry.mood_category];

  const handleShare = async () => {
    if (!entry.image_url) {
      addToast('error', 'Aucune image à partager.');
      return;
    }
    
    try {
      setIsExporting(true);
      // Pour l'instant on télécharge l'image distante pour la partager,
      // En production, il vaut mieux avoir l'URL signée Insforge avec un proxy si cross-origin
      const response = await fetch(entry.image_url);
      const blob = await response.blob();
      
      const fileName = `framood-${entry.style_id}-${format(new Date(entry.created_at), 'yyyyMMdd')}.png`;
      await shareImage(blob, fileName);
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors du partage.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = async () => {
    if (!entry.image_url) {
      addToast('error', 'Aucune image à télécharger.');
      return;
    }

    try {
      setIsExporting(true);
      const response = await fetch(entry.image_url);
      const blob = await response.blob();
      
      const fileName = `framood-${entry.style_id}-${format(new Date(entry.created_at), 'yyyyMMdd')}.png`;
      downloadImage(blob, fileName);
      addToast('success', 'Image sauvegardée !');
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur lors du téléchargement.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-md"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 z-10 w-full bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex flex-col">
            <span className="text-white font-medium">
              {format(new Date(entry.created_at), 'dd MMM yyyy')}
            </span>
            <span className="text-sm flex items-center gap-1.5 opacity-80" style={{ color: emotionConfig.accent }}>
              <span>{emotionConfig.emoji}</span>
              {emotionConfig.label}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Image Container */}
        <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
           {entry.image_url ? (
             <motion.img
               initial={{ scale: 0.95 }}
               animate={{ scale: 1 }}
               src={entry.image_url}
               alt="Entry"
               className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
             />
           ) : (
             <div 
               className="w-full max-w-sm aspect-[9/16] rounded-xl flex flex-col items-center justify-center text-center p-8 border border-white/10"
               style={{ background: `linear-gradient(to bottom right, ${emotionConfig.bg}, ${emotionConfig.bg2})` }}
             >
               <span className="text-6xl mb-6">{emotionConfig.emoji}</span>
               <p 
                 className="text-xl"
                 style={{ color: emotionConfig.text, fontFamily: emotionConfig.font }}
               >
                 {entry.mood_text || 'Aucun texte sauvegardé'}
               </p>
             </div>
           )}
        </div>

        {/* Bottom Actions */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="p-6 pb-10 flex gap-4 w-full max-w-md mx-auto"
        >
          <button
            onClick={handleShare}
            disabled={isExporting || !entry.image_url}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <Share2 size={20} />
            <span className="font-medium">Partager</span>
          </button>
          
          <button
            onClick={handleDownload}
            disabled={isExporting || !entry.image_url}
            className="flex-[2] flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[var(--gold)] text-[#0A0600] hover:bg-[var(--gold-light)] transition-colors shadow-[var(--shadow-gold)] disabled:opacity-50"
          >
            <Download size={20} />
            <span className="font-medium font-body">Enregistrer</span>
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
