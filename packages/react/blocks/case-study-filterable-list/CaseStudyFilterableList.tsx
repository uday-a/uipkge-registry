'use client'

import { Fragment, useMemo, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const studies = [
  {
    company: 'Northwind Logistics',
    industry: 'Logistics',
    result: '5 days off the monthly close',
    stack: 'Snowflake · dbt · Okta',
    readTime: '8 min',
  },
  {
    company: 'Halden Health',
    industry: 'Healthcare',
    result: '71% fewer ad-hoc data requests',
    stack: 'BigQuery · Airflow',
    readTime: '6 min',
  },
  {
    company: 'Verity Retail Group',
    industry: 'Retail',
    result: '2.4pp tighter forecast band',
    stack: 'Redshift · dbt',
    readTime: '7 min',
  },
  {
    company: 'Calder Manufacturing',
    industry: 'Manufacturing',
    result: '11 spreadsheets retired',
    stack: 'Postgres · Dagster',
    readTime: '5 min',
  },
  {
    company: 'Ridgeway Freight',
    industry: 'Logistics',
    result: 'Per-shipment landed cost',
    stack: 'Snowflake · Fivetran',
    readTime: '9 min',
  },
  {
    company: 'Ashford Clinics',
    industry: 'Healthcare',
    result: 'PHI-scoped self-serve reporting',
    stack: 'BigQuery · Entra ID',
    readTime: '6 min',
  },
]

const ALL = 'All'
const industries = [ALL, ...new Set(studies.map((study) => study.industry))]

export function CaseStudyFilterableList() {
  const [active, setActive] = useState(ALL)
  const visible = useMemo(
    () => (active === ALL ? studies : studies.filter((study) => study.industry === active)),
    [active],
  )

  return (
    <section data-slot="case-study-filterable-list" className="bg-background">
      <div className="mx-auto max-w-4xl px-6 py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Badge variant="secondary">Customer stories</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Read one close to your own</h2>
          </div>

          <ToggleGroup
            value={active}
            type="single"
            variant="outline"
            size="sm"
            className="flex-nowrap overflow-x-auto"
            aria-label="Filter case studies by industry"
            // Single-select emits '' when the pressed chip is pressed again;
            // fall back to ALL so the list is never empty by accident.
            onValueChange={(value: string) => setActive(value || ALL)}
          >
            {industries.map((industry) => (
              <ToggleGroupItem key={industry} value={industry}>
                {industry}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <Card className="mt-8">
          <CardContent className="p-2">
            {!visible.length ? (
              <div className="px-4 py-16 text-center">
                <p className="text-sm font-medium">No stories in that industry yet.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setActive(ALL)}>
                  Show all
                </Button>
              </div>
            ) : (
              <ul>
                {visible.map((study, index) => (
                  <Fragment key={study.company}>
                    <li>
                      <a
                        href="#"
                        className="hover:bg-muted focus-visible:ring-ring group flex items-center gap-4 rounded-lg p-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold">{study.company}</p>
                            <Badge variant="outline">{study.industry}</Badge>
                          </div>
                          <p className="mt-1 text-sm">{study.result}</p>
                          <p className="text-muted-foreground mt-1 font-mono text-xs">{study.stack}</p>
                        </div>
                        <span className="text-muted-foreground shrink-0 text-xs">{study.readTime}</span>
                        <ArrowUpRight
                          className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                    {index < visible.length - 1 && <Separator />}
                  </Fragment>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
