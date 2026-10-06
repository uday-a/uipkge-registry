<script lang="ts">
  import { Separator } from '@svelte-registry/separator'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Horizontal'}
  <div>
    <h4 class="text-sm leading-none font-medium">Section header</h4>
    <p class="text-muted-foreground text-sm">Helper text above the divider.</p>
    <Separator class="my-3" />
    <p class="text-sm">Content below the separator.</p>
  </div>
{/if}

{#if story === 'Vertical'}
  <div class="flex h-5 items-center gap-3 text-sm">
    <span>Blog</span>
    <Separator orientation="vertical" />
    <span>Docs</span>
    <Separator orientation="vertical" />
    <span>Source</span>
  </div>
{/if}
