<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { BarChart3, BookOpen, FileText, Menu, Search, Sparkles, Users } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Kbd } from '@/components/ui/kbd'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const links = [
  { label: 'Product', href: '#product' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
]

const groups = [
  {
    heading: 'Documentation',
    items: [
      { icon: BookOpen, label: 'Connect a warehouse' },
      { icon: FileText, label: 'Define your first metric' },
      { icon: BarChart3, label: 'Publish a dashboard' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { icon: Users, label: 'Customer stories' },
      { icon: Sparkles, label: 'Changelog' },
    ],
  },
]

const open = ref(false)
const menuOpen = ref(false)

function onKeydown(event: KeyboardEvent) {
  if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return
  event.preventDefault()
  open.value = !open.value
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header data-slot="header-search-command" class="border-border bg-background/90 border-b backdrop-blur">
    <div class="mx-auto flex h-16 max-w-6xl items-center gap-4 px-6">
      <a href="#top" class="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
        <Sparkles class="text-primary size-5" aria-hidden="true" />
        Halden
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

      <!-- Trigger is a button, not an input: the real field lives in the dialog,
           so focus lands there and the shortcut hint stays visible until then. -->
      <button
        type="button"
        class="border-border bg-muted/40 text-muted-foreground hover:bg-muted focus-visible:ring-ring ml-auto flex h-9 w-full max-w-64 items-center gap-2 rounded-md border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
        @click="open = true"
      >
        <Search class="size-4 shrink-0" aria-hidden="true" />
        <span class="truncate">Search docs…</span>
        <Kbd class="ml-auto hidden sm:inline-flex">⌘K</Kbd>
      </button>

      <Separator orientation="vertical" class="hidden h-5 md:block" />
      <Button size="sm" class="hidden shrink-0 sm:inline-flex">Start free</Button>

      <Sheet v-model:open="menuOpen">
        <SheetTrigger as-child>
          <Button variant="ghost" size="icon" class="shrink-0 md:hidden" aria-label="Open navigation menu">
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
              @click="menuOpen = false"
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

    <CommandDialog v-model:open="open">
      <CommandInput placeholder="Search documentation, guides, and stories…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup v-for="group in groups" :key="group.heading" :heading="group.heading">
          <CommandItem v-for="item in group.items" :key="item.label" :value="item.label">
            <component :is="item.icon" class="text-muted-foreground mr-2 size-4" aria-hidden="true" />
            {{ item.label }}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  </header>
</template>
