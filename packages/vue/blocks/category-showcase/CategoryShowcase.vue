<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ArrowRight, Percent, Sparkles } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'bento' | 'grid'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'bento',
})
</script>

<template>
  <section data-slot="category-showcase" :class="cn('bg-background w-full py-12 sm:py-16 lg:py-20', props.class)">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end lg:mb-12">
        <div class="space-y-3">
          <Badge wrap variant="outline" class="gap-1.5 px-3 py-1 text-xs font-medium">
            <Sparkles class="text-primary size-3.5" />
            Explore Collections
          </Badge>
          <h2 class="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">Shop by Category</h2>
          <p class="text-muted-foreground max-w-2xl text-sm sm:text-base">
            Curated essentials designed for everyday performance.
          </p>
        </div>
        <a
          href="#"
          class="group/link text-primary hover:text-primary/80 inline-flex min-h-6 items-center gap-1.5 text-sm font-medium transition-colors"
        >
          View all collections
          <ArrowRight class="size-4 transition-transform duration-200 group-hover/link:translate-x-1" />
        </a>
      </div>

      <!-- Bento / Grid Showcase -->
      <div
        :class="
          cn(
            'grid grid-cols-1 gap-4 sm:grid-cols-2',
            props.variant === 'bento' ? 'lg:grid-cols-4 lg:grid-rows-2' : 'lg:grid-cols-4',
          )
        "
      >
        <!-- Tile 1: Featured Hero Tile (2x2 in bento) -->
        <Card
          :class="
            cn(
              'group border-border bg-card relative flex flex-col justify-between overflow-hidden shadow-xs transition-all duration-300 hover:shadow-md',
              props.variant === 'bento'
                ? 'min-h-[460px] sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:min-h-[560px]'
                : 'min-h-[320px] sm:col-span-2 lg:col-span-2',
            )
          "
        >
          <img
            src="https://images.unsplash.com/photo-1544441893-675973e31985?w=1200&auto=format&fit=crop&q=80"
            alt="Performance Outerwear collection"
            class="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15" />

          <CardContent class="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <Badge
                wrap
                variant="secondary"
                class="bg-background/80 text-foreground border-white/15 text-xs font-medium shadow-xs backdrop-blur-md"
              >
                Featured Collection
              </Badge>
              <Badge
                wrap
                variant="outline"
                class="border-white/20 bg-white/10 text-xs font-medium text-white backdrop-blur-xs"
              >
                Explore 32 Styles
              </Badge>
            </div>

            <div class="space-y-4">
              <div class="space-y-2">
                <h3 class="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  Performance Outerwear
                </h3>
                <p class="line-clamp-2 max-w-md text-sm text-zinc-200">
                  Engineered weatherproof shells, insulated parkas, and technical layers designed for extreme climates.
                </p>
              </div>

              <Button
                size="sm"
                class="group/btn w-fit bg-white font-medium text-zinc-900 shadow-sm hover:bg-white/90 focus-visible:ring-white"
              >
                Shop Collection
                <ArrowRight class="ml-1.5 size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Tile 2: Footwear & Running -->
        <Card
          :class="
            cn(
              'group border-border bg-card relative flex flex-col justify-between overflow-hidden shadow-xs transition-all duration-300 hover:shadow-md',
              'col-span-1 min-h-[260px]',
            )
          "
        >
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
            alt="Footwear and running sneakers"
            class="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

          <CardContent class="relative z-10 flex h-full flex-col justify-between p-6">
            <div class="flex items-center justify-between">
              <Badge
                wrap
                variant="secondary"
                class="bg-background/80 text-foreground border-white/15 text-xs font-medium shadow-xs backdrop-blur-md"
              >
                18 Items
              </Badge>
            </div>

            <div class="space-y-1">
              <h3 class="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-white/90">
                Footwear & Running
              </h3>
              <span class="inline-flex items-center gap-1 text-xs font-medium text-zinc-300">
                View products
                <ArrowRight class="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </div>
          </CardContent>
        </Card>

        <!-- Tile 3: Accessories & Bags -->
        <Card
          :class="
            cn(
              'group border-border bg-card relative flex flex-col justify-between overflow-hidden shadow-xs transition-all duration-300 hover:shadow-md',
              'col-span-1 min-h-[260px]',
            )
          "
        >
          <img
            src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
            alt="Accessories and bags collection"
            class="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

          <CardContent class="relative z-10 flex h-full flex-col justify-between p-6">
            <div class="flex items-center gap-2">
              <Badge wrap class="bg-primary text-primary-foreground border-transparent text-xs font-medium shadow-xs">
                New Season
              </Badge>
              <Badge
                wrap
                variant="secondary"
                class="bg-background/80 text-foreground border-white/15 text-xs font-medium shadow-xs backdrop-blur-md"
              >
                24 Items
              </Badge>
            </div>

            <div class="space-y-1">
              <h3 class="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-white/90">
                Accessories & Bags
              </h3>
              <span class="inline-flex items-center gap-1 text-xs font-medium text-zinc-300">
                View products
                <ArrowRight class="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </div>
          </CardContent>
        </Card>

        <!-- Tile 4: Everyday Apparel -->
        <Card
          :class="
            cn(
              'group border-border bg-card relative flex flex-col justify-between overflow-hidden shadow-xs transition-all duration-300 hover:shadow-md',
              props.variant === 'bento'
                ? 'col-span-1 min-h-[260px]'
                : 'col-span-1 min-h-[260px] sm:col-span-2 lg:col-span-2',
            )
          "
        >
          <img
            src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
            alt="Everyday apparel collection"
            class="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

          <CardContent class="relative z-10 flex h-full flex-col justify-between p-6">
            <div class="flex items-center justify-between">
              <Badge
                wrap
                variant="secondary"
                class="bg-background/80 text-foreground border-white/15 text-xs font-medium shadow-xs backdrop-blur-md"
              >
                45 Items
              </Badge>
            </div>

            <div class="space-y-1">
              <h3 class="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-white/90">
                Everyday Apparel
              </h3>
              <span class="inline-flex items-center gap-1 text-xs font-medium text-zinc-300">
                View products
                <ArrowRight class="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </div>
          </CardContent>
        </Card>

        <!-- Tile 5: Sale Special Promo Tile -->
        <Card
          :class="
            cn(
              'group border-primary/20 bg-primary/5 hover:border-primary/40 dark:bg-primary/10 relative flex flex-col justify-between overflow-hidden shadow-xs transition-all duration-300 hover:shadow-md',
              props.variant === 'bento'
                ? 'col-span-1 min-h-[260px]'
                : 'col-span-1 min-h-[260px] sm:col-span-2 lg:col-span-2',
            )
          "
        >
          <div
            class="bg-primary/15 group-hover:bg-primary/25 pointer-events-none absolute -right-8 -bottom-8 size-36 rounded-full blur-2xl transition-colors duration-500"
          />

          <CardContent class="relative z-10 flex h-full flex-col justify-between p-6">
            <div class="flex items-center justify-between gap-2">
              <div class="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
                <Percent class="size-4" />
              </div>
              <Badge
                wrap
                variant="outline"
                class="border-primary/30 bg-primary/10 text-primary font-mono text-xs uppercase"
              >
                ARCHIVE40
              </Badge>
            </div>

            <div class="space-y-3">
              <div class="space-y-1">
                <p class="text-primary text-xs font-medium tracking-wider uppercase">Limited Time Promo</p>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Archive Sale · Up to 40% Off</h3>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Seasonal essentials and core archive styles at exclusive discounted rates.
                </p>
              </div>

              <Button size="sm" class="group/btn w-full">
                Shop Sale
                <ArrowRight class="ml-1.5 size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>
