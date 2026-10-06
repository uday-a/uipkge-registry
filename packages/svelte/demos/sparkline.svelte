<script lang="ts">
  import { Sparkline } from '@svelte-registry/sparkline'

  let { story }: { story: string } = $props()

  const trendUp = [12, 19, 15, 25, 22, 30, 28, 35, 32, 40]
  const trendDown = [42, 38, 41, 33, 36, 28, 30, 22, 19, 14]
  const flat = [22, 24, 21, 23, 22, 25, 22, 24, 23, 22]
  const winLoss = [1, 1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]

  // Bar-style sparkline via the option escape hatch.
  const barOption = {
    series: [
      {
        type: 'bar',
        barCategoryGap: '25%',
        itemStyle: { color: '#14b8a6', borderRadius: [2, 2, 0, 0] },
        areaStyle: undefined,
        lineStyle: undefined,
      },
    ],
  }

  // Win/loss: ±1 values rendered as up-bars (green) / down-bars (red).
  const winLossOption = {
    series: [
      {
        type: 'bar',
        barCategoryGap: '15%',
        data: winLoss,
        areaStyle: undefined,
        lineStyle: undefined,
        itemStyle: {
          color: (params: any) => (params.value >= 0 ? '#14b8a6' : '#f97316'),
          borderRadius: 1,
        },
      },
    ],
    yAxis: { type: 'value', show: false, min: -1.2, max: 1.2 },
  }
</script>

{#if story === 'Trend up'}
  <div class="flex items-center gap-6 px-2">
    <div>
      <div class="text-muted-foreground font-mono text-xs">MRR</div>
      <div class="text-xl font-semibold">$8.4k</div>
    </div>
    <div class="w-32">
      <Sparkline data={trendUp} height={40} />
    </div>
  </div>
{/if}

{#if story === 'Trend down (custom color)'}
  <div class="flex items-center gap-6 px-2">
    <div>
      <div class="text-muted-foreground font-mono text-xs">Churn</div>
      <div class="text-xl font-semibold">3.2%</div>
    </div>
    <div class="w-32">
      <Sparkline data={trendDown} color="#f97316" height={40} />
    </div>
  </div>
{/if}

{#if story === 'Flat trend'}
  <div class="flex items-center gap-6 px-2">
    <div>
      <div class="text-muted-foreground font-mono text-xs">Latency p50</div>
      <div class="text-xl font-semibold">22ms</div>
    </div>
    <div class="w-32">
      <Sparkline data={flat} color="#94a3b8" height={40} />
    </div>
  </div>
{/if}

{#if story === 'Bar sparkline'}
  <div class="flex items-center gap-6 px-2">
    <div>
      <div class="text-muted-foreground font-mono text-xs">Daily signups</div>
      <div class="text-xl font-semibold">128</div>
    </div>
    <div class="w-32">
      <Sparkline data={trendUp} option={barOption} height={44} />
    </div>
  </div>
{/if}

{#if story === 'Win / loss'}
  <div class="flex items-center gap-6 px-2">
    <div>
      <div class="text-muted-foreground font-mono text-xs">Deploys</div>
      <div class="text-xl font-semibold">10 / 3</div>
    </div>
    <div class="w-32">
      <Sparkline data={winLoss} option={winLossOption} height={44} />
    </div>
  </div>
{/if}
