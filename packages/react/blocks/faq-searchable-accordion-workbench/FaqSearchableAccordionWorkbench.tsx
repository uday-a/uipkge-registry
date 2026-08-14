'use client'

import * as React from 'react'
import { ChevronDown, HelpCircle, MessageSquare, Search, Terminal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type FaqCategory = 'all' | 'architecture' | 'parity' | 'licensing'

interface FaqItem {
  id: string
  category: 'architecture' | 'parity' | 'licensing'
  question: string
  answer: string
  tag: string
}

const faqItems: FaqItem[] = [
  {
    id: '1',
    category: 'architecture',
    question: 'How is UIPKGE different from standard component packages on npm?',
    answer:
      'UIPKGE does not publish monolithic npm packages. When you run our CLI command, raw Vue 3.5 SFCs or React 19 TSX files are copied directly into your repository. You own 100% of the code, have zero semver breaking risks, and can customize any token, prop, or micro-interaction without waiting on maintainers.',
    tag: 'Unbundled AST',
  },
  {
    id: '2',
    category: 'parity',
    question: 'How does dual-framework parity work between Vue and React?',
    answer:
      'Every primitive and block in UIPKGE is authored with identical class tokens, CVA variant definitions, and OKLCH color palettes across both Vue (Reka UI) and React (Radix UI). Automated parity check scripts in CI ensure 100% token consistency across frameworks.',
    tag: 'Dual-Framework',
  },
  {
    id: '3',
    category: 'architecture',
    question: 'Can I customize the Tailwind CSS v4 design tokens?',
    answer:
      'Yes. All design tokens are declared using standard Tailwind CSS v4 `@theme inline` CSS custom properties in `styles/tailwind.css`. You can change primary colors, border radii, or spring curves globally in one file.',
    tag: 'Tailwind v4',
  },
  {
    id: '4',
    category: 'licensing',
    question: 'What is the licensing model for commercial projects?',
    answer:
      'All UIPKGE components and blocks are 100% MIT-licensed. You can use them freely in commercial applications, client projects, and internal tools without paying per-seat subscriptions or attribution fees.',
    tag: 'MIT License',
  },
  {
    id: '5',
    category: 'parity',
    question: 'Which headless primitives power UIPKGE components?',
    answer:
      'In Vue 3.5, primitives use Reka UI for keyboard ergonomics and ARIA compliance. In React 19, primitives utilize Radix UI and standard headless primitives, ensuring complete accessibility compliance (WCAG AA).',
    tag: 'Headless A11y',
  },
  {
    id: '6',
    category: 'licensing',
    question: 'Do you offer custom enterprise component design engineering?',
    answer:
      'Yes. Our enterprise tier includes dedicated engineering syncs, bespoke block authoring, private organizational registry hubs, and priority architectural audits.',
    tag: 'Enterprise SLA',
  },
]

export interface FaqSearchableAccordionWorkbenchProps {
  className?: string
}

export function FaqSearchableAccordionWorkbench({ className }: FaqSearchableAccordionWorkbenchProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<FaqCategory>('all')
  const [openItemIds, setOpenItemIds] = React.useState<Record<string, boolean>>({ '1': true })

  const toggleItem = (id: string) => {
    setOpenItemIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const filteredFaqs = React.useMemo(() => {
    return faqItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      const matchesQuery =
        query === '' ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.tag.toLowerCase().includes(query)

      return matchesCategory && matchesQuery
    })
  }, [searchQuery, selectedCategory])

  return (
    <section
      data-slot="faq-searchable-accordion-workbench"
      className={cn('bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8', className)}
    >
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Section Header */}
        <div className="space-y-4 text-center">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
            <HelpCircle className="text-primary size-3.5" />
            Technical FAQ Workbench
          </Badge>
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked architectural questions.
          </h2>
          <p className="text-muted-foreground text-base">
            Everything you need to know about our unbundled registry distribution model.
          </p>

          {/* Search & Filter Bar */}
          <div className="mx-auto max-w-xl space-y-3 pt-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search architecture, tokens, licensing, or parity..."
                className="bg-card border-border h-11 rounded-xl pl-10 font-mono text-xs shadow-sm"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <button
                type="button"
                className={cn(
                  'rounded-lg border px-3 py-1 font-mono text-xs transition-all',
                  selectedCategory === 'all'
                    ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setSelectedCategory('all')}
              >
                All ({faqItems.length})
              </button>
              <button
                type="button"
                className={cn(
                  'rounded-lg border px-3 py-1 font-mono text-xs transition-all',
                  selectedCategory === 'architecture'
                    ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setSelectedCategory('architecture')}
              >
                Architecture
              </button>
              <button
                type="button"
                className={cn(
                  'rounded-lg border px-3 py-1 font-mono text-xs transition-all',
                  selectedCategory === 'parity'
                    ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setSelectedCategory('parity')}
              >
                Dual-Framework Parity
              </button>
              <button
                type="button"
                className={cn(
                  'rounded-lg border px-3 py-1 font-mono text-xs transition-all',
                  selectedCategory === 'licensing'
                    ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setSelectedCategory('licensing')}
              >
                Licensing &amp; SLA
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = Boolean(openItemIds[faq.id])
            return (
              <div
                key={faq.id}
                className={cn(
                  'border-border bg-card/95 overflow-hidden rounded-2xl border text-left shadow-xs transition-all',
                  isOpen ? 'ring-primary/20 shadow-md ring-1' : 'hover:border-border/80',
                )}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-mono"
                  onClick={() => toggleItem(faq.id)}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Badge variant="outline" className="shrink-0 font-mono text-xs">
                      {faq.tag}
                    </Badge>
                    <h3 className="text-foreground truncate text-sm font-bold sm:text-base">{faq.question}</h3>
                  </div>
                  <ChevronDown
                    className={cn(
                      'text-muted-foreground size-4 shrink-0 transition-transform duration-200',
                      isOpen && 'text-primary rotate-180',
                    )}
                  />
                </button>

                {/* Answer Body */}
                {isOpen && (
                  <div className="text-muted-foreground border-border/40 border-t px-5 pt-1 pb-5 text-xs leading-relaxed sm:text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}

          {/* Empty Results */}
          {filteredFaqs.length === 0 && (
            <div className="border-border rounded-2xl border border-dashed p-12 text-center">
              <p className="text-muted-foreground font-mono text-xs">No questions match your query "{searchQuery}".</p>
            </div>
          )}
        </div>

        {/* Live Support Footer Card */}
        <Card className="border-border bg-card/50 flex flex-col items-center justify-between gap-4 rounded-2xl p-6 text-center sm:flex-row sm:text-left">
          <div className="space-y-1">
            <h4 className="text-foreground font-mono text-sm font-bold">Have a unique technical requirement?</h4>
            <p className="text-muted-foreground text-xs">Chat with the core design engineering team in real time.</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button size="sm" variant="outline" className="h-9 gap-1.5 font-mono text-xs">
              <MessageSquare className="size-3.5" />
              <span>Join Discord</span>
            </Button>
            <Button size="sm" className="h-9 gap-1.5 font-mono text-xs">
              <Terminal className="size-3.5" />
              <span>GitHub Discussions</span>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
export default FaqSearchableAccordionWorkbench
