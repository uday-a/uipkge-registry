'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const categories = [
  {
    id: 'security',
    label: 'Security',
    entries: [
      {
        q: 'Where is our data stored?',
        a: 'Definitions and query metadata sit in your chosen region. Warehouse rows are never copied out.',
      },
      {
        q: 'Are you SOC 2 audited?',
        a: 'Type II, audited annually. The report and the subprocessor list are on the trust centre.',
      },
      { q: 'Can we bring our own keys?', a: 'Yes, on the enterprise plan, with rotation handled through your KMS.' },
    ],
  },
  {
    id: 'billing',
    label: 'Billing',
    entries: [
      {
        q: 'How is usage counted?',
        a: 'By query, not by seat. Materialised reads are not billed twice within their freshness window.',
      },
      {
        q: 'Can we cap spend?',
        a: 'Per-team query budgets are enforced at run time, so a runaway dashboard cannot outspend its ceiling.',
      },
      { q: 'Do you offer annual terms?', a: 'Yes, with a discount and an invoiced option above a threshold.' },
    ],
  },
  {
    id: 'setup',
    label: 'Setup',
    entries: [
      {
        q: 'What do you need from us?',
        a: 'A read-only role, your identity provider, and an hour with whoever owns the warehouse.',
      },
      {
        q: 'How long until first value?',
        a: 'Most teams publish a first certified metric on day one and finish the rollout in five weeks.',
      },
    ],
  },
]

export function FaqCategorizedTabs() {
  return (
    <section data-slot="faq-categorized-tabs" className="bg-background">
      <div className="mx-auto max-w-4xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">Support</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Answers by topic</h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Grouped rather than listed, because one flat list of thirty questions is a list nobody reads.
          </p>
        </div>

        <Tabs defaultValue={categories[0].id} className="mt-10">
          <TabsList variant="pill" className="flex-nowrap overflow-x-auto">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} variant="pill">
                {category.label}
                <span className="text-muted-foreground ml-1.5 font-mono text-xs">{category.entries.length}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                {category.entries.map((entry) => (
                  <AccordionItem key={entry.q} value={entry.q}>
                    <AccordionTrigger className="text-left font-medium">{entry.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">{entry.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>

        <Button variant="ghost" className="mt-8">
          Browse the full help centre
        </Button>
      </div>
    </section>
  )
}
