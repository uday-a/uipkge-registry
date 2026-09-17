'use client'

import { ArrowUpRight, FileText, KeyRound, Lock, ScrollText, ServerCog, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const programmes = [
  {
    name: 'SOC 2 Type II',
    scope: 'Security, availability, confidentiality',
    audited: 'Mar 2026',
    body: 'Prescient Assurance',
  },
  { name: 'ISO 27001', scope: 'Information security management', audited: 'Jan 2026', body: 'BSI Group' },
  { name: 'HIPAA', scope: 'PHI handling, BAA available', audited: 'Nov 2025', body: 'Third-party assessed' },
  { name: 'GDPR', scope: 'EU data protection, DPA available', audited: 'Ongoing', body: 'Self-attested' },
]

// Stated as mechanisms, not reassurance: each line is something a reviewer can
// verify rather than a claim about intent.
const controls = [
  { icon: Lock, label: 'Read-only warehouse access', detail: 'No write grant is ever requested.' },
  { icon: KeyRound, label: 'Customer-managed keys', detail: 'Rotation handled through your KMS.' },
  { icon: Users, label: 'SCIM deprovisioning', detail: 'Access ends with the directory record.' },
  { icon: ScrollText, label: 'Immutable audit log', detail: 'Append-only, exportable, 7-year retention.' },
  { icon: ServerCog, label: 'Regional isolation', detail: 'EU, US, and AU estates do not share planes.' },
  { icon: FileText, label: 'Published subprocessors', detail: 'Change notice 30 days before it takes effect.' },
]

export function SecurityTrustCenterGrid() {
  return (
    <section data-slot="security-trust-center-grid" className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Badge variant="secondary">Trust</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">What we can show you, with dates</h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Reports are available under NDA. Everything below names who audited it and when.
            </p>
          </div>
          <Button variant="outline">Open the trust centre</Button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {programmes.map((programme) => (
            <Card key={programme.name} className="group">
              <CardContent className="flex h-full flex-col p-5">
                <p className="text-sm font-semibold">{programme.name}</p>
                <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{programme.scope}</p>
                <Separator className="my-4" />
                <dl className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Audited</dt>
                    <dd className="font-medium">{programme.audited}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">By</dt>
                    <dd className="truncate font-medium">{programme.body}</dd>
                  </div>
                </dl>
                <Button variant="ghost" size="sm" className="mt-auto justify-start px-0 pt-4 text-xs">
                  Request report
                  <ArrowUpRight
                    className="ml-1 size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-10" />

        <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {controls.map((control) => (
            <li key={control.label} className="flex gap-3">
              <control.icon className="text-muted-foreground mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm font-medium">{control.label}</p>
                <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">{control.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
