<script lang="ts" module>
  import type { Snippet } from 'svelte'

  export interface MenubarPortalProps {
    children?: Snippet
  }
</script>

<script lang="ts">
  let { children }: MenubarPortalProps = $props()
</script>

<!-- Pass-through (not a real portal): menubar content is absolutely positioned
     relative to its menu wrapper, so moving it to document.body would break
     placement. This part exists for React import parity — wrapping content in
     it renders exactly as unwrapped. -->
<span data-uipkge="" data-slot="menubar-portal" class="contents">
  {@render children?.()}
</span>
