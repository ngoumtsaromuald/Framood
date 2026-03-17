import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useStudioStore } from '@/store/useStudioStore';
import { useToastStore } from '@/store/useToastStore';
import type { MoodCategory } from '@/types/emotion';
import MoodPicker from './MoodPicker';
import IntensitySlider from './IntensitySlider';
import QuickWords from './QuickWords';

type Step = 'mood' | 'intensity' | 'words' | 'generating';

const STEP_LABELS: Record<Step, string> = {
  mood: 'Comment te sens-tu ?',
  intensity: 'À quel point ?',
  words: 'Dis-en un peu plus…',
  generating: 'Framood crée ton image…',
};

export default function CheckIn() {
  const [step, setStep] = useState<Step>('mood');
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.addToast);

  const setMood = useStudioStore((s) => s.setMood);
  const setIntensity = useStudioStore((s) => s.setIntensity);
  const setMoodDescription = useStudioStore((s) => s.setMoodDescription);
  const generateAIContent = useStudioStore((s) => s.generateAIContent);
  const selectedMood = useStudioStore((s) => s.selectedMood);

  const handleMoodSelect = useCallback((mood: MoodCategory) => {
    setMood(mood);
    setStep('intensity');
  }, [setMood]);

  const handleIntensitySelect = useCallback((value: number) => {
    setIntensity(value);
    setStep('words');
  }, [setIntensity]);

  const handleWordsSubmit = useCallback(async (text: string) => {
    setMoodDescription(text);
    setStep('generating');

    await generateAIContent();

    // Check for error (fallback was applied)
    const error = useStudioStore.getState().generationError;
    if (error) {
      addToast('info', 'Mode manuel activé — l\'IA n\'a pas pu répondre');
    }

    navigate('/studio');
  }, [setMoodDescription, generateAIContent, navigate, addToast]);

  return (
    <div className="w-full">
      {/* Step indicator */}
      <div className="flex gap-2 mb-6 justify-center">
        {(['mood', 'intensity', 'words'] as const).map((s, i) => (
          <div
            key={s}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: step === s ? '32px' : '12px',
              background:
                step === s
                  ? 'var(--gold)'
                  : i < ['mood', 'intensity', 'words'].indexOf(step)
                    ? 'var(--gold-dark)'
                    : 'var(--border)',
            }}
          />
        ))}
      </div>

      {/* Step title */}
      <AnimatePresence mode="wait">
        <motion.h2
          key={step}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="font-display text-2xl text-center mb-6"
          style={{ color: 'var(--cream)' }}
        >
          {STEP_LABELS[step]}
        </motion.h2>
      </AnimatePresence>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {step === 'mood' && (
          <motion.div
            key="mood"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <MoodPicker onSelect={handleMoodSelect} />
          </motion.div>
        )}

        {step === 'intensity' && (
          <motion.div
            key="intensity"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <IntensitySlider onSelect={handleIntensitySelect} />
          </motion.div>
        )}

        {step === 'words' && selectedMood && (
          <motion.div
            key="words"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <QuickWords mood={selectedMood} onSubmit={handleWordsSubmit} />
          </motion.div>
        )}

        {step === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            >
              <Loader size={32} style={{ color: 'var(--gold)' }} />
            </motion.div>
            <p className="text-md font-body" style={{ color: 'var(--muted-2)' }}>
              Framood crée ton image…
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
