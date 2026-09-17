<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowRight, Menu, Sparkles, X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const STORAGE_KEY = 'uipkge:announcement-dismissed'

const links = [
  { label: 'Platform', href: '#platform' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Customers', href: '#customers' },
  { label: 'Docs', href: '#docs' },
]

// Rendered on the server and dismissed only on the client, so there is no flash
// of a strip that then vanishes.
const dismissed = ref(false)
const open = ref(false)

function dismiss() {
  dismissed.value = true
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // Blocked storage: the dismissal still holds for this page view.
  }
}

onMounted(() => {
  try {
    dismissed.value = window.sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    dismissed.value = false
  }
})
</script>

<template>
  <div data-slot="header-announcement-stack" class="sticky top-0 z-40">
    <div v-if="!dismissed" class="border-border bg-muted/60 border-b backdrop-blur">
      <div class="mx-auto flex h-10 max-w-6xl items-center gap-3 px-6 text-sm">
        <Badge variant="secondary" class="shrink-0">New</Badge>
        <p class="min-w-0 truncate">
          Row-level scoping now evaluates against SCIM groups.
          <a href="#changelog" class="hover:text-foreground underline underline-offset-4">Read the changelog</a>
        </p>
        <ArrowRight class="text-muted-foreground hidden size-3.5 shrink-0 sm:block" aria-hidden="true" />
        <Button
          variant="ghost"
          size="icon"
          class="ml-auto size-7 shrink-0"
          aria-label="Dismiss announcement"
          @click="dismiss"
        >
          <X class="size-3.5" aria-hidden="true" />
        </Button>
      </div>
    </div>

    <header class="border-border bg-background/90 border-b backdrop-blur">
      <div class="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <a href="#top" class="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
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
          <Button size="sm">Book a demo</Button>
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
              <Button>Book a demo</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  </div>
</template>
