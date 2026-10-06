<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface CommandInputProps extends HTMLAttributes<HTMLInputElement> {
    /** Focus the input on mount. Default false so inline embeds don't steal focus. */
    autoFocus?: boolean
    ref?: HTMLInputElement | null
  }
</script>

<script lang="ts">
  import { Search } from '@lucide/svelte'
  import { cn } from '$lib/utils'
  import { getCommandContext } from './context'

  let {
    class: className,
    autoFocus = false,
    ref = $bindable(null),
    onkeydown,
    ...restProps
  }: CommandInputProps = $props()

  const ctx = getCommandContext()

  $effect(() => {
    if (autoFocus) ref?.focus()
  })

  type OnKeyDown = NonNullable<HTMLAttributes<HTMLInputElement>['onkeydown']>
  const handleKeyDown: OnKeyDown = (e) => {
    onkeydown?.(e)
    if (e.defaultPrevented) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      ctx.moveHighlight(1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      ctx.moveHighlight(-1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      ctx.selectHighlighted()
    } else if (e.key === 'Escape' && ctx.search) {
      e.preventDefault()
      ctx.setSearch('')
    }
  }
</script>

<div data-uipkge data-slot="command-input-wrapper" class="flex h-9 items-center gap-2 border-b px-3">
  <Search class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
  <input
    bind:this={ref}
    bind:value={() => ctx.search, (v) => ctx.setSearch(v)}
    role="combobox"
    aria-expanded="true"
    aria-controls={ctx.listId}
    aria-activedescendant={ctx.activeDescendant}
    autocomplete="off"
    autocorrect="off"
    spellcheck="false"
    data-uipkge
    data-slot="command-input"
    class={cn(
      'placeholder:text-muted-foreground focus-visible:ring-ring/40 flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...restProps}
    onkeydown={handleKeyDown}
  />
</div>
