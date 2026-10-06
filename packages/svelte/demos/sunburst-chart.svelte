<script lang="ts">
  import { SunburstChart, type SunburstNode } from '@svelte-registry/sunburst-chart'

  let { story }: { story: string } = $props()

  const revenue: SunburstNode[] = [
    {
      name: 'Revenue',
      children: [
        {
          name: 'Subscription',
          value: 64,
          children: [
            { name: 'Pro', value: 38 },
            { name: 'Team', value: 18 },
            { name: 'Enterprise', value: 8 },
          ],
        },
        {
          name: 'Usage',
          value: 22,
          children: [
            { name: 'API', value: 14 },
            { name: 'Storage', value: 8 },
          ],
        },
        {
          name: 'Services',
          value: 14,
          children: [
            { name: 'Onboarding', value: 9 },
            { name: 'Training', value: 5 },
          ],
        },
      ],
    },
  ]

  const orgChart: SunburstNode[] = [
    {
      name: 'Company',
      children: [
        {
          name: 'Engineering',
          children: [
            { name: 'Backend', value: 22 },
            { name: 'Frontend', value: 18 },
            { name: 'Mobile', value: 8 },
            { name: 'Infra', value: 8 },
          ],
        },
        {
          name: 'GTM',
          children: [
            { name: 'Sales', value: 16 },
            { name: 'Marketing', value: 10 },
            { name: 'CS', value: 8 },
          ],
        },
        { name: 'Ops', value: 12 },
      ],
    },
  ]

  // Air cargo network: region, then airport, sized by weekly tonnage.
  const cargoNetwork: SunburstNode[] = [
    {
      name: 'Air cargo',
      children: [
        {
          name: 'Transpacific',
          children: [
            { name: 'PVG', value: 520 },
            { name: 'ICN', value: 410 },
            { name: 'NRT', value: 350 },
          ],
        },
        {
          name: 'Intra-Asia',
          children: [
            { name: 'SIN', value: 570 },
            { name: 'HKG', value: 290 },
          ],
        },
        {
          name: 'Europe & ME',
          children: [
            { name: 'FRA', value: 360 },
            { name: 'DXB', value: 280 },
          ],
        },
      ],
    },
  ]

  // Polar / tangential label layout for the small inner rings.
  const tangentialOption = {
    series: [
      {
        label: { rotate: 'tangential' as const },
        levels: [
          {},
          { r0: '12%', r: '40%', label: { rotate: 'tangential' as const } },
          { r0: '40%', r: '70%', label: { align: 'right' as const } },
          { r0: '70%', r: '90%', label: { position: 'outside' as const } },
        ],
      },
    ],
  }

  // Drop rotation entirely — labels read left-to-right on every ring.
  // Lifts the cognitive load when the audience is non-technical.
  const horizontalLabelsOption = {
    series: [
      {
        label: { rotate: 0 as const, fontSize: 10 },
      },
    ],
  }
</script>

{#if story === 'Revenue breakdown'}
  <SunburstChart data={revenue} height="400" />
{/if}

{#if story === 'Org chart'}
  <SunburstChart data={orgChart} height="380" />
{/if}

{#if story === 'Tangential labels'}
  <SunburstChart data={revenue} option={tangentialOption} height="400" />
{/if}

{#if story === 'Horizontal labels'}
  <SunburstChart data={revenue} option={horizontalLabelsOption} height="400" />
{/if}

{#if story === 'Solid (pie-style)'}
  <SunburstChart data={revenue} radius={['0%', '90%']} height="320" />
{/if}

{#if story === 'Cargo network'}
  <SunburstChart data={cargoNetwork} height="380" />
{/if}
