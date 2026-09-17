'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const quotes = [
  { quote: 'Close starts from a reconciled position now.', author: 'Erin Walsh', role: 'VP Finance', initials: 'EW' },
  {
    quote: 'The request queue went away and stayed away.',
    author: 'Daniel Brooks',
    role: 'Head of Analytics',
    initials: 'DB',
  },
  {
    quote: 'One pipeline definition, two teams, no argument.',
    author: 'Priya Raman',
    role: 'RevOps Director',
    initials: 'PR',
  },
  {
    quote: 'We deleted eleven spreadsheets in one quarter.',
    author: 'Marcus Ellery',
    role: 'Staff Engineer',
    initials: 'ME',
  },
  {
    quote: 'Auditors get a change log instead of a folder.',
    author: 'Sophie Lindqvist',
    role: 'Controller',
    initials: 'SL',
  },
  { quote: 'Permissions finally match the org chart.', author: 'Tom Fairbanks', role: 'IT Director', initials: 'TF' },
  {
    quote: 'Nobody has written a bespoke extract since March.',
    author: 'Anna Reyes',
    role: 'Data Lead',
    initials: 'AR',
  },
  { quote: 'Forecast review is about the forecast again.', author: 'Grace Whitlock', role: 'CFO', initials: 'GW' },
]

const rows = [quotes.slice(0, 4), quotes.slice(4)]

export function TestimonialMarqueeScroll() {
  return (
    <section data-slot="testimonial-marquee-scroll" className="bg-background overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-20 lg:pt-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">What people say</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Eight hundred teams, unprompted</h2>
        </div>
      </div>

      {/* Edge masks fade the rows into the page so cards never end mid-cut. */}
      <div className="marquee relative mt-10 space-y-4 pb-20 lg:pb-28">
        {rows.map((row, index) => (
          <div key={index} className="marquee__row">
            <div className={`marquee__track ${index === 1 ? 'marquee__track--reverse' : ''}`}>
              {/* Duplicated once so the loop has an identical second half to scroll into. */}
              {[...row, ...row].map((entry, i) => (
                <Card key={`${entry.author}-${i}`} className="w-80 shrink-0">
                  <CardContent className="p-5">
                    <blockquote className="text-sm leading-relaxed">“{entry.quote}”</blockquote>
                    <div className="mt-4 flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">{entry.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium">{entry.author}</p>
                        <p className="text-muted-foreground truncate text-xs">{entry.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Keyframes and the edge mask cannot be expressed as utilities; everything
          else stays in the markup. Matches logo-ticker-infinite. */}
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        [data-slot="testimonial-marquee-scroll"] .marquee {
          mask-image: linear-gradient(to right, transparent, black 6rem, black calc(100% - 6rem), transparent);
        }
        [data-slot="testimonial-marquee-scroll"] .marquee__row { overflow: hidden; }
        [data-slot="testimonial-marquee-scroll"] .marquee__track {
          display: flex;
          width: max-content;
          gap: 1rem;
          animation: marquee-scroll 46s linear infinite;
        }
        [data-slot="testimonial-marquee-scroll"] .marquee__track--reverse { animation-direction: reverse; }
        [data-slot="testimonial-marquee-scroll"] .marquee__row:hover .marquee__track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          [data-slot="testimonial-marquee-scroll"] .marquee__track { animation: none; }
          [data-slot="testimonial-marquee-scroll"] .marquee__row { overflow-x: auto; }
        }
      `}</style>
    </section>
  )
}
