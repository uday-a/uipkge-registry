'use client'

import { ArrowRight } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const faqs = [
  {
    q: 'Does our data leave the warehouse?',
    a: 'No. Metrics resolve against your warehouse at query time using a read-only role. We store definitions and query metadata, never rows.',
  },
  {
    q: 'How long does a rollout take?',
    a: 'Five weeks from kickoff to hand-over is typical: a week to connect, a week to model, two to pilot with one team, one to roll out.',
  },
  {
    q: 'What happens when a definition changes?',
    a: 'It opens a pull request. Once merged, every consumer resolves the new definition at once, and reverting is the same single click.',
  },
  {
    q: 'Can we keep using our BI tool?',
    a: 'Yes. Looker, Hex, and Sigma read certified metrics through the API, so they stop maintaining their own competing definitions.',
  },
  {
    q: 'How is access controlled?',
    a: 'Row-level scope resolves per query from your identity provider. A shared dashboard link cannot show a viewer more than their own scope.',
  },
  {
    q: 'What does it cost to run?',
    a: 'Query budgets are enforced per team at run time, so warehouse spend is capped rather than reconciled from an invoice a month later.',
  },
]

// Deal alternately so the two columns stay balanced regardless of answer length.
const columns = [faqs.filter((_, index) => index % 2 === 0), faqs.filter((_, index) => index % 2 === 1)]

export function FaqTwoColumn() {
  return (
    <section data-slot="faq-two-column" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">FAQ</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Questions we get on the first call</h2>
        </div>

        {/* Two independent accordions: a long answer on the left cannot push the
            questions on the right out of alignment. */}
        <div className="mt-10 grid gap-x-12 gap-y-0 md:grid-cols-2">
          {columns.map((column, index) => (
            <Accordion key={index} type="multiple" className="w-full">
              {column.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q}>
                  <AccordionTrigger className="text-left text-sm font-medium">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ))}
        </div>

        <div className="border-border mt-10 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <p className="text-muted-foreground text-sm">Something not covered here?</p>
          <Button variant="outline">
            Talk to an engineer
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}
