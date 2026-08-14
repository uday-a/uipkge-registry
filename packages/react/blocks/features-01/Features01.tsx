'use client'

import * as React from 'react'
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  Globe,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface FeatureModule {
  id: string
  title: string
  category: 'core' | 'dx' | 'security' | 'ai'
  badge: string
  description: string
  icon: React.ElementType
  metrics: { label: string; value: string; trend: string }[]
  previewType: 'directory' | 'payroll' | 'performance' | 'compliance' | 'api' | 'copilot'
}

const features: FeatureModule[] = [
  {
    id: 'directory',
    title: 'Global Employee Directory',
    category: 'core',
    badge: 'Real-time Sync',
    description:
      'Single source of truth for global teams, reporting hierarchies, custom attributes, and automated SCIM provisioning.',
    icon: Users,
    metrics: [
      { label: 'Sync Latency', value: '<12ms', trend: 'P99 Edge' },
      { label: 'SCIM Connectors', value: '24+', trend: 'Okta/Google' },
      { label: 'Export Formats', value: 'JSON/CSV', trend: 'Bi-directional' },
    ],
    previewType: 'directory',
  },
  {
    id: 'payroll',
    title: 'Multi-Currency Global Payroll',
    category: 'core',
    badge: 'Automated Tax',
    description:
      'Instant payroll calculation across 140+ countries with automated localized tax withholding, statutory benefits, and direct FX routing.',
    icon: Wallet,
    metrics: [
      { label: 'Supported Currencies', value: '140+', trend: 'Live FX' },
      { label: 'Settlement Time', value: 'Instant', trend: 'SEPA/FedNow' },
      { label: 'Tax Accuracy', value: '100%', trend: 'Statutory Verified' },
    ],
    previewType: 'payroll',
  },
  {
    id: 'performance',
    title: 'OKR & Continuous Reviews',
    category: 'dx',
    badge: '360 Calibration',
    description:
      'Transparent objective tracking, real-time 1:1 syncs, and peer review cycles tied directly to engineering and business milestones.',
    icon: BarChart3,
    metrics: [
      { label: 'Cycle Completion', value: '98.4%', trend: '+14% vs avg' },
      { label: 'Review Latency', value: '2.1 days', trend: '-40% faster' },
      { label: 'Goal Alignment', value: '94%', trend: 'Company-wide' },
    ],
    previewType: 'performance',
  },
  {
    id: 'compliance',
    title: 'SOC 2 & Continuous Compliance',
    category: 'security',
    badge: 'Zero Trust',
    description:
      'Continuous automated evidence collection across AWS, GCP, Cloudflare, and GitHub with automated auditor-ready export bundles.',
    icon: ShieldCheck,
    metrics: [
      { label: 'Continuous Tests', value: '142 / 142', trend: '100% Pass' },
      { label: 'Evidence Collection', value: 'Automated', trend: 'Every 5m' },
      { label: 'Standards', value: 'SOC2 / HIPAA', trend: 'ISO 27001' },
    ],
    previewType: 'compliance',
  },
  {
    id: 'api',
    title: 'REST & GraphQL Developer APIs',
    category: 'dx',
    badge: 'Type-Safe SDKs',
    description:
      'Fully typed OpenAPI 3.1 & TypeScript SDKs with sub-millisecond edge response times, webhooks, and granular scoped API keys.',
    icon: Code2,
    metrics: [
      { label: 'API Median Latency', value: '18ms', trend: 'Global Edge' },
      { label: 'Webhook Delivery', value: '99.999%', trend: 'Automatic Retry' },
      { label: 'Rate Limit', value: '10k req/s', trend: 'Configurable' },
    ],
    previewType: 'api',
  },
  {
    id: 'copilot',
    title: 'Autonomous People Ops Copilot',
    category: 'ai',
    badge: 'Agentic AI',
    description:
      'Natural language queries over workforce data, intelligent anomaly detection in compensation bands, and automated policy drafts.',
    icon: Bot,
    metrics: [
      { label: 'Inference Speed', value: '94 tps', trend: 'Claude 3.5' },
      { label: 'Accuracy Score', value: '99.6%', trend: 'RAG Grounded' },
      { label: 'Task Automation', value: '78%', trend: 'Self-serve' },
    ],
    previewType: 'copilot',
  },
]

const initialEmployees = [
  {
    id: '1',
    name: 'Sophia Chen',
    role: 'Staff Design Engineer',
    team: 'Design Systems',
    status: 'Active',
    location: 'San Francisco, CA',
  },
  {
    id: '2',
    name: 'Marcus Vance',
    role: 'Principal Distributed Systems',
    team: 'Core Infrastructure',
    status: 'Active',
    location: 'London, UK',
  },
  {
    id: '3',
    name: 'Elena Rostova',
    role: 'Lead Security Architect',
    team: 'SecOps',
    status: 'In Review',
    location: 'Berlin, DE',
  },
  {
    id: '4',
    name: 'Devon Taylor',
    role: 'Head of Product',
    team: 'Enterprise Suite',
    status: 'Active',
    location: 'New York, NY',
  },
]

const controls = [
  { name: 'TLS 1.3 Strict Transport Security', framework: 'SOC 2 / ISO 27001', passed: true, score: '100%' },
  { name: 'Continuous Automated Evidence Sync', framework: 'HIPAA Security Rule', passed: true, score: '99.8%' },
  { name: 'Hardware Security Keys MFA Enforced', framework: 'Zero Trust Baseline', passed: true, score: '100%' },
  { name: 'Automated Ephemeral DB Credential TTL', framework: 'SOC 2 CC6.1', passed: true, score: '99.4%' },
]

export function Features01() {
  const [activeCategory, setActiveCategory] = React.useState<'all' | 'core' | 'dx' | 'security' | 'ai'>('all')
  const [selectedFeatureId, setSelectedFeatureId] = React.useState('directory')
  const [copied, setCopied] = React.useState(false)

  // Directory state
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedRole, setSelectedRole] = React.useState('All Roles')

  // Payroll state
  const [grossAmount] = React.useState(184000)
  const [payrollTaxRate] = React.useState(18.5)
  const [simulatedEmployeesCount, setSimulatedEmployeesCount] = React.useState(42)

  // Copilot state
  const [copilotPrompt, setCopilotPrompt] = React.useState(
    'Generate quarterly SOC2 compliance audit report with automated PR proof attachments.',
  )
  const [copilotExecuting, setCopilotExecuting] = React.useState(false)
  const [copilotOutput, setCopilotOutput] = React.useState(
    'Audit summary generated. 14 evidence logs compiled across 4 AWS & Cloudflare regions. Zero critical findings.',
  )

  const filteredEmployees = React.useMemo(() => {
    return initialEmployees.filter((emp) => {
      const matchQuery =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase())
      const matchRole = selectedRole === 'All Roles' || emp.team === selectedRole
      return matchQuery && matchRole
    })
  }, [searchQuery, selectedRole])

  const estimatedDeductions = grossAmount * (payrollTaxRate / 100)
  const netPayout = grossAmount - estimatedDeductions

  const filteredFeatures = React.useMemo(() => {
    if (activeCategory === 'all') return features
    return features.filter((f) => f.category === activeCategory)
  }, [activeCategory])

  const activeFeature = features.find((f) => f.id === selectedFeatureId) ?? features[0]

  const triggerCopilot = () => {
    setCopilotExecuting(true)
    setCopilotOutput('Analyzing real-time event bus and compiling cryptographically signed evidence bundle...')
    setTimeout(() => {
      setCopilotOutput(
        '✓ SOC 2 Type II bundle validated. 142 controls verified at 100% adherence. Ready for auditor download.',
      )
      setCopilotExecuting(false)
    }, 900)
  }

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section data-slot="features-01" className="bg-background border-border relative w-full border-y py-16 lg:py-24">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-primary/30 text-primary bg-primary/5 gap-1.5 px-2.5 py-1 font-mono text-xs tracking-wide uppercase"
              >
                <Sparkles className="size-3.5" />
                Unified Architecture
              </Badge>
              <span className="text-muted-foreground font-mono text-xs">v4.2 Enterprise Release</span>
            </div>
            <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              Engineered for High-Velocity Teams.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
              Six modular, composable building blocks that directly interconnect without third-party glue code.
            </p>
          </div>

          {/* Category Filters */}
          <div className="bg-muted/60 border-border flex flex-wrap items-center gap-1.5 rounded-lg border p-1">
            {[
              { id: 'all', label: 'All Modules' },
              { id: 'core', label: 'Core Platform' },
              { id: 'dx', label: 'Developer DX' },
              { id: 'security', label: 'Security' },
              { id: 'ai', label: 'Agentic AI' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                  activeCategory === cat.id
                    ? 'bg-background text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setActiveCategory(cat.id as any)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Interactive Workbench Layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Feature Cards Navigation (5 Cols) */}
          <div className="space-y-3 lg:col-span-5">
            {filteredFeatures.map((item) => {
              const Icon = item.icon
              const isSelected = selectedFeatureId === item.id
              return (
                <div
                  key={item.id}
                  className={cn(
                    'group cursor-pointer rounded-xl border p-4 transition-all duration-150',
                    isSelected
                      ? 'bg-card border-primary/40 ring-primary/20 shadow-xs ring-1'
                      : 'bg-card/40 border-border hover:bg-card/80 hover:border-border/80',
                  )}
                  onClick={() => setSelectedFeatureId(item.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex size-9 items-center justify-center rounded-lg border transition-colors',
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted text-muted-foreground border-border group-hover:text-foreground',
                        )}
                      >
                        <Icon className="size-4.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-foreground text-sm font-semibold tracking-tight">{item.title}</h3>
                          <Badge variant="secondary" className="px-1.5 py-0 text-xs font-normal">
                            {item.badge}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight
                      className={cn(
                        'text-muted-foreground size-4 shrink-0 transition-transform',
                        isSelected ? 'text-primary translate-x-0.5' : 'group-hover:translate-x-0.5',
                      )}
                    />
                  </div>

                  {/* Key metrics row in card */}
                  {isSelected && (
                    <div className="border-border/60 mt-4 grid grid-cols-3 gap-2 border-t pt-3">
                      {item.metrics.map((m) => (
                        <div key={m.label} className="space-y-0.5">
                          <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">{m.label}</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-foreground text-xs font-semibold">{m.value}</span>
                            <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">{m.trend}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Live Interactive Simulation Canvas (7 Cols) */}
          <div className="lg:col-span-7">
            <Card className="bg-card border-border sticky top-6 overflow-hidden shadow-sm">
              {/* Workbench Header Bar */}
              <CardHeader className="border-border bg-muted/20 flex-row items-center justify-between space-y-0 border-b px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-2 animate-pulse rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                    Interactive Simulation
                  </span>
                  <Separator orientation="vertical" className="h-3.5" />
                  <span className="text-foreground text-xs font-semibold">{activeFeature.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1.5 px-2.5 font-mono text-xs"
                    onClick={() => copySnippet(JSON.stringify(activeFeature, null, 2))}
                  >
                    {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    <span>{copied ? 'Copied' : 'Schema JSON'}</span>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 p-6">
                {/* Simulation 1: Global Employee Directory */}
                {activeFeature.previewType === 'directory' && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                      <div className="relative w-full sm:w-64">
                        <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-3.5" />
                        <Input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search 1,420 employees..."
                          className="h-8 pl-8 font-sans text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="text-muted-foreground font-mono text-xs">Filter Team:</span>
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="border-input bg-background text-foreground focus:ring-ring h-8 rounded-md border px-2 py-1 text-xs focus:ring-1 focus:outline-none"
                        >
                          <option value="All Roles">All Teams</option>
                          <option value="Design Systems">Design Systems</option>
                          <option value="Core Infrastructure">Core Infrastructure</option>
                          <option value="SecOps">SecOps</option>
                          <option value="Enterprise Suite">Enterprise Suite</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-border divide-border bg-background divide-y overflow-hidden rounded-lg border">
                      {filteredEmployees.map((emp) => (
                        <div
                          key={emp.id}
                          className="hover:bg-muted/40 flex items-center justify-between p-3 text-xs transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 text-primary border-primary/20 flex size-8 items-center justify-center rounded-full border text-xs font-semibold">
                              {emp.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </div>
                            <div>
                              <p className="text-foreground font-medium">{emp.name}</p>
                              <p className="text-muted-foreground text-xs">
                                {emp.role} · {emp.team}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground hidden font-mono text-xs sm:inline-block">
                              {emp.location}
                            </span>
                            <Badge
                              variant="outline"
                              className="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                            >
                              {emp.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Simulation 2: Multi-Currency Global Payroll */}
                {activeFeature.previewType === 'payroll' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="border-border bg-muted/20 rounded-lg border p-3">
                        <p className="text-muted-foreground font-mono text-xs">Gross Run</p>
                        <p className="text-foreground mt-1 text-lg font-bold">${grossAmount.toLocaleString()}</p>
                      </div>
                      <div className="border-border bg-muted/20 rounded-lg border p-3">
                        <p className="text-muted-foreground font-mono text-xs">Statutory Taxes</p>
                        <p className="mt-1 text-lg font-bold text-rose-600 dark:text-rose-400">
                          -${Math.round(estimatedDeductions).toLocaleString()}
                        </p>
                      </div>
                      <div className="border-border rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                        <p className="font-mono text-xs text-emerald-700 dark:text-emerald-300">Net Settlement</p>
                        <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          ${Math.round(netPayout).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          Adjust Headcount (Employees: {simulatedEmployeesCount})
                        </span>
                        <span className="text-foreground font-mono">
                          ${(grossAmount / simulatedEmployeesCount).toFixed(0)}/mo avg
                        </span>
                      </div>
                      <input
                        value={simulatedEmployeesCount}
                        onChange={(e) => setSimulatedEmployeesCount(Number(e.target.value))}
                        type="range"
                        min="10"
                        max="150"
                        className="bg-muted accent-primary h-1.5 w-full cursor-pointer appearance-none rounded-lg"
                      />
                    </div>

                    <div className="border-border bg-background flex items-center justify-between rounded-lg border p-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Globe className="text-primary size-4" />
                        <span>Cross-border SEPA & FedNow Instant Payout Batch: Ready</span>
                      </div>
                      <Badge variant="secondary" className="font-mono text-xs">
                        Zero-FX Spread
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Simulation 3: SOC 2 & Compliance */}
                {activeFeature.previewType === 'compliance' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground font-semibold">
                        Continuous Automated Compliance Check (142 Controls)
                      </span>
                      <Badge
                        variant="outline"
                        className="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                      >
                        Audit Grade A+
                      </Badge>
                    </div>

                    <div className="space-y-2.5">
                      {controls.map((ctrl) => (
                        <div
                          key={ctrl.name}
                          className="border-border bg-background flex items-center justify-between rounded-lg border p-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                            <div>
                              <p className="text-foreground font-medium">{ctrl.name}</p>
                              <p className="text-muted-foreground font-mono text-xs">{ctrl.framework}</p>
                            </div>
                          </div>
                          <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            {ctrl.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Simulation 4: Developer APIs & SDKs */}
                {activeFeature.previewType === 'api' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-mono text-xs">
                        curl --request POST https://api.uipkge.dev/v1/workforce
                      </span>
                      <Badge variant="secondary" className="font-mono text-xs">
                        TypeScript SDK
                      </Badge>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-100">
                      <span className="text-zinc-500">// Initialize client with zero-latency edge caching</span>
                      <br />
                      <span className="text-purple-400">import</span> {'{'}{' '}
                      <span className="text-yellow-300">UipkgeClient</span> {'}'}{' '}
                      <span className="text-purple-400">from</span>{' '}
                      <span className="text-emerald-400">&apos;@uipkge/sdk&apos;</span>
                      <br />
                      <br />
                      <span className="text-purple-400">const</span> client ={' '}
                      <span className="text-purple-400">new</span> <span className="text-yellow-300">UipkgeClient</span>
                      ({'{'} apiKey: process.env.<span className="text-cyan-300">UIPKGE_KEY</span> {'}'})<br />
                      <br />
                      <span className="text-purple-400">const</span> {'{'} data {'}'} ={' '}
                      <span className="text-purple-400">await</span> client.directory.
                      <span className="text-blue-400">syncOrgChart</span>({'{'}
                      <br />
                      &nbsp;&nbsp;autoProvision: <span className="text-emerald-400">true</span>,<br />
                      &nbsp;&nbsp;enforceMfa: <span className="text-emerald-400">true</span>,<br />
                      &nbsp;&nbsp;scimSyncInterval: <span className="text-amber-300">300</span>,<br />
                      {'}'})
                    </div>
                  </div>
                )}

                {/* Simulation 5: AI Copilot & Agentic Ops */}
                {activeFeature.previewType === 'copilot' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-foreground text-xs font-medium">
                        Natural Language Workforce Assistant
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={copilotPrompt}
                          onChange={(e) => setCopilotPrompt(e.target.value)}
                          className="h-9 text-xs"
                          placeholder="Ask copilot to run calculations or compliance checks..."
                        />
                        <Button
                          size="sm"
                          className="h-9 shrink-0 gap-1.5 px-4 text-xs font-semibold"
                          disabled={copilotExecuting}
                          onClick={triggerCopilot}
                        >
                          {copilotExecuting ? (
                            <RefreshCw className="size-3.5 animate-spin" />
                          ) : (
                            <Bot className="size-3.5" />
                          )}
                          Run
                        </Button>
                      </div>
                    </div>

                    <div className="border-border bg-muted/20 space-y-2 rounded-lg border p-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-mono text-xs">Copilot Real-time Synthesis</span>
                        <Badge variant="outline" className="font-mono text-xs">
                          Claude 3.5 Sonnet
                        </Badge>
                      </div>
                      <p className="text-foreground bg-background border-border rounded-md border p-3 font-mono text-xs leading-relaxed">
                        {copilotOutput}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="border-border bg-muted/10 flex items-center justify-between border-t px-5 py-3 text-xs">
                <span className="text-muted-foreground font-mono">
                  Architecture SLA: 99.99% Multi-region Active-Active
                </span>
                <Button variant="link" size="sm" className="text-primary h-auto gap-1 p-0 text-xs">
                  Explore Full Documentation
                  <ArrowRight className="size-3.5" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
export default Features01
