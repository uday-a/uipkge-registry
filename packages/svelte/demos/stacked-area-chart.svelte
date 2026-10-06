<script lang="ts">
  import { StackedAreaChart } from '@svelte-registry/stacked-area-chart'

  let { story }: { story: string } = $props()

  const traffic = [
    { m: 'Jan', organic: 120, paid: 80, referral: 40 },
    { m: 'Feb', organic: 150, paid: 95, referral: 52 },
    { m: 'Mar', organic: 135, paid: 88, referral: 48 },
    { m: 'Apr', organic: 180, paid: 110, referral: 64 },
    { m: 'May', organic: 210, paid: 128, referral: 72 },
  ]
</script>

{#if story === 'Traffic streams'}
  <StackedAreaChart data={traffic} xField="m" yFields={['organic', 'paid', 'referral']} height="320" />
{/if}

{#if story === '100% share'}
  <StackedAreaChart data={traffic} xField="m" yFields={['organic', 'paid', 'referral']} percent height="320" />
{/if}
