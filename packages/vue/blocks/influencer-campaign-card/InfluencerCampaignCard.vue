<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ref } from 'vue'
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
} from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const copiedCode = ref(false)
const copiedLink = ref(false)

function copyCode() {
  navigator.clipboard?.writeText('ALEX20')
  copiedCode.value = true
  setTimeout(() => {
    copiedCode.value = false
  }, 2000)
}

function copyLink() {
  navigator.clipboard?.writeText('https://uipkge.dev/c/alex20')
  copiedLink.value = true
  setTimeout(() => {
    copiedLink.value = false
  }, 2000)
}
</script>

<template>
  <div data-slot="influencer-campaign-card" :class="cn('mx-auto w-full max-w-5xl space-y-6', props.class)">
    <!-- 1. Creator Hero Header Card -->
    <Card class="border-border overflow-hidden shadow-xs">
      <div
        class="from-primary/20 via-primary/10 border-border/50 h-28 w-full border-b bg-gradient-to-r to-transparent"
        aria-hidden="true"
      />
      <CardContent class="px-6 pt-0 pb-6">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div class="relative -mt-12 size-20 shrink-0">
              <Avatar size="2xl" class="border-background size-20 border-4 shadow-xs">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=320&auto=format&fit=crop"
                  alt="Alex Rivera"
                />
                <AvatarFallback class="bg-primary/10 text-primary text-lg font-semibold">AR</AvatarFallback>
              </Avatar>
              <span
                class="bg-primary text-primary-foreground ring-background absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full shadow-xs ring-2"
                title="Verified Creator"
              >
                <BadgeCheck class="size-3.5" />
              </span>
            </div>

            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-2.5">
                <h1 class="text-foreground text-xl font-bold tracking-tight">
                  Alex Rivera <span class="text-muted-foreground font-normal">· Tech & Design Creator</span>
                </h1>
                <Badge variant="success" class="gap-1.5 font-medium">
                  <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Active Campaign · Q3 Launch
                </Badge>
              </div>

              <!-- Channel Handles -->
              <div class="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
                <div class="text-foreground flex items-center gap-1.5 font-medium">
                  <Play class="size-3.5 text-red-500" />
                  <span>@alextech</span>
                  <span class="text-muted-foreground font-normal tabular-nums">(450k)</span>
                </div>
                <div class="text-foreground flex items-center gap-1.5 font-medium">
                  <Share2 class="size-3.5 text-sky-500" />
                  <span>@alextech</span>
                  <span class="text-muted-foreground font-normal tabular-nums">(120k)</span>
                </div>
                <div class="text-foreground flex items-center gap-1.5 font-medium">
                  <Video class="size-3.5 text-purple-500" />
                  <span>@alextech</span>
                  <span class="text-muted-foreground font-normal tabular-nums">(280k)</span>
                </div>
              </div>

              <!-- Niche Tags -->
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <Badge variant="secondary" class="text-xs font-normal">Developer Tools</Badge>
                <Badge variant="secondary" class="text-xs font-normal">Hardware</Badge>
                <Badge variant="secondary" class="text-xs font-normal">Productivity</Badge>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
            <Button size="sm" class="gap-1.5">
              <MessageSquare class="size-4" />
              Message Creator
            </Button>
            <Button variant="outline" size="sm" class="gap-1.5">
              <FileText class="size-4" />
              View Contract PDF
            </Button>
            <Button variant="outline" size="sm" class="gap-1.5">
              <Eye class="size-4" />
              Review Draft Asset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 2. 4 Campaign Telemetry Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Reach -->
      <Card class="border-border shadow-xs">
        <CardContent class="space-y-3 p-5">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Total Reach</span>
            <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <Users class="size-4" />
            </div>
          </div>
          <div class="space-y-1">
            <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">850,000</div>
            <p class="text-muted-foreground text-xs">850,000 cross-platform reach</p>
          </div>
          <div class="flex items-center gap-1.5 pt-1">
            <Badge variant="secondary" class="text-xs font-medium">3 Channels</Badge>
            <span class="text-muted-foreground text-xs tabular-nums">+18.4% YoY</span>
          </div>
        </CardContent>
      </Card>

      <!-- Avg Engagement Rate -->
      <Card class="border-border shadow-xs">
        <CardContent class="space-y-3 p-5">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Avg Engagement</span>
            <div
              class="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <TrendingUp class="size-4" />
            </div>
          </div>
          <div class="space-y-1">
            <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">5.8%</div>
            <p class="text-muted-foreground text-xs">Across YouTube & Twitter</p>
          </div>
          <div class="flex items-center gap-1.5 pt-1">
            <Badge variant="success" class="text-xs font-medium">vs 2.4% industry benchmark</Badge>
          </div>
        </CardContent>
      </Card>

      <!-- Contract Value & Fee -->
      <Card class="border-border shadow-xs">
        <CardContent class="space-y-3 p-5">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Contract Value</span>
            <div
              class="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400"
            >
              <DollarSign class="size-4" />
            </div>
          </div>
          <div class="space-y-1">
            <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">$6,500.00</div>
            <p class="text-muted-foreground text-xs">$6,500.00 Fixed + 10% Affiliate</p>
          </div>
          <div class="flex items-center gap-1.5 pt-1">
            <Badge variant="outline" class="text-xs font-medium">Escrow Funded</Badge>
            <span class="text-muted-foreground text-xs">50% Disbursed</span>
          </div>
        </CardContent>
      </Card>

      <!-- Campaign ROI / Conversions -->
      <Card class="border-border shadow-xs">
        <CardContent class="space-y-3 p-5">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Campaign ROI</span>
            <div
              class="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400"
            >
              <Target class="size-4" />
            </div>
          </div>
          <div class="space-y-1">
            <div class="text-foreground text-2xl font-bold tracking-tight tabular-nums">2.8x ROAS</div>
            <p class="text-muted-foreground text-xs">428 signups · $18,400 ARR generated</p>
          </div>
          <div class="flex items-center gap-1.5 pt-1">
            <Badge variant="success" class="text-xs font-medium">14.2% CVR</Badge>
            <span class="text-muted-foreground text-xs tabular-nums">$43.00 CPA</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 3. Contract Deliverables Checklist -->
    <Card class="border-border shadow-xs">
      <CardHeader class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <CardTitle class="text-base font-semibold">Contract Deliverables</CardTitle>
          <CardDescription class="text-xs">
            Deliverables status, review workflows, and live audience performance.
          </CardDescription>
        </div>
        <div class="flex flex-col gap-1.5 sm:items-end">
          <div class="text-muted-foreground flex items-center gap-2 text-xs font-medium">
            <span>Progress: <strong class="text-foreground">2 of 4 Completed</strong></span>
            <span class="text-muted-foreground tabular-nums">(50%)</span>
          </div>
          <Progress :model-value="50" class="h-2 w-48 sm:w-56" />
        </div>
      </CardHeader>
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="min-w-[220px]">Deliverable & Scope</TableHead>
                <TableHead class="w-[160px]">Status</TableHead>
                <TableHead class="min-w-[200px]">Live Performance</TableHead>
                <TableHead class="w-[140px]">Timeline</TableHead>
                <TableHead class="w-[120px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <!-- Deliverable 1 -->
              <TableRow>
                <TableCell>
                  <div class="flex items-start gap-3">
                    <div
                      class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-red-500/10 text-red-600 dark:text-red-400"
                    >
                      <Play class="size-4" />
                    </div>
                    <div class="space-y-0.5">
                      <p class="text-foreground text-sm font-medium">Dedicated YouTube Review Video</p>
                      <p class="text-muted-foreground text-xs">10-12 min dedicated review + bio affiliate link</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="success" class="gap-1">
                    <Check class="size-3" />
                    Completed
                  </Badge>
                </TableCell>
                <TableCell>
                  <div class="space-y-0.5">
                    <p class="text-foreground text-xs font-medium tabular-nums">48k views · 4.2k likes</p>
                    <p class="text-muted-foreground text-xs tabular-nums">312 comments · 8.4% CTR</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span class="text-muted-foreground text-xs tabular-nums">Live Aug 15, 2026</span>
                </TableCell>
                <TableCell class="text-right">
                  <Button variant="ghost" size="xs" class="text-primary hover:text-primary gap-1">
                    Watch
                    <ExternalLink class="size-3" />
                  </Button>
                </TableCell>
              </TableRow>

              <!-- Deliverable 2 -->
              <TableRow>
                <TableCell>
                  <div class="flex items-start gap-3">
                    <div
                      class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400"
                    >
                      <Share2 class="size-4" />
                    </div>
                    <div class="space-y-0.5">
                      <p class="text-foreground text-sm font-medium">Twitter / X Launch Thread</p>
                      <p class="text-muted-foreground text-xs">8-part technical breakdown with demo clips</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="success" class="gap-1">
                    <Check class="size-3" />
                    Completed
                  </Badge>
                </TableCell>
                <TableCell>
                  <div class="space-y-0.5">
                    <p class="text-foreground text-xs font-medium tabular-nums">180 retweets · 1.2k bookmarks</p>
                    <p class="text-muted-foreground text-xs tabular-nums">22.4k impressions</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span class="text-muted-foreground text-xs tabular-nums">Live Aug 18, 2026</span>
                </TableCell>
                <TableCell class="text-right">
                  <Button variant="ghost" size="xs" class="text-primary hover:text-primary gap-1">
                    View
                    <ExternalLink class="size-3" />
                  </Button>
                </TableCell>
              </TableRow>

              <!-- Deliverable 3 -->
              <TableRow>
                <TableCell>
                  <div class="flex items-start gap-3">
                    <div
                      class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    >
                      <Video class="size-4" />
                    </div>
                    <div class="space-y-0.5">
                      <p class="text-foreground text-sm font-medium">TikTok Short & Instagram Reel</p>
                      <p class="text-muted-foreground text-xs">60s vertical workflow demo highlighting UI speed</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="warning" class="gap-1">
                    <Clock class="size-3" />
                    Draft Pending Approval
                  </Badge>
                </TableCell>
                <TableCell>
                  <div class="space-y-0.5">
                    <p class="text-muted-foreground text-xs">v2 cut ready for approval</p>
                    <p class="text-muted-foreground text-xs tabular-nums">1080x1920 60fps · 58s</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span class="text-warning dark:text-warning text-xs font-medium tabular-nums">Due Aug 28, 2026</span>
                </TableCell>
                <TableCell class="text-right">
                  <Button variant="outline" size="xs" class="gap-1">
                    Review
                    <Eye class="size-3" />
                  </Button>
                </TableCell>
              </TableRow>

              <!-- Deliverable 4 -->
              <TableRow>
                <TableCell>
                  <div class="flex items-start gap-3">
                    <div
                      class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    >
                      <Mail class="size-4" />
                    </div>
                    <div class="space-y-0.5">
                      <p class="text-foreground text-sm font-medium">Newsletter Feature Sponsorship</p>
                      <p class="text-muted-foreground text-xs">Sponsored lead editorial placement + logo banner</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" class="gap-1">
                    <Clock class="size-3" />
                    Scheduled
                  </Badge>
                </TableCell>
                <TableCell>
                  <div class="space-y-0.5">
                    <p class="text-muted-foreground text-xs tabular-nums">Estimated 65,000 readers</p>
                    <p class="text-muted-foreground text-xs tabular-nums">48% historical open rate</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span class="text-muted-foreground text-xs tabular-nums">Sep 02, 2026</span>
                </TableCell>
                <TableCell class="text-right">
                  <Button variant="ghost" size="xs" disabled class="opacity-50"> Queued </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- 4. Affiliate Link & Promo Code Performance Card -->
    <Card class="border-border shadow-xs">
      <CardHeader>
        <CardTitle class="text-base font-semibold">Affiliate Link & Promo Code Performance</CardTitle>
        <CardDescription class="text-xs">
          Real-time redemption tracking, attribution metrics, and affiliate commission balance.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <!-- Left: Code & Link Controls -->
          <div class="space-y-4 lg:col-span-5">
            <div class="bg-muted/40 border-border space-y-4 rounded-lg border p-4">
              <!-- Promo Code -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-muted-foreground font-medium">Promo Code (20% Discount)</span>
                  <span class="font-medium text-emerald-600 dark:text-emerald-400">Active</span>
                </div>
                <div class="flex items-center gap-2">
                  <div
                    class="bg-background border-border text-primary flex flex-1 items-center justify-between rounded-md border px-3 py-1.5 font-mono text-sm font-semibold tracking-wider"
                  >
                    <span>ALEX20</span>
                    <span class="text-muted-foreground font-sans text-xs font-normal">20% off</span>
                  </div>
                  <Button variant="outline" size="sm" class="shrink-0 gap-1.5 text-xs" @click="copyCode">
                    <Check v-if="copiedCode" class="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <Copy v-else class="text-muted-foreground size-3.5" />
                    {{ copiedCode ? 'Copied' : 'Copy' }}
                  </Button>
                </div>
              </div>

              <Separator />

              <!-- Referral Link -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-muted-foreground font-medium">Referral Campaign URL</span>
                  <span class="text-muted-foreground tabular-nums">14.2% CVR</span>
                </div>
                <div class="flex items-center gap-2">
                  <div
                    class="bg-background border-border text-muted-foreground flex-1 truncate rounded-md border px-3 py-1.5 font-mono text-xs"
                  >
                    https://uipkge.dev/c/alex20
                  </div>
                  <Button variant="outline" size="sm" class="shrink-0 gap-1.5 text-xs" @click="copyLink">
                    <Check v-if="copiedLink" class="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <Copy v-else class="text-muted-foreground size-3.5" />
                    {{ copiedLink ? 'Copied' : 'Copy' }}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Telemetry & Commission Stats -->
          <div class="space-y-4 lg:col-span-7">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div class="bg-muted/30 border-border space-y-1 rounded-lg border p-3">
                <span class="text-muted-foreground text-xs">Redemptions</span>
                <p class="text-foreground text-xl font-bold tabular-nums">428</p>
                <p class="text-xs text-emerald-600 tabular-nums dark:text-emerald-400">+32 this week</p>
              </div>
              <div class="bg-muted/30 border-border space-y-1 rounded-lg border p-3">
                <span class="text-muted-foreground text-xs">Commission Earned</span>
                <p class="text-foreground text-xl font-bold tabular-nums">$2,140.00</p>
                <p class="text-muted-foreground text-xs tabular-nums">10% standard fee</p>
              </div>
              <div class="bg-muted/30 border-border space-y-1 rounded-lg border p-3">
                <span class="text-muted-foreground text-xs">Gross Revenue</span>
                <p class="text-foreground text-xl font-bold tabular-nums">$21,400.00</p>
                <p class="text-muted-foreground text-xs tabular-nums">$50.00 AOV</p>
              </div>
            </div>

            <!-- Milestone Progress Bar -->
            <div class="bg-muted/20 border-border space-y-2 rounded-lg border p-3.5">
              <div class="flex items-center justify-between text-xs">
                <span class="text-muted-foreground">
                  Commission Milestone: <strong class="text-foreground font-medium">428 / 500 redemptions</strong>
                </span>
                <span class="text-primary font-medium tabular-nums">85.6% to 15% rate boost</span>
              </div>
              <Progress :model-value="85.6" class="h-2" />
            </div>

            <!-- Payout Schedule notice -->
            <div
              class="border-border/70 bg-card text-muted-foreground flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-xs"
            >
              <div class="flex items-center gap-2">
                <BadgeCheck class="size-4 text-emerald-600 dark:text-emerald-400" />
                <span
                  >Next payout: <strong class="text-foreground font-semibold tabular-nums">$2,140.00</strong> via Stripe
                  Connect</span
                >
              </div>
              <span class="text-foreground font-medium tabular-nums">Sep 15, 2026</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
