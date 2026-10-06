<script lang="ts">
  import { OverlayScroll } from '@svelte-registry/overlay-scroll'

  let { story }: { story: string } = $props()

  const authors = ['Sarah', 'Marcus', 'Priya', 'Diego', 'Yuki', 'Aditya']
  const texts = [
    'Pushed the migration. Logs look clean on staging.',
    'Bumping this — anyone reviewing the auth PR?',
    'Standup notes from yesterday are in the doc.',
    'Mobile build green. Cutting RC1 now.',
    'Q3 OKR draft ready for feedback.',
    'Fixed the off-by-one. New build deploying.',
    'Anyone seeing slowdowns on /dashboard? Looking into it.',
    'Closed P-1342. Was a Redis cache miss.',
  ]
  const messages = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    author: authors[i % authors.length],
    text: texts[i % texts.length],
    time: `${(i * 7) % 60}m`,
  }))

  const navItems = [
    'Inbox',
    'Sent',
    'Drafts',
    'Spam',
    'Trash',
    'All Mail',
    'Important',
    'Starred',
    'Snoozed',
    'Scheduled',
    'Outbox',
    'Categories',
    'Social',
    'Updates',
    'Forums',
    'Promotions',
    'Archive',
    'Templates',
    'Tasks',
    'Notes',
    'Calendar',
    'Contacts',
  ]

  let scroller: { getScroller: () => HTMLElement | null; recompute: () => void } | undefined = $state()
  function scrollToBottom() {
    scroller?.getScroller()?.scrollTo({ top: 1e9, behavior: 'smooth' })
  }
  function scrollToTop() {
    scroller?.getScroller()?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  let rowCount = $state(20)
</script>

{#if story === 'Default'}
  <OverlayScroll class="border-border h-64 rounded-md border">
    <ul class="divide-border divide-y">
      {#each messages as m (m.id)}
        <li class="px-3 py-2">
          <div class="flex items-baseline justify-between gap-2">
            <span class="text-sm font-medium">{m.author}</span>
            <span class="text-muted-foreground text-xs">{m.time}</span>
          </div>
          <p class="text-muted-foreground text-sm">{m.text}</p>
        </li>
      {/each}
    </ul>
  </OverlayScroll>
{/if}

{#if story === 'Sidebar nav'}
  <div class="border-border flex h-64 w-56 flex-col rounded-md border">
    <p class="border-border border-b px-3 py-2 text-xs font-semibold tracking-wide uppercase">Mailbox</p>
    <OverlayScroll class="min-h-0 flex-1">
      <ul class="p-1.5">
        {#each navItems as item, i (item)}
          <li
            class="rounded-md px-2.5 py-1.5 text-sm {i === 0
              ? 'bg-accent text-accent-foreground font-medium'
              : 'hover:bg-accent/50 text-muted-foreground'}"
          >
            {item}
          </li>
        {/each}
      </ul>
    </OverlayScroll>
  </div>
{/if}

{#if story === 'Programmatic scroll'}
  <div class="space-y-2">
    <div class="flex gap-2">
      <button
        type="button"
        class="bg-secondary text-secondary-foreground rounded-md px-3 py-1.5 text-sm"
        onclick={scrollToTop}
      >
        Scroll to top
      </button>
      <button
        type="button"
        class="bg-secondary text-secondary-foreground rounded-md px-3 py-1.5 text-sm"
        onclick={scrollToBottom}
      >
        Scroll to bottom
      </button>
    </div>
    <OverlayScroll bind:this={scroller} class="border-border h-64 rounded-md border">
      <ul class="divide-border divide-y">
        {#each messages as m (m.id)}
          <li class="px-3 py-2 text-sm">
            <span class="font-medium">{m.author}</span>
            <span class="text-muted-foreground"> — {m.text}</span>
          </li>
        {/each}
      </ul>
    </OverlayScroll>
  </div>
{/if}

{#if story === 'Dynamic growth'}
  <div class="space-y-2">
    <button
      type="button"
      class="bg-secondary text-secondary-foreground rounded-md px-3 py-1.5 text-sm"
      onclick={() => (rowCount += 20)}
    >
      Append 20 rows ({rowCount})
    </button>
    <OverlayScroll class="border-border h-64 rounded-md border">
      <ul class="divide-border divide-y">
        {#each Array.from({ length: rowCount }, (_, i) => i) as i (i)}
          <li class="px-3 py-2 font-mono text-xs">event-{String(i).padStart(4, '0')} · ok</li>
        {/each}
      </ul>
    </OverlayScroll>
  </div>
{/if}

{#if story === 'Non-draggable thumb'}
  <OverlayScroll draggable={false} class="border-border h-64 rounded-md border">
    <ul class="divide-border divide-y">
      {#each messages as m (m.id)}
        <li class="px-3 py-2 text-sm">
          <span class="font-medium">{m.author}</span>
          <span class="text-muted-foreground"> — {m.text}</span>
        </li>
      {/each}
    </ul>
  </OverlayScroll>
{/if}
