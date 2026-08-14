'use client'

import { ArrowRight } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function TestimonialSingleFeatured() {
  return (
    <section data-slot="testimonial-single-featured" className="bg-background">
      <div className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
        <Badge variant="secondary">Customer</Badge>

        {/* One quote, given the whole section. Keep it short: the size is what
            carries it, and a long quote at this scale stops being readable. */}
        <blockquote className="mt-6 text-2xl leading-tight font-medium tracking-tight text-balance sm:text-3xl lg:text-4xl">
          “We stopped arguing about whose number was right and started arguing about what to do next.”
        </blockquote>

        <div className="mt-10 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex items-center gap-4">
            <Avatar className="size-12">
              <AvatarFallback>EW</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Erin Walsh</p>
              <p className="text-muted-foreground text-sm">VP Finance · Northwind Logistics</p>
            </div>
            <Separator orientation="vertical" className="ml-2 hidden h-10 sm:block" />
            <span className="hidden text-sm font-semibold tracking-[0.18em] uppercase sm:inline">Northwind</span>
          </div>

          <div className="sm:text-right">
            <p className="font-display text-3xl font-bold tracking-tight">5 days</p>
            <p className="text-muted-foreground mt-1 text-sm">off the monthly close</p>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">Freight forwarding · 1,200 staff · live since Q1 2026</p>
          <Button variant="outline">
            Read the full story
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}
