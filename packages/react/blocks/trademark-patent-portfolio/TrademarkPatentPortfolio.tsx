'use client'

import * as React from 'react'
import {
  Award,
  BadgeCheck,
  Building2,
  Calendar,
  Check,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  Scale,
  Search,
  Sparkles,
  UserCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export interface TrademarkPatentPortfolioProps {
  className?: string
}

export type AssetType = 'Utility Patent' | 'Trademark' | 'PCT International'
export type FilingStatus = 'Granted / Registered' | 'Published / Under Exam'

export interface IpAsset {
  id: string
  identifier: string
  officialNumber: string
  title: string
  type: AssetType
  jurisdictionCode: string
  jurisdictionName: string
  jurisdictionFlag: string
  patentOffice: string
  applicationDate: string
  grantDate: string
  status: FilingStatus
  nextDeadline: string
  deadlineNumber: string
  deadlineNote: string
  ipcClass: string
  attorney: string
  gazetteUrl: string
  gazetteLabel: string
}

const ipAssets: IpAsset[] = [
  {
    id: 'ip-1',
    identifier: 'US Patent #11,849,201',
    officialNumber: 'US 11,849,201 B2',
    title: 'Zero-Dependency Dual-Framework AST Generation',
    type: 'Utility Patent',
    jurisdictionCode: 'US',
    jurisdictionName: 'United States',
    jurisdictionFlag: '🇺🇸',
    patentOffice: 'USPTO',
    applicationDate: '2023-04-12',
    grantDate: '2024-06-18',
    status: 'Granted / Registered',
    nextDeadline: 'Dec 2026',
    deadlineNumber: '2026-12-15',
    deadlineNote: 'USPTO 3.5-Year Maintenance Window',
    ipcClass: 'CPC G06F 8/41 · Abstract Syntax Trees',
    attorney: 'Vance & Morrison LLP',
    gazetteUrl: 'https://patents.google.com/patent/US11849201B2/en',
    gazetteLabel: 'View USPTO Gazette',
  },
  {
    id: 'ip-2',
    identifier: 'US Patent #11,420,184',
    officialNumber: 'US 11,420,184 B1',
    title: 'Perceptually Uniform OKLCH Dark Mode Algorithm',
    type: 'Utility Patent',
    jurisdictionCode: 'US',
    jurisdictionName: 'United States',
    jurisdictionFlag: '🇺🇸',
    patentOffice: 'USPTO',
    applicationDate: '2022-09-14',
    grantDate: '2023-08-22',
    status: 'Granted / Registered',
    nextDeadline: 'Feb 2027',
    deadlineNumber: '2027-02-22',
    deadlineNote: 'USPTO 3.5-Year Maintenance Window',
    ipcClass: 'CPC G06T 11/00 · Perceptual Colorimetry',
    attorney: 'Vance & Morrison LLP',
    gazetteUrl: 'https://patents.google.com/patent/US11420184B1/en',
    gazetteLabel: 'View USPTO Gazette',
  },
  {
    id: 'ip-3',
    identifier: 'US Trademark #98421042',
    officialNumber: 'Reg. #7,294,810 (SN 98421042)',
    title: 'UIPKGE™ (Class 09, 42)',
    type: 'Trademark',
    jurisdictionCode: 'US',
    jurisdictionName: 'United States',
    jurisdictionFlag: '🇺🇸',
    patentOffice: 'USPTO',
    applicationDate: '2023-02-10',
    grantDate: '2023-11-14',
    status: 'Granted / Registered',
    nextDeadline: 'Nov 2029',
    deadlineNumber: '2029-11-14',
    deadlineNote: 'Section 8 & 15 Affidavit of Use',
    ipcClass: 'IC 009, 042 · Computer Software & SaaS',
    attorney: 'Kilpatrick Townsend & Stockton',
    gazetteUrl: 'https://tsdr.uspto.gov/',
    gazetteLabel: 'View USPTO TSDR',
  },
  {
    id: 'ip-4',
    identifier: 'WIPO PCT/US2026/018249',
    officialNumber: 'WO 2026/148201 A1',
    title: 'Headless Component State Serialization',
    type: 'PCT International',
    jurisdictionCode: 'WIPO',
    jurisdictionName: 'WIPO International',
    jurisdictionFlag: '🌍',
    patentOffice: 'WIPO IB',
    applicationDate: '2026-01-15',
    grantDate: 'Pending',
    status: 'Published / Under Exam',
    nextDeadline: 'Jul 2027',
    deadlineNumber: '2027-07-15',
    deadlineNote: '30-Mo National Phase Entry Deadline',
    ipcClass: 'IPC G06F 9/44 · Component State Transfer',
    attorney: 'Vance & Morrison LLP',
    gazetteUrl: 'https://patentscope.wipo.int/',
    gazetteLabel: 'View WIPO Patentscope',
  },
  {
    id: 'ip-5',
    identifier: 'EP Patent #3,948,102',
    officialNumber: 'EP 3,948,102 A1',
    title: 'Reactive Virtual DOM Diffing Engine for Web Components',
    type: 'Utility Patent',
    jurisdictionCode: 'EU',
    jurisdictionName: 'European Union',
    jurisdictionFlag: '🇪🇺',
    patentOffice: 'EPO',
    applicationDate: '2024-03-02',
    grantDate: 'Pending',
    status: 'Published / Under Exam',
    nextDeadline: 'Mar 2027',
    deadlineNumber: '2027-03-31',
    deadlineNote: 'EPO 3rd Year Annuity Maintenance Fee',
    ipcClass: 'CPC G06F 9/455 · Virtualized DOM Execution',
    attorney: 'Bardehle Pagenberg Partnerschaft',
    gazetteUrl: 'https://worldwide.espacenet.com/',
    gazetteLabel: 'View EPO Espacenet',
  },
  {
    id: 'ip-6',
    identifier: 'EU Trademark #018942001',
    officialNumber: 'Reg. #018942001',
    title: 'UIPKGE DESIGN SYSTEM™ (Class 09, 35, 42)',
    type: 'Trademark',
    jurisdictionCode: 'EU',
    jurisdictionName: 'European Union',
    jurisdictionFlag: '🇪🇺',
    patentOffice: 'EUIPO',
    applicationDate: '2023-08-05',
    grantDate: '2024-01-19',
    status: 'Granted / Registered',
    nextDeadline: 'May 2030',
    deadlineNumber: '2030-05-08',
    deadlineNote: 'EUIPO 10-Year Trademark Renewal',
    ipcClass: 'IC 009, 035, 042 · Design Systems & Tooling',
    attorney: 'Bardehle Pagenberg Partnerschaft',
    gazetteUrl: 'https://euipo.europa.eu/eSearch/',
    gazetteLabel: 'View EUIPO eSearch',
  },
]

export function TrademarkPatentPortfolio({ className }: TrademarkPatentPortfolioProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedType, setSelectedType] = React.useState<'all' | AssetType>('all')
  const [selectedStatus, setSelectedStatus] = React.useState<'all' | FilingStatus>('all')
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null)

  const filteredAssets = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return ipAssets.filter((asset) => {
      const matchesType = selectedType === 'all' || asset.type === selectedType
      const matchesStatus = selectedStatus === 'all' || asset.status === selectedStatus
      const matchesSearch =
        !query ||
        asset.identifier.toLowerCase().includes(query) ||
        asset.officialNumber.toLowerCase().includes(query) ||
        asset.title.toLowerCase().includes(query) ||
        asset.jurisdictionName.toLowerCase().includes(query) ||
        asset.patentOffice.toLowerCase().includes(query) ||
        asset.ipcClass.toLowerCase().includes(query)
      return matchesType && matchesStatus && matchesSearch
    })
  }, [searchQuery, selectedType, selectedStatus])

  const copyText = (id: string, text: string) => {
    navigator.clipboard?.writeText(text)
    setCopiedId(id)
    setTimeout(() => {
      setCopiedId(null)
    }, 2000)
  }

  const handleExport = () => {
    setFeedbackMessage('Exporting IP Portfolio summary (CSV / PDF)...')
    setTimeout(() => {
      setFeedbackMessage(null)
    }, 3000)
  }

  const handleFileNewAsset = () => {
    setFeedbackMessage('Opening USPTO / WIPO EFS-Web filing wizard...')
    setTimeout(() => {
      setFeedbackMessage(null)
    }, 3000)
  }

  const handleAction = (action: string, asset: IpAsset) => {
    setFeedbackMessage(`${action}: ${asset.identifier}`)
    setTimeout(() => {
      setFeedbackMessage(null)
    }, 3000)
  }

  return (
    <div data-slot="trademark-patent-portfolio" className={cn('w-full space-y-6', className)}>
      {/* Header Section */}
      <Card className="border-border shadow-xs">
        <CardHeader className="flex flex-col gap-4 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5 font-medium">
                <Building2 className="text-muted-foreground size-3.5" aria-hidden="true" />
                <span>UIPKGE Technologies Inc.</span>
              </Badge>
              <Badge wrap variant="secondary" className="gap-1 font-mono text-xs">
                <Scale className="text-primary size-3" aria-hidden="true" />
                <span>12 Patents · 6 Registered Trademarks</span>
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold tracking-tight sm:text-2xl">
              Intellectual Property &amp; Patent Portfolio
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              USPTO, EPO, and WIPO asset docket, grant prosecution tracker, and statutory maintenance timeline.
            </CardDescription>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              aria-label="Download attachment"
              variant="outline"
              className="gap-2 shadow-xs"
              onClick={handleExport}
            >
              <Download className="size-4" aria-hidden="true" />
              <span>Export Portfolio Report</span>
            </Button>
            <Button variant="default" className="gap-2 shadow-xs" onClick={handleFileNewAsset}>
              <Plus className="size-4" aria-hidden="true" />
              <span>File New IP Asset</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Feedback Notification Toast/Banner if active */}
      {feedbackMessage && (
        <div className="border-primary/30 bg-primary/10 text-primary flex items-center justify-between rounded-lg border px-4 py-2.5 text-xs font-medium shadow-xs transition-all">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 shrink-0" aria-hidden="true" />
            <span>{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-primary/70 hover:text-primary rounded text-xs underline underline-offset-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4 IP Portfolio KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Granted Utility Patents */}
        <Card className="border-border shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Granted Patents</span>
              <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Award className="size-4" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-emerald-600 tabular-nums dark:text-emerald-400">
                8 Patents Granted
              </div>
              <p className="text-muted-foreground mt-1 text-xs">6 USPTO · 2 EPO · 100% Enforceable</p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Pending Applications */}
        <Card className="border-border shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Pending Examination</span>
              <div className="flex size-8 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock className="size-4" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-amber-600 tabular-nums dark:text-amber-400">
                4 Under Examination · USPTO
              </div>
              <p className="text-muted-foreground mt-1 text-xs">2 PCT International · 1 USPTO · 1 EPO</p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Registered Trademarks */}
        <Card className="border-border shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Registered Trademarks</span>
              <div className="flex size-8 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <BadgeCheck className="size-4" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-sky-600 tabular-nums dark:text-sky-400">
                6 Trademarks Active
              </div>
              <p className="text-muted-foreground mt-1 text-xs">Classes 09, 35, 42 · Global Protection</p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Next Maintenance Fee */}
        <Card className="border-border shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Next Maintenance Fee</span>
              <div className="flex size-8 items-center justify-center rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Calendar className="size-4" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-rose-600 tabular-nums dark:text-rose-400">
                Due Dec 15, 2026 · USPTO 3.5-Year Window
              </div>
              <p className="text-muted-foreground mt-1 text-xs">Est. fee $2,000 · Surcharge window opens</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table Container Card */}
      <Card className="border-border shadow-xs">
        <CardHeader className="border-border border-b pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Registered Intellectual Property Assets</CardTitle>
              <CardDescription className="text-xs">
                Showing {filteredAssets.length} of {ipAssets.length} assets across USPTO, EUIPO, and WIPO
              </CardDescription>
            </div>

            {/* Controls: Search and Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[200px] flex-1 sm:w-64">
                <Search
                  aria-hidden="true"
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
                />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Search patent #, title, class..."
                  className="h-8 pl-8 text-xs"
                />
              </div>

              {/* Type Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                    <Filter className="size-3.5 opacity-70" aria-hidden="true" />
                    <span>{selectedType === 'all' ? 'Type: All' : selectedType}</span>
                    <MoreHorizontal className="sr-only" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="text-xs">Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedType('all')}>All Types</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType('Utility Patent')}>Utility Patent</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType('Trademark')}>Trademark</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType('PCT International')}>
                    PCT International
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Status Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                    <span>{selectedStatus === 'all' ? 'Status: All' : selectedStatus}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel className="text-xs">Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedStatus('all')}>All Statuses</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus('Granted / Registered')}>
                    Granted / Registered
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus('Published / Under Exam')}>
                    Published / Under Exam
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="min-w-[280px]">Asset Identifier &amp; Title</TableHead>
                  <TableHead className="w-[140px]">Type</TableHead>
                  <TableHead className="w-[160px]">Jurisdiction</TableHead>
                  <TableHead className="w-[160px]">App / Grant Date</TableHead>
                  <TableHead className="w-[170px]">Filing Status</TableHead>
                  <TableHead className="w-[180px]">Next Renewal / Deadline</TableHead>
                  <TableHead className="w-[70px] text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id} className="hover:bg-muted/40 transition-colors">
                    {/* Asset Identifier & Title */}
                    <TableCell className="py-3.5 align-top">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-foreground font-mono text-xs font-bold tracking-tight">
                            {asset.identifier}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyText(asset.id, asset.officialNumber)}
                            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded p-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                            title={`Copy ${asset.officialNumber}`}
                          >
                            {copiedId === asset.id ? (
                              <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                            ) : (
                              <Copy className="size-3" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                        <div className="text-foreground text-xs font-medium">{asset.title}</div>
                        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                          <span>{asset.ipcClass}</span>
                          <span>•</span>
                          <span>Counsel: {asset.attorney}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Type Badge */}
                    <TableCell className="align-top">
                      <Badge
                        variant="outline"
                        className={cn('font-mono text-xs font-medium', {
                          'border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300':
                            asset.type === 'Utility Patent',
                          'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300': asset.type === 'Trademark',
                          'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300':
                            asset.type === 'PCT International',
                        })}
                      >
                        {asset.type}
                      </Badge>
                    </TableCell>

                    {/* Jurisdiction Flag & Office */}
                    <TableCell className="align-top">
                      <div className="flex items-center gap-2">
                        <span className="text-base leading-none" aria-label={asset.jurisdictionName}>
                          {asset.jurisdictionFlag}
                        </span>
                        <div>
                          <div className="text-foreground text-xs font-medium">{asset.jurisdictionName}</div>
                          <div className="text-muted-foreground font-mono text-xs">{asset.patentOffice}</div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Application / Grant Date in tabular-nums */}
                    <TableCell className="align-top">
                      <div className="space-y-0.5 font-mono text-xs tabular-nums">
                        <div className="text-muted-foreground flex items-center gap-1.5">
                          <span className="text-muted-foreground/70">Filing:</span>
                          <span className="text-foreground font-medium">{asset.applicationDate}</span>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1.5">
                          <span className="text-muted-foreground/70">Grant:</span>
                          <span
                            className={
                              asset.grantDate === 'Pending'
                                ? 'font-medium text-amber-600 dark:text-amber-400'
                                : 'text-foreground font-medium'
                            }
                          >
                            {asset.grantDate}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Filing Status */}
                    <TableCell className="align-top">
                      {asset.status === 'Granted / Registered' ? (
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                          <span className="relative flex size-1.5">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                          </span>
                          <span>Granted / Registered</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                          <Clock className="size-3 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                          <span>Published / Under Exam</span>
                        </div>
                      )}
                    </TableCell>

                    {/* Next Renewal / Maintenance Deadline */}
                    <TableCell className="align-top">
                      <div className="space-y-0.5">
                        <div className="text-foreground flex items-center gap-1.5 font-mono text-xs font-semibold tabular-nums">
                          <Calendar className="text-muted-foreground size-3.5" aria-hidden="true" />
                          <span>{asset.nextDeadline}</span>
                        </div>
                        <p className="text-muted-foreground text-xs leading-tight">{asset.deadlineNote}</p>
                      </div>
                    </TableCell>

                    {/* Actions Dropdown */}
                    <TableCell className="py-3.5 text-right align-top">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring"
                          >
                            <MoreHorizontal className="size-4" aria-hidden="true" />
                            <span className="sr-only">Open actions for {asset.identifier}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel className="text-xs">Asset Operations</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleAction(asset.gazetteLabel, asset)}>
                            <ExternalLink className="mr-2 size-4" aria-hidden="true" />
                            <span>{asset.gazetteLabel}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('Download Grant Certificate', asset)}>
                            <Download className="mr-2 size-4" aria-hidden="true" />
                            <span>Download Grant Certificate</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('Assign Counsel', asset)}>
                            <UserCheck className="mr-2 size-4" aria-hidden="true" />
                            <span>Assign Counsel</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => copyText(asset.id, asset.officialNumber)}>
                            <Copy className="mr-2 size-4" aria-hidden="true" />
                            <span>Copy Docket Number</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Empty Filter State */}
                {filteredAssets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-muted-foreground py-10 text-center text-xs">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="text-muted-foreground/60 size-8" aria-hidden="true" />
                        <p className="font-medium">No intellectual property assets match your search filters.</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-1 text-xs"
                          onClick={() => {
                            setSearchQuery('')
                            setSelectedType('all')
                            setSelectedStatus('all')
                          }}
                        >
                          Reset Filters
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TrademarkPatentPortfolio
