'use client'

import * as React from 'react'
import { Check, Clock, Copy, Gift, Lock, Mail, Share2, Sparkles, Trophy, Users, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface MilestoneTier {
  id: string
  tier: number
  referralsRequired: number
  title: string
  reward: string
  description: string
  status: 'completed' | 'in-progress' | 'upcoming'
}

export interface ReferralActivity {
  id: string
  name: string
  email: string
  initials: string
  signedUpAt: string
  status: 'paid' | 'pending'
  rewardAmount: string
}

export interface ReferralProgramWidgetProps {
  referralUrl?: string
  referralCode?: string
  className?: string
}

const tiers: MilestoneTier[] = [
  {
    id: 'tier-1',
    tier: 1,
    referralsRequired: 1,
    title: '$25 Account Credit',
    reward: '$25 Credit',
    description: 'Instant credit applied directly to your renewal balance.',
    status: 'completed',
  },
  {
    id: 'tier-2',
    tier: 2,
    referralsRequired: 5,
    title: '$125 Credit + Exclusive Swag Kit',
    reward: '$125 + Swag Kit',
    description: 'Premium organic cotton hoodie and engineering desk kit.',
    status: 'completed',
  },
  {
    id: 'tier-3',
    tier: 3,
    referralsRequired: 10,
    title: '$250 Credit + 1-Year Free Pro Plan',
    reward: '$250 + Pro Plan',
    description: '6 of 10 referred · 4 more needed to unlock full Pro tier.',
    status: 'in-progress',
  },
  {
    id: 'tier-4',
    tier: 4,
    referralsRequired: 25,
    title: '$1,000 Credit + VIP Lifetime Access',
    reward: '$1,000 + VIP Pass',
    description: 'Direct Slack channel access to core founders and private beta track.',
    status: 'upcoming',
  },
]

const recentReferrals: ReferralActivity[] = [
  {
    id: 'ref-1',
    name: 'Marcus Vance',
    email: 'marcus.v@acme.com',
    initials: 'MV',
    signedUpAt: 'Oct 14, 2024',
    status: 'paid',
    rewardAmount: '$25.00',
  },
  {
    id: 'ref-2',
    name: 'Sarah Jenkins',
    email: 's.jenkins@designcorp.io',
    initials: 'SJ',
    signedUpAt: 'Oct 02, 2024',
    status: 'paid',
    rewardAmount: '$25.00',
  },
  {
    id: 'ref-3',
    name: 'Devon Lane',
    email: 'devon@lane.co',
    initials: 'DL',
    signedUpAt: 'Sep 28, 2024',
    status: 'pending',
    rewardAmount: '$25.00',
  },
  {
    id: 'ref-4',
    name: 'Priya Patel',
    email: 'priya.patel@fintech.io',
    initials: 'PP',
    signedUpAt: 'Sep 15, 2024',
    status: 'paid',
    rewardAmount: '$25.00',
  },
]

export function ReferralProgramWidget({
  referralUrl = 'https://uipkge.dev/invite/elena-rostova',
  referralCode = 'ELENA25',
  className,
}: ReferralProgramWidgetProps) {
  const [copiedLink, setCopiedLink] = React.useState(false)
  const [copiedCode, setCopiedCode] = React.useState(false)

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    'Get $25 off your first year with my invite link:',
  )}&url=${encodeURIComponent(referralUrl)}`

  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`

  const emailShareUrl = `mailto:?subject=${encodeURIComponent(
    'Get $25 off your subscription',
  )}&body=${encodeURIComponent(
    `Hey,\n\nUse my invite link to get $25 off your first year:\n${referralUrl}\n\nUse invite code ${referralCode} at checkout!`,
  )}`

  const copyToClipboard = async (text: string, type: 'link' | 'code') => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      }
    } catch {
      // Fallback if clipboard API is unavailable
    }

    if (type === 'link') {
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } else {
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  return (
    <div data-slot="referral-program-widget" className={cn('mx-auto w-full max-w-5xl space-y-6', className)}>
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1.5 font-medium">
                <Gift className="text-primary size-3.5" aria-hidden="true" />
                Give $25, Get $25
              </Badge>
            </div>
            <h1 className="text-foreground mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Refer Friends &amp; Earn Credits
            </h1>
            <p className="text-muted-foreground mt-1 max-w-2xl text-sm sm:text-base">
              Give your network $25 off their first year, and earn $25 credit for every active referral.
            </p>
          </div>
        </div>

        {/* Referral Balance Card */}
        <Card className="border-border/80 shadow-xs">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary border-primary/20 flex size-12 shrink-0 items-center justify-center rounded-xl border">
                  <Wallet className="size-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Referral Balance</p>
                  <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
                    <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                      $150.00
                    </span>
                    <span className="text-muted-foreground text-sm font-medium">Available Credit</span>
                    <span className="text-foreground text-sm font-semibold tabular-nums">6 Successful Referrals</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-medium tabular-nums">
                  1 Pending ($25.00)
                </Badge>
                <Button size="sm" variant="outline">
                  Redeem Credits
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Share Your Referral Link Card */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Share2 className="text-primary size-4" aria-hidden="true" />
            <CardTitle className="text-base font-semibold">Share Your Referral Link</CardTitle>
          </div>
          <CardDescription>
            Send your personal invite link or share directly across social channels to earn rewards instantly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Referral URL & Copy Action */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Input
                value={referralUrl}
                readOnly
                className="bg-muted/30 font-mono text-xs sm:text-sm"
                aria-label="Your custom referral URL"
              />
            </div>
            <Button
              type="button"
              variant={copiedLink ? 'outline' : 'default'}
              className="shrink-0 gap-1.5 transition-all"
              onClick={() => copyToClipboard(referralUrl, 'link')}
            >
              {copiedLink ? (
                <Check className="text-success size-4" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
              <span>{copiedLink ? 'Copied Link' : 'Copy Link'}</span>
            </Button>
          </div>

          <Separator />

          {/* Social Share & Code Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {/* Share on X / Twitter */}
              <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs font-medium">
                <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer">
                  <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
                  </svg>
                  Share to X
                </a>
              </Button>

              {/* Share to LinkedIn */}
              <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs font-medium">
                <a href={linkedinShareUrl} target="_blank" rel="noopener noreferrer">
                  <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                  </svg>
                  Share to LinkedIn
                </a>
              </Button>

              {/* Share via Email */}
              <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs font-medium">
                <a href={emailShareUrl}>
                  <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                  Share via Email
                </a>
              </Button>
            </div>

            {/* Invite Code Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-medium"
              onClick={() => copyToClipboard(referralCode, 'code')}
            >
              {copiedCode ? (
                <Check className="text-success size-3.5" aria-hidden="true" />
              ) : (
                <Copy className="text-muted-foreground size-3.5" aria-hidden="true" />
              )}
              <span>Invite Code:</span>
              <span className="text-foreground font-mono font-semibold">{referralCode}</span>
              {copiedCode && <span className="text-success text-xs font-medium">Copied!</span>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Milestone Rewards Progress Stepper */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="text-warning size-4" aria-hidden="true" />
                <CardTitle className="text-base font-semibold">Milestone Rewards</CardTitle>
              </div>
              <CardDescription>
                Reach referral milestones to unlock credit bonuses, swag, and exclusive plan access.
              </CardDescription>
            </div>
            <Badge variant="outline" className="w-fit gap-1 text-xs tabular-nums">
              <Sparkles className="text-primary size-3" aria-hidden="true" />
              Tier 3 In Progress · 6 / 10 Referrals
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Stepper Track Header */}
          <div className="border-border/70 bg-muted/40 space-y-2 rounded-lg border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
              <span className="text-foreground font-medium">
                Current Target: Tier 3 ($250 Credit + 1-Year Free Pro Plan)
              </span>
              <span className="text-muted-foreground font-semibold tabular-nums">60% (6 of 10 referrals)</span>
            </div>
            <Progress value={60} className="h-2" />
            <p className="text-muted-foreground text-xs">
              4 more successful referrals needed to unlock Tier 3 rewards.
            </p>
          </div>

          {/* 4 Milestone Tiers Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  'relative flex flex-col justify-between rounded-lg border p-4 transition-colors',
                  tier.status === 'completed' && 'border-success/30 bg-success/5',
                  tier.status === 'in-progress' && 'border-primary/50 bg-primary/5 ring-primary/20 shadow-xs ring-1',
                  tier.status === 'upcoming' && 'border-border/60 bg-muted/20 opacity-80',
                )}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Tier {tier.tier} · {tier.referralsRequired}{' '}
                      {tier.referralsRequired === 1 ? 'Referral' : 'Referrals'}
                    </span>

                    {tier.status === 'completed' && (
                      <Badge variant="success" className="gap-1 text-xs">
                        <Check className="size-3" aria-hidden="true" />
                        Completed
                      </Badge>
                    )}
                    {tier.status === 'in-progress' && (
                      <Badge variant="default" className="gap-1 text-xs">
                        In Progress (6/10)
                      </Badge>
                    )}
                    {tier.status === 'upcoming' && (
                      <Badge variant="secondary" className="text-muted-foreground gap-1 text-xs">
                        <Lock className="size-3" aria-hidden="true" />
                        Upcoming
                      </Badge>
                    )}
                  </div>

                  <div>
                    <p className="text-foreground text-sm font-semibold">{tier.title}</p>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{tier.description}</p>
                  </div>
                </div>

                <div className="border-border/50 mt-4 border-t pt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Reward Perk:</span>
                    <span className="text-foreground font-semibold tabular-nums">{tier.reward}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Referrals Activity Table */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Users className="text-primary size-4" aria-hidden="true" />
                <CardTitle className="text-base font-semibold">Recent Referrals</CardTitle>
              </div>
              <CardDescription>
                Track recent invitees, activation statuses, and credited referral payouts.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-medium tabular-nums">
              4 Recent Signups
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="overflow-x-auto">
            <Table density="cozy">
              <TableHeader>
                <TableRow>
                  <TableHead>Invitee</TableHead>
                  <TableHead>Signed Up</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Reward Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8 shrink-0">
                          <AvatarFallback className="text-xs font-semibold">{referral.initials}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-foreground truncate text-sm font-medium">{referral.name}</p>
                          <p className="text-muted-foreground truncate text-xs">{referral.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap sm:text-sm">
                      {referral.signedUpAt}
                    </TableCell>
                    <TableCell>
                      {referral.status === 'paid' ? (
                        <Badge variant="success" className="gap-1 text-xs">
                          <Check className="size-3" aria-hidden="true" />
                          Reward Paid $25
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="gap-1 text-xs">
                          <Clock className="size-3" aria-hidden="true" />
                          Pending Activation
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-xs font-medium tabular-nums sm:text-sm">
                      <span
                        className={referral.status === 'paid' ? 'text-success font-semibold' : 'text-muted-foreground'}
                      >
                        {referral.status === 'paid' ? `+${referral.rewardAmount}` : referral.rewardAmount}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
