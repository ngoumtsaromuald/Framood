import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import type { MoodCategory } from '@/types/emotion';

interface QuickWordsProps {
  mood: MoodCategory;
  onSubmit: (text: string) => void;
}

const SUGGESTIONS: Record<MoodCategory, string[]> = {
  melancholie: ['La pluie tombe dans ma tête', 'Tout semble gris', 'Je me sens vide'],
  energie: ['Rien ne m\'arrête', 'Je suis en feu', 'Mode conquête'],
  paix: ['Tout est calme', 'Je respire enfin', 'Moment de grâce'],
  colere: ['Trop c\'est trop', 'J\'explose', 'Ils ne comprennent pas'],
  nostalgie: ['C\'était mieux avant', 'Tu me manques', 'Les souvenirs restent'],
  amour: ['Mon cœur déborde', 'Toi c\'est différent', 'L\'amour partout'],
  anxiete: ['Et si tout s\'effondre', 'Mon esprit tourne', 'Trop de pensées'],
  gratitude: ['Merci pour tout', 'J\'ai de la chance', 'La vie est belle'],
};

const PLACEHOLDERS: Record<MoodCategory, string> = {
  melancholie: 'Décris ce que tu ressens dans ce brouillard…',
  energie: 'D\'où vient cette énergie ? Raconte…',
  paix: 'Qu\'est-ce qui t\'apaise en ce moment ?',
  colere: 'Qu\'est-ce qui te met hors de toi ?',
  nostalgie: 'Quel souvenir hante tes pensées ?',
  amour: 'Pour qui ou quoi bat ton cœur ?',
  anxiete: 'Qu\'est-ce qui t\'inquiète en ce moment ?',
  gratitude: 'De quoi es-tu reconnaissant(e) ?',
};

export default function QuickWords({ mood, onSubmit }: QuickWordsProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const suggestions = SUGGESTIONS[mood];
  const placeholder = PLACEHOLDERS[mood];

  useEffect(() => {
    // Auto-focus the textarea on mount
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  function handleChip(suggestion: string) {
    onSubmit(suggestion);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4"
    >
      <p
        className="text-md font-body text-center"
        style={{ color: 'var(--muted-2)' }}
      >
        En quelques mots…
      </p>

      {/* Quick suggestion chips */}
      <div className="flex gap-2 flex-wrap justify-center">
        {suggestions.map((s, i) => (
          <motion.button
            key={s}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, duration: 0.2 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-2 rounded-full text-sm font-body cursor-pointer transition-colors"
            style={{
              background: 'var(--gold-dim)',
              border: '1px solid var(--border-gold)',
              color: 'var(--gold-light)',
            }}
            onClick={() => handleChip(s)}
          >
            {s}
          </motion.button>
        ))}
      </div>

      {/* Textarea */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
        }}
      >
        <textarea
          ref={inputRef}
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full font-body text-md resize-none"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '14px 48px 14px 14px',
            color: 'var(--cream)',
            lineHeight: '1.7',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="absolute right-3 bottom-3 p-2 rounded-lg transition-opacity"
          style={{
            background: text.trim() ? 'var(--gold)' : 'var(--gold-dim)',
            opacity: text.trim() ? 1 : 0.4,
          }}
          aria-label="Envoyer"
        >
          <Send size={18} color={text.trim() ? '#0A0600' : 'var(--muted)'} />
        </button>
      </div>
    </motion.div>
  );
}
