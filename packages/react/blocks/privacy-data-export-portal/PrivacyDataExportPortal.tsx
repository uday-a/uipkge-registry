'use client'

import * as React from 'react'
import {
  Activity,
  Archive,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileSpreadsheet,
  FileText,
  FolderArchive,
  HardDrive,
  Info,
  Loader2,
  Lock,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type ExportFormat = 'zip' | 'json' | 'csv'
export type ArchiveStatus = 'ready' | 'processing' | 'expired'

export interface DataCategory {
  id: string
  name: string
  description: string
  sizeMb: number
  recordCount: string
  icon: React.ComponentType<{ className?: string }>
}

export interface ArchiveRecord {
  id: string
  name: string
  format: ExportFormat
  requestedAt: string
  expiresAt: string
  expiresInDays: number
  sizeMb: number
  categories: string[]
  status: ArchiveStatus
}

export interface PrivacyDataExportPortalProps {
  initialCategories?: string[]
  initialFormat?: ExportFormat
  className?: string
}

const categories: DataCategory[] = [
  {
    id: 'profile',
    name: 'Profile & Identity',
    description: 'Account details, email history, avatar, and authentication security credentials.',
    sizeMb: 1.4,
    recordCount: '12 records',
    icon: User,
  },
  {
    id: 'activity',
    name: 'Activity & Audit Logs',
    description: 'Login history, device sessions, security events, and API access traces.',
    sizeMb: 8.6,
    recordCount: '1,420 events',
    icon: Activity,
  },
  {
    id: 'financial',
    name: 'Financial & Transactions',
    description: 'Invoices, payment receipts, subscription history, and billing ledger entries.',
    sizeMb: 3.2,
    recordCount: '48 entries',
    icon: CreditCard,
  },
  {
    id: 'workspace',
    name: 'Workspace Content & Projects',
    description: 'Created blocks, saved templates, comments, custom presets, and file uploads.',
    sizeMb: 35.0,
    recordCount: '312 objects',
    icon: FolderArchive,
  },
]

const initialArchives: ArchiveRecord[] = [
  {
    id: 'DPA-2026-0814',
    name: 'DPA-2026-0814.zip',
    format: 'zip',
    requestedAt: 'Aug 14, 2026 · 09:24 UTC',
    expiresAt: 'Aug 25, 2026',
    expiresInDays: 4,
    sizeMb: 42.1,
    categories: ['Profile', 'Logs', 'Workspace', 'Billing'],
    status: 'ready',
  },
  {
    id: 'DPA-2026-0820',
    name: 'DPA-2026-0820.json',
    format: 'json',
    requestedAt: 'Aug 20, 2026 · 14:15 UTC',
    expiresAt: 'Aug 27, 2026',
    expiresInDays: 7,
    sizeMb: 8.6,
    categories: ['Activity & Audit Logs'],
    status: 'processing',
  },
  {
    id: 'DPA-2026-0201',
    name: 'DPA-2026-0201.zip',
    format: 'zip',
    requestedAt: 'Feb 01, 2026 · 11:02 UTC',
    expiresAt: 'Feb 08, 2026',
    expiresInDays: 0,
    sizeMb: 38.4,
    categories: ['Full Account Archive'],
    status: 'expired',
  },
]

export function PrivacyDataExportPortal({
  initialCategories = ['profile', 'activity', 'financial', 'workspace'],
  initialFormat = 'zip',
  className,
}: PrivacyDataExportPortalProps) {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(initialCategories)
  const [selectedFormat, setSelectedFormat] = React.useState<ExportFormat>(initialFormat)
  const [archives, setArchives] = React.useState<ArchiveRecord[]>(initialArchives)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [notification, setNotification] = React.useState<{
    title: string
    message: string
    type: 'success' | 'info'
  } | null>(null)

  const totalSelectedSize = React.useMemo(() => {
    const sum = categories.filter((c) => selectedCategories.includes(c.id)).reduce((acc, c) => acc + c.sizeMb, 0)
    return sum.toFixed(1)
  }, [selectedCategories])

  const isAllSelected = selectedCategories.length === categories.length

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedCategories([])
    } else {
      setSelectedCategories(categories.map((c) => c.id))
    }
  }

  const triggerExport = (label = 'Custom Data Export', formatToUse = selectedFormat) => {
    if (selectedCategories.length === 0) return

    setIsGenerating(true)
    setNotification({
      title: 'Archive Request Queued',
      message: `${label} requested. Compiling ${selectedCategories.length} categories (${totalSelectedSize} MB) with AES-256 encryption.`,
      type: 'info',
    })

    setTimeout(() => {
      const newId = `DPA-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`
      const catNames = categories.filter((c) => selectedCategories.includes(c.id)).map((c) => c.name.split(' ')[0])

      const newRecord: ArchiveRecord = {
        id: newId,
        name: `${newId}.${formatToUse}`,
        format: formatToUse,
        requestedAt: 'Just now',
        expiresAt: '7 days from now',
        expiresInDays: 7,
        sizeMb: parseFloat(totalSelectedSize),
        categories: catNames,
        status: 'ready',
      }

      setArchives((prev) => [newRecord, ...prev])
      setIsGenerating(false)
      setNotification({
        title: 'Archive Ready',
        message: `Export package ${newRecord.name} (${newRecord.sizeMb} MB) has been generated and is ready for download.`,
        type: 'success',
      })
    }, 1200)
  }

  const requestFullExport = () => {
    setSelectedCategories(categories.map((c) => c.id))
    setSelectedFormat('zip')
    triggerExport('Full Data Export', 'zip')
  }

  const handleDownload = (archive: ArchiveRecord) => {
    setNotification({
      title: 'Download Initiated',
      message: `Securely downloading ${archive.name} (${archive.sizeMb} MB). SHA-256 checksum verified.`,
      type: 'success',
    })
  }

  const handleReRequest = (archive: ArchiveRecord) => {
    setNotification({
      title: 'Archive Re-generation Requested',
      message: `Re-generating expired archive for ${archive.categories.join(', ')}.`,
      type: 'info',
    })
  }

  return (
    <div data-slot="privacy-data-export-portal" className={cn('w-full space-y-6', className)}>
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              Data Privacy & Personal Data Export
            </h1>
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary hidden items-center gap-1 text-xs font-medium sm:inline-flex"
            >
              <Lock className="size-3" />
              GDPR Art. 15
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Request, generate, and download your complete personal data archives under GDPR Article 15.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            size="default"
            className="gap-2 shadow-xs"
            disabled={isGenerating}
            onClick={requestFullExport}
          >
            <Sparkles className="size-4" />
            Request Full Data Export
          </Button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div
          className={cn(
            'flex items-start gap-3 rounded-lg border p-4 text-sm transition-all',
            notification.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200'
              : 'border-blue-500/30 bg-blue-500/10 text-blue-950 dark:text-blue-200',
          )}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Info className="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400" />
          )}
          <div className="flex-1 space-y-0.5">
            <p className="font-medium">{notification.title}</p>
            <p className="text-xs opacity-90">{notification.message}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs hover:bg-transparent"
            onClick={() => setNotification(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* 4 Privacy & Governance Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1: Account Creation Date */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Account Creation Date</CardTitle>
            <div className="border-border bg-muted/50 text-foreground flex size-8 items-center justify-center rounded-md border">
              <Calendar className="text-muted-foreground size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-foreground text-xl font-bold tracking-tight tabular-nums">Nov 12, 2024</div>
            <p className="text-muted-foreground text-xs">
              <span className="text-foreground font-medium tabular-nums">1.8 years</span> active account age
            </p>
          </CardContent>
        </Card>

        {/* Stat 2: Total Data Footprint */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Total Data Footprint</CardTitle>
            <div className="border-border bg-muted/50 text-foreground flex size-8 items-center justify-center rounded-md border">
              <HardDrive className="text-muted-foreground size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-foreground text-xl font-bold tracking-tight tabular-nums">48.2 MB</div>
            <p className="text-muted-foreground text-xs">Across 6 storage domains</p>
          </CardContent>
        </Card>

        {/* Stat 3: Active Data Retention Policy */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Data Retention Policy</CardTitle>
            <div className="border-border bg-muted/50 text-foreground flex size-8 items-center justify-center rounded-md border">
              <Clock className="text-muted-foreground size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-foreground text-xl font-bold tracking-tight tabular-nums">30-Day Policy</div>
            <p className="text-muted-foreground text-xs">Automated purge of activity logs</p>
          </CardContent>
        </Card>

        {/* Stat 4: Consent Status */}
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Consent Status</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-foreground text-xl font-bold tracking-tight tabular-nums">3 / 3 Active</div>
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Required Consents Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Select Data Categories for Export */}
      <Card className="border-border shadow-xs">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-foreground text-lg font-semibold">Select Data Categories for Export</CardTitle>
            <CardDescription>
              Choose specific data domains to compile into your encrypted archive package.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8 self-start text-xs sm:self-auto" onClick={toggleAll}>
            {isAllSelected ? 'Deselect All' : 'Select All Categories'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Checkbox Grid of 4 Categories */}
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            {categories.map((cat) => {
              const Icon = cat.icon
              const isChecked = selectedCategories.includes(cat.id)
              return (
                <div
                  key={cat.id}
                  className={cn(
                    'group flex cursor-pointer items-start gap-3.5 rounded-lg border p-4 transition-all',
                    isChecked
                      ? 'border-primary/50 bg-primary/5 dark:bg-primary/10 shadow-xs'
                      : 'border-border bg-card hover:bg-muted/40',
                  )}
                  onClick={() => toggleCategory(cat.id)}
                >
                  <Checkbox
                    id={`category-${cat.id}`}
                    checked={isChecked}
                    className="mt-1"
                    onCheckedChange={() => toggleCategory(cat.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className="text-muted-foreground size-4" />
                        <label
                          htmlFor={`category-${cat.id}`}
                          className="text-foreground cursor-pointer text-sm leading-none font-medium"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleCategory(cat.id)
                          }}
                        >
                          {cat.name}
                        </label>
                      </div>
                      <Badge variant="secondary" className="shrink-0 font-mono text-xs tabular-nums">
                        {cat.sizeMb} MB
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{cat.description}</p>
                    <div className="text-muted-foreground/80 text-xs tabular-nums">
                      Estimated footprint: <span className="text-foreground font-medium">{cat.recordCount}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <Separator />

          {/* Format selector and generation action bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
              <label className="text-foreground text-sm font-medium whitespace-nowrap">Export Format:</label>
              <Select value={selectedFormat} onValueChange={(val: ExportFormat) => setSelectedFormat(val)}>
                <SelectTrigger className="bg-background w-full sm:w-[260px]">
                  <SelectValue placeholder="Select export format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zip">
                    <div className="flex items-center gap-2">
                      <Archive className="text-muted-foreground size-3.5" />
                      <span>Complete ZIP Bundle (.zip)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <FileText className="text-muted-foreground size-3.5" />
                      <span>JSON Archive (.json)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="text-muted-foreground size-3.5" />
                      <span>CSV Spreadsheet (.csv)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <div className="text-muted-foreground text-xs sm:text-right">
                Selected:{' '}
                <span className="text-foreground font-semibold tabular-nums">
                  {selectedCategories.length} of {categories.length} categories
                </span>
                <span className="text-foreground font-semibold tabular-nums">~{totalSelectedSize} MB</span>
              </div>
              <Button
                type="button"
                className="gap-2 shadow-xs"
                disabled={selectedCategories.length === 0 || isGenerating}
                onClick={() => triggerExport('Custom Data Export')}
              >
                {isGenerating ? <Loader2 className="size-4 animate-spin" /> : <Archive className="size-4" />}
                {isGenerating ? 'Compiling Archive...' : 'Generate Data Archive'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Compliance Notice Box */}
      <div className="border-border bg-muted/40 text-muted-foreground flex items-start gap-3 rounded-lg border p-4 text-xs shadow-xs">
        <Lock className="text-muted-foreground mt-0.5 size-4 shrink-0" />
        <p className="leading-relaxed">
          Under <span className="text-foreground font-medium">GDPR Article 15</span> (Right of Access) and{' '}
          <span className="text-foreground font-medium">CCPA §1798.100</span>, you are entitled to request and receive
          all personal data processed by this service. Export packages are generated on-demand, encrypted with AES-256,
          and available for download for 7 days before automated deletion.
        </p>
      </div>

      {/* Export Archive History Table */}
      <Card className="border-border shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-foreground text-lg font-semibold">Export Archive History</CardTitle>
              <CardDescription>
                Previous data archive requests and generation status. Downloads remain available for 7 days.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-xs tabular-nums">
              {archives.length} archives
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[220px]">Archive ID & Format</TableHead>
                  <TableHead className="min-w-[170px]">Request Date</TableHead>
                  <TableHead className="min-w-[140px]">Expiration</TableHead>
                  <TableHead className="min-w-[100px] text-right">File Size</TableHead>
                  <TableHead className="min-w-[150px]">Status</TableHead>
                  <TableHead className="min-w-[140px] text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archives.map((arc) => (
                  <TableRow key={arc.id} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground font-mono text-xs font-semibold">{arc.name}</span>
                          <Badge variant="outline" className="px-1.5 py-0 font-mono text-xs uppercase">
                            {arc.format}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">{arc.categories.join(', ')}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs tabular-nums">{arc.requestedAt}</TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <span
                          className={cn(
                            'text-xs font-medium tabular-nums',
                            arc.status === 'expired'
                              ? 'text-muted-foreground line-through'
                              : arc.expiresInDays <= 4
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-muted-foreground',
                          )}
                        >
                          {arc.status === 'expired' ? 'Expired' : `Expires in ${arc.expiresInDays} days`}
                        </span>
                        <p className="text-muted-foreground/70 text-xs tabular-nums">{arc.expiresAt}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground text-right font-mono text-xs font-medium tabular-nums">
                      {arc.sizeMb.toFixed(1)} MB
                    </TableCell>
                    <TableCell>
                      {arc.status === 'ready' && (
                        <Badge
                          variant="outline"
                          className="items-center gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                        >
                          <Check className="size-3" />
                          Ready for Download
                        </Badge>
                      )}
                      {arc.status === 'processing' && (
                        <Badge
                          variant="outline"
                          className="items-center gap-1.5 border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-400"
                        >
                          <Loader2 className="size-3 animate-spin" />
                          Processing Archive
                        </Badge>
                      )}
                      {arc.status === 'expired' && (
                        <Badge variant="secondary" className="text-muted-foreground text-xs">
                          Expired
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {arc.status === 'ready' && (
                        <Button
                          aria-label="Download attachment"
                          size="sm"
                          className="h-8 gap-1.5 text-xs shadow-xs"
                          onClick={() => handleDownload(arc)}
                        >
                          <Download className="size-3.5" />
                          Download ZIP
                        </Button>
                      )}
                      {arc.status === 'processing' && (
                        <Button size="sm" variant="secondary" disabled className="h-8 gap-1.5 text-xs opacity-75">
                          <Loader2 className="size-3.5 animate-spin" />
                          Processing...
                        </Button>
                      )}
                      {arc.status === 'expired' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1.5 text-xs"
                          onClick={() => handleReRequest(arc)}
                        >
                          <RefreshCw className="size-3.5" />
                          Re-request
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
