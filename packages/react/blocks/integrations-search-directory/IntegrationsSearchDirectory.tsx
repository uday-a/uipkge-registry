'use client'

import { useMemo, useState } from 'react'
import { ArrowUpRight, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const integrations = [
  {
    mark: 'SF',
    name: 'Snowflake',
    category: 'Warehouses',
    blurb: 'Query live tables with a read-only role.',
    auth: 'Key pair',
  },
  {
    mark: 'BQ',
    name: 'BigQuery',
    category: 'Warehouses',
    blurb: 'Service-account access, per-dataset scope.',
    auth: 'Service account',
  },
  {
    mark: 'RS',
    name: 'Redshift',
    category: 'Warehouses',
    blurb: 'Serverless and provisioned clusters.',
    auth: 'IAM role',
  },
  {
    mark: 'OK',
    name: 'Okta',
    category: 'Identity',
    blurb: 'Group membership drives row-level scope.',
    auth: 'SAML + SCIM',
  },
  {
    mark: 'EI',
    name: 'Entra ID',
    category: 'Identity',
    blurb: 'Directory groups sync on a schedule.',
    auth: 'SAML + SCIM',
  },
  {
    mark: 'SL',
    name: 'Slack',
    category: 'Alerting',
    blurb: 'Route alerts to the metric owner’s channel.',
    auth: 'OAuth',
  },
  {
    mark: 'PD',
    name: 'PagerDuty',
    category: 'Alerting',
    blurb: 'Page on freshness breaches, not on noise.',
    auth: 'API key',
  },
  {
    mark: 'DT',
    name: 'dbt',
    category: 'Modelling',
    blurb: 'Import models as certified metric sources.',
    auth: 'API token',
  },
  {
    mark: 'AF',
    name: 'Airflow',
    category: 'Modelling',
    blurb: 'Trigger materialisation from your DAGs.',
    auth: 'API token',
  },
]

export function IntegrationsSearchDirectory() {
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = q
      ? integrations.filter((i) => `${i.name} ${i.category} ${i.blurb} ${i.auth}`.toLowerCase().includes(q))
      : integrations
    const map = new Map<string, typeof integrations>()
    for (const integration of matches) {
      const list = map.get(integration.category)
      if (list) list.push(integration)
      else map.set(integration.category, [integration])
    }
    return [...map.entries()]
  }, [query])

  return (
    <section data-slot="integrations-search-directory" className="bg-background">
      <div className="mx-auto max-w-4xl px-6 py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Badge variant="secondary">Directory</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Find your stack</h2>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="Search integrations…"
              aria-label="Search integrations"
            />
          </div>
        </div>

        <Card className="mt-8">
          <CardContent className="p-2">
            {!groups.length && (
              <div className="px-4 py-16 text-center">
                <p className="text-sm font-medium">No integration matches “{query}”.</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  We ship new connectors most releases — tell us which one you need.
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  Request an integration
                </Button>
              </div>
            )}

            {groups.map(([category, list], index) => (
              <div key={category}>
                <p className="text-muted-foreground px-4 pt-4 pb-2 font-mono text-xs tracking-[0.14em] uppercase">
                  {category}
                </p>
                <ul>
                  {list.map((integration) => (
                    <li key={integration.name}>
                      <a
                        href="#"
                        className="hover:bg-muted focus-visible:ring-ring group flex items-center gap-4 rounded-lg px-4 py-3 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                      >
                        <span
                          className="border-border text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-semibold"
                          aria-hidden="true"
                        >
                          {integration.mark}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium">{integration.name}</span>
                          <span className="text-muted-foreground block truncate text-xs">{integration.blurb}</span>
                        </span>
                        <Badge variant="outline" className="hidden shrink-0 sm:inline-flex">
                          {integration.auth}
                        </Badge>
                        <ArrowUpRight
                          className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
                {index < groups.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
