<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  AlertCircle,
  BadgeCheck,
  Check,
  CheckCircle2,
  Download,
  FileCheck,
  Gavel,
  Lock,
  PenTool,
  Printer,
  RotateCcw,
  Scale,
  ShieldCheck,
  Users,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export type AgreementType = 'mutual' | 'unilateral'
export type TermOption = '2 Years' | '3 Years' | '5 Years' | 'Perpetual for Trade Secrets'
export type JurisdictionOption = 'delaware' | 'california' | 'newyork' | 'england' | 'singapore'
export type SignatureFont = 'serif' | 'script' | 'sans'

export interface NdaAgreementGeneratorProps {
  class?: HTMLAttributes['class']
  initialSigned?: boolean
  initialAgreementType?: AgreementType
  initialTerm?: TermOption
  initialJurisdiction?: JurisdictionOption
}

const props = withDefaults(defineProps<NdaAgreementGeneratorProps>(), {
  initialSigned: false,
  initialAgreementType: 'mutual',
  initialTerm: '3 Years',
  initialJurisdiction: 'delaware',
})

// Generator State
const agreementType = ref<AgreementType>(props.initialAgreementType)
const jurisdiction = ref<JurisdictionOption>(props.initialJurisdiction)
const confidentialityTerm = ref<TermOption>(props.initialTerm)

// Parties State
const disclosingCompany = ref('UIPKGE Technologies Inc.')
const disclosingSignatory = ref('Sarah Jenkins')
const disclosingTitle = ref('VP of Architecture & Ecosystem')
const disclosingEmail = ref('s.jenkins@uipkge.dev')

const receivingCompany = ref('Vertex Solutions Corp.')
const receivingSignatory = ref('Marcus Vance')
const receivingTitle = ref('Chief Technology Officer')
const receivingEmail = ref('marcus.vance@vertexsolutions.io')

const purposeOfDisclosure = ref(
  'Evaluation of potential architectural partnership, proprietary registry protocols, and API integration.',
)

// Protective Clauses Toggles
const clauseNonSolicit = ref(true)
const clauseInjunctiveRelief = ref(true)
const clauseReturnMaterials = ref(true)
const clausePermittedDisclosures = ref(true)

// Signature State
const isSigned = ref(props.initialSigned)
const signatureFont = ref<SignatureFont>('serif')
const signerName = ref('Marcus Vance')
const eConsentAgreed = ref(true)
const downloadStatus = ref(false)
const draftSavedStatus = ref(false)

// Jurisdiction Definitions
const jurisdictionMap: Record<JurisdictionOption, { name: string; statute: string; venue: string; tag: string }> = {
  delaware: {
    name: 'State of Delaware, United States',
    statute: 'General Corporation Law of Delaware (DGCL) & Court of Chancery',
    venue: 'Wilmington, Delaware, USA',
    tag: 'US-DE',
  },
  california: {
    name: 'State of California, United States',
    statute: 'California Uniform Trade Secrets Act (Cal. Civ. Code § 3426)',
    venue: 'San Francisco, California, USA',
    tag: 'US-CA',
  },
  newyork: {
    name: 'State of New York, United States',
    statute: 'New York Commercial Division Jurisprudence & General Obligations Law',
    venue: 'New York, New York, USA',
    tag: 'US-NY',
  },
  england: {
    name: 'England & Wales, United Kingdom',
    statute: 'Laws of England and Wales & High Court of Justice (Commercial Court)',
    venue: 'London, United Kingdom',
    tag: 'UK-EW',
  },
  singapore: {
    name: 'Republic of Singapore (SIAC)',
    statute: 'International Arbitration Act & Singapore International Arbitration Centre',
    venue: 'Singapore (SIAC Rules)',
    tag: 'SG-SIAC',
  },
}

const currentJurisdiction = computed(() => jurisdictionMap[jurisdiction.value])

const termText = computed(() => {
  switch (confidentialityTerm.value) {
    case '2 Years':
      return 'two (2) years from the Effective Date'
    case '3 Years':
      return 'three (3) years from the Effective Date'
    case '5 Years':
      return 'five (5) years from the Effective Date'
    case 'Perpetual for Trade Secrets':
      return 'five (5) years for general Confidential Information, and perpetually for all source code, cryptographic primitives, and core trade secrets'
    default:
      return 'three (3) years from the Effective Date'
  }
})

const activeClausesCount = computed(() => {
  let count = 0
  if (clauseNonSolicit.value) count++
  if (clauseInjunctiveRelief.value) count++
  if (clauseReturnMaterials.value) count++
  if (clausePermittedDisclosures.value) count++
  return count
})

const canSign = computed(() => {
  return eConsentAgreed.value && signerName.value.trim().length > 0 && !isSigned.value
})

function signAgreement() {
  if (!canSign.value) return
  isSigned.value = true
}

function resetWorkflow() {
  isSigned.value = false
  downloadStatus.value = false
  draftSavedStatus.value = false
}

function handleSaveDraft() {
  draftSavedStatus.value = true
  setTimeout(() => {
    draftSavedStatus.value = false
  }, 2200)
}

function handleExportPdf() {
  downloadStatus.value = true
  setTimeout(() => {
    downloadStatus.value = false
  }, 2500)
}

function handlePrint() {
  if (typeof window !== 'undefined') {
    window.print()
  }
}
</script>

<template>
  <div data-slot="nda-agreement-generator" :class="cn('bg-background text-foreground w-full', props.class)">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <!-- Main Header Bar -->
      <header class="border-border bg-card mb-6 rounded-xl border p-5 shadow-xs sm:p-6">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-muted-foreground text-xs font-medium">Instrument:</span>
              <span class="text-foreground font-mono text-xs font-semibold tabular-nums">#NDA-2026-88F</span>
              <span class="text-muted-foreground text-xs">&bull;</span>
              <Badge variant="outline" class="border-primary/30 text-primary font-mono text-xs">
                {{ agreementType === 'mutual' ? 'Mutual / Bilateral' : 'Unilateral' }}
              </Badge>
              <span class="text-muted-foreground text-xs">&bull;</span>
              <Badge
                v-if="isSigned"
                class="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
              >
                <BadgeCheck class="size-3.5" />
                <span>Fully Executed &amp; Legally Binding</span>
              </Badge>
              <Badge
                v-else
                class="gap-1.5 border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400"
              >
                <AlertCircle class="size-3.5" />
                <span>Ready for E-Signature</span>
              </Badge>
            </div>
            <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
              Non-Disclosure Agreement (NDA) Generator
            </h1>
            <p class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <Scale class="size-4 shrink-0" />
              <span>Governing Jurisdiction: {{ currentJurisdiction.name }} &bull; Effective Aug 21, 2026</span>
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center gap-2.5">
            <Button variant="outline" size="sm" class="gap-1.5 text-xs" @click="handlePrint">
              <Printer class="size-4" />
              <span>Print</span>
            </Button>
            <Button variant="outline" size="sm" class="gap-1.5 text-xs" @click="handleSaveDraft">
              <FileCheck class="size-4" />
              <span>{{ draftSavedStatus ? 'Draft Saved ✓' : 'Save Draft' }}</span>
            </Button>
            <Button
              aria-label="Download attachment"
              size="sm"
              class="gap-1.5 text-xs font-semibold shadow-xs"
              :variant="isSigned ? 'default' : 'outline'"
              @click="handleExportPdf"
            >
              <Download class="size-4" />
              <span>{{
                downloadStatus ? 'Exporting PDF...' : isSigned ? 'Export Signed PDF' : 'Download Draft PDF'
              }}</span>
            </Button>
            <Button
              v-if="isSigned"
              variant="outline"
              size="sm"
              class="border-muted-foreground/30 gap-1.5 text-xs"
              @click="resetWorkflow"
            >
              <RotateCcw class="size-3.5" />
              <span>Reset Demo</span>
            </Button>
          </div>
        </div>

        <Separator class="my-4" />

        <!-- Quick Parameter Switches in Header -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Agreement Type Toggle -->
          <div class="bg-muted/40 border-border rounded-lg border p-3">
            <label class="text-muted-foreground block text-xs font-medium"> Agreement Type </label>
            <div class="bg-muted/60 mt-2 grid grid-cols-2 gap-1 rounded-md p-0.5">
              <button
                type="button"
                :class="
                  cn(
                    'rounded px-2.5 py-1 text-xs font-medium transition-colors',
                    agreementType === 'mutual'
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="agreementType = 'mutual'"
              >
                Mutual (Bilateral)
              </button>
              <button
                type="button"
                :class="
                  cn(
                    'rounded px-2.5 py-1 text-xs font-medium transition-colors',
                    agreementType === 'unilateral'
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )
                "
                @click="agreementType = 'unilateral'"
              >
                Unilateral
              </button>
            </div>
          </div>

          <!-- Jurisdiction Selector -->
          <div class="bg-muted/40 border-border rounded-lg border p-3">
            <label class="text-muted-foreground block text-xs font-medium"> Governing Jurisdiction </label>
            <div class="mt-2">
              <Select v-model="jurisdiction">
                <SelectTrigger class="bg-card h-8 text-xs font-medium">
                  <SelectValue placeholder="Select jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delaware">Delaware, USA</SelectItem>
                  <SelectItem value="california">California, USA</SelectItem>
                  <SelectItem value="newyork">New York, USA</SelectItem>
                  <SelectItem value="england">England &amp; Wales, UK</SelectItem>
                  <SelectItem value="singapore">Singapore (SIAC)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Term of Protection -->
          <div class="bg-muted/40 border-border rounded-lg border p-3">
            <label class="text-muted-foreground block text-xs font-medium"> Protection Term </label>
            <div class="mt-2">
              <Select v-model="confidentialityTerm">
                <SelectTrigger class="bg-card h-8 text-xs font-medium">
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2 Years">2 Years</SelectItem>
                  <SelectItem value="3 Years">3 Years (Standard)</SelectItem>
                  <SelectItem value="5 Years">5 Years</SelectItem>
                  <SelectItem value="Perpetual for Trade Secrets">Perpetual (Trade Secrets)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Active Protective Clauses Summary -->
          <div class="bg-muted/40 border-border rounded-lg border p-3">
            <label class="text-muted-foreground block text-xs font-medium"> Active Protective Covenants </label>
            <div class="mt-2 flex items-center justify-between">
              <span class="text-foreground text-xs font-semibold">{{ activeClausesCount }} of 4 Clauses Active</span>
              <Badge variant="secondary" class="font-mono text-xs tabular-nums">
                {{ Math.round((activeClausesCount / 4) * 100) }}% Coverage
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <!-- 2-Column Document Builder & Live Parchment Canvas -->
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <!-- Left Column: Builder, Clauses, Parties Form (40%) -->
        <aside class="space-y-6 lg:col-span-5">
          <!-- Contracting Parties Card -->
          <Card class="border-border bg-card shadow-xs">
            <CardHeader class="p-4 pb-2 sm:p-5 sm:pb-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md font-bold">
                    <Users class="size-4" />
                  </div>
                  <div>
                    <CardTitle class="text-sm font-semibold">Contracting Parties</CardTitle>
                    <CardDescription class="text-xs"
                      >Entities bound under this confidentiality covenants</CardDescription
                    >
                  </div>
                </div>
                <Badge variant="outline" class="font-mono text-xs">2 Legal Entities</Badge>
              </div>
            </CardHeader>
            <CardContent class="space-y-4 p-4 pt-2 sm:p-5 sm:pt-2">
              <!-- Disclosing Party -->
              <div class="border-border/80 bg-muted/20 space-y-2.5 rounded-lg border p-3.5">
                <div class="flex items-center justify-between">
                  <span class="text-foreground text-xs font-medium"> Party A &bull; Disclosing Entity </span>
                  <Badge variant="secondary" class="text-xs">Original Licensor</Badge>
                </div>
                <div>
                  <label class="text-muted-foreground block text-xs font-medium">Company Legal Name</label>
                  <Input
                    v-model="disclosingCompany"
                    size="small"
                    class="mt-1"
                    placeholder="e.g. UIPKGE Technologies Inc."
                  />
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="text-muted-foreground block text-xs font-medium">Authorized Signatory</label>
                    <Input v-model="disclosingSignatory" size="small" class="mt-1" placeholder="e.g. Sarah Jenkins" />
                  </div>
                  <div>
                    <label class="text-muted-foreground block text-xs font-medium">Corporate Title</label>
                    <Input v-model="disclosingTitle" size="small" class="mt-1" placeholder="e.g. VP of Architecture" />
                  </div>
                </div>
              </div>

              <!-- Receiving Party -->
              <div class="border-border/80 bg-muted/20 space-y-2.5 rounded-lg border p-3.5">
                <div class="flex items-center justify-between">
                  <span class="text-foreground text-xs font-medium"> Party B &bull; Receiving Entity </span>
                  <Badge variant="secondary" class="text-xs">Counterparty</Badge>
                </div>
                <div>
                  <label class="text-muted-foreground block text-xs font-medium">Recipient Company Name</label>
                  <Input
                    v-model="receivingCompany"
                    size="small"
                    class="mt-1"
                    placeholder="e.g. Vertex Solutions Corp."
                  />
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="text-muted-foreground block text-xs font-medium">Recipient Signatory</label>
                    <Input v-model="receivingSignatory" size="small" class="mt-1" placeholder="e.g. Marcus Vance" />
                  </div>
                  <div>
                    <label class="text-muted-foreground block text-xs font-medium">Corporate Title</label>
                    <Input
                      v-model="receivingTitle"
                      size="small"
                      class="mt-1"
                      placeholder="e.g. Chief Technology Officer"
                    />
                  </div>
                </div>
              </div>

              <!-- Purpose Statement -->
              <div>
                <label class="text-foreground block text-xs font-semibold"> Authorized Purpose of Disclosure </label>
                <p class="text-muted-foreground mt-0.5 text-xs">
                  Defines the strict commercial boundary for information exchange
                </p>
                <Input
                  v-model="purposeOfDisclosure"
                  size="middle"
                  class="mt-1.5 font-mono text-xs"
                  placeholder="e.g. Evaluation of architectural partnership..."
                />
              </div>
            </CardContent>
          </Card>

          <!-- Standard Clauses Customizer -->
          <Card class="border-border bg-card shadow-xs">
            <CardHeader class="p-4 pb-2 sm:p-5 sm:pb-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md font-bold">
                    <Gavel class="size-4" />
                  </div>
                  <div>
                    <CardTitle class="text-sm font-bold">Standard Legal Covenants</CardTitle>
                    <CardDescription class="text-xs"
                      >Toggle and enforce protective clauses in real time</CardDescription
                    >
                  </div>
                </div>
                <Badge variant="outline" class="font-mono text-xs">Custom Covenants</Badge>
              </div>
            </CardHeader>
            <CardContent class="space-y-3.5 p-4 pt-2 sm:p-5 sm:pt-2">
              <!-- Clause 1: Non-Solicitation -->
              <div
                class="border-border/80 bg-card hover:bg-muted/20 flex items-start justify-between gap-3 rounded-lg border p-3 transition-colors"
              >
                <div class="min-w-0 space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="text-foreground text-xs font-semibold">1. Non-Solicitation of Employees</p>
                    <Badge variant="secondary" class="text-xs">12 Months</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    Restricts either party from directly soliciting, recruiting, or hiring key technical personnel and
                    architects.
                  </p>
                </div>
                <Switch v-model="clauseNonSolicit" aria-label="Toggle Non-Solicitation Clause" />
              </div>

              <!-- Clause 2: Injunctive Relief -->
              <div
                class="border-border/80 bg-card hover:bg-muted/20 flex items-start justify-between gap-3 rounded-lg border p-3 transition-colors"
              >
                <div class="min-w-0 space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="text-foreground text-xs font-semibold">2. Injunctive &amp; Equitable Relief</p>
                    <Badge variant="secondary" class="text-xs">No Bond Required</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    Stipulates that breach causes irreparable harm, entitling Disclosing Party to emergency restraining
                    orders without posting a bond.
                  </p>
                </div>
                <Switch v-model="clauseInjunctiveRelief" aria-label="Toggle Injunctive Relief Clause" />
              </div>

              <!-- Clause 3: Return of Materials -->
              <div
                class="border-border/80 bg-card hover:bg-muted/20 flex items-start justify-between gap-3 rounded-lg border p-3 transition-colors"
              >
                <div class="min-w-0 space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="text-foreground text-xs font-semibold">3. Return &amp; Certified Destruction</p>
                    <Badge variant="secondary" class="text-xs">14 Calendar Days</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    Mandates formal return or certified cryptographic shredding of all confidential technical assets
                    within 14 days of request.
                  </p>
                </div>
                <Switch v-model="clauseReturnMaterials" aria-label="Toggle Return of Materials Clause" />
              </div>

              <!-- Clause 4: Permitted Disclosures -->
              <div
                class="border-border/80 bg-card hover:bg-muted/20 flex items-start justify-between gap-3 rounded-lg border p-3 transition-colors"
              >
                <div class="min-w-0 space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="text-foreground text-xs font-semibold">4. Permitted Compelled Disclosures</p>
                    <Badge variant="secondary" class="text-xs">Subpoena Carve-Out</Badge>
                  </div>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    Carves out court order / statutory subpoena compliance with mandatory prompt written notification to
                    the other party.
                  </p>
                </div>
                <Switch v-model="clausePermittedDisclosures" aria-label="Toggle Permitted Disclosures Clause" />
              </div>
            </CardContent>
          </Card>

          <!-- E-Signature Pad Execution Card -->
          <Card class="border-border bg-card shadow-xs">
            <CardHeader class="p-4 pb-2 sm:p-5 sm:pb-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md font-bold">
                    <PenTool class="size-4" />
                  </div>
                  <div>
                    <CardTitle class="text-sm font-bold">Electronic Signature Pad</CardTitle>
                    <CardDescription class="text-xs"
                      >Adopt official digital signature style for execution</CardDescription
                    >
                  </div>
                </div>
                <Badge :variant="isSigned ? 'default' : 'outline'" class="font-mono text-xs">
                  {{ isSigned ? 'Executed' : 'Signer 2/2' }}
                </Badge>
              </div>
            </CardHeader>
            <CardContent class="space-y-4 p-4 pt-2 sm:p-5 sm:pt-2">
              <!-- Signer Name Input -->
              <div>
                <label class="text-foreground block text-xs font-medium">Recipient Signatory Full Name</label>
                <Input
                  v-model="signerName"
                  :disabled="isSigned"
                  size="middle"
                  class="mt-1"
                  placeholder="e.g. Marcus Vance"
                />
              </div>

              <!-- Signature Style Picker -->
              <div>
                <label class="text-muted-foreground block text-xs font-medium">Adopted Typography Style</label>
                <div class="bg-muted/60 mt-1.5 grid grid-cols-3 gap-1 rounded-lg p-1">
                  <button
                    type="button"
                    :disabled="isSigned"
                    :class="
                      cn(
                        'rounded-md py-1.5 text-center text-xs font-medium transition-colors',
                        signatureFont === 'serif'
                          ? 'bg-card text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                        isSigned && 'cursor-not-allowed opacity-60',
                      )
                    "
                    @click="signatureFont = 'serif'"
                  >
                    Formal Serif
                  </button>
                  <button
                    type="button"
                    :disabled="isSigned"
                    :class="
                      cn(
                        'rounded-md py-1.5 text-center text-xs font-medium transition-colors',
                        signatureFont === 'script'
                          ? 'bg-card text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                        isSigned && 'cursor-not-allowed opacity-60',
                      )
                    "
                    @click="signatureFont = 'script'"
                  >
                    Script Elegance
                  </button>
                  <button
                    type="button"
                    :disabled="isSigned"
                    :class="
                      cn(
                        'rounded-md py-1.5 text-center text-xs font-medium transition-colors',
                        signatureFont === 'sans'
                          ? 'bg-card text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground',
                        isSigned && 'cursor-not-allowed opacity-60',
                      )
                    "
                    @click="signatureFont = 'sans'"
                  >
                    Modern Sans
                  </button>
                </div>
              </div>

              <!-- Visual Preview Box -->
              <div class="border-border bg-muted/20 relative rounded-lg border p-4 text-center">
                <p class="text-muted-foreground text-xs font-medium">Adopted Signature Preview</p>
                <div class="my-3 flex min-h-[52px] items-center justify-center">
                  <span
                    :class="
                      cn(
                        'text-foreground text-2xl transition-all select-none',
                        signatureFont === 'serif' && 'font-medium tracking-wide italic',
                        signatureFont === 'script' && 'font-medium tracking-widest italic',
                        signatureFont === 'sans' && 'font-semibold tracking-tight',
                      )
                    "
                  >
                    {{ signerName || 'Marcus Vance' }}
                  </span>
                </div>
                <div class="text-muted-foreground flex items-center justify-center gap-1.5 font-mono text-xs">
                  <ShieldCheck class="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>256-Bit eIDAS / ESIGN Act Compliant</span>
                </div>
              </div>

              <!-- Consent Checkbox -->
              <label class="text-muted-foreground flex cursor-pointer items-start gap-2.5 text-xs">
                <input
                  v-model="eConsentAgreed"
                  type="checkbox"
                  :disabled="isSigned"
                  class="text-primary focus:ring-ring border-border mt-0.5 size-4 rounded"
                />
                <span class="leading-relaxed">
                  I agree to execute this Non-Disclosure Agreement electronically and confirm my electronic signature
                  legally binds
                  <strong>{{ receivingCompany }}</strong> under the U.S. ESIGN Act and {{ currentJurisdiction.name }}.
                </span>
              </label>

              <!-- Main Execution Action Button -->
              <div class="space-y-2 pt-1">
                <Button
                  v-if="!isSigned"
                  type="button"
                  class="w-full gap-2 text-sm font-semibold shadow-xs"
                  :disabled="!canSign"
                  @click="signAgreement"
                >
                  <PenTool class="size-4" />
                  <span>Sign &amp; Execute Agreement</span>
                </Button>

                <div
                  v-else
                  class="space-y-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-center"
                >
                  <div
                    class="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                  >
                    <CheckCircle2 class="size-4" />
                    <span>Agreement Digitally Executed!</span>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    Both parties have countersigned this NDA. Cryptographic SHA-256 certificate has been logged in the
                    audit trail.
                  </p>
                  <Button
                    aria-label="Download attachment"
                    size="sm"
                    class="mt-2 w-full gap-1.5 text-xs"
                    @click="handleExportPdf"
                  >
                    <Download class="size-3.5" />
                    <span>Export Countersigned PDF</span>
                  </Button>
                </div>

                <p v-if="!isSigned && !canSign" class="text-muted-foreground text-center text-xs">
                  {{
                    !eConsentAgreed
                      ? 'Please check the legal electronic consent box to proceed.'
                      : 'Please provide a valid signatory name.'
                  }}
                </p>
              </div>
            </CardContent>
          </Card>

          <!-- Audit Log Miniature Card -->
          <div
            class="border-border bg-card/60 text-muted-foreground space-y-1.5 rounded-lg border p-3.5 text-xs shadow-xs"
          >
            <div class="text-foreground flex items-center gap-1.5 font-semibold">
              <Lock class="text-primary size-3.5" />
              <span>Immutable Legal Audit Ledger</span>
            </div>
            <p class="leading-relaxed">
              Every clause configuration and signature execution generates a tamper-evident SHA-256 cryptographic digest
              with RFC 3161 trusted timestamping.
            </p>
          </div>
        </aside>

        <!-- Right Column: Live Document Parchment Canvas (60%) -->
        <main class="space-y-6 lg:col-span-7">
          <div class="border-border bg-card rounded-xl border p-6 shadow-xs sm:p-8 lg:p-10">
            <!-- Document Title Bar -->
            <div class="border-border border-b pb-6 text-center">
              <Badge variant="outline" class="font-mono text-xs tracking-widest uppercase">
                Official Legal Instrument &bull; {{ currentJurisdiction.tag }}
              </Badge>
              <h2 class="text-foreground mt-3 text-lg font-semibold tracking-tight sm:text-xl lg:text-2xl">
                {{
                  agreementType === 'mutual' ? 'Mutual Non-Disclosure Agreement' : 'Unilateral Non-Disclosure Agreement'
                }}
              </h2>
              <p class="text-muted-foreground mt-1.5 font-mono text-xs">
                Governing Law: {{ currentJurisdiction.name }} &bull; Ref: #NDA-2026-88F
              </p>
            </div>

            <!-- Agreement Key Terms Summary Box -->
            <div class="my-6">
              <div class="bg-muted/40 border-border rounded-lg border p-4 sm:p-5">
                <div class="mb-3 flex items-center justify-between">
                  <h3 class="text-foreground text-xs font-semibold">Contract Terms &amp; Scope Summary</h3>
                  <Badge variant="secondary" class="font-mono text-xs">
                    {{ agreementType === 'mutual' ? 'Bilateral Protection' : 'Unilateral Protection' }}
                  </Badge>
                </div>
                <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div class="border-border/60 bg-card rounded-md border p-3">
                    <p class="text-muted-foreground text-xs font-medium">Disclosing Party</p>
                    <p class="text-foreground mt-1 truncate text-xs font-bold">{{ disclosingCompany }}</p>
                    <p class="text-muted-foreground mt-0.5 truncate text-xs">{{ disclosingSignatory }}</p>
                  </div>
                  <div class="border-border/60 bg-card rounded-md border p-3">
                    <p class="text-muted-foreground text-xs font-medium">Receiving Party</p>
                    <p class="text-foreground mt-1 truncate text-xs font-bold">{{ receivingCompany }}</p>
                    <p class="text-muted-foreground mt-0.5 truncate text-xs">{{ receivingSignatory }}</p>
                  </div>
                  <div class="border-border/60 bg-card rounded-md border p-3">
                    <p class="text-muted-foreground text-xs font-medium">Protection Term</p>
                    <p class="text-foreground mt-1 text-xs font-bold">{{ confidentialityTerm }}</p>
                    <p class="text-muted-foreground mt-0.5 font-mono text-xs">From Effective Date</p>
                  </div>
                  <div class="border-border/60 bg-card rounded-md border p-3">
                    <p class="text-muted-foreground text-xs font-medium">Exclusive Venue</p>
                    <p class="text-foreground mt-1 truncate text-xs font-bold">
                      {{ currentJurisdiction.venue.split(',')[0] }}
                    </p>
                    <p class="text-muted-foreground mt-0.5 font-mono text-xs">{{ currentJurisdiction.tag }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Legal Sections Content -->
            <div class="text-foreground/90 space-y-7 text-xs leading-relaxed sm:text-sm">
              <!-- Preamble & Recitals -->
              <section class="space-y-3">
                <p class="text-muted-foreground leading-relaxed">
                  This Non-Disclosure Agreement (this &ldquo;Agreement&rdquo;), effective as of the
                  <strong class="text-foreground">21st day of August, 2026</strong> (&ldquo;Effective Date&rdquo;), is
                  entered into by and between:
                </p>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div class="border-border bg-muted/20 rounded-lg border p-3.5">
                    <p class="text-foreground text-xs font-medium">Disclosing Party (&ldquo;Party A&rdquo;)</p>
                    <p class="text-foreground mt-1 font-bold">{{ disclosingCompany }}</p>
                    <p class="text-muted-foreground text-xs">{{ disclosingSignatory }} &bull; {{ disclosingTitle }}</p>
                    <p class="text-muted-foreground font-mono text-xs">{{ disclosingEmail }}</p>
                  </div>
                  <div class="border-border bg-muted/20 rounded-lg border p-3.5">
                    <p class="text-foreground text-xs font-medium">Receiving Party (&ldquo;Party B&rdquo;)</p>
                    <p class="text-foreground mt-1 font-bold">{{ receivingCompany }}</p>
                    <p class="text-muted-foreground text-xs">{{ receivingSignatory }} &bull; {{ receivingTitle }}</p>
                    <p class="text-muted-foreground font-mono text-xs">{{ receivingEmail }}</p>
                  </div>
                </div>
                <p class="text-muted-foreground italic">
                  <strong>RECITALS:</strong> WHEREAS, Disclosing Party possesses certain non-public proprietary
                  technology, software architectures, and business data, and Receiving Party desires to receive such
                  information strictly for the purpose of
                  <strong class="text-foreground not-italic">&ldquo;{{ purposeOfDisclosure }}&rdquo;</strong> (the
                  &ldquo;Authorized Purpose&rdquo;).
                  {{
                    agreementType === 'mutual'
                      ? 'Each party may act as both a Disclosing Party and a Receiving Party under this Agreement.'
                      : ''
                  }}
                </p>
              </section>

              <Separator />

              <!-- Section 1: Definition of Confidential Information -->
              <section class="space-y-2.5">
                <div class="flex items-center gap-2">
                  <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">01</span>
                  <h3 class="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                    Definition of Confidential Information
                  </h3>
                </div>
                <p class="text-muted-foreground">
                  &ldquo;Confidential Information&rdquo; refers to all non-public, proprietary, or confidential
                  technical and business data disclosed by Disclosing Party to Receiving Party, whether orally,
                  electronically, in writing, or by inspection of tangible objects, including but not limited to: source
                  code, software algorithms, API specifications, component registries, cryptographic tokens, database
                  schemas, product roadmaps, financial forecasts, customer records, and trade secrets.
                </p>
              </section>

              <Separator />

              <!-- Section 2: Non-Disclosure & Duty of Care -->
              <section class="space-y-2.5">
                <div class="flex items-center gap-2">
                  <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">02</span>
                  <h3 class="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                    Obligations of Non-Disclosure &amp; Standard of Care
                  </h3>
                </div>
                <p class="text-muted-foreground">
                  Receiving Party agrees to maintain the strict confidentiality of all Confidential Information with at
                  least the same degree of care that it uses to protect its own confidential assets of similar nature,
                  but in no event less than a reasonable degree of care. Receiving Party shall:
                </p>
                <ul class="text-muted-foreground list-disc space-y-1.5 pl-4">
                  <li>
                    Use Confidential Information solely and exclusively for the Authorized Purpose defined herein.
                  </li>
                  <li>
                    Restrict disclosure strictly to its authorized officers, directors, employees, and legal counsel who
                    have a clear need-to-know and are bound by confidentiality covenants no less stringent than this
                    Agreement.
                  </li>
                  <li>
                    Refrain from reverse engineering, decompiling, or disassembling any software or architectural
                    artifacts provided.
                  </li>
                </ul>
              </section>

              <Separator />

              <!-- Section 3: Exclusions from Confidentiality -->
              <section class="space-y-2.5">
                <div class="flex items-center gap-2">
                  <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">03</span>
                  <h3 class="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                    Exclusions from Confidential Treatment
                  </h3>
                </div>
                <p class="text-muted-foreground">
                  Confidential Information does not encompass information that: (a) is or becomes publicly available
                  through no act or omission of Receiving Party; (b) was rightfully in Receiving Party&rsquo;s
                  possession prior to disclosure without restriction; (c) is independently developed by Receiving Party
                  without reference to or reliance upon Disclosing Party&rsquo;s Confidential Information; or (d) is
                  lawfully obtained from a third party free of any confidentiality obligations.
                </p>
              </section>

              <Separator />

              <!-- Section 4: Term & Expiration -->
              <section class="space-y-2.5">
                <div class="flex items-center gap-2">
                  <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">04</span>
                  <h3 class="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                    Term of Confidentiality Obligations
                  </h3>
                </div>
                <p class="text-muted-foreground">
                  The obligations of confidentiality and non-use established under this Agreement shall commence on the
                  Effective Date and continue in full force and effect for a period of
                  <strong class="text-foreground">{{ termText }}</strong
                  >.
                </p>
              </section>

              <!-- Dynamic Section: Non-Solicitation -->
              <template v-if="clauseNonSolicit">
                <Separator />
                <section class="space-y-2.5">
                  <div class="flex items-center gap-2">
                    <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">05</span>
                    <h3 class="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                      Non-Solicitation of Technical Personnel
                    </h3>
                  </div>
                  <p class="text-muted-foreground">
                    During the term of this Agreement and for a period of
                    <strong class="text-foreground">twelve (12) calendar months</strong>
                    immediately following its expiration or termination, neither party shall directly or indirectly
                    solicit, recruit, or entice any software engineer, systems architect, or executive officer of the
                    other party involved in this collaboration to terminate their employment relationship.
                  </p>
                </section>
              </template>

              <!-- Dynamic Section: Injunctive Relief -->
              <template v-if="clauseInjunctiveRelief">
                <Separator />
                <section class="space-y-2.5">
                  <div class="flex items-center gap-2">
                    <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                      {{ clauseNonSolicit ? '06' : '05' }}
                    </span>
                    <h3 class="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                      Injunctive &amp; Equitable Remedies
                    </h3>
                  </div>
                  <p class="text-muted-foreground">
                    The parties acknowledge that unauthorized disclosure or use of Confidential Information will cause
                    irreparable injury for which monetary damages alone would be inadequate. Consequently, Disclosing
                    Party shall be entitled to seek immediate injunctive relief, specific performance, and other
                    equitable remedies in any court of competent jurisdiction without the requirement of posting a bond
                    or proving monetary damages.
                  </p>
                </section>
              </template>

              <!-- Dynamic Section: Return & Certified Destruction -->
              <template v-if="clauseReturnMaterials">
                <Separator />
                <section class="space-y-2.5">
                  <div class="flex items-center gap-2">
                    <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                      {{ (clauseNonSolicit ? 1 : 0) + (clauseInjunctiveRelief ? 1 : 0) + 5 }}
                    </span>
                    <h3 class="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                      Return &amp; Certified Destruction of Materials
                    </h3>
                  </div>
                  <p class="text-muted-foreground">
                    Upon written request by Disclosing Party or upon termination of discussions, Receiving Party shall
                    within
                    <strong class="text-foreground">fourteen (14) calendar days</strong>: (a) return all tangible
                    materials containing Confidential Information; and (b) permanently erase and cryptographically shred
                    all digital records, backups, and derivative works, providing a formal officer Certificate of
                    Destruction.
                  </p>
                </section>
              </template>

              <!-- Dynamic Section: Permitted Compelled Disclosures -->
              <template v-if="clausePermittedDisclosures">
                <Separator />
                <section class="space-y-2.5">
                  <div class="flex items-center gap-2">
                    <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                      {{
                        (clauseNonSolicit ? 1 : 0) +
                        (clauseInjunctiveRelief ? 1 : 0) +
                        (clauseReturnMaterials ? 1 : 0) +
                        5
                      }}
                    </span>
                    <h3 class="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                      Permitted Compelled Disclosures &amp; Subpoenas
                    </h3>
                  </div>
                  <p class="text-muted-foreground">
                    Receiving Party may disclose Confidential Information pursuant to a valid judicial order or
                    statutory subpoena; provided that Receiving Party delivers prompt written notice (within 48 hours)
                    to Disclosing Party prior to disclosure, enabling Disclosing Party an opportunity to seek an
                    appropriate protective order.
                  </p>
                </section>
              </template>

              <Separator />

              <!-- Governing Law Section -->
              <section class="space-y-2.5">
                <div class="flex items-center gap-2">
                  <span class="bg-primary/10 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold">
                    {{ activeClausesCount + 5 }}
                  </span>
                  <h3 class="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                    Governing Law &amp; Dispute Jurisdiction
                  </h3>
                </div>
                <p class="text-muted-foreground">
                  This Agreement shall be governed by, construed, and enforced in accordance with the substantive laws
                  of
                  <strong class="text-foreground">{{ currentJurisdiction.name }}</strong> ({{
                    currentJurisdiction.statute
                  }}). The parties consent to the exclusive jurisdiction and venue of the courts situated in
                  <strong class="text-foreground">{{ currentJurisdiction.venue }}</strong
                  >.
                </p>
              </section>

              <Separator />

              <!-- Dual Signature Execution Block -->
              <section class="space-y-4 pt-2">
                <div class="flex items-center justify-between">
                  <h3 class="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                    In Witness Whereof &bull; Execution Signatures
                  </h3>
                  <span class="text-muted-foreground font-mono text-xs">2 of 2 Parties Bound</span>
                </div>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <!-- Disclosing Party Signature Block -->
                  <div class="border-border bg-muted/20 rounded-lg border p-4">
                    <div class="flex items-center justify-between">
                      <p class="text-foreground text-xs font-medium">Disclosing Party Signature</p>
                      <Badge
                        variant="outline"
                        class="border-emerald-500/40 bg-emerald-500/10 font-mono text-xs text-emerald-700 dark:text-emerald-400"
                      >
                        <Check class="mr-1 size-3" /> Signed &amp; Verified
                      </Badge>
                    </div>
                    <div class="border-border/60 bg-card my-3 rounded-md border p-3 text-center">
                      <p class="text-xl font-medium tracking-wide text-emerald-800 italic dark:text-emerald-300">
                        {{ disclosingSignatory }}
                      </p>
                      <p class="text-muted-foreground mt-0.5 font-mono text-xs">
                        {{ disclosingTitle }} &bull; {{ disclosingCompany }}
                      </p>
                    </div>
                    <div class="text-muted-foreground space-y-1 font-mono text-xs">
                      <p class="flex justify-between">
                        <span>Date Countersigned:</span>
                        <span class="text-foreground font-semibold tabular-nums">Aug 21, 2026 &bull; 09:30 EDT</span>
                      </p>
                      <p class="flex justify-between">
                        <span>Certificate ID:</span>
                        <span class="text-foreground font-semibold">DS-CERT-UIPKGE-9941</span>
                      </p>
                    </div>
                  </div>

                  <!-- Receiving Party Signature Block -->
                  <div
                    :class="
                      cn(
                        'rounded-lg border p-4 transition-all duration-200',
                        isSigned
                          ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20'
                          : 'border-border bg-muted/10 border-dashed',
                      )
                    "
                  >
                    <div class="flex items-center justify-between">
                      <p class="text-foreground text-xs font-medium">Receiving Party Signature</p>
                      <Badge
                        v-if="isSigned"
                        class="border-emerald-500/40 bg-emerald-500/10 font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400"
                      >
                        <Check class="mr-1 size-3" /> Signed &amp; Bound
                      </Badge>
                      <Badge
                        v-else
                        class="border-amber-500/40 bg-amber-500/10 font-mono text-xs font-medium text-amber-700 dark:text-amber-400"
                      >
                        Awaiting Signature
                      </Badge>
                    </div>

                    <div
                      :class="
                        cn(
                          'my-3 rounded-md border p-3 text-center transition-all',
                          isSigned
                            ? 'bg-card border-emerald-500/40'
                            : 'border-muted-foreground/30 bg-muted/20 border-dashed',
                        )
                      "
                    >
                      <template v-if="isSigned">
                        <p
                          :class="
                            cn(
                              'text-xl font-medium tracking-wide text-emerald-800 dark:text-emerald-300',
                              signatureFont === 'serif' && 'font-medium tracking-wide italic',
                              signatureFont === 'script' && 'font-medium tracking-widest italic',
                              signatureFont === 'sans' && 'font-semibold tracking-tight',
                            )
                          "
                        >
                          {{ signerName || receivingSignatory }}
                        </p>
                        <p class="text-muted-foreground mt-0.5 font-mono text-xs">
                          {{ receivingTitle }} &bull; {{ receivingCompany }}
                        </p>
                      </template>
                      <template v-else>
                        <p class="text-muted-foreground text-xs italic">Awaiting signature execution via left panel</p>
                        <p class="text-muted-foreground/80 mt-1 text-xs">
                          Click &ldquo;Sign &amp; Execute Agreement&rdquo; to bind {{ receivingCompany }}
                        </p>
                      </template>
                    </div>

                    <div class="text-muted-foreground space-y-1 font-mono text-xs">
                      <p class="flex justify-between">
                        <span>Date Executed:</span>
                        <span class="text-foreground font-semibold tabular-nums">
                          {{ isSigned ? 'Aug 21, 2026 • 11:20 EDT' : 'Pending' }}
                        </span>
                      </p>
                      <p class="flex justify-between">
                        <span>Digital Audit Hash:</span>
                        <span class="text-foreground font-semibold">
                          {{ isSigned ? 'SHA256:d91c7a...77a1' : 'Unsigned' }}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Parchment Footer Seal -->
              <div
                class="border-border/60 bg-muted/20 flex flex-col items-center justify-between gap-2 rounded-lg border p-3 text-xs sm:flex-row"
              >
                <div class="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                  <ShieldCheck class="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>256-Bit Cryptographic Ledger Seal &bull; RFC 3161 Authenticated</span>
                </div>
                <span class="text-muted-foreground font-mono text-xs"
                  >Doc ID: #NDA-2026-88F-{{ currentJurisdiction.tag }}</span
                >
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
