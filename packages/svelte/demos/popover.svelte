<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import { Popover, PopoverContent, PopoverTrigger } from '@svelte-registry/popover'
  import { Filter, MoreHorizontal, Settings, Share2 } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let filters = $state({ status: 'active', tier: 'pro' })
  let open = $state(false)
</script>

{#if story === 'With form fields'}
  <Popover>
    <PopoverTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Open popover</Button>
      {/snippet}
    </PopoverTrigger>
    <PopoverContent class="w-80">
      <div class="space-y-2">
        <h4 class="leading-none font-medium">Dimensions</h4>
        <p class="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
      </div>
      <div class="mt-4 grid gap-2">
        <div class="grid grid-cols-3 items-center gap-3">
          <label for="width" class="text-sm font-medium">Width</label>
          <input
            id="width"
            value="100%"
            class="border-input bg-background col-span-2 h-8 rounded-md border px-3 text-sm"
          />
        </div>
        <div class="grid grid-cols-3 items-center gap-3">
          <label for="height" class="text-sm font-medium">Height</label>
          <input
            id="height"
            value="25px"
            class="border-input bg-background col-span-2 h-8 rounded-md border px-3 text-sm"
          />
        </div>
      </div>
    </PopoverContent>
  </Popover>
{/if}

{#if story === 'Compact info'}
  <Popover>
    <PopoverTrigger>
      {#snippet child({ props })}
        <Button variant="ghost" size="sm" {...props}>Show details</Button>
      {/snippet}
    </PopoverTrigger>
    <PopoverContent class="w-56 space-y-1 text-sm">
      <p class="font-medium">Active session</p>
      <p class="text-muted-foreground text-xs">Started 2h ago · IP 192.0.2.1</p>
    </PopoverContent>
  </Popover>
{/if}

{#if story === 'Sides + alignment'}
  <div class="flex flex-wrap items-center gap-3">
    <Popover>
      <PopoverTrigger>
        {#snippet child({ props })}
          <Button variant="outline" size="sm" {...props}>Top · start</Button>
        {/snippet}
      </PopoverTrigger>
      <PopoverContent side="top" align="start" class="w-44">
        Aligned to the start of the trigger's top edge.
      </PopoverContent>
    </Popover>
    <Popover>
      <PopoverTrigger>
        {#snippet child({ props })}
          <Button variant="outline" size="sm" {...props}>Right · center</Button>
        {/snippet}
      </PopoverTrigger>
      <PopoverContent side="right" align="center" class="w-44">Centered on the right side.</PopoverContent>
    </Popover>
    <Popover>
      <PopoverTrigger>
        {#snippet child({ props })}
          <Button variant="outline" size="sm" {...props}>Bottom · end</Button>
        {/snippet}
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" class="w-44">
        Aligned to the end of the bottom edge.
      </PopoverContent>
    </Popover>
  </div>
{/if}

{#if story === 'Filter chips'}
  <Popover>
    <PopoverTrigger>
      {#snippet child({ props })}
        <Button variant="outline" size="sm" {...props}>
          <Filter class="size-3.5" />
          Filters
        </Button>
      {/snippet}
    </PopoverTrigger>
    <PopoverContent class="w-72">
      <div class="space-y-3">
        <div class="space-y-1.5">
          <p class="text-muted-foreground text-xs tracking-wider uppercase">Status</p>
          <div class="flex gap-3">
            {#each ['all', 'active', 'archived'] as value (value)}
              <label class="flex items-center gap-1.5 text-sm">
                <input
                  type="radio"
                  name="status"
                  {value}
                  checked={filters.status === value}
                  onchange={() => (filters.status = value)}
                />
                {value === 'all' ? 'All' : value === 'active' ? 'Active' : 'Archived'}
              </label>
            {/each}
          </div>
        </div>
        <div class="space-y-1.5">
          <p class="text-muted-foreground text-xs tracking-wider uppercase">Tier</p>
          <div class="flex gap-3">
            {#each ['free', 'pro', 'ent'] as value (value)}
              <label class="flex items-center gap-1.5 text-sm">
                <input
                  type="radio"
                  name="tier"
                  {value}
                  checked={filters.tier === value}
                  onchange={() => (filters.tier = value)}
                />
                {value === 'free' ? 'Free' : value === 'pro' ? 'Pro' : 'Enterprise'}
              </label>
            {/each}
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
{/if}

{#if story === 'Icon-only quick actions'}
  <div class="flex items-center gap-2">
    <Popover>
      <PopoverTrigger>
        {#snippet child({ props })}
          <Button variant="ghost" size="icon" aria-label="Settings" {...props}><Settings /></Button>
        {/snippet}
      </PopoverTrigger>
      <PopoverContent class="w-48 text-sm">
        <p class="mb-2 font-medium">Quick settings</p>
        <p class="text-muted-foreground text-xs">Choose a default view for new tabs.</p>
      </PopoverContent>
    </Popover>

    <Popover>
      <PopoverTrigger>
        {#snippet child({ props })}
          <Button variant="ghost" size="icon" aria-label="Share" {...props}><Share2 /></Button>
        {/snippet}
      </PopoverTrigger>
      <PopoverContent class="w-48 space-y-1.5">
        <Button variant="ghost" size="sm" class="w-full justify-start">Copy link</Button>
        <Button variant="ghost" size="sm" class="w-full justify-start">Email</Button>
        <Button variant="ghost" size="sm" class="w-full justify-start">Slack</Button>
      </PopoverContent>
    </Popover>

    <Popover>
      <PopoverTrigger>
        {#snippet child({ props })}
          <Button variant="ghost" size="icon" aria-label="More" {...props}><MoreHorizontal /></Button>
        {/snippet}
      </PopoverTrigger>
      <PopoverContent align="end" class="w-44 space-y-0.5">
        <Button variant="ghost" size="sm" class="w-full justify-start">Duplicate</Button>
        <Button variant="ghost" size="sm" class="w-full justify-start">Archive</Button>
        <Button variant="ghost" size="sm" class="text-destructive hover:text-destructive w-full justify-start">
          Delete
        </Button>
      </PopoverContent>
    </Popover>
  </div>
{/if}

{#if story === 'Controlled with bind:open'}
  <div class="flex items-center gap-3">
    <Popover bind:open>
      <PopoverTrigger>
        {#snippet child({ props })}
          <Button variant="outline" {...props}>Toggle externally</Button>
        {/snippet}
      </PopoverTrigger>
      <PopoverContent class="w-64 text-sm">
        <p>Controlled via bind:open.</p>
        <p class="text-muted-foreground mt-1 text-xs">Click 'Close' to dismiss.</p>
        <Button size="sm" variant="outline" class="mt-3" onclick={() => (open = false)}>Close</Button>
      </PopoverContent>
    </Popover>
    <span class="text-muted-foreground text-xs">open = {open}</span>
  </div>
{/if}

{#if story === 'Persistent (localStorage)'}
  <Popover persist="demo-persist-1">
    <PopoverTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Toggle, then reload</Button>
      {/snippet}
    </PopoverTrigger>
    <PopoverContent>I remember my state across reloads.</PopoverContent>
  </Popover>
{/if}

{#if story === 'Close behavior - manual'}
  <Popover closeBehavior="manual">
    <PopoverTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Open manual</Button>
      {/snippet}
    </PopoverTrigger>
    <PopoverContent>
      <div class="space-y-2">
        <p class="text-sm">I won't close on outside click or Escape.</p>
        <PopoverTrigger>
          {#snippet child({ props })}
            <Button size="sm" variant="outline" {...props}>Close</Button>
          {/snippet}
        </PopoverTrigger>
      </div>
    </PopoverContent>
  </Popover>
{/if}

{#if story === 'Close behavior - click-outside only'}
  <Popover closeBehavior="click-outside">
    <PopoverTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Open click-outside-only</Button>
      {/snippet}
    </PopoverTrigger>
    <PopoverContent>Press Escape - nothing happens. Click outside - I close.</PopoverContent>
  </Popover>
{/if}
