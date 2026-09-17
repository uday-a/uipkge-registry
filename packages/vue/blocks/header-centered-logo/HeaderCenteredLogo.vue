<script setup lang="ts">
import { ref } from 'vue'
import { Menu, ShoppingBag, Sparkles, User } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const leftLinks = [
  { label: 'Collections', href: '#collections' },
  { label: 'New in', href: '#new' },
  { label: 'Studio', href: '#studio' },
]
const rightLinks = [
  { label: 'Journal', href: '#journal' },
  { label: 'Stockists', href: '#stockists' },
  { label: 'Contact', href: '#contact' },
]

const open = ref(false)
const linkClass =
  'text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none'
</script>

<template>
  <header data-slot="header-centered-logo" class="border-border bg-background border-b">
    <div class="mx-auto flex h-16 max-w-6xl items-center px-6">
      <!-- Equal-basis flanks keep the wordmark optically centred regardless of
           how long the link labels are. -->
      <nav class="hidden flex-1 basis-0 items-center gap-1 lg:flex" aria-label="Primary left">
        <a v-for="link in leftLinks" :key="link.href" :href="link.href" :class="linkClass">{{ link.label }}</a>
      </nav>

      <Sheet v-model:open="open">
        <SheetTrigger as-child>
          <Button variant="ghost" size="icon" class="lg:hidden" aria-label="Open navigation menu">
            <Menu class="size-5" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" class="w-72">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav class="mt-6 grid gap-1" aria-label="Mobile">
            <a
              v-for="link in [...leftLinks, ...rightLinks]"
              :key="link.href"
              :href="link.href"
              class="hover:bg-muted rounded-md px-3 py-2 text-sm font-medium transition-colors"
              @click="open = false"
            >
              {{ link.label }}
            </a>
          </nav>
          <Separator class="my-5" />
          <Button class="w-full">Account</Button>
        </SheetContent>
      </Sheet>

      <a
        href="#top"
        class="mx-auto flex items-center gap-2 text-base font-semibold tracking-[0.18em] uppercase lg:mx-6"
      >
        <Sparkles class="text-primary size-4" aria-hidden="true" />
        Halden
      </a>

      <nav class="hidden flex-1 basis-0 items-center justify-end gap-1 lg:flex" aria-label="Primary right">
        <a v-for="link in rightLinks" :key="link.href" :href="link.href" :class="linkClass">{{ link.label }}</a>
      </nav>

      <div class="flex items-center gap-1 lg:ml-4">
        <Button variant="ghost" size="icon" aria-label="Account">
          <User class="size-4" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Bag">
          <ShoppingBag class="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  </header>
</template>
