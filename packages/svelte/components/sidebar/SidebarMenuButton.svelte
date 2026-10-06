<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  export interface SidebarMenuButtonProps extends HTMLButtonAttributes {
    variant?: 'default' | 'outline'
    size?: 'default' | 'sm' | 'lg'
    isActive?: boolean
    /** Tooltip shown when the sidebar is collapsed to icons. */
    tooltip?: string | Snippet
    /** Render your own element — spread `props` onto it. */
    child?: Snippet<[{ props: Record<string, unknown> }]>
    ref?: HTMLElement | null
  }
</script>

<script lang="ts">
  import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip'
  import { useSidebar } from './utils'
  import SidebarMenuButtonChild from './SidebarMenuButtonChild.svelte'

  let {
    class: className,
    variant = 'default',
    size = 'default',
    isActive,
    tooltip,
    child,
    children,
    ref = $bindable(null),
    ...restProps
  }: SidebarMenuButtonProps = $props()

  const sidebar = useSidebar()
</script>

{#if !tooltip}
  <SidebarMenuButtonChild {variant} {size} {isActive} {child} bind:ref class={className} {...restProps}>
    {@render children?.()}
  </SidebarMenuButtonChild>
{:else}
  <!-- w-full: the Tooltip positioning wrapper must not shrink-wrap the
       full-width menu button (truncated sidebar labels). -->
  <Tooltip class="w-full">
    <TooltipTrigger>
      {#snippet child({ props }: { props: Record<string, unknown> })}
        <SidebarMenuButtonChild
          {variant}
          {size}
          {isActive}
          {child}
          bind:ref
          class={className}
          {...restProps}
          {...props}
        >
          {@render children?.()}
        </SidebarMenuButtonChild>
      {/snippet}
    </TooltipTrigger>
    <TooltipContent side="right" align="center" hidden={sidebar.state !== 'collapsed' || sidebar.isMobile}>
      {#if typeof tooltip === 'string'}
        {tooltip}
      {:else}
        {@render tooltip()}
      {/if}
    </TooltipContent>
  </Tooltip>
{/if}
