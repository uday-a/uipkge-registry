<script lang="ts">
  import { BackTop } from '@svelte-registry/back-top'
  import { ArrowUp, ChevronUp } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  const feed = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    title: `Release notes v0.${i + 12}.0`,
    excerpt: 'Bug fixes, performance improvements, and a few new primitives shipped this week.',
  }))

  let visibleLog = $state<string[]>([])

  function onVisible(v: boolean) {
    visibleLog.unshift(`${v ? 'shown' : 'hidden'} at ${new Date().toLocaleTimeString()}`)
    if (visibleLog.length > 3) visibleLog.pop()
  }
</script>

{#if story === 'In a long article'}
  <div class="bg-card max-w-md rounded-xl border shadow-sm">
    <div class="flex flex-col gap-1.5 p-6">
      <h3 class="leading-none font-semibold tracking-tight">Changelog</h3>
      <p class="text-muted-foreground text-sm">Scroll the list below to reveal the back-to-top button.</p>
    </div>
    <div class="p-6 pt-0">
      <div class="back-top-feed border-border relative max-h-64 space-y-2 overflow-y-auto rounded-md border p-3">
        {#each feed as item (item.id)}
          <div class="bg-muted/40 rounded-md p-3">
            <p class="text-sm font-medium">{item.title}</p>
            <p class="text-muted-foreground mt-1 text-xs">{item.excerpt}</p>
          </div>
        {/each}
        <BackTop target=".back-top-feed" offset={8} threshold={40} position="bottom-right" absolute />
      </div>
    </div>
  </div>
{/if}

{#if story === 'Page-level (live)'}
  <p class="text-muted-foreground max-w-md text-sm">
    Scroll the page itself to reveal the floating button. It smooth-scrolls back to the top on click.
  </p>
  <BackTop threshold={200} offset={24} position="bottom-right" onvisiblechange={onVisible} />
{/if}

{#if story === 'Visibility events'}
  <div class="max-w-md space-y-3">
    <div class="back-top-event-feed border-border relative max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
      {#each feed.slice(0, 8) as item (item.id)}
        <div class="bg-muted/40 rounded-md p-3">
          <p class="text-sm font-medium">{item.title}</p>
        </div>
      {/each}
      <BackTop target=".back-top-event-feed" offset={8} threshold={40} absolute onvisiblechange={onVisible} />
    </div>
    <div class="space-y-1 text-xs">
      {#each visibleLog as log (log)}
        <p class="text-muted-foreground tabular-nums">{log}</p>
      {/each}
      {#if !visibleLog.length}
        <p class="text-muted-foreground">Scroll the list to fire onvisiblechange events.</p>
      {/if}
    </div>
  </div>
{/if}

{#if story === 'Size variants'}
  <div class="flex items-end gap-4">
    <div class="border-border relative flex h-24 w-24 items-end justify-center rounded-md border">
      <BackTop size="sm" threshold={0} absolute offset={4} />
      <span class="text-muted-foreground mb-1 text-xs">sm</span>
    </div>
    <div class="border-border relative flex h-24 w-24 items-end justify-center rounded-md border">
      <BackTop size="default" threshold={0} absolute offset={4} />
      <span class="text-muted-foreground mb-1 text-xs">default</span>
    </div>
    <div class="border-border relative flex h-24 w-24 items-end justify-center rounded-md border">
      <BackTop size="lg" threshold={0} absolute offset={4} />
      <span class="text-muted-foreground mb-1 text-xs">lg</span>
    </div>
  </div>
{/if}

{#if story === 'Custom icon'}
  <div class="flex items-end gap-4">
    <div class="border-border relative flex h-24 w-24 items-end justify-center rounded-md border">
      <BackTop threshold={0} absolute offset={4}>
        {#snippet icon()}
          <ChevronUp />
        {/snippet}
      </BackTop>
      <span class="text-muted-foreground mb-1 text-xs">ChevronUp</span>
    </div>
    <div class="border-border relative flex h-24 w-24 items-end justify-center rounded-md border">
      <BackTop threshold={0} absolute offset={4}>
        {#snippet icon()}
          <ArrowUp class="size-5" />
        {/snippet}
      </BackTop>
      <span class="text-muted-foreground mb-1 text-xs">ArrowUp</span>
    </div>
  </div>
{/if}

{#if story === 'Edge anchors'}
  <div class="grid max-w-md grid-cols-2 gap-4">
    <div class="border-border relative h-28 rounded-md border p-3">
      <span class="text-muted-foreground text-xs">bottom-right</span>
      <BackTop threshold={0} position="bottom-right" offset={8} absolute />
    </div>
    <div class="border-border relative h-28 rounded-md border p-3">
      <span class="text-muted-foreground text-xs">bottom-left</span>
      <BackTop threshold={0} position="bottom-left" offset={8} absolute />
    </div>
    <div class="border-border relative h-28 rounded-md border p-3">
      <span class="text-muted-foreground text-xs">top-right</span>
      <BackTop threshold={0} position="top-right" offset={8} absolute />
    </div>
    <div class="border-border relative h-28 rounded-md border p-3">
      <span class="text-muted-foreground text-xs">top-left</span>
      <BackTop threshold={0} position="top-left" offset={8} absolute />
    </div>
  </div>
{/if}

{#if story === 'Threshold & behavior'}
  <p class="text-muted-foreground max-w-md text-sm">
    Use a higher <code class="text-foreground">threshold</code> like 600px to delay visibility until the user has
    scrolled significantly. Set <code class="text-foreground">behavior="auto"</code> for an instant jump instead of
    the default animated scroll.
  </p>
{/if}
