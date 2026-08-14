<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, BarChart3, BookOpen, Boxes, LifeBuoy, Lock, Menu, Sparkles, Workflow } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

const menus = [
  {
    label: 'Product',
    groups: [
      {
        heading: 'Core',
        items: [
          { icon: Boxes, title: 'Metric layer', body: 'Versioned definitions your whole org shares.' },
          { icon: BarChart3, title: 'Dashboards', body: 'Composed from certified metrics, not raw SQL.' },
          { icon: Workflow, title: 'Pipelines', body: 'Scheduled materialisation with cost ceilings.' },
        ],
      },
      {
        heading: 'Governance',
        items: [
          { icon: Lock, title: 'Row-level access', body: 'Scope evaluated per query, per identity.' },
          { icon: BookOpen, title: 'Change history', body: 'Every definition edit reviewed and revertible.' },
          { icon: LifeBuoy, title: 'Audit exports', body: 'Generated from the same history, not by hand.' },
        ],
      },
    ],
    highlight: {
      title: 'Ship your first dashboard today',
      body: 'Connect a warehouse, publish one certified metric, and invite the team. No migration required.',
      cta: 'Start the walkthrough',
    },
  },
  {
    label: 'Resources',
    groups: [
      {
        heading: 'Learn',
        items: [
          { icon: BookOpen, title: 'Documentation', body: 'Setup, modelling, and the access model.' },
          { icon: Sparkles, title: 'Guides', body: 'Reconciliation and first-close checklists.' },
          { icon: BarChart3, title: 'Benchmarks', body: 'Close speed across 240 finance teams.' },
        ],
      },
      {
        heading: 'Support',
        items: [
          { icon: LifeBuoy, title: 'Help centre', body: 'Answers to the questions support gets most.' },
          { icon: Workflow, title: 'Status', body: 'Live uptime and incident history.' },
          { icon: Lock, title: 'Trust centre', body: 'SOC 2, subprocessors, and data residency.' },
        ],
      },
    ],
    highlight: {
      title: 'Read the rollout plan',
      body: 'The five-week implementation we run for every customer, written down so you can run it yourself.',
      cta: 'Open the plan',
    },
  },
]

const plainLinks = [
  { label: 'Pricing', href: '#pricing' },
  { label: 'Customers', href: '#customers' },
]

const open = ref(false)
</script>

<template>
  <header data-slot="header-mega-menu" class="border-border bg-background/90 border-b backdrop-blur">
    <div class="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
      <a href="#top" class="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
        <Sparkles class="text-primary size-5" aria-hidden="true" />
        Northwind
      </a>

      <NavigationMenu class="hidden lg:flex">
        <NavigationMenuList>
          <NavigationMenuItem v-for="menu in menus" :key="menu.label">
            <NavigationMenuTrigger>{{ menu.label }}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div class="grid w-[46rem] grid-cols-[1fr_1fr_16rem] gap-6 p-6">
                <div v-for="group in menu.groups" :key="group.heading">
                  <p class="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">
                    {{ group.heading }}
                  </p>
                  <ul class="mt-3 space-y-1">
                    <li v-for="item in group.items" :key="item.title">
                      <a
                        href="#"
                        class="hover:bg-muted focus-visible:ring-ring flex gap-3 rounded-md p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                      >
                        <component
                          :is="item.icon"
                          class="text-muted-foreground mt-0.5 size-4 shrink-0"
                          aria-hidden="true"
                        />
                        <span class="min-w-0">
                          <span class="block text-sm font-medium">{{ item.title }}</span>
                          <span class="text-muted-foreground block text-xs leading-snug">{{ item.body }}</span>
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>

                <!-- Highlight rail: one promoted destination per panel, on the
                     muted surface so it reads as an aside, not a sixth link. -->
                <div class="bg-muted/50 flex flex-col rounded-lg p-4">
                  <p class="text-sm font-semibold">{{ menu.highlight.title }}</p>
                  <p class="text-muted-foreground mt-2 text-xs leading-relaxed">{{ menu.highlight.body }}</p>
                  <Button variant="link" class="mt-auto h-auto justify-start p-0 pt-4 text-xs">
                    {{ menu.highlight.cta }}
                    <ArrowRight class="ml-1 size-3" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem v-for="link in plainLinks" :key="link.href">
            <a :href="link.href" :class="navigationMenuTriggerStyle()">{{ link.label }}</a>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div class="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="sm" class="hidden sm:inline-flex">Sign in</Button>
        <Separator orientation="vertical" class="hidden h-5 sm:block" />
        <Button size="sm">Book a demo</Button>
      </div>

      <Sheet v-model:open="open">
        <SheetTrigger as-child>
          <Button variant="ghost" size="icon" class="ml-auto lg:hidden" aria-label="Open navigation menu">
            <Menu class="size-5" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" class="w-72 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav class="mt-6 grid gap-5" aria-label="Mobile">
            <div v-for="menu in menus" :key="menu.label">
              <p class="text-muted-foreground/70 text-xs font-medium tracking-wide uppercase">{{ menu.label }}</p>
              <ul class="mt-2 grid gap-1">
                <li v-for="group in menu.groups" :key="group.heading">
                  <a
                    v-for="item in group.items"
                    :key="item.title"
                    href="#"
                    class="hover:bg-muted block rounded-md px-3 py-2 text-sm font-medium transition-colors"
                    @click="open = false"
                  >
                    {{ item.title }}
                  </a>
                </li>
              </ul>
            </div>
            <Separator />
            <a
              v-for="link in plainLinks"
              :key="link.href"
              :href="link.href"
              class="hover:bg-muted rounded-md px-3 py-2 text-sm font-medium transition-colors"
              @click="open = false"
            >
              {{ link.label }}
            </a>
            <Separator />
            <div class="grid gap-2">
              <Button variant="outline">Sign in</Button>
              <Button>Book a demo</Button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  </header>
</template>
