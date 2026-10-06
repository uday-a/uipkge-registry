<script lang="ts">
  import {
    NumberField,
    NumberFieldContent,
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
  } from '@svelte-registry/number-field'

  let { story }: { story: string } = $props()

  let basic = $state(5)
  let sized = $state(10)
  let statused = $state(20)
  let formatted = $state(1000)
  let precisioned = $state(3.14159)
  let rightControls = $state(50)
  let prefixed = $state(100)
  let bounded = $state(5)

  function currencyFormatter(v: number | undefined) {
    if (v === undefined) return ''
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
  }
  function currencyParser(display: string) {
    const n = Number(display.replace(/[^0-9.-]/g, ''))
    return Number.isNaN(n) ? undefined : n
  }
</script>

{#if story === 'Default'}
  <div class="max-w-xs space-y-2">
    <p class="text-sm font-medium">Quantity</p>
    <NumberField bind:value={basic} min={0} max={20}>
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
    <p class="text-muted-foreground text-xs">Value: {basic}</p>
  </div>
{/if}

{#if story === 'Sizes'}
  <div class="flex items-center gap-4">
    <NumberField bind:value={sized} size="small" min={0}>
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
    <NumberField bind:value={sized} size="middle" min={0}>
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
    <NumberField bind:value={sized} size="large" min={0}>
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  </div>
{/if}

{#if story === 'Status'}
  <div class="flex items-center gap-4">
    <NumberField bind:value={statused} status="error" min={0}>
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
    <NumberField bind:value={statused} status="warning" min={0}>
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  </div>
{/if}

{#if story === 'Formatter / Parser'}
  <div class="max-w-xs space-y-2">
    <p class="text-sm font-medium">Price</p>
    <NumberField bind:value={formatted} formatter={currencyFormatter} parser={currencyParser} min={0} step={50}>
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
    <p class="text-muted-foreground text-xs">Raw value: {formatted}</p>
  </div>
{/if}

{#if story === 'Precision'}
  <div class="max-w-xs space-y-2">
    <p class="text-sm font-medium">Pi, two decimals</p>
    <NumberField bind:value={precisioned} precision={2} step={0.01}>
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
    <p class="text-muted-foreground text-xs">Raw value: {precisioned}</p>
  </div>
{/if}

{#if story === 'Controls position right'}
  <div class="max-w-xs">
    <NumberField bind:value={rightControls} controlsPosition="right" min={0} max={100}>
      <NumberFieldContent>
        <NumberFieldInput />
        <NumberFieldIncrement />
        <NumberFieldDecrement />
      </NumberFieldContent>
    </NumberField>
  </div>
{/if}

{#if story === 'Prefix & suffix'}
  <div class="max-w-xs">
    <NumberField bind:value={prefixed} prefix="$" suffix="USD" min={0}>
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  </div>
{/if}

{#if story === 'Min / Max bounds'}
  <div class="max-w-xs space-y-2">
    <p class="text-sm font-medium">Seats (1–8)</p>
    <NumberField bind:value={bounded} min={1} max={8}>
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
    <p class="text-muted-foreground text-xs">Steppers disable at the bounds.</p>
  </div>
{/if}
