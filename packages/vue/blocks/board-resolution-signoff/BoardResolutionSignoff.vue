<script setup lang="ts">
import { ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Lock,
  Printer,
  Scale,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export interface BoardResolutionSignoffProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<BoardResolutionSignoffProps>()

const resolutionRef = 'BOD-RES-2026-08'
const companyName = 'UIPKGE Technologies Inc.'
const corporateEntity = 'Delaware C-Corp • Entity File #7849201'
const sha256Digest = 'd4e9a83f120c9103ba88e721a998c0b291ab8e0172bf42e01a88c34f9810b492'

const copiedRef = ref(false)
const copiedDigest = ref(false)
const downloadStatus = ref<'idle' | 'generating' | 'downloaded'>('idle')
const sharedStatus = ref(false)

function handleCopyRef() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(`#${resolutionRef}`)
    copiedRef.value = true
    setTimeout(() => {
      copiedRef.value = false
    }, 2000)
  }
}

function handleCopyDigest() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(sha256Digest)
    copiedDigest.value = true
    setTimeout(() => {
      copiedDigest.value = false
    }, 2000)
  }
}

function handleDownloadPdf() {
  downloadStatus.value = 'generating'
  setTimeout(() => {
    downloadStatus.value = 'downloaded'
    setTimeout(() => {
      downloadStatus.value = 'idle'
    }, 3000)
  }, 1600)
}

function handlePrint() {
  if (typeof window !== 'undefined') {
    window.print()
  }
}

function handleShare() {
  sharedStatus.value = true
  setTimeout(() => {
    sharedStatus.value = false
  }, 2500)
}

const directors = [
  {
    name: 'Elena Rostova',
    title: 'Director & Chief Executive Officer',
    initials: 'ER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    signature: 'Elena Rostova',
    signedDate: 'Aug 21, 2026 · 14:32 PST',
    authMethod: 'Hardware FIDO2 Security Key',
    certId: 'SIG-BOD-2026-ER01',
    vote: 'AYE (In Favor)',
  },
  {
    name: 'Marcus Vance',
    title: 'Director & Chief Technology Officer',
    initials: 'MV',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    signature: 'Marcus Vance',
    signedDate: 'Aug 21, 2026 · 14:28 PST',
    authMethod: 'Passkey Biometric (Touch ID / PKI)',
    certId: 'SIG-BOD-2026-MV02',
    vote: 'AYE (In Favor)',
  },
  {
    name: 'Sarah Jenkins, J.D.',
    title: 'Independent Director & Audit Chair',
    initials: 'SJ',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    signature: 'Sarah Jenkins',
    signedDate: 'Aug 21, 2026 · 14:15 PST',
    authMethod: 'Enterprise SSO + FIDO2 2FA',
    certId: 'SIG-BOD-2026-SJ03',
    vote: 'AYE (In Favor)',
  },
]
</script>

<template>
  <div data-slot="board-resolution-signoff" :class="cn('bg-background text-foreground w-full space-y-6', props.class)">
    <!-- Header Section -->
    <header class="border-border bg-card rounded-xl border p-5 shadow-xs sm:p-6">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-2">
          <!-- Top Tag & Reference Row -->
          <div class="flex flex-wrap items-center gap-2">
            <Badge wrap variant="outline" class="font-mono text-xs font-semibold"> #{{ resolutionRef }} </Badge>

            <button
              type="button"
              class="border-border hover:bg-muted focus-visible:ring-ring bg-muted/40 text-muted-foreground hover:text-foreground inline-flex min-h-6 items-center gap-1 rounded border px-2 py-0.5 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
              title="Copy Resolution Reference ID"
              @click="handleCopyRef"
            >
              <Check v-if="copiedRef" class="size-3 text-emerald-600 dark:text-emerald-400" />
              <Copy v-else class="size-3" />
              <span>{{ copiedRef ? 'Copied' : 'Copy Ref' }}</span>
            </button>

            <Badge
              wrap
              class="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
            >
              <ShieldCheck class="size-3.5 shrink-0" />
              <span>3 of 3 Directors Signed · Unanimously Approved</span>
            </Badge>

            <Badge wrap variant="secondary" class="font-mono text-xs"> DGCL § 141(f) </Badge>
          </div>

          <!-- Title & Organization Info -->
          <div>
            <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              Unanimous Written Consent of the Board of Directors
            </h1>
            <div class="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span class="text-foreground flex items-center gap-1.5 font-semibold">
                <Building2 class="text-primary size-4 shrink-0" />
                {{ companyName }}
              </span>
              <span>{{ corporateEntity }}</span>
              <span class="flex items-center gap-1">
                <Calendar class="size-3.5 shrink-0" />
                Action Date: August 21, 2026
              </span>
            </div>
          </div>
        </div>

        <!-- Header Actions -->
        <div class="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" size="sm" class="gap-1.5 text-xs shadow-xs" @click="handlePrint">
            <Printer class="size-3.5" />
            <span>Print Minutes</span>
          </Button>

          <Button variant="outline" size="sm" class="gap-1.5 text-xs shadow-xs" @click="handleShare">
            <Share2 class="size-3.5" />
            <span>{{ sharedStatus ? 'Link Copied!' : 'Share Vault' }}</span>
          </Button>

          <Button
            aria-label="Download attachment"
            variant="default"
            size="sm"
            class="gap-2 text-xs font-semibold shadow-xs"
            :disabled="downloadStatus === 'generating'"
            @click="handleDownloadPdf"
          >
            <Download class="size-4" />
            <span v-if="downloadStatus === 'generating'">Generating Certified PDF...</span>
            <span v-else-if="downloadStatus === 'downloaded'">Certified Minutes Downloaded!</span>
            <span v-else>Download Certified Minutes PDF</span>
          </Button>
        </div>
      </div>
    </header>

    <!-- Quorum & Voting Summary Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="p-5 pb-3 sm:p-6 sm:pb-4">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2.5">
            <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <Scale class="size-4" />
            </div>
            <div>
              <CardTitle class="text-base font-bold sm:text-lg">Quorum &amp; Voting Certification</CardTitle>
              <CardDescription class="text-xs">
                Official vote tally and statutory governance determination under Delaware General Corporation Law
              </CardDescription>
            </div>
          </div>

          <Badge
            wrap
            variant="outline"
            class="self-start border-emerald-500/40 bg-emerald-500/10 font-mono text-xs text-emerald-700 sm:self-auto dark:text-emerald-400"
          >
            <CheckCircle2 class="mr-1 size-3" />
            Statutory Threshold Satisfied
          </Badge>
        </div>
      </CardHeader>

      <CardContent class="space-y-5 p-5 pt-0 sm:p-6 sm:pt-0">
        <!-- 4 KPI Metrics Grid -->
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div class="border-border/70 bg-muted/20 rounded-lg border p-3.5">
            <p class="text-muted-foreground text-xs font-medium">Board Quorum</p>
            <p
              class="text-foreground mt-1 font-mono text-lg font-bold text-emerald-700 tabular-nums dark:text-emerald-400"
            >
              100% Achieved
            </p>
            <p class="text-muted-foreground mt-0.5 text-xs">3 of 3 Voting Directors Present</p>
          </div>

          <div class="border-border/70 bg-muted/20 rounded-lg border p-3.5">
            <p class="text-muted-foreground text-xs font-medium">Voting Tally</p>
            <p class="text-foreground mt-1 font-mono text-lg font-bold tabular-nums">3 In Favor · 0 Opposed</p>
            <p class="text-muted-foreground mt-0.5 text-xs">3 Ayes, 0 Nays, 0 Abstentions</p>
          </div>

          <div class="border-border/70 bg-muted/20 rounded-lg border p-3.5">
            <p class="text-muted-foreground text-xs font-medium">Action Structure</p>
            <p class="text-foreground mt-1 text-xs font-bold sm:text-sm">Unanimous Written Consent</p>
            <p class="text-muted-foreground mt-0.5 text-xs">In Lieu of Special Meeting</p>
          </div>

          <div class="border-border/70 bg-muted/20 rounded-lg border p-3.5">
            <p class="text-muted-foreground text-xs font-medium">Effective Timestamp</p>
            <p class="text-foreground mt-1 font-mono text-xs font-bold tabular-nums sm:text-sm">
              Aug 21, 2026 · 14:32 PST
            </p>
            <p class="text-muted-foreground mt-0.5 text-xs">RFC 3161 Certified Vault</p>
          </div>
        </div>

        <!-- Approval Progress Bar -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="text-foreground flex items-center gap-1.5 font-medium">
              <Sparkles class="size-3 text-emerald-600 dark:text-emerald-400" />
              Unanimous Board Approval Level (3/3)
            </span>
            <span class="font-mono font-semibold text-emerald-700 dark:text-emerald-400">100% Unanimous</span>
          </div>
          <div class="bg-muted h-2 w-full overflow-hidden rounded-full">
            <div
              class="h-full w-full rounded-full bg-emerald-600 transition-all duration-500 dark:bg-emerald-500"
            ></div>
          </div>
        </div>

        <!-- Director Quick Vote Roster -->
        <div class="border-border/60 bg-muted/10 grid grid-cols-1 gap-2.5 rounded-lg border p-3 sm:grid-cols-3">
          <div
            v-for="director in directors"
            :key="director.name"
            class="border-border/50 bg-card flex items-center justify-between rounded-md border px-3 py-2 text-xs"
          >
            <div class="flex min-w-0 items-center gap-2">
              <Avatar class="size-6 shrink-0">
                <AvatarImage :src="director.avatar" :alt="director.name" />
                <AvatarFallback class="text-xs">{{ director.initials }}</AvatarFallback>
              </Avatar>
              <div class="truncate">
                <p class="text-foreground truncate font-medium">{{ director.name }}</p>
                <p class="text-muted-foreground truncate text-xs">{{ director.title.split('&')[0].trim() }}</p>
              </div>
            </div>
            <Badge
              wrap
              class="shrink-0 border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-700 dark:text-emerald-400"
            >
              {{ director.vote.split(' ')[0] }}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Structured Resolution Document Body -->
    <article class="border-border bg-card space-y-8 rounded-xl border p-6 shadow-xs sm:p-8">
      <!-- Legal Header Sub-Banner -->
      <div class="border-border space-y-2 border-b pb-6 text-center">
        <Badge wrap variant="outline" class="font-mono text-xs tracking-widest uppercase">
          Official Corporate Governance Record
        </Badge>
        <h2 class="text-foreground text-lg font-bold tracking-tight uppercase sm:text-xl md:text-2xl">
          Action by Unanimous Written Consent of the Board of Directors of {{ companyName }}
        </h2>
        <p class="text-muted-foreground mx-auto max-w-2xl text-xs">
          Pursuant to Section 141(f) of the General Corporation Law of the State of Delaware and the Amended and
          Restated Bylaws of the Corporation
        </p>
      </div>

      <!-- Formal Preamble -->
      <div
        class="border-border/80 bg-muted/20 text-muted-foreground rounded-lg border p-4 text-xs leading-relaxed sm:p-5 sm:text-sm"
      >
        <p>
          <strong class="text-foreground">THE UNDERSIGNED</strong>, constituting all the active members of the Board of
          Directors of <strong class="text-foreground">{{ companyName }}</strong
          >, a corporation duly organized and existing under the laws of the State of Delaware (the
          &ldquo;Corporation&rdquo;), do hereby consent to the adoption of the following resolutions and direct that
          this Unanimous Written Consent be filed with the minutes of the proceedings of the Board of Directors:
        </p>
      </div>

      <!-- Resolution 1: Equity Incentive Option Pool Expansion -->
      <section class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">01</span>
            <h3 class="text-foreground text-base font-bold sm:text-lg">
              Authorization and Adoption of the 2026 Equity Incentive Option Pool Expansion
            </h3>
          </div>
          <Badge wrap variant="secondary" class="font-mono text-xs">Capitalization &amp; Equity</Badge>
        </div>

        <div class="text-muted-foreground space-y-3 text-xs leading-relaxed sm:text-sm">
          <p class="italic">
            <strong class="text-foreground font-semibold not-italic">WHEREAS</strong>, the Board of Directors deems it
            to be in the best interests of the Corporation and its stockholders to expand the number of shares reserved
            under the 2026 Equity Incentive Plan in order to recruit, motivate, and retain vital engineering, product,
            and leadership talent;
          </p>
          <p>
            <strong class="text-foreground font-semibold">NOW, THEREFORE, BE IT RESOLVED</strong>, that the
            Corporation&rsquo;s 2026 Equity Incentive Plan be, and it hereby is, amended to increase the aggregate
            number of authorized shares of Common Stock reserved for issuance thereunder by an additional
            <strong class="text-foreground font-mono font-semibold">1,500,000 shares</strong> (increasing the overall
            unallocated option reserve from 10.0% to 15.0% of the Corporation&rsquo;s fully-diluted capitalization),
            effective as of the date hereof; and
          </p>
          <p>
            <strong class="text-foreground font-semibold">RESOLVED FURTHER</strong>, that the Compensation Committee of
            the Board of Directors and the executive officers of the Corporation are hereby authorized and empowered to
            grant options, stock appreciation rights, and restricted stock awards from said expanded pool in conformity
            with standard four-year vesting schedules (subject to a one-year cliff).
          </p>
        </div>

        <!-- Key Terms Summary Box 1 -->
        <div class="border-border/60 bg-muted/15 grid grid-cols-2 gap-3 rounded-lg border p-3.5 text-xs sm:grid-cols-4">
          <div>
            <span class="text-muted-foreground font-medium">Pool Addition</span>
            <p class="text-foreground mt-0.5 font-mono font-bold tabular-nums">1,500,000 Common Shares</p>
          </div>
          <div>
            <span class="text-muted-foreground font-medium">Reserve Ratio</span>
            <p class="text-foreground mt-0.5 font-mono font-bold tabular-nums">10.0% → 15.0% FD</p>
          </div>
          <div>
            <span class="text-muted-foreground font-medium">Vesting Baseline</span>
            <p class="text-foreground mt-0.5 font-bold">4-Year / 1-Year Cliff</p>
          </div>
          <div>
            <span class="text-muted-foreground font-medium">Committee Scope</span>
            <p class="text-foreground mt-0.5 font-bold">Full Delegation</p>
          </div>
        </div>
      </section>

      <Separator />

      <!-- Resolution 2: Approval of Cloudflare Pages Infrastructure Agreement -->
      <section class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">02</span>
            <h3 class="text-foreground text-base font-bold sm:text-lg">
              Approval of Cloudflare Pages Infrastructure Enterprise Agreement
            </h3>
          </div>
          <Badge wrap variant="secondary" class="font-mono text-xs">Infrastructure &amp; Hosting</Badge>
        </div>

        <div class="text-muted-foreground space-y-3 text-xs leading-relaxed sm:text-sm">
          <p class="italic">
            <strong class="text-foreground font-semibold not-italic">WHEREAS</strong>, the Corporation operates a
            mission-critical global UI registry distributed across multi-region edge nodes requiring continuous uptime
            SLAs, global caching, DDoS mitigation, and sub-10ms distribution latency;
          </p>
          <p>
            <strong class="text-foreground font-semibold">NOW, THEREFORE, BE IT RESOLVED</strong>, that the 3-Year
            Enterprise Master Services Agreement with Cloudflare, Inc. for Pages Enterprise Infrastructure, Global Edge
            Caching, and Advanced Threat Defense, with an annualized commitment not to exceed
            <strong class="text-foreground font-mono font-semibold">$180,000.00 USD</strong>, be, and it hereby is,
            ratified, confirmed, and approved in all respects; and
          </p>
          <p>
            <strong class="text-foreground font-semibold">RESOLVED FURTHER</strong>, that the Chief Executive Officer
            and Chief Technology Officer be, and each of them individually hereby is, authorized, directed, and
            empowered to finalize, execute, and deliver said Enterprise Agreement on behalf of the Corporation.
          </p>
        </div>

        <!-- Key Terms Summary Box 2 -->
        <div class="border-border/60 bg-muted/15 grid grid-cols-2 gap-3 rounded-lg border p-3.5 text-xs sm:grid-cols-4">
          <div>
            <span class="text-muted-foreground font-medium">Service Provider</span>
            <p class="text-foreground mt-0.5 font-bold">Cloudflare, Inc.</p>
          </div>
          <div>
            <span class="text-muted-foreground font-medium">Contract Duration</span>
            <p class="text-foreground mt-0.5 font-bold">36 Months (3 Years)</p>
          </div>
          <div>
            <span class="text-muted-foreground font-medium">Annual Commitment Cap</span>
            <p class="text-foreground mt-0.5 font-mono font-bold tabular-nums">$180,000.00 USD / yr</p>
          </div>
          <div>
            <span class="text-muted-foreground font-medium">Uptime Guarantee</span>
            <p class="text-foreground mt-0.5 font-mono font-bold tabular-nums">99.99% Enterprise SLA</p>
          </div>
        </div>
      </section>

      <Separator />

      <!-- Resolution 3: Appointment of Independent Legal Counsel -->
      <section class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">03</span>
            <h3 class="text-foreground text-base font-bold sm:text-lg">Appointment of Independent Legal Counsel</h3>
          </div>
          <Badge wrap variant="secondary" class="font-mono text-xs">Corporate Governance &amp; Counsel</Badge>
        </div>

        <div class="text-muted-foreground space-y-3 text-xs leading-relaxed sm:text-sm">
          <p class="italic">
            <strong class="text-foreground font-semibold not-italic">WHEREAS</strong>, the Corporation requires
            distinguished outside corporate and securities counsel for intellectual property licensing, SOC 2 Type II
            compliance oversight, and upcoming institutional growth financing rounds;
          </p>
          <p>
            <strong class="text-foreground font-semibold">NOW, THEREFORE, BE IT RESOLVED</strong>, that the engagement
            of <strong class="text-foreground">Wilson Sonsini Goodrich &amp; Rosati P.C.</strong> as Independent Legal
            Counsel to the Corporation be, and it hereby is, approved and ratified; and
          </p>
          <p>
            <strong class="text-foreground font-semibold">RESOLVED FURTHER</strong>, that the executive officers of the
            Corporation be, and each of them hereby is, authorized to execute customary engagement documentation and
            approve standard retainer fee schedules.
          </p>
        </div>

        <!-- Key Terms Summary Box 3 -->
        <div class="border-border/60 bg-muted/15 grid grid-cols-2 gap-3 rounded-lg border p-3.5 text-xs sm:grid-cols-4">
          <div>
            <span class="text-muted-foreground font-medium">Appointed Firm</span>
            <p class="text-foreground mt-0.5 truncate font-bold">Wilson Sonsini Goodrich &amp; Rosati</p>
          </div>
          <div>
            <span class="text-muted-foreground font-medium">Primary Focus</span>
            <p class="text-foreground mt-0.5 font-bold">Corp Governance &amp; IP</p>
          </div>
          <div>
            <span class="text-muted-foreground font-medium">Billing Model</span>
            <p class="text-foreground mt-0.5 font-bold">Standard Hourly + Retainer</p>
          </div>
          <div>
            <span class="text-muted-foreground font-medium">Jurisdictional Scope</span>
            <p class="text-foreground mt-0.5 font-bold">Delaware / Federal Tech</p>
          </div>
        </div>
      </section>

      <Separator />

      <!-- Omnibus General Authorization Clause -->
      <section class="space-y-3">
        <div class="flex items-center gap-2">
          <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">04</span>
          <h3 class="text-foreground text-base font-bold sm:text-lg">
            Omnibus Authorization and Ratification of Prior Actions
          </h3>
        </div>

        <div class="text-muted-foreground space-y-3 text-xs leading-relaxed sm:text-sm">
          <p>
            <strong class="text-foreground font-semibold">RESOLVED</strong>, that the officers of the Corporation be,
            and each of them hereby is, authorized, directed, and empowered, in the name and on behalf of the
            Corporation, to take all such further actions, pay all fees, and execute and deliver all such further
            agreements, certificates, notices, and instruments as may be necessary, proper, or advisable to carry out
            the full purpose and intent of the foregoing resolutions; and
          </p>
          <p>
            <strong class="text-foreground font-semibold">RESOLVED FURTHER</strong>, that all actions heretofore taken
            by any officer or director of the Corporation in connection with any matter referred to in the foregoing
            resolutions are hereby ratified, confirmed, and approved in all respects as the authorized act and deed of
            the Corporation.
          </p>
        </div>
      </section>
    </article>

    <!-- Director Signature Execution Blocks -->
    <section class="space-y-4">
      <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-foreground text-base font-bold sm:text-lg">
            Director Signature Execution &amp; Electronic Certification
          </h2>
          <p class="text-muted-foreground text-xs">
            Executed by all directors of the Corporation pursuant to Section 141(f) of the Delaware General Corporation
            Law
          </p>
        </div>
        <Badge
          wrap
          class="self-start border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-700 sm:self-auto dark:text-emerald-400"
        >
          <CheckCircle2 class="mr-1 size-3" />
          3 of 3 Signatures Authenticated
        </Badge>
      </div>

      <!-- 3 Director Signing Tiles Grid -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card
          v-for="director in directors"
          :key="director.name"
          class="border-border/80 bg-card hover:border-border shadow-xs transition-colors"
        >
          <CardHeader class="p-4 pb-2">
            <div class="flex items-center justify-between gap-2">
              <div class="flex min-w-0 items-center gap-2.5">
                <Avatar class="border-border size-10 shrink-0 border">
                  <AvatarImage :src="director.avatar" :alt="director.name" />
                  <AvatarFallback class="text-xs font-bold">{{ director.initials }}</AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                  <CardTitle class="truncate text-sm font-semibold">{{ director.name }}</CardTitle>
                  <CardDescription class="truncate text-xs">{{ director.title }}</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent class="space-y-3 p-4 pt-2 text-xs">
            <!-- Digital Signature Calligraphy Box -->
            <div
              class="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-center dark:bg-emerald-950/20"
            >
              <div class="text-muted-foreground mb-1 flex items-center justify-between text-xs">
                <span class="font-mono text-xs">Digital Signature</span>
                <Badge
                  wrap
                  variant="outline"
                  class="border-emerald-500/40 bg-emerald-500/10 font-mono text-xs text-emerald-700 dark:text-emerald-400"
                >
                  <Check class="mr-1 size-2.5" /> Verified
                </Badge>
              </div>

              <!-- Cursive signature representation -->
              <div class="my-1.5 flex h-12 items-center justify-center">
                <span class="text-xl font-medium tracking-wide text-emerald-800 italic dark:text-emerald-300">
                  {{ director.signature }}
                </span>
              </div>

              <div
                class="text-muted-foreground flex items-center justify-center gap-1 border-t border-emerald-500/20 pt-1 font-mono text-xs"
              >
                <ShieldCheck class="size-3 text-emerald-600 dark:text-emerald-400" />
                <span>e-Signed via FIDO2 / PKI Ledger</span>
              </div>
            </div>

            <!-- Signature Metadata List -->
            <div class="text-muted-foreground space-y-1.5 font-mono text-xs">
              <div class="flex items-center justify-between">
                <span>Executed:</span>
                <span class="text-foreground font-semibold tabular-nums">{{ director.signedDate }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Auth Protocol:</span>
                <span class="text-foreground max-w-[170px] truncate text-right font-semibold">{{
                  director.authMethod
                }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Certificate Hash:</span>
                <span class="text-foreground font-semibold">{{ director.certId }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>

    <!-- Corporate Seal & Cryptographic Certificate Audit Strip -->
    <Card class="border-border bg-muted/20 border shadow-xs">
      <CardContent class="flex flex-col gap-4 p-5 text-xs lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center gap-3">
          <!-- Corporate Seal Emblem SVG -->
          <div
            class="bg-card relative flex size-12 shrink-0 items-center justify-center rounded-full border border-amber-500/40 p-1 shadow-xs"
          >
            <svg
              class="size-full text-amber-600 dark:text-amber-400"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="46" stroke="currentColor" stroke-width="2" stroke-dasharray="3 2" />
              <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="1.5" />
              <path
                d="M50 18 L60 38 L82 38 L64 52 L70 74 L50 60 L30 74 L36 52 L18 38 L40 38 Z"
                stroke="currentColor"
                stroke-width="1.5"
                fill="currentColor"
                fill-opacity="0.1"
              />
              <circle cx="50" cy="50" r="10" stroke="currentColor" stroke-width="1" />
            </svg>
          </div>

          <div>
            <div class="flex items-center gap-2">
              <span class="text-foreground font-bold">Official Corporate Seal &amp; Immutable Minutes Vault</span>
              <Badge
                wrap
                variant="outline"
                class="border-emerald-500/30 font-mono text-xs text-emerald-600 dark:text-emerald-400"
              >
                Tamper-Proof
              </Badge>
            </div>
            <p class="text-muted-foreground mt-0.5">
              State of Delaware Division of Corporations • Entity File #7849201 • RFC 3161 Qualified Timestamping
            </p>
          </div>
        </div>

        <!-- Cryptographic Audit Hash & Verification Action -->
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-1.5 font-mono">
            <span class="text-muted-foreground">SHA-256 Digest:</span>
            <button
              type="button"
              class="hover:bg-muted focus-visible:ring-ring border-border bg-card text-foreground inline-flex min-h-6 items-center gap-1 rounded border px-2 py-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
              title="Copy SHA-256 Cryptographic Digest"
              @click="handleCopyDigest"
            >
              <span class="tabular-nums">d4e9a8...810b492</span>
              <Check v-if="copiedDigest" class="size-3 text-emerald-600 dark:text-emerald-400" />
              <Copy v-else class="text-muted-foreground size-3" />
            </button>
          </div>

          <Badge wrap variant="secondary" class="gap-1 font-mono text-xs">
            <Lock class="size-3 text-emerald-600 dark:text-emerald-400" />
            <span>256-Bit Vault Sealed</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
