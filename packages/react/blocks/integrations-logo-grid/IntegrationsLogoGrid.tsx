'use client'

import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

// Monogram stand-ins: swap the `mark` for a real logo file per integration.
const integrations = [
  { name: 'Snowflake', mark: 'SF', category: 'Warehouses' },
  { name: 'BigQuery', mark: 'BQ', category: 'Warehouses' },
  { name: 'Redshift', mark: 'RS', category: 'Warehouses' },
  { name: 'Databricks', mark: 'DB', category: 'Warehouses' },
  { name: 'Postgres', mark: 'PG', category: 'Warehouses' },
  { name: 'Okta', mark: 'OK', category: 'Identity' },
  { name: 'Entra ID', mark: 'EI', category: 'Identity' },
  { name: 'Google Workspace', mark: 'GW', category: 'Identity' },
  { name: 'Slack', mark: 'SL', category: 'Alerting' },
  { name: 'PagerDuty', mark: 'PD', category: 'Alerting' },
  { name: 'Opsgenie', mark: 'OG', category: 'Alerting' },
  { name: 'dbt', mark: 'DT', category: 'Modelling' },
  { name: 'Airflow', mark: 'AF', category: 'Modelling' },
  { name: 'Dagster', mark: 'DG', category: 'Modelling' },
  { name: 'Fivetran', mark: 'FT', category: 'Modelling' },
  { name: 'Looker', mark: 'LK', category: 'Downstream' },
  { name: 'Hex', mark: 'HX', category: 'Downstream' },
  { name: 'Sigma', mark: 'SG', category: 'Downstream' },
]

const ALL = 'All'
const categories = [ALL, ...new Set(integrations.map((i) => i.category))]

export function IntegrationsLogoGrid() {
  const [active, setActive] = useState(ALL)
  const visible = useMemo(
    () => (active === ALL ? integrations : integrations.filter((i) => i.category === active)),
    [active],
  )

  return (
    <section data-slot="integrations-logo-grid" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Badge variant="secondary">Integrations</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Works with what you already run</h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Read-only connections, configured once. Nothing here needs an agent installed on your side.
            </p>
          </div>

          <ToggleGroup
            value={active}
            type="single"
            variant="outline"
            size="sm"
            className="flex-nowrap overflow-x-auto"
            aria-label="Filter integrations by category"
            // Single-select emits '' when the pressed item is pressed again;
            // fall back to ALL so the wall is never empty.
            onValueChange={(value: string) => setActive(value || ALL)}
          >
            {categories.map((category) => (
              <ToggleGroupItem key={category} value={category}>
                {category}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="bg-border border-border mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border sm:grid-cols-4 lg:grid-cols-6">
          {visible.map((integration) => (
            <div
              key={integration.name}
              className="bg-background hover:bg-muted/60 group flex aspect-square flex-col items-center justify-center gap-2 p-4 transition-colors"
            >
              <span
                className="border-border text-muted-foreground group-hover:text-foreground flex size-11 items-center justify-center rounded-lg border font-mono text-sm font-semibold transition-colors"
                aria-hidden="true"
              >
                {integration.mark}
              </span>
              <span className="text-muted-foreground group-hover:text-foreground text-center text-xs transition-colors">
                {integration.name}
              </span>
            </div>
          ))}
        </div>

        <div className="border-border mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-5">
          <p className="text-muted-foreground text-sm">
            {visible.length} of {integrations.length} integrations shown · more added every release.
          </p>
          <Button variant="ghost" size="sm">
            Request an integration
            <ArrowRight className="ml-1.5 size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}
