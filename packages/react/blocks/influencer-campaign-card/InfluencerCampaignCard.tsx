'use client'

import * as React from 'react'
import {
  BadgeCheck,
  Check,
  Clock,
  Copy,
  DollarSign,
  ExternalLink,
  Eye,
  FileText,
  Mail,
  MessageSquare,
  Play,
  Share2,
  Target,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export interface InfluencerCampaignCardProps {
  className?: string
}

export function InfluencerCampaignCard({ className }: InfluencerCampaignCardProps) {
  const [copiedCode, setCopiedCode] = React.useState(false)
  const [copiedLink, setCopiedLink] = React.useState(false)

  const copyCode = () => {
    navigator.clipboard?.writeText('ALEX20')
    setCopiedCode(true)
    setTimeout(() => {
      setCopiedCode(false)
    }, 2000)
  }

  const copyLink = () => {
    navigator.clipboard?.writeText('https://uipkge.dev/c/alex20')
    setCopiedLink(true)
    setTimeout(() => {
      setCopiedLink(false)
    }, 2000)
  }

  return (
    <div data-slot="influencer-campaign-card" className={cn('mx-auto w-full max-w-5xl space-y-6', className)}>
      {/* 1. Creator Hero Header Card */}
      <Card className="border-border overflow-hidden shadow-xs">
        <div
          className="from-primary/20 via-primary/10 border-border/50 h-28 w-full border-b bg-gradient-to-r to-transparent"
          aria-hidden="true"
        />
        <CardContent className="px-6 pt-0 pb-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="relative -mt-12 size-20 shrink-0">
                <Avatar size="2xl" className="border-background size-20 border-4 shadow-xs">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=320&auto=format&fit=crop"
                    alt="Alex Rivera"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">AR</AvatarFallback>
                </Avatar>
                <span
                  className="bg-primary text-primary-foreground ring-background absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full shadow-xs ring-2"
                  title="Verified Creator"
                >
                  <BadgeCheck className="size-3.5" />
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-foreground text-xl font-bold tracking-tight">
                    Alex Rivera <span className="text-muted-foreground font-normal">· Tech & Design Creator</span>
                  </h1>
                  <Badge variant="success" className="gap-1.5 font-medium">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Active Campaign · Q3 Launch
                  </Badge>
                </div>

                {/* Channel Handles */}
                <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
                  <div className="text-foreground flex items-center gap-1.5 font-medium">
                    <Play className="size-3.5 text-red-500" />
                    <span>@alextech</span>
                    <span className="text-muted-foreground font-normal tabular-nums">(450k)</span>
                  </div>
                  <div className="text-foreground flex items-center gap-1.5 font-medium">
                    <Share2 className="size-3.5 text-sky-500" />
                    <span>@alextech</span>
                    <span className="text-muted-foreground font-normal tabular-nums">(120k)</span>
                  </div>
                  <div className="text-foreground flex items-center gap-1.5 font-medium">
                    <Video className="size-3.5 text-purple-500" />
                    <span>@alextech</span>
                    <span className="text-muted-foreground font-normal tabular-nums">(280k)</span>
                  </div>
                </div>

                {/* Niche Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <Badge variant="secondary" className="text-xs font-normal">
                    Developer Tools
                  </Badge>
                  <Badge variant="secondary" className="text-xs font-normal">
                    Hardware
                  </Badge>
                  <Badge variant="secondary" className="text-xs font-normal">
                    Productivity
                  </Badge>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
              <Button size="sm" className="gap-1.5">
                <MessageSquare className="size-4" />
                Message Creator
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <FileText className="size-4" />
                View Contract PDF
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Eye className="size-4" />
                Review Draft Asset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. 4 Campaign Telemetry Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Reach */}
        <Card className="border-border shadow-xs">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Total Reach</span>
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <Users className="size-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">850,000</div>
              <p className="text-muted-foreground text-xs">850,000 cross-platform reach</p>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <Badge variant="secondary" className="text-xs font-medium">
                3 Channels
              </Badge>
              <span className="text-muted-foreground text-xs tabular-nums">+18.4% YoY</span>
            </div>
          </CardContent>
        </Card>

        {/* Avg Engagement Rate */}
        <Card className="border-border shadow-xs">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Avg Engagement</span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="size-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">5.8%</div>
              <p className="text-muted-foreground text-xs">Across YouTube & Twitter</p>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <Badge variant="success" className="text-xs font-medium">
                vs 2.4% industry benchmark
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Contract Value & Fee */}
        <Card className="border-border shadow-xs">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Contract Value</span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <DollarSign className="size-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$6,500.00</div>
              <p className="text-muted-foreground text-xs">$6,500.00 Fixed + 10% Affiliate</p>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <Badge variant="outline" className="text-xs font-medium">
                Escrow Funded
              </Badge>
              <span className="text-muted-foreground text-xs">50% Disbursed</span>
            </div>
          </CardContent>
        </Card>

        {/* Campaign ROI / Conversions */}
        <Card className="border-border shadow-xs">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Campaign ROI</span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Target className="size-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">2.8x ROAS</div>
              <p className="text-muted-foreground text-xs">428 signups · $18,400 ARR generated</p>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <Badge variant="success" className="text-xs font-medium">
                14.2% CVR
              </Badge>
              <span className="text-muted-foreground text-xs tabular-nums">$43.00 CPA</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Contract Deliverables Checklist */}
      <Card className="border-border shadow-xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">Contract Deliverables</CardTitle>
            <CardDescription className="text-xs">
              Deliverables status, review workflows, and live audience performance.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-1.5 sm:items-end">
            <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
              <span>
                Progress: <strong className="text-foreground">2 of 4 Completed</strong>
              </span>
              <span className="text-muted-foreground tabular-nums">(50%)</span>
            </div>
            <Progress value={50} className="h-2 w-48 sm:w-56" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[220px]">Deliverable & Scope</TableHead>
                  <TableHead className="w-[160px]">Status</TableHead>
                  <TableHead className="min-w-[200px]">Live Performance</TableHead>
                  <TableHead className="w-[140px]">Timeline</TableHead>
                  <TableHead className="w-[120px] text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Deliverable 1 */}
                <TableRow>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-red-500/10 text-red-600 dark:text-red-400">
                        <Play className="size-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-foreground text-sm font-medium">Dedicated YouTube Review Video</p>
                        <p className="text-muted-foreground text-xs">10-12 min dedicated review + bio affiliate link</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" className="gap-1">
                      <Check className="size-3" />
                      Completed
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-foreground text-xs font-medium tabular-nums">48k views · 4.2k likes</p>
                      <p className="text-muted-foreground text-xs tabular-nums">312 comments · 8.4% CTR</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground text-xs tabular-nums">Live Aug 15, 2026</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="xs" className="text-primary hover:text-primary gap-1">
                      Watch
                      <ExternalLink className="size-3" />
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Deliverable 2 */}
                <TableRow>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
                        <Share2 className="size-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-foreground text-sm font-medium">Twitter / X Launch Thread</p>
                        <p className="text-muted-foreground text-xs">8-part technical breakdown with demo clips</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" className="gap-1">
                      <Check className="size-3" />
                      Completed
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-foreground text-xs font-medium tabular-nums">180 retweets · 1.2k bookmarks</p>
                      <p className="text-muted-foreground text-xs tabular-nums">22.4k impressions</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground text-xs tabular-nums">Live Aug 18, 2026</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="xs" className="text-primary hover:text-primary gap-1">
                      View
                      <ExternalLink className="size-3" />
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Deliverable 3 */}
                <TableRow>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        <Video className="size-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-foreground text-sm font-medium">TikTok Short & Instagram Reel</p>
                        <p className="text-muted-foreground text-xs">
                          60s vertical workflow demo highlighting UI speed
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="warning" className="gap-1">
                      <Clock className="size-3" />
                      Draft Pending Approval
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-muted-foreground text-xs">v2 cut ready for approval</p>
                      <p className="text-muted-foreground text-xs tabular-nums">1080x1920 60fps · 58s</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-warning dark:text-warning text-xs font-medium tabular-nums">
                      Due Aug 28, 2026
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="xs" className="gap-1">
                      Review
                      <Eye className="size-3" />
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Deliverable 4 */}
                <TableRow>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <Mail className="size-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-foreground text-sm font-medium">Newsletter Feature Sponsorship</p>
                        <p className="text-muted-foreground text-xs">
                          Sponsored lead editorial placement + logo banner
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="size-3" />
                      Scheduled
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-muted-foreground text-xs tabular-nums">Estimated 65,000 readers</p>
                      <p className="text-muted-foreground text-xs tabular-nums">48% historical open rate</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground text-xs tabular-nums">Sep 02, 2026</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="xs" disabled className="opacity-50">
                      Queued
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 4. Affiliate Link & Promo Code Performance Card */}
      <Card className="border-border shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Affiliate Link & Promo Code Performance</CardTitle>
          <CardDescription className="text-xs">
            Real-time redemption tracking, attribution metrics, and affiliate commission balance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Code & Link Controls */}
            <div className="space-y-4 lg:col-span-5">
              <div className="bg-muted/40 border-border space-y-4 rounded-lg border p-4">
                {/* Promo Code */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Promo Code (20% Discount)</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-background border-border text-primary flex flex-1 items-center justify-between rounded-md border px-3 py-1.5 font-mono text-sm font-semibold tracking-wider">
                      <span>ALEX20</span>
                      <span className="text-muted-foreground font-sans text-xs font-normal">20% off</span>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0 gap-1.5 text-xs" onClick={copyCode}>
                      {copiedCode ? (
                        <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="text-muted-foreground size-3.5" />
                      )}
                      {copiedCode ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Referral Link */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Referral Campaign URL</span>
                    <span className="text-muted-foreground tabular-nums">14.2% CVR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-background border-border text-muted-foreground flex-1 truncate rounded-md border px-3 py-1.5 font-mono text-xs">
                      https://uipkge.dev/c/alex20
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0 gap-1.5 text-xs" onClick={copyLink}>
                      {copiedLink ? (
                        <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="text-muted-foreground size-3.5" />
                      )}
                      {copiedLink ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Telemetry & Commission Stats */}
            <div className="space-y-4 lg:col-span-7">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="bg-muted/30 border-border space-y-1 rounded-lg border p-3">
                  <span className="text-muted-foreground text-xs">Redemptions</span>
                  <p className="text-foreground text-xl font-bold tabular-nums">428</p>
                  <p className="text-xs text-emerald-600 tabular-nums dark:text-emerald-400">+32 this week</p>
                </div>
                <div className="bg-muted/30 border-border space-y-1 rounded-lg border p-3">
                  <span className="text-muted-foreground text-xs">Commission Earned</span>
                  <p className="text-foreground text-xl font-bold tabular-nums">$2,140.00</p>
                  <p className="text-muted-foreground text-xs tabular-nums">10% standard fee</p>
                </div>
                <div className="bg-muted/30 border-border space-y-1 rounded-lg border p-3">
                  <span className="text-muted-foreground text-xs">Gross Revenue</span>
                  <p className="text-foreground text-xl font-bold tabular-nums">$21,400.00</p>
                  <p className="text-muted-foreground text-xs tabular-nums">$50.00 AOV</p>
                </div>
              </div>

              {/* Milestone Progress Bar */}
              <div className="bg-muted/20 border-border space-y-2 rounded-lg border p-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Commission Milestone: <strong className="text-foreground font-medium">428 / 500 redemptions</strong>
                  </span>
                  <span className="text-primary font-medium tabular-nums">85.6% to 15% rate boost</span>
                </div>
                <Progress value={85.6} className="h-2" />
              </div>

              {/* Payout Schedule notice */}
              <div className="border-border/70 bg-card text-muted-foreground flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    Next payout: <strong className="text-foreground font-semibold tabular-nums">$2,140.00</strong> via
                    Stripe Connect
                  </span>
                </div>
                <span className="text-foreground font-medium tabular-nums">Sep 15, 2026</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
