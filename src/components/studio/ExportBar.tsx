import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Image, Save } from 'lucide-react';
import { useStudioStore } from '@/store/useStudioStore';
import { useToastStore } from '@/store/useToastStore';
import { useAuthStore } from '@/store/useAuthStore';
import { exportToPng, shareImage, downloadImage } from '@/lib/export-engine';
import { insforge } from '@/lib/insforge';
import { FRAMES } from '@/components/frames';
import FormatPicker from './FormatPicker';
import type { MoodCategory } from '@/types/emotion';

interface ExportBarProps {
  exportRef: React.RefObject<HTMLElement | null>;
}

export default function ExportBar({ exportRef }: ExportBarProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showFormatPicker, setShowFormatPicker] = useState(false);
  const exportFormat = useStudioStore((s) => s.exportFormat);
  const selectedFrameId = useStudioStore((s) => s.selectedFrameId);
  const text = useStudioStore((s) => s.text);
  const subtext = useStudioStore((s) => s.subtext);
  const tag = useStudioStore((s) => s.tag);
  const selectedTheme = useStudioStore((s) => s.selectedTheme);
  const moodCategory = useStudioStore((s) => s.selectedMood);
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.addToast);

  const getExportOptions = useCallback(() => {
    const frame = FRAMES.find((f) => f.id === selectedFrameId);
    return {
      grain: frame?.noGrain ? 0 : 0.3,
      vignette: frame?.noVignette ? 0 : 0.4,
    };
  }, [selectedFrameId]);

  const handleExport = useCallback(async () => {
    if (!exportRef.current || isExporting) return;
    setIsExporting(true);

    try {
      const blob = await exportToPng(
        exportRef.current,
        exportFormat,
        getExportOptions(),
      );

      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `framood-${timestamp}.png`;
      const result = await shareImage(blob, filename);

      if (result === 'shared') {
        addToast('success', 'Partagé avec succès');
      } else if (result === 'copied') {
        addToast('success', 'Image copiée dans le presse-papier');
      } else {
        addToast('success', 'Image téléchargée');
      }
    } catch (err) {
      console.error('[Framood] Export failed:', err);
      addToast('error', 'Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  }, [exportRef, exportFormat, isExporting, getExportOptions, addToast]);

  const handleSaveToGallery = useCallback(async () => {
    if (!exportRef.current || isSaving || !user) return;
    
    // Default mood if none selected
    const mood = moodCategory || 'paix';
    
    setIsSaving(true);

    try {
      // 1. Export to PNG
      const blob = await exportToPng(
        exportRef.current,
        exportFormat,
        getExportOptions(),
      );

      // 2. Upload to storage
      const timestamp = Date.now();
      const filename = `${user.id}-${timestamp}.png`;
      
      const { data: uploadData, error: uploadError } = await insforge.storage
        .from('mood-frames')
        .upload(filename, blob);

      if (uploadError) throw uploadError;

      // 3. Save to database
      const { error: dbError } = await insforge.database
        .from('mood_entries')
        .insert([{
          user_id: user.id,
          mood_category: mood as MoodCategory,
          mood_text: text,
          style_id: selectedFrameId,
          style_config: {
            theme: selectedTheme,
            subtext,
            tag,
          },
          image_url: uploadData.url,
          export_format: exportFormat,
          ai_generated: false,
        }]);

      if (dbError) throw dbError;

      addToast('success', 'Sauvegardé dans la galerie ✨');
    } catch (err) {
      console.error('[Framood] Save failed:', err);
      addToast('error', 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  }, [exportRef, exportFormat, isSaving, user, text, subtext, tag, selectedFrameId, selectedTheme, moodCategory, getExportOptions, addToast]);

  const handleDownload = useCallback(async () => {
    if (!exportRef.current || isExporting) return;
    setIsExporting(true);

    try {
      const blob = await exportToPng(
        exportRef.current,
        exportFormat,
        getExportOptions(),
      );
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadImage(blob, `framood-${timestamp}.png`);
      addToast('success', 'Image téléchargée');
    } catch (err) {
      console.error('[Framood] Download failed:', err);
      addToast('error', 'Erreur lors du téléchargement');
    } finally {
      setIsExporting(false);
    }
  }, [exportRef, exportFormat, isExporting, getExportOptions, addToast]);

  const FORMAT_LABELS: Record<string, string> = {
    story: 'Story',
    wallpaper: 'Fond',
    square: 'Carré',
    desktop: 'Desktop',
  };

  return (
    <>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-6 pt-3"
        style={{
          background: 'linear-gradient(to top, var(--bg) 60%, transparent)',
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {/* Format button */}
          <button
            onClick={() => setShowFormatPicker(true)}
            className="flex items-center gap-2 px-3 py-3 rounded-xl text-xs font-body transition-colors"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              color: 'var(--muted-2)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            <Image size={16} />
            {FORMAT_LABELS[exportFormat]}
          </button>

          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-body transition-colors"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              color: 'var(--muted-2)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              opacity: isExporting ? 0.5 : 1,
            }}
          >
            <Download size={16} />
          </button>

          {/* Save to gallery button */}
          <button
            onClick={handleSaveToGallery}
            disabled={isSaving || !user}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-body font-medium transition-colors"
            style={{
              background: isSaving ? 'var(--gold-dark)' : 'var(--gold)',
              color: '#0A0600',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              >
                <Save size={18} />
              </motion.div>
            ) : (
              <Save size={18} />
            )}
            {isSaving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>

          {/* Share button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-body transition-colors"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)',
              color: 'var(--muted-2)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              opacity: isExporting ? 0.5 : 1,
            }}
          >
            <Share2 size={16} />
          </button>
        </div>
      </motion.div>

      <FormatPicker
        isOpen={showFormatPicker}
        onClose={() => setShowFormatPicker(false)}
      />
    </>
  );
}
