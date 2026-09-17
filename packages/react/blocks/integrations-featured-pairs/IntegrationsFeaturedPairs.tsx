'use client'

import { ArrowRight, Check, Plug } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const featured = [
  {
    mark: 'SF',
    name: 'Snowflake',
    summary: 'Query your warehouse directly. Metrics resolve against live tables instead of a nightly copy.',
    steps: ['Create a read-only role', 'Paste the account URL', 'Pick the databases to expose'],
    status: 'Connected',
    healthy: true,
    meta: 'Read-only · no data egress',
  },
  {
    mark: 'OK',
    name: 'Okta',
    summary: 'Group membership drives row-level scope, so access changes the moment HR changes it.',
    steps: ['Add the SAML app', 'Enable SCIM provisioning', 'Map groups to scopes'],
    status: 'Connected',
    healthy: true,
    meta: 'SAML + SCIM',
  },
  {
    mark: 'SL',
    name: 'Slack',
    summary: 'Drift and freshness alerts land in the channel that owns the metric, with the run attached.',
    steps: ['Install the app', 'Choose default channels', 'Route alerts per metric owner'],
    status: 'Needs re-auth',
    healthy: false,
    meta: 'Token expires every 90 days',
  },
]

export function IntegrationsFeaturedPairs() {
  return (
    <section data-slot="integrations-featured-pairs" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="max-w-2xl">
          <Badge variant="secondary">Featured integrations</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">The three most teams connect first</h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Each one is three steps and read-only. What the connection actually does is written on the card.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {featured.map((integration) => (
            <Card key={integration.name}>
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex items-center gap-3">
                  <span
                    className="border-border text-muted-foreground flex size-10 items-center justify-center rounded-lg border font-mono text-sm font-semibold"
                    aria-hidden="true"
                  >
                    {integration.mark}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{integration.name}</p>
                    <p className="text-muted-foreground truncate text-xs">{integration.meta}</p>
                  </div>
                </div>

                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">{integration.summary}</p>

                <Separator className="my-5" />

                <p className="text-muted-foreground font-mono text-xs tracking-[0.14em] uppercase">Setup</p>
                <ol className="mt-3 space-y-2">
                  {integration.steps.map((step, index) => (
                    <li key={step} className="text-foreground flex items-start gap-2.5 text-sm">
                      <span className="text-muted-foreground/70 mt-px font-mono text-xs">{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                  <Badge variant={integration.healthy ? 'secondary' : 'outline'} className="gap-1.5">
                    {integration.healthy ? (
                      <Check className="size-3" aria-hidden="true" />
                    ) : (
                      <Plug className="size-3" aria-hidden="true" />
                    )}
                    {integration.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-auto px-2 py-1">
                    Docs
                    <ArrowRight className="ml-1 size-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
