'use client'

import * as React from 'react'
import {
  ArrowRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Globe,
  Headphones,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export interface Contact01Props {
  onSubmit?: (payload: {
    type: string
    name: string
    email: string
    company: string
    teamSize: string
    message: string
    ticketId: string
  }) => void
}

interface InquiryType {
  id: string
  title: string
  subtitle: string
  sla: string
  icon: React.ElementType
}

const inquiryTypes: InquiryType[] = [
  {
    id: 'enterprise',
    title: 'Enterprise Architecture',
    subtitle: 'Custom registries, zero-lockin migrations & multi-team governance',
    sla: '< 2h SLA',
    icon: Building2,
  },
  {
    id: 'support',
    title: 'Dedicated Engineering SLA',
    subtitle: '24/7 incident response, custom upstream bugfixes & private Slack channel',
    sla: '< 15m SLA',
    icon: Headphones,
  },
  {
    id: 'security',
    title: 'Security & Compliance Review',
    subtitle: 'SOC2 Type II audits, self-hosted registry mirrors & air-gapped deployments',
    sla: '< 4h SLA',
    icon: ShieldCheck,
  },
]

const globalHubs = [
  { city: 'San Francisco', tz: 'PST (UTC-8)', status: 'Active (09:00 - 18:00)', email: 'sf@uipkge.dev' },
  { city: 'London', tz: 'GMT (UTC+0)', status: 'Active (08:30 - 17:30)', email: 'london@uipkge.dev' },
  { city: 'Singapore', tz: 'SGT (UTC+8)', status: 'Active (09:00 - 18:00)', email: 'singapore@uipkge.dev' },
]

export function Contact01({ onSubmit }: Contact01Props) {
  const [selectedType, setSelectedType] = React.useState('enterprise')
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [company, setCompany] = React.useState('')
  const [teamSize, setTeamSize] = React.useState('10-50')
  const [message, setMessage] = React.useState('')
  const [sent, setSent] = React.useState(false)
  const [ticketId, setTicketId] = React.useState('')
  const [copiedTicket, setCopiedTicket] = React.useState(false)

  const canSubmit = name.trim() && email.trim() && message.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    const generatedId = `UIP-${Math.floor(1000 + Math.random() * 9000)}`
    setTicketId(generatedId)

    onSubmit?.({
      type: selectedType,
      name,
      email,
      company,
      teamSize,
      message,
      ticketId: generatedId,
    })
    setSent(true)
  }

  const copyTicket = () => {
    navigator.clipboard.writeText(ticketId)
    setCopiedTicket(true)
    setTimeout(() => setCopiedTicket(false), 2000)
  }

  return (
    <section data-slot="contact-01" className="bg-background relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
            <Sparkles className="text-primary size-3.5" />
            Enterprise Engineering & Architecture Solutions
          </Badge>
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Talk to a principal design engineer.
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            No generic sales reps. Connect directly with the core team that architects our dual-framework registry,
            token engines, and headless workbenches.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left Column: Inquiry Routing & Global Hubs (5 Cols) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="space-y-3">
              <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                Select Engagement Track
              </p>
              <div className="space-y-2.5">
                {inquiryTypes.map((track) => {
                  const Icon = track.icon
                  const isSelected = selectedType === track.id
                  return (
                    <div
                      key={track.id}
                      className={cn(
                        'group cursor-pointer rounded-xl border p-4 transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5 ring-primary/20 shadow-xs ring-1'
                          : 'border-border bg-card hover:bg-muted/40',
                      )}
                      onClick={() => setSelectedType(track.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={cn(
                              'rounded-lg p-2 transition-colors',
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground group-hover:bg-primary/10 group-hover:text-primary',
                            )}
                          >
                            <Icon className="size-4" />
                          </div>
                          <span className="text-foreground text-xs font-semibold">{track.title}</span>
                        </div>
                        <Badge variant="outline" className="bg-background font-mono text-xs">
                          {track.sla}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mt-2 pl-9 text-xs">{track.subtitle}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <Separator />

            {/* Global Timezone & Architecture Hubs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                  Direct Engineering Hubs
                </p>
                <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-600 dark:text-emerald-400">
                  <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                  Live Dispatch Active
                </div>
              </div>

              <div className="space-y-2">
                {globalHubs.map((hub) => (
                  <div
                    key={hub.city}
                    className="border-border bg-card/60 flex items-center justify-between rounded-lg border p-3 text-xs shadow-xs"
                  >
                    <div>
                      <p className="text-foreground font-medium">{hub.city}</p>
                      <p className="text-muted-foreground font-mono text-xs">
                        {hub.tz} &bull; {hub.status}
                      </p>
                    </div>
                    <a href={`mailto:${hub.email}`} className="text-primary font-mono text-xs hover:underline">
                      {hub.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Dispatch Form (7 Cols) */}
          <div className="lg:col-span-7">
            <Card className="border-border bg-card overflow-hidden shadow-sm">
              <CardHeader className="border-border/60 bg-muted/20 border-b pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <MessageSquare className="text-primary size-4" />
                    Dispatch Engineering Request
                  </CardTitle>
                  <Badge variant="secondary" className="font-mono text-xs">
                    Direct Dispatch: {selectedType}
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Provide architectural specifications or questions. Our engineering team responds within guaranteed
                  SLA.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                {!sent ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="contact-name-react" className="text-xs font-medium">
                          Your Name
                        </Label>
                        <Input
                          id="contact-name-react"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Jane Doe"
                          required
                          className="h-9 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="contact-email-react" className="text-xs font-medium">
                          Work Email
                        </Label>
                        <Input
                          id="contact-email-react"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="jane@company.com"
                          required
                          className="h-9 font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="contact-company-react" className="text-xs font-medium">
                          Company / Organization
                        </Label>
                        <Input
                          id="contact-company-react"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Acme Corp"
                          className="h-9 text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Engineering Team Size</Label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {['1-10', '10-50', '50+'].map((ts) => (
                            <button
                              key={ts}
                              type="button"
                              className={cn(
                                'rounded-md border px-2 py-1.5 text-center font-mono text-xs transition-all',
                                teamSize === ts
                                  ? 'border-primary bg-primary/10 text-primary font-semibold'
                                  : 'border-border bg-background text-muted-foreground hover:text-foreground',
                              )}
                              onClick={() => setTeamSize(ts)}
                            >
                              {ts}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact-message-react" className="text-xs font-medium">
                        Project Scope & Technical Details
                      </Label>
                      <Textarea
                        id="contact-message-react"
                        value={message}
                        onValueChange={(v) => setMessage(v)}
                        rows={4}
                        placeholder="Describe your tech stack (Vue 3, Nuxt 3, React 19, Next.js), design token requirements, and deployment targets..."
                        required
                        className="resize-none text-xs"
                      />
                    </div>

                    <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <ShieldCheck className="size-4 text-emerald-500" />
                        <span>NDA & IP protection pre-guaranteed.</span>
                      </div>

                      <Button
                        type="submit"
                        disabled={!canSubmit}
                        className="h-9 w-full gap-1.5 px-5 text-xs font-semibold sm:w-auto"
                      >
                        <span>Dispatch Inquiry</span>
                        <Send className="size-3.5" />
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-5 px-4 py-8 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                      <Check className="size-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-foreground text-base font-bold">Inquiry Dispatched Successfully</p>
                      <p className="text-muted-foreground mx-auto max-w-sm text-xs">
                        A principal solutions architect has been assigned. You will receive a technical response at{' '}
                        <strong className="text-foreground font-mono">{email}</strong> within guaranteed SLA.
                      </p>
                    </div>

                    <div className="border-border bg-muted/40 mx-auto flex max-w-xs items-center justify-between rounded-lg border p-3">
                      <div className="text-left">
                        <p className="text-muted-foreground font-mono text-xs uppercase">Reference Ticket ID</p>
                        <p className="text-foreground font-mono text-xs font-bold">{ticketId}</p>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 gap-1 font-mono text-xs" onClick={copyTicket}>
                        {copiedTicket ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                        <span>{copiedTicket ? 'Copied' : 'Copy'}</span>
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground text-xs"
                      onClick={() => setSent(false)}
                    >
                      Send Another Inquiry
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
export default Contact01
