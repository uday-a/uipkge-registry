'use client'

import * as React from 'react'
import { ArrowRight, Check, CheckCircle2, Copy, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Role = 'frontend' | 'architect' | 'founder'

interface RoleOption {
  id: Role
  label: string
  perk: string
}

const roleOptions: RoleOption[] = [
  { id: 'frontend', label: 'Frontend / UI Engineer', perk: 'Direct access to raw SFC / TSX templates & Figma tokens' },
  { id: 'architect', label: 'Solutions Architect', perk: 'Full unbundled AST registry spec & self-hosting blueprints' },
  { id: 'founder', label: 'Founder / CTO', perk: 'Zero runtime dependency compliance & white-label enterprise SLA' },
]

export interface HeroWaitlistGlowProps {
  className?: string
}

export function HeroWaitlistGlow({ className }: HeroWaitlistGlowProps) {
  const [selectedRole, setSelectedRole] = React.useState<Role>('frontend')
  const [email, setEmail] = React.useState('')
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [queueNumber, setQueueNumber] = React.useState<number | null>(null)
  const [referralCopied, setReferralCopied] = React.useState(false)

  // Countdown timer state
  const [timeLeft, setTimeLeft] = React.useState({
    days: 14,
    hours: 8,
    minutes: 42,
    seconds: 19,
  })

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const submitWaitlist = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setQueueNumber(Math.floor(Math.random() * 80) + 120)
    setIsSubmitted(true)
  }

  const copyReferral = () => {
    navigator.clipboard.writeText(`https://uipkge.dev/join?ref=${queueNumber || 142}`)
    setReferralCopied(true)
    setTimeout(() => setReferralCopied(false), 2000)
  }

  const activeRoleObj = roleOptions.find((r) => r.id === selectedRole)!

  return (
    <section
      data-slot="hero-waitlist-glow"
      className={cn(
        'bg-background relative overflow-hidden px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8',
        className,
      )}
    >
      {/* Center Radial Glow */}
      <div className="bg-primary/15 pointer-events-none absolute top-1/4 left-1/2 -z-10 h-96 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl" />

      <div className="mx-auto max-w-4xl space-y-10">
        {/* Top Pill */}
        <div className="border-border bg-muted/40 inline-flex items-center gap-2 rounded-full border px-3.5 py-1 font-mono text-xs shadow-xs">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span className="text-foreground font-medium">Public Registry Release</span>
          <span className="text-muted-foreground">&bull;</span>
          <span className="text-primary font-semibold">96% Claimed</span>
        </div>

        {/* Main Headline */}
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="text-foreground text-4xl leading-[1.12] font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Unbundled UI components and composable application blocks.
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed sm:text-lg">
            Join over thousands of developers building high-velocity web applications with unbundled Vue 3.5 & React 19
            components.
          </p>
        </div>

        {/* Live Countdown Bar */}
        <div className="mx-auto grid max-w-md grid-cols-4 gap-3">
          <div className="border-border bg-card/60 rounded-xl border p-3 backdrop-blur-sm">
            <p className="text-foreground font-mono text-2xl font-bold">{String(timeLeft.days).padStart(2, '0')}</p>
            <p className="text-muted-foreground mt-0.5 font-mono text-xs uppercase">Days</p>
          </div>
          <div className="border-border bg-card/60 rounded-xl border p-3 backdrop-blur-sm">
            <p className="text-foreground font-mono text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</p>
            <p className="text-muted-foreground mt-0.5 font-mono text-xs uppercase">Hours</p>
          </div>
          <div className="border-border bg-card/60 rounded-xl border p-3 backdrop-blur-sm">
            <p className="text-foreground font-mono text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</p>
            <p className="text-muted-foreground mt-0.5 font-mono text-xs uppercase">Mins</p>
          </div>
          <div className="border-border bg-card/60 rounded-xl border p-3 backdrop-blur-sm">
            <p className="text-foreground font-mono text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</p>
            <p className="text-muted-foreground mt-0.5 font-mono text-xs uppercase">Secs</p>
          </div>
        </div>

        {/* Interactive Waitlist Workbench Card */}
        <Card className="border-border bg-card/95 mx-auto max-w-2xl overflow-hidden rounded-2xl p-6 text-left shadow-sm backdrop-blur-md sm:p-8">
          {!isSubmitted ? (
            <div className="space-y-6">
              {/* Role Selection Tabs */}
              <div className="space-y-2">
                <label className="text-muted-foreground font-mono text-xs tracking-wider uppercase">
                  Select Your Track
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {roleOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={cn(
                        'rounded-lg border p-2.5 text-center text-xs font-medium transition-all',
                        selectedRole === opt.id
                          ? 'border-primary bg-primary/10 text-foreground font-semibold shadow-xs'
                          : 'border-border bg-background/50 text-muted-foreground hover:text-foreground',
                      )}
                      onClick={() => setSelectedRole(opt.id)}
                    >
                      {opt.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
                <p className="text-muted-foreground pt-1 text-xs italic">&rarr; {activeRoleObj.perk}</p>
              </div>

              {/* Email Input & Submit */}
              <form className="space-y-3" onSubmit={submitWaitlist}>
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="name@company.com"
                    required
                    className="bg-background h-11 font-mono text-sm"
                  />
                  <Button type="submit" size="lg" className="h-11 w-full shrink-0 gap-2 px-6 font-semibold sm:w-auto">
                    <span>Get Started</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
                <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Shield className="size-3.5 text-emerald-500" />
                  <span>Zero spam. Instant private registry token delivered upon verification.</span>
                </p>
              </form>
            </div>
          ) : (
            <div className="space-y-5 py-4 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="size-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-foreground text-xl font-bold">You're on the list!</h3>
                <p className="text-primary font-mono text-xs font-semibold">Priority Spot: #{queueNumber} in line</p>
                <p className="text-muted-foreground mx-auto max-w-sm text-xs">
                  We dispatched an invitation link to <span className="text-foreground font-mono">{email}</span>.
                </p>
              </div>

              {/* Referral Link Box */}
              <div className="border-border bg-muted/30 mx-auto max-w-md space-y-2 rounded-xl border p-3">
                <div className="text-muted-foreground flex items-center justify-between font-mono text-xs">
                  <span>Jump 5 spots per referral</span>
                  <span className="font-bold text-emerald-500">+5 boost</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={`https://uipkge.dev/join?ref=${queueNumber}`}
                    className="bg-background h-9 font-mono text-xs"
                  />
                  <Button type="button" size="sm" variant="outline" className="h-9 gap-1.5 px-3" onClick={copyReferral}>
                    {referralCopied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    <span>{referralCopied ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}
export default HeroWaitlistGlow
