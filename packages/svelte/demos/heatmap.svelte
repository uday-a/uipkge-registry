<script lang="ts">
  import { Heatmap } from '@svelte-registry/heatmap'

  let { story }: { story: string } = $props()

  // [xIndex, yIndex, value] tuples for a 5x4 matrix.
  const usageData: [number, number, number][] = []
  const xLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const yLabels = ['Morning', 'Afternoon', 'Evening', 'Night']

  // Air cargo: lane × week load factors (%) into peak season.
  const laneLabels = ['SIN–HKG', 'PVG–LAX', 'ICN–ORD', 'FRA–JFK', 'DXB–SIN', 'HKG–ANC']
  const weekLabels = ['W20', 'W21', 'W22', 'W23', 'W24', 'W25', 'W26', 'W27']
  const loadRows = [
    [68, 74, 71, 66, 63, 70],
    [71, 76, 73, 68, 65, 72],
    [69, 78, 75, 70, 64, 74],
    [74, 82, 78, 72, 69, 77],
    [77, 85, 80, 74, 71, 79],
    [81, 88, 83, 77, 74, 82],
    [84, 91, 86, 80, 77, 85],
    [88, 94, 89, 83, 80, 87],
  ]
  const loadData: [number, number, number][] = loadRows.flatMap((row, w) =>
    row.map((v, l) => [w, l, v] as [number, number, number]),
  )
  const peaks: Record<string, number> = {
    '0,0': 12,
    '0,1': 24,
    '0,2': 38,
    '0,3': 9,
    '1,0': 18,
    '1,1': 36,
    '1,2': 52,
    '1,3': 14,
    '2,0': 22,
    '2,1': 42,
    '2,2': 64,
    '2,3': 18,
    '3,0': 24,
    '3,1': 38,
    '3,2': 58,
    '3,3': 22,
    '4,0': 14,
    '4,1': 22,
    '4,2': 30,
    '4,3': 8,
  }
  for (let x = 0; x < xLabels.length; x++) {
    for (let y = 0; y < yLabels.length; y++) {
      usageData.push([x, y, peaks[`${x},${y}`] ?? 0])
    }
  }

  // "Heatmap with gaps" — values of 0 set to NaN-ish display.
  const sparse: [number, number, number][] = usageData.map(([x, y, v]) => (v < 12 ? [x, y, 0] : [x, y, v]))
  const gapsOption = {
    series: [{ itemStyle: { borderRadius: 3, borderColor: '#fff', borderWidth: 2 } }],
    visualMap: {
      inRange: { color: ['#fef3c7', '#f59e0b', '#b45309'] },
    },
  }

  // Override the default blue ramp with a teal / orange palette.
  const tealRampOption = {
    visualMap: { inRange: { color: ['#ccfbf1', '#14b8a6', '#0f766e'] } },
  }
  const orangeRampOption = {
    visualMap: { inRange: { color: ['#ffedd5', '#fb923c', '#9a3412'] } },
  }
</script>

{#if story === 'Basic heatmap'}
  <Heatmap data={usageData} {xLabels} {yLabels} height="320" />
{/if}

{#if story === 'With gaps'}
  <Heatmap data={sparse} {xLabels} {yLabels} option={gapsOption} height="320" />
{/if}

{#if story === 'Teal palette'}
  <Heatmap data={usageData} {xLabels} {yLabels} option={tealRampOption} height="320" />
{/if}

{#if story === 'Warm palette'}
  <Heatmap data={usageData} {xLabels} {yLabels} option={orangeRampOption} height="320" />
{/if}

{#if story === 'Compact (no legend)'}
  <Heatmap
    data={usageData}
    {xLabels}
    {yLabels}
    option={{ visualMap: { show: false } }}
    height="160"
  />
{/if}

{#if story === 'Lane load factors'}
  <Heatmap data={loadData} xLabels={weekLabels} yLabels={laneLabels} min={60} max={100} height="300" />
{/if}
