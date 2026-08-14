'use client'

import * as React from 'react'
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
} from 'lucide-react'
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

export interface TrainingComplianceTrackerProps {
  className?: string
  defaultFilter?: string
}

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

const filterCategories = [
  { id: 'all', label: 'All Modules', count: 5 },
  { id: 'security', label: 'Security & Privacy', count: 2 },
  { id: 'ethics', label: 'Ethics & Legal', count: 1 },
  { id: 'governance', label: 'Corporate Governance', count: 1 },
  { id: 'finance', label: 'Financial Compliance', count: 1 },
]

export function TrainingComplianceTracker({ className, defaultFilter = 'all' }: TrainingComplianceTrackerProps) {
  const [activeFilter, setActiveFilter] = React.useState<string>(defaultFilter)
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [selectedCertificate, setSelectedCertificate] = React.useState<ComplianceCourse | null>(null)
  const [retakeModalCourse, setRetakeModalCourse] = React.useState<ComplianceCourse | null>(null)
  const [isDownloadingAll, setIsDownloadingAll] = React.useState(false)
  const [downloadBannerMessage, setDownloadBannerMessage] = React.useState<string | null>(null)
  const [copiedCertId, setCopiedCertId] = React.useState(false)
  const [copiedDigest, setCopiedDigest] = React.useState(false)
  const [copiedVerifyUrl, setCopiedVerifyUrl] = React.useState(false)
  const [retakeSuccessMessage, setRetakeSuccessMessage] = React.useState<string | null>(null)

  const filteredCourses = React.useMemo(() => {
    return coursesData.filter((course) => {
      let matchesCategory = true
      if (activeFilter === 'security') {
        matchesCategory = course.categoryKey === 'security' || course.categoryKey === 'privacy'
      } else if (activeFilter === 'ethics') {
        matchesCategory = course.categoryKey === 'ethics'
      } else if (activeFilter === 'governance') {
        matchesCategory = course.categoryKey === 'governance' || course.categoryKey === 'finance'
      } else if (activeFilter === 'finance') {
        matchesCategory = course.categoryKey === 'finance'
      }

      const query = searchQuery.trim().toLowerCase()
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
  }, [activeFilter, searchQuery])

  function handleDownloadAllPdf() {
    if (isDownloadingAll) return
    setIsDownloadingAll(true)
    setDownloadBannerMessage('Compiling 5 verified compliance certificates into archival PDF...')

    setTimeout(() => {
      setIsDownloadingAll(false)
      setDownloadBannerMessage('✓ Download complete: Elena_Rostova_Annual_Compliance_Certificates_2026.pdf (1.8 MB)')
      setTimeout(() => {
        setDownloadBannerMessage(null)
      }, 4500)
    }, 1600)
  }

  function openCertificateModal(course: ComplianceCourse) {
    setSelectedCertificate(course)
    setCopiedCertId(false)
    setCopiedDigest(false)
    setCopiedVerifyUrl(false)
  }

  function closeCertificateModal() {
    setSelectedCertificate(null)
  }

  function openRetakeModal(course: ComplianceCourse) {
    setRetakeModalCourse(course)
  }

  function closeRetakeModal() {
    setRetakeModalCourse(null)
  }

  function handleConfirmRetake() {
    if (!retakeModalCourse) return
    const title = retakeModalCourse.title
    closeRetakeModal()
    setRetakeSuccessMessage(
      `Interactive refresher environment launched for "${title}". Your existing credential remains valid.`,
    )
    setTimeout(() => {
      setRetakeSuccessMessage(null)
    }, 4500)
  }

  function copyToClipboard(text: string, type: 'certId' | 'digest' | 'url') {
    navigator.clipboard?.writeText(text)
    if (type === 'certId') {
      setCopiedCertId(true)
      setTimeout(() => setCopiedCertId(false), 2000)
    } else if (type === 'digest') {
      setCopiedDigest(true)
      setTimeout(() => setCopiedDigest(false), 2000)
    } else if (type === 'url') {
      setCopiedVerifyUrl(true)
      setTimeout(() => setCopiedVerifyUrl(false), 2000)
    }
  }

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (selectedCertificate) closeCertificateModal()
        if (retakeModalCourse) closeRetakeModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedCertificate, retakeModalCourse])

  return (
    <div className={cn('w-full space-y-6', className)}>
      {/* Header Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Title, Employee Persona, and Department Details */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium">
                  Enterprise HRMS & Regulatory Assurance
                </span>
                <Badge
                  wrap
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                >
                  FY 2026–2027 Annual Cycle
                </Badge>
              </div>

              <div>
                <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  Mandatory Compliance Training & Certifications
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Official employee regulatory transcripts, verified digital credentials, and annual recertification
                  schedules.
                </p>
              </div>

              {/* Employee Persona Tag */}
              <div className="text-muted-foreground flex flex-wrap items-center gap-3 pt-1 text-xs">
                <div className="border-border bg-muted/40 text-foreground flex items-center gap-2 rounded-md border px-2.5 py-1.5 font-medium">
                  <div className="bg-primary/10 text-primary flex size-5 items-center justify-center rounded-full text-xs font-bold">
                    ER
                  </div>
                  <span>Elena Rostova · Senior Staff Engineer</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono tabular-nums">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="text-foreground font-medium">EMP-4092</span>
                </div>
                <Separator orientation="vertical" className="h-3.5" />
                <div className="flex items-center gap-1">
                  <Building2 className="text-muted-foreground size-3.5" />
                  <span>Core Platform Infrastructure</span>
                </div>
                <Separator orientation="vertical" className="h-3.5" />
                <div className="flex items-center gap-1">
                  <span>San Francisco, CA (HQ)</span>
                </div>
              </div>
            </div>

            {/* Right: 100% Compliant Status Pill + Download Action Button */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
              <div className="inline-flex items-center gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-700 shadow-xs dark:bg-emerald-950/40 dark:text-emerald-300">
                <ShieldCheck className="size-4.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div className="flex flex-col">
                  <span>100% Compliant · All 5 Annual Certifications Valid</span>
                  <span className="text-xs font-normal text-emerald-600/90 dark:text-emerald-400/80">
                    Zero overdue requirements · Audit attested
                  </span>
                </div>
              </div>

              <Button
                aria-label="Download attachment"
                variant="outline"
                size="sm"
                className="hover:bg-accent gap-2 shadow-xs transition-colors"
                disabled={isDownloadingAll}
                onClick={handleDownloadAllPdf}
              >
                {isDownloadingAll ? (
                  <RefreshCw className="size-3.5 animate-spin" />
                ) : (
                  <FileDown className="text-foreground size-3.5" />
                )}
                <span>{isDownloadingAll ? 'Generating PDF Bundle...' : 'Download All Certificates PDF'}</span>
              </Button>
            </div>
          </div>

          {/* Dynamic download notification banner */}
          {downloadBannerMessage && (
            <div className="mt-4 flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-800 transition-all dark:bg-emerald-950/50 dark:text-emerald-200">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{downloadBannerMessage}</span>
            </div>
          )}

          {/* Retake success toast notification */}
          {retakeSuccessMessage && (
            <div className="mt-4 flex items-center gap-2 rounded-md border border-sky-500/30 bg-sky-500/10 p-2.5 text-xs text-sky-800 transition-all dark:bg-sky-950/50 dark:text-sky-200">
              <Sparkles className="size-4 shrink-0 text-sky-600 dark:text-sky-400" />
              <span>{retakeSuccessMessage}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4 Training Overview KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Completed Certifications */}
        <Card className="border-border bg-card shadow-xs transition-shadow hover:shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Completed Certifications</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Award className="size-4.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-foreground flex items-baseline gap-1.5 font-mono text-2xl font-bold tracking-tight tabular-nums">
                5 / 5
              </div>
              <p className="text-muted-foreground text-xs">Modules Completed · 100% Finished</p>
            </div>
            <div className="space-y-1">
              <Progress value={100} className="h-1.5 bg-emerald-500/20" />
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span className="font-medium text-emerald-600 dark:text-emerald-400">SOC2 & ISO Ready</span>
                <span className="font-mono tabular-nums">5/5 passed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Total Training Hours */}
        <Card className="border-border bg-card shadow-xs transition-shadow hover:shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Total Training Hours</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Clock className="size-4.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-foreground flex items-baseline gap-1.5 font-mono text-2xl font-bold tracking-tight tabular-nums">
                6.5
                <span className="text-muted-foreground text-sm font-normal">Hours</span>
              </div>
              <p className="text-muted-foreground text-xs">6.5 Hours Logged in 2026</p>
            </div>
            <div className="space-y-1">
              <Progress value={100} className="h-1.5 bg-sky-500/20" />
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span className="font-medium text-sky-600 dark:text-sky-400">Quota: 6.0h Target</span>
                <span className="font-mono tabular-nums">108% logged</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Next Renewal Due */}
        <Card className="border-border bg-card shadow-xs transition-shadow hover:shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Next Renewal Due</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <CalendarClock className="size-4.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-foreground font-mono text-lg font-bold tracking-tight tabular-nums sm:text-xl">
                April 15, 2027
              </div>
              <p className="text-xs font-medium text-amber-700 dark:text-amber-400">In 8 months · Earliest Renewal</p>
            </div>
            <div className="border-border bg-muted/40 flex items-center justify-between rounded border px-2 py-1 text-xs">
              <span className="text-muted-foreground truncate">FCPA Anti-Bribery</span>
              <Badge
                wrap
                variant="outline"
                className="border-amber-500/30 font-mono text-xs text-amber-700 dark:text-amber-400"
              >
                237 days
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Company-Wide Compliance */}
        <Card className="border-border bg-card shadow-xs transition-shadow hover:shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Company-Wide Compliance</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Users className="size-4.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-foreground flex items-baseline gap-1.5 font-mono text-2xl font-bold tracking-tight tabular-nums">
                98.4%
              </div>
              <p className="text-muted-foreground text-xs">98.4% Staff Certified (1,420/1,443)</p>
            </div>
            <div className="space-y-1">
              <Progress value={98.4} className="h-1.5 bg-violet-500/20" />
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span className="font-medium text-violet-600 dark:text-violet-400">+1.2% this quarter</span>
                <span className="font-mono tabular-nums">23 pending</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Toolbar & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {filterCategories.map((cat) => {
            const isActive = activeFilter === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                className={cn(
                  'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground border',
                )}
                onClick={() => setActiveFilter(cat.id)}
              >
                <span>{cat.label}</span>
                <span
                  className={cn(
                    'py-0.2 rounded-full px-1.5 font-mono text-xs tabular-nums',
                    isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {cat.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Filter courses..."
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full min-w-0 rounded-md border pr-3 pl-8 text-xs focus-visible:ring-2 focus-visible:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
              aria-label="Clear search"
              onClick={() => setSearchQuery('')}
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mandatory Compliance Modules Table Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="p-5 pb-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-foreground text-base font-semibold tracking-tight">
                Mandatory Compliance Modules
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                Annual regulatory curriculum required under corporate governance and SOC 2 / ISO 27001 audit controls.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 pt-2 sm:pt-0">
              <span className="text-muted-foreground text-xs">
                Showing{' '}
                <span className="text-foreground font-mono font-medium tabular-nums">{filteredCourses.length}</span> of{' '}
                <span className="text-foreground font-mono font-medium tabular-nums">5</span> modules
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground min-w-[280px] py-3 text-xs font-semibold tracking-wider uppercase">
                    Course Title & Category
                  </TableHead>
                  <TableHead className="text-muted-foreground min-w-[140px] py-3 text-xs font-semibold tracking-wider uppercase">
                    Duration
                  </TableHead>
                  <TableHead className="text-muted-foreground min-w-[140px] py-3 text-xs font-semibold tracking-wider uppercase">
                    Score on Final Assessment
                  </TableHead>
                  <TableHead className="text-muted-foreground min-w-[120px] py-3 text-xs font-semibold tracking-wider uppercase">
                    Completion Date
                  </TableHead>
                  <TableHead className="text-muted-foreground min-w-[120px] py-3 text-xs font-semibold tracking-wider uppercase">
                    Expiration Date
                  </TableHead>
                  <TableHead className="text-muted-foreground min-w-[160px] py-3 text-xs font-semibold tracking-wider uppercase">
                    Certificate Badge
                  </TableHead>
                  <TableHead className="text-muted-foreground min-w-[180px] py-3 text-right text-xs font-semibold tracking-wider uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id} className="hover:bg-muted/30 transition-colors">
                    {/* Course Title & Category */}
                    <TableCell className="py-3.5 align-middle">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground text-sm font-medium">{{ ...course }.title}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge wrap variant="secondary" className="text-xs font-medium">
                            {course.category}
                          </Badge>
                          <span className="text-muted-foreground font-mono text-xs tabular-nums">
                            Code: {course.code}
                          </span>
                          <span
                            className="text-muted-foreground max-w-[200px] truncate text-xs"
                            title={course.standard}
                          >
                            {course.standard}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Duration */}
                    <TableCell className="py-3.5 align-middle">
                      <div className="text-foreground flex items-center gap-1.5 font-mono text-xs tabular-nums">
                        <Clock className="text-muted-foreground size-3.5" />
                        <span>{course.duration}</span>
                      </div>
                    </TableCell>

                    {/* Score on Final Assessment */}
                    <TableCell className="py-3.5 align-middle">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-mono text-sm font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                          <CheckCircle2 className="size-3.5 shrink-0" />
                          <span>{course.scoreStatus}</span>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <span>Pass threshold: 80%</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Completion Date */}
                    <TableCell className="py-3.5 align-middle">
                      <div className="text-muted-foreground font-mono text-xs tabular-nums">
                        {course.completionDate}
                      </div>
                    </TableCell>

                    {/* Expiration Date */}
                    <TableCell className="py-3.5 align-middle">
                      <div className="space-y-0.5">
                        <div className="text-foreground font-mono text-xs font-medium tabular-nums">
                          {course.expirationDate}
                        </div>
                        <div className="font-mono text-xs text-emerald-600 tabular-nums dark:text-emerald-400">
                          Valid ({course.daysUntilExpiry}d remaining)
                        </div>
                      </div>
                    </TableCell>

                    {/* Certificate Badge */}
                    <TableCell className="py-3.5 align-middle">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          <BadgeCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Verified Credential</span>
                        </div>
                        <div className="text-muted-foreground font-mono text-xs tabular-nums">
                          {course.credentialId}
                        </div>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3.5 text-right align-middle">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="xs"
                          className="hover:bg-accent h-7 gap-1 px-2.5 text-xs font-medium shadow-2xs"
                          onClick={() => openCertificateModal(course)}
                        >
                          <FileCheck className="text-muted-foreground size-3" />
                          <span>View Certificate</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="xs"
                          className="text-muted-foreground hover:text-foreground h-7 gap-1 px-2 text-xs font-medium"
                          onClick={() => openRetakeModal(course)}
                        >
                          <RotateCcw className="size-3" />
                          <span>Retake</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredCourses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-muted-foreground py-8 text-center text-xs">
                      No compliance modules match your search or filter criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Trust & Accreditation Sub-Footer */}
        <CardFooter className="border-border bg-muted/20 text-muted-foreground flex flex-col gap-2 border-t p-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Shield className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Audited & Attested by Schellman & Co., LLC for SOC 2 Type II & AICPA Security Trust Criteria.</span>
          </div>
          <div className="flex items-center gap-2 font-mono tabular-nums">
            <span>Ledger Sync: Aug 21, 2026 09:42 UTC</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">100% In-Policy</span>
          </div>
        </CardFooter>
      </Card>

      {/* Certificate Inspection Modal */}
      {selectedCertificate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeCertificateModal()
          }}
        >
          <div className="border-border bg-card text-card-foreground animate-in fade-in zoom-in-95 relative w-full max-w-2xl overflow-hidden rounded-xl border shadow-sm duration-200">
            {/* Modal Top Bar */}
            <div className="border-border bg-muted/40 flex items-center justify-between border-b px-5 py-3.5">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <BadgeCheck className="size-4" />
                </div>
                <div>
                  <h3 className="text-foreground text-xs font-semibold">Verified Compliance Credential</h3>
                  <p className="text-muted-foreground font-mono text-xs tabular-nums">
                    Credential ID: {selectedCertificate.credentialId}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring rounded-md p-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                aria-label="Close modal"
                onClick={closeCertificateModal}
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Certificate Body */}
            <div className="space-y-5 p-6">
              {/* Certificate Card Frame */}
              <div className="relative rounded-lg border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 p-6 text-center dark:bg-emerald-950/20">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 shadow-xs dark:text-emerald-400">
                  <Award className="size-6" />
                </div>

                <div className="mt-3 space-y-1">
                  <span className="text-xs font-semibold tracking-wide text-emerald-700 dark:text-emerald-400">
                    Official Certificate of Mastery & Regulatory Compliance
                  </span>
                  <h4 className="text-foreground text-lg font-bold">{selectedCertificate.title}</h4>
                  <p className="text-muted-foreground text-xs">{selectedCertificate.standard}</p>
                </div>

                <Separator className="my-4" />

                <div className="space-y-1.5">
                  <p className="text-muted-foreground text-xs">This certifies that</p>
                  <p className="text-foreground text-base font-bold">Elena Rostova</p>
                  <p className="text-muted-foreground text-xs">Senior Staff Engineer · EMP-4092</p>
                  <p className="text-muted-foreground/90 mx-auto max-w-lg pt-1 text-xs leading-relaxed">
                    {selectedCertificate.description}
                  </p>
                </div>

                {/* Verification Metadata Matrix */}
                <div className="border-border/60 mt-5 grid grid-cols-2 gap-3 border-t pt-4 text-left sm:grid-cols-4">
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground text-xs">Exam Score</span>
                    <p className="font-mono text-xs font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                      {selectedCertificate.scoreStatus}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground text-xs">Duration</span>
                    <p className="text-foreground font-mono text-xs font-semibold tabular-nums">
                      {selectedCertificate.durationHours} Hours
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground text-xs">Issued Date</span>
                    <p className="text-foreground font-mono text-xs tabular-nums">
                      {selectedCertificate.completionDate}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-muted-foreground text-xs">Valid Until</span>
                    <p className="text-foreground font-mono text-xs font-medium tabular-nums">
                      {selectedCertificate.expirationDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cryptographic Verification Details */}
              <div className="border-border bg-muted/40 space-y-2 rounded-lg border p-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="text-foreground flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Cryptographic Digest (SHA-256)</span>
                  </div>
                  <button
                    type="button"
                    className="text-primary flex items-center gap-1 text-xs hover:underline"
                    onClick={() => copyToClipboard(selectedCertificate.sha256Digest, 'digest')}
                  >
                    {copiedDigest ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                    <span>{copiedDigest ? 'Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
                <p className="text-muted-foreground font-mono text-xs break-all">{selectedCertificate.sha256Digest}</p>
                <div className="border-border/50 text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t pt-1">
                  <span>Accreditation: {selectedCertificate.accreditationBody}</span>
                  <span className="font-mono tabular-nums">Ledger: OpenAttestation v3</span>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="border-border bg-muted/40 flex flex-col-reverse gap-2 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => copyToClipboard(`https://uipkge.dev/verify/${selectedCertificate.credentialId}`, 'url')}
              >
                {copiedVerifyUrl ? <Check className="size-3.5 text-emerald-600" /> : <Share2 className="size-3.5" />}
                <span>{copiedVerifyUrl ? 'Link Copied!' : 'Copy Verification Link'}</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs" onClick={closeCertificateModal}>
                  Close
                </Button>
                <Button
                  aria-label="Download attachment"
                  variant="default"
                  size="sm"
                  className="gap-1.5 text-xs shadow-xs"
                  onClick={() => {
                    handleDownloadAllPdf()
                    closeCertificateModal()
                  }}
                >
                  <Download className="size-3.5" />
                  <span>Download PDF Certificate</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Retake Course Confirmation Modal */}
      {retakeModalCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeRetakeModal()
          }}
        >
          <div className="border-border bg-card text-card-foreground animate-in fade-in zoom-in-95 relative w-full max-w-lg overflow-hidden rounded-xl border shadow-sm duration-200">
            <div className="border-border bg-muted/40 flex items-center justify-between border-b px-5 py-3.5">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full">
                  <RotateCcw className="size-3.5" />
                </div>
                <h3 className="text-foreground text-sm font-bold">Launch Refresher Assessment</h3>
              </div>
              <button
                aria-label="Close retake modal"
                type="button"
                className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-1"
                onClick={closeRetakeModal}
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4 p-5 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground font-mono text-xs font-medium">
                  Module: {retakeModalCourse.code}
                </span>
                <h4 className="text-foreground text-sm font-semibold">{retakeModalCourse.title}</h4>
              </div>

              <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-amber-900 dark:text-amber-200">
                <div className="flex gap-2">
                  <AlertCircle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div className="space-y-1 leading-relaxed">
                    <p className="font-semibold">Notice regarding existing valid credential:</p>
                    <p>
                      Your current passing score ({retakeModalCourse.score}%) and verified credential (
                      {retakeModalCourse.credentialId}) will remain active and valid in company compliance audits until
                      the new assessment is submitted.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-border bg-muted/30 grid grid-cols-2 gap-2 rounded-md border p-3 font-mono">
                <div>
                  <span className="text-muted-foreground">Estimated Time:</span>
                  <p className="text-foreground font-semibold">{retakeModalCourse.duration}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Passing Threshold:</span>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">80% or Higher</p>
                </div>
              </div>
            </div>

            <div className="border-border bg-muted/40 flex items-center justify-end gap-2 border-t p-4">
              <Button
                aria-label="Close retake modal"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={closeRetakeModal}
              >
                Cancel
              </Button>
              <Button variant="default" size="sm" className="gap-1.5 text-xs shadow-xs" onClick={handleConfirmRetake}>
                <PlayCircle className="size-3.5" />
                <span>Launch Course Environment</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrainingComplianceTracker
