<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import { IconTransition } from '@svelte-registry/icon-transition'
  import {
    Bookmark,
    BookmarkCheck,
    Check,
    Copy,
    Heart,
    Link2,
    Plus,
    Share2,
    Star,
    ThumbsUp,
    UserPlus,
    UserCheck,
  } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  const sampleUrl = 'https://uipkge.dev/r/vue/button.json'
  async function copySample() {
    try {
      await navigator.clipboard?.writeText(sampleUrl)
      return true
    } catch {
      return false
    }
  }

  let liked = $state(false)
  let bookmarkRef = $state<{ trigger: () => void; reset: () => void } | null>(null)
</script>

{#if story === 'Default — copy command'}
  <div class="bg-muted/30 border-border flex items-center gap-3 rounded-lg border px-4 py-3 font-mono text-sm">
    <code class="min-w-0 flex-1 truncate">{sampleUrl}</code>
    <IconTransition
      defaultIcon={Copy}
      activeIcon={Check}
      iconClass="size-4"
      label="Copy URL"
      activeLabel="Copied"
      class="text-muted-foreground hover:bg-muted hover:text-foreground size-8 rounded-md"
      action={copySample}
    />
  </div>
{/if}

{#if story === 'Externally controlled — like button'}
  <Button variant="outline" class={liked ? 'text-rose-500' : ''} onclick={() => (liked = !liked)}>
    <IconTransition
      as="span"
      defaultIcon={Heart}
      activeIcon={Heart}
      active={liked}
      activeClass="text-rose-500 fill-current"
      iconClass="size-4"
      class="size-4"
    />
    {liked ? 'Liked' : 'Like'}
  </Button>
{/if}

{#if story === 'Stay active — bookmark with manual reset'}
  <div class="flex items-center gap-3">
    <IconTransition
      bind:this={bookmarkRef}
      defaultIcon={Bookmark}
      activeIcon={BookmarkCheck}
      resetAfter={0}
      iconClass="size-5"
      label="Save"
      activeLabel="Saved"
      class="border-border hover:bg-muted size-9 rounded-md border"
    />
    <Button variant="ghost" size="sm" onclick={() => bookmarkRef?.reset()}>Reset</Button>
  </div>
{/if}

{#if story === 'Different icons per role'}
  <div class="flex flex-wrap gap-2">
    <IconTransition
      defaultIcon={Share2}
      activeIcon={Check}
      iconClass="size-4"
      label="Share"
      activeLabel="Shared"
      class="border-border hover:bg-muted size-9 rounded-md border"
    />
    <IconTransition
      defaultIcon={UserPlus}
      activeIcon={UserCheck}
      iconClass="size-4"
      label="Follow"
      activeLabel="Following"
      activeClass="text-info"
      class="border-border hover:bg-muted size-9 rounded-md border"
    />
    <IconTransition
      defaultIcon={Star}
      activeIcon={Star}
      iconClass="size-4"
      label="Star"
      activeLabel="Starred"
      activeClass="text-amber-500 fill-current"
      class="border-border hover:bg-muted size-9 rounded-md border"
    />
    <IconTransition
      defaultIcon={ThumbsUp}
      activeIcon={ThumbsUp}
      iconClass="size-4"
      label="Upvote"
      activeLabel="Upvoted"
      activeClass="text-emerald-500 fill-current"
      class="border-border hover:bg-muted size-9 rounded-md border"
    />
    <IconTransition
      defaultIcon={Plus}
      activeIcon={Check}
      iconClass="size-4"
      label="Add"
      activeLabel="Added"
      class="border-border hover:bg-muted size-9 rounded-md border"
    />
  </div>
{/if}

{#if story === 'Inline inside a chip'}
  <div class="flex flex-wrap gap-1.5">
    {#each ['button', 'data-table', 'dialog', 'sonner'] as name (name)}
      <button
        type="button"
        class="group bg-muted/30 border-border hover:border-primary/40 focus-visible:ring-ring inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
        onclick={copySample}
      >
        <span class="text-muted-foreground font-sans tracking-wider uppercase">add</span>
        <span>{name}</span>
        <IconTransition
          as="span"
          defaultIcon={Link2}
          activeIcon={Check}
          iconClass="size-3"
          class="text-muted-foreground size-3"
        />
      </button>
    {/each}
  </div>
  <p class="text-muted-foreground mt-2 text-xs">
    Each chip is its own button; the IconTransition lives inside in `as="span"` mode and never receives clicks
    directly.
  </p>
{/if}
