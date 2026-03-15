import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import Spinner from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles = {
  primary:
    'bg-[var(--gold)] text-[#0A0600] hover:bg-[var(--gold-light)] active:bg-[var(--gold-dark)]',
  secondary:
    'border border-[var(--border-gold)] bg-transparent text-[var(--gold)] hover:bg-[var(--gold-dim)]',
  ghost:
    'bg-white/[0.04] border border-[var(--border)] text-[var(--cream)] hover:bg-white/[0.08]',
  danger:
    'bg-[var(--error)] text-white hover:brightness-110',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-md gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-body font-medium rounded-md',
        'transition-all duration-normal',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Spinner size={size === 'lg' ? 'md' : 'sm'} className={variant === 'primary' ? '!text-[#0A0600]' : ''} />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
}
