'use client'

import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function CtaFinalBand() {
  return (
    <section data-slot="cta-final-band" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="border-border bg-card rounded-2xl border px-6 py-14 text-center sm:px-12">
          <Badge variant="secondary">Start today</Badge>
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Publish one certified metric this afternoon
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg text-pretty">
            Connect a warehouse, define one number, and invite the team. If it does not stick, you have lost an
            afternoon.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg">
              Start free
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Button>
            <Button size="lg" variant="outline">
              Book a walkthrough
            </Button>
          </div>

          <Separator className="mx-auto my-8 max-w-xs" />

          <p className="text-muted-foreground text-sm">
            No card required · 30-day trial · 8,400 engineers on the monthly notes
          </p>
        </div>
      </div>
    </section>
  )
}
