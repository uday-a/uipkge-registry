import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

/**
 * Variant definitions live in their own file (rather than the package
 * `index.ts`) so consuming Vue SFCs can import without creating a circular
 * dependency through the index. See card.variants.ts for the canonical
 * example + the SSR symptom that motivated the split.
 */

export const questionnaireChoiceVariants = cva(
  'border-border bg-card hover:bg-accent/50 has-[:focus-visible]:border-ring has-[:focus-visible]:ring-ring/50 has-[:checked]:border-primary has-[:checked]:bg-accent flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50 has-[:focus-visible]:ring-[3px]',
)

export const questionnaireInputVariants = cva(
  'border-input bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]',
)

export type QuestionnaireChoiceVariants = VariantProps<typeof questionnaireChoiceVariants>
