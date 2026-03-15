import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Palette, Share2, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import Button from '@/components/ui/Button';

const slides = [
  {
    icon: Sparkles,
    title: 'Ton humeur en un mot',
    description: 'Décris comment tu te sens. En 3 secondes, Framood comprend ton émotion et transforme ta vibe en image.',
    accent: 'var(--gold)',
  },
  {
    icon: Palette,
    title: 'Framood crée pour toi',
    description: "L'IA génère un visuel unique adapté à ton humeur. 40 styles artistiques, des effets cinéma, et ta touche personnelle.",
    accent: 'var(--gold-light)',
  },
  {
    icon: Share2,
    title: 'Partage ta vibe',
    description: "Exporte en Story, fond d'écran ou carré. Partage sur Instagram, TikTok — ou garde-le comme souvenir.",
    accent: 'var(--gold)',
  },
] as const;

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const { setOnboarded } = useAuthStore();
  const navigate = useNavigate();

  const isLast = currentSlide === slides.length - 1;

  const handleNext = async () => {
    if (!isLast) {
      setCurrentSlide((prev) => prev + 1);
      return;
    }

    setLoading(true);
    try {
      await setOnboarded();
      navigate('/', { replace: true });
    } catch {
      // Fail silently — store will retry
      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const slide = slides[currentSlide]!;
  const Icon = slide.icon;

  return (
    <div
      className="flex flex-col items-center justify-center min-h-dvh px-6 py-12"
      style={{ background: 'var(--bg)' }}
    >
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Skip button */}
        {!isLast && (
          <button
            onClick={async () => {
              await setOnboarded();
              navigate('/', { replace: true });
            }}
            className="self-end text-sm font-body mb-8"
            style={{ color: 'var(--muted)' }}
          >
            Passer
          </button>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="text-center space-y-8 w-full"
          >
            {/* Icon */}
            <motion.div
              className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center"
              style={{
                background: `${slide.accent}15`,
                boxShadow: `0 0 40px ${slide.accent}20`,
              }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Icon size={36} style={{ color: slide.accent }} />
            </motion.div>

            {/* Text */}
            <div className="space-y-3">
              <h2
                className="font-display text-3xl font-semibold"
                style={{ color: 'var(--cream)' }}
              >
                {slide.title}
              </h2>
              <p
                className="text-md font-body leading-relaxed"
                style={{ color: 'var(--muted-2)' }}
              >
                {slide.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex gap-2 mt-12 mb-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className="h-2 rounded-full transition-all duration-normal"
              style={{
                width: i === currentSlide ? 24 : 8,
                background: i === currentSlide ? 'var(--gold)' : 'var(--border)',
              }}
              aria-label={`Écran ${i + 1}`}
            />
          ))}
        </div>

        {/* Next / Start button */}
        <Button
          fullWidth
          loading={loading}
          onClick={handleNext}
          icon={isLast ? undefined : <ChevronRight size={18} />}
        >
          {isLast ? 'Commencer' : 'Suivant'}
        </Button>
      </div>
    </div>
  );
}
