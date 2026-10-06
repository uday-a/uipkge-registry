<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes, HTMLAnchorAttributes } from 'svelte/elements'

  // `popover` is omitted: the native popover attribute collides with the
  // boolean profile-card prop.
  export interface MentionTagProps extends Omit<HTMLAttributes<HTMLElement>, 'popover'> {
    trigger?: string
    name?: string
    handle?: string
    email?: string
    avatar?: string
    bio?: string
    joined?: string
    location?: string
    following?: number | string
    followers?: number | string
    verified?: boolean
    href?: string
    popover?: boolean
    openDelay?: number
    closeDelay?: number
    /** Popup card content override (React parity name). */
    popupContent?: Snippet
    /** Alias of `popupContent` (legacy Svelte name). */
    popup?: Snippet
    children?: Snippet
    ref?: HTMLElement | null
  }
</script>

<script lang="ts">
  import { Calendar } from '@lucide/svelte'
  import { cn } from '$lib/utils'

  let {
    class: className,
    trigger = '@',
    name,
    handle,
    email,
    avatar,
    bio,
    joined,
    location: _location,
    following,
    followers,
    verified,
    href,
    popover = true,
    openDelay = 150,
    closeDelay = 100,
    popupContent,
    popup,
    children,
    ref = $bindable(null),
    ...restProps
  }: MentionTagProps = $props()

  const resolvedPopup = $derived(popupContent ?? popup)

  // `_location` is accepted for API parity with the Vue twin; the current card
  // layout only renders `joined` (same as Vue).

  let isFollowing = $state(false)
  let cardOpen = $state(false)
  let openTimer: ReturnType<typeof setTimeout> | null = null
  let closeTimer: ReturnType<typeof setTimeout> | null = null

  function clearTimers() {
    if (openTimer) clearTimeout(openTimer)
    if (closeTimer) clearTimeout(closeTimer)
    openTimer = null
    closeTimer = null
  }

  function scheduleOpen() {
    if (!popover) return
    if (closeTimer) clearTimeout(closeTimer)
    closeTimer = null
    if (cardOpen || openTimer) return
    openTimer = setTimeout(() => {
      openTimer = null
      cardOpen = true
    }, openDelay)
  }

  function scheduleClose() {
    if (openTimer) clearTimeout(openTimer)
    openTimer = null
    if (!cardOpen || closeTimer) return
    closeTimer = setTimeout(() => {
      closeTimer = null
      cardOpen = false
    }, closeDelay)
  }

  $effect(() => {
    return () => clearTimers()
  })

  const formattedHandle = $derived.by(() => {
    if (!handle && !name) return ''
    const h = handle || name || ''
    return h.startsWith(trigger) ? h : `${trigger}${h}`
  })

  const initials = $derived.by(() => {
    const source = name || handle || 'U'
    return source.slice(0, 2).toUpperCase()
  })

  const tagClass = $derived(
    cn(
      'inline-flex cursor-pointer items-center gap-0.5 rounded px-1.5 py-0.5 text-sm font-medium transition-colors select-none',
      'bg-muted/70 text-foreground hover:bg-accent hover:text-accent-foreground',
      'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
      className,
    ),
  )

  const plainTagClass = $derived(
    cn(
      'inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-sm font-medium transition-colors',
      'bg-muted/70 text-foreground',
      className,
    ),
  )
</script>

{#snippet tagContent()}
  {#if children}
    {@render children()}
  {:else}
    <span class="text-primary font-semibold">{trigger}</span>
    <span>{name || handle || email}</span>
  {/if}
{/snippet}

{#snippet profileCard()}
  {#if resolvedPopup}
    {@render resolvedPopup()}
  {:else}
    <!-- Twitter/X style profile popup -->
    <div class="space-y-3">
      <div class="flex items-start justify-between gap-3">
        <span class="ring-border/50 relative flex size-12 shrink-0 overflow-hidden rounded-full ring-2">
          {#if avatar}
            <img src={avatar} alt={name || handle} class="aspect-square size-full object-cover" />
          {:else}
            <span class="bg-muted flex size-full items-center justify-center text-sm font-semibold">
              {initials}
            </span>
          {/if}
        </span>
        <button
          type="button"
          class={cn(
            'h-8 rounded-full px-3.5 text-xs font-semibold transition-[transform,background-color] duration-150 active:scale-95',
            isFollowing
              ? 'border-border text-foreground hover:bg-muted border bg-transparent'
              : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs',
          )}
          onclick={(e) => {
            e.stopPropagation()
            isFollowing = !isFollowing
          }}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>

      <div>
        <div class="flex items-center gap-1">
          <span class="text-foreground text-sm font-bold tracking-tight">{name || handle}</span>
          {#if verified}
            <span class="text-primary inline-flex" title="Verified">
              <svg class="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </span>
          {/if}
        </div>
        <p class="text-muted-foreground font-mono text-xs">{formattedHandle}</p>
        {#if email}
          <p class="text-muted-foreground mt-0.5 text-xs">{email}</p>
        {/if}
      </div>

      {#if bio}
        <p class="text-foreground/90 text-xs leading-relaxed">{bio}</p>
      {/if}

      {#if joined}
        <div class="text-muted-foreground flex items-center gap-4 text-xs">
          <div class="flex items-center gap-1">
            <Calendar class="size-3.5 opacity-70" />
            <span>Joined {joined}</span>
          </div>
        </div>
      {/if}

      {#if following !== undefined || followers !== undefined}
        <div class="border-border/50 flex items-center gap-4 border-t pt-1 text-xs">
          {#if following !== undefined}
            <div>
              <span class="text-foreground font-bold">{following}</span>
              <span class="text-muted-foreground ml-1">Following</span>
            </div>
          {/if}
          {#if followers !== undefined}
            <div>
              <span class="text-foreground font-bold">{followers}</span>
              <span class="text-muted-foreground ml-1">Followers</span>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
{/snippet}

{#if popover}
  <!-- Hand-rolled HoverCard: no headless float dependency in the Svelte
       registry yet, so open/close delays + outside dismiss are local. -->
  <!-- svelte-ignore a11y_no_static_element_interactions: hover bridge for the tag + card, not interactive itself -->
  <span
    class="relative inline-block"
    onmouseenter={scheduleOpen}
    onmouseleave={scheduleClose}
    onfocusin={scheduleOpen}
    onfocusout={scheduleClose}
  >
    {#if href}
      <a
        bind:this={ref}
        {href}
        data-uipkge=""
        data-slot="mention-tag"
        class={tagClass}
        {...(restProps as HTMLAnchorAttributes)}
      >
        {@render tagContent()}
      </a>
    {:else}
      <span
        bind:this={ref}
        role="button"
        data-uipkge=""
        data-slot="mention-tag"
        class={tagClass}
        tabindex="0"
        {...restProps}
      >
        {@render tagContent()}
      </span>
    {/if}
    {#if cardOpen}
      <!-- svelte-ignore a11y_no_static_element_interactions: hover bridge keeps the card open while hovered -->
      <div
        data-slot="mention-tag-content"
        class="bg-popover text-popover-foreground border-border/80 absolute top-full left-0 z-50 mt-1.5 w-80 rounded-xl border p-4 shadow-lg"
        onmouseenter={scheduleOpen}
        onmouseleave={scheduleClose}
      >
        {@render profileCard()}
      </div>
    {/if}
  </span>
{:else}
  <!-- Non-popover fallback -->
  {#if href}
    <a
      bind:this={ref}
      {href}
      data-uipkge=""
      data-slot="mention-tag"
      class={plainTagClass}
      {...(restProps as HTMLAnchorAttributes)}
    >
      {@render tagContent()}
    </a>
  {:else}
    <span bind:this={ref} data-uipkge="" data-slot="mention-tag" class={plainTagClass} {...restProps}>
      {@render tagContent()}
    </span>
  {/if}
{/if}
