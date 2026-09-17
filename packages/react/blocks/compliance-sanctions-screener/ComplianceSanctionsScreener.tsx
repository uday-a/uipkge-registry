'use client'

import * as React from 'react'
import {
  AlertTriangle,
  Ban,
  Building2,
  Check,
  CheckCircle2,
  Eye,
  FileSearch,
  Globe,
  Info,
  Layers,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Sliders,
  User,
  Users,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type MatchStatus = 'potential_match' | 'prohibited_match' | 'clear' | 'cleared_false_positive' | 'blocked'
export type EntityType = 'individual' | 'corporate'

export interface SanctionAttributeComparison {
  field: string
  submittedValue: string
  watchlistValue: string
  matchType: 'exact' | 'fuzzy' | 'partial' | 'clean' | 'unmatched'
  score: number
  note?: string
}

export interface SanctionRecord {
  id: string
  entityName: string
  originalScript?: string
  entityType: EntityType
  matchScore: number
  matchStatus: MatchStatus
  sanctionList: string
  program: string
  matchedAttributesSummary: string
  country: string
  jurisdiction: string
  dateOfBirthOrIncorporation: string
  nationalIdOrLei: string
  address: string
  aliases: string[]
  pepLevel?: string
  remarks?: string
  lastScreened: string
  attributeComparisons: SanctionAttributeComparison[]
}

export interface ComplianceSanctionsScreenerProps {
  initialSearch?: string
  initialCountry?: string
  initialThreshold?: number
  initialRecords?: SanctionRecord[]
  className?: string
}

const defaultSanctionRecords: SanctionRecord[] = [
  {
    id: 'SANCT-2026-001',
    entityName: 'Viktor Ivanov',
    originalScript: 'Иванов Виктор Петрович',
    entityType: 'individual',
    matchScore: 94,
    matchStatus: 'potential_match',
    sanctionList: 'OFAC SDN List · Sectoral Sanctions',
    program: 'UKRAINE-EO13662 · Executive Order 14024',
    matchedAttributesSummary: 'DOB 1974, Russia, Passport 77-04-889102',
    country: 'Russia',
    jurisdiction: 'US (OFAC) / EU / UK',
    dateOfBirthOrIncorporation: '1974-05-12',
    nationalIdOrLei: '77-04-889102 (RUS)',
    address: 'Presnenskaya Naberezhnaya 12, Moscow, Russia',
    aliases: ['Victor Ivanov', 'V. P. Ivanov', 'Viktor Petrovich Ivanov'],
    pepLevel: 'PEP Tier 2 · Former Deputy Minister of Industry',
    remarks: 'Designated under Executive Order 14024 for operating in the financial and defense sector.',
    lastScreened: '10m ago',
    attributeComparisons: [
      {
        field: 'Full Legal Name',
        submittedValue: 'Viktor Ivanov',
        watchlistValue: 'IVANOV, Viktor Petrovich (Иванов Виктор Петрович)',
        matchType: 'fuzzy',
        score: 96,
        note: 'Transliteration and patronymic expansion matched',
      },
      {
        field: 'Known Aliases & AKAs',
        submittedValue: 'Victor Ivanov, V. P. Ivanov',
        watchlistValue: 'Viktor Ivanov, Victor Petrovich Ivanov, Victor Ivanov-Karpov',
        matchType: 'partial',
        score: 94,
        note: 'Direct alias hit in OFAC Specially Designated database',
      },
      {
        field: 'Date of Birth / Inception',
        submittedValue: '1974-05-12',
        watchlistValue: '1974-05-12 (Moscow, USSR / Russian Federation)',
        matchType: 'exact',
        score: 100,
        note: '100% exact cryptographic DOB date match',
      },
      {
        field: 'Passport / National ID',
        submittedValue: '77-04-889102 (Russian Federation)',
        watchlistValue: '77-04-889102 / Int. Passport 51-09-112344',
        matchType: 'exact',
        score: 100,
        note: 'Official primary national identity document match',
      },
      {
        field: 'Registered Address',
        submittedValue: 'Presnenskaya Naberezhnaya 12, Moscow',
        watchlistValue: 'Presnenskaya Embankment 12, Fl. 4, Moscow 123112, Russia',
        matchType: 'fuzzy',
        score: 92,
        note: 'Street and district normalization matched',
      },
      {
        field: 'PEP Status & Legal Program',
        submittedValue: 'Executive Director (Disclosed Non-PEP)',
        watchlistValue: 'OFAC SDN [UKRAINE-EO13662] · PEP Tier 2 · Mandatory Asset Freeze',
        matchType: 'exact',
        score: 100,
        note: 'Undeclared PEP Tier 2 designation active on UK HMT / EU Sanctions',
      },
    ],
  },
  {
    id: 'SANCT-2026-002',
    entityName: 'Sarah Connor',
    originalScript: 'Sarah Connor',
    entityType: 'individual',
    matchScore: 12,
    matchStatus: 'clear',
    sanctionList: 'No Sanctions Matches (All Databases Checked)',
    program: 'None · Standard Retail Profile',
    matchedAttributesSummary: 'No sanction matches · Low risk profile',
    country: 'United States',
    jurisdiction: 'Global / FATF Compliant',
    dateOfBirthOrIncorporation: '1985-02-28',
    nationalIdOrLei: 'SSN ***-**-4910',
    address: '742 Evergreen Terrace, Los Angeles, CA 90001, USA',
    aliases: ['Sarah J. Connor'],
    pepLevel: 'Non-PEP',
    remarks: 'Clear of all OFAC, EU, UN, and PEP lists. Auto-approved by automated compliance pipeline.',
    lastScreened: '18m ago',
    attributeComparisons: [
      {
        field: 'Full Legal Name',
        submittedValue: 'Sarah Connor',
        watchlistValue: 'CONNOR, Sara Helena (Low Soundex Similarity)',
        matchType: 'fuzzy',
        score: 18,
        note: 'Distant phonetical overlap below decision threshold',
      },
      {
        field: 'Known Aliases & AKAs',
        submittedValue: 'Sarah J. Connor',
        watchlistValue: 'No matching designated aliases found',
        matchType: 'clean',
        score: 0,
        note: 'Zero hits across all official alias directories',
      },
      {
        field: 'Date of Birth / Inception',
        submittedValue: '1985-02-28',
        watchlistValue: '1962-11-04 (Bogota, Colombia)',
        matchType: 'unmatched',
        score: 0,
        note: 'DOB discrepancy (>22 years divergence)',
      },
      {
        field: 'Passport / National ID',
        submittedValue: 'SSN ***-**-4910 (USA)',
        watchlistValue: 'COL-9902148 (Republic of Colombia)',
        matchType: 'unmatched',
        score: 0,
        note: 'Different country of issuance and identifier structure',
      },
      {
        field: 'Registered Address',
        submittedValue: '742 Evergreen Terrace, Los Angeles, CA, USA',
        watchlistValue: 'Calle 72 #10-34, Bogota, Colombia',
        matchType: 'unmatched',
        score: 0,
        note: 'Zero geographic intersection',
      },
      {
        field: 'PEP Status & Legal Program',
        submittedValue: 'Individual Retail Client',
        watchlistValue: 'Clean / Unrestricted Jurisdiction',
        matchType: 'clean',
        score: 0,
        note: 'No adverse media or PEP exposure',
      },
    ],
  },
  {
    id: 'SANCT-2026-003',
    entityName: 'Elena Rostova',
    originalScript: 'Elena Rostova-Dimitriou',
    entityType: 'individual',
    matchScore: 0,
    matchStatus: 'clear',
    sanctionList: 'No Sanctions Matches (All Databases Checked)',
    program: 'None · Private Banking Profile',
    matchedAttributesSummary: 'No sanction matches · High assurance clean record',
    country: 'Cyprus',
    jurisdiction: 'EU / Global Compliant',
    dateOfBirthOrIncorporation: '1991-09-17',
    nationalIdOrLei: 'CY-ID 9920194',
    address: 'Archbishop Makarios III Ave 45, Limassol 3025, Cyprus',
    aliases: ['Elena Rostova-Dimitriou'],
    pepLevel: 'Non-PEP',
    remarks: 'Verified clean record across UN Consolidated, OFAC SDN, UK HMT, and Interpol Red Notices.',
    lastScreened: '32m ago',
    attributeComparisons: [
      {
        field: 'Full Legal Name',
        submittedValue: 'Elena Rostova',
        watchlistValue: 'No target record matches identified in any watchlist',
        matchType: 'clean',
        score: 0,
        note: 'Zero hits across 42 global sanction jurisdictions',
      },
      {
        field: 'Known Aliases & AKAs',
        submittedValue: 'Elena Rostova-Dimitriou',
        watchlistValue: 'No target record matches',
        matchType: 'clean',
        score: 0,
        note: 'Zero alias records found',
      },
      {
        field: 'Date of Birth / Inception',
        submittedValue: '1991-09-17',
        watchlistValue: 'No target record matches',
        matchType: 'clean',
        score: 0,
        note: 'Clean verification result',
      },
      {
        field: 'Passport / National ID',
        submittedValue: 'CY-ID 9920194 (Cyprus / EU)',
        watchlistValue: 'No target record matches',
        matchType: 'clean',
        score: 0,
        note: 'Clean verification result',
      },
      {
        field: 'Registered Address',
        submittedValue: 'Archbishop Makarios III Ave 45, Limassol, Cyprus',
        watchlistValue: 'No target record matches',
        matchType: 'clean',
        score: 0,
        note: 'Verified standard EU residential registry',
      },
      {
        field: 'PEP Status & Legal Program',
        submittedValue: 'Private Banking Client',
        watchlistValue: 'Verified Non-PEP · Zero Adverse Media Flag',
        matchType: 'clean',
        score: 0,
        note: 'Clean compliance status',
      },
    ],
  },
  {
    id: 'SANCT-2026-004',
    entityName: 'Sberbank Trade Corp',
    originalScript: 'ПАО Сбербанк / Sberbank Trade Corp',
    entityType: 'corporate',
    matchScore: 98,
    matchStatus: 'prohibited_match',
    sanctionList: 'EU Sanctions Article 5',
    program: 'EU Reg 833/2014 Annex XIII · UK Sanctions S.I. 2022/194 · OFAC SSI Directives',
    matchedAttributesSummary: 'LEI RU-9912048, Sector: Financials, Subsidiary of Sberbank PJSC',
    country: 'Russia',
    jurisdiction: 'EU / UK / OFAC Sectoral',
    dateOfBirthOrIncorporation: '2008-11-14',
    nationalIdOrLei: 'LEI: 253400X89892182 / INN: 7707083893',
    address: 'Vavilova St 19, Moscow, 117997, Russia',
    aliases: ['Sber Trade LLC', 'Sberbank Trading House', 'PJSC Sberbank Sub-Entity'],
    pepLevel: 'State-Owned Enterprise (SOE) · Comprehensive Asset Freeze',
    remarks:
      'Subject to broad asset freeze and prohibitions on financial dealings, capital markets, and correspondent accounts.',
    lastScreened: '1h ago',
    attributeComparisons: [
      {
        field: 'Legal Entity Name',
        submittedValue: 'Sberbank Trade Corp',
        watchlistValue: 'PJSC SBERBANK / Sberbank Trade Corp (ПАО Сбербанк)',
        matchType: 'exact',
        score: 99,
        note: 'Substantial majority-owned direct subsidiary matching designated parent',
      },
      {
        field: 'Known Aliases & AKAs',
        submittedValue: 'Sber Trade LLC, Sberbank Trading House',
        watchlistValue: 'Sberbank Trading House / Sber Trade / Sberbank Capital LLC',
        matchType: 'exact',
        score: 100,
        note: '100% match on registered trading names in EU Annex XIII',
      },
      {
        field: 'Date of Incorporation',
        submittedValue: '2008-11-14',
        watchlistValue: '2008-11-14 (Moscow, Russian Federation)',
        matchType: 'exact',
        score: 100,
        note: 'Registration date matching corporate charter record',
      },
      {
        field: 'LEI / Corporate Tax ID',
        submittedValue: 'LEI 253400X89892182 / INN 7707083893',
        watchlistValue: 'LEI 253400X89892182 / INN 7707083893 / OGRN 1027700132195',
        matchType: 'exact',
        score: 100,
        note: 'Unique global Legal Entity Identifier (LEI) direct match',
      },
      {
        field: 'Registered Head Office',
        submittedValue: 'Vavilova St 19, Moscow, 117997, Russia',
        watchlistValue: '19 Vavilova St, Moscow 117997, Russian Federation',
        matchType: 'exact',
        score: 98,
        note: 'Exact match with sanctioned financial headquarters address',
      },
      {
        field: 'Sanction Program & Enforcement',
        submittedValue: 'Corporate Investment Account',
        watchlistValue: 'EU Article 5 / UK HMT Sanctions / OFAC 50% Rule Asset Freeze',
        matchType: 'exact',
        score: 100,
        note: 'Mandatory transaction blocking and immediate regulatory freeze required',
      },
    ],
  },
]

export function ComplianceSanctionsScreener({
  initialSearch = 'Viktor Ivanov',
  initialCountry = 'all',
  initialThreshold = 85,
  initialRecords,
  className,
}: ComplianceSanctionsScreenerProps) {
  const [searchQuery, setSearchQuery] = React.useState(initialSearch)
  const [selectedCountry, setSelectedCountry] = React.useState(initialCountry)
  const [selectedEntityType, setSelectedEntityType] = React.useState<'all' | EntityType>('all')
  const [thresholdValue, setThresholdValue] = React.useState(initialThreshold)

  const [records, setRecords] = React.useState<SanctionRecord[]>(() =>
    initialRecords ? JSON.parse(JSON.stringify(initialRecords)) : JSON.parse(JSON.stringify(defaultSanctionRecords)),
  )

  React.useEffect(() => {
    if (initialRecords) {
      setRecords(JSON.parse(JSON.stringify(initialRecords)))
    }
  }, [initialRecords])

  const [isBatchScreening, setIsBatchScreening] = React.useState(false)
  const [notificationBanner, setNotificationBanner] = React.useState<{
    message: string
    type: 'success' | 'warning' | 'info' | 'destructive'
  } | null>(null)

  const [selectedRecord, setSelectedRecord] = React.useState<SanctionRecord | null>(null)
  const [isInvestigationOpen, setIsInvestigationOpen] = React.useState(false)

  const showNotification = React.useCallback(
    (message: string, type: 'success' | 'warning' | 'info' | 'destructive' = 'info') => {
      setNotificationBanner({ message, type })
      setTimeout(() => {
        setNotificationBanner((prev) => (prev?.message === message ? null : prev))
      }, 4500)
    },
    [],
  )

  const handleRunBatchScreening = () => {
    setIsBatchScreening(true)
    setTimeout(() => {
      setIsBatchScreening(false)
      showNotification(
        'Batch screening completed. 1,420 entities cross-referenced against 4 global registries. 12 matches flagged.',
        'success',
      )
    }, 1200)
  }

  const handleClearFalsePositive = (record: SanctionRecord) => {
    setRecords((prev) => prev.map((r) => (r.id === record.id ? { ...r, matchStatus: 'cleared_false_positive' } : r)))
    showNotification(
      `False positive cleared for "${record.entityName}". Compliance audit log logged with officer signature.`,
      'success',
    )
  }

  const handleBlockEntity = (record: SanctionRecord) => {
    setRecords((prev) => prev.map((r) => (r.id === record.id ? { ...r, matchStatus: 'blocked' } : r)))
    showNotification(
      `Entity "${record.entityName}" confirmed PROHIBITED. Asset freeze locked and SAR report staged for FinCEN / EU MLRO.`,
      'destructive',
    )
  }

  const handleEscalate = (record: SanctionRecord) => {
    showNotification(
      `Case for "${record.entityName}" escalated to Senior Compliance Officer & Legal Counsel for review.`,
      'warning',
    )
    setIsInvestigationOpen(false)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCountry('all')
    setSelectedEntityType('all')
    setThresholdValue(85)
    showNotification('Filters reset to default workbench view.', 'info')
  }

  const openInvestigation = (record: SanctionRecord) => {
    setSelectedRecord(record)
    setIsInvestigationOpen(true)
  }

  const filteredRecords = React.useMemo(() => {
    return records.filter((record) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchesName = record.entityName.toLowerCase().includes(q)
        const matchesAlias = record.aliases.some((a) => a.toLowerCase().includes(q))
        const matchesList = record.sanctionList.toLowerCase().includes(q)
        const matchesId = record.nationalIdOrLei.toLowerCase().includes(q)
        const matchesSummary = record.matchedAttributesSummary.toLowerCase().includes(q)
        if (!matchesName && !matchesAlias && !matchesList && !matchesId && !matchesSummary) {
          return false
        }
      }

      if (selectedCountry !== 'all' && record.country !== selectedCountry) {
        return false
      }

      if (selectedEntityType !== 'all' && record.entityType !== selectedEntityType) {
        return false
      }

      return true
    })
  }, [records, searchQuery, selectedCountry, selectedEntityType])

  const totalScreenedCount = 1420
  const clearedCount = React.useMemo(() => {
    const baseCleared = 1408
    const additionalCleared = records.filter((r) => r.matchStatus === 'cleared_false_positive').length
    const newlyBlocked = records.filter((r) => r.matchStatus === 'blocked').length
    return baseCleared + additionalCleared - newlyBlocked
  }, [records])

  const flaggedCount = React.useMemo(() => {
    const basePending = 12
    const cleared = records.filter((r) => r.matchStatus === 'cleared_false_positive').length
    const blocked = records.filter((r) => r.matchStatus === 'blocked').length
    return Math.max(0, basePending - cleared - blocked)
  }, [records])

  const blockedCount = React.useMemo(() => {
    return records.filter((r) => r.matchStatus === 'blocked').length
  }, [records])

  return (
    <div className={cn('text-foreground w-full space-y-6', className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">AML / OFAC Sanctions &amp; PEP Screening</h1>
            <Badge
              wrap
              variant="outline"
              className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 py-0.5 text-emerald-600 dark:text-emerald-400"
            >
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="font-medium">OFAC SDN, EU Consolidated, UK HMT, UN Sanctions · Synced 10m ago</span>
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
            Automated identity verification, Politically Exposed Persons (PEP), and multilateral sanctions screening
            workbench.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="default"
            size="sm"
            disabled={isBatchScreening}
            className="cursor-pointer gap-2 shadow-xs"
            onClick={handleRunBatchScreening}
          >
            <RefreshCw className={cn('size-4', isBatchScreening && 'animate-spin')} />
            <span>{isBatchScreening ? 'Screening 1,420 Records...' : 'Run Batch Screening'}</span>
          </Button>
        </div>
      </div>

      {/* Notification Toast / Banner */}
      {notificationBanner && (
        <div
          className={cn(
            'flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-xs transition-all duration-200 sm:text-sm',
            notificationBanner.type === 'success' &&
              'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
            notificationBanner.type === 'warning' &&
              'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300',
            notificationBanner.type === 'destructive' &&
              'bg-destructive/10 border-destructive/30 text-destructive dark:text-red-300',
            notificationBanner.type === 'info' && 'bg-primary/10 border-primary/20 text-primary',
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            {notificationBanner.type === 'success' && <CheckCircle2 className="size-4 shrink-0" />}
            {notificationBanner.type === 'warning' && <AlertTriangle className="size-4 shrink-0" />}
            {notificationBanner.type === 'destructive' && <Ban className="size-4 shrink-0" />}
            {notificationBanner.type === 'info' && <Info className="size-4 shrink-0" />}
            <span>{notificationBanner.message}</span>
          </div>
          <button
            type="button"
            className="rounded-md p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            onClick={() => setNotificationBanner(null)}
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* 4 Screening Telemetry Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Screened */}
        <Card className="border-border/80 border shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Total Screened Today
              </span>
              <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md">
                <Users className="size-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight tabular-nums">
                {totalScreenedCount.toLocaleString()}
              </span>
              <span className="text-muted-foreground text-xs font-medium">Entities</span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">+14.2%</span> vs yesterday · 38
              automated batches
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Clear / No Matches */}
        <Card className="border-border/80 border shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Clear / No Matches
              </span>
              <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-emerald-600 tabular-nums dark:text-emerald-400">
                {clearedCount.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-emerald-700 tabular-nums dark:text-emerald-300">
                Cleared · 99.2%
              </span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">Low Risk · 0 PEP matches · 0 adverse media</p>
          </CardContent>
        </Card>

        {/* Card 3: Potential Matches Flagged */}
        <Card className="border-border/80 border shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Potential Matches Flagged
              </span>
              <div className="flex size-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="size-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-amber-600 tabular-nums dark:text-amber-400">
                {flaggedCount}
              </span>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Pending Review</span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">Action required · SLA &lt;2h · 1 high confidence</p>
          </CardContent>
        </Card>

        {/* Card 4: Confirmed Prohibited Matches */}
        <Card className="border-border/80 border shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Confirmed Prohibited Matches
              </span>
              <div className="bg-destructive/10 text-destructive flex size-8 items-center justify-center rounded-md">
                <Ban className="size-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span
                className={cn(
                  'text-2xl font-bold tracking-tight tabular-nums',
                  blockedCount > 0 ? 'text-destructive' : 'text-foreground',
                )}
              >
                {blockedCount}
              </span>
              <span className="text-muted-foreground text-xs font-semibold">Blocked</span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">Asset freeze locked · FinCEN SAR ready</p>
          </CardContent>
        </Card>
      </div>

      {/* Real-Time Entity Search Bar & Fuzzy Threshold Workbench */}
      <Card className="border-border/80 bg-card border shadow-xs">
        <CardContent className="space-y-4 p-4 sm:p-5">
          <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-12">
            {/* Search Input */}
            <div className="space-y-1.5 md:col-span-4">
              <label
                htmlFor="react-entity-search-input"
                className="text-foreground flex items-center gap-1.5 text-xs font-medium"
              >
                <Search className="text-muted-foreground size-3.5" />
                <span>Search Individual / Entity Name</span>
              </label>
              <div className="relative">
                <Input
                  id="react-entity-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Search name, alias, ID or passport..."
                  className="bg-background pl-8 text-xs sm:text-sm"
                />
                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Country Filter Dropdown */}
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-foreground flex items-center gap-1.5 text-xs font-medium">
                <Globe className="text-muted-foreground size-3.5" />
                <span>Country / Domicile Filter</span>
              </label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="bg-background w-full text-xs sm:text-sm [&>span]:truncate [&>svg]:shrink-0">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="Russia">Russia (Russian Federation)</SelectItem>
                  <SelectItem value="United States">United States (USA)</SelectItem>
                  <SelectItem value="Cyprus">Cyprus (EU)</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom (UK)</SelectItem>
                  <SelectItem value="Switzerland">Switzerland (CH)</SelectItem>
                  <SelectItem value="United Arab Emirates">United Arab Emirates (UAE)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Entity Type Pills */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-foreground flex items-center gap-1.5 text-xs font-medium">
                <Building2 className="text-muted-foreground size-3.5" />
                <span>Entity Type</span>
              </label>
              <div className="bg-muted border-input flex h-9 items-center gap-1 rounded-md border p-1">
                <button
                  type="button"
                  className={cn(
                    'flex-1 rounded px-2 py-1 text-xs font-medium transition-colors',
                    selectedEntityType === 'all'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setSelectedEntityType('all')}
                >
                  All
                </button>
                <button
                  type="button"
                  className={cn(
                    'flex-1 rounded px-2 py-1 text-xs font-medium transition-colors',
                    selectedEntityType === 'individual'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setSelectedEntityType('individual')}
                >
                  Indiv.
                </button>
                <button
                  type="button"
                  className={cn(
                    'flex-1 rounded px-2 py-1 text-xs font-medium transition-colors',
                    selectedEntityType === 'corporate'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setSelectedEntityType('corporate')}
                >
                  Corp.
                </button>
              </div>
            </div>

            {/* Match Threshold Slider */}
            <div className="space-y-1.5 md:col-span-3">
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <label className="text-foreground flex items-center gap-1.5 text-xs font-medium">
                  <Sliders className="text-muted-foreground size-3.5" />
                  <span>Match Threshold</span>
                </label>
                <Badge wrap variant="secondary" className="text-xs font-semibold tabular-nums">
                  {thresholdValue}% Fuzzy Match
                </Badge>
              </div>
              <div className="pt-1.5">
                <Slider
                  value={[thresholdValue]}
                  onValueChange={(val) => setThresholdValue(val[0] ?? 85)}
                  min={50}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Filter helper status bar */}
          <div className="border-border/60 text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t pt-2 text-xs">
            <div className="flex min-w-0 items-center gap-2">
              <span>
                Showing <strong className="text-foreground tabular-nums">{filteredRecords.length}</strong> of{' '}
                <strong className="text-foreground tabular-nums">{records.length}</strong> screening audit records
              </span>
              {(searchQuery || selectedCountry !== 'all' || selectedEntityType !== 'all') && (
                <span className="text-muted-foreground/60">· Filters applied</span>
              )}
            </div>
            <div className="flex min-w-0 items-center gap-2">
              {(searchQuery || selectedCountry !== 'all' || selectedEntityType !== 'all' || thresholdValue !== 85) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground h-7 gap-1 text-xs"
                  onClick={handleResetFilters}
                >
                  <RotateCcw className="size-3" />
                  <span>Reset Filters</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Screening Match Results Table */}
      <Card className="border-border/80 overflow-hidden border shadow-xs">
        <CardHeader className="border-border/60 border-b p-4 pb-3 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Active Screening Queue &amp; Target List Matches
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs">
                Real-time fuzzy scoring across OFAC SDN, Sectoral SSI, EU Restrictive Measures, and UN Security Council
                lists.
              </CardDescription>
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <span className="inline-block size-2 rounded-full bg-amber-500" />
              <span>Amber: Requires Review</span>
              <span className="bg-destructive ml-2 inline-block size-2 rounded-full" />
              <span>Red: Prohibited Asset Freeze</span>
            </div>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="min-w-[220px]">Entity Name &amp; Classification</TableHead>
                <TableHead className="min-w-[140px]">Match Score &amp; Status</TableHead>
                <TableHead className="min-w-[200px]">Designated Watchlist / Program</TableHead>
                <TableHead className="min-w-[220px]">Matched Attributes</TableHead>
                <TableHead className="min-w-[130px]">Jurisdiction</TableHead>
                <TableHead className="min-w-[220px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow
                  key={record.id}
                  className={cn(
                    'hover:bg-muted/30 transition-colors',
                    record.matchStatus === 'potential_match' && 'bg-amber-500/[0.02]',
                    record.matchStatus === 'prohibited_match' && 'bg-destructive/[0.03]',
                    record.matchStatus === 'blocked' && 'bg-destructive/[0.06] opacity-90',
                  )}
                >
                  {/* 1. Entity Name & Classification */}
                  <TableCell className="py-3.5 align-top font-medium">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={cn(
                          'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                          record.entityType === 'individual'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-secondary text-secondary-foreground',
                        )}
                      >
                        {record.entityType === 'individual' ? (
                          <User className="size-4" />
                        ) : (
                          <Building2 className="size-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-foreground font-semibold">{record.entityName}</span>
                          <Badge wrap variant="outline" className="px-1.5 py-0 text-xs uppercase">
                            {record.entityType}
                          </Badge>
                        </div>
                        {record.originalScript && (
                          <p className="text-muted-foreground mt-0.5 text-xs">{record.originalScript}</p>
                        )}
                        {record.aliases && record.aliases.length > 0 && (
                          <div className="text-muted-foreground/80 mt-1 flex flex-wrap gap-1 text-xs">
                            <span className="font-medium">AKAs:</span>
                            <span>
                              {record.aliases.slice(0, 2).join(', ')}
                              {record.aliases.length > 2 ? ` (+${record.aliases.length - 2} more)` : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* 2. Match Score & Status */}
                  <TableCell className="py-3.5 align-top">
                    <div className="space-y-1">
                      {record.matchStatus === 'blocked' ? (
                        <Badge wrap variant="destructive" className="gap-1 text-xs font-semibold">
                          <Ban className="size-3" />
                          <span>Blocked &amp; Frozen</span>
                        </Badge>
                      ) : record.matchStatus === 'cleared_false_positive' ? (
                        <Badge
                          wrap
                          variant="outline"
                          className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                        >
                          <CheckCircle2 className="size-3" />
                          <span>Cleared (False Positive)</span>
                        </Badge>
                      ) : record.matchScore >= 95 ? (
                        <Badge wrap variant="destructive" className="gap-1 text-xs font-semibold tabular-nums">
                          <ShieldX className="size-3" />
                          <span>{record.matchScore}% Critical Match</span>
                        </Badge>
                      ) : record.matchScore >= thresholdValue ? (
                        <Badge
                          wrap
                          variant="outline"
                          className="gap-1 border-amber-500/40 bg-amber-500/15 text-xs font-semibold text-amber-700 tabular-nums dark:text-amber-300"
                        >
                          <AlertTriangle className="size-3" />
                          <span>{record.matchScore}% Match</span>
                        </Badge>
                      ) : (
                        <Badge
                          wrap
                          variant="outline"
                          className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-600 tabular-nums dark:text-emerald-400"
                        >
                          <Check className="size-3" />
                          <span>{record.matchScore}% Match · Clear</span>
                        </Badge>
                      )}

                      <div className="text-muted-foreground text-xs tabular-nums">Screened {record.lastScreened}</div>
                    </div>
                  </TableCell>

                  {/* 3. Target Sanctions List & Programs */}
                  <TableCell className="py-3.5 align-top">
                    <div className="space-y-1">
                      <div className="text-foreground text-xs font-medium">{record.sanctionList}</div>
                      <div className="text-muted-foreground line-clamp-2 text-xs">{record.program}</div>
                      {record.pepLevel && (
                        <div className="text-xs font-medium text-amber-700 dark:text-amber-300">{record.pepLevel}</div>
                      )}
                    </div>
                  </TableCell>

                  {/* 4. Matched Attributes */}
                  <TableCell className="py-3.5 align-top">
                    <div className="space-y-1 text-xs">
                      <div className="text-foreground font-medium">{record.matchedAttributesSummary}</div>
                      <div className="text-muted-foreground tabular-nums">ID: {record.nationalIdOrLei}</div>
                      <div className="text-muted-foreground max-w-[240px] truncate">{record.address}</div>
                    </div>
                  </TableCell>

                  {/* 5. Jurisdiction */}
                  <TableCell className="py-3.5 align-top">
                    <div className="space-y-1 text-xs">
                      <div className="text-foreground flex items-center gap-1 font-medium">
                        <Globe className="text-muted-foreground size-3 shrink-0" />
                        <span>{record.country}</span>
                      </div>
                      <div className="text-muted-foreground">{record.jurisdiction}</div>
                    </div>
                  </TableCell>

                  {/* 6. Actions */}
                  <TableCell className="py-3.5 text-right align-top">
                    <div className="flex flex-col items-end justify-end gap-1.5 sm:flex-row sm:items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 cursor-pointer gap-1.5 text-xs"
                        onClick={() => openInvestigation(record)}
                      >
                        <Eye className="size-3.5" />
                        <span>Review Match</span>
                      </Button>

                      {record.id === 'SANCT-2026-001' &&
                        record.matchStatus !== 'cleared_false_positive' &&
                        record.matchStatus !== 'blocked' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 cursor-pointer gap-1 text-xs text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-emerald-400"
                              onClick={() => handleClearFalsePositive(record)}
                            >
                              <Check className="size-3.5" />
                              <span>Clear False Positive</span>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-8 cursor-pointer gap-1 text-xs"
                              onClick={() => handleBlockEntity(record)}
                            >
                              <Ban className="size-3.5" />
                              <span>Block &amp; Freeze</span>
                            </Button>
                          </>
                        )}

                      {record.id === 'SANCT-2026-004' && record.matchStatus !== 'blocked' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 cursor-pointer gap-1 text-xs"
                          onClick={() => handleBlockEntity(record)}
                        >
                          <Ban className="size-3.5" />
                          <span>Block Entity</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground py-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileSearch className="text-muted-foreground/50 size-8" />
                      <p className="text-sm font-medium">No matching screening records found</p>
                      <p className="text-xs">Adjust your search keyword, country filter, or match threshold.</p>
                      <Button variant="outline" size="sm" className="mt-2 text-xs" onClick={handleResetFilters}>
                        Reset Filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Sanction Match Investigation Modal / Dialog */}
      <Dialog open={isInvestigationOpen} onOpenChange={setIsInvestigationOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          {selectedRecord && (
            <>
              <DialogHeader>
                <div className="flex min-w-0 items-center gap-2.5">
                  <div
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-lg',
                      selectedRecord.matchScore >= 85
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
                    )}
                  >
                    {selectedRecord.matchScore >= 85 ? (
                      <ShieldAlert className="size-5" />
                    ) : (
                      <ShieldCheck className="size-5" />
                    )}
                  </div>
                  <div>
                    <DialogTitle className="text-base font-bold sm:text-lg">
                      Sanction Match Investigation &amp; Attribute Comparison
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-0.5 text-xs">
                      Detailed biometric, legal entity registry, and designated watchlist reconciliation audit trail.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Entity Overview Banner */}
                <div className="border-border bg-muted/40 grid grid-cols-1 gap-3 rounded-lg border p-3 text-xs sm:grid-cols-3">
                  <div>
                    <span className="text-muted-foreground block">Subject Entity Name</span>
                    <strong className="text-foreground text-sm font-semibold">{selectedRecord.entityName}</strong>
                    {selectedRecord.originalScript && (
                      <div className="text-muted-foreground mt-0.5 text-xs">{selectedRecord.originalScript}</div>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Fuzzy Algorithm Score</span>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span
                        className={cn(
                          'text-sm font-bold tabular-nums',
                          selectedRecord.matchScore >= 85
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-emerald-600 dark:text-emerald-400',
                        )}
                      >
                        {selectedRecord.matchScore}% Match
                      </span>
                      <Badge
                        wrap
                        variant={
                          selectedRecord.matchScore >= 95
                            ? 'destructive'
                            : selectedRecord.matchScore >= 85
                              ? 'outline'
                              : 'success'
                        }
                        className="py-0 text-xs"
                      >
                        {selectedRecord.matchScore >= 95
                          ? 'Critical Risk'
                          : selectedRecord.matchScore >= 85
                            ? 'High Confidence'
                            : 'Clear / Clean'}
                      </Badge>
                    </div>
                    <span className="text-muted-foreground text-xs">Threshold: {thresholdValue}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Primary Watchlist Source</span>
                    <strong className="text-foreground mt-0.5 line-clamp-1 font-medium">
                      {selectedRecord.sanctionList}
                    </strong>
                    <span className="text-muted-foreground text-xs">{selectedRecord.jurisdiction}</span>
                  </div>
                </div>

                {/* Attribute Comparison Matrix */}
                <div className="space-y-2">
                  <h4 className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
                    <Layers className="text-primary size-3.5" />
                    <span>Attribute-by-Attribute Verification Matrix</span>
                  </h4>

                  <div className="border-border overflow-hidden rounded-lg border">
                    <Table>
                      <TableHeader className="bg-muted/60">
                        <TableRow>
                          <TableHead className="w-[140px] text-xs">Attribute</TableHead>
                          <TableHead className="min-w-[160px] text-xs">Submitted Query Data</TableHead>
                          <TableHead className="min-w-[200px] text-xs">Designated Watchlist Record</TableHead>
                          <TableHead className="w-[130px] text-right text-xs">Match Verdict</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRecord.attributeComparisons.map((attr, idx) => (
                          <TableRow key={idx} className="hover:bg-muted/20 text-xs">
                            <TableCell className="text-foreground py-2.5 align-top font-medium">{attr.field}</TableCell>
                            <TableCell className="text-muted-foreground py-2.5 align-top">
                              <span className="text-foreground font-medium">{attr.submittedValue}</span>
                            </TableCell>
                            <TableCell className="py-2.5 align-top">
                              <div className="space-y-0.5">
                                <span className="text-foreground font-medium">{attr.watchlistValue}</span>
                                {attr.note && <p className="text-muted-foreground/80 text-xs italic">{attr.note}</p>}
                              </div>
                            </TableCell>
                            <TableCell className="py-2.5 text-right align-top">
                              {attr.matchType === 'exact' ? (
                                <Badge wrap variant="destructive" className="text-xs font-semibold tabular-nums">
                                  {attr.score}% Exact Match
                                </Badge>
                              ) : attr.matchType === 'fuzzy' || attr.matchType === 'partial' ? (
                                <Badge
                                  wrap
                                  variant="outline"
                                  className="border-amber-500/40 bg-amber-500/15 text-xs font-semibold text-amber-700 tabular-nums dark:text-amber-300"
                                >
                                  {attr.score}% Fuzzy Hit
                                </Badge>
                              ) : (
                                <Badge
                                  wrap
                                  variant="outline"
                                  className="border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                                >
                                  Clear
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Legal Authority & Compliance Advisory Warning */}
                {selectedRecord.matchScore >= 85 && (
                  <div className="border-destructive/30 bg-destructive/5 text-foreground space-y-2 rounded-lg border p-3.5 text-xs">
                    <div className="text-destructive flex min-w-0 items-center gap-2 font-semibold">
                      <ShieldAlert className="size-4" />
                      <span>Mandatory Sanctions Compliance &amp; Asset Freeze Notice (31 CFR Part 587)</span>
                    </div>
                    <p className="text-muted-foreground">
                      If confirmed prohibited, all property and interests in property of this entity within U.S. or EU
                      jurisdiction must be immediately blocked and reported to OFAC / designated national sanctions
                      authorities within 10 business days.
                    </p>
                    <div className="text-muted-foreground flex flex-wrap items-center gap-3 font-mono text-xs">
                      <span>Program: {selectedRecord.program}</span>
                      <span>•</span>
                      <span>SAR Filing: Required within 30d</span>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="border-border flex flex-col-reverse gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between">
                <DialogClose asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    Dismiss / Close
                  </Button>
                </DialogClose>

                <div className="flex min-w-0 items-center gap-2">
                  {selectedRecord.matchStatus !== 'cleared_false_positive' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-emerald-400"
                      onClick={() => {
                        handleClearFalsePositive(selectedRecord)
                        setIsInvestigationOpen(false)
                      }}
                    >
                      <Check className="size-3.5" />
                      <span>Clear False Positive</span>
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => handleEscalate(selectedRecord)}
                  >
                    <ShieldAlert className="size-3.5" />
                    <span>Escalate to MLRO</span>
                  </Button>

                  {selectedRecord.matchStatus !== 'blocked' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-1.5 text-xs"
                      onClick={() => {
                        handleBlockEntity(selectedRecord)
                        setIsInvestigationOpen(false)
                      }}
                    >
                      <Ban className="size-3.5" />
                      <span>Confirm Prohibited &amp; Block</span>
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
