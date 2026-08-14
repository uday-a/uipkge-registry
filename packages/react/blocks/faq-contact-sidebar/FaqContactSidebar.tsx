'use client'

import { ArrowRight, BookOpen, MessageSquare } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const faqs = [
  {
    q: 'Can we trial it against production data?',
    a: 'Yes, and we recommend it. The connection is read-only, so a trial runs against the real warehouse without a staging copy or a data loading step.',
  },
  {
    q: 'Who owns the definitions after hand-over?',
    a: 'You do. They live in your repository, reviewed by your team. If the contract ends, the definitions and their history stay where they are.',
  },
  {
    q: 'What happens if the warehouse is down?',
    a: 'Materialised aggregates keep serving with a visible freshness stamp. Live queries fail loudly rather than returning a stale number silently.',
  },
  {
    q: 'Do you support on-premise warehouses?',
    a: 'Postgres and SQL Server over a private link, yes. Anything requiring an agent inside your network is on the roadmap but not shipped.',
  },
  {
    q: 'How are restatements handled?',
    a: 'A restatement is a definition change with an effective date. Prior periods are recomputed and the change log records who approved it and when.',
  },
]

export function FaqContactSidebar() {
  return (
    <section data-slot="faq-contact-sidebar" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div>
            <Badge variant="secondary">FAQ</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Before you book a call</h2>
            <p className="text-muted-foreground mt-3 text-lg">
              The five questions that come up most, answered without a form in the way.
            </p>

            <Accordion type="single" collapsible className="mt-8 w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q}>
                  <AccordionTrigger className="text-left font-medium">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Sticky so it stays beside the list however far the accordion expands. */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="text-xs">DB</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">Daniel Brooks</p>
                    <p className="text-muted-foreground truncate text-xs">Solutions engineering</p>
                  </div>
                </div>

                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                  Ask the awkward version of your question. An engineer answers, not a sales inbox.
                </p>

                <div className="mt-5 grid gap-2">
                  <Button>
                    <MessageSquare className="mr-2 size-4" aria-hidden="true" />
                    Ask a question
                  </Button>
                  <Button variant="outline">
                    <BookOpen className="mr-2 size-4" aria-hidden="true" />
                    Read the docs
                  </Button>
                </div>

                <Separator className="my-5" />

                <dl className="space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Median first reply</dt>
                    <dd className="font-medium">3 h 40 m</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Coverage</dt>
                    <dd className="font-medium">Mon–Fri, 08:00–20:00 UTC</dd>
                  </div>
                </dl>

                <Button variant="link" className="mt-4 h-auto p-0 text-xs">
                  See the full FAQ
                  <ArrowRight className="ml-1 size-3" aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </section>
  )
}
