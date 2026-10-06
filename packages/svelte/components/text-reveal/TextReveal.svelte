<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TextRevealProps extends HTMLAttributes<HTMLElement> {
    text: string
    as?: string
    mode?: 'words' | 'chars'
    /** ms between segment starts */
    stagger?: number
    /** ms per segment transition */
    duration?: number
    /** ms before the first segment starts */
    delay?: number
    blur?: boolean
    /** reveal only on first intersection; false re-hides when scrolled away */
    once?: boolean
    ref?: HTMLElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'

  let {
    text,
    as: tag = 'span',
    mode = 'words',
    stagger = 40,
    duration = 600,
    delay = 0,
    blur = true,
    once = true,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: TextRevealProps = $props()

  interface Segment {
    text: string
    space: boolean
  }

  const segments: Segment[] = $derived.by(() => {
    const source = text.replace(/\s+/g, ' ').trim()
    if (mode === 'chars') {
      return Array.from(source).map((ch) => ({ text: ch, space: ch === ' ' }))
    }
    const words = source.split(' ')
    // Interleave plain spaces so word spacing stays natural.
    return words.flatMap((word, i) =>
      i < words.length - 1
        ? [
            { text: word, space: false },
            { text: '', space: true },
          ]
        : [{ text: word, space: false }],
    )
  })

  let revealed = $state(false)

  function observe(node: HTMLElement) {
    ref = node
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') {
      revealed = true
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            revealed = true
            if (once) observer.disconnect()
          } else if (!once) {
            revealed = false
          }
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(node)
    return {
      destroy() {
        observer.disconnect()
      },
    }
  }
</script>

<svelte:element
  this={tag}
  use:observe
  data-uipkge=""
  data-slot="text-reveal"
  aria-label={text}
  class={cn('inline-block', revealed && 'is-revealed', className)}
  {...restProps}
>
  {#each segments as seg, i (`${seg.text}-${i}`)}
    {#if seg.space}
      <span aria-hidden="true">&nbsp;</span>
    {:else}
      <span
        aria-hidden="true"
        data-slot="text-reveal-segment"
        class={cn('text-reveal-seg inline-block will-change-transform', blur && 'text-reveal-blur')}
        style={`transition-delay: ${delay + i * stagger}ms; transition-duration: ${duration}ms;`}
        >{seg.text}</span
      >
    {/if}
  {/each}
</svelte:element>

<style>
  :global([data-slot='text-reveal'] .text-reveal-seg) {
    opacity: 0;
    transform: translateY(0.5em);
    transition-property: opacity, transform, filter;
    transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  }

  :global([data-slot='text-reveal'].is-revealed .text-reveal-seg) {
    opacity: 1;
    transform: translateY(0);
  }

  :global([data-slot='text-reveal'] .text-reveal-blur) {
    filter: blur(8px);
  }

  :global([data-slot='text-reveal'].is-revealed .text-reveal-blur) {
    filter: blur(0);
  }

  @media (prefers-reduced-motion: reduce) {
    :global([data-slot='text-reveal'] .text-reveal-seg) {
      opacity: 1 !important;
      transform: none !important;
      filter: none !important;
      transition: none !important;
    }
  }
</style>
