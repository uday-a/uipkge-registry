<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { ArrowRight, BookOpen, Check, Clock, Loader2, Mail, Sparkles } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export interface Author {
  name: string
  role: string
  avatar: string
  initials: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: 'Architecture' | 'Design Systems' | 'Performance' | 'Tutorials'
  readTime: string
  date: string
  image: string
  author: Author
}

interface Props {
  showFeatured?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  showFeatured: true,
})

const categories = ['All', 'Architecture', 'Design Systems', 'Performance', 'Tutorials'] as const
type Category = (typeof categories)[number]

const activeCategory = ref<Category>('All')
const isLoadingMore = ref(false)
const showAllPosts = ref(false)
const emailInput = ref('')
const isSubscribed = ref(false)

const featuredPost: BlogPost = {
  id: 'featured-1',
  title: 'Deconstructing Event-Driven Micro-Frontends at Scale',
  excerpt:
    'How we transitioned a monolithic dashboard into decoupled, independently deployable island architectures using web components, resilient event buses, and broadcast channels.',
  category: 'Architecture',
  readTime: '8 min read',
  date: 'Aug 18, 2026',
  image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
  author: {
    name: 'Elena Rostova',
    role: 'Principal Systems Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    initials: 'ER',
  },
}

const initialPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Architecting Token Hierarchies in Tailwind CSS v4',
    excerpt:
      'A comprehensive guide to structured OKLCH color palettes, dynamic light and dark elevation layers, and type scale ergonomics.',
    category: 'Design Systems',
    readTime: '5 min read',
    date: 'Aug 16, 2026',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Marcus Chen',
      role: 'Design Technologist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      initials: 'MC',
    },
  },
  {
    id: 'post-2',
    title: 'Eliminating Layout Shift in Hydrated Islands',
    excerpt:
      'Techniques for zero-CLS component streaming, skeleton synchronization, and sub-100ms Interaction to Next Paint (INP).',
    category: 'Performance',
    readTime: '6 min read',
    date: 'Aug 14, 2026',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Sarah Jenkins',
      role: 'Performance Engineer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      initials: 'SJ',
    },
  },
  {
    id: 'post-3',
    title: 'Deterministic State Synchronization Over WebSockets',
    excerpt:
      'Building conflict-free collaborative data models with operational transformation and CRDTs for multi-tenant SaaS.',
    category: 'Architecture',
    readTime: '7 min read',
    date: 'Aug 11, 2026',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Devon Vance',
      role: 'Distributed Systems Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      initials: 'DV',
    },
  },
  {
    id: 'post-4',
    title: 'Building Headless Accessible Dropdowns with Reka UI',
    excerpt:
      'Step-by-step implementation of focus trap management, keyboard navigation patterns, and polymorphic slot composition.',
    category: 'Tutorials',
    readTime: '4 min read',
    date: 'Aug 08, 2026',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Aaliyah Patel',
      role: 'Frontend Engineer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      initials: 'AP',
    },
  },
  {
    id: 'post-5',
    title: 'Fluid Typography and Motion Curves in Modern Web Apps',
    excerpt:
      'Using CSS clamp functions and spring physics to create tactile, responsive interfaces that adapt directly across devices.',
    category: 'Design Systems',
    readTime: '5 min read',
    date: 'Aug 04, 2026',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Lucas Meyer',
      role: 'UI Engineer',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      initials: 'LM',
    },
  },
  {
    id: 'post-6',
    title: 'Continuous Benchmarking with Playwright and GitHub Actions',
    excerpt:
      'Automate regression detection for memory leaks, bundle sizes, and render latency directly within your CI pull request checks.',
    category: 'Tutorials',
    readTime: '6 min read',
    date: 'Jul 30, 2026',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Elena Rostova',
      role: 'Principal Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      initials: 'ER',
    },
  },
]

const additionalPosts: BlogPost[] = [
  {
    id: 'post-7',
    title: 'Optimizing JavaScript Garbage Collection in High-Frequency Canvas',
    excerpt:
      'How object pooling and typed array buffers solved stuttering frame rates during real-time telemetry rendering.',
    category: 'Performance',
    readTime: '9 min read',
    date: 'Jul 26, 2026',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Marcus Chen',
      role: 'Design Technologist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      initials: 'MC',
    },
  },
  {
    id: 'post-8',
    title: 'Resilient Edge Caching Strategies for Dynamic Multi-Region APIs',
    excerpt:
      'Configuring stale-while-revalidate headers, cache tagging, and instant surrogate key purging across worldwide POPs.',
    category: 'Architecture',
    readTime: '7 min read',
    date: 'Jul 22, 2026',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Devon Vance',
      role: 'Distributed Systems Lead',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      initials: 'DV',
    },
  },
  {
    id: 'post-9',
    title: 'Designing High-Contrast Dark Modes without Washing Out Brand Identity',
    excerpt:
      'Tuning APCA perceptual contrast ratios, luminance curves, and colored alpha borders in enterprise dark themes.',
    category: 'Design Systems',
    readTime: '5 min read',
    date: 'Jul 18, 2026',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    author: {
      name: 'Aaliyah Patel',
      role: 'Frontend Engineer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      initials: 'AP',
    },
  },
]

const visiblePosts = computed(() => {
  const pool = showAllPosts.value ? [...initialPosts, ...additionalPosts] : initialPosts
  if (activeCategory.value === 'All') return pool
  return pool.filter((p) => p.category === activeCategory.value)
})

const isHeroVisible = computed(() => {
  if (!props.showFeatured) return false
  return activeCategory.value === 'All' || featuredPost.category === activeCategory.value
})

function handleCategorySelect(cat: Category) {
  activeCategory.value = cat
}

function handleLoadMore() {
  isLoadingMore.value = true
  setTimeout(() => {
    showAllPosts.value = true
    isLoadingMore.value = false
  }, 400)
}

function handleSubscribe() {
  if (!emailInput.value.includes('@')) return
  isSubscribed.value = true
}
</script>

<template>
  <section data-slot="blog-post-card-grid" :class="cn('bg-background w-full py-12 sm:py-16 lg:py-20', props.class)">
    <div class="mx-auto max-w-7xl space-y-12 px-4 sm:space-y-16 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div class="max-w-2xl space-y-3">
          <Badge variant="outline" class="gap-1.5 px-3 py-1 text-xs font-medium">
            <Sparkles class="text-primary size-3.5" aria-hidden="true" />
            From the Blog
          </Badge>
          <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Latest Articles &amp; Engineering Deep Dives
          </h2>
          <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
            Technical essays on software architecture, design systems, and frontend performance.
          </p>
        </div>

        <!-- Category Filter Pills -->
        <div class="flex flex-wrap items-center gap-2" role="tablist" aria-label="Article categories">
          <Button
            v-for="cat in categories"
            :key="cat"
            size="sm"
            :variant="activeCategory === cat ? 'default' : 'outline'"
            class="rounded-full text-xs font-medium transition-all"
            :aria-selected="activeCategory === cat"
            role="tab"
            @click="handleCategorySelect(cat)"
          >
            {{ cat }}
          </Button>
        </div>
      </div>

      <!-- Featured Hero Article Card -->
      <Card
        v-if="isHeroVisible"
        class="group/hero border-border bg-card hover:border-primary/30 relative overflow-hidden shadow-xs transition-all duration-300 hover:shadow-md"
      >
        <div class="grid grid-cols-1 lg:grid-cols-12">
          <!-- Hero Image Container -->
          <div
            class="bg-muted relative aspect-video min-h-[260px] min-w-0 overflow-hidden sm:min-h-[340px] lg:col-span-7 lg:aspect-auto"
          >
            <img
              :src="featuredPost.image"
              :alt="featuredPost.title"
              class="size-full object-cover transition-transform duration-500 ease-out group-hover/hero:scale-105"
            />
            <div class="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <Badge class="bg-primary text-primary-foreground border-transparent text-xs font-medium shadow-xs">
                <Sparkles class="mr-1 size-3" aria-hidden="true" />
                Featured Story
              </Badge>
              <Badge
                variant="secondary"
                class="bg-background/90 text-foreground border-border/60 text-xs font-medium shadow-xs backdrop-blur-md"
              >
                {{ featuredPost.category }}
              </Badge>
            </div>
          </div>

          <!-- Hero Content Panel -->
          <CardContent class="flex flex-col justify-between space-y-6 p-6 sm:p-8 lg:col-span-5 lg:p-10">
            <div class="space-y-4">
              <div class="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                <BookOpen class="text-primary size-3.5" aria-hidden="true" />
                <span>Editorial Dispatch</span>
                <span>&bull;</span>
                <span class="inline-flex items-center gap-1">
                  <Clock class="size-3" aria-hidden="true" />
                  {{ featuredPost.readTime }}
                </span>
              </div>

              <h3
                class="text-foreground group-hover/hero:text-primary text-2xl leading-tight font-bold tracking-tight transition-colors sm:text-3xl"
              >
                <a href="#" class="focus-visible:ring-ring focus-visible:underline focus-visible:outline-none">
                  {{ featuredPost.title }}
                </a>
              </h3>

              <p class="text-muted-foreground line-clamp-4 text-sm leading-relaxed sm:text-base">
                {{ featuredPost.excerpt }}
              </p>
            </div>

            <div class="space-y-5 pt-2">
              <Separator class="bg-border/60" />
              <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <Avatar size="default" class="border-border/60 border shadow-xs">
                    <AvatarImage :src="featuredPost.author.avatar" :alt="featuredPost.author.name" />
                    <AvatarFallback :text="featuredPost.author.initials" />
                  </Avatar>
                  <div>
                    <p class="text-foreground text-sm font-semibold">{{ featuredPost.author.name }}</p>
                    <p class="text-muted-foreground text-xs">
                      {{ featuredPost.date }} &middot; {{ featuredPost.author.role }}
                    </p>
                  </div>
                </div>

                <Button size="sm" class="group/btn gap-1.5">
                  <span>Read Article</span>
                  <ArrowRight
                    class="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-1"
                    aria-hidden="true"
                  />
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      <!-- 3-Column Article Card Grid -->
      <div v-if="visiblePosts.length > 0" class="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="post in visiblePosts"
          :key="post.id"
          class="group border-border bg-card hover:border-primary/30 flex flex-col justify-between overflow-hidden shadow-xs transition-all duration-300 hover:shadow-md"
        >
          <!-- Article Image Placeholder with 16:9 Aspect -->
          <div class="bg-muted relative aspect-video w-full overflow-hidden">
            <img
              :src="post.image"
              :alt="post.title"
              loading="lazy"
              class="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div class="absolute top-3 left-3">
              <Badge
                variant="secondary"
                class="bg-background/85 text-foreground border-border/50 text-xs font-medium shadow-xs backdrop-blur-md"
              >
                {{ post.category }}
              </Badge>
            </div>
          </div>

          <!-- Article Body -->
          <div class="flex flex-1 flex-col justify-between space-y-4 p-5 sm:p-6">
            <div class="space-y-2.5">
              <h3
                class="text-foreground group-hover:text-primary line-clamp-2 text-lg font-semibold tracking-tight transition-colors"
              >
                <a href="#" class="focus-visible:ring-ring focus-visible:underline focus-visible:outline-none">
                  {{ post.title }}
                </a>
              </h3>
              <p class="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                {{ post.excerpt }}
              </p>
            </div>

            <!-- Author Row & Reading Time Pill -->
            <div class="space-y-4 pt-2">
              <Separator class="bg-border/60" />
              <div class="flex items-center justify-between gap-3">
                <div class="flex min-w-0 items-center gap-2.5">
                  <Avatar size="sm" class="border-border/60 border">
                    <AvatarImage :src="post.author.avatar" :alt="post.author.name" />
                    <AvatarFallback :text="post.author.initials" />
                  </Avatar>
                  <div class="min-w-0 flex-1">
                    <p class="text-foreground truncate text-xs font-medium">{{ post.author.name }}</p>
                    <p class="text-muted-foreground truncate text-xs">{{ post.date }}</p>
                  </div>
                </div>

                <div
                  class="text-muted-foreground bg-muted/60 flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                >
                  <Clock class="size-3" aria-hidden="true" />
                  <span>{{ post.readTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Empty State When No Posts Match Category -->
      <div v-else class="border-border bg-card/40 space-y-3 rounded-xl border border-dashed p-10 text-center">
        <div class="bg-muted text-muted-foreground mx-auto flex size-12 items-center justify-center rounded-full">
          <BookOpen class="size-6" aria-hidden="true" />
        </div>
        <h3 class="text-foreground text-base font-semibold">No articles found</h3>
        <p class="text-muted-foreground text-sm">
          There are no articles published yet under &ldquo;{{ activeCategory }}&rdquo;.
        </p>
        <Button variant="outline" size="sm" @click="activeCategory = 'All'"> Show all articles </Button>
      </div>

      <!-- Load More Stories Button -->
      <div v-if="!showAllPosts && visiblePosts.length > 0" class="flex justify-center pt-2">
        <Button
          variant="outline"
          size="lg"
          class="gap-2 px-8 font-medium shadow-xs"
          :disabled="isLoadingMore"
          @click="handleLoadMore"
        >
          <Loader2 v-if="isLoadingMore" class="size-4 animate-spin" aria-hidden="true" />
          <span>{{ isLoadingMore ? 'Loading articles...' : 'Load More Stories' }}</span>
        </Button>
      </div>

      <!-- Newsletter Subscribe Box -->
      <Card class="border-border bg-card/60 relative overflow-hidden shadow-xs">
        <div class="bg-primary/10 pointer-events-none absolute -top-12 -right-12 size-48 rounded-full blur-3xl" />
        <CardContent class="relative z-10 flex flex-col items-center justify-between gap-8 p-8 sm:p-10 md:flex-row">
          <div class="max-w-xl space-y-2 text-center md:text-left">
            <div class="bg-primary/10 text-primary mx-auto flex size-10 items-center justify-center rounded-lg md:mx-0">
              <Mail class="size-5" aria-hidden="true" />
            </div>
            <h3 class="text-foreground text-2xl font-bold tracking-tight">Subscribe to our editorial dispatch</h3>
            <p class="text-muted-foreground text-sm leading-relaxed">
              Get weekly teardowns on frontend architecture, component design systems, and web performance delivered
              straight to your inbox.
            </p>
          </div>

          <div class="w-full max-w-md">
            <template v-if="!isSubscribed">
              <form class="flex flex-col gap-2 sm:flex-row" @submit.prevent="handleSubscribe">
                <Input
                  v-model="emailInput"
                  type="email"
                  placeholder="name@company.com"
                  required
                  aria-label="Email address"
                  class="bg-background h-10 shadow-xs"
                />
                <Button type="submit" class="shrink-0"> Subscribe </Button>
              </form>
              <p class="text-muted-foreground mt-2 text-center text-xs sm:text-left">
                No spam. Sent bi-weekly. Unsubscribe with one click.
              </p>
            </template>
            <div
              v-else
              class="bg-primary/10 border-primary/20 text-foreground flex items-center gap-3 rounded-lg border p-3.5 text-sm font-medium"
            >
              <Check class="text-primary size-5 shrink-0" aria-hidden="true" />
              <span>You're subscribed! Check your inbox for the welcome issue.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </section>
</template>
