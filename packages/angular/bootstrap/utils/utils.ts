import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Mirrors `@/lib/utils` cn() in Vue/React registries. Class strings stay identical. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
