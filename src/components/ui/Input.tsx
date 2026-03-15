import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-1.5 text-sm font-body"
            style={{ color: 'var(--muted-2)' }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--muted)' }}
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-md px-4 py-2.5 text-md font-body',
              'border transition-all duration-normal',
              'placeholder:text-[var(--muted)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent',
              error
                ? 'border-[var(--error)] bg-[var(--error)]/5'
                : 'border-[var(--border)] bg-[var(--card)]',
              icon && 'pl-10',
              className
            )}
            style={{ color: 'var(--cream)' }}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm" style={{ color: 'var(--error)' }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
