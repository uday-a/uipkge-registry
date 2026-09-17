<script setup lang="ts">
import { ref } from 'vue'
import { Boxes, Menu, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const mobileOpen = ref(false)
</script>

<template>
  <header
    data-slot="header-01"
    class="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b backdrop-blur"
  >
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <a href="#" class="flex items-center gap-2">
        <div class="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
          <Boxes class="size-4" />
        </div>
        <span class="text-base font-semibold">Acme</span>
      </a>

      <nav class="hidden items-center gap-6 md:flex" aria-label="Primary">
        <a href="#features" class="text-muted-foreground hover:text-foreground text-sm transition-colors">Features</a>
        <a href="#pricing" class="text-muted-foreground hover:text-foreground text-sm transition-colors">Pricing</a>
        <a href="#customers" class="text-muted-foreground hover:text-foreground text-sm transition-colors">Customers</a>
        <a href="#docs" class="text-muted-foreground hover:text-foreground text-sm transition-colors">Docs</a>
        <a href="#blog" class="text-muted-foreground hover:text-foreground text-sm transition-colors">Blog</a>
      </nav>

      <div class="hidden items-center gap-2 md:flex">
        <Button variant="ghost" size="sm">Sign in</Button>
        <Button size="sm">Start free trial</Button>
      </div>

      <Sheet v-model:open="mobileOpen">
        <SheetTrigger as-child>
          <Button variant="ghost" size="icon" class="md:hidden" aria-label="Open menu">
            <Menu class="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" class="w-72">
          <div class="flex h-full flex-col">
            <div class="flex items-center justify-between border-b px-4 py-3">
              <div class="flex items-center gap-2">
                <div class="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
                  <Boxes class="size-3.5" />
                </div>
                <span class="text-sm font-semibold">Acme</span>
              </div>
              <Button variant="ghost" size="icon" class="size-8" aria-label="Close menu" @click="mobileOpen = false">
                <X class="size-4" />
              </Button>
            </div>
            <nav class="flex flex-1 flex-col gap-1 p-4" aria-label="Mobile">
              <a
                href="#features"
                class="hover:bg-muted rounded-md px-3 py-2 text-sm transition-colors"
                @click="mobileOpen = false"
                >Features</a
              >
              <a
                href="#pricing"
                class="hover:bg-muted rounded-md px-3 py-2 text-sm transition-colors"
                @click="mobileOpen = false"
                >Pricing</a
              >
              <a
                href="#customers"
                class="hover:bg-muted rounded-md px-3 py-2 text-sm transition-colors"
                @click="mobileOpen = false"
                >Customers</a
              >
              <a
                href="#docs"
                class="hover:bg-muted rounded-md px-3 py-2 text-sm transition-colors"
                @click="mobileOpen = false"
                >Docs</a
              >
              <a
                href="#blog"
                class="hover:bg-muted rounded-md px-3 py-2 text-sm transition-colors"
                @click="mobileOpen = false"
                >Blog</a
              >
            </nav>
            <div class="flex flex-col gap-2 border-t p-4">
              <Button variant="outline" class="w-full">Sign in</Button>
              <Button class="w-full">Start free trial</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  </header>
</template>
