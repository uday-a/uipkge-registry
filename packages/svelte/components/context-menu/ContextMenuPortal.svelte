<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export interface ContextMenuPortalProps {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { portal } from './portal'

  let { children }: ContextMenuPortalProps = $props()
</script>

<div use:portal data-uipkge data-slot="context-menu-portal" style:display="contents">
  {@render children?.()}
</div>
