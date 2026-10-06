<script lang="ts">
  import { SmoothFunnel } from '@svelte-registry/smooth-funnel'

  let { story }: { story: string } = $props()

  const acquisition = [
    { name: 'Visits', value: 8420 },
    { name: 'Sign-ups', value: 2442 },
    { name: 'Purchases', value: 185 },
  ]

  const checkout = [
    { name: 'Cart', value: 5200 },
    { name: 'Checkout', value: 3100 },
    { name: 'Payment', value: 2400 },
    { name: 'Confirmed', value: 2050 },
  ]

  const fiveStage = [
    { name: 'Visitors', value: 24850 },
    { name: 'Sign-ups', value: 14910 },
    { name: 'Activated', value: 5964 },
    { name: 'Paid', value: 1789 },
    { name: 'Retained', value: 447 },
  ]

  const brandPalette = ['#2e6642', '#4c9160', '#7ab98c', '#a9dcb8', '#d9a441']
</script>

{#if story === 'Basic three-stage funnel'}
  <div class="mx-auto max-w-md">
    <SmoothFunnel data={acquisition} />
  </div>
{/if}

{#if story === 'Four-stage checkout'}
  <div class="mx-auto max-w-md">
    <SmoothFunnel data={checkout} />
  </div>
{/if}

{#if story === 'Five stages, custom palette'}
  <div class="mx-auto max-w-md">
    <SmoothFunnel data={fiveStage} colors={brandPalette} />
  </div>
{/if}

{#if story === 'No labels'}
  <div class="mx-auto max-w-md">
    <SmoothFunnel data={checkout} showLabels={false} />
  </div>
{/if}

{#if story === 'Compact'}
  <div class="mx-auto max-w-md">
    <SmoothFunnel data={fiveStage} height={120} />
  </div>
{/if}
