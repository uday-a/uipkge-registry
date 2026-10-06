<script lang="ts">
  import { LollipopChart } from '@svelte-registry/lollipop-chart'

  let { story }: { story: string } = $props()

  const votes = [
    { category: 'Dark mode', value: 842 },
    { category: 'SSO', value: 615 },
    { category: 'API v2', value: 480 },
    { category: 'Mobile app', value: 356 },
    { category: 'Audit log', value: 214 },
  ]
</script>

{#if story === 'Feature votes'}
  <LollipopChart data={votes} />
{/if}

{#if story === 'Compact'}
  <LollipopChart data={votes.slice(0, 3)} height={220} />
{/if}
