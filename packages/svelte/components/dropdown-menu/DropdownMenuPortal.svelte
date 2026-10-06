<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export interface DropdownMenuPortalProps {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { portal } from './portal'

  let { children }: DropdownMenuPortalProps = $props()
</script>

<div use:portal data-uipkge data-slot="dropdown-menu-portal" style:display="contents">
  {@render children?.()}
</div>
