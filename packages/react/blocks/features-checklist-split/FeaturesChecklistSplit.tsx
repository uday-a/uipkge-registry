'use client'

import { ArrowRight, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

// Every line pairs a capability with a factual qualifier rather than an
// adjective — the qualifier is what a buyer actually checks.
const capabilities = [
  { label: 'Versioned metric definitions', detail: 'Git-backed, reviewable' },
  { label: 'Row-level access control', detail: 'Evaluated per query' },
  { label: 'Warehouse pass-through', detail: 'No data copied out' },
  { label: 'Scheduled materialisation', detail: 'Per-metric freshness' },
  { label: 'SCIM + SAML provisioning', detail: 'Okta, Entra, Google' },
  { label: 'Audit log export', detail: 'Generated from history' },
  { label: 'Cost ceilings per team', detail: 'Enforced at query time' },
  { label: 'Embedded dashboards', detail: 'Signed URLs, scoped' },
  { label: 'Period locking', detail: 'Restatements tracked' },
  { label: 'Alerting on drift', detail: 'Threshold or anomaly' },
]

export function FeaturesChecklistSplit() {
  return (
    <section data-slot="features-checklist-split" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          {/* Sticky pitch: stays put while the longer checklist scrolls past. */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Badge variant="secondary">Capabilities</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Everything the reporting layer needs, nothing it doesn’t
            </h2>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              No add-on tiers and no feature gates between plans. The list on the right is the product.
            </p>
            <Button className="mt-6">
              Compare plans
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Button>
          </div>

          <div>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <li key={capability.label} className="py-3">
                  <div className="flex items-start gap-3">
                    <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{capability.label}</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">{capability.detail}</p>
                    </div>
                  </div>
                  <Separator className="mt-3" />
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground mt-6 text-xs">
              Every capability is available on every plan. Limits differ, features do not.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
