<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ExternalLink,
  FileQuestion,
  HelpCircle,
  Mail,
  MessageSquare,
  Search,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-vue-next'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface FaqItem {
  id: string
  question: string
  answer: string
  category: 'ownership' | 'security' | 'architecture' | 'pricing'
  tags: string[]
  helpfulCount: number
}

const faqs: FaqItem[] = [
  {
    id: 'ownership',
    question: 'Do I actually own the component code after running the add command?',
    answer:
      'Yes, 100%. UIPKGE follows the unbundled registry architecture pioneered by shadcn. When you run `npx shadcn-vue add` or `npx shadcn add`, the raw TypeScript, SFC, and variant files are copied directly into your repository. You are never bound to semver release cycles or rigid third-party package internals.',
    category: 'ownership',
    tags: ['Ownership', 'Zero Lock-in', 'MIT License'],
    helpfulCount: 342,
  },
  {
    id: 'security',
    question: 'How do you ensure zero supply-chain security risks without npm packages?',
    answer:
      'Every registry manifest and code payload is statically generated and cryptographically verifiable. Because source files live in your project tree, your static analysis tools (SonarQube, Snyk, ESLint, TypeScript compiler) inspect every single line of code during your existing CI pipeline with zero runtime black boxes.',
    category: 'security',
    tags: ['SOC 2', 'Zero Black Box', 'Static Audit'],
    helpfulCount: 289,
  },
  {
    id: 'architecture',
    question: 'How does dual-framework parity work between Vue 3 and React 19?',
    answer:
      'Both Vue and React registry trees are built against canonical shared Tailwind v4 design tokens and CVA variants in `packages/shared/`. Vue components leverage Reka UI primitives, while React components leverage Radix UI primitives, ensuring identical DOM contracts, keyboard navigation, and accessibility semantics.',
    category: 'architecture',
    tags: ['Vue 3.5', 'React 19', 'Tailwind v4', 'Reka UI'],
    helpfulCount: 215,
  },
  {
    id: 'migration',
    question: 'Can we integrate these blocks into an existing Tailwind v4 or Nuxt 3 project?',
    answer:
      'Absolutely. You only need to run `npx shadcn-vue add @uipkge/init` to configure the baseline `@theme` tokens and `cn()` utility in your `tailwind.css`. From there, individual blocks and primitives can be added incrementally without rewriting your existing styles.',
    category: 'architecture',
    tags: ['Nuxt 3', 'Tailwind v4', 'Vite', 'Next.js'],
    helpfulCount: 198,
  },
  {
    id: 'pricing',
    question: 'What is the pricing model for commercial applications and vertical SaaS?',
    answer:
      'The UIPKGE registry is 100% open source under the permissive MIT license. You can use all primitives and blocks in personal projects, commercial SaaS products, and internal client applications with zero licensing fees or seat royalties.',
    category: 'pricing',
    tags: ['MIT License', 'Commercial Use', 'Free Forever'],
    helpfulCount: 456,
  },
  {
    id: 'updates',
    question: 'How do we pull updates or improvements to components we already copied?',
    answer:
      'Because you own the code, you can inspect diffs using Git. If you want to re-pull the newest upstream implementation of a component or block, simply run `npx shadcn-vue add <name> --overwrite` and review the git diff in your IDE before committing.',
    category: 'ownership',
    tags: ['Git Diff', 'Custom Overwrites', 'Upgrades'],
    helpfulCount: 167,
  },
]

const searchQuery = ref('')
const activeCategory = ref<'all' | 'ownership' | 'security' | 'architecture' | 'pricing'>('all')
const votedMap = ref<Record<string, 'up' | 'down'>>({})

function vote(id: string, dir: 'up' | 'down') {
  if (votedMap.value[id] === dir) {
    delete votedMap.value[id]
  } else {
    votedMap.value[id] = dir
  }
}

const filteredFaqs = computed(() => {
  return faqs.filter((item) => {
    const matchesCategory = activeCategory.value === 'all' || item.category === activeCategory.value
    const matchesSearch =
      searchQuery.value.trim() === '' ||
      item.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.value.toLowerCase()))
    return matchesCategory && matchesSearch
  })
})
</script>

<template>
  <section data-slot="faq-01" class="bg-background border-border relative w-full border-y py-16 lg:py-24">
    <div class="mx-auto max-w-5xl space-y-12 px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-2xl space-y-4 text-center">
        <div class="inline-flex items-center gap-2">
          <Badge
            variant="outline"
            class="border-primary/30 text-primary bg-primary/5 gap-1.5 px-2.5 py-1 font-mono text-xs tracking-wide uppercase"
          >
            <HelpCircle class="size-3.5" />
            Knowledge Base
          </Badge>
          <span class="text-muted-foreground font-mono text-xs">Architecture & Licensing</span>
        </div>
        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently Answered Architecture Questions.
        </h2>
        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          Everything you need to know about component ownership, security verification, and dual-framework integration.
        </p>
      </div>

      <!-- Search and Filter Bar -->
      <div
        class="bg-card border-border flex flex-col items-center justify-between gap-4 rounded-xl border p-3 shadow-xs sm:flex-row"
      >
        <div class="relative w-full sm:w-80">
          <Search class="text-muted-foreground absolute top-2.5 left-3 size-4" />
          <Input
            v-model="searchQuery"
            placeholder="Search questions or keywords..."
            class="h-9 pl-9 font-sans text-xs"
          />
        </div>

        <div class="flex w-full flex-wrap items-center gap-1.5 sm:w-auto">
          <button
            v-for="cat in [
              { id: 'all', label: 'All Topics' },
              { id: 'ownership', label: 'Ownership' },
              { id: 'security', label: 'Security' },
              { id: 'architecture', label: 'Architecture' },
              { id: 'pricing', label: 'Licensing' },
            ]"
            :key="cat.id"
            type="button"
            class="rounded-md px-2.5 py-1.5 text-xs font-medium transition-all"
            :class="
              activeCategory === cat.id
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            "
            @click="activeCategory = cat.id as any"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- FAQ Accordion List -->
      <div class="space-y-4">
        <div v-if="filteredFaqs.length === 0" class="space-y-3 py-12 text-center">
          <FileQuestion class="text-muted-foreground mx-auto size-10" />
          <p class="text-foreground text-sm font-medium">No matching questions found</p>
          <p class="text-muted-foreground text-xs">Try adjusting your search query or topic filter.</p>
        </div>

        <Accordion v-else type="multiple" class="w-full space-y-3">
          <AccordionItem
            v-for="item in filteredFaqs"
            :key="item.id"
            :value="item.id"
            class="border-border bg-card/60 data-[state=open]:bg-card data-[state=open]:border-primary/40 rounded-xl border px-5 transition-all data-[state=open]:shadow-xs"
          >
            <AccordionTrigger class="py-4 text-left hover:no-underline">
              <div class="flex items-center gap-3 pr-4">
                <span class="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                  {{ item.question }}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent
              class="text-muted-foreground border-border/50 space-y-4 border-t pt-1 pb-5 text-xs leading-relaxed sm:text-sm"
            >
              <p>{{ item.answer }}</p>

              <!-- Meta tags & feedback row -->
              <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div class="flex flex-wrap items-center gap-1.5">
                  <Badge v-for="tag in item.tags" :key="tag" variant="secondary" class="font-mono text-xs">
                    {{ tag }}
                  </Badge>
                </div>

                <div class="text-muted-foreground flex items-center gap-2 text-xs">
                  <span>Helpful?</span>
                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      class="hover:bg-muted inline-flex items-center gap-1 rounded p-1 text-xs transition-colors"
                      :class="votedMap[item.id] === 'up' ? 'font-semibold text-emerald-600 dark:text-emerald-400' : ''"
                      @click="vote(item.id, 'up')"
                    >
                      <ThumbsUp class="size-3.5" />
                      <span>{{ item.helpfulCount + (votedMap[item.id] === 'up' ? 1 : 0) }}</span>
                    </button>
                    <button
                      type="button"
                      class="hover:bg-muted inline-flex items-center gap-1 rounded p-1 text-xs transition-colors"
                      :class="votedMap[item.id] === 'down' ? 'font-semibold text-rose-600 dark:text-rose-400' : ''"
                      @click="vote(item.id, 'down')"
                    >
                      <ThumbsDown class="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <!-- Support & Helpdesk CTA Box -->
      <Card
        class="bg-muted/30 border-border flex flex-col items-center justify-between gap-4 rounded-xl p-6 sm:flex-row"
      >
        <div class="flex items-center gap-3.5 text-left">
          <div
            class="bg-primary/10 text-primary border-primary/20 flex size-10 shrink-0 items-center justify-center rounded-lg border"
          >
            <MessageSquare class="size-5" />
          </div>
          <div>
            <h4 class="text-foreground text-sm font-semibold">Have an edge-case or enterprise question?</h4>
            <p class="text-muted-foreground mt-0.5 text-xs">
              Join our Discord community or open an architecture RFC on GitHub.
            </p>
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-2.5">
          <Button variant="outline" size="sm" class="h-8 gap-1.5 text-xs" as-child>
            <a href="https://github.com/uday-a/uipkge/issues" target="_blank" rel="noreferrer">
              <ExternalLink class="size-3.5" />
              Open GitHub RFC
            </a>
          </Button>
          <Button size="sm" class="h-8 gap-1.5 text-xs" as-child>
            <a href="mailto:hello@uipkge.dev">
              <Mail class="size-3.5" />
              Contact Architecture Team
            </a>
          </Button>
        </div>
      </Card>
    </div>
  </section>
</template>
