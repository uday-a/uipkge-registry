'use client'

import { useState, type FormEvent } from 'react'
import { Check, Copy, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

interface WaitlistReferralPositionProps {
  position?: number
  nextTierAt?: number
}

const referralLink = 'https://northwind.dev/w/8f2a41'

export function WaitlistReferralPosition({ position = 1284, nextTierAt = 1000 }: WaitlistReferralPositionProps) {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
  const [copied, setCopied] = useState(false)

  // How far from the current position to the next access tier, as a percentage.
  const span = position - nextTierAt
  const progress = span <= 0 ? 100 : Math.round(((position - span) / position) * 100)

  function join(event: FormEvent) {
    event.preventDefault()
    if (!email.trim()) return
    setJoined(true)
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard blocked: the link stays visible and selectable.
    }
  }

  return (
    <section data-slot="waitlist-referral-position" className="bg-background">
      <div className="mx-auto max-w-xl px-6 py-20 text-center lg:py-28">
        <Badge variant="secondary" className="gap-1.5">
          <Users className="size-3" aria-hidden="true" />
          8,400 waiting
        </Badge>

        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Early access opens a cohort at a time
        </h2>
        <p className="text-muted-foreground mt-3 text-lg">
          Join the list, then move up it. Every person who joins through your link moves you forward.
        </p>

        {/* One card that swaps contents rather than two stacked states, so the
            section height barely changes between before and after. */}
        <Card className="mt-8 text-left">
          <CardContent className="p-6">
            {!joined ? (
              <form onSubmit={join}>
                <label htmlFor="waitlist-email" className="text-sm font-medium">
                  Work email
                </label>
                <div className="mt-2 flex gap-2">
                  <Input
                    id="waitlist-email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    required
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                  <Button type="submit" className="shrink-0">
                    Join
                  </Button>
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                  No product emails while you wait — one message when your cohort opens.
                </p>
              </form>
            ) : (
              <div aria-live="polite">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-muted-foreground text-xs tracking-wide uppercase">Your position</p>
                    <p className="font-display mt-1 text-3xl font-bold tracking-tight">#{position.toLocaleString()}</p>
                  </div>
                  <p className="text-muted-foreground text-right text-xs">
                    Next cohort opens
                    <br />
                    at #{nextTierAt.toLocaleString()}
                  </p>
                </div>

                <Progress value={progress} className="mt-4 h-1.5" aria-label="Progress to the next cohort" />

                <Separator className="my-5" />

                <p className="text-sm font-medium">Move up the list</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Each signup through your link moves you forward 12 places.
                </p>
                <div className="border-border bg-muted/30 mt-3 flex items-stretch overflow-hidden rounded-md border">
                  <code className="min-w-0 flex-1 truncate px-3 py-2 font-mono text-xs">{referralLink}</code>
                  <Button
                    variant="ghost"
                    className="border-border h-auto shrink-0 rounded-none border-l px-3"
                    aria-label="Copy referral link"
                    onClick={copyLink}
                  >
                    {copied ? (
                      <Check className="text-success size-4" aria-hidden="true" />
                    ) : (
                      <Copy className="size-4" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
