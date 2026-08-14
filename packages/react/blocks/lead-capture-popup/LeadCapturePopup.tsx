'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Check, Clock, Copy, Sparkles, Star, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface LeadCapturePopupProps {
  headline?: string
  subtitle?: string
  discountCode?: string
  discountPercent?: number
  initialSeconds?: number
  socialProofRating?: string
  socialProofCount?: string
  initialSubmitted?: boolean
  className?: string
  onSubmit?: (payload: { email: string; discountCode: string }) => void
  onDismiss?: () => void
  onCopy?: (code: string) => void
  onReset?: () => void
}

export function LeadCapturePopup({
  headline = 'Unlock 20% Off Your First Order',
  subtitle = 'Join 45,000+ engineers receiving our weekly curated component teardowns and architectural breakdowns.',
  discountCode = 'WELCOME20',
  discountPercent = 20,
  initialSeconds = 599,
  socialProofRating = '4.9/5',
  socialProofCount = '1,200+ developers',
  initialSubmitted = false,
  className,
  onSubmit,
  onDismiss,
  onCopy,
  onReset,
}: LeadCapturePopupProps) {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(initialSubmitted)
  const [isDismissed, setIsDismissed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(initialSeconds)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setIsSubmitted(true)
    onSubmit?.({ email, discountCode })
  }

  function handleDismiss() {
    setIsDismissed(true)
    onDismiss?.()
  }

  function handleReset() {
    setIsSubmitted(false)
    setIsDismissed(false)
    setEmail('')
    setCopied(false)
    setTimeLeft(initialSeconds)
    onReset?.()
  }

  function copyCoupon() {
    navigator.clipboard?.writeText(discountCode)
    setCopied(true)
    onCopy?.(discountCode)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  if (isDismissed) {
    return (
      <div
        className="flex flex-col items-center justify-center p-8 text-center"
        data-slot="lead-capture-popup-dismissed"
      >
        <p className="text-muted-foreground text-sm">Popup was dismissed.</p>
        <Button variant="outline" size="sm" className="mt-3 gap-2" onClick={handleReset}>
          <Sparkles className="text-primary size-3.5" />
          Reopen Welcome Popup
        </Button>
      </div>
    )
  }

  return (
    <div data-slot="lead-capture-popup" className={cn('w-full', className)}>
      <div className="bg-card text-card-foreground border-border relative mx-auto w-full max-w-lg overflow-hidden rounded-2xl border p-6 shadow-xl sm:p-8">
        {/* Background Ambient Glow */}
        <div className="bg-primary/10 pointer-events-none absolute -top-12 -right-12 size-40 rounded-full blur-2xl" />

        {/* Top Right Dismiss Button */}
        <button
          type="button"
          aria-label="Dismiss popup"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-4 right-4 rounded-full p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
          onClick={handleDismiss}
        >
          <X className="size-4" />
        </button>

        {/* FORM STATE */}
        {!isSubmitted ? (
          <div className="relative z-10 space-y-6">
            {/* Top Badge */}
            <div className="flex items-center">
              <Badge
                variant="secondary"
                className="border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium"
              >
                <Sparkles className="fill-primary/20 text-primary size-3.5" />
                Limited Time Welcome Gift
              </Badge>
            </div>

            {/* Urgency Countdown Bar */}
            <div className="flex items-center justify-between gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3.5 py-2 text-xs text-amber-900 dark:text-amber-300">
              <div className="flex items-center gap-2">
                <Clock className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span className="font-medium">
                  Claim your {discountPercent}% discount code before the timer expires:
                </span>
              </div>
              <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-xs font-bold text-amber-950 tabular-nums dark:text-amber-200">
                {formattedTime}
              </span>
            </div>

            {/* Headline & Subtitle */}
            <div className="space-y-2">
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">{headline}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">{subtitle}</p>
            </div>

            {/* Value Bullet Points (3 items with emerald checkmarks) */}
            <ul className="space-y-2.5" role="list">
              <li className="text-muted-foreground flex items-center gap-2.5 text-xs sm:text-sm">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Check className="size-2.5 stroke-[3]" />
                </span>
                <span>No spam ever &mdash; high-signal engineering teardowns</span>
              </li>
              <li className="text-muted-foreground flex items-center gap-2.5 text-xs sm:text-sm">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Check className="size-2.5 stroke-[3]" />
                </span>
                <span>1-click unsubscribe anytime with zero friction</span>
              </li>
              <li className="text-muted-foreground flex items-center gap-2.5 text-xs sm:text-sm">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <Check className="size-2.5 stroke-[3]" />
                </span>
                <span>Instant coupon delivery straight to your screen &amp; inbox</span>
              </li>
            </ul>

            {/* Email Capture Form */}
            <form className="space-y-3 pt-1" onSubmit={handleSubmit}>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="engineer@company.com"
                required
                autoComplete="email"
                aria-label="Email address"
                className="border-border bg-background focus-visible:ring-primary h-11 text-sm shadow-xs focus-visible:ring-2"
              />

              <Button
                type="submit"
                size="lg"
                className="h-11 w-full justify-center gap-2 text-sm font-semibold shadow-xs"
              >
                Claim My {discountPercent}% Discount
                <ArrowRight className="size-4" />
              </Button>
            </form>

            {/* Social Proof Line */}
            <div className="text-muted-foreground flex items-center justify-center gap-1.5 text-xs">
              <div className="flex items-center gap-0.5 text-amber-500 dark:text-amber-400" aria-hidden="true">
                <Star className="size-3.5 fill-current" />
                <Star className="size-3.5 fill-current" />
                <Star className="size-3.5 fill-current" />
                <Star className="size-3.5 fill-current" />
                <Star className="size-3.5 fill-current" />
              </div>
              <span className="text-foreground font-medium">{socialProofRating}</span>
              <span>rating by {socialProofCount}</span>
            </div>

            {/* Dismiss / Decline link */}
            <div className="text-center">
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring min-h-6 rounded text-xs underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                onClick={handleDismiss}
              >
                No thanks, I prefer paying full price
              </button>
            </div>
          </div>
        ) : (
          /* SUCCESS STATE */
          <div className="relative z-10 space-y-5 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="size-6" />
            </div>

            <div className="space-y-1.5">
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 font-medium text-emerald-700 dark:text-emerald-400"
              >
                {discountPercent}% Discount Unlocked
              </Badge>
              <h3 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">You&rsquo;re all set!</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                We&rsquo;ve dispatched your code and welcome gift to{' '}
                <span className="text-foreground font-medium">{email || 'engineer@company.com'}</span>.
              </p>
            </div>

            {/* Coupon Card Box */}
            <div className="border-border bg-muted/40 relative space-y-3 rounded-xl border-2 border-dashed p-4">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Your Exclusive Coupon Code
              </span>
              <div className="flex items-center justify-center gap-2">
                <code className="border-border bg-background text-foreground rounded-lg border px-3 py-1.5 font-mono text-xl font-bold tracking-widest sm:text-2xl">
                  {discountCode}
                </code>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 shadow-xs"
                  aria-label={copied ? 'Copied code' : 'Copy discount code'}
                  onClick={copyCoupon}
                >
                  {copied ? (
                    <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                Valid for the next <span className="font-mono font-medium">{formattedTime}</span> at checkout.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                className="h-11 w-full justify-center gap-2 text-sm font-semibold shadow-xs"
                onClick={handleDismiss}
              >
                Start Exploring Components
                <ArrowRight className="size-4" />
              </Button>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring min-h-6 rounded text-xs underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                onClick={handleReset}
              >
                Enter a different email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
