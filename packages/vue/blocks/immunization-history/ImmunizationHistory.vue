<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  AlertCircle,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Download,
  ExternalLink,
  FileCheck,
  Globe,
  Lock,
  Plane,
  QrCode,
  ShieldCheck,
  Syringe,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

interface VaccineRecord {
  id: string
  vaccineName: string
  formulation: string
  cvxCode: string
  ndcCode?: string
  doseSequence: string
  doseBadgeVariant: 'default' | 'secondary' | 'outline'
  administeredDate: string
  manufacturer: string
  lotNumber: string
  facility: string
  provider: string
  nextDueDate: string
  statusType: 'valid' | 'permanent' | 'booster-due'
  statusLabel: string
}

interface ProtectionSummary {
  disease: string
  status: string
  doseLabel: string
  lastAdministered: string
  badgeVariant: 'success' | 'secondary' | 'outline'
  badgeText: string
}

const patientProfile = {
  name: 'Elena Rostova',
  dob: '1994-06-12',
  age: 32,
  gender: 'Female',
  mrn: 'IMM-9406-821',
  jurisdiction: 'State of California (CAIR2 Registry)',
  complianceStatus: 'Fully Immunized · Meets School & Travel Mandates',
  shcIssuer: 'California Department of Public Health (CDPH)',
  shcKeyId: 'CDPH-SMART-2025-V3',
  shcSignature: 'ECDSA P-256 (SHA-256)',
  jwsFragment: 'shc:/5676290952432060346029243740436037704054664037593670346029243740436037704054664037593670',
}

const protectionSummaries: ProtectionSummary[] = [
  {
    disease: 'COVID-19',
    status: 'Active Protection',
    doseLabel: 'Updated Booster (2025/2026)',
    lastAdministered: 'Oct 12, 2025',
    badgeVariant: 'success',
    badgeText: 'Verified Active',
  },
  {
    disease: 'Influenza',
    status: 'Seasonal Protection',
    doseLabel: 'Quadrivalent (2025/2026)',
    lastAdministered: 'Sep 28, 2025',
    badgeVariant: 'success',
    badgeText: 'Valid thru Sep 2026',
  },
  {
    disease: 'Tdap',
    status: 'Active (10-Yr Cycle)',
    doseLabel: 'Tetanus, Diphtheria, Pertussis',
    lastAdministered: 'Jun 14, 2022',
    badgeVariant: 'secondary',
    badgeText: 'Valid thru 2032',
  },
  {
    disease: 'MMR',
    status: 'Immune Protection',
    doseLabel: 'Complete 2-Dose Series',
    lastAdministered: 'Aug 22, 2010',
    badgeVariant: 'success',
    badgeText: 'Lifelong Immunity',
  },
]

const vaccineRecords: VaccineRecord[] = [
  {
    id: 'rec-1',
    vaccineName: 'COVID-19 mRNA (Pfizer-BioNTech Bivalent)',
    formulation: 'Spikevike mRNA bivalent lineage booster',
    cvxCode: 'CVX 229',
    ndcCode: 'NDC 59267-1000-02',
    doseSequence: 'Dose 3 of 3',
    doseBadgeVariant: 'outline',
    administeredDate: 'Oct 12, 2025',
    manufacturer: 'Pfizer-BioNTech',
    lotNumber: '#EW0182',
    facility: 'UCLA Health Urgent Care',
    provider: 'Nurse J. Adams, RN',
    nextDueDate: 'October 2026',
    statusType: 'valid',
    statusLabel: 'Annual Booster Due 2026',
  },
  {
    id: 'rec-2',
    vaccineName: 'Influenza Quadrivalent',
    formulation: 'Inactivated influenza split virion',
    cvxCode: 'CVX 158',
    ndcCode: 'NDC 49281-0422-50',
    doseSequence: 'Annual Booster',
    doseBadgeVariant: 'outline',
    administeredDate: 'Sep 28, 2025',
    manufacturer: 'Sanofi Pasteur',
    lotNumber: '#FL8842',
    facility: 'CVS MinuteClinic #4921',
    provider: 'Pharmacist R. Patel, PharmD',
    nextDueDate: 'September 2026',
    statusType: 'valid',
    statusLabel: 'Valid 2025/2026 Season',
  },
  {
    id: 'rec-3',
    vaccineName: 'Tdap (Tetanus, Diphtheria, Pertussis)',
    formulation: 'Adsorbed acellular toxoid formulation',
    cvxCode: 'CVX 115',
    ndcCode: 'NDC 58160-0842-11',
    doseSequence: 'Booster (10-Yr)',
    doseBadgeVariant: 'outline',
    administeredDate: 'Jun 14, 2022',
    manufacturer: 'GlaxoSmithKline',
    lotNumber: '#TD9021',
    facility: 'Cedars-Sinai Primary Care',
    provider: 'Dr. S. Miller, MD',
    nextDueDate: 'June 2032',
    statusType: 'valid',
    statusLabel: 'Valid thru 2032',
  },
  {
    id: 'rec-4',
    vaccineName: 'Hepatitis B (Recombinant)',
    formulation: 'Recombinant HBsAg protein subunit',
    cvxCode: 'CVX 43',
    ndcCode: 'NDC 00006-4995-00',
    doseSequence: 'Dose 3 of 3',
    doseBadgeVariant: 'outline',
    administeredDate: 'Jan 18, 2018',
    manufacturer: 'Merck & Co.',
    lotNumber: '#HB4419',
    facility: 'Kaiser Permanente Sunset',
    provider: 'Nurse K. Chen, RN',
    nextDueDate: 'Lifelong Immunity',
    statusType: 'permanent',
    statusLabel: 'Lifelong Immunity',
  },
  {
    id: 'rec-5',
    vaccineName: 'MMR (Measles, Mumps, Rubella)',
    formulation: 'Live attenuated viral vaccine',
    cvxCode: 'CVX 03',
    ndcCode: 'NDC 00006-4681-00',
    doseSequence: 'Dose 2 of 2',
    doseBadgeVariant: 'outline',
    administeredDate: 'Aug 22, 2010',
    manufacturer: 'Merck & Co.',
    lotNumber: '#MR1083',
    facility: "Stanford Children's Health",
    provider: 'Dr. L. Gomez, MD',
    nextDueDate: 'Lifelong Immunity',
    statusType: 'permanent',
    statusLabel: 'Lifelong Immunity',
  },
]
</script>

<template>
  <div data-slot="immunization-history" :class="cn('w-full space-y-6', props.class)">
    <!-- Header Section -->
    <header class="bg-card border-border rounded-xl border p-5 shadow-xs sm:p-6">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-1.5">
          <div class="flex flex-wrap items-center gap-2.5">
            <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Immunization Record & Vaccine Passport
            </h1>
            <Badge wrap variant="success" class="gap-1.5 px-2.5 py-1 text-xs font-semibold">
              <span class="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              {{ patientProfile.complianceStatus }}
            </Badge>
          </div>

          <div class="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
            <span class="text-foreground font-semibold">{{ patientProfile.name }}</span>
            <span>
              DOB: <strong class="text-foreground font-medium tabular-nums">{{ patientProfile.dob }}</strong> ({{
                patientProfile.age
              }}
              yrs · {{ patientProfile.gender }})
            </span>
            <span class="font-mono text-xs">MRN: {{ patientProfile.mrn }}</span>
            <span class="text-muted-foreground text-xs">{{ patientProfile.jurisdiction }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" size="sm" class="gap-1.5 text-xs font-medium">
            <QrCode class="size-3.5 shrink-0" aria-hidden="true" />
            Share QR Pass
          </Button>
          <Button aria-label="Download attachment" size="sm" class="gap-1.5 text-xs font-medium">
            <Download class="size-3.5 shrink-0" aria-hidden="true" />
            Download Official Record PDF
          </Button>
        </div>
      </div>
    </header>

    <!-- Digital Health Pass Card: Verifiable SMART® Health Card -->
    <Card class="border-border/90 relative overflow-hidden shadow-xs">
      <!-- Security Watermark Background Motif -->
      <div
        class="pointer-events-none absolute -top-10 -right-10 size-72 opacity-[0.03] select-none dark:opacity-[0.05]"
        aria-hidden="true"
      >
        <ShieldCheck class="text-foreground size-full" />
      </div>

      <CardHeader class="border-border/60 bg-muted/20 border-b pb-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <div
              class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 shadow-2xs dark:text-emerald-400"
            >
              <ShieldCheck class="size-5" aria-hidden="true" />
            </div>
            <div>
              <div class="flex min-w-0 items-center gap-2">
                <CardTitle class="text-base font-semibold">SMART® Health Card Verified</CardTitle>
                <Badge wrap variant="outline" class="font-mono text-xs">W3C Credential</Badge>
              </div>
              <CardDescription class="text-xs">
                Issuer: {{ patientProfile.shcIssuer }} · Signed via {{ patientProfile.shcKeyId }}
              </CardDescription>
            </div>
          </div>

          <div class="flex min-w-0 flex-wrap items-center gap-2">
            <Badge wrap variant="outline" class="gap-1 px-2 py-0.5 font-mono text-xs">
              <Lock class="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <span>{{ patientProfile.shcSignature }}</span>
            </Badge>
            <Badge wrap variant="success" class="gap-1 text-xs">
              <Check class="size-3" aria-hidden="true" />
              Cryptographically Signed
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-5 sm:p-6">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          <!-- QR Code & Digital Signature Verification Container -->
          <div class="bg-muted/40 border-border/70 min-w-0 rounded-xl border p-4 sm:p-5 lg:col-span-5">
            <div class="flex flex-col items-center gap-4 sm:flex-row">
              <!-- Crisp SVG QR Code Placeholder -->
              <div
                class="bg-background ring-border/80 relative flex size-36 shrink-0 items-center justify-center rounded-lg p-2.5 shadow-2xs ring-1"
              >
                <svg
                  viewBox="0 0 120 120"
                  class="text-foreground size-full"
                  fill="currentColor"
                  shape-rendering="crispEdges"
                  aria-label="SMART Health Card Digital QR Pass"
                  role="img"
                >
                  <!-- Finder Pattern: Top-Left -->
                  <rect x="6" y="6" width="30" height="30" rx="3" />
                  <rect x="11" y="11" width="20" height="20" rx="2" class="fill-background" />
                  <rect x="15" y="15" width="12" height="12" rx="1.5" />

                  <!-- Finder Pattern: Top-Right -->
                  <rect x="84" y="6" width="30" height="30" rx="3" />
                  <rect x="89" y="11" width="20" height="20" rx="2" class="fill-background" />
                  <rect x="93" y="15" width="12" height="12" rx="1.5" />

                  <!-- Finder Pattern: Bottom-Left -->
                  <rect x="6" y="84" width="30" height="30" rx="3" />
                  <rect x="11" y="89" width="20" height="20" rx="2" class="fill-background" />
                  <rect x="15" y="93" width="12" height="12" rx="1.5" />

                  <!-- Timing Patterns -->
                  <rect x="42" y="18" width="5" height="5" />
                  <rect x="52" y="18" width="5" height="5" />
                  <rect x="62" y="18" width="5" height="5" />
                  <rect x="72" y="18" width="5" height="5" />
                  <rect x="18" y="42" width="5" height="5" />
                  <rect x="18" y="52" width="5" height="5" />
                  <rect x="18" y="62" width="5" height="5" />
                  <rect x="18" y="72" width="5" height="5" />

                  <!-- Alignment Pattern: Bottom-Right -->
                  <rect x="86" y="86" width="20" height="20" rx="2" />
                  <rect x="90" y="90" width="12" height="12" rx="1" class="fill-background" />
                  <rect x="93" y="93" width="6" height="6" />

                  <!-- Data Modules Matrix Grid -->
                  <rect x="42" y="32" width="5" height="5" />
                  <rect x="50" y="32" width="5" height="5" />
                  <rect x="68" y="32" width="5" height="5" />
                  <rect x="76" y="32" width="5" height="5" />
                  <rect x="42" y="42" width="5" height="5" />
                  <rect x="58" y="42" width="5" height="5" />
                  <rect x="68" y="42" width="5" height="5" />
                  <rect x="92" y="42" width="5" height="5" />
                  <rect x="100" y="42" width="5" height="5" />
                  <rect x="32" y="52" width="5" height="5" />
                  <rect x="48" y="52" width="5" height="5" />
                  <rect x="58" y="52" width="5" height="5" />
                  <rect x="78" y="52" width="5" height="5" />
                  <rect x="88" y="52" width="5" height="5" />
                  <rect x="32" y="62" width="5" height="5" />
                  <rect x="42" y="62" width="5" height="5" />
                  <rect x="62" y="62" width="5" height="5" />
                  <rect x="72" y="62" width="5" height="5" />
                  <rect x="102" y="62" width="5" height="5" />
                  <rect x="48" y="72" width="5" height="5" />
                  <rect x="58" y="72" width="5" height="5" />
                  <rect x="82" y="72" width="5" height="5" />
                  <rect x="42" y="82" width="5" height="5" />
                  <rect x="52" y="82" width="5" height="5" />
                  <rect x="62" y="82" width="5" height="5" />
                  <rect x="72" y="82" width="5" height="5" />
                  <rect x="52" y="92" width="5" height="5" />
                  <rect x="68" y="92" width="5" height="5" />
                  <rect x="42" y="102" width="5" height="5" />
                  <rect x="60" y="102" width="5" height="5" />
                  <rect x="74" y="102" width="5" height="5" />
                </svg>
              </div>

              <!-- Pass Metadata -->
              <div class="w-full min-w-0 space-y-2 text-center sm:text-left">
                <div>
                  <h2 class="text-foreground text-sm font-semibold">Offline Verifiable Pass</h2>
                  <p class="text-muted-foreground text-xs">
                    Compatible with Apple Health, Google Wallet, and international border checkpoint verifiers.
                  </p>
                </div>
                <div class="border-border/60 bg-background/80 rounded border p-2">
                  <span class="text-muted-foreground block text-xs font-medium">JWS Payload Digest</span>
                  <code class="text-muted-foreground block truncate font-mono text-xs">
                    {{ patientProfile.jwsFragment }}
                  </code>
                </div>
                <div class="text-muted-foreground flex items-center justify-center gap-1 text-xs sm:justify-start">
                  <CheckCircle2 class="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span>Public Key Confirmed Active</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Vaccine Summary Protection Chips -->
          <div class="space-y-3 lg:col-span-7">
            <div class="flex items-center justify-between">
              <h2 class="text-foreground text-sm font-semibold">Active Health Protections & Key Immunizations</h2>
              <span class="text-muted-foreground text-xs font-medium">4 Core Mandates Met</span>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div
                v-for="chip in protectionSummaries"
                :key="chip.disease"
                class="bg-card border-border/80 hover:border-border flex flex-col justify-between rounded-lg border p-3.5 shadow-2xs transition-colors"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex min-w-0 items-center gap-2">
                    <div
                      class="flex size-7 shrink-0 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    >
                      <Syringe class="size-3.5" aria-hidden="true" />
                    </div>
                    <div>
                      <span class="text-foreground text-sm font-semibold">{{ chip.disease }}</span>
                      <p class="text-muted-foreground truncate text-xs">{{ chip.doseLabel }}</p>
                    </div>
                  </div>
                  <Badge wrap :variant="chip.badgeVariant" class="text-xs font-medium">
                    {{ chip.badgeText }}
                  </Badge>
                </div>

                <div
                  class="border-border/60 text-muted-foreground mt-3 flex items-center justify-between border-t pt-2 text-xs"
                >
                  <span
                    >Last:
                    <strong class="text-foreground font-medium tabular-nums">{{ chip.lastAdministered }}</strong></span
                  >
                  <span class="font-medium text-emerald-600 dark:text-emerald-400">{{ chip.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Immunization Records Table -->
    <Card class="shadow-xs">
      <CardHeader>
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="text-base font-semibold">Administered Immunization History</CardTitle>
            <CardDescription class="text-xs sm:text-sm">
              Complete chronological registry of vaccine administrations, CDC CVX codes, lot verification, and clinical
              facilities.
            </CardDescription>
          </div>
          <div class="flex min-w-0 items-center gap-2">
            <Badge wrap variant="outline" class="gap-1 text-xs tabular-nums">
              <FileCheck class="text-primary size-3.5" aria-hidden="true" />
              <span>5 Records Verified</span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-[28%] min-w-[220px]">Vaccine & CVX Code</TableHead>
                <TableHead class="min-w-[130px]">Dose Sequence</TableHead>
                <TableHead class="min-w-[120px]">Administered Date</TableHead>
                <TableHead class="min-w-[160px]">Manufacturer & Lot #</TableHead>
                <TableHead class="min-w-[220px]">Administering Facility & Provider</TableHead>
                <TableHead class="min-w-[140px] text-right">Status / Next Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="record in vaccineRecords" :key="record.id">
                <TableCell>
                  <div class="text-foreground text-sm font-semibold">{{ record.vaccineName }}</div>
                  <div class="text-muted-foreground flex flex-wrap items-center gap-1.5 text-xs">
                    <span class="font-mono">{{ record.cvxCode }}</span>
                    <span v-if="record.ndcCode" class="text-muted-foreground/60">·</span>
                    <span v-if="record.ndcCode" class="font-mono text-xs">{{ record.ndcCode }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge wrap :variant="record.doseBadgeVariant" class="text-xs font-medium">
                    {{ record.doseSequence }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-1.5">
                    <Calendar class="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
                    <span class="text-foreground text-sm font-medium tabular-nums">{{ record.administeredDate }}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div class="text-foreground text-sm font-medium">{{ record.manufacturer }}</div>
                  <div class="text-muted-foreground font-mono text-xs">{{ record.lotNumber }}</div>
                </TableCell>
                <TableCell>
                  <div class="text-foreground flex items-center gap-1.5 text-sm font-medium">
                    <Building2 class="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" />
                    <span>{{ record.facility }}</span>
                  </div>
                  <div class="text-muted-foreground text-xs">{{ record.provider }}</div>
                </TableCell>
                <TableCell class="text-right">
                  <Badge
                    :variant="record.statusType === 'permanent' ? 'success' : 'secondary'"
                    class="text-xs font-medium whitespace-normal"
                  >
                    {{ record.nextDueDate }}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Upcoming Due Vaccines & Travel Advisory Alert Card -->
    <Card class="border-amber-500/30 bg-amber-500/[0.04] shadow-xs dark:bg-amber-500/[0.07]">
      <CardContent class="p-5 sm:p-6">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="flex items-start gap-3.5">
            <div
              class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-700 shadow-2xs dark:text-amber-400"
            >
              <Globe class="size-5" aria-hidden="true" />
            </div>
            <div class="space-y-3">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="text-foreground text-base font-semibold">
                    Upcoming Recommendations & Travel Health Advisory
                  </h2>
                  <Badge wrap variant="warning" class="gap-1 text-xs font-medium">
                    <AlertCircle class="size-3" aria-hidden="true" />
                    CDC Notice · Level 2
                  </Badge>
                </div>
                <p class="text-muted-foreground mt-1 text-xs sm:text-sm">
                  Clinical recommendations based on patient age cohort, seasonal guidelines, and destination health
                  advisories.
                </p>
              </div>

              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <!-- Travel Alert Item 1: Yellow Fever -->
                <div class="bg-card/90 border-border/80 rounded-lg border p-3.5 shadow-2xs">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-1.5">
                      <Plane class="size-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                      <span class="text-foreground text-xs font-semibold">Yellow Fever Vaccine (Live 17D)</span>
                    </div>
                    <Badge
                      wrap
                      variant="outline"
                      class="border-amber-500/30 text-xs text-amber-700 dark:text-amber-400"
                    >
                      Travel Advisory
                    </Badge>
                  </div>
                  <p class="text-muted-foreground mt-1.5 text-xs">
                    Recommended for upcoming travel to endemic regions in South America (Brazil, Peru, Colombia). Single
                    dose provides lifelong immunity; administer ≥10 days prior to departure.
                  </p>
                  <div
                    class="border-border/60 text-muted-foreground mt-2.5 flex items-center justify-between border-t pt-2 text-xs"
                  >
                    <span>Priority: <strong class="text-foreground font-medium">High for South America</strong></span>
                    <span class="font-medium text-amber-600 dark:text-amber-400">Pending Rx</span>
                  </div>
                </div>

                <!-- Advisory Item 2: Meningococcal MenACWY -->
                <div class="bg-card/90 border-border/80 rounded-lg border p-3.5 shadow-2xs">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-1.5">
                      <Syringe class="text-primary size-3.5" aria-hidden="true" />
                      <span class="text-foreground text-xs font-semibold">Meningococcal Conjugate (MenACWY)</span>
                    </div>
                    <Badge wrap variant="outline" class="text-xs">Routine Booster</Badge>
                  </div>
                  <p class="text-muted-foreground mt-1.5 text-xs">
                    Recommended 5-year booster for international academic programs, dormitory residency, and congregate
                    international travel settings.
                  </p>
                  <div
                    class="border-border/60 text-muted-foreground mt-2.5 flex items-center justify-between border-t pt-2 text-xs"
                  >
                    <span
                      >Next Window:
                      <strong class="text-foreground font-medium tabular-nums">Jan – Mar 2027</strong></span
                    >
                    <span class="text-muted-foreground font-medium">Due in 11 mos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Advisory Action Buttons -->
          <div class="flex shrink-0 flex-wrap items-center gap-2 lg:flex-col lg:items-end">
            <Button size="sm" class="gap-1.5 text-xs font-medium">
              <Calendar class="size-3.5" aria-hidden="true" />
              Schedule Travel Clinic Visit
            </Button>
            <Button variant="outline" size="sm" class="gap-1.5 text-xs font-medium">
              <ExternalLink class="size-3.5" aria-hidden="true" />
              View CDC Destination Guidelines
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
