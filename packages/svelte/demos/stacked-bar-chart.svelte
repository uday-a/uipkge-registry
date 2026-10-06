<script lang="ts">
  import { StackedBarChart } from '@svelte-registry/stacked-bar-chart'

  let { story }: { story: string } = $props()

  const mix = [
    { q: 'Q1', organic: 240, paid: 180, referral: 120 },
    { q: 'Q2', organic: 310, paid: 220, referral: 150 },
    { q: 'Q3', organic: 380, paid: 280, referral: 170 },
    { q: 'Q4', organic: 450, paid: 340, referral: 210 },
  ]

  const likert = [
    { q: 'Speed', sd: -8, d: -12, n: 10, a: 34, sa: 36 },
    { q: 'Support', sd: -5, d: -9, n: 14, a: 38, sa: 34 },
    { q: 'Pricing', sd: -14, d: -18, n: 16, a: 28, sa: 24 },
  ]
</script>

{#if story === 'Channel mix'}
  <StackedBarChart data={mix} xField="q" yFields={['organic', 'paid', 'referral']} height="320" />
{/if}

{#if story === '100% share'}
  <StackedBarChart data={mix} xField="q" yFields={['organic', 'paid', 'referral']} percent height="320" />
{/if}

{#if story === 'Likert diverging'}
  <StackedBarChart data={likert} xField="q" yFields={['sd', 'd', 'n', 'a', 'sa']} height="300" />
{/if}
