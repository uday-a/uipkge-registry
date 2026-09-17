/**
 * useCarousel
 *
 * Lightweight carousel composable using native CSS scroll-snap.
 * No external dependencies required.
 */
import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'

export interface CarouselOptions {
  loop?: boolean
  orientation?: 'horizontal' | 'vertical'
}

export interface UseCarouselReturn {
  activeIndex: Ref<number>
  scrollSnaps: Ref<number[]>
  canScrollPrev: Ref<boolean>
  canScrollNext: Ref<boolean>
  scrollTo: (index: number, smooth?: boolean) => void
  scrollToPrev: (smooth?: boolean) => void
  scrollToNext: (smooth?: boolean) => void
  rootRef: Ref<HTMLElement | null>
  orientation: Ref<'horizontal' | 'vertical'>
}

export function useCarousel(options: CarouselOptions = {}): UseCarouselReturn {
  const { loop = false, orientation = 'horizontal' } = options

  const rootRef = ref<HTMLElement | null>(null)
  const activeIndex = ref(0)
  const scrollSnaps = ref<number[]>([])
  const canScrollPrev = ref(false)
  const canScrollNext = ref(false)

  const isHorizontal = computed(() => orientation === 'horizontal')

  function getScrollPosition(): number {
    if (!rootRef.value) return 0
    return isHorizontal.value ? rootRef.value.scrollLeft : rootRef.value.scrollTop
  }

  function getItemSize(): number {
    if (!rootRef.value) return 0
    return isHorizontal.value ? rootRef.value.offsetWidth : rootRef.value.offsetHeight
  }

  function updateScrollState() {
    if (!rootRef.value) return

    const el = rootRef.value
    const itemSize = getItemSize()
    if (itemSize === 0) return

    const scrollPos = getScrollPosition()
    const scrollWidth = isHorizontal.value ? el.scrollWidth : el.scrollHeight
    const viewportSize = isHorizontal.value ? el.offsetWidth : el.offsetHeight

    // Calculate active index
    activeIndex.value = Math.round(scrollPos / itemSize)

    // Update scroll snaps
    const newSnaps: number[] = []
    const itemCount = Math.ceil(scrollWidth / itemSize)
    for (let i = 0; i < itemCount; i++) {
      newSnaps.push(i * itemSize)
    }
    scrollSnaps.value = newSnaps

    // Update navigation state
    canScrollPrev.value = loop || scrollPos > 0
    canScrollNext.value = loop || scrollPos < scrollWidth - viewportSize - 1
  }

  function scrollTo(index: number, smooth = true) {
    if (!rootRef.value || index < 0) return

    const el = rootRef.value
    const itemSize = getItemSize()
    if (itemSize === 0) return

    const targetScroll = index * itemSize
    el.scrollTo({
      left: isHorizontal.value ? targetScroll : 0,
      top: isHorizontal.value ? 0 : targetScroll,
      behavior: smooth ? 'smooth' : 'auto',
    })
  }

  function scrollToPrev(smooth = true) {
    const maxIndex = scrollSnaps.value.length - 1
    if (maxIndex < 0) return
    if (loop) {
      const nextIndex = activeIndex.value <= 0 ? maxIndex : activeIndex.value - 1
      scrollTo(nextIndex, smooth)
      return
    }
    scrollTo(Math.max(0, activeIndex.value - 1), smooth)
  }

  function scrollToNext(smooth = true) {
    const maxIndex = scrollSnaps.value.length - 1
    if (maxIndex < 0) return
    const nextIndex = loop ? (activeIndex.value + 1) % (maxIndex + 1) : Math.min(maxIndex, activeIndex.value + 1)
    scrollTo(nextIndex, smooth)
  }

  let scrollHandler: (() => void) | null = null
  let resizeHandler: (() => void) | null = null

  onMounted(() => {
    if (rootRef.value) {
      updateScrollState()

      scrollHandler = () => updateScrollState()
      rootRef.value.addEventListener('scroll', scrollHandler, { passive: true })

      resizeHandler = () => updateScrollState()
      window.addEventListener('resize', resizeHandler, { passive: true })
    }
  })

  onUnmounted(() => {
    if (rootRef.value && scrollHandler) {
      rootRef.value.removeEventListener('scroll', scrollHandler)
    }
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
    }
  })

  return {
    activeIndex,
    scrollSnaps,
    canScrollPrev,
    canScrollNext,
    scrollTo,
    scrollToPrev,
    scrollToNext,
    rootRef,
    orientation: ref(orientation),
  }
}
