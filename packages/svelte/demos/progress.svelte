<script lang="ts">
  import { Progress } from '@svelte-registry/progress'

  let { story }: { story: string } = $props()

  let animated = $state(0)

  $effect(() => {
    const id = window.setInterval(() => {
      animated = animated >= 100 ? 0 : animated + 5
    }, 600)
    return () => window.clearInterval(id)
  })
</script>

{#if story === 'With label'}
  <div class="max-w-md space-y-3">
    <div>
      <div class="text-muted-foreground mb-1.5 flex justify-between text-xs">
        <span>Loading…</span>
        <span>33%</span>
      </div>
      <Progress value={33} />
    </div>
    <div>
      <div class="text-muted-foreground mb-1.5 flex justify-between text-xs">
        <span>Almost done</span>
        <span>83%</span>
      </div>
      <Progress value={83} />
    </div>
  </div>
{/if}

{#if story === 'Discrete states'}
  <div class="max-w-md space-y-4">
    <div>
      <div class="text-muted-foreground mb-1.5 text-xs">0%</div>
      <Progress value={0} />
    </div>
    <div>
      <div class="text-muted-foreground mb-1.5 text-xs">50%</div>
      <Progress value={50} />
    </div>
    <div>
      <div class="text-muted-foreground mb-1.5 text-xs">100%</div>
      <Progress value={100} />
    </div>
  </div>
{/if}

{#if story === 'Multi-percentage row'}
  <div class="grid max-w-md gap-3">
    <Progress value={10} />
    <Progress value={30} />
    <Progress value={55} />
    <Progress value={78} />
    <Progress value={95} />
  </div>
{/if}

{#if story === 'Animated value'}
  <div class="max-w-md space-y-3">
    <div class="text-muted-foreground flex justify-between text-xs">
      <span>Uploading file…</span>
      <span class="tabular-nums">{animated}%</span>
    </div>
    <Progress value={animated} />
  </div>
{/if}

{#if story === 'In a card'}
  <div class="bg-card text-card-foreground max-w-md rounded-xl border shadow-sm">
    <div class="flex flex-col gap-1.5 p-6 pb-2">
      <h3 class="font-semibold">Storage</h3>
      <p class="text-muted-foreground text-sm">You're using 6.4 GB of 10 GB.</p>
    </div>
    <div class="p-6 pt-2">
      <Progress value={64} />
      <p class="text-muted-foreground mt-2 text-xs">3.6 GB remaining on your current plan.</p>
    </div>
  </div>
{/if}
