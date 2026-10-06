<script lang="ts">
  import { ProgressLinear } from '@svelte-registry/progress-linear'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Determinate'}
  <div class="max-w-md">
    <ProgressLinear value={60} />
  </div>
{/if}

{#if story === 'Indeterminate'}
  <div class="max-w-md">
    <ProgressLinear indeterminate />
  </div>
{/if}

{#if story === 'Buffer'}
  <div class="max-w-md">
    <ProgressLinear value={35} buffer={65} />
  </div>
{/if}

{#if story === 'Stream'}
  <div class="max-w-md">
    <ProgressLinear value={40} stream buffer={70} />
  </div>
{/if}

{#if story === 'Striped'}
  <div class="max-w-md space-y-3">
    <ProgressLinear value={70} striped />
    <ProgressLinear value={45} striped color="var(--info)" />
  </div>
{/if}

{#if story === 'Color tokens'}
  <div class="max-w-md space-y-3">
    <ProgressLinear value={60} color="var(--success)" />
    <ProgressLinear value={40} color="var(--warning)" />
    <ProgressLinear value={20} color="var(--destructive)" />
    <ProgressLinear value={80} color="var(--info)" />
  </div>
{/if}

{#if story === 'Heights'}
  <div class="max-w-md space-y-3">
    <ProgressLinear value={60} height={2} />
    <ProgressLinear value={60} height={4} />
    <ProgressLinear value={60} height={8} />
    <ProgressLinear value={60} height={14} rounded="full" />
  </div>
{/if}

{#if story === 'Reverse'}
  <div class="max-w-md">
    <ProgressLinear value={35} reverse />
  </div>
{/if}
