import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export const signaturePadVariants = cva(
  'border-input bg-background inline-flex flex-col gap-1 rounded-lg border p-2 shadow-xs',
)

export type SignaturePadVariants = VariantProps<typeof signaturePadVariants>
