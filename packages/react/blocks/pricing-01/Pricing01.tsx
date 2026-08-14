'use client'

import * as React from 'react'
import { ArrowRight, Check, ChevronDown, ChevronUp, ShieldCheck, Sparkles, Users, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

type BillingCycle = 'monthly' | 'yearly'
type Currency = 'USD' | 'EUR' | 'GBP'

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
}

const currencyRates: Record<Currency, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
}

const comparisonMatrix = [
  {
    category: 'Platform & Compute Core',
    features: [
      { name: 'Active Team Members', starter: 'Up to 10', team: 'Unlimited', enterprise: 'Unlimited + Org Units' },
      { name: 'Monthly API Requests', starter: '100,000 / mo', team: '2,500,000 / mo', enterprise: 'Custom Unlimited' },
      { name: 'Workflow Automations', starter: '10 active', team: '100 active', enterprise: 'Unlimited real-time' },
      { name: 'Data Retention History', starter: '30 days', team: '365 days', enterprise: '7 years immutable' },
    ],
  },
  {
    category: 'Security & Enterprise Governance',
    features: [
      {
        name: 'SOC 2 Type II & ISO 27001',
        starter: 'Standard',
        team: 'Included',
        enterprise: 'Included + Auditor Portal',
      },
      { name: 'SAML SSO & SCIM Provisioning', starter: '—', team: 'Google / Okta', enterprise: 'Custom IdP + SCIM v2' },
      {
        name: 'Role-Based Access (RBAC)',
        starter: '3 predefined roles',
        team: 'Granular permissions',
        enterprise: 'Custom policy engine',
      },
      {
        name: 'Immutable Audit Trail Logs',
        starter: '—',
        team: '90 days exportable',
        enterprise: 'Real-time SIEM streaming',
      },
    ],
  },
  {
    category: 'Support & Success SLAs',
    features: [
      {
        name: 'Support Channel',
        starter: 'Community & Email',
        team: 'Priority Email + Chat',
        enterprise: 'Dedicated Private Slack',
      },
      {
        name: 'First-Response SLA',
        starter: '24 business hours',
        team: '4 business hours',
        enterprise: '< 15 mins (24/7/365)',
      },
      { name: 'Uptime SLA Guarantee', starter: '99.9%', team: '99.95%', enterprise: '99.99% financially backed' },
      { name: 'Dedicated Solutions Architect', starter: '—', team: '—', enterprise: 'Assigned Principal Engineer' },
    ],
  },
]

export function Pricing01({ className }: { className?: string }) {
  const [billingCycle, setBillingCycle] = React.useState<BillingCycle>('yearly')
  const [currency, setCurrency] = React.useState<Currency>('USD')
  const [teamSeats, setTeamSeats] = React.useState<number[]>([12])
  const [addDedicatedSla, setAddDedicatedSla] = React.useState(false)
  const [addAuditVault, setAddAuditVault] = React.useState(false)
  const [showComparisonTable, setShowComparisonTable] = React.useState(false)

  const rates = currencyRates[currency]
  const sym = currencySymbols[currency]

  const starterBase = billingCycle === 'yearly' ? 12 : 15
  const teamBase = billingCycle === 'yearly' ? 28 : 35
  const enterpriseBase = billingCycle === 'yearly' ? 68 : 85

  const slaCost = addDedicatedSla ? 99 : 0
  const vaultCost = addAuditVault ? 49 : 0

  const currentSeats = teamSeats[0] || 1

  const starterMonthlyTotal = Math.round((starterBase * currentSeats + (addAuditVault ? 29 : 0)) * rates)
  const teamMonthlyTotal = Math.round((teamBase * currentSeats + slaCost + vaultCost) * rates)
  const enterpriseMonthlyTotal = Math.round((enterpriseBase * currentSeats + slaCost + vaultCost) * rates)

  const annualSavingsTeam = Math.round((35 * currentSeats * 12 - 28 * currentSeats * 12) * rates)

  return (
    <section data-slot="pricing-01" className={cn('bg-background w-full py-16 sm:py-24', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <div className="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium shadow-2xs">
            <Sparkles className="size-3.5" />
            <span>Predictable Enterprise Pricing</span>
          </div>
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Scale effortlessly without seat tax surprises
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Zero setup fees, transparent volume discounts, and instant self-serve provisioning. Switch or cancel plans
            anytime.
          </p>

          {/* Billing Cycle & Currency Switcher Toolbar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 pt-2">
            {/* Monthly vs Yearly */}
            <div className="border-border bg-card inline-flex rounded-lg border p-1 shadow-2xs">
              <ToggleGroup
                type="single"
                value={billingCycle}
                onValueChange={(v) => v && setBillingCycle(v as BillingCycle)}
              >
                <ToggleGroupItem value="monthly" className="px-3.5 py-1.5 text-xs font-medium">
                  Monthly
                </ToggleGroupItem>
                <ToggleGroupItem value="yearly" className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium">
                  <span>Annual</span>
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 px-1.5 py-0 text-xs"
                  >
                    Save 20%
                  </Badge>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Currency Selector */}
            <div className="border-border bg-card inline-flex rounded-lg border p-1 shadow-2xs">
              <ToggleGroup type="single" value={currency} onValueChange={(v) => v && setCurrency(v as Currency)}>
                <ToggleGroupItem value="USD" className="px-2.5 py-1 font-mono text-xs font-medium">
                  USD ($)
                </ToggleGroupItem>
                <ToggleGroupItem value="EUR" className="px-2.5 py-1 font-mono text-xs font-medium">
                  EUR (€)
                </ToggleGroupItem>
                <ToggleGroupItem value="GBP" className="px-2.5 py-1 font-mono text-xs font-medium">
                  GBP (£)
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {/* Interactive Team Seat Simulator Bar */}
          <div className="border-border bg-card/60 mx-auto mt-6 max-w-xl rounded-xl border p-4 shadow-2xs backdrop-blur-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="text-foreground flex items-center gap-2 font-medium">
                <Users className="text-primary size-4" />
                <span>Simulate Team Size:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-muted text-foreground rounded px-2 py-0.5 font-mono text-xs font-semibold">
                  {currentSeats} {currentSeats === 1 ? 'seat' : 'seats'}
                </span>
                {billingCycle === 'yearly' && annualSavingsTeam > 0 && (
                  <span className="text-success text-xs font-medium">
                    (Saves ~{sym}
                    {annualSavingsTeam.toLocaleString()}/yr on Team plan)
                  </span>
                )}
              </div>
            </div>
            <div className="mt-3">
              <Slider
                value={teamSeats}
                onValueChange={setTeamSeats}
                min={1}
                max={50}
                step={1}
                className="cursor-pointer"
              />
            </div>
            <div className="text-muted-foreground mt-2 flex justify-between font-mono text-xs">
              <span>1 seat</span>
              <span>25 seats</span>
              <span>50+ seats</span>
            </div>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-stretch">
          {/* Tier 1: Starter */}
          <Card className="border-border bg-card hover:border-primary/40 relative flex flex-col justify-between shadow-xs transition-all duration-200 hover:shadow-md">
            <div>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-xs">
                    Bootstrap & Indie
                  </Badge>
                </div>
                <CardTitle className="text-foreground text-xl font-bold tracking-tight">Starter Studio</CardTitle>
                <CardDescription className="text-muted-foreground text-xs">
                  For agile squads and early-stage product teams validating core workflows.
                </CardDescription>

                <div className="mt-6 space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-foreground text-4xl font-bold tracking-tight">
                      {sym}
                      {Math.round(starterBase * rates)}
                    </span>
                    <span className="text-muted-foreground text-xs font-medium">/ seat / month</span>
                  </div>
                  <div className="text-muted-foreground font-mono text-xs">
                    Est. {sym}
                    {starterMonthlyTotal.toLocaleString()}/mo for {currentSeats} {currentSeats === 1 ? 'seat' : 'seats'}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                <Separator />
                <div className="space-y-2.5">
                  <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Included features
                  </p>
                  <ul className="text-foreground space-y-2.5 text-xs">
                    <li className="flex items-start gap-2">
                      <Check className="text-success mt-0.5 size-4 shrink-0" />
                      <span>Up to 10 team seats & unlimited guests</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-success mt-0.5 size-4 shrink-0" />
                      <span>100,000 monthly API event calls</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-success mt-0.5 size-4 shrink-0" />
                      <span>30-day continuous audit & revision history</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-success mt-0.5 size-4 shrink-0" />
                      <span>Standard Community & Email support (24h)</span>
                    </li>
                    <li className="text-muted-foreground flex items-start gap-2">
                      <Check className="text-muted-foreground/50 mt-0.5 size-4 shrink-0" />
                      <span>Community Discord access & quickstarts</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </div>

            <CardFooter className="border-border mt-auto border-t pt-4">
              <Button variant="outline" className="h-10 w-full gap-1.5 text-xs font-semibold">
                <span>Start Free 14-Day Trial</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </CardFooter>
          </Card>

          {/* Tier 2: Team Pro (Highlighted Flagship) */}
          <Card className="border-primary bg-card ring-primary/20 relative flex flex-col justify-between shadow-lg ring-2 transition-all duration-200 hover:shadow-xl lg:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground gap-1.5 px-3 py-0.5 text-xs font-semibold shadow-sm">
                <Zap className="size-3 fill-current" />
                <span>Most Popular Choice</span>
              </Badge>
            </div>

            <div>
              <CardHeader className="pt-7 pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-mono text-xs">
                    Scale & High-Growth
                  </Badge>
                </div>
                <CardTitle className="text-foreground text-2xl font-bold tracking-tight">Team Scale</CardTitle>
                <CardDescription className="text-muted-foreground text-xs">
                  For fast-scaling engineering and product organizations requiring deep automation.
                </CardDescription>

                <div className="mt-6 space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-foreground text-4xl font-bold tracking-tight">
                      {sym}
                      {Math.round(teamBase * rates)}
                    </span>
                    <span className="text-muted-foreground text-xs font-medium">/ seat / month</span>
                  </div>
                  <div className="text-primary font-mono text-xs font-medium">
                    Est. {sym}
                    {teamMonthlyTotal.toLocaleString()}/mo for {currentSeats} {currentSeats === 1 ? 'seat' : 'seats'}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                <Separator />
                <div className="space-y-2.5">
                  <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Everything in Starter, plus
                  </p>
                  <ul className="text-foreground space-y-2.5 text-xs">
                    <li className="flex items-start gap-2">
                      <Check className="text-success mt-0.5 size-4 shrink-0" />
                      <span className="font-medium">Unlimited team seats & custom workspace roles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-success mt-0.5 size-4 shrink-0" />
                      <span>2.5M monthly API calls & priority queue</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-success mt-0.5 size-4 shrink-0" />
                      <span>Google & Okta SAML SSO integration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-success mt-0.5 size-4 shrink-0" />
                      <span>365-day immutable compliance logs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-success mt-0.5 size-4 shrink-0" />
                      <span>Priority ticketing with 4h guaranteed SLA</span>
                    </li>
                  </ul>
                </div>

                {/* Addons Selector for Team */}
                <div className="border-border bg-muted/30 space-y-2.5 rounded-lg border p-3">
                  <p className="text-foreground text-xs font-semibold">Optional Power Add-ons</p>
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="react-sla-addon" className="text-muted-foreground cursor-pointer">
                      24/7 Dedicated SLA (+{sym}
                      {Math.round(99 * rates)}/mo)
                    </label>
                    <Switch id="react-sla-addon" checked={addDedicatedSla} onCheckedChange={setAddDedicatedSla} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="react-vault-addon" className="text-muted-foreground cursor-pointer">
                      SOC 2 Vault Streaming (+{sym}
                      {Math.round(49 * rates)}/mo)
                    </label>
                    <Switch id="react-vault-addon" checked={addAuditVault} onCheckedChange={setAddAuditVault} />
                  </div>
                </div>
              </CardContent>
            </div>

            <CardFooter className="border-border mt-auto border-t pt-4">
              <Button className="h-10 w-full gap-1.5 text-xs font-semibold shadow-sm">
                <span>Deploy Team Workspace</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </CardFooter>
          </Card>

          {/* Tier 3: Enterprise Platform */}
          <Card className="border-border bg-card hover:border-primary/40 relative flex flex-col justify-between shadow-xs transition-all duration-200 hover:shadow-md">
            <div>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-xs">
                    Enterprise & Security
                  </Badge>
                </div>
                <CardTitle className="text-foreground text-xl font-bold tracking-tight">Enterprise Suite</CardTitle>
                <CardDescription className="text-muted-foreground text-xs">
                  Dedicated infrastructure, custom security controls, and bespoke compliance SLAs.
                </CardDescription>

                <div className="mt-6 space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-foreground text-4xl font-bold tracking-tight">
                      {sym}
                      {Math.round(enterpriseBase * rates)}
                    </span>
                    <span className="text-muted-foreground text-xs font-medium">/ seat / month</span>
                  </div>
                  <div className="text-muted-foreground font-mono text-xs">
                    Custom volume licensing available for 100+ seats
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                <Separator />
                <div className="space-y-2.5">
                  <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Everything in Team, plus
                  </p>
                  <ul className="text-foreground space-y-2.5 text-xs">
                    <li className="flex items-start gap-2">
                      <Check className="text-success mt-0.5 size-4 shrink-0" />
                      <span>Custom SCIM v2 user provisioning & directory sync</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-success mt-0.5 size-4 shrink-0" />
                      <span>Dedicated VPC peering & custom data residency</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-success mt-0.5 size-4 shrink-0" />
                      <span>99.99% uptime SLA with financial penalty backing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-success mt-0.5 size-4 shrink-0" />
                      <span>Assigned Principal Solutions Engineer & private Slack</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="text-success mt-0.5 size-4 shrink-0" />
                      <span>Custom Master Service Agreement (MSA) & DPA</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </div>

            <CardFooter className="border-border mt-auto border-t pt-4">
              <Button variant="outline" className="h-10 w-full gap-1.5 text-xs font-semibold">
                <ShieldCheck className="text-primary size-3.5" />
                <span>Contact Solutions Team</span>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Collapsible Feature Matrix Trigger */}
        <div className="mt-12 text-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-foreground hover:bg-muted gap-2 text-xs font-semibold"
            onClick={() => setShowComparisonTable(!showComparisonTable)}
          >
            <span>
              {showComparisonTable ? 'Hide Detailed Feature Comparison' : 'Compare All Features & Enterprise Limits'}
            </span>
            {showComparisonTable ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </Button>
        </div>

        {/* Feature Comparison Matrix Table */}
        {showComparisonTable && (
          <div className="border-border bg-card mt-8 overflow-hidden rounded-xl border shadow-xs">
            <div className="border-border bg-muted/20 flex flex-wrap items-center justify-between gap-4 border-b p-4 sm:p-6">
              <div>
                <h3 className="text-foreground text-base font-bold">Detailed Specification & Limits</h3>
                <p className="text-muted-foreground text-xs">Comprehensive side-by-side breakdown across every tier.</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                All plans include SSL & automated backups
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="text-foreground w-[34%] text-xs font-semibold">Capabilities</TableHead>
                    <TableHead className="text-foreground w-[22%] text-xs font-semibold">Starter Studio</TableHead>
                    <TableHead className="text-primary w-[22%] text-xs font-bold font-semibold">Team Scale</TableHead>
                    <TableHead className="text-foreground w-[22%] text-xs font-semibold">Enterprise Suite</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonMatrix.map((group, idx) => (
                    <React.Fragment key={idx}>
                      <TableRow className="bg-muted/60 text-muted-foreground text-xs font-semibold">
                        <TableCell colSpan={4} className="py-2.5 font-mono text-xs tracking-wider uppercase">
                          {group.category}
                        </TableCell>
                      </TableRow>
                      {group.features.map((feat, fIdx) => (
                        <TableRow key={fIdx} className="text-xs">
                          <TableCell className="text-foreground py-3 font-medium">{feat.name}</TableCell>
                          <TableCell className="text-muted-foreground py-3">{feat.starter}</TableCell>
                          <TableCell className="text-foreground bg-primary/5 py-3 font-medium">{feat.team}</TableCell>
                          <TableCell className="text-foreground py-3">{feat.enterprise}</TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
