'use client'

import { ArrowRight, Boxes } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const nodes = [
  { mark: 'SF', name: 'Snowflake', direction: 'source' },
  { mark: 'BQ', name: 'BigQuery', direction: 'source' },
  { mark: 'PG', name: 'Postgres', direction: 'source' },
  { mark: 'DT', name: 'dbt', direction: 'source' },
  { mark: 'SL', name: 'Slack', direction: 'destination' },
  { mark: 'PD', name: 'PagerDuty', direction: 'destination' },
  { mark: 'LK', name: 'Looker', direction: 'destination' },
  { mark: 'HX', name: 'Hex', direction: 'destination' },
]

// Positions are computed on a circle in a 100x100 user-space viewBox, so any
// number of nodes distributes evenly without touching the markup.
const RADIUS = 38
const placed = nodes.map((node, index) => {
  const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2
  return { ...node, x: 50 + RADIUS * Math.cos(angle), y: 50 + RADIUS * Math.sin(angle) }
})

export function IntegrationsHubDiagram() {
  return (
    <section data-slot="integrations-hub-diagram" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <Badge variant="secondary">Architecture</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              One hub between your warehouse and everything downstream
            </h2>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              Sources stay read-only and in place. Destinations receive certified metrics rather than raw extracts, so
              nothing downstream can quietly redefine a number.
            </p>

            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="bg-primary size-2 rounded-full" aria-hidden="true" />
                <dt className="font-medium">Sources</dt>
                <dd className="text-muted-foreground">read-only</dd>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-muted-foreground/50 size-2 rounded-full" aria-hidden="true" />
                <dt className="font-medium">Destinations</dt>
                <dd className="text-muted-foreground">certified metrics only</dd>
              </div>
            </dl>

            <Button className="mt-8">
              See the reference architecture
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="relative aspect-square">
                {/* Spokes are drawn in the same 100-unit space the nodes are
                    placed in, so line ends always meet the node centres. */}
                <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" aria-hidden="true">
                  {placed.map((node) => (
                    <line
                      key={node.name}
                      x1="50"
                      y1="50"
                      x2={node.x}
                      y2={node.y}
                      className="stroke-border"
                      strokeWidth="0.4"
                      strokeDasharray={node.direction === 'destination' ? '2 2' : undefined}
                    />
                  ))}
                  <circle cx="50" cy="50" r={RADIUS} className="stroke-border/60" fill="none" strokeWidth="0.3" />
                </svg>

                <div className="border-border bg-card absolute top-1/2 left-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-xl border shadow-sm">
                  <Boxes className="text-primary size-5" aria-hidden="true" />
                  <span className="text-[10px] font-semibold tracking-tight">Metric layer</span>
                </div>

                {placed.map((node) => (
                  <div
                    key={node.name}
                    className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    <span
                      className={`border-border bg-background flex size-10 items-center justify-center rounded-lg border font-mono text-xs font-semibold ${
                        node.direction === 'source' ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                      aria-hidden="true"
                    >
                      {node.mark}
                    </span>
                    <span className="text-muted-foreground text-[10px] whitespace-nowrap">{node.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
