<script lang="ts">
  import { RangeSlider } from '@svelte-registry/range-slider'

  let { story }: { story: string } = $props()

  let value = $state<[number, number]>([20, 80])
  let ticked = $state<[number, number]>([25, 75])
  let stepped = $state<[number, number]>([10, 40])
  let labeled = $state<[number, number]>([30, 70])
  let priced = $state<[number, number]>([100, 750])
  let colored = $state<[number, number]>([20, 80])
  let small = $state<[number, number]>([20, 80])
  let large = $state<[number, number]>([20, 80])
  let errored = $state<[number, number]>([60, 40])
  let locked = $state<[number, number]>([25, 75])
  let inverted = $state<[number, number]>([20, 80])

  const currency = (n: number) => `$${n}`
  const percent = (n: number) => `${n}%`
</script>

{#if story === 'Default'}
  <div class="max-w-md space-y-3">
    <RangeSlider bind:value max={100} step={1} />
    <p class="text-muted-foreground text-xs">
      Value: <code class="text-foreground">{value.join(' – ')}</code>
    </p>
  </div>
{/if}

{#if story === 'With ticks'}
  <div class="max-w-md space-y-3">
    <RangeSlider bind:value={ticked} max={100} step={1} showTicks tickInterval={25} />
  </div>
{/if}

{#if story === 'Custom step + tick interval'}
  <div class="max-w-md space-y-3">
    <RangeSlider bind:value={stepped} min={0} max={50} step={5} showTicks tickInterval={10} />
    <p class="text-muted-foreground text-xs">
      Value: <code class="text-foreground">{stepped.join(' – ')}</code>
    </p>
  </div>
{/if}

{#if story === 'Always-visible thumb labels'}
  <div class="max-w-md space-y-6">
    <RangeSlider bind:value={labeled} max={100} thumbLabel />
  </div>
{/if}

{#if story === 'Custom format (currency)'}
  <div class="max-w-md space-y-6">
    <RangeSlider bind:value={priced} min={0} max={1000} step={50} thumbLabel thumbLabelFormat={currency} />
  </div>
{/if}

{#if story === 'Color variants'}
  <div class="max-w-md space-y-4">
    <RangeSlider bind:value={colored} max={100} color="primary" />
    <RangeSlider bind:value={colored} max={100} color="success" />
    <RangeSlider bind:value={colored} max={100} color="warning" />
    <RangeSlider bind:value={colored} max={100} color="error" />
    <RangeSlider bind:value={colored} max={100} color="info" />
  </div>
{/if}

{#if story === 'Sizes'}
  <div class="max-w-md space-y-4">
    <RangeSlider bind:value={small} max={100} thumbSize="sm" trackHeight="sm" />
    <RangeSlider bind:value max={100} thumbSize="md" trackHeight="md" />
    <RangeSlider bind:value={large} max={100} thumbSize="lg" trackHeight="lg" />
  </div>
{/if}

{#if story === 'With label and hint'}
  <div class="max-w-md space-y-3">
    <RangeSlider
      bind:value={labeled}
      max={100}
      label="Volume"
      hint="Drag either handle to set the range."
      thumbLabel
      thumbLabelFormat={percent}
    />
  </div>
{/if}

{#if story === 'Error state'}
  <div class="max-w-md space-y-3">
    <RangeSlider
      bind:value={errored}
      max={100}
      label="Acceptable range"
      error
      errorMessages="Lower bound must be below upper bound."
    />
  </div>
{/if}

{#if story === 'Disabled'}
  <div class="max-w-md space-y-3">
    <RangeSlider bind:value={locked} max={100} disabled />
  </div>
{/if}

{#if story === 'Inverted'}
  <div class="max-w-md space-y-3">
    <RangeSlider bind:value={inverted} max={100} inverted />
  </div>
{/if}
