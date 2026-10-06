<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@svelte-registry/collapsible'
  import { ChevronsUpDown, Minus, Plus } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let open = $state(true)

  const frameworks = ['Auth', 'Theme', 'Toast', 'Form', 'Query', 'Cache', 'Sidebar', 'Modal']
</script>

{#if story === 'Controlled'}
  <div class="space-y-3">
    <Collapsible bind:open class="max-w-md">
      <div class="flex items-center justify-between gap-3 rounded-md border px-4 py-2">
        <h4 class="text-sm font-medium">@uipkge starred 3 repositories</h4>
        <CollapsibleTrigger>
          {#snippet child({ props })}
            <Button variant="ghost" size="icon-sm" {...props}>
              <ChevronsUpDown class="size-4" aria-hidden="true" />
              <span class="sr-only">Toggle</span>
            </Button>
          {/snippet}
        </CollapsibleTrigger>
      </div>
      <div class="mt-1 rounded-md border px-4 py-2 font-mono text-sm">@radix-ui/primitives</div>
      <CollapsibleContent class="mt-1 space-y-1">
        <div class="rounded-md border px-4 py-2 font-mono text-sm">@stitches/react</div>
        <div class="rounded-md border px-4 py-2 font-mono text-sm">@vueuse/core</div>
      </CollapsibleContent>
    </Collapsible>
    <p class="text-muted-foreground text-xs">
      Open: <code class="text-foreground">{open}</code>
    </p>
  </div>
{/if}

{#if story === 'Uncontrolled'}
  <Collapsible defaultOpen class="max-w-md">
    <div class="flex items-center justify-between gap-3 rounded-md border px-4 py-2">
      <h4 class="text-sm font-medium">Today's reminders</h4>
      <CollapsibleTrigger>
        {#snippet child({ props })}
          <Button variant="ghost" size="icon-sm" {...props}>
            <ChevronsUpDown class="size-4" aria-hidden="true" />
            <span class="sr-only">Toggle</span>
          </Button>
        {/snippet}
      </CollapsibleTrigger>
    </div>
    <CollapsibleContent class="mt-1 space-y-1">
      <div class="rounded-md border px-4 py-2 text-sm">Stand-up at 10:00</div>
      <div class="rounded-md border px-4 py-2 text-sm">Design review at 14:30</div>
      <div class="rounded-md border px-4 py-2 text-sm">Submit timesheet</div>
    </CollapsibleContent>
  </Collapsible>
{/if}

{#if story === 'Button trigger'}
  <Collapsible class="max-w-md">
    {#snippet children({ open: isOpen })}
      <CollapsibleTrigger>
        {#snippet child({ props })}
          <Button variant="outline" size="sm" {...props}>
            {#if isOpen}
              <Minus class="size-4" aria-hidden="true" />
            {:else}
              <Plus class="size-4" aria-hidden="true" />
            {/if}
            {isOpen ? 'Hide details' : 'Show details'}
          </Button>
        {/snippet}
      </CollapsibleTrigger>
      <CollapsibleContent class="mt-2 rounded-md border px-4 py-3 text-sm">
        <p class="font-medium">Order #18412</p>
        <p class="text-muted-foreground mt-1">Shipped via UPS Ground · Estimated delivery May 12.</p>
      </CollapsibleContent>
    {/snippet}
  </Collapsible>
{/if}

{#if story === 'Long content'}
  <Collapsible defaultOpen class="max-w-md">
    <div class="flex items-center justify-between gap-3 rounded-md border px-4 py-2">
      <h4 class="text-sm font-medium">Recent commits (12)</h4>
      <CollapsibleTrigger>
        {#snippet child({ props })}
          <Button variant="ghost" size="icon-sm" {...props}>
            <ChevronsUpDown class="size-4" aria-hidden="true" />
            <span class="sr-only">Toggle</span>
          </Button>
        {/snippet}
      </CollapsibleTrigger>
    </div>
    <CollapsibleContent class="mt-1 space-y-1">
      {#each Array.from({ length: 8 }, (_, i) => i + 1) as i (i)}
        <div class="rounded-md border px-4 py-2 font-mono text-xs">
          <span class="text-muted-foreground">{'0a1b2c'.slice(0, 6)}{i}</span>
          <span class="ml-2">refactor: extract use{frameworks[i - 1]} composable</span>
        </div>
      {/each}
    </CollapsibleContent>
  </Collapsible>
{/if}

{#if story === 'Animated chevron rotation'}
  <Collapsible class="max-w-md">
    {#snippet children({ open: isOpen })}
      <CollapsibleTrigger>
        {#snippet child({ props })}
          <Button variant="ghost" class="w-full justify-between" {...props}>
            <span class="font-medium">Advanced options</span>
            <ChevronsUpDown
              class="size-4 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"
              aria-hidden="true"
            />
          </Button>
        {/snippet}
      </CollapsibleTrigger>
      <CollapsibleContent class="mt-2 space-y-1.5">
        <div class="rounded-md border px-4 py-2 text-sm">
          <span class="text-muted-foreground">Webhook URL</span>
          <code class="text-foreground/90 ml-2 font-mono text-xs">https://api.example.com/hooks</code>
        </div>
        <div class="rounded-md border px-4 py-2 text-sm">
          <span class="text-muted-foreground">Retry policy</span>
          <span class="ml-2">Exponential backoff, max 5</span>
        </div>
        <div class="rounded-md border px-4 py-2 text-sm">
          <span class="text-muted-foreground">Timeout</span>
          <span class="ml-2">30s</span>
        </div>
      </CollapsibleContent>
    {/snippet}
  </Collapsible>
{/if}
