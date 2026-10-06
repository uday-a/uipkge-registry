<script lang="ts">
  import { TreemapChart } from '@svelte-registry/treemap-chart'

  let { story }: { story: string } = $props()

  const teams = [
    { name: 'Backend', value: 22 },
    { name: 'Frontend', value: 18 },
    { name: 'Inside sales', value: 14 },
    { name: 'Field sales', value: 12 },
    { name: 'Customer success', value: 10 },
    { name: 'Marketing', value: 8 },
    { name: 'Support', value: 8 },
    { name: 'Mobile', value: 8 },
    { name: 'Infra', value: 8 },
    { name: 'Sales ops', value: 6 },
  ]

  // Air cargo: weekly tonnage by lane.
  const laneTonnage = [
    { name: 'PVG–LAX', value: 520 },
    { name: 'ICN–ORD', value: 410 },
    { name: 'SIN–HKG', value: 380 },
    { name: 'FRA–JFK', value: 360 },
    { name: 'NRT–DFW', value: 350 },
    { name: 'HKG–ANC', value: 290 },
    { name: 'DXB–SIN', value: 280 },
    { name: 'SIN–ICN', value: 190 },
  ]

  const nested = [
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
      name: 'Sales',
      children: [
        { name: 'Inside', value: 14 },
        { name: 'Field', value: 12 },
        { name: 'Ops', value: 6 },
      ],
    },
    {
      name: 'Customer',
      children: [
        { name: 'Success', value: 10 },
        { name: 'Support', value: 8 },
      ],
    },
  ]

  // Colour-by-value: paint tiles by absolute value (warmer = higher) using
  // visualMap. The option override layers a visualMap and tells the series
  // to read it.
  const colorByValueOption = {
    visualMap: {
      show: false,
      type: 'continuous' as const,
      min: 0,
      max: 25,
      inRange: { color: ['#fef3c7', '#f59e0b', '#9a3412'] },
    },
    series: [{ colorMappingBy: 'value' as const, colorSaturation: undefined as any }],
  }
</script>

{#if story === 'Basic treemap'}
  <TreemapChart data={teams} height="360" />
{/if}

{#if story === 'Nested'}
  <TreemapChart data={nested} height="380" />
{/if}

{#if story === 'Color by value'}
  <TreemapChart data={teams} option={colorByValueOption} height="360" />
{/if}

{#if story === 'With breadcrumb'}
  <TreemapChart
    data={nested}
    showBreadcrumb
    option={{ series: [{ roam: 'move', nodeClick: 'zoomToNode' }] }}
    height="380"
  />
{/if}

{#if story === 'Compact'}
  <TreemapChart data={teams} height="200" />
{/if}

{#if story === 'Lane tonnage'}
  <TreemapChart data={laneTonnage} height="320" />
{/if}
