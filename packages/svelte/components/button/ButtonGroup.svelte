<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
    orientation?: 'horizontal' | 'vertical'
    attached?: boolean
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    class: className,
    orientation = 'horizontal',
    attached = true,
    children,
    ref = $bindable(null),
    ...restProps
  }: ButtonGroupProps = $props()
</script>

<div
  bind:this={ref}
  role="group"
  data-uipkge=""
  data-slot="button-group"
  data-orientation={orientation}
  data-attached={attached ? '' : undefined}
  class={cn(
    'inline-flex items-center',
    orientation === 'vertical' ? 'flex-col items-stretch' : 'flex-row',
    attached && [
      '[&>[data-slot=button]]:relative [&>[data-slot=button]:focus-visible]:z-20 [&>[data-slot=button]:hover]:z-10',
      '[&>button]:relative [&>button:focus-visible]:z-20 [&>button:hover]:z-10',
      orientation === 'horizontal' && [
        '[&>[data-slot=button]]:rounded-none [&>button]:rounded-none',
        '[&>[data-slot=button]:first-child]:rounded-l-md [&>button:first-child]:rounded-l-md',
        '[&>[data-slot=button]:last-child]:rounded-r-md [&>button:last-child]:rounded-r-md',
        '[&>[data-slot=button]:only-child]:rounded-md [&>button:only-child]:rounded-md',
        '[&>[data-slot=button]:not(:first-child)]:-ml-px [&>button:not(:first-child)]:-ml-px',
        '[&>[data-slot=button][data-variant=default]:not(:first-child)]:border-primary-foreground/20 [&>[data-slot=button][data-variant=default]:not(:first-child)]:border-l',
        '[&>[data-slot=button]:not([data-variant]):not(:first-child)]:border-primary-foreground/20 [&>[data-slot=button]:not([data-variant]):not(:first-child)]:border-l',
        '[&>[data-slot=button][data-variant=secondary]:not(:first-child)]:border-border [&>[data-slot=button][data-variant=secondary]:not(:first-child)]:border-l',
        '[&>[data-slot=button][data-variant=destructive]:not(:first-child)]:border-l [&>[data-slot=button][data-variant=destructive]:not(:first-child)]:border-white/20',
      ],
      orientation === 'vertical' && [
        '[&>[data-slot=button]]:rounded-none [&>button]:rounded-none',
        '[&>[data-slot=button]:first-child]:rounded-t-md [&>button:first-child]:rounded-t-md',
        '[&>[data-slot=button]:last-child]:rounded-b-md [&>button:last-child]:rounded-b-md',
        '[&>[data-slot=button]:only-child]:rounded-md [&>button:only-child]:rounded-md',
        '[&>[data-slot=button]:not(:first-child)]:-mt-px [&>button:not(:first-child)]:-mt-px',
        '[&>[data-slot=button][data-variant=default]:not(:first-child)]:border-primary-foreground/20 [&>[data-slot=button][data-variant=default]:not(:first-child)]:border-t',
        '[&>[data-slot=button]:not([data-variant]):not(:first-child)]:border-primary-foreground/20 [&>[data-slot=button]:not([data-variant]):not(:first-child)]:border-t',
        '[&>[data-slot=button][data-variant=secondary]:not(:first-child)]:border-border [&>[data-slot=button][data-variant=secondary]:not(:first-child)]:border-t',
        '[&>[data-slot=button][data-variant=destructive]:not(:first-child)]:border-t [&>[data-slot=button][data-variant=destructive]:not(:first-child)]:border-white/20',
      ],
    ],
    !attached && (orientation === 'vertical' ? 'gap-1' : 'gap-1.5'),
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>
