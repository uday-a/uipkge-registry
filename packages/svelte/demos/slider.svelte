<script lang="ts">
  import { Slider } from '@svelte-registry/slider'

  let { story }: { story: string } = $props()

  let single = $state(50)
  let arr = $state([30])
  let range = $state<[number, number]>([20, 80])
  let stepped = $state(50)
  let small = $state(50)
  let reversed = $state(50)
  let plain = $state(50)
  let dots = $state(50)
  let marks = $state(50)
  let combo = $state(60)
  let money = $state(2500)
  let noTip = $state(50)
  let vert = $state(50)
  let vertMarks = $state(50)

  const pctMarks = { 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }
  const moneyFmt = (v: number) => `$${v.toLocaleString()}`
</script>

{#if story === 'Default (single thumb)'}
  <div class="max-w-md space-y-2">
    <Slider bind:value={single} />
    <p class="text-muted-foreground text-sm tabular-nums">Value: {single}</p>
  </div>
{/if}

{#if story === 'Backward-compat array'}
  <div class="max-w-md space-y-2">
    <Slider bind:value={arr} />
    <p class="text-muted-foreground text-sm tabular-nums">Value: {JSON.stringify(arr)}</p>
  </div>
{/if}

{#if story === 'Range'}
  <div class="max-w-md space-y-2">
    <Slider bind:value={range} range />
    <p class="text-muted-foreground text-sm tabular-nums">Value: {range[0]} – {range[1]}</p>
  </div>
{/if}

{#if story === 'With step'}
  <div class="max-w-md space-y-2">
    <Slider bind:value={stepped} step={10} />
    <p class="text-muted-foreground text-sm tabular-nums">Value: {stepped}</p>
  </div>
{/if}

{#if story === 'Disabled'}
  <div class="max-w-md">
    <Slider value={40} disabled />
  </div>
{/if}

{#if story === 'Small size'}
  <div class="max-w-md space-y-2">
    <Slider bind:value={small} size="small" />
    <p class="text-muted-foreground text-sm tabular-nums">Value: {small}</p>
  </div>
{/if}

{#if story === 'Reverse'}
  <div class="max-w-md space-y-2">
    <Slider bind:value={reversed} reverse />
    <p class="text-muted-foreground text-sm tabular-nums">Value: {reversed}</p>
  </div>
{/if}

{#if story === 'Included = false'}
  <div class="max-w-md space-y-2">
    <Slider bind:value={plain} included={false} />
    <p class="text-muted-foreground text-sm tabular-nums">Value: {plain}</p>
  </div>
{/if}

{#if story === 'Dots'}
  <div class="max-w-md space-y-2">
    <Slider bind:value={dots} step={10} dots />
    <p class="text-muted-foreground text-sm tabular-nums">Value: {dots}</p>
  </div>
{/if}

{#if story === 'Marks'}
  <div class="max-w-md space-y-2 pb-6">
    <Slider bind:value={marks} marks={pctMarks} />
    <p class="text-muted-foreground text-sm tabular-nums">Value: {marks}</p>
  </div>
{/if}

{#if story === 'Marks + dots + included'}
  <div class="max-w-md space-y-2 pb-6">
    <Slider bind:value={combo} step={10} dots marks={pctMarks} />
    <p class="text-muted-foreground text-sm tabular-nums">Value: {combo}</p>
  </div>
{/if}

{#if story === 'Tooltip formatter'}
  <div class="max-w-md space-y-2">
    <Slider bind:value={money} min={0} max={10000} step={100} tooltip={moneyFmt} />
    <p class="text-muted-foreground text-sm tabular-nums">Value: {moneyFmt(money)}</p>
  </div>
{/if}

{#if story === 'No tooltip'}
  <div class="max-w-md space-y-2">
    <Slider bind:value={noTip} tooltip={false} />
    <p class="text-muted-foreground text-sm tabular-nums">Value: {noTip}</p>
  </div>
{/if}

{#if story === 'Vertical'}
  <div class="flex h-56 items-stretch gap-4">
    <Slider bind:value={vert} vertical height="100%" />
    <p class="text-muted-foreground text-sm tabular-nums">Value: {vert}</p>
  </div>
{/if}

{#if story === 'Vertical with marks'}
  <div class="flex h-56 items-stretch gap-4">
    <Slider bind:value={vertMarks} vertical height="100%" step={10} dots marks={pctMarks} />
    <p class="text-muted-foreground text-sm tabular-nums">Value: {vertMarks}</p>
  </div>
{/if}
