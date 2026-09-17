'use client'

import * as React from 'react'
import { ExternalLink, FileQuestion, HelpCircle, Mail, MessageSquare, Search, ThumbsDown, ThumbsUp } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

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

export function Faq01() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState<
    'all' | 'ownership' | 'security' | 'architecture' | 'pricing'
  >('all')
  const [votedMap, setVotedMap] = React.useState<Record<string, 'up' | 'down'>>({})

  const vote = (id: string, dir: 'up' | 'down') => {
    setVotedMap((prev) => {
      const next = { ...prev }
      if (next[id] === dir) {
        delete next[id]
      } else {
        next[id] = dir
      }
      return next
    })
  }

  const filteredFaqs = React.useMemo(() => {
    return faqs.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        query === '' ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.tags.some((t) => t.toLowerCase().includes(query))
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <section data-slot="faq-01" className="bg-background border-border relative w-full border-y py-16 lg:py-24">
      <div className="mx-auto max-w-5xl space-y-12 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <div className="inline-flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-primary/30 text-primary bg-primary/5 gap-1.5 px-2.5 py-1 font-mono text-xs tracking-wide uppercase"
            >
              <HelpCircle className="size-3.5" />
              Knowledge Base
            </Badge>
            <span className="text-muted-foreground font-mono text-xs">Architecture & Licensing</span>
          </div>
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently Answered Architecture Questions.
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
            Everything you need to know about component ownership, security verification, and dual-framework
            integration.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-card border-border flex flex-col items-center justify-between gap-4 rounded-xl border p-3 shadow-xs sm:flex-row">
          <div className="relative w-full sm:w-80">
            <Search className="text-muted-foreground absolute top-2.5 left-3 size-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords..."
              className="h-9 pl-9 font-sans text-xs"
            />
          </div>

          <div className="flex w-full flex-wrap items-center gap-1.5 sm:w-auto">
            {[
              { id: 'all', label: 'All Topics' },
              { id: 'ownership', label: 'Ownership' },
              { id: 'security', label: 'Security' },
              { id: 'architecture', label: 'Architecture' },
              { id: 'pricing', label: 'Licensing' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={cn(
                  'rounded-md px-2.5 py-1.5 text-xs font-medium transition-all',
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
                onClick={() => setActiveCategory(cat.id as any)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="space-y-3 py-12 text-center">
              <FileQuestion className="text-muted-foreground mx-auto size-10" />
              <p className="text-foreground text-sm font-medium">No matching questions found</p>
              <p className="text-muted-foreground text-xs">Try adjusting your search query or topic filter.</p>
            </div>
          ) : (
            <Accordion type="multiple" className="w-full space-y-3">
              {filteredFaqs.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-border bg-card/60 data-[state=open]:bg-card data-[state=open]:border-primary/40 rounded-xl border px-5 transition-all data-[state=open]:shadow-xs"
                >
                  <AccordionTrigger className="py-4 text-left hover:no-underline">
                    <div className="flex items-center gap-3 pr-4">
                      <span className="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                        {item.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground border-border/50 space-y-4 border-t pt-1 pb-5 text-xs leading-relaxed sm:text-sm">
                    <p>{item.answer}</p>

                    {/* Meta tags & feedback row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="font-mono text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <span>Helpful?</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className={cn(
                              'hover:bg-muted inline-flex items-center gap-1 rounded p-1 text-xs transition-colors',
                              votedMap[item.id] === 'up' && 'font-semibold text-emerald-600 dark:text-emerald-400',
                            )}
                            onClick={() => vote(item.id, 'up')}
                          >
                            <ThumbsUp className="size-3.5" />
                            <span>{item.helpfulCount + (votedMap[item.id] === 'up' ? 1 : 0)}</span>
                          </button>
                          <button
                            type="button"
                            className={cn(
                              'hover:bg-muted inline-flex items-center gap-1 rounded p-1 text-xs transition-colors',
                              votedMap[item.id] === 'down' && 'font-semibold text-rose-600 dark:text-rose-400',
                            )}
                            onClick={() => vote(item.id, 'down')}
                          >
                            <ThumbsDown className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* Support & Helpdesk CTA Box */}
        <Card className="bg-muted/30 border-border flex flex-col items-center justify-between gap-4 rounded-xl p-6 sm:flex-row">
          <div className="flex items-center gap-3.5 text-left">
            <div className="bg-primary/10 text-primary border-primary/20 flex size-10 shrink-0 items-center justify-center rounded-lg border">
              <MessageSquare className="size-5" />
            </div>
            <div>
              <h4 className="text-foreground text-sm font-semibold">Have an edge-case or enterprise question?</h4>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Join our Discord community or open an architecture RFC on GitHub.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" asChild>
              <a href="https://github.com/uday-a/uipkge/issues" target="_blank" rel="noreferrer">
                <ExternalLink className="size-3.5" />
                Open GitHub RFC
              </a>
            </Button>
            <Button size="sm" className="h-8 gap-1.5 text-xs" asChild>
              <a href="mailto:hello@uipkge.dev">
                <Mail className="size-3.5" />
                Contact Architecture Team
              </a>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
export default Faq01
