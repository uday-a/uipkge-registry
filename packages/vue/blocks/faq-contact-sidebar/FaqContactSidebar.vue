<script setup lang="ts">
import { ArrowRight, BookOpen, MessageSquare } from 'lucide-vue-next'
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
</script>

<template>
  <section data-slot="faq-contact-sidebar" class="bg-background">
    <div class="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div class="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <div>
          <Badge variant="secondary">FAQ</Badge>
          <h2 class="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Before you book a call</h2>
          <p class="text-muted-foreground mt-3 text-lg">
            The five questions that come up most, answered without a form in the way.
          </p>

          <Accordion type="single" collapsible class="mt-8 w-full">
            <AccordionItem v-for="faq in faqs" :key="faq.q" :value="faq.q">
              <AccordionTrigger class="text-left font-medium">{{ faq.q }}</AccordionTrigger>
              <AccordionContent class="text-muted-foreground leading-relaxed">{{ faq.a }}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <!-- Sticky so it stays beside the list however far the accordion expands. -->
        <aside class="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent class="p-6">
              <div class="flex items-center gap-3">
                <Avatar class="size-10">
                  <AvatarFallback class="text-xs">DB</AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                  <p class="truncate text-sm font-medium">Daniel Brooks</p>
                  <p class="text-muted-foreground truncate text-xs">Solutions engineering</p>
                </div>
              </div>

              <p class="text-muted-foreground mt-4 text-sm leading-relaxed">
                Ask the awkward version of your question. An engineer answers, not a sales inbox.
              </p>

              <div class="mt-5 grid gap-2">
                <Button>
                  <MessageSquare class="mr-2 size-4" aria-hidden="true" />
                  Ask a question
                </Button>
                <Button variant="outline">
                  <BookOpen class="mr-2 size-4" aria-hidden="true" />
                  Read the docs
                </Button>
              </div>

              <Separator class="my-5" />

              <dl class="space-y-2 text-xs">
                <div class="flex items-center justify-between gap-3">
                  <dt class="text-muted-foreground">Median first reply</dt>
                  <dd class="font-medium">3 h 40 m</dd>
                </div>
                <div class="flex items-center justify-between gap-3">
                  <dt class="text-muted-foreground">Coverage</dt>
                  <dd class="font-medium">Mon–Fri, 08:00–20:00 UTC</dd>
                </div>
              </dl>

              <Button variant="link" class="mt-4 h-auto p-0 text-xs">
                See the full FAQ
                <ArrowRight class="ml-1 size-3" aria-hidden="true" />
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  </section>
</template>
