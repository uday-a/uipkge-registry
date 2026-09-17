<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  ArrowRight,
  Bookmark,
  Calendar,
  Check,
  Clock,
  Heart,
  MessageSquare,
  Newspaper,
  Rss,
  Search,
  Sparkles,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export interface NewsletterIssue {
  id: string
  issueNumber: number
  volumeDate: string
  title: string
  excerpt: string
  category: 'Architecture' | 'Design Tokens' | 'Performance' | 'Interviews'
  tags: string[]
  readTime: string
  date: string
  commentsCount: number
  likesCount: number
  featured?: boolean
}

interface Props {
  publicationName?: string
  subtitle?: string
  subscriberCount?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  publicationName: 'The Unbundled Engineer',
  subtitle: 'Weekly architectural teardowns of modern design systems, web performance, and component registries.',
  subscriberCount: '42,500+ Subscribers · Top 1% on Substack',
})

const email = ref('')
const isSubscribed = ref(false)
const searchQuery = ref('')
const selectedCategory = ref<string>('All Issues')

function handleSubscribe() {
  if (!email.value || !email.value.includes('@')) return
  isSubscribed.value = true
}

const categories = ['All Issues', 'Architecture', 'Design Tokens', 'Performance', 'Interviews'] as const

const featuredIssue: NewsletterIssue = {
  id: 'issue-43',
  issueNumber: 43,
  volumeDate: 'Aug 2026',
  title: 'The Death of npm Component Libraries: Why Copy-Paste Architecture Won',
  excerpt:
    'How unbundled UI registries replaced monolithic node_modules packages, eliminated dependency hell, and gave full code ownership back to frontend engineering teams across the industry.',
  category: 'Architecture',
  tags: ['#architecture', '#registries', '#future-of-web', '#tooling'],
  readTime: '9 min read',
  date: 'Aug 25, 2026',
  commentsCount: 128,
  likesCount: 1420,
  featured: true,
}

const archiveIssues: NewsletterIssue[] = [
  {
    id: 'issue-42',
    issueNumber: 42,
    volumeDate: 'Aug 2026',
    title: 'Why Zero-Dependency Registries Are Winning',
    excerpt:
      'A deep dive into why enterprise engineering teams are abandoning monolithic UI packages in favor of composable own-your-code registry models that eliminate breaking upgrade cascades.',
    category: 'Architecture',
    tags: ['#architecture', '#web-performance', '#dx'],
    readTime: '6 min read',
    date: 'Aug 18, 2026',
    commentsCount: 84,
    likesCount: 642,
  },
  {
    id: 'issue-41',
    issueNumber: 41,
    volumeDate: 'Aug 2026',
    title: 'Mastering Tailwind v4: OKLCH Colors & Dynamic Themes',
    excerpt:
      'How modern CSS color spaces and inline theme definitions unlock mathematically perceptually uniform light/dark transitions without CSS variables explosion.',
    category: 'Design Tokens',
    tags: ['#design-tokens', '#css', '#theming'],
    readTime: '8 min read',
    date: 'Aug 11, 2026',
    commentsCount: 56,
    likesCount: 519,
  },
  {
    id: 'issue-40',
    issueNumber: 40,
    volumeDate: 'Aug 2026',
    title: 'Zero-CLS Island Hydration in Modern Web Frameworks',
    excerpt:
      'Eliminating Cumulative Layout Shift when server-rendered islands hydrate in Astro and Nuxt. Practical patterns distilled from serving 1M+ monthly pageviews.',
    category: 'Performance',
    tags: ['#performance', '#core-web-vitals', '#astro'],
    readTime: '5 min read',
    date: 'Aug 04, 2026',
    commentsCount: 92,
    likesCount: 730,
  },
  {
    id: 'issue-39',
    issueNumber: 39,
    volumeDate: 'Jul 2026',
    title: 'Interview: Building High-Craft Interfaces with Paco Coursey',
    excerpt:
      'The creator of cmdk and sonner breaks down spring physics, popover placement math, and why 60fps micro-interactions define software brand trust.',
    category: 'Interviews',
    tags: ['#interviews', '#craft', '#animation'],
    readTime: '11 min read',
    date: 'Jul 28, 2026',
    commentsCount: 147,
    likesCount: 1205,
  },
  {
    id: 'issue-38',
    issueNumber: 38,
    volumeDate: 'Jul 2026',
    title: 'Building Resilient Component APIs with Polymorphic Slots',
    excerpt:
      'Why the asChild composition pattern beat standard prop drilling for accessible primitives, and how Reka UI implements headless polymorphism without DOM overhead.',
    category: 'Architecture',
    tags: ['#architecture', '#vue', '#reka-ui'],
    readTime: '7 min read',
    date: 'Jul 21, 2026',
    commentsCount: 63,
    likesCount: 488,
  },
  {
    id: 'issue-37',
    issueNumber: 37,
    volumeDate: 'Jul 2026',
    title: 'Designing for Multi-Tenant White-Labeling at Scale',
    excerpt:
      'Architecting a headless token graph that dynamically maps corporate brand identities and custom color palettes across 500+ enterprise subdomains in real time.',
    category: 'Design Tokens',
    tags: ['#design-tokens', '#architecture', '#enterprise'],
    readTime: '9 min read',
    date: 'Jul 14, 2026',
    commentsCount: 71,
    likesCount: 610,
  },
]

function focusEmailInput() {
  const el = document.getElementById('newsletter-archive-email')
  el?.focus()
}

const filteredIssues = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return archiveIssues.filter((issue) => {
    const matchesCategory = selectedCategory.value === 'All Issues' || issue.category === selectedCategory.value

    const matchesSearch =
      !query ||
      issue.title.toLowerCase().includes(query) ||
      issue.excerpt.toLowerCase().includes(query) ||
      issue.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      `issue #${issue.issueNumber}`.toLowerCase().includes(query)

    return matchesCategory && matchesSearch
  })
})

function getCategoryCount(cat: string) {
  if (cat === 'All Issues') return archiveIssues.length
  return archiveIssues.filter((issue) => issue.category === cat).length
}

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = 'All Issues'
}
</script>

<template>
  <div
    data-slot="newsletter-issue-archive"
    :class="cn('mx-auto w-full max-w-5xl space-y-12 px-4 py-8 sm:px-6 sm:py-12', props.class)"
  >
    <!-- Newsletter Header Hero -->
    <header class="mx-auto max-w-3xl space-y-4 text-center">
      <div
        class="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-medium shadow-xs"
      >
        <Sparkles class="size-3.5 shrink-0" aria-hidden="true" />
        <span>{{ subscriberCount }}</span>
      </div>

      <h1 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {{ publicationName }}
      </h1>

      <p class="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
        {{ subtitle }}
      </p>

      <!-- Subscribe Form -->
      <div class="mx-auto w-full max-w-md pt-2">
        <div v-if="!isSubscribed">
          <form class="flex flex-col gap-2 sm:flex-row sm:gap-0" @submit.prevent="handleSubscribe">
            <Input
              id="newsletter-archive-email"
              v-model="email"
              type="email"
              placeholder="Enter your work email..."
              required
              class="bg-card h-11 text-sm shadow-xs sm:rounded-r-none"
              aria-label="Work email address"
            />
            <Button type="submit" class="h-11 shrink-0 px-6 font-medium sm:rounded-l-none"> Subscribe for Free </Button>
          </form>
          <p class="text-muted-foreground mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs">
            <span>Free weekly issues</span>
            <span>Zero spam</span>
            <span>1-click unsubscribe</span>
          </p>
        </div>

        <div
          v-else
          class="border-success/30 bg-success/10 text-success inline-flex items-center gap-2.5 rounded-lg border px-4 py-3 text-sm font-medium shadow-xs"
        >
          <Check class="size-4 shrink-0" aria-hidden="true" />
          <span>You&rsquo;re subscribed! Check your inbox for confirmation.</span>
        </div>
      </div>
    </header>

    <!-- Featured Issue Spotlight Card -->
    <section aria-labelledby="featured-issue-heading" class="space-y-3">
      <div class="flex items-center justify-between px-1">
        <h2 id="featured-issue-heading" class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Pinned Spotlight Edition
        </h2>
        <Badge variant="outline" class="text-primary border-primary/30 gap-1 text-xs">
          <Sparkles class="size-3" aria-hidden="true" /> Latest Release
        </Badge>
      </div>

      <Card class="border-border/80 bg-card hover:border-primary/40 overflow-hidden shadow-xs transition-all">
        <div class="grid grid-cols-1 gap-6 p-6 sm:p-8 lg:grid-cols-12">
          <!-- Text Content -->
          <div class="flex flex-col justify-between space-y-4 lg:col-span-7">
            <div class="space-y-3">
              <div class="flex flex-wrap items-center gap-2">
                <Badge variant="default" class="font-mono text-xs">
                  Issue #{{ featuredIssue.issueNumber }} · {{ featuredIssue.volumeDate }}
                </Badge>
                <Badge variant="secondary" class="text-xs">
                  {{ featuredIssue.category }}
                </Badge>
                <span class="text-muted-foreground ml-auto inline-flex items-center gap-1 text-xs">
                  <Clock class="size-3" aria-hidden="true" />
                  {{ featuredIssue.readTime }}
                </span>
              </div>

              <h3
                class="text-foreground hover:text-primary cursor-pointer text-xl font-bold tracking-tight transition-colors sm:text-2xl"
              >
                {{ featuredIssue.title }}
              </h3>

              <p class="text-muted-foreground text-sm leading-relaxed sm:text-base">
                {{ featuredIssue.excerpt }}
              </p>
            </div>

            <div class="space-y-4 pt-2">
              <div class="flex flex-wrap gap-1.5">
                <Badge
                  v-for="tag in featuredIssue.tags"
                  :key="tag"
                  variant="outline"
                  class="text-muted-foreground font-mono text-xs font-normal"
                >
                  {{ tag }}
                </Badge>
              </div>

              <div class="border-border/60 flex flex-wrap items-center justify-between gap-4 border-t pt-3">
                <div class="text-muted-foreground flex items-center gap-4 text-xs">
                  <span class="inline-flex items-center gap-1.5">
                    <Calendar class="size-3.5" aria-hidden="true" />
                    {{ featuredIssue.date }}
                  </span>
                  <span class="inline-flex items-center gap-1.5">
                    <MessageSquare class="size-3.5" aria-hidden="true" />
                    {{ featuredIssue.commentsCount }} comments
                  </span>
                  <span class="inline-flex items-center gap-1.5">
                    <Heart class="size-3.5" aria-hidden="true" />
                    {{ featuredIssue.likesCount }}
                  </span>
                </div>

                <Button variant="default" size="sm" class="group gap-1.5 font-medium">
                  Read Issue
                  <ArrowRight class="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>

          <!-- Schematic Cover Illustration -->
          <div class="flex items-center lg:col-span-5">
            <div class="border-border/80 bg-muted/40 w-full rounded-lg border p-4 font-mono text-xs sm:p-5">
              <div class="border-border/60 mb-3 flex items-center justify-between border-b pb-2.5">
                <div class="flex items-center gap-1.5">
                  <span class="bg-destructive/60 inline-block size-2.5 rounded-full" />
                  <span class="bg-warning/60 inline-block size-2.5 rounded-full" />
                  <span class="bg-success/60 inline-block size-2.5 rounded-full" />
                </div>
                <span class="text-muted-foreground text-xs">registry-teardown.ts</span>
              </div>
              <div class="text-muted-foreground space-y-2">
                <div class="text-primary text-xs font-medium">// Own your component code</div>
                <div><span class="text-foreground">$</span> npx shadcn-vue@latest add @uipkge/card</div>
                <div class="text-emerald-600 dark:text-emerald-400">✔ Fetched raw TypeScript SFC</div>
                <div class="text-emerald-600 dark:text-emerald-400">✔ Merged local Tailwind v4 tokens</div>
                <div class="text-muted-foreground/80 pt-1">// Zero runtime package lock-in</div>
              </div>
              <div class="border-border/40 mt-4 flex flex-wrap gap-1.5 border-t pt-3">
                <span class="bg-background text-foreground border-border rounded border px-2 py-0.5 text-xs"
                  >Zero npm deps</span
                >
                <span class="bg-background text-foreground border-border rounded border px-2 py-0.5 text-xs"
                  >Tailwind v4</span
                >
                <span class="bg-background text-foreground border-border rounded border px-2 py-0.5 text-xs"
                  >OKLCH</span
                >
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>

    <!-- Search and Filter Bar -->
    <section aria-label="Search and filter archive" class="space-y-4">
      <div class="flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
        <!-- Search Input -->
        <div class="w-full md:max-w-md">
          <Input
            v-model="searchQuery"
            type="search"
            placeholder="Search issues by title, topic, or tag..."
            :prefix-icon="Search"
            allow-clear
            class="bg-card shadow-xs"
            aria-label="Search archive issues"
          />
        </div>

        <!-- Result Counter -->
        <div class="text-muted-foreground flex items-center justify-between gap-3 text-xs md:justify-end">
          <span>Showing {{ filteredIssues.length }} {{ filteredIssues.length === 1 ? 'edition' : 'editions' }}</span>
          <button
            v-if="searchQuery || selectedCategory !== 'All Issues'"
            type="button"
            class="text-primary focus-visible:ring-ring inline-flex items-center gap-1 rounded font-medium hover:underline focus-visible:ring-1 focus-visible:outline-none"
            @click="clearFilters"
          >
            Reset filters
            <X class="size-3" aria-hidden="true" />
          </button>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter by category">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          role="tab"
          :aria-selected="selectedCategory === cat"
          :class="
            cn(
              'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none',
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground font-medium shadow-xs'
                : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground',
            )
          "
          @click="selectedCategory = cat"
        >
          <span>{{ cat }}</span>
          <span
            :class="
              cn(
                'py-0.2 rounded-full px-1.5 text-xs',
                selectedCategory === cat
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-background/80 text-muted-foreground',
              )
            "
          >
            {{ getCategoryCount(cat) }}
          </span>
        </button>
      </div>
    </section>

    <!-- Issue Archive List -->
    <section aria-label="Archive issue list">
      <div v-if="filteredIssues.length > 0" class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card
          v-for="issue in filteredIssues"
          :key="issue.id"
          class="group border-border/70 bg-card hover:border-primary/40 flex flex-col justify-between transition-all hover:shadow-xs"
        >
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between gap-2">
              <Badge variant="outline" class="font-mono text-xs">
                Issue #{{ issue.issueNumber }} · {{ issue.volumeDate }}
              </Badge>
              <span class="text-muted-foreground inline-flex items-center gap-1 text-xs">
                <Clock class="size-3" aria-hidden="true" />
                {{ issue.readTime }}
              </span>
            </div>

            <CardTitle
              class="group-hover:text-primary cursor-pointer pt-2 text-base leading-snug font-semibold tracking-tight transition-colors sm:text-lg"
            >
              {{ issue.title }}
            </CardTitle>

            <CardDescription class="text-muted-foreground mt-1.5 line-clamp-3 text-sm leading-relaxed">
              {{ issue.excerpt }}
            </CardDescription>
          </CardHeader>

          <CardContent class="py-0">
            <div class="flex flex-wrap gap-1.5 pt-1">
              <Badge v-for="tag in issue.tags" :key="tag" variant="secondary" class="font-mono text-xs font-normal">
                {{ tag }}
              </Badge>
            </div>
          </CardContent>

          <CardFooter
            class="border-border/60 text-muted-foreground mt-4 flex items-center justify-between border-t pt-4 text-xs"
          >
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center gap-1">
                <Calendar class="size-3" aria-hidden="true" />
                {{ issue.date }}
              </span>
              <span class="inline-flex items-center gap-1">
                <MessageSquare class="size-3" aria-hidden="true" />
                {{ issue.commentsCount }}
              </span>
              <span class="inline-flex items-center gap-1">
                <Heart class="size-3" aria-hidden="true" />
                {{ issue.likesCount }}
              </span>
            </div>

            <a
              href="#read"
              class="text-foreground group-hover:text-primary inline-flex items-center gap-1 font-medium transition-colors focus-visible:underline focus-visible:outline-none"
            >
              <span>Read Issue</span>
              <ArrowRight class="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </CardFooter>
        </Card>
      </div>

      <!-- Empty State -->
      <div v-else class="border-border bg-card/50 space-y-3 rounded-xl border border-dashed p-10 text-center">
        <Newspaper class="text-muted-foreground/60 mx-auto size-8" aria-hidden="true" />
        <h3 class="text-foreground text-base font-semibold">No issues found</h3>
        <p class="text-muted-foreground mx-auto max-w-sm text-sm">
          No newsletter issues matched &ldquo;{{ searchQuery }}&rdquo; in {{ selectedCategory }}.
        </p>
        <div class="pt-2">
          <Button variant="outline" size="sm" @click="clearFilters"> Clear search &amp; filters </Button>
        </div>
      </div>
    </section>

    <!-- Publication Cadence & RSS Bar -->
    <footer
      class="border-border/80 bg-muted/30 flex flex-col items-center justify-between gap-4 rounded-xl border p-6 text-center shadow-xs sm:flex-row sm:text-left"
    >
      <div>
        <h3 class="text-foreground text-sm font-semibold">Never miss a teardown</h3>
        <p class="text-muted-foreground mt-0.5 text-xs">
          Published every Tuesday morning. Zero sponsor promotions, purely deep technical architecture.
        </p>
      </div>

      <div class="flex shrink-0 items-center gap-2.5">
        <Button variant="outline" size="sm" class="gap-1.5 text-xs">
          <Rss class="size-3.5" aria-hidden="true" />
          RSS Feed
        </Button>
        <Button variant="default" size="sm" class="gap-1.5 text-xs" @click="focusEmailInput">
          <Bookmark class="size-3.5" aria-hidden="true" />
          Join Newsletter
        </Button>
      </div>
    </footer>
  </div>
</template>
