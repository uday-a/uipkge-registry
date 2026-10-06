<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import { HoverCard, HoverCardContent, HoverCardTrigger } from '@svelte-registry/hover-card'
  import { CalendarDays } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  const sides = ['top', 'right', 'bottom', 'left'] as const
</script>

{#if story === 'Default'}
  <HoverCard>
    <HoverCardTrigger>
      <Button variant="link">@uipkge</Button>
    </HoverCardTrigger>
    <HoverCardContent class="w-72">
      <div class="flex gap-3">
        <div
          class="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
        >
          UI
        </div>
        <div class="space-y-1">
          <p class="text-sm font-semibold">@uipkge</p>
          <p class="text-muted-foreground text-xs">Open-source UI registry. shadcn-svelte compatible.</p>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
{/if}

{#if story === 'Custom delays'}
  <div class="flex flex-wrap items-center gap-4">
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger>
        <Button variant="outline">Instant</Button>
      </HoverCardTrigger>
      <HoverCardContent class="w-56">
        <p class="text-sm">openDelay: 0 — appears immediately on hover.</p>
      </HoverCardContent>
    </HoverCard>

    <HoverCard openDelay={700} closeDelay={200}>
      <HoverCardTrigger>
        <Button variant="outline">Default-ish</Button>
      </HoverCardTrigger>
      <HoverCardContent class="w-56">
        <p class="text-sm">openDelay: 700 / closeDelay: 200 — feels intentional.</p>
      </HoverCardContent>
    </HoverCard>

    <HoverCard openDelay={1500} closeDelay={500}>
      <HoverCardTrigger>
        <Button variant="outline">Lazy</Button>
      </HoverCardTrigger>
      <HoverCardContent class="w-56">
        <p class="text-sm">openDelay: 1500 / closeDelay: 500 — slow to surface.</p>
      </HoverCardContent>
    </HoverCard>
  </div>
{/if}

{#if story === 'With image content'}
  <HoverCard>
    <HoverCardTrigger>
      <Button variant="link">@sveltejs</Button>
    </HoverCardTrigger>
    <HoverCardContent class="w-80">
      <div class="flex gap-4">
        <img src="https://github.com/sveltejs.png" alt="@sveltejs" class="size-10 shrink-0 rounded-full" />
        <div class="space-y-1">
          <h4 class="text-sm font-semibold">@sveltejs</h4>
          <p class="text-sm">Cybernetically enhanced web apps.</p>
          <div class="text-muted-foreground flex items-center gap-1 pt-2 text-xs">
            <CalendarDays class="size-3.5" aria-hidden="true" />
            <span>Joined November 2016</span>
          </div>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
{/if}

{#if story === 'Inline mentions in a paragraph'}
  <p class="max-w-prose text-sm leading-7">
    Big thanks to
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="link" class="h-auto px-0 py-0 align-baseline">@sveltejs</Button>
      </HoverCardTrigger>
      <HoverCardContent class="w-64">
        <div class="flex gap-3">
          <div
            class="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
          >
            SV
          </div>
          <div>
            <p class="text-sm font-semibold">@sveltejs</p>
            <p class="text-muted-foreground text-xs">Cybernetically enhanced web apps.</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
    and
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="link" class="h-auto px-0 py-0 align-baseline">@tailwindcss</Button>
      </HoverCardTrigger>
      <HoverCardContent class="w-64">
        <div class="flex gap-3">
          <div
            class="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
          >
            TW
          </div>
          <div>
            <p class="text-sm font-semibold">@tailwindcss</p>
            <p class="text-muted-foreground text-xs">A utility-first CSS framework.</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
    for the foundations this builds on.
  </p>
{/if}

{#if story === 'Placement variants'}
  <div class="grid grid-cols-2 place-items-center gap-x-12 gap-y-6 py-12 sm:grid-cols-4">
    {#each sides as side (side)}
      <HoverCard>
        <HoverCardTrigger>
          <Button variant="outline" class="capitalize">{side}</Button>
        </HoverCardTrigger>
        <HoverCardContent {side} class="w-48">
          <p class="text-sm font-medium capitalize">{side} placement</p>
          <p class="text-muted-foreground mt-1 text-xs">side='{side}' on HoverCardContent.</p>
        </HoverCardContent>
      </HoverCard>
    {/each}
  </div>
{/if}
