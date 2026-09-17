<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Menu, Sparkles } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const links = [
  { label: 'Product', href: '#product' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Customers', href: '#customers' },
  { label: 'Docs', href: '#docs' },
]

const active = ref(0)
const open = ref(false)
const navEl = ref<HTMLElement | null>(null)
// Measured from the live element, so the indicator fits any label length or
// font — no hard-coded widths to drift out of sync with the copy.
const indicator = ref({ left: 0, width: 0 })

function measure(index = active.value) {
  const items = navEl.value?.querySelectorAll<HTMLElement>('[data-pill-link]')
  const el = items?.[index]
  if (!el) return
  indicator.value = { left: el.offsetLeft, width: el.offsetWidth }
}

let observer: ResizeObserver | undefined

onMounted(() => {
  measure()
  if ('ResizeObserver' in window && navEl.value) {
    observer = new ResizeObserver(() => measure())
    observer.observe(navEl.value)
  }
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div data-slot="header-floating-pill" class="pointer-events-none sticky top-0 z-40 px-4 pt-4">
    <header
      class="border-border bg-card/85 pointer-events-auto mx-auto flex h-14 max-w-4xl items-center gap-3 rounded-full border px-3 shadow-sm backdrop-blur"
    >
      <a href="#top" class="flex shrink-0 items-center gap-2 pl-2 font-semibold tracking-tight">
        <Sparkles class="text-primary size-4" aria-hidden="true" />
        Verity
      </a>

      <nav ref="navEl" class="relative hidden items-center md:flex" aria-label="Primary">
        <span
          class="bg-muted absolute inset-y-1 rounded-full transition-all duration-200 ease-out"
          :style="{ left: `${indicator.left}px`, width: `${indicator.width}px` }"
          aria-hidden="true"
        />
        <a
          v-for="(link, index) in links"
          :key="link.href"
          :href="link.href"
          data-pill-link
          class="focus-visible:ring-ring relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          :class="index === active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
          :aria-current="index === active ? 'page' : undefined"
          @mouseenter="measure(index)"
          @mouseleave="measure()"
          @focus="measure(index)"
          @blur="measure()"
          @click="active = index"
        >
          {{ link.label }}
        </a>
      </nav>

      <Button size="sm" class="ml-auto rounded-full">Start free</Button>

      <Sheet v-model:open="open">
        <SheetTrigger as-child>
          <Button variant="ghost" size="icon" class="rounded-full md:hidden" aria-label="Open navigation menu">
            <Menu class="size-5" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent side="top">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav class="mt-6 grid gap-1" aria-label="Mobile">
            <a
              v-for="link in links"
              :key="link.href"
              :href="link.href"
              class="hover:bg-muted rounded-md px-3 py-2 text-sm font-medium transition-colors"
              @click="open = false"
            >
              {{ link.label }}
            </a>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  </div>
</template>
