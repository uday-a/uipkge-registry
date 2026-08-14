<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, Building2, Calendar, CheckCircle2, Lock, Server } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface SlaGuarantee {
  title: string
  metric: string
  description: string
  icon: string
}

export interface ComplianceCert {
  id: string
  name: string
  status: string
  badgeVariant?: 'default' | 'outline' | 'secondary'
}

export interface PricingEnterpriseSlaCardProps {
  title?: string
  description?: string
  guarantees?: SlaGuarantee[]
  certifications?: ComplianceCert[]
  class?: string
}

const DEFAULT_GUARANTEES: SlaGuarantee[] = [
  {
    title: 'High-Availability SLA',
    metric: '99.999%',
    description: 'Financial penalty-backed monthly uptime commitment across multi-region clusters.',
    icon: 'ShieldCheck',
  },
  {
    title: 'P1 Incident Response',
    metric: '< 15 mins',
    description: 'Direct paging to designated Staff Infrastructure Commanders 24/7/365.',
    icon: 'Headphones',
  },
  {
    title: 'Global Edge TTFB',
    metric: '< 12ms',
    description: 'Sub-15ms Time-To-First-Byte guaranteed via Anycast network mesh.',
    icon: 'Zap',
  },
  {
    title: 'Custom Legal & DPA',
    metric: 'Bespoke',
    description: 'Dedicated legal counsel review, redline allowances, and customized BAAs.',
    icon: 'Scale',
  },
]

const DEFAULT_CERTS: ComplianceCert[] = [
  { id: 'soc2', name: 'SOC 2 Type II Certified', status: 'Continuous Audit' },
  { id: 'hipaa', name: 'HIPAA Compliant BAA', status: 'Available' },
  { id: 'iso27001', name: 'ISO/IEC 27001:2022', status: 'Certified' },
  { id: 'gdpr', name: 'GDPR & CCPA Verified', status: 'Compliant' },
  { id: 'fedramp', name: 'FedRAMP In-Process', status: 'High Baseline' },
]

const props = withDefaults(defineProps<PricingEnterpriseSlaCardProps>(), {
  title: 'Mission-critical infrastructure with contractual legal guarantees.',
  description:
    'Tailored enterprise licensing, custom security reviews, isolated VPC deployments, and white-glove migration engineering.',
})

const activeGuarantees = computed(() => props.guarantees ?? DEFAULT_GUARANTEES)
const activeCertifications = computed(() => props.certifications ?? DEFAULT_CERTS)

const isMeetingRequested = ref(false)

function requestMeeting() {
  isMeetingRequested.value = true
  setTimeout(() => {
    isMeetingRequested.value = false
  }, 3000)
}
</script>

<template>
  <section
    data-slot="pricing-enterprise-sla-card"
    :class="cn('bg-background relative overflow-hidden py-16 sm:py-24', props.class)"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <a
          href="#enterprise-contract"
          class="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
        >
          <Building2 class="text-primary size-3.5" />
          <span>Enterprise Custom Contracting</span>
          <ArrowRight class="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
        </a>

        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          {{ title }}
        </h2>

        <p class="text-muted-foreground text-base sm:text-lg">
          {{ description }}
        </p>
      </div>

      <!-- Main Enterprise Showcase Container -->
      <div class="border-border bg-card mt-12 overflow-hidden rounded-2xl border shadow-sm">
        <div class="divide-border grid grid-cols-1 divide-y lg:grid-cols-12 lg:divide-x lg:divide-y-0">
          <!-- Left: SLA Guarantees & Contractual Commitments (7 Cols) -->
          <div class="space-y-8 p-8 lg:col-span-7">
            <div class="space-y-1">
              <div class="text-primary text-xs font-bold tracking-wider uppercase">Service Level Agreement</div>
              <h3 class="text-foreground text-xl font-bold">Penalty-Backed Contractual Metrics</h3>
              <p class="text-muted-foreground text-xs">
                Every commitment is codified into your master service agreement with direct financial remedies.
              </p>
            </div>

            <!-- Guarantees 2x2 Grid -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                v-for="(item, idx) in activeGuarantees"
                :key="idx"
                class="border-border bg-muted/20 space-y-2 rounded-xl border p-4"
              >
                <div class="flex items-center justify-between">
                  <span class="text-foreground text-xs font-bold">{{ item.title }}</span>
                  <span class="text-primary font-mono text-xs font-bold">{{ item.metric }}</span>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  {{ item.description }}
                </p>
              </div>
            </div>

            <!-- Compliance & Governance Strip -->
            <div class="space-y-3 pt-2">
              <div class="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                <Lock class="text-primary size-3.5" />
                <span>Security & Regulatory Attestations</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-for="cert in activeCertifications"
                  :key="cert.id"
                  variant="outline"
                  class="border-border bg-background text-foreground gap-1.5 px-3 py-1 text-xs font-medium"
                >
                  <CheckCircle2 class="size-3 text-emerald-500" />
                  <span>{{ cert.name }}</span>
                  <span class="text-muted-foreground font-mono text-xs">({{ cert.status }})</span>
                </Badge>
              </div>
            </div>
          </div>

          <!-- Right: Direct Enterprise Solution Consultation Card (5 Cols) -->
          <div class="bg-muted/30 flex flex-col justify-between space-y-6 p-8 lg:col-span-5">
            <div class="space-y-4">
              <div class="border-border flex items-center justify-between border-b pb-3">
                <div class="flex items-center gap-2">
                  <Server class="text-primary size-4" />
                  <span class="text-foreground text-sm font-semibold">Custom Private Deployment</span>
                </div>
                <Badge
                  variant="outline"
                  class="border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-500"
                >
                  Tailored
                </Badge>
              </div>

              <div class="space-y-2.5">
                <div class="text-foreground text-xs font-bold">Included with Custom Tier:</div>
                <ul class="text-muted-foreground space-y-2 text-xs">
                  <li class="flex items-center gap-2">
                    <CheckCircle2 class="size-3.5 shrink-0 text-emerald-500" />
                    <span>Dedicated AWS / GCP VPC peering or self-hosted air-gap</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <CheckCircle2 class="size-3.5 shrink-0 text-emerald-500" />
                    <span>Custom SAML 2.0 / Okta / Azure AD SCIM provisioning</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <CheckCircle2 class="size-3.5 shrink-0 text-emerald-500" />
                    <span>Dedicated Solution Architect & design system migration team</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <CheckCircle2 class="size-3.5 shrink-0 text-emerald-500" />
                    <span>Invoiced payment via ACH, Wire Transfer, or AWS Marketplace</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Action Block -->
            <div class="border-border space-y-3 border-t pt-4">
              <Button class="w-full gap-2 shadow-xs" size="lg" @click="requestMeeting">
                <Calendar class="size-4" />
                <span>{{
                  isMeetingRequested ? 'Direct Routing to Architect...' : 'Book Enterprise Technical Review'
                }}</span>
              </Button>
              <div class="text-muted-foreground text-center text-xs">
                Average executive response time: <strong>under 20 minutes</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
