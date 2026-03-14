import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes with clsx — avoids class conflicts */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
