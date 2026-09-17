'use client'

import * as React from 'react'
import { Check, Copy, CornerDownRight, Globe, Server, ShieldCheck, Terminal, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface ApiDocumentationPageProps {
  className?: string
}

type LanguageKey = 'curl' | 'node' | 'python' | 'go' | 'ruby'
type StatusKey = '200' | '400' | '401'

interface HeaderItem {
  name: string
  type: string
  required: boolean
  sample: string
  description: string
}

const headersList: HeaderItem[] = [
  {
    name: 'Authorization',
    type: 'string',
    required: true,
    sample: 'Bearer uipkge_live_51Msz...',
    description: 'Secret API key prefixed with uipkge_live_ or sk_test_. Pass in the HTTP Authorization header.',
  },
  {
    name: 'Content-Type',
    type: 'string',
    required: true,
    sample: 'application/json',
    description: 'Specifies the media type of the request body. Must be application/json.',
  },
  {
    name: 'Idempotency-Key',
    type: 'string (UUID)',
    required: false,
    sample: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    description: 'Unique client-generated key that prevents duplicate executions if a request is retried.',
  },
]

interface NestedParam {
  name: string
  type: string
  required: boolean
  description: string
  example?: string
}

interface BodyParam {
  name: string
  type: string
  required: boolean
  description: string
  example?: string
  nested?: NestedParam[]
}

const bodyParams: BodyParam[] = [
  {
    name: 'customer_id',
    type: 'string',
    required: true,
    description: 'Unique customer identifier for the subscriber. Must begin with the prefix cus_.',
    example: '"cus_N63vKZbI8O8yWp"',
  },
  {
    name: 'plan_id',
    type: 'string',
    required: true,
    description: 'Identifier of the subscription tier to enroll the customer into.',
    example: '"plan_pro_monthly"',
  },
  {
    name: 'items',
    type: 'array of objects',
    required: true,
    description: 'List of subscription line items defining the base plan and any optional recurring addons.',
    nested: [
      {
        name: 'items[].price_id',
        type: 'string',
        required: true,
        description: 'Unique price object identifier corresponding to a catalog product.',
        example: '"price_1Msz82eZvKYlo2C"',
      },
      {
        name: 'items[].quantity',
        type: 'integer',
        required: false,
        description: 'Unit quantity of the specified price item. Defaults to 1 if omitted.',
        example: '1',
      },
    ],
  },
  {
    name: 'payment_method_id',
    type: 'string',
    required: false,
    description: 'Attached payment method ID (pm_...) to charge. If omitted, uses the customer default payment source.',
    example: '"pm_1OdVq82eZvKYlo2C"',
  },
  {
    name: 'billing_cycle_anchor',
    type: 'integer (timestamp)',
    required: false,
    description: 'Future Unix timestamp that marks the beginning of recurring billing cycles.',
    example: '1717200000',
  },
  {
    name: 'trial_period_days',
    type: 'integer',
    required: false,
    description: 'Number of zero-charge trial days before regular billing begins (1 to 90).',
    example: '14',
  },
  {
    name: 'coupon_code',
    type: 'string',
    required: false,
    description: 'Valid discount or promotional coupon applied to initial invoices.',
    example: '"LAUNCH2026"',
  },
  {
    name: 'metadata',
    type: 'object',
    required: false,
    description: 'Arbitrary key-value map for attribution and custom IDs. Supports up to 50 keys, max 500 chars/value.',
    example: '{"referrer": "onboarding_flow"}',
  },
]

interface ResponseAttr {
  name: string
  type: string
  description: string
  example: string
}

const responseAttributes: ResponseAttr[] = [
  {
    name: 'id',
    type: 'string',
    description: 'Unique identifier for the subscription entity, prefixed with sub_.',
    example: '"sub_1Om48B2eZvKYlo2CqO8k2"',
  },
  {
    name: 'object',
    type: 'string',
    description: 'String representing the object type. Always subscription.',
    example: '"subscription"',
  },
  {
    name: 'customer',
    type: 'string',
    description: 'Customer identifier associated with this subscription record.',
    example: '"cus_N63vKZbI8O8yWp"',
  },
  {
    name: 'status',
    type: 'string',
    description: 'Current lifecycle status: trialing, active, past_due, canceled, unpaid, or incomplete.',
    example: '"trialing"',
  },
  {
    name: 'current_period_start',
    type: 'integer (timestamp)',
    description: 'Unix timestamp marking the start of the current active billing cycle.',
    example: '1717200000',
  },
  {
    name: 'current_period_end',
    type: 'integer (timestamp)',
    description: 'Unix timestamp marking the end of the current cycle and scheduled renewal date.',
    example: '1719792000',
  },
  {
    name: 'trial_end',
    type: 'integer (timestamp) | null',
    description: 'Unix timestamp when the free trial period concludes and billing begins.',
    example: '1718409600',
  },
  {
    name: 'cancel_at_period_end',
    type: 'boolean',
    description: 'If true, the subscription will terminate automatically at the end of the current period.',
    example: 'false',
  },
  {
    name: 'latest_invoice',
    type: 'string',
    description: 'Identifier of the most recent invoice generated for this subscription (in_...).',
    example: '"in_1Om48B2eZvKYlo2Cj891"',
  },
]

interface StatusPill {
  code: StatusKey
  label: string
  summary: string
  dotColor: string
}

const statusPills: StatusPill[] = [
  {
    code: '200',
    label: '200 OK',
    summary: 'Subscription created successfully. Returns full subscription entity.',
    dotColor: 'bg-emerald-500',
  },
  {
    code: '400',
    label: '400 Bad Request',
    summary: 'Missing required parameters or malformed JSON payload.',
    dotColor: 'bg-amber-500',
  },
  {
    code: '401',
    label: '401 Unauthorized',
    summary: 'Missing, expired, or invalid Bearer secret API key.',
    dotColor: 'bg-rose-500',
  },
]

const requestSnippets: Record<LanguageKey, string> = {
  curl: `curl -X POST https://api.acme.com/v1/customers/subscriptions \\
  -H "Authorization: Bearer uipkge_live_51Msz..." \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" \\
  -d '{
    "customer_id": "cus_N63vKZbI8O8yWp",
    "plan_id": "plan_pro_monthly",
    "payment_method_id": "pm_1OdVq82eZvKYlo2C",
    "billing_cycle_anchor": 1717200000,
    "items": [
      {
        "price_id": "price_1Msz82eZvKYlo2C",
        "quantity": 1
      },
      {
        "price_id": "price_addon_seats_pro",
        "quantity": 5
      }
    ],
    "trial_period_days": 14,
    "coupon_code": "LAUNCH2026",
    "metadata": {
      "referrer": "onboarding_flow",
      "account_manager": "priya.raman"
    }
  }'`,
  node: `import Acme from '@acme/sdk'

const acme = new Acme({
  apiKey: process.env.ACME_SECRET_KEY,
})

const subscription = await acme.subscriptions.create({
  customerId: 'cus_N63vKZbI8O8yWp',
  planId: 'plan_pro_monthly',
  paymentMethodId: 'pm_1OdVq82eZvKYlo2C',
  billingCycleAnchor: 1717200000,
  items: [
    { priceId: 'price_1Msz82eZvKYlo2C', quantity: 1 },
    { priceId: 'price_addon_seats_pro', quantity: 5 },
  ],
  trialPeriodDays: 14,
  couponCode: 'LAUNCH2026',
  metadata: {
    referrer: 'onboarding_flow',
    accountManager: 'priya.raman',
  },
}, {
  idempotencyKey: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
})

console.log(subscription.id)`,
  python: `import os
import acme

acme.api_key = os.environ.get("ACME_SECRET_KEY")

subscription = acme.Subscription.create(
    customer_id="cus_N63vKZbI8O8yWp",
    plan_id="plan_pro_monthly",
    payment_method_id="pm_1OdVq82eZvKYlo2C",
    billing_cycle_anchor=1717200000,
    items=[
        {"price_id": "price_1Msz82eZvKYlo2C", "quantity": 1},
        {"price_id": "price_addon_seats_pro", "quantity": 5},
    ],
    trial_period_days=14,
    coupon_code="LAUNCH2026",
    metadata={
        "referrer": "onboarding_flow",
        "account_manager": "priya.raman",
    },
    idempotency_key="9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
)

print(subscription.id)`,
  go: `package main

import (
	"context"
	"fmt"
	"os"

	"github.com/acme/acme-go"
)

func main() {
	client := acme.NewClient(os.Getenv("ACME_SECRET_KEY"))

	params := &acme.SubscriptionCreateParams{
		CustomerID:      acme.String("cus_N63vKZbI8O8yWp"),
		PlanID:          acme.String("plan_pro_monthly"),
		PaymentMethodID: acme.String("pm_1OdVq82eZvKYlo2C"),
		Items: []*acme.SubscriptionItemParams{
			{PriceID: acme.String("price_1Msz82eZvKYlo2C"), Quantity: acme.Int64(1)},
			{PriceID: acme.String("price_addon_seats_pro"), Quantity: acme.Int64(5)},
		},
		TrialPeriodDays: acme.Int64(14),
		CouponCode:      acme.String("LAUNCH2026"),
		Metadata: map[string]string{
			"referrer":        "onboarding_flow",
			"account_manager": "priya.raman",
		},
	}

	sub, err := client.Subscriptions.New(context.Background(), params)
	if err != nil {
		panic(err)
	}

	fmt.Printf("Created subscription: %s\\n", sub.ID)
}`,
  ruby: `require "acme"

Acme.api_key = ENV["ACME_SECRET_KEY"]

subscription = Acme::Subscription.create(
  {
    customer_id: "cus_N63vKZbI8O8yWp",
    plan_id: "plan_pro_monthly",
    payment_method_id: "pm_1OdVq82eZvKYlo2C",
    billing_cycle_anchor: 1717200000,
    items: [
      { price_id: "price_1Msz82eZvKYlo2C", quantity: 1 },
      { price_id: "price_addon_seats_pro", quantity: 5 }
    ],
    trial_period_days: 14,
    coupon_code: "LAUNCH2026",
    metadata: {
      referrer: "onboarding_flow",
      account_manager: "priya.raman"
    }
  },
  { idempotency_key: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" }
)

puts subscription.id`,
}

const responseSnippets: Record<StatusKey, string> = {
  '200': `{
  "id": "sub_1Om48B2eZvKYlo2CqO8k2",
  "object": "subscription",
  "customer": "cus_N63vKZbI8O8yWp",
  "status": "trialing",
  "plan": {
    "id": "plan_pro_monthly",
    "name": "Pro Tier Monthly",
    "amount": 4900,
    "currency": "usd",
    "interval": "month"
  },
  "items": {
    "object": "list",
    "data": [
      {
        "id": "si_98f12a3bc4d5",
        "price": "price_1Msz82eZvKYlo2C",
        "quantity": 1
      },
      {
        "id": "si_98f12a3bc4d6",
        "price": "price_addon_seats_pro",
        "quantity": 5
      }
    ],
    "total_count": 2
  },
  "current_period_start": 1717200000,
  "current_period_end": 1719792000,
  "trial_start": 1717200000,
  "trial_end": 1718409600,
  "cancel_at_period_end": false,
  "latest_invoice": "in_1Om48B2eZvKYlo2Cj891",
  "metadata": {
    "account_manager": "priya.raman",
    "referrer": "onboarding_flow"
  },
  "created_at": 1717200000
}`,
  '400': `{
  "error": {
    "type": "invalid_request_error",
    "code": "parameter_missing",
    "param": "customer_id",
    "message": "Missing required param: customer_id. Please provide a valid customer identifier.",
    "doc_url": "https://api.acme.com/docs/errors#parameter_missing"
  }
}`,
  '401': `{
  "error": {
    "type": "authentication_error",
    "code": "invalid_api_key",
    "message": "Invalid API Key provided: uipkge_live_51Msz... Check your secret key in dashboard.",
    "doc_url": "https://api.acme.com/docs/errors#authentication"
  }
}`,
}

export function ApiDocumentationPage({ className }: ApiDocumentationPageProps) {
  const [selectedLang, setSelectedLang] = React.useState<LanguageKey>('curl')
  const [selectedStatus, setSelectedStatus] = React.useState<StatusKey>('200')
  const [copiedEndpoint, setCopiedEndpoint] = React.useState(false)
  const [copiedRequest, setCopiedRequest] = React.useState(false)
  const [copiedResponse, setCopiedResponse] = React.useState(false)

  const endpointUrl = 'https://api.acme.com/v1/customers/subscriptions'
  const endpointPath = '/v1/customers/subscriptions'

  const copyEndpoint = React.useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(endpointUrl)
      setCopiedEndpoint(true)
      setTimeout(() => {
        setCopiedEndpoint(false)
      }, 2000)
    }
  }, [endpointUrl])

  const copyRequestSnippet = React.useCallback(() => {
    const code = requestSnippets[selectedLang]
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code)
      setCopiedRequest(true)
      setTimeout(() => {
        setCopiedRequest(false)
      }, 2000)
    }
  }, [selectedLang])

  const copyResponseSnippet = React.useCallback(() => {
    const json = responseSnippets[selectedStatus]
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(json)
      setCopiedResponse(true)
      setTimeout(() => {
        setCopiedResponse(false)
      }, 2000)
    }
  }, [selectedStatus])

  return (
    <div
      data-slot="api-documentation-page"
      className={cn(
        'bg-background text-foreground border-border w-full overflow-hidden rounded-xl border shadow-xs',
        className,
      )}
    >
      {/* Top Reference Navigation Bar */}
      <header className="border-border bg-card/60 flex flex-wrap items-center justify-between gap-4 border-b px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
            <Server className="size-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-foreground text-xs font-semibold">Acme Billing API</span>
            <span className="text-muted-foreground text-xs">/</span>
            <span className="text-muted-foreground text-xs">Subscriptions</span>
            <Badge variant="secondary" className="font-mono text-xs font-normal">
              v2026-03-01
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="border-border bg-background/80 flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground font-mono text-xs">Base:</span>
            <span className="font-mono font-medium">https://api.acme.com/v1</span>
          </div>
          <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={copyEndpoint}>
            {copiedEndpoint ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
            {copiedEndpoint ? 'Copied URL' : 'Copy Base URL'}
          </Button>
        </div>
      </header>

      {/* Two-Column Reference Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Main Column: Documentation Prose & Schema Tables (approx 58-60%) */}
        <main className="border-border space-y-8 p-4 sm:p-6 lg:col-span-7 lg:border-r lg:p-8">
          {/* Endpoint Section Header */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                POST
              </span>
              <span className="text-foreground font-mono text-sm font-semibold tracking-tight sm:text-base">
                {endpointPath}
              </span>
            </div>

            <div>
              <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">Create a subscription</h1>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Creates a new recurring subscription contract for an existing customer account. If a default payment
                method is attached, initial recurring invoices are calculated and charged upon trial conclusion or cycle
                anchor date.
              </p>
            </div>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="border-border bg-card text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
                <Zap className="size-3.5 text-amber-500" />
                <span>Idempotent:</span>
                <span className="text-foreground font-medium">Yes (via Idempotency-Key)</span>
              </div>

              <div className="border-border bg-card text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
                <ShieldCheck className="size-3.5 text-emerald-500" />
                <span>Auth:</span>
                <span className="text-foreground font-medium">Bearer Secret Key</span>
              </div>

              <div className="border-border bg-card text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
                <Globe className="text-foreground/70 size-3.5" />
                <span>Rate Limit:</span>
                <span className="text-foreground font-medium">100 req/min</span>
              </div>
            </div>
          </section>

          <Separator />

          {/* Request Headers */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground text-xs font-semibold tracking-wider uppercase">Request Headers</h2>
              <Badge variant="secondary" className="font-mono text-xs font-normal">
                HTTP/1.1 & HTTP/2
              </Badge>
            </div>

            <Card className="border-border overflow-hidden border shadow-none">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="text-xs font-semibold">Header</TableHead>
                      <TableHead className="text-xs font-semibold">Type</TableHead>
                      <TableHead className="text-xs font-semibold">Requirement</TableHead>
                      <TableHead className="text-xs font-semibold">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {headersList.map((header) => (
                      <TableRow key={header.name} className="text-xs">
                        <TableCell className="text-foreground font-mono font-medium">{header.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono text-xs font-normal">
                            {header.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {header.required ? (
                            <Badge className="border-rose-500/20 bg-rose-500/10 text-xs text-rose-600 dark:text-rose-400">
                              REQUIRED
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">optional</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <p>{header.description}</p>
                          <code className="text-foreground/80 mt-1 inline-block font-mono text-xs">
                            Sample: {header.sample}
                          </code>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </section>

          {/* Request Body Parameters */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h2 className="text-foreground text-xs font-semibold tracking-wider uppercase">
                  Request Body Parameters
                </h2>
                <p className="text-muted-foreground text-xs">Provide arguments in a standard JSON payload format.</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs font-normal">
                application/json
              </Badge>
            </div>

            <Card className="border-border overflow-hidden border shadow-none">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="text-xs font-semibold">Parameter</TableHead>
                      <TableHead className="text-xs font-semibold">Type</TableHead>
                      <TableHead className="text-xs font-semibold">Requirement</TableHead>
                      <TableHead className="text-xs font-semibold">Description & Constraints</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bodyParams.map((param) => (
                      <React.Fragment key={param.name}>
                        <TableRow className="text-xs">
                          <TableCell className="text-foreground font-mono font-medium">{param.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-mono text-xs font-normal">
                              {param.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {param.required ? (
                              <Badge className="border-rose-500/20 bg-rose-500/10 text-xs text-rose-600 dark:text-rose-400">
                                REQUIRED
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-xs">optional</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            <p>{param.description}</p>
                            {param.example && (
                              <div className="mt-1">
                                <span className="text-muted-foreground text-xs">Example: </span>
                                <code className="text-foreground font-mono text-xs">{param.example}</code>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>

                        {/* Nested Schema Rows */}
                        {param.nested?.map((child) => (
                          <TableRow key={child.name} className="bg-muted/15 text-xs">
                            <TableCell className="text-foreground pl-6 font-mono text-xs font-medium">
                              <div className="flex items-center gap-1.5">
                                <CornerDownRight className="text-muted-foreground size-3 shrink-0" />
                                <span>{child.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-xs font-normal">
                                {child.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {child.required ? (
                                <Badge className="border-rose-500/20 bg-rose-500/10 text-xs text-rose-600 dark:text-rose-400">
                                  REQUIRED
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground text-xs">optional</span>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              <p>{child.description}</p>
                              {child.example && (
                                <div className="mt-1">
                                  <span className="text-muted-foreground text-xs">Example: </span>
                                  <code className="text-foreground font-mono text-xs">{child.example}</code>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </section>

          {/* Response Schema Attributes */}
          <section className="space-y-3">
            <div className="space-y-0.5">
              <h2 className="text-foreground text-xs font-semibold tracking-wider uppercase">
                Response Object Attributes
              </h2>
              <p className="text-muted-foreground text-xs">
                Properties returned in the 200 OK HTTP JSON payload representation.
              </p>
            </div>

            <Card className="border-border overflow-hidden border shadow-none">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="text-xs font-semibold">Attribute</TableHead>
                      <TableHead className="text-xs font-semibold">Type</TableHead>
                      <TableHead className="text-xs font-semibold">Description</TableHead>
                      <TableHead className="text-xs font-semibold">Sample Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responseAttributes.map((attr) => (
                      <TableRow key={attr.name} className="text-xs">
                        <TableCell className="text-foreground font-mono font-medium">{attr.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono text-xs font-normal">
                            {attr.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{attr.description}</TableCell>
                        <TableCell className="text-foreground/90 font-mono text-xs">{attr.example}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </section>
        </main>

        {/* Right Column: Interactive Code & Response Inspector (approx 40-42%, Dark Slate) */}
        <aside className="bg-muted/20 space-y-6 p-4 sm:p-6 lg:col-span-5">
          <div className="space-y-6 lg:sticky lg:top-6">
            {/* Request Code Card */}
            <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-100 shadow-md">
              {/* Language Selector Tabs Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 bg-neutral-900/90 px-3 py-2">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {(['curl', 'node', 'python', 'go', 'ruby'] as const).map((lang) => {
                    const labels: Record<LanguageKey, string> = {
                      curl: 'cURL',
                      node: 'Node.js',
                      python: 'Python',
                      go: 'Go',
                      ruby: 'Ruby',
                    }
                    const active = selectedLang === lang
                    return (
                      <button
                        key={lang}
                        type="button"
                        className={cn(
                          'rounded-md px-2.5 py-1 font-mono text-xs transition-colors',
                          active
                            ? 'bg-neutral-800 font-semibold text-neutral-100 shadow-xs'
                            : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200',
                        )}
                        onClick={() => setSelectedLang(lang)}
                      >
                        {labels[lang]}
                      </button>
                    )
                  })}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 shrink-0 gap-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
                  onClick={copyRequestSnippet}
                >
                  {copiedRequest ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                  {copiedRequest ? 'Copied' : 'Copy'}
                </Button>
              </div>

              {/* Subheader Bar */}
              <div className="flex items-center justify-between border-b border-neutral-800/60 bg-neutral-950/60 px-4 py-1.5">
                <div className="flex items-center gap-2">
                  <Terminal className="size-3.5 text-neutral-400" />
                  <span className="font-mono text-xs text-neutral-400">Request Example</span>
                </div>
                <span className="font-mono text-xs text-neutral-500 uppercase">{selectedLang}</span>
              </div>

              {/* Code Body */}
              <div className="max-h-[360px] overflow-auto p-4 font-mono text-xs leading-relaxed text-neutral-200">
                <pre className="whitespace-pre">
                  <code>{requestSnippets[selectedLang]}</code>
                </pre>
              </div>
            </div>

            {/* Response Code Card */}
            <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-100 shadow-md">
              {/* Response Status Tabs Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 bg-neutral-900/90 px-3 py-2">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="mr-1 text-xs font-semibold tracking-wider text-neutral-400 uppercase">Response</span>

                  {statusPills.map((pill) => {
                    const active = selectedStatus === pill.code
                    return (
                      <button
                        key={pill.code}
                        type="button"
                        className={cn(
                          'flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs transition-colors',
                          active
                            ? 'bg-neutral-800 font-semibold text-neutral-100 shadow-xs'
                            : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200',
                        )}
                        onClick={() => setSelectedStatus(pill.code)}
                      >
                        <span className={cn('size-2 rounded-full', pill.dotColor)} />
                        <span>{pill.label}</span>
                      </button>
                    )
                  })}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 shrink-0 gap-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
                  onClick={copyResponseSnippet}
                >
                  {copiedResponse ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                  {copiedResponse ? 'Copied' : 'Copy'}
                </Button>
              </div>

              {/* Subheader Status Description */}
              <div className="border-b border-neutral-800/60 bg-neutral-950/60 px-4 py-2 text-xs text-neutral-400">
                <span>{statusPills.find((p) => p.code === selectedStatus)?.summary}</span>
              </div>

              {/* JSON Response Payload */}
              <div className="max-h-[380px] overflow-auto p-4 font-mono text-xs leading-relaxed text-neutral-200">
                <pre className="whitespace-pre">
                  <code>{responseSnippets[selectedStatus]}</code>
                </pre>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
