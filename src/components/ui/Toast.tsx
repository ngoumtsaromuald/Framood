import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Info, XCircle, X } from 'lucide-react';
import { useToastStore, type ToastType } from '@/store/useToastStore';

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={20} />,
  info: <Info size={20} />,
  error: <XCircle size={20} />,
};

const colorMap: Record<ToastType, string> = {
  success: 'var(--success)',
  info: 'var(--gold)',
  error: 'var(--error)',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 md:bottom-auto md:top-4 md:left-auto md:right-4 md:translate-x-0">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 px-4 py-3 rounded-md shadow-md min-w-[280px] max-w-[360px]"
            style={{
              background: 'var(--card-2)',
              border: `1px solid ${colorMap[toast.type]}33`,
              color: 'var(--cream)',
            }}
          >
            <span style={{ color: colorMap[toast.type] }}>
              {iconMap[toast.type]}
            </span>
            <span className="flex-1 text-sm font-body">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
              aria-label="Fermer"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
