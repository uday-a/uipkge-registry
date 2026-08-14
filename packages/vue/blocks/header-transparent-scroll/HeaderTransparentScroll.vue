<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Menu, Sparkles } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const links = [
  { label: 'Product', href: '#product' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
]

// Starts unscrolled so server and first client paint agree; the listener is the
// only thing that swaps in the solid surface.
const scrolled = ref(false)
const open = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    data-slot="header-transparent-scroll"
    class="fixed inset-x-0 top-0 z-40 transition-colors duration-200"
    :class="scrolled ? 'border-border bg-background/85 border-b backdrop-blur' : 'border-b border-transparent'"
  >
    <div class="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
      <a href="#top" class="flex items-center gap-2 font-semibold tracking-tight">
        <Sparkles class="text-primary size-5" aria-hidden="true" />
        Northwind
      </a>

      <nav class="hidden items-center gap-1 md:flex" aria-label="Primary">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
          class="text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:ring-ring rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          {{ link.label }}
        </a>
      </nav>

      <div class="ml-auto hidden items-center gap-2 md:flex">
        <Button variant="ghost" size="sm">Sign in</Button>
        <Button size="sm">Start free</Button>
      </div>

      <Sheet v-model:open="open">
        <SheetTrigger as-child>
          <Button variant="ghost" size="icon" class="ml-auto md:hidden" aria-label="Open navigation menu">
            <Menu class="size-5" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" class="w-72">
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
          <Separator class="my-5" />
          <div class="grid gap-2">
            <Button variant="outline">Sign in</Button>
            <Button>Start free</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  </header>
</template>
