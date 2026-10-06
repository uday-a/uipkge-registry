<script lang="ts">
  import { RadarChart } from '@svelte-registry/radar-chart'

  let { story }: { story: string } = $props()

  const carIndicators = [
    { name: 'Speed', max: 100 },
    { name: 'Reliability', max: 100 },
    { name: 'Comfort', max: 100 },
    { name: 'Safety', max: 100 },
    { name: 'Efficiency', max: 100 },
  ]

  const carData = [
    { name: 'Model A', value: [85, 90, 70, 95, 80] },
    { name: 'Model B', value: [70, 85, 90, 80, 75] },
  ]

  const skillIndicators = [
    { name: 'TypeScript', max: 10 },
    { name: 'Vue', max: 10 },
    { name: 'CSS', max: 10 },
    { name: 'Testing', max: 10 },
    { name: 'Tooling', max: 10 },
    { name: 'Design', max: 10 },
  ]

  const skillData = [{ name: 'You', value: [9, 8, 7, 6, 9, 5] }]

  // Heavier fill — emphasise the shape over the outline.
  const filledOption = {
    series: [
      {
        data: [
          {
            name: 'Model A',
            value: [85, 90, 70, 95, 80],
            areaStyle: { opacity: 0.45 },
            lineStyle: { width: 1 },
          },
          {
            name: 'Model B',
            value: [70, 85, 90, 80, 75],
            areaStyle: { opacity: 0.45 },
            lineStyle: { width: 1 },
          },
        ],
      },
    ],
  }

  // Polygon grid instead of circular — gives the radar a more "tactical" look.
  const polygonOption = {
    radar: {
      indicator: carIndicators,
      shape: 'polygon' as const,
      radius: '62%',
      splitNumber: 4,
      splitArea: { areaStyle: { color: ['rgba(245,245,245,0.4)', 'rgba(220,220,220,0.05)'] } },
    },
  }
</script>

{#if story === 'Basic radar'}
  <RadarChart indicators={carIndicators} data={carData} height={340} />
{/if}

{#if story === 'Single series'}
  <RadarChart indicators={skillIndicators} data={skillData} height={340} />
{/if}

{#if story === 'Heavy fill'}
  <RadarChart indicators={carIndicators} data={carData} option={filledOption} height={340} />
{/if}

{#if story === 'Polygon grid'}
  <RadarChart indicators={carIndicators} data={carData} option={polygonOption} height={340} />
{/if}

{#if story === 'Compact scorecard'}
  <div class="mx-auto max-w-[360px]">
    <RadarChart indicators={skillIndicators} data={skillData} height={220} />
  </div>
{/if}
