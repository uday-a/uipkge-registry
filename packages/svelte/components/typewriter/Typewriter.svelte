<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface TypewriterProps extends HTMLAttributes<HTMLSpanElement> {
    /** A single phrase or a list cycled type -> pause -> delete -> next. */
    phrases: string | string[]
    /** Milliseconds per typed character. */
    typingSpeed?: number
    /** Milliseconds per deleted character. */
    deletingSpeed?: number
    /** Milliseconds a completed phrase holds before deleting. */
    pause?: number
    /** Milliseconds before the first character types. */
    startDelay?: number
    /** When false, stops after fully typing the last phrase (caret keeps blinking). */
    loop?: boolean
    showCaret?: boolean
    ref?: HTMLSpanElement | null
  }
</script>

<script lang="ts">
  import { onDestroy, onMount, untrack } from 'svelte'
  import { cn } from '$lib/utils'

  let {
    phrases,
    typingSpeed = 45,
    deletingSpeed = 25,
    pause = 1600,
    startDelay = 0,
    loop = true,
    showCaret = true,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: TypewriterProps = $props()

  const phraseList = $derived(Array.isArray(phrases) ? phrases : [phrases])
  const srText = $derived(phraseList.join('. '))

  // Starts empty on server AND client first paint; sequencing begins in
  // onMount only, so SSR markup and hydration output always match.
  let text = $state('')
  let reduced = $state(false)

  let timer: ReturnType<typeof setTimeout> | null = null

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  function schedule(fn: () => void, delay: number) {
    clearTimer()
    timer = setTimeout(() => {
      timer = null
      fn()
    }, delay)
  }

  function run() {
    clearTimer()
    const list = phraseList
    if (list.length === 0) return

    let index = 0
    let chars = 0
    let deleting = false

    function step() {
      const current = list[index] ?? ''
      if (!deleting) {
        chars += 1
        text = current.slice(0, chars)
        if (chars < current.length) {
          schedule(step, typingSpeed)
        } else if (loop || index < list.length - 1) {
          schedule(() => {
            deleting = true
            step()
          }, pause)
        }
        // loop=false on the last phrase: stop here; the caret keeps blinking.
      } else {
        chars -= 1
        text = current.slice(0, chars)
        if (chars > 0) {
          schedule(step, deletingSpeed)
        } else {
          deleting = false
          index = (index + 1) % list.length
          step()
        }
      }
    }

    if (startDelay > 0) schedule(step, startDelay)
    else step()
  }

  onMount(() => {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      // Skip the animation entirely: render the phrase in full with a static caret.
      text = phraseList[0] ?? ''
      return
    }
    run()
  })

  // Restart the sequence when the phrases prop changes. The identity guard
  // skips the effect's initial run (onMount owns the first start).
  let prevPhrases: string | string[] = untrack(() => phrases)
  $effect(() => {
    if (phrases === prevPhrases) return
    prevPhrases = phrases
    if (reduced) {
      text = phraseList[0] ?? ''
      return
    }
    run()
  })

  onDestroy(clearTimer)
</script>

<span bind:this={ref} data-uipkge data-slot="typewriter" class={cn(className)} {...restProps}>
  <span class="sr-only">{srText}</span>
  <span aria-hidden="true" class="whitespace-pre-wrap"
    ><span>{text}</span>{#if showCaret}<span
        class={cn('inline-block h-[1em] w-[0.5ch] bg-current align-baseline', !reduced && 'animate-caret-blink')}
      ></span>{/if}</span
  >
</span>
