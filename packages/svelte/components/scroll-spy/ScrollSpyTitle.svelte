<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface ScrollSpyTitleProps extends HTMLAttributes<HTMLParagraphElement> {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getScrollSpyContextOptional } from './context'

  let { class: className, children, ...restProps }: ScrollSpyTitleProps = $props()

  const ctx = getScrollSpyContextOptional()
  const isRightRail = $derived(ctx?.position === 'left' && ctx?.railPosition === 'right')
</script>

<p data-slot="scroll-spy-title" class={cn('text-foreground mb-3 text-sm font-semibold tracking-tight', isRightRail && 'pr-3 text-right', className)} {...restProps}>
  {@render children?.()}
</p>
