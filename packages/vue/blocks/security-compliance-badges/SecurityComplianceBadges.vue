<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, CheckCircle2, Copy, Download, RefreshCw, ShieldCheck } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface CompliancePillar {
  id: string
  name: string
  standard: string
  status: string
  auditor: string
  lastAudit: string
  sha256: string
  highlights: string[]
}

const pillars: CompliancePillar[] = [
  {
    id: 'soc2',
    name: 'SOC2 Type II Certified',
    standard: 'AICPA Trust Services Criteria (Security, Availability, Confidentiality)',
    status: 'Clean Opinion (Zero Exceptions)',
    auditor: 'Schellman & Company, LLC',
    lastAudit: 'Q4 2025 Audit Period',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    highlights: [
      'Continuous 24/7 automated control monitoring via Drata',
      'Annual independent black-box & white-box penetration testing',
      'Mandatory hardware key 2FA (WebAuthn / FIDO2) across all staff',
      'Immutable tamper-evident centralized audit logs with 365-day retention',
    ],
  },
  {
    id: 'iso27001',
    name: 'ISO/IEC 27001:2022',
    standard: 'Information Security Management System (ISMS)',
    status: 'Globally Certified',
    auditor: 'BSI Group Global',
    lastAudit: 'Continuous Surveillance',
    sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    highlights: [
      'Strict cryptographic key management with automated rotation',
      'Zero vendor data sharing or telemetry monetization guarantees',
      'Comprehensive disaster recovery with RPO < 1 min, RTO < 15 mins',
      'Physical security auditing of all tier-4 sovereign edge hosting locations',
    ],
  },
  {
    id: 'gdpr',
    name: 'GDPR & CCPA Compliant',
    standard: 'EU 2016/679 & California Consumer Privacy Act',
    status: 'Strict Privacy Tier',
    auditor: 'Internal Privacy Council + DPO',
    lastAudit: 'Live Continuous Compliance',
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    highlights: [
      'Zero third-party tracking cookies or marketing beacons in registry AST',
      'Automated self-serve data portability & deletion API endpoints',
      'EU Standard Contractual Clauses (SCCs) baked into standard DPA',
      'Encrypted localized edge caches with sovereign residency enforcement',
    ],
  },
  {
    id: 'hipaa',
    name: 'HIPAA & HITECH Ready',
    standard: 'Health Insurance Portability and Accountability Act',
    status: 'BAA Eligible',
    auditor: 'Coalfire Systems',
    lastAudit: 'Annual Attestation',
    sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    highlights: [
      'AES-256 encryption for data at rest and TLS 1.3 in transit',
      'Automated Business Associate Agreement (BAA) execution for enterprise tiers',
      'Strict role-based access control (RBAC) with just-in-time privilege escalation',
      'PHI isolation architecture with zero persistent client-side caching',
    ],
  },
]

const activeTab = ref<string>('soc2')
const copiedHash = ref(false)
const isDownloadingReport = ref(false)

const currentPillar = computed(() => pillars.find((p) => p.id === activeTab.value)!)

function copyHash() {
  navigator.clipboard.writeText(currentPillar.value.sha256)
  copiedHash.value = true
  setTimeout(() => (copiedHash.value = false), 2000)
}

function mockDownload() {
  isDownloadingReport.value = true
  setTimeout(() => {
    isDownloadingReport.value = false
  }, 1200)
}
</script>

<template>
  <section
    data-slot="security-compliance-badges"
    class="bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
  >
    <!-- Ambient Radial Glow -->
    <div
      class="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-80 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-xl"
    />

    <div class="mx-auto max-w-6xl space-y-12">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <Badge variant="secondary" class="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
          <ShieldCheck class="size-3.5 text-emerald-500" />
          Enterprise Trust & Cryptographic Security
        </Badge>
        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          Built for the most compliance-sensitive architectures.
        </h2>
        <p class="text-muted-foreground text-base">
          Zero runtime bloat, zero tracking beacons, and independent third-party verified attestations for your SecOps
          team.
        </p>
      </div>

      <!-- Compliance Badges 4-Tile Preview Row -->
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <button
          v-for="p in pillars"
          :key="p.id"
          type="button"
          class="group relative overflow-hidden rounded-2xl border p-4 text-left transition-all"
          :class="
            activeTab === p.id
              ? 'border-emerald-500/80 bg-emerald-500/5 shadow-md ring-1 ring-emerald-500/30'
              : 'border-border bg-card/70 hover:border-border hover:bg-card'
          "
          @click="activeTab = p.id"
        >
          <div class="mb-3 flex items-center justify-between">
            <div
              class="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400"
            >
              <ShieldCheck class="size-4" />
            </div>
            <span
              class="size-2 rounded-full"
              :class="activeTab === p.id ? 'animate-pulse bg-emerald-500' : 'bg-muted'"
            />
          </div>

          <h3 class="text-foreground truncate font-mono text-xs font-bold">{{ p.name.split(' ')[0] }}</h3>
          <p class="text-muted-foreground mt-0.5 truncate text-xs">{{ p.status }}</p>
        </button>
      </div>

      <!-- Interactive Attestation & Security Workbench Card -->
      <Card
        class="border-border bg-card/95 space-y-6 overflow-hidden rounded-2xl p-6 shadow-sm backdrop-blur-md sm:p-8"
      >
        <!-- Workbench Top Details -->
        <div class="border-border/80 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <h3 class="text-foreground font-mono text-xl font-bold">{{ currentPillar.name }}</h3>
              <Badge
                variant="outline"
                class="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
              >
                Verified
              </Badge>
            </div>
            <p class="text-muted-foreground font-mono text-xs">{{ currentPillar.standard }}</p>
          </div>

          <Button size="sm" variant="outline" class="shrink-0 gap-2 font-mono text-xs" @click="mockDownload">
            <RefreshCw v-if="isDownloadingReport" class="text-primary size-3.5 animate-spin" />
            <Download v-else class="text-muted-foreground size-3.5" />
            <span>{{ isDownloadingReport ? 'Preparing DPA Bundle...' : 'Download Security Whitepaper' }}</span>
          </Button>
        </div>

        <!-- Audit Details Grid -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Left: Key Controls & Technical Enforcements -->
          <div class="space-y-3">
            <p class="text-muted-foreground font-mono text-xs tracking-wider uppercase">Key Technical Controls</p>
            <ul class="space-y-2.5">
              <li
                v-for="(item, idx) in currentPillar.highlights"
                :key="idx"
                class="text-foreground/90 flex items-start gap-2.5 text-xs leading-relaxed"
              >
                <CheckCircle2 class="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>

          <!-- Right: Auditor & Cryptographic SHA-256 Fingerprint -->
          <div class="border-border bg-muted/20 flex flex-col justify-between space-y-4 rounded-xl border p-5">
            <div class="space-y-3">
              <div class="flex items-center justify-between font-mono text-xs">
                <span class="text-muted-foreground">Independent Auditor:</span>
                <span class="text-foreground font-semibold">{{ currentPillar.auditor }}</span>
              </div>
              <div class="flex items-center justify-between font-mono text-xs">
                <span class="text-muted-foreground">Audit Cycle:</span>
                <span class="text-foreground">{{ currentPillar.lastAudit }}</span>
              </div>
              <div class="flex items-center justify-between font-mono text-xs">
                <span class="text-muted-foreground">CVE Vulnerability Scan:</span>
                <span class="font-bold text-emerald-500">0 High &bull; 0 Critical</span>
              </div>
            </div>

            <!-- SHA-256 Hash Box -->
            <div class="border-border/60 space-y-1.5 border-t pt-3">
              <div class="text-muted-foreground flex items-center justify-between font-mono text-xs">
                <span>Attestation PDF SHA-256 Fingerprint:</span>
                <button type="button" class="text-primary flex items-center gap-1 hover:underline" @click="copyHash">
                  <Check v-if="copiedHash" class="size-3 text-emerald-500" />
                  <Copy v-else class="size-3" />
                  <span>{{ copiedHash ? 'Copied' : 'Copy Hash' }}</span>
                </button>
              </div>
              <p
                class="text-muted-foreground bg-background/80 border-border rounded border p-2 font-mono text-xs break-all select-all"
              >
                {{ currentPillar.sha256 }}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </section>
</template>
