<script lang="ts">
  import { PieChart } from '@svelte-registry/pie-chart'

  let { story }: { story: string } = $props()

  const devices = [
    { name: 'Desktop', value: 45 },
    { name: 'Mobile', value: 35 },
    { name: 'Tablet', value: 15 },
    { name: 'Other', value: 5 },
  ]

  // Air cargo: weekly freighter capacity share by carrier.
  const capacityShare = [
    { name: 'SQ', value: 22 },
    { name: 'CX', value: 19 },
    { name: 'LH', value: 15 },
    { name: 'EK', value: 13 },
    { name: 'QR', value: 11 },
    { name: 'KE', value: 10 },
    { name: 'Other', value: 10 },
  ]

  const traffic = [
    { name: 'Organic', value: 4200 },
    { name: 'Paid', value: 2800 },
    { name: 'Referral', value: 1900 },
    { name: 'Direct', value: 1400 },
    { name: 'Email', value: 900 },
  ]

  // Outside labels with leader lines.
  const labeledOption = {
    series: [
      {
        label: { show: true, formatter: '{b}\n{d}%', fontSize: 11, color: 'var(--foreground)' },
        labelLine: { show: true, length: 8, length2: 12 },
      },
    ],
  }

  // Rose (Nightingale) — radius scales with value.
  const roseOption = {
    series: [{ roseType: 'radius', radius: ['20%', '70%'] }],
  }

  // Center-label donut: bigger inner ring + percentage in the hole.
  const centerLabelOption = {
    series: [
      {
        radius: ['55%', '75%'],
        label: {
          show: true,
          position: 'center',
          formatter: '45%\nDesktop',
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--foreground)',
        },
      },
    ],
  }
</script>

{#if story === 'Basic pie'}
  <PieChart data={devices} height="320" />
{/if}

{#if story === 'Donut'}
  <PieChart data={devices} donut={true} height="320" />
{/if}

{#if story === 'Donut with center label'}
  <PieChart data={devices} donut={true} option={centerLabelOption} height="320" />
{/if}

{#if story === 'Rose (Nightingale)'}
  <PieChart data={traffic} option={roseOption} height="340" />
{/if}

{#if story === 'Outside labels'}
  <PieChart data={traffic} option={labeledOption} height="340" />
{/if}

{#if story === 'Carrier capacity'}
  <PieChart data={capacityShare} nameField="name" valueField="value" donut={true} height="320" />
{/if}
