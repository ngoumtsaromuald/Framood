import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, KeyRound } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { insforge } from '@/lib/insforge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';

type AuthStep = 'login' | 'register' | 'otp';

export default function Auth() {
  const { user, isLoading: authLoading, signUp, verifyOtp, signIn, signInWithOAuth } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);
  const navigate = useNavigate();

  const [step, setStep] = useState<AuthStep>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (step === 'login') {
        await signIn(email, password);
        addToast('success', 'Connexion réussie');
        navigate('/', { replace: true });
      } else if (step === 'register') {
        const { requiresVerification } = await signUp(email, password);
        if (requiresVerification) {
          setStep('otp');
          setResendTimer(60);
          addToast('info', 'Code de vérification envoyé par email');
        } else {
          addToast('success', 'Compte créé');
          navigate('/', { replace: true });
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(msg);
      addToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!paste) return;
    const newOtp = [...otp];
    for (let i = 0; i < paste.length; i++) {
      newOtp[i] = paste[i]!;
    }
    setOtp(newOtp);
    const focusIdx = Math.min(paste.length, 5);
    otpRefs.current[focusIdx]?.focus();
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Entrez le code à 6 chiffres');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await verifyOtp(email, code);
      addToast('success', 'Email vérifié — bienvenue sur Framood !');
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Code invalide';
      setError(msg);
      addToast('error', msg);
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await insforge.auth.resendVerificationEmail({ email });
      setResendTimer(60);
      addToast('info', 'Code renvoyé');
    } catch {
      addToast('error', 'Impossible de renvoyer le code');
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      await signInWithOAuth(provider);
    } catch {
      addToast('error', `Erreur de connexion ${provider}`);
    }
  };

  // Auto-submit OTP when all 6 digits entered
  useEffect(() => {
    if (otp.every((d) => d !== '') && step === 'otp') {
      handleVerifyOtp();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, step]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh" style={{ background: 'var(--bg)' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-dvh px-6 py-12"
      style={{ background: 'var(--bg)' }}
    >
      <div className="w-full max-w-sm space-y-8">
        {/* Branding */}
        <div className="text-center space-y-2">
          <h1
            className="font-display text-4xl font-semibold tracking-tight"
            style={{ color: 'var(--gold)' }}
          >
            Framood
          </h1>
          <p className="text-md font-body" style={{ color: 'var(--muted-2)' }}>
            Ton humeur, encadrée.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'otp' ? (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div
                  className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
                  style={{ background: 'var(--gold-dim)' }}
                >
                  <KeyRound size={24} style={{ color: 'var(--gold)' }} />
                </div>
                <h2 className="text-xl font-body font-medium" style={{ color: 'var(--cream)' }}>
                  Vérifie ton email
                </h2>
                <p className="text-sm" style={{ color: 'var(--muted-2)' }}>
                  Code envoyé à <strong style={{ color: 'var(--cream)' }}>{email}</strong>
                </p>
              </div>

              {/* OTP inputs */}
              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-13 text-center text-xl font-mono rounded-md border transition-all focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent"
                    style={{
                      background: 'var(--card)',
                      borderColor: 'var(--border)',
                      color: 'var(--cream)',
                    }}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {error && (
                <p className="text-center text-sm" style={{ color: 'var(--error)' }}>
                  {error}
                </p>
              )}

              <Button
                fullWidth
                loading={loading}
                onClick={handleVerifyOtp}
              >
                Vérifier
              </Button>

              <div className="text-center">
                <button
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                  className="text-sm font-body transition-opacity disabled:opacity-40"
                  style={{ color: 'var(--gold)' }}
                >
                  {resendTimer > 0
                    ? `Renvoyer dans ${resendTimer}s`
                    : 'Renvoyer le code'}
                </button>
              </div>

              <button
                onClick={() => { setStep('register'); setOtp(['', '', '', '', '', '']); setError(''); }}
                className="w-full text-center text-sm font-body"
                style={{ color: 'var(--muted)' }}
              >
                ← Retour
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="ton@email.com"
                  icon={<Mail size={18} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />

                <Input
                  label="Mot de passe"
                  type="password"
                  placeholder={step === 'register' ? 'Min. 6 caractères' : '••••••'}
                  icon={<Lock size={18} />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete={step === 'register' ? 'new-password' : 'current-password'}
                />

                {error && (
                  <p className="text-sm" style={{ color: 'var(--error)' }}>
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  icon={<ArrowRight size={18} />}
                >
                  {step === 'login' ? 'Se connecter' : "S'inscrire"}
                </Button>
              </form>

              {/* Toggle login/register */}
              <p className="mt-4 text-center text-sm font-body" style={{ color: 'var(--muted-2)' }}>
                {step === 'login' ? (
                  <>
                    Pas encore de compte ?{' '}
                    <button
                      onClick={() => { setStep('register'); setError(''); }}
                      className="font-medium underline underline-offset-2"
                      style={{ color: 'var(--gold)' }}
                    >
                      S'inscrire
                    </button>
                  </>
                ) : (
                  <>
                    Déjà un compte ?{' '}
                    <button
                      onClick={() => { setStep('login'); setError(''); }}
                      className="font-medium underline underline-offset-2"
                      style={{ color: 'var(--gold)' }}
                    >
                      Se connecter
                    </button>
                  </>
                )}
              </p>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                <span className="text-xs font-body" style={{ color: 'var(--muted)' }}>ou</span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>

              {/* OAuth */}
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => handleOAuth('google')}
                  icon={
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  }
                >
                  Continuer avec Google
                </Button>
                <Button
                  variant="ghost"
                  fullWidth
                  onClick={() => handleOAuth('github')}
                  icon={
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                  }
                >
                  Continuer avec GitHub
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
