<script lang="ts">
  import { ComboChart } from '@svelte-registry/combo-chart'

  let { story }: { story: string } = $props()

  const orders = [
    { x: 'Mon', bar: 120, line: 3.2 },
    { x: 'Tue', bar: 200, line: 4.1 },
    { x: 'Wed', bar: 150, line: 3.8 },
    { x: 'Thu', bar: 280, line: 5.2 },
    { x: 'Fri', bar: 320, line: 6.1 },
    { x: 'Sat', bar: 410, line: 7.4 },
    { x: 'Sun', bar: 380, line: 6.8 },
  ]

  const revenue = [
    { x: 'Q1', bar: 42, line: 18 },
    { x: 'Q2', bar: 58, line: 22 },
    { x: 'Q3', bar: 51, line: 19 },
    { x: 'Q4', bar: 74, line: 27 },
  ]

  const multi = [
    { x: 'Jan', web: 120, mobile: 90, rate: 3.1 },
    { x: 'Feb', web: 150, mobile: 110, rate: 3.6 },
    { x: 'Mar', web: 180, mobile: 140, rate: 4.2 },
    { x: 'Apr', web: 210, mobile: 175, rate: 4.9 },
  ]

  const bookings = [
    { x: 'W1', bar: 34, line: 210 },
    { x: 'W2', bar: 41, line: 228 },
    { x: 'W3', bar: 38, line: 219 },
    { x: 'W4', bar: 52, line: 246 },
    { x: 'W5', bar: 47, line: 238 },
  ]
</script>

{#if story === 'Orders + conversion'}
  <ComboChart data={orders} barField="bar" lineField="line" class="max-w-2xl" />
{/if}

{#if story === 'Revenue + margin'}
  <ComboChart data={revenue} barField="bar" lineField="line" class="max-w-2xl" />
{/if}

{#if story === 'Multi-bar + line'}
  <ComboChart data={multi} barField={['web', 'mobile']} lineField="rate" class="max-w-2xl" />
{/if}

{#if story === 'Bookings vs rate'}
  <ComboChart data={bookings} barField="bar" lineField="line" class="max-w-2xl" />
{/if}
