<script lang="ts">
  import { AnimatedNumber } from '@svelte-registry/animated-number'
  import { TrendingDown, TrendingUp } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

  let live = $state(4200)
  $effect(() => {
    const timer = setInterval(() => {
      live = Math.max(0, live + Math.round((Math.random() - 0.4) * 300))
    }, 2000)
    return () => clearInterval(timer)
  })
</script>

{#if story === 'Default'}
  <p class="text-4xl font-bold"><AnimatedNumber value={2481} /></p>
{/if}

{#if story === 'Currency'}
  <p class="text-4xl font-bold"><AnimatedNumber value={98750} format={(v) => usd.format(v)} /></p>
{/if}

{#if story === 'Fast vs slow'}
  <div class="flex items-end gap-10">
    <div>
      <p class="text-muted-foreground text-xs tracking-widest uppercase">fast · 300ms</p>
      <p class="text-3xl font-bold"><AnimatedNumber value={512} duration={300} /></p>
    </div>
    <div>
      <p class="text-muted-foreground text-xs tracking-widest uppercase">slow · 2400ms</p>
      <p class="text-3xl font-bold"><AnimatedNumber value={512} duration={2400} /></p>
    </div>
  </div>
{/if}

{#if story === 'Live ticker'}
  <div class="bg-card inline-flex items-baseline gap-2 rounded-lg border px-5 py-3">
    <span class="text-muted-foreground text-xs tracking-widest uppercase">requests/min</span>
    <span class="text-3xl font-bold"><AnimatedNumber value={live} /></span>
  </div>
{/if}

{#if story === 'KPI delta'}
  <div class="flex gap-8">
    <div class="text-success flex items-center gap-1.5">
      <TrendingUp class="size-4" aria-hidden="true" />
      <span class="text-lg font-semibold">+<AnimatedNumber value={12.4} format={(v) => v.toFixed(1)} />%</span>
    </div>
    <div class="text-destructive flex items-center gap-1.5">
      <TrendingDown class="size-4" aria-hidden="true" />
      <span class="text-lg font-semibold">−<AnimatedNumber value={3.8} format={(v) => v.toFixed(1)} />%</span>
    </div>
  </div>
{/if}

{#if story === 'Disabled'}
  <p class="text-4xl font-bold"><AnimatedNumber value={2481} disabled /></p>
{/if}
