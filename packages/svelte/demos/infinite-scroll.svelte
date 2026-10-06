<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import { InfiniteScroll } from '@svelte-registry/infinite-scroll'

  let { story }: { story: string } = $props()

  interface FeedItem {
    id: number
    title: string
    author: string
    time: string
  }

  const titles = [
    'Shipping rate cards v2',
    'New onboarding flow is live',
    'Q3 retention deep-dive',
    'Design system tokens audit',
    'Customer feedback summary',
    'Pricing experiment results',
    'Mobile app crash report',
    'Hiring pipeline update',
  ]
  const authors = ['Sarah Chen', 'Marcus Webb', 'Priya Patel', 'Tom Garcia', 'Lisa Wong']

  function makePage(n: number): FeedItem[] {
    return Array.from({ length: 6 }, (_, i) => {
      const id = (n - 1) * 6 + i + 1
      return {
        id,
        title: titles[(id - 1) % titles.length],
        author: authors[(id - 1) % authors.length],
        time: `${2 + ((id * 7) % 50)} min ago`,
      }
    })
  }

  let items = $state<FeedItem[]>(makePage(1))
  let loading = $state(false)
  let hasMore = $state(true)
  let page = $state(1)

  async function load() {
    if (loading || !hasMore) return
    loading = true
    await new Promise((r) => setTimeout(r, 800))
    page += 1
    items.push(...makePage(page))
    if (page >= 5) hasMore = false
    loading = false
  }

  function reset() {
    page = 1
    items = makePage(1)
    hasMore = true
    loading = false
  }

  // Reverse-mode chat demo
  interface ChatMsg {
    id: number
    author: string
    text: string
  }
  let messages = $state<ChatMsg[]>(
    Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      author: i % 2 === 0 ? 'You' : 'Maya',
      text: ['Hey, did you see the new deploy?', 'Yeah, looks great!', 'Pushing the fix now', 'LGTM 👍'][i % 4],
    })),
  )
  let reverseLoading = $state(false)
  let reverseHasMore = $state(true)
  let reverseCount = 8

  async function loadReverse() {
    if (reverseLoading || !reverseHasMore) return
    reverseLoading = true
    await new Promise((r) => setTimeout(r, 800))
    const older: ChatMsg[] = Array.from({ length: 4 }, (_, i) => ({
      id: reverseCount + i + 1,
      author: (reverseCount + i) % 2 === 0 ? 'You' : 'Maya',
      text: `Older message ${reverseCount + i + 1}`,
    }))
    reverseCount += 4
    messages = [...older, ...messages]
    if (reverseCount >= 20) reverseHasMore = false
    reverseLoading = false
  }
</script>

{#if story === 'Feed with load-more'}
  <div class="flex max-w-md flex-col gap-3">
    <div class="flex items-center justify-between">
      <p class="text-muted-foreground text-sm">Scroll to load more — 5 pages total.</p>
      <Button variant="outline" size="sm" onclick={reset}>Reset</Button>
    </div>
    <div class="infinite-feed h-96 overflow-y-auto rounded-lg border p-3">
      <InfiniteScroll {items} {loading} {hasMore} scrollTarget={'.infinite-feed'} onload={load}>
        {#snippet children({ items: rows }: { items: FeedItem[] })}
          <div class="flex flex-col gap-2">
            {#each rows as item (item.id)}
              <div class="rounded-md border p-3">
                <p class="text-sm font-medium">{item.title}</p>
                <p class="text-muted-foreground text-xs">{item.author} · {item.time}</p>
              </div>
            {/each}
          </div>
        {/snippet}
      </InfiniteScroll>
    </div>
  </div>
{/if}

{#if story === 'Reverse chat history'}
  <div class="flex max-w-md flex-col gap-3">
    <p class="text-muted-foreground text-sm">Scroll up to load older messages.</p>
    <div class="infinite-chat h-96 overflow-y-auto rounded-lg border p-3">
      <InfiniteScroll
        items={messages}
        loading={reverseLoading}
        hasMore={reverseHasMore}
        reverse
        scrollTarget={'.infinite-chat'}
        onload={loadReverse}
      >
        {#snippet children({ items: rows }: { items: ChatMsg[] })}
          <div class="flex flex-col gap-2">
            {#each rows as msg (msg.id)}
              <div class="rounded-md border p-2 text-sm">
                <span class="font-medium">{msg.author}:</span>
                {msg.text}
              </div>
            {/each}
          </div>
        {/snippet}
      </InfiniteScroll>
    </div>
  </div>
{/if}
