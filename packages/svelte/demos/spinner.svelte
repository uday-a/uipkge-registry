<script lang="ts">
  import { Spinner } from '@svelte-registry/spinner'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Sizes'}
  <div class="flex items-center gap-6">
    <Spinner />
    <Spinner size="sm" />
    <Spinner size="lg" />
    <Spinner class="text-primary size-8" />
    <Spinner class="size-10 text-emerald-500" />
  </div>
{/if}

{#if story === 'Inline'}
  <div class="flex items-center gap-2 text-sm"><Spinner class="size-4" /> Loading…</div>
{/if}
