<script lang="ts" module>
  import type { TourTarget } from './tour-target.svelte'

  export interface TourStep {
    target?: TourTarget
    title: string
    description?: string
    cover?: string
    mask?: boolean
    nextButtonText?: string
    prevButtonText?: string
    finishButtonText?: string
  }

  export interface TourProps {
    open?: boolean
    current?: number
    steps: TourStep[]
    mask?: boolean
    type?: 'default' | 'primary'
    zIndex?: number
    onchange?: (v: number) => void
    onfinish?: () => void
    onclose?: () => void
  }
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import TourMask from './TourMask.svelte'
  import TourCard from './TourCard.svelte'
  import { createTourTarget } from './tour-target.svelte'

  let {
    open = $bindable(false),
    current = $bindable(0),
    steps,
    mask = true,
    type = 'default',
    zIndex = 1000,
    onchange,
    onfinish,
    onclose,
  }: TourProps = $props()

  let stepIndex = $state(current)
  $effect(() => {
    if (current !== stepIndex) stepIndex = current
  })

  const currentStep = $derived(steps[stepIndex] ?? null)

  const tracker = createTourTarget(() => currentStep?.target)

  // Client-only gate: the overlay portals to <body>, so it renders after
  // hydration to keep SSR markup identical.
  let mounted = $state(false)
  $effect(() => {
    mounted = true
  })

  /** Element that held focus before the tour opened — restored on close. */
  let previousFocus: HTMLElement | null = null
  let wasOpen = false

  $effect(() => {
    const isOpen = open
    // Track the step so re-anchoring runs on step change too.
    const idx = stepIndex
    void idx
    if (!isOpen) {
      tracker.detach()
      if (wasOpen) {
        previousFocus?.focus?.()
        previousFocus = null
      }
      wasOpen = false
      return
    }
    if (!wasOpen && typeof document !== 'undefined') {
      previousFocus = (document.activeElement as HTMLElement | null) ?? null
    }
    wasOpen = true
    tick().then(() => {
      tracker.attach()
      const t = steps[stepIndex]?.target
      if (t && typeof document !== 'undefined') {
        const el =
          typeof t === 'string'
            ? (document.querySelector(t) as HTMLElement | null)
            : typeof t === 'function'
              ? t()
              : t
        const reduce =
          typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
        el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
        // Re-measure after smooth scroll settles; skip long wait when reduce.
        setTimeout(() => tracker.measure(), reduce ? 0 : 320)
      }
    })
  })

  function setStep(i: number) {
    stepIndex = i
    current = i
    onchange?.(i)
  }

  function next() {
    if (stepIndex < steps.length - 1) setStep(stepIndex + 1)
  }

  function prev() {
    if (stepIndex > 0) setStep(stepIndex - 1)
  }

  function finish() {
    onfinish?.()
    open = false
  }

  function skip() {
    onclose?.()
    open = false
  }

  $effect(() => {
    if (!open || typeof document === 'undefined') return
    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        skip()
      }
    }
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  })

  const showMask = $derived(currentStep?.mask ?? mask)

  function portal(node: HTMLElement) {
    document.body.appendChild(node)
    return {
      destroy() {
        node.remove()
      },
    }
  }
</script>

{#if mounted && open && currentStep}
  <div use:portal style="display: contents">
    {#if showMask}
      <TourMask rect={tracker.rect} zIndex={zIndex} />
    {/if}
    <TourCard
      title={currentStep.title}
      description={currentStep.description}
      cover={currentStep.cover}
      rect={tracker.rect}
      total={steps.length}
      current={stepIndex}
      prevText={currentStep.prevButtonText}
      nextText={currentStep.nextButtonText}
      finishText={currentStep.finishButtonText}
      {type}
      {zIndex}
      autofocus
      onprev={prev}
      onnext={next}
      onfinish={finish}
      onskip={skip}
    />
  </div>
{/if}
