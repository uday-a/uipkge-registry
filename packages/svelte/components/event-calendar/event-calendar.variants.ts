import { cva, type VariantProps } from 'class-variance-authority'

export const calendarEventVariants = cva(
  'group relative flex cursor-pointer flex-col overflow-hidden text-left transition-colors select-none border font-normal focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default: 'bg-secondary/80 text-secondary-foreground border-border/50 hover:bg-secondary',
        primary: 'bg-primary/10 text-primary border-primary/25 hover:bg-primary/20',
        secondary: 'bg-muted/90 text-foreground border-border/60 hover:bg-muted',
        success:
          'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20',
        destructive: 'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20',
        info: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30 hover:bg-sky-500/20',
        purple: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/20',
        rose: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20',
      },
      size: {
        sm: 'rounded-sm px-1.5 py-0.5 text-[11px] leading-tight',
        default: 'rounded-md px-2 py-1 text-xs leading-normal',
        lg: 'rounded-md px-2.5 py-1.5 text-sm leading-snug',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type CalendarEventVariants = VariantProps<typeof calendarEventVariants>
