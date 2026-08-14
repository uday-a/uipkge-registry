<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ref } from 'vue'
import { ArrowUpRight, BadgeCheck, BookOpen, Check, Globe, MapPin, Rss, UserPlus } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface Props {
  /** 'default' is the standard editorial signature card; 'split' arranges profile and articles side-by-side; 'compact' tightens padding. */
  variant?: 'default' | 'split' | 'compact'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const isFollowing = ref(false)
const isSubscribedRss = ref(false)

function toggleFollow() {
  isFollowing.value = !isFollowing.value
}

function toggleRss() {
  isSubscribedRss.value = !isSubscribedRss.value
}
</script>

<template>
  <Card
    data-slot="author-bio-box"
    :class="cn('border-border bg-card text-card-foreground relative overflow-hidden shadow-xs', props.class)"
  >
    <!-- Subtle gradient background highlight -->
    <div
      class="from-primary/10 via-primary/5 pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-br to-transparent"
      aria-hidden="true"
    />

    <!-- Split variant: two columns on large screens -->
    <CardContent v-if="props.variant === 'split'" class="relative p-6 sm:p-8">
      <div class="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div class="space-y-5 lg:col-span-7">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <div class="relative size-16 shrink-0 sm:size-20">
              <Avatar size="2xl" class="ring-background size-16 shadow-xs ring-2 sm:size-20">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
                  alt="Elena Rostova"
                />
                <AvatarFallback class="text-lg font-semibold sm:text-xl">ER</AvatarFallback>
              </Avatar>
              <div
                class="bg-primary text-primary-foreground ring-background absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full shadow-xs ring-2 sm:size-6"
                title="Verified Author"
              >
                <BadgeCheck class="size-3.5 sm:size-4" />
              </div>
            </div>
            <div class="min-w-0 space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Elena Rostova</h3>
                <Badge variant="secondary" class="gap-1 text-xs font-medium">
                  <BadgeCheck class="text-primary size-3.5" /> Verified
                </Badge>
              </div>
              <p class="text-muted-foreground text-sm font-medium">Principal Design Engineer &amp; Core Contributor</p>
              <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
                <MapPin class="size-3.5 shrink-0" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Specializing in design token mathematics, headless accessibility primitives, and high-performance
            dual-framework monorepos. Former Staff Engineer at Vercel.
          </p>

          <div class="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div class="flex flex-wrap items-center gap-2.5">
              <Button
                :variant="isFollowing ? 'secondary' : 'default'"
                size="sm"
                class="gap-2 transition-all"
                @click="toggleFollow"
              >
                <Check v-if="isFollowing" class="size-4 text-emerald-500" />
                <UserPlus v-else class="size-4" />
                <span>{{ isFollowing ? 'Following' : 'Follow Author' }}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                :class="
                  cn(
                    'gap-2 transition-all',
                    isSubscribedRss && 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
                  )
                "
                @click="toggleRss"
              >
                <Rss class="size-4 text-amber-600 dark:text-amber-400" />
                <span>{{ isSubscribedRss ? 'Subscribed via RSS' : 'RSS Feed' }}</span>
              </Button>
            </div>

            <div class="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" as-child>
                <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="Elena Rostova on X (Twitter)">
                  <svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true">
                    <path
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    />
                  </svg>
                </a>
              </Button>
              <Button variant="ghost" size="icon-sm" as-child>
                <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="Elena Rostova on GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true">
                    <path
                      d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.69-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.02 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.66.41.35.78 1.05.78 2.12v3.14c0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
                    />
                  </svg>
                </a>
              </Button>
              <Button variant="ghost" size="icon-sm" as-child>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="Elena Rostova on LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true">
                    <path
                      d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z"
                    />
                  </svg>
                </a>
              </Button>
              <Button variant="ghost" size="icon-sm" as-child>
                <a
                  href="https://elenarostova.dev"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Elena Rostova's Website"
                >
                  <Globe class="size-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon-sm" as-child>
                <a href="https://substack.com" target="_blank" rel="noreferrer" aria-label="Elena Rostova on Substack">
                  <svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true">
                    <path
                      d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"
                    />
                  </svg>
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div class="space-y-4 lg:col-span-5">
          <div class="flex items-center justify-between">
            <div class="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
              <BookOpen class="text-primary size-4" />
              <span>Recent Articles</span>
            </div>
            <span class="text-muted-foreground text-xs">3 published</span>
          </div>

          <div class="grid gap-3">
            <a
              href="#article-1"
              class="group border-border/60 bg-muted/20 hover:border-border hover:bg-muted/60 focus-visible:ring-ring flex items-center justify-between gap-3 rounded-lg border p-3.5 transition-all hover:shadow-xs focus-visible:ring-2 focus-visible:outline-none"
            >
              <div class="min-w-0 space-y-1">
                <span class="text-muted-foreground text-xs">5 min read · Aug 18</span>
                <h4 class="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                  Why Zero-Dependency Registries Are Winning
                </h4>
              </div>
              <div
                class="border-border/60 bg-background text-muted-foreground group-hover:border-border group-hover:text-foreground flex size-7 shrink-0 items-center justify-center rounded-md border transition-all"
              >
                <ArrowUpRight
                  class="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </a>

            <a
              href="#article-2"
              class="group border-border/60 bg-muted/20 hover:border-border hover:bg-muted/60 focus-visible:ring-ring flex items-center justify-between gap-3 rounded-lg border p-3.5 transition-all hover:shadow-xs focus-visible:ring-2 focus-visible:outline-none"
            >
              <div class="min-w-0 space-y-1">
                <span class="text-muted-foreground text-xs">8 min read · Aug 10</span>
                <h4 class="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                  Deconstructing OKLCH Color Palettes in Tailwind v4
                </h4>
              </div>
              <div
                class="border-border/60 bg-background text-muted-foreground group-hover:border-border group-hover:text-foreground flex size-7 shrink-0 items-center justify-center rounded-md border transition-all"
              >
                <ArrowUpRight
                  class="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </a>

            <a
              href="#article-3"
              class="group border-border/60 bg-muted/20 hover:border-border hover:bg-muted/60 focus-visible:ring-ring flex items-center justify-between gap-3 rounded-lg border p-3.5 transition-all hover:shadow-xs focus-visible:ring-2 focus-visible:outline-none"
            >
              <div class="min-w-0 space-y-1">
                <span class="text-muted-foreground text-xs">12 min read · Jul 28</span>
                <h4 class="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                  Polymorphic Reka UI Primitives Architecture
                </h4>
              </div>
              <div
                class="border-border/60 bg-background text-muted-foreground group-hover:border-border group-hover:text-foreground flex size-7 shrink-0 items-center justify-center rounded-md border transition-all"
              >
                <ArrowUpRight
                  class="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
    </CardContent>

    <!-- Compact variant -->
    <CardContent v-else-if="props.variant === 'compact'" class="relative space-y-5 p-5">
      <div class="flex items-center gap-3.5">
        <div class="relative size-12 shrink-0">
          <Avatar size="lg" class="ring-background size-12 ring-2">
            <AvatarImage
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
              alt="Elena Rostova"
            />
            <AvatarFallback class="text-sm font-semibold">ER</AvatarFallback>
          </Avatar>
          <div
            class="bg-primary text-primary-foreground ring-background absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full ring-1"
          >
            <BadgeCheck class="size-3" />
          </div>
        </div>
        <div class="min-w-0 space-y-0.5">
          <div class="flex items-center gap-1.5">
            <h3 class="text-foreground truncate text-base font-bold tracking-tight">Elena Rostova</h3>
            <Badge variant="secondary" class="h-4 px-1.5 text-xs font-medium">Verified</Badge>
          </div>
          <p class="text-muted-foreground truncate text-xs">Principal Design Engineer</p>
        </div>
      </div>

      <p class="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
        Specializing in design token mathematics, headless accessibility primitives, and high-performance dual-framework
        monorepos. Former Staff Engineer at Vercel.
      </p>

      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <Button
            :variant="isFollowing ? 'secondary' : 'default'"
            size="sm"
            class="h-7 gap-1.5 px-2.5 text-xs"
            @click="toggleFollow"
          >
            <Check v-if="isFollowing" class="size-3 text-emerald-500" />
            <UserPlus v-else class="size-3" />
            <span>{{ isFollowing ? 'Following' : 'Follow' }}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            :class="
              cn(
                'h-7 gap-1.5 px-2.5 text-xs',
                isSubscribedRss && 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
              )
            "
            @click="toggleRss"
          >
            <Rss class="size-3 text-amber-600 dark:text-amber-400" />
            <span>{{ isSubscribedRss ? 'Subscribed' : 'RSS' }}</span>
          </Button>
        </div>
        <div class="flex items-center gap-0.5">
          <Button variant="ghost" size="icon-sm" class="size-7" as-child>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="Elena Rostova on X (Twitter)">
              <svg viewBox="0 0 24 24" fill="currentColor" class="size-3.5" aria-hidden="true">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
            </a>
          </Button>
          <Button variant="ghost" size="icon-sm" class="size-7" as-child>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="Elena Rostova on GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" class="size-3.5" aria-hidden="true">
                <path
                  d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.69-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.02 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.66.41.35.78 1.05.78 2.12v3.14c0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
                />
              </svg>
            </a>
          </Button>
          <Button variant="ghost" size="icon-sm" class="size-7" as-child>
            <a href="https://elenarostova.dev" target="_blank" rel="noreferrer" aria-label="Elena Rostova's Website">
              <Globe class="size-3.5" />
            </a>
          </Button>
        </div>
      </div>

      <Separator />

      <div class="space-y-2.5">
        <div class="text-muted-foreground flex items-center justify-between text-xs font-medium">
          <span class="tracking-wider uppercase">Latest Article</span>
          <span>Aug 18</span>
        </div>
        <a
          href="#article-1"
          class="group border-border/60 bg-muted/20 hover:bg-muted/60 focus-visible:ring-ring flex items-center justify-between gap-2 rounded-md border p-2.5 transition-all focus-visible:ring-2 focus-visible:outline-none"
        >
          <span class="text-foreground group-hover:text-primary truncate text-xs font-semibold transition-colors">
            Why Zero-Dependency Registries Are Winning
          </span>
          <ArrowUpRight
            class="text-muted-foreground group-hover:text-foreground size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </CardContent>

    <!-- Default editorial layout -->
    <CardContent v-else class="relative space-y-6 p-6 sm:p-8">
      <!-- Top Author Profile -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
        <div class="relative size-16 shrink-0 sm:size-20">
          <Avatar size="2xl" class="ring-background size-16 shadow-xs ring-2 sm:size-20">
            <AvatarImage
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
              alt="Elena Rostova"
            />
            <AvatarFallback class="text-lg font-semibold sm:text-xl">ER</AvatarFallback>
          </Avatar>
          <div
            class="bg-primary text-primary-foreground ring-background absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full shadow-xs ring-2 sm:size-6"
            title="Verified Author"
          >
            <BadgeCheck class="size-3.5 sm:size-4" />
          </div>
        </div>
        <div class="min-w-0 space-y-1.5">
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Elena Rostova</h3>
            <Badge variant="secondary" class="gap-1 text-xs font-medium">
              <BadgeCheck class="text-primary size-3.5" /> Verified Author
            </Badge>
          </div>
          <p class="text-muted-foreground text-sm font-medium">Principal Design Engineer &amp; Core Contributor</p>
          <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
            <MapPin class="size-3.5 shrink-0" />
            <span>San Francisco, CA</span>
          </div>
        </div>
      </div>

      <!-- Author Bio Paragraph -->
      <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
        Specializing in design token mathematics, headless accessibility primitives, and high-performance dual-framework
        monorepos. Former Staff Engineer at Vercel.
      </p>

      <!-- Actions & Social Links Row -->
      <div class="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div class="flex flex-wrap items-center gap-2.5">
          <Button
            :variant="isFollowing ? 'secondary' : 'default'"
            size="sm"
            class="gap-2 transition-all"
            @click="toggleFollow"
          >
            <Check v-if="isFollowing" class="size-4 text-emerald-500" />
            <UserPlus v-else class="size-4" />
            <span>{{ isFollowing ? 'Following' : 'Follow Author' }}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            :class="
              cn(
                'gap-2 transition-all',
                isSubscribedRss && 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
              )
            "
            @click="toggleRss"
          >
            <Rss class="size-4 text-amber-600 dark:text-amber-400" />
            <span>{{ isSubscribedRss ? 'Subscribed via RSS' : 'RSS Feed' }}</span>
          </Button>
        </div>

        <div class="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" as-child>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="Elena Rostova on X (Twitter)">
              <svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
            </a>
          </Button>
          <Button variant="ghost" size="icon-sm" as-child>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="Elena Rostova on GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true">
                <path
                  d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.69-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.02 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.66.41.35.78 1.05.78 2.12v3.14c0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
                />
              </svg>
            </a>
          </Button>
          <Button variant="ghost" size="icon-sm" as-child>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="Elena Rostova on LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true">
                <path
                  d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z"
                />
              </svg>
            </a>
          </Button>
          <Button variant="ghost" size="icon-sm" as-child>
            <a href="https://elenarostova.dev" target="_blank" rel="noreferrer" aria-label="Elena Rostova's Website">
              <Globe class="size-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon-sm" as-child>
            <a href="https://substack.com" target="_blank" rel="noreferrer" aria-label="Elena Rostova on Substack">
              <svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true">
                <path
                  d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"
                />
              </svg>
            </a>
          </Button>
        </div>
      </div>

      <!-- Separator -->
      <Separator />

      <!-- Recent Articles by Author List (3 items) -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
            <BookOpen class="text-primary size-4" />
            <span>Recent Articles by Author</span>
          </div>
          <span class="text-muted-foreground text-xs">3 published</span>
        </div>

        <div class="grid gap-3 sm:grid-cols-1">
          <!-- Article 1 -->
          <a
            href="#article-1"
            class="group border-border/60 bg-muted/20 hover:border-border hover:bg-muted/60 focus-visible:ring-ring flex items-center justify-between gap-4 rounded-lg border p-4 transition-all hover:shadow-xs focus-visible:ring-2 focus-visible:outline-none"
          >
            <div class="min-w-0 space-y-1">
              <div class="text-muted-foreground flex items-center gap-2 text-xs">
                <Badge variant="outline" class="text-xs font-normal">Registry</Badge>
                <span>5 min read · Aug 18</span>
              </div>
              <h4 class="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                Why Zero-Dependency Registries Are Winning
              </h4>
            </div>
            <div
              class="border-border/60 bg-background text-muted-foreground group-hover:border-border group-hover:text-foreground flex size-8 shrink-0 items-center justify-center rounded-md border transition-all"
            >
              <ArrowUpRight
                class="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
          </a>

          <!-- Article 2 -->
          <a
            href="#article-2"
            class="group border-border/60 bg-muted/20 hover:border-border hover:bg-muted/60 focus-visible:ring-ring flex items-center justify-between gap-4 rounded-lg border p-4 transition-all hover:shadow-xs focus-visible:ring-2 focus-visible:outline-none"
          >
            <div class="min-w-0 space-y-1">
              <div class="text-muted-foreground flex items-center gap-2 text-xs">
                <Badge variant="outline" class="text-xs font-normal">Design Tokens</Badge>
                <span>8 min read · Aug 10</span>
              </div>
              <h4 class="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                Deconstructing OKLCH Color Palettes in Tailwind v4
              </h4>
            </div>
            <div
              class="border-border/60 bg-background text-muted-foreground group-hover:border-border group-hover:text-foreground flex size-8 shrink-0 items-center justify-center rounded-md border transition-all"
            >
              <ArrowUpRight
                class="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
          </a>

          <!-- Article 3 -->
          <a
            href="#article-3"
            class="group border-border/60 bg-muted/20 hover:border-border hover:bg-muted/60 focus-visible:ring-ring flex items-center justify-between gap-4 rounded-lg border p-4 transition-all hover:shadow-xs focus-visible:ring-2 focus-visible:outline-none"
          >
            <div class="min-w-0 space-y-1">
              <div class="text-muted-foreground flex items-center gap-2 text-xs">
                <Badge variant="outline" class="text-xs font-normal">Architecture</Badge>
                <span>12 min read · Jul 28</span>
              </div>
              <h4 class="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                Polymorphic Reka UI Primitives Architecture
              </h4>
            </div>
            <div
              class="border-border/60 bg-background text-muted-foreground group-hover:border-border group-hover:text-foreground flex size-8 shrink-0 items-center justify-center rounded-md border transition-all"
            >
              <ArrowUpRight
                class="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
          </a>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
