<script lang="ts">
  import { Countdown } from '@svelte-registry/countdown'
  import { Button } from '@svelte-registry/button'

  let { story }: { story: string } = $props()

  let flashSaleEnd = $state(Date.now() + 3_600_000 * 5 + 42_000)
  let auctionEnd = $state(Date.now() + 10_000)
  let eventStart = $state(Date.now() + 86_400_000 * 2 + 3_600_000 * 4 + 60_000 * 30)
  let newYear = $state(new Date(new Date().getFullYear() + 1, 0, 1).getTime())
  let pausedTarget = $state(Date.now() + 120_000)
  let isPaused = $state(false)
  let auctionFinished = $state(false)
  let auctionTick = $state(0)

  function resetAuction() {
    auctionEnd = Date.now() + 10_000
    auctionFinished = false
  }
</script>

{#if story === 'Flash sale'}
  <div class="bg-primary text-primary-foreground max-w-md rounded-lg px-5 py-4">
    <p class="text-sm font-medium opacity-90">Flash sale — 40% off all plans</p>
    <Countdown
      target={flashSaleEnd}
      label="Ends in"
      class="[&_.text-foreground]:text-primary-foreground [&_.text-muted-foreground]:text-primary-foreground/70 mt-2"
    />
  </div>
{/if}

{#if story === 'Auction ending'}
  <div class="max-w-md rounded-lg border p-5">
    <p class="text-sm font-semibold">Vintage camera lot</p>
    <p class="text-muted-foreground text-xs">Highest bid: $1,240 · 3 bidders active</p>
    <div class="mt-3 space-y-3">
      <Countdown
        target={auctionEnd}
        format="SS"
        label="Bidding closes in"
        onfinish={() => (auctionFinished = true)}
        ontick={(v) => (auctionTick = v)}
      />
      <div class="flex items-center gap-3">
        <Button size="sm" variant="outline" onclick={resetAuction}>Reset timer</Button>
        <span class="text-muted-foreground text-xs">
          {auctionFinished ? 'Auction ended!' : `Ticking... ${Math.ceil(auctionTick / 1000)}s left`}
        </span>
      </div>
    </div>
  </div>
{/if}

{#if story === 'Event countdown'}
  <div class="max-w-md rounded-lg border p-5">
    <p class="text-sm font-semibold">UIPKGE Summit 2025</p>
    <p class="text-muted-foreground text-xs">Doors open in 2 days, 4 hours, 30 minutes.</p>
    <Countdown target={eventStart} label="Starts in" class="mt-3" />
  </div>
{/if}

{#if story === 'Format variants'}
  <div class="flex flex-wrap gap-6">
    <Countdown target={eventStart} format="HH:MM:SS" label="HH:MM:SS" />
    <Countdown target={eventStart} format="MM:SS" label="MM:SS" />
    <Countdown target={auctionEnd} format="SS" label="SS" />
  </div>
{/if}

{#if story === 'Custom unit cards'}
  <Countdown target={eventStart}>
    {#snippet children({ days, hours, minutes, seconds })}
      <div class="flex gap-2">
        {#each [['Days', days], ['Hours', hours], ['Mins', minutes], ['Secs', seconds]] as [label, value] (label)}
          <div class="bg-muted flex min-w-16 flex-col items-center rounded-lg px-3 py-2">
            <span class="text-2xl font-bold tabular-nums">{String(value).padStart(2, '0')}</span>
            <span class="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</span>
          </div>
        {/each}
      </div>
    {/snippet}
  </Countdown>
{/if}

{#if story === 'Paused & styling'}
  <div class="max-w-md space-y-3">
    <Countdown target={pausedTarget} format="MM:SS" label="Paused countdown" paused={isPaused} />
    <Button size="sm" variant="outline" onclick={() => (isPaused = !isPaused)}>
      {isPaused ? 'Resume' : 'Pause'}
    </Button>
  </div>
{/if}

{#if story === 'New year'}
  <div class="max-w-md rounded-lg border p-5 text-center">
    <p class="text-sm font-semibold">New Year countdown</p>
    <Countdown target={newYear} class="mt-2 items-center [&_[data-slot=countdown-display]]:justify-center" />
  </div>
{/if}
