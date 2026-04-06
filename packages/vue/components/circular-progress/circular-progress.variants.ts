import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts`) so components can import `circularProgressVariants` from './circular-progress.variants' without creating a circular dependency through the index.
 */
export const circularProgressVariants = cva('relative inline-flex items-center justify-center')

export type CircularProgressVariants = VariantProps<typeof circularProgressVariants>
