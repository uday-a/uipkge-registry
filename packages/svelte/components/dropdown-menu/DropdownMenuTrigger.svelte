<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface DropdownMenuTriggerProps extends HTMLButtonAttributes {
    /** Render your own trigger element (e.g. a Button) with the trigger's
     *  props — the Svelte counterpart of reka's `as-child`. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { getMenuContext } from './dropdown-menu-context'

  let {
    class: className,
    disabled,
    child,
    children,
    ref = $bindable(null),
    onclick,
    ...restProps
  }: DropdownMenuTriggerProps = $props()

  const menu = getMenuContext()
  const open = $derived(menu.isOpen())

  function toggle() {
    if (disabled) return
    menu.setOpen(!menu.isOpen())
  }

  // `child` consumers spread these onto their own element; the runtime event
  // always carries currentTarget, hence the narrow-to-wide call below.
  function handleChildClick(e: MouseEvent) {
    toggle()
    ;(onclick as unknown as ((e: MouseEvent) => void) | undefined)?.(e)
  }

  const sharedProps = $derived({
    id: menu.ids.trigger,
    'aria-haspopup': 'menu' as const,
    'aria-expanded': open,
    'aria-controls': menu.ids.content,
    'data-state': open ? 'open' : 'closed',
    disabled,
    ...restProps,
  })
</script>

{#if child}
  {@render child({
    props: {
      ...sharedProps,
      'data-uipkge': '',
      'data-slot': 'dropdown-menu-trigger',
      class: className,
      onclick: handleChildClick,
    },
  })}
{:else}
  <button
    bind:this={ref}
    type="button"
    data-uipkge
    data-slot="dropdown-menu-trigger"
    class={className}
    {...sharedProps}
    onclick={(e) => {
      toggle()
      onclick?.(e)
    }}
  >
    {@render children?.()}
  </button>
{/if}
