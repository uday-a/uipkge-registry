<script lang="ts">
  import { FunnelChart } from '@svelte-registry/funnel-chart'

  let { story }: { story: string } = $props()

  const acquisition = [
    { name: 'Visitors', value: 24850 },
    { name: 'Sign-ups', value: 14910 },
    { name: 'Activated', value: 5964 },
    { name: 'Paid', value: 1789 },
    { name: 'Retained 30d', value: 447 },
  ]

  const checkout = [
    { name: 'Cart', value: 8200 },
    { name: 'Checkout', value: 4900 },
    { name: 'Payment', value: 3100 },
    { name: 'Confirmed', value: 2700 },
  ]

  // Inverted funnel — narrow at top, wide at bottom. Useful when the
  // process *expands* (lead-gen -> opportunities -> deals -> renewals).
  const invertedOption = {
    series: [{ sort: 'ascending' as const }],
  }

  // Show conversion % between consecutive stages by overriding the label.
  const conversionOption = {
    series: [
      {
        label: {
          show: true,
          position: 'inside' as const,
          color: '#fff',
          fontSize: 11,
          fontWeight: 600,
          formatter: (p: any) => `${p.name}\n${p.value.toLocaleString()} (${p.percent}%)`,
        },
      },
    ],
  }
</script>

{#if story === 'Basic funnel'}
  <FunnelChart data={acquisition} height="340" />
{/if}

{#if story === 'With legend'}
  <FunnelChart data={acquisition} showLegend={true} height="360" />
{/if}

{#if story === 'Inverted'}
  <FunnelChart data={acquisition} option={invertedOption} height="340" />
{/if}

{#if story === 'With conversion %'}
  <FunnelChart data={checkout} option={conversionOption} height="320" />
{/if}

{#if story === 'Compact dashboard tile'}
  <FunnelChart data={checkout} option={{ series: [{ label: { show: false } }] }} height="180" />
{/if}
