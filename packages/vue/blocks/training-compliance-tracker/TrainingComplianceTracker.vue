<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  AlertCircle,
  Award,
  BadgeCheck,
  Building2,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  FileCheck,
  FileDown,
  PlayCircle,
  RefreshCw,
  RotateCcw,
  Search,
  Share2,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface ComplianceCourse {
  id: string
  code: string
  title: string
  category: string
  categoryKey: 'security' | 'ethics' | 'governance' | 'privacy' | 'finance'
  standard: string
  duration: string
  durationHours: number
  score: number
  scoreStatus: string
  completionDate: string
  expirationDate: string
  validityMonths: number
  daysUntilExpiry: number
  credentialId: string
  sha256Digest: string
  verified: boolean
  instructor: string
  accreditationBody: string
  description: string
}

interface Props {
  class?: HTMLAttributes['class']
  defaultFilter?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultFilter: 'all',
})

const coursesData: ComplianceCourse[] = [
  {
    id: 'course-sec-201',
    code: 'SEC-201',
    title: 'Information Security & Data Protection (SOC2 / ISO 27001)',
    category: 'Security & Privacy',
    categoryKey: 'security',
    standard: 'AICPA SOC 2 Type II (CC6.1–CC6.8) & ISO/IEC 27001:2022 ISMS',
    duration: '1.5 Hours · Video + Exam',
    durationHours: 1.5,
    score: 100,
    scoreStatus: '100% · Passed',
    completionDate: 'Aug 10, 2026',
    expirationDate: 'Aug 10, 2027',
    validityMonths: 12,
    daysUntilExpiry: 354,
    credentialId: 'CERT-SEC-8921',
    sha256Digest: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    verified: true,
    instructor: 'Dr. Marcus Vance (Chief Information Security Officer)',
    accreditationBody: 'AICPA & International Organization for Standardization (ISO)',
    description:
      'Covers zero-trust access, threat modeling, cryptographic key storage, cloud security postures, automated patch cycles, and incident response SLAs.',
  },
  {
    id: 'course-eth-104',
    code: 'ETH-104',
    title: 'Workplace Harassment Prevention (California AB 1825)',
    category: 'Ethics & Legal',
    categoryKey: 'ethics',
    standard: 'California Government Code § 12950.1 / AB 1825 & SB 1343',
    duration: '2.0 Hours · Interactive Scenario',
    durationHours: 2.0,
    score: 100,
    scoreStatus: '100% · Passed',
    completionDate: 'Jul 14, 2026',
    expirationDate: 'Jul 14, 2027',
    validityMonths: 12,
    daysUntilExpiry: 327,
    credentialId: 'CERT-ETH-4412',
    sha256Digest: '3d9e8471b0219ca66219f85c18174a10df84b1fa3d677284addd200126d83120',
    verified: true,
    instructor: 'Sarah Jenkins, Esq. (Director of People & Legal Compliance)',
    accreditationBody: 'California Civil Rights Department (CRD / DFEH)',
    description:
      'Mandatory supervisory training on workplace culture, protected characteristics, bystander intervention techniques, retaliation prevention, and complaint escalations.',
  },
  {
    id: 'course-gov-302',
    code: 'GOV-302',
    title: 'Anti-Bribery & Foreign Corrupt Practices Act (FCPA)',
    category: 'Corporate Governance',
    categoryKey: 'governance',
    standard: 'US Foreign Corrupt Practices Act (15 U.S.C. § 78dd-1) & OECD Guidelines',
    duration: '1.0 Hour · Case Studies + Exam',
    durationHours: 1.0,
    score: 96,
    scoreStatus: '96% · Passed',
    completionDate: 'Apr 15, 2026',
    expirationDate: 'Apr 15, 2027',
    validityMonths: 12,
    daysUntilExpiry: 237,
    credentialId: 'CERT-GOV-3108',
    sha256Digest: '19fa4429bb56f082c18148a1d65dfc2d4b1fa3d677284addd200126d409218a1',
    verified: true,
    instructor: 'David K. Thorne (Global Ethics & Trade Compliance Counsel)',
    accreditationBody: 'U.S. Department of Justice & OECD Anti-Bribery Directorate',
    description:
      'Anti-corruption controls, third-party intermediary vetting, prohibition of facilitation payments, gift/hospitality thresholds, and internal books and records integrity.',
  },
  {
    id: 'course-reg-205',
    code: 'REG-205',
    title: 'HIPAA Security & Health Privacy Standards',
    category: 'Regulatory & Privacy',
    categoryKey: 'privacy',
    standard: '45 CFR Part 160 & Part 164 Subparts A, C, and E (ePHI Safeguards)',
    duration: '1.0 Hour · Video + Assessment',
    durationHours: 1.0,
    score: 98,
    scoreStatus: '98% · Passed',
    completionDate: 'Jun 02, 2026',
    expirationDate: 'Jun 02, 2027',
    validityMonths: 12,
    daysUntilExpiry: 285,
    credentialId: 'CERT-HPA-7729',
    sha256Digest: '55ca0982df43b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200',
    verified: true,
    instructor: 'Rachel Sterling (Healthcare Privacy & HIPAA Compliance Officer)',
    accreditationBody: 'U.S. Department of Health & Human Services (HHS OCR)',
    description:
      'Handling of Protected Health Information (PHI/ePHI), minimum necessary standard, physical and technical safeguards, Business Associate Agreements, and breach notifications.',
  },
  {
    id: 'course-fin-401',
    code: 'FIN-401',
    title: 'Insider Trading & Fair Disclosure (SEC)',
    category: 'Financial Compliance',
    categoryKey: 'finance',
    standard: 'Securities Exchange Act Rule 10b-5 & SEC Regulation Fair Disclosure (Reg FD)',
    duration: '1.0 Hour · Video + Exam',
    durationHours: 1.0,
    score: 100,
    scoreStatus: '100% · Passed',
    completionDate: 'May 19, 2026',
    expirationDate: 'May 19, 2027',
    validityMonths: 12,
    daysUntilExpiry: 271,
    credentialId: 'CERT-SEC-6043',
    sha256Digest: '91ea2d4719fa4429bb56f082c18148a1d65dfc2d4b1fa3d677284addd200126d',
    verified: true,
    instructor: 'Jonathan Meyer (Chief Legal Officer & General Counsel)',
    accreditationBody: 'U.S. Securities and Exchange Commission (SEC)',
    description:
      'Material Non-Public Information (MNPI) boundaries, pre-clearance procedures, quarterly trading blackouts, Rule 10b5-1 executive trading plans, and non-selective disclosure protocols.',
  },
]

const activeFilter = ref<string>(props.defaultFilter)
const searchQuery = ref<string>('')
const selectedCertificate = ref<ComplianceCourse | null>(null)
const retakeModalCourse = ref<ComplianceCourse | null>(null)
const isDownloadingAll = ref(false)
const downloadBannerMessage = ref<string | null>(null)
const copiedCertId = ref(false)
const copiedDigest = ref(false)
const copiedVerifyUrl = ref(false)
const retakeSuccessMessage = ref<string | null>(null)

const filterCategories = [
  { id: 'all', label: 'All Modules', count: 5 },
  { id: 'security', label: 'Security & Privacy', count: 2 },
  { id: 'ethics', label: 'Ethics & Legal', count: 1 },
  { id: 'governance', label: 'Corporate Governance', count: 1 },
  { id: 'finance', label: 'Financial Compliance', count: 1 },
]

const filteredCourses = computed(() => {
  return coursesData.filter((course) => {
    // Filter by category
    let matchesCategory = true
    if (activeFilter.value === 'security') {
      matchesCategory = course.categoryKey === 'security' || course.categoryKey === 'privacy'
    } else if (activeFilter.value === 'ethics') {
      matchesCategory = course.categoryKey === 'ethics'
    } else if (activeFilter.value === 'governance') {
      matchesCategory = course.categoryKey === 'governance' || course.categoryKey === 'finance'
    } else if (activeFilter.value === 'finance') {
      matchesCategory = course.categoryKey === 'finance'
    }

    // Filter by search query
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return matchesCategory

    const matchesSearch =
      course.title.toLowerCase().includes(query) ||
      course.code.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query) ||
      course.standard.toLowerCase().includes(query) ||
      course.credentialId.toLowerCase().includes(query) ||
      course.instructor.toLowerCase().includes(query)

    return matchesCategory && matchesSearch
  })
})

function handleDownloadAllPdf() {
  if (isDownloadingAll.value) return
  isDownloadingAll.value = true
  downloadBannerMessage.value = 'Compiling 5 verified compliance certificates into archival PDF...'

  setTimeout(() => {
    isDownloadingAll.value = false
    downloadBannerMessage.value = '✓ Download complete: Elena_Rostova_Annual_Compliance_Certificates_2026.pdf (1.8 MB)'
    setTimeout(() => {
      downloadBannerMessage.value = null
    }, 4500)
  }, 1600)
}

function openCertificateModal(course: ComplianceCourse) {
  selectedCertificate.value = course
  copiedCertId.value = false
  copiedDigest.value = false
  copiedVerifyUrl.value = false
}

function handleDownloadAndClose() {
  handleDownloadAllPdf()
  closeCertificateModal()
}

function closeCertificateModal() {
  selectedCertificate.value = null
}

function openRetakeModal(course: ComplianceCourse) {
  retakeModalCourse.value = course
}

function closeRetakeModal() {
  retakeModalCourse.value = null
}

function handleConfirmRetake() {
  if (!retakeModalCourse.value) return
  const title = retakeModalCourse.value.title
  closeRetakeModal()
  retakeSuccessMessage.value = `Interactive refresher environment launched for "${title}". Your existing credential remains valid.`
  setTimeout(() => {
    retakeSuccessMessage.value = null
  }, 4500)
}

function copyToClipboard(text: string, type: 'certId' | 'digest' | 'url') {
  navigator.clipboard?.writeText(text)
  if (type === 'certId') {
    copiedCertId.value = true
    setTimeout(() => (copiedCertId.value = false), 2000)
  } else if (type === 'digest') {
    copiedDigest.value = true
    setTimeout(() => (copiedDigest.value = false), 2000)
  } else if (type === 'url') {
    copiedVerifyUrl.value = true
    setTimeout(() => (copiedVerifyUrl.value = false), 2000)
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (selectedCertificate.value) closeCertificateModal()
    if (retakeModalCourse.value) closeRetakeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div :class="cn('w-full space-y-6', props.class)">
    <!-- Header Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardContent class="p-5 sm:p-6">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <!-- Left: Title, Employee Persona, and Department Details -->
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-muted-foreground text-xs font-medium"> Enterprise HRMS & Regulatory Assurance </span>
              <Badge
                wrap
                variant="outline"
                class="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
              >
                FY 2026–2027 Annual Cycle
              </Badge>
            </div>

            <div>
              <h2 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                Mandatory Compliance Training & Certifications
              </h2>
              <p class="text-muted-foreground mt-1 text-sm">
                Official employee regulatory transcripts, verified digital credentials, and annual recertification
                schedules.
              </p>
            </div>

            <!-- Employee Persona Tag -->
            <div class="text-muted-foreground flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div
                class="border-border bg-muted/40 text-foreground flex items-center gap-2 rounded-md border px-2.5 py-1.5 font-medium"
              >
                <div
                  class="bg-primary/10 text-primary flex size-5 items-center justify-center rounded-full text-xs font-bold"
                >
                  ER
                </div>
                <span>Elena Rostova · Senior Staff Engineer</span>
              </div>
              <div class="flex items-center gap-1.5 font-mono tabular-nums">
                <span class="text-muted-foreground">ID:</span>
                <span class="text-foreground font-medium">EMP-4092</span>
              </div>
              <Separator orientation="vertical" class="h-3.5" />
              <div class="flex items-center gap-1">
                <Building2 class="text-muted-foreground size-3.5" />
                <span>Core Platform Infrastructure</span>
              </div>
              <Separator orientation="vertical" class="h-3.5" />
              <div class="flex items-center gap-1">
                <span>San Francisco, CA (HQ)</span>
              </div>
            </div>
          </div>

          <!-- Right: 100% Compliant Status Pill + Download Action Button -->
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            <div
              class="inline-flex items-center gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-700 shadow-xs dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              <ShieldCheck class="size-4.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div class="flex flex-col">
                <span>100% Compliant · All 5 Annual Certifications Valid</span>
                <span class="text-xs font-normal text-emerald-600/90 dark:text-emerald-400/80">
                  Zero overdue requirements · Audit attested
                </span>
              </div>
            </div>

            <Button
              aria-label="Download attachment"
              variant="outline"
              size="sm"
              class="hover:bg-accent gap-2 shadow-xs transition-colors"
              :disabled="isDownloadingAll"
              @click="handleDownloadAllPdf"
            >
              <RefreshCw v-if="isDownloadingAll" class="size-3.5 animate-spin" />
              <FileDown v-else class="text-foreground size-3.5" />
              <span>{{ isDownloadingAll ? 'Generating PDF Bundle...' : 'Download All Certificates PDF' }}</span>
            </Button>
          </div>
        </div>

        <!-- Dynamic download notification banner -->
        <div
          v-if="downloadBannerMessage"
          class="mt-4 flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-800 transition-all dark:bg-emerald-950/50 dark:text-emerald-200"
        >
          <CheckCircle2 class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{{ downloadBannerMessage }}</span>
        </div>

        <!-- Retake success toast notification -->
        <div
          v-if="retakeSuccessMessage"
          class="mt-4 flex items-center gap-2 rounded-md border border-sky-500/30 bg-sky-500/10 p-2.5 text-xs text-sky-800 transition-all dark:bg-sky-950/50 dark:text-sky-200"
        >
          <Sparkles class="size-4 shrink-0 text-sky-600 dark:text-sky-400" />
          <span>{{ retakeSuccessMessage }}</span>
        </div>
      </CardContent>
    </Card>

    <!-- 4 Training Overview KPI Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Card 1: Completed Certifications -->
      <Card class="border-border bg-card shadow-xs transition-shadow hover:shadow-sm">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium"> Completed Certifications </CardTitle>
          <div
            class="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            <Award class="size-4.5" />
          </div>
        </CardHeader>
        <CardContent class="space-y-3">
          <div>
            <div
              class="text-foreground flex items-baseline gap-1.5 font-mono text-2xl font-bold tracking-tight tabular-nums"
            >
              5 / 5
            </div>
            <p class="text-muted-foreground text-xs">Modules Completed · 100% Finished</p>
          </div>
          <div class="space-y-1">
            <Progress :model-value="100" class="h-1.5 bg-emerald-500/20" />
            <div class="text-muted-foreground flex items-center justify-between text-xs">
              <span class="font-medium text-emerald-600 dark:text-emerald-400">SOC2 & ISO Ready</span>
              <span class="font-mono tabular-nums">5/5 passed</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Card 2: Total Training Hours -->
      <Card class="border-border bg-card shadow-xs transition-shadow hover:shadow-sm">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium"> Total Training Hours </CardTitle>
          <div class="flex size-8 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Clock class="size-4.5" />
          </div>
        </CardHeader>
        <CardContent class="space-y-3">
          <div>
            <div
              class="text-foreground flex items-baseline gap-1.5 font-mono text-2xl font-bold tracking-tight tabular-nums"
            >
              6.5
              <span class="text-muted-foreground text-sm font-normal">Hours</span>
            </div>
            <p class="text-muted-foreground text-xs">6.5 Hours Logged in 2026</p>
          </div>
          <div class="space-y-1">
            <Progress :model-value="100" class="h-1.5 bg-sky-500/20" />
            <div class="text-muted-foreground flex items-center justify-between text-xs">
              <span class="font-medium text-sky-600 dark:text-sky-400">Quota: 6.0h Target</span>
              <span class="font-mono tabular-nums">108% logged</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Card 3: Next Renewal Due -->
      <Card class="border-border bg-card shadow-xs transition-shadow hover:shadow-sm">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium"> Next Renewal Due </CardTitle>
          <div
            class="flex size-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400"
          >
            <CalendarClock class="size-4.5" />
          </div>
        </CardHeader>
        <CardContent class="space-y-3">
          <div>
            <div class="text-foreground font-mono text-lg font-bold tracking-tight tabular-nums sm:text-xl">
              April 15, 2027
            </div>
            <p class="text-xs font-medium text-amber-700 dark:text-amber-400">In 8 months · Earliest Renewal</p>
          </div>
          <div class="border-border bg-muted/40 flex items-center justify-between rounded border px-2 py-1 text-xs">
            <span class="text-muted-foreground truncate">FCPA Anti-Bribery</span>
            <Badge
              wrap
              variant="outline"
              class="border-amber-500/30 font-mono text-xs text-amber-700 dark:text-amber-400"
            >
              237 days
            </Badge>
          </div>
        </CardContent>
      </Card>

      <!-- Card 4: Company-Wide Compliance -->
      <Card class="border-border bg-card shadow-xs transition-shadow hover:shadow-sm">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium"> Company-Wide Compliance </CardTitle>
          <div
            class="flex size-8 items-center justify-center rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400"
          >
            <Users class="size-4.5" />
          </div>
        </CardHeader>
        <CardContent class="space-y-3">
          <div>
            <div
              class="text-foreground flex items-baseline gap-1.5 font-mono text-2xl font-bold tracking-tight tabular-nums"
            >
              98.4%
            </div>
            <p class="text-muted-foreground text-xs">98.4% Staff Certified (1,420/1,443)</p>
          </div>
          <div class="space-y-1">
            <Progress :model-value="98.4" class="h-1.5 bg-violet-500/20" />
            <div class="text-muted-foreground flex items-center justify-between text-xs">
              <span class="font-medium text-violet-600 dark:text-violet-400">+1.2% this quarter</span>
              <span class="font-mono tabular-nums">23 pending</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Filter Toolbar & Search -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <!-- Category Filter Pills -->
      <div class="flex flex-wrap items-center gap-1.5">
        <button
          v-for="cat in filterCategories"
          :key="cat.id"
          type="button"
          :class="
            cn(
              'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
              activeFilter === cat.id
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground border',
            )
          "
          @click="activeFilter = cat.id"
        >
          <span>{{ cat.label }}</span>
          <span
            :class="
              cn(
                'py-0.2 rounded-full px-1.5 font-mono text-xs tabular-nums',
                activeFilter === cat.id
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground',
              )
            "
          >
            {{ cat.count }}
          </span>
        </button>
      </div>

      <!-- Search Input -->
      <div class="relative w-full sm:w-64">
        <Search class="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter courses..."
          class="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full min-w-0 rounded-md border pr-3 pl-8 text-xs focus-visible:ring-2 focus-visible:outline-none"
        />
        <button
          aria-label="Clear search"
          v-if="searchQuery"
          type="button"
          class="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
          @click="searchQuery = ''"
        >
          <X class="size-3.5" />
        </button>
      </div>
    </div>

    <!-- Mandatory Compliance Modules Table Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="p-5 pb-3">
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="text-foreground text-base font-semibold tracking-tight">
              Mandatory Compliance Modules
            </CardTitle>
            <CardDescription class="text-muted-foreground text-xs">
              Annual regulatory curriculum required under corporate governance and SOC 2 / ISO 27001 audit controls.
            </CardDescription>
          </div>
          <div class="flex items-center gap-2 pt-2 sm:pt-0">
            <span class="text-muted-foreground text-xs">
              Showing
              <span class="text-foreground font-mono font-medium tabular-nums">{{ filteredCourses.length }}</span> of
              <span class="text-foreground font-mono font-medium tabular-nums">5</span> modules
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader class="bg-muted/40">
              <TableRow class="hover:bg-transparent">
                <TableHead
                  class="text-muted-foreground min-w-[280px] py-3 text-xs font-semibold tracking-wider uppercase"
                >
                  Course Title & Category
                </TableHead>
                <TableHead
                  class="text-muted-foreground min-w-[140px] py-3 text-xs font-semibold tracking-wider uppercase"
                >
                  Duration
                </TableHead>
                <TableHead
                  class="text-muted-foreground min-w-[140px] py-3 text-xs font-semibold tracking-wider uppercase"
                >
                  Score on Final Assessment
                </TableHead>
                <TableHead
                  class="text-muted-foreground min-w-[120px] py-3 text-xs font-semibold tracking-wider uppercase"
                >
                  Completion Date
                </TableHead>
                <TableHead
                  class="text-muted-foreground min-w-[120px] py-3 text-xs font-semibold tracking-wider uppercase"
                >
                  Expiration Date
                </TableHead>
                <TableHead
                  class="text-muted-foreground min-w-[160px] py-3 text-xs font-semibold tracking-wider uppercase"
                >
                  Certificate Badge
                </TableHead>
                <TableHead
                  class="text-muted-foreground min-w-[180px] py-3 text-right text-xs font-semibold tracking-wider uppercase"
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow v-for="course in filteredCourses" :key="course.id" class="hover:bg-muted/30 transition-colors">
                <!-- Course Title & Category -->
                <TableCell class="py-3.5 align-middle">
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="text-foreground text-sm font-medium">
                        {{ course.title }}
                      </span>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                      <Badge wrap variant="secondary" class="text-xs font-medium">
                        {{ course.category }}
                      </Badge>
                      <span class="text-muted-foreground font-mono text-xs tabular-nums">
                        Code: {{ course.code }}
                      </span>
                      <span class="text-muted-foreground max-w-[200px] truncate text-xs" :title="course.standard">
                        {{ course.standard }}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <!-- Duration -->
                <TableCell class="py-3.5 align-middle">
                  <div class="text-foreground flex items-center gap-1.5 font-mono text-xs tabular-nums">
                    <Clock class="text-muted-foreground size-3.5" />
                    <span>{{ course.duration }}</span>
                  </div>
                </TableCell>

                <!-- Score on Final Assessment -->
                <TableCell class="py-3.5 align-middle">
                  <div class="space-y-1">
                    <div
                      class="flex items-center gap-1.5 font-mono text-sm font-semibold text-emerald-600 tabular-nums dark:text-emerald-400"
                    >
                      <CheckCircle2 class="size-3.5 shrink-0" />
                      <span>{{ course.scoreStatus }}</span>
                    </div>
                    <div class="text-muted-foreground flex items-center gap-1 text-xs">
                      <span>Pass threshold: 80%</span>
                    </div>
                  </div>
                </TableCell>

                <!-- Completion Date -->
                <TableCell class="py-3.5 align-middle">
                  <div class="text-muted-foreground font-mono text-xs tabular-nums">
                    {{ course.completionDate }}
                  </div>
                </TableCell>

                <!-- Expiration Date -->
                <TableCell class="py-3.5 align-middle">
                  <div class="space-y-0.5">
                    <div class="text-foreground font-mono text-xs font-medium tabular-nums">
                      {{ course.expirationDate }}
                    </div>
                    <div class="font-mono text-xs text-emerald-600 tabular-nums dark:text-emerald-400">
                      Valid ({{ course.daysUntilExpiry }}d remaining)
                    </div>
                  </div>
                </TableCell>

                <!-- Certificate Badge -->
                <TableCell class="py-3.5 align-middle">
                  <div class="space-y-1">
                    <div
                      class="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                    >
                      <BadgeCheck class="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Verified Credential</span>
                    </div>
                    <div class="text-muted-foreground font-mono text-xs tabular-nums">
                      {{ course.credentialId }}
                    </div>
                  </div>
                </TableCell>

                <!-- Actions -->
                <TableCell class="py-3.5 text-right align-middle">
                  <div class="flex items-center justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="xs"
                      class="hover:bg-accent h-7 gap-1 px-2.5 text-xs font-medium shadow-2xs"
                      @click="openCertificateModal(course)"
                    >
                      <FileCheck class="text-muted-foreground size-3" />
                      <span>View Certificate</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="xs"
                      class="text-muted-foreground hover:text-foreground h-7 gap-1 px-2 text-xs font-medium"
                      @click="openRetakeModal(course)"
                    >
                      <RotateCcw class="size-3" />
                      <span>Retake</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow v-if="filteredCourses.length === 0">
                <TableCell colspan="7" class="text-muted-foreground py-8 text-center text-xs">
                  No compliance modules match your search or filter criteria.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <!-- Trust & Accreditation Sub-Footer -->
      <CardFooter
        class="border-border bg-muted/20 text-muted-foreground flex flex-col gap-2 border-t p-4 text-xs sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex items-center gap-2">
          <Shield class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span> Audited & Attested by Schellman & Co., LLC for SOC 2 Type II & AICPA Security Trust Criteria. </span>
        </div>
        <div class="flex items-center gap-2 font-mono tabular-nums">
          <span>Ledger Sync: Aug 21, 2026 09:42 UTC</span>
          <span class="font-medium text-emerald-600 dark:text-emerald-400">100% In-Policy</span>
        </div>
      </CardFooter>
    </Card>

    <!-- Certificate Inspection Modal -->
    <div
      v-if="selectedCertificate"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity"
      @click.self="closeCertificateModal"
    >
      <div
        class="border-border bg-card text-card-foreground animate-in fade-in zoom-in-95 relative w-full max-w-2xl overflow-hidden rounded-xl border shadow-sm duration-200"
      >
        <!-- Modal Top Bar -->
        <div class="border-border bg-muted/40 flex items-center justify-between border-b px-5 py-3.5">
          <div class="flex items-center gap-2">
            <div
              class="flex size-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <BadgeCheck class="size-4" />
            </div>
            <div>
              <h3 class="text-foreground text-xs font-semibold">Verified Compliance Credential</h3>
              <p class="text-muted-foreground font-mono text-xs tabular-nums">
                Credential ID: {{ selectedCertificate.credentialId }}
              </p>
            </div>
          </div>

          <button
            type="button"
            class="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label="Close modal"
            @click="closeCertificateModal"
          >
            <X class="size-4" />
          </button>
        </div>

        <!-- Certificate Body -->
        <div class="space-y-5 p-6">
          <!-- Certificate Card Frame -->
          <div
            class="relative rounded-lg border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 p-6 text-center dark:bg-emerald-950/20"
          >
            <div
              class="mx-auto flex size-12 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 shadow-xs dark:text-emerald-400"
            >
              <Award class="size-6" />
            </div>

            <div class="mt-3 space-y-1">
              <span class="text-xs font-semibold tracking-wide text-emerald-700 dark:text-emerald-400">
                Official Certificate of Mastery & Regulatory Compliance
              </span>
              <h4 class="text-foreground text-lg font-bold">
                {{ selectedCertificate.title }}
              </h4>
              <p class="text-muted-foreground text-xs">
                {{ selectedCertificate.standard }}
              </p>
            </div>

            <Separator class="my-4" />

            <div class="space-y-1.5">
              <p class="text-muted-foreground text-xs">This certifies that</p>
              <p class="text-foreground text-base font-bold">Elena Rostova</p>
              <p class="text-muted-foreground text-xs">Senior Staff Engineer · EMP-4092</p>
              <p class="text-muted-foreground/90 mx-auto max-w-lg pt-1 text-xs leading-relaxed">
                {{ selectedCertificate.description }}
              </p>
            </div>

            <!-- Verification Metadata Matrix -->
            <div class="border-border/60 mt-5 grid grid-cols-2 gap-3 border-t pt-4 text-left sm:grid-cols-4">
              <div class="space-y-0.5">
                <span class="text-muted-foreground text-xs">Exam Score</span>
                <p class="font-mono text-xs font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                  {{ selectedCertificate.scoreStatus }}
                </p>
              </div>
              <div class="space-y-0.5">
                <span class="text-muted-foreground text-xs">Duration</span>
                <p class="text-foreground font-mono text-xs font-semibold tabular-nums">
                  {{ selectedCertificate.durationHours }} Hours
                </p>
              </div>
              <div class="space-y-0.5">
                <span class="text-muted-foreground text-xs">Issued Date</span>
                <p class="text-foreground font-mono text-xs tabular-nums">
                  {{ selectedCertificate.completionDate }}
                </p>
              </div>
              <div class="space-y-0.5">
                <span class="text-muted-foreground text-xs">Valid Until</span>
                <p class="text-foreground font-mono text-xs font-medium tabular-nums">
                  {{ selectedCertificate.expirationDate }}
                </p>
              </div>
            </div>
          </div>

          <!-- Cryptographic Verification Details -->
          <div class="border-border bg-muted/40 space-y-2 rounded-lg border p-3.5 text-xs">
            <div class="flex items-center justify-between">
              <div class="text-foreground flex items-center gap-1.5 font-medium">
                <ShieldCheck class="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Cryptographic Digest (SHA-256)</span>
              </div>
              <button
                type="button"
                class="text-primary flex items-center gap-1 text-xs hover:underline"
                @click="copyToClipboard(selectedCertificate.sha256Digest, 'digest')"
              >
                <Check v-if="copiedDigest" class="size-3 text-emerald-600" />
                <Copy v-else class="size-3" />
                <span>{{ copiedDigest ? 'Copied' : 'Copy Hash' }}</span>
              </button>
            </div>
            <p class="text-muted-foreground font-mono text-xs break-all">
              {{ selectedCertificate.sha256Digest }}
            </p>
            <div
              class="border-border/50 text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t pt-1"
            >
              <span>Accreditation: {{ selectedCertificate.accreditationBody }}</span>
              <span class="font-mono tabular-nums">Ledger: OpenAttestation v3</span>
            </div>
          </div>
        </div>

        <!-- Modal Actions Footer -->
        <div
          class="border-border bg-muted/40 flex flex-col-reverse gap-2 border-t p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <Button
            variant="ghost"
            size="sm"
            class="text-xs"
            @click="copyToClipboard(`https://uipkge.dev/verify/${selectedCertificate.credentialId}`, 'url')"
          >
            <Check v-if="copiedVerifyUrl" class="size-3.5 text-emerald-600" />
            <Share2 v-else class="size-3.5" />
            <span>{{ copiedVerifyUrl ? 'Link Copied!' : 'Copy Verification Link' }}</span>
          </Button>

          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" class="text-xs" @click="closeCertificateModal"> Close </Button>
            <Button
              aria-label="Download attachment"
              variant="default"
              size="sm"
              class="gap-1.5 text-xs shadow-xs"
              @click="handleDownloadAndClose"
            >
              <Download class="size-3.5" />
              <span>Download PDF Certificate</span>
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Retake Course Confirmation Modal -->
    <div
      v-if="retakeModalCourse"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity"
      @click.self="closeRetakeModal"
    >
      <div
        class="border-border bg-card text-card-foreground animate-in fade-in zoom-in-95 relative w-full max-w-lg overflow-hidden rounded-xl border shadow-sm duration-200"
      >
        <div class="border-border bg-muted/40 flex items-center justify-between border-b px-5 py-3.5">
          <div class="flex items-center gap-2">
            <div class="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full">
              <RotateCcw class="size-3.5" />
            </div>
            <h3 class="text-foreground text-sm font-bold">Launch Refresher Assessment</h3>
          </div>
          <button
            aria-label="Close retake modal"
            type="button"
            class="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-1"
            @click="closeRetakeModal"
          >
            <X class="size-4" />
          </button>
        </div>

        <div class="space-y-4 p-5 text-xs">
          <div class="space-y-1">
            <span class="text-muted-foreground font-mono text-xs font-medium"
              >Module: {{ retakeModalCourse.code }}</span
            >
            <h4 class="text-foreground text-sm font-semibold">
              {{ retakeModalCourse.title }}
            </h4>
          </div>

          <div class="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-amber-900 dark:text-amber-200">
            <div class="flex gap-2">
              <AlertCircle class="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div class="space-y-1 leading-relaxed">
                <p class="font-semibold">Notice regarding existing valid credential:</p>
                <p>
                  Your current passing score ({{ retakeModalCourse.score }}%) and verified credential ({{
                    retakeModalCourse.credentialId
                  }}) will remain active and valid in company compliance audits until the new assessment is submitted.
                </p>
              </div>
            </div>
          </div>

          <div class="border-border bg-muted/30 grid grid-cols-2 gap-2 rounded-md border p-3 font-mono">
            <div>
              <span class="text-muted-foreground">Estimated Time:</span>
              <p class="text-foreground font-semibold">{{ retakeModalCourse.duration }}</p>
            </div>
            <div>
              <span class="text-muted-foreground">Passing Threshold:</span>
              <p class="font-semibold text-emerald-600 dark:text-emerald-400">80% or Higher</p>
            </div>
          </div>
        </div>

        <div class="border-border bg-muted/40 flex items-center justify-end gap-2 border-t p-4">
          <Button aria-label="Close retake modal" variant="outline" size="sm" class="text-xs" @click="closeRetakeModal">
            Cancel
          </Button>
          <Button variant="default" size="sm" class="gap-1.5 text-xs shadow-xs" @click="handleConfirmRetake">
            <PlayCircle class="size-3.5" />
            <span>Launch Course Environment</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
