'use client'

import * as React from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  FileDown,
  FlaskConical,
  MapPin,
  Printer,
  Search,
  Share2,
  ShieldCheck,
  Stethoscope,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface LabResultsViewerProps {
  className?: string
}

export type TestStatus = 'Normal' | 'High' | 'Low'

export interface LabTest {
  id: string
  name: string
  panel: 'lipid' | 'metabolic' | 'renal'
  panelLabel: string
  loinc: string
  value: number
  unit: string
  referenceRangeText: string
  status: TestStatus
  scaleMin: number
  scaleMax: number
  normalMin: number
  normalMax: number
  markerPercent: number
  rangeZoneLeft: number
  rangeZoneWidth: number
  trendDelta: string
  trendDirection: 'up' | 'down' | 'flat'
  trendStatus: 'warning' | 'success' | 'neutral'
  priorValue: string
  clinicalNote: string
}

const patientInfo = {
  name: 'Sarah Jenkins',
  mrn: 'MRN-9482104',
  dob: 'Apr 12, 1984 (Age 42)',
  sex: 'Female',
  fasting: 'Fasting (12 hours)',
  accession: 'Q-94827104',
  orderedBy: 'Dr. Marcus Thorne, MD, FACP',
  facility: 'Quest Diagnostics Central Lab #842',
  facilityAddress: '100 Clifton Blvd, Clifton, NJ 07012 (CLIA: 31D0691234)',
  collectedDate: 'Aug 18, 2026 · 08:30 AM EDT',
  reportedDate: 'Aug 18, 2026 · 02:45 PM EDT',
  specimen: 'Serum & Plasma (Gold SST / Lavender EDTA)',
}

const labTests: LabTest[] = [
  {
    id: 'chol-total',
    name: 'Total Cholesterol',
    panel: 'lipid',
    panelLabel: 'Lipid Panel (Cardiovascular Risk)',
    loinc: '2093-3',
    value: 215,
    unit: 'mg/dL',
    referenceRangeText: '< 200 mg/dL',
    status: 'High',
    scaleMin: 100,
    scaleMax: 300,
    normalMin: 100,
    normalMax: 200,
    markerPercent: 57.5,
    rangeZoneLeft: 0,
    rangeZoneWidth: 50,
    trendDelta: '+12 mg/dL vs 6 mos ago',
    trendDirection: 'up',
    trendStatus: 'warning',
    priorValue: '203 mg/dL (Feb 2026)',
    clinicalNote: 'Mild elevation. Suggests elevated total circulating atherogenic lipoprotein particles.',
  },
  {
    id: 'chol-ldl',
    name: 'LDL Cholesterol (Calculated)',
    panel: 'lipid',
    panelLabel: 'Lipid Panel (Cardiovascular Risk)',
    loinc: '13457-7',
    value: 138,
    unit: 'mg/dL',
    referenceRangeText: '< 100 mg/dL',
    status: 'High',
    scaleMin: 50,
    scaleMax: 200,
    normalMin: 50,
    normalMax: 100,
    markerPercent: 58.7,
    rangeZoneLeft: 0,
    rangeZoneWidth: 33.3,
    trendDelta: '+18 mg/dL vs 6 mos ago',
    trendDirection: 'up',
    trendStatus: 'warning',
    priorValue: '120 mg/dL (Feb 2026)',
    clinicalNote: 'Above primary prevention target (< 100 mg/dL). Lifestyle modifications indicated.',
  },
  {
    id: 'chol-hdl',
    name: 'HDL Cholesterol',
    panel: 'lipid',
    panelLabel: 'Lipid Panel (Cardiovascular Risk)',
    loinc: '2085-9',
    value: 58,
    unit: 'mg/dL',
    referenceRangeText: '≥ 50 mg/dL',
    status: 'Normal',
    scaleMin: 20,
    scaleMax: 100,
    normalMin: 50,
    normalMax: 100,
    markerPercent: 47.5,
    rangeZoneLeft: 37.5,
    rangeZoneWidth: 62.5,
    trendDelta: '+2 mg/dL vs 6 mos ago',
    trendDirection: 'up',
    trendStatus: 'success',
    priorValue: '56 mg/dL (Feb 2026)',
    clinicalNote: 'Desirable cardio-protective level for adult female population.',
  },
  {
    id: 'triglycerides',
    name: 'Triglycerides',
    panel: 'lipid',
    panelLabel: 'Lipid Panel (Cardiovascular Risk)',
    loinc: '2571-8',
    value: 142,
    unit: 'mg/dL',
    referenceRangeText: '< 150 mg/dL',
    status: 'Normal',
    scaleMin: 50,
    scaleMax: 250,
    normalMin: 50,
    normalMax: 150,
    markerPercent: 46.0,
    rangeZoneLeft: 0,
    rangeZoneWidth: 50,
    trendDelta: '-15 mg/dL vs 6 mos ago',
    trendDirection: 'down',
    trendStatus: 'success',
    priorValue: '157 mg/dL (Feb 2026)',
    clinicalNote: 'Improved from borderline threshold into normal reference zone.',
  },
  {
    id: 'glucose-fasting',
    name: 'Fasting Glucose',
    panel: 'metabolic',
    panelLabel: 'Glucose Metabolism & Glycemic Control',
    loinc: '1558-6',
    value: 92,
    unit: 'mg/dL',
    referenceRangeText: '70 – 99 mg/dL',
    status: 'Normal',
    scaleMin: 50,
    scaleMax: 150,
    normalMin: 70,
    normalMax: 99,
    markerPercent: 42.0,
    rangeZoneLeft: 20,
    rangeZoneWidth: 29,
    trendDelta: '-3 mg/dL vs 6 mos ago',
    trendDirection: 'down',
    trendStatus: 'success',
    priorValue: '95 mg/dL (Feb 2026)',
    clinicalNote: 'Normal euglycemic fasting state. No prediabetes indicators.',
  },
  {
    id: 'egfr-renal',
    name: 'eGFR (Kidney Function)',
    panel: 'renal',
    panelLabel: 'Renal Function & Filtration',
    loinc: '33914-3',
    value: 104,
    unit: 'mL/min/1.73m²',
    referenceRangeText: '≥ 60 mL/min/1.73m²',
    status: 'Normal',
    scaleMin: 30,
    scaleMax: 130,
    normalMin: 60,
    normalMax: 130,
    markerPercent: 74.0,
    rangeZoneLeft: 30,
    rangeZoneWidth: 70,
    trendDelta: '+1 mL/min vs 6 mos ago',
    trendDirection: 'up',
    trendStatus: 'success',
    priorValue: '103 mL/min (Feb 2026)',
    clinicalNote: 'Calculated using CKD-EPI 2021 equation. Robust renal clearance performance.',
  },
]

export function LabResultsViewer({ className }: LabResultsViewerProps) {
  const [activeTab, setActiveTab] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [isCopiedShare, setIsCopiedShare] = React.useState(false)
  const [isDownloadingPdf, setIsDownloadingPdf] = React.useState(false)

  const filteredTests = React.useMemo(() => {
    return labTests.filter((test) => {
      // Tab filter
      if (activeTab === 'out-of-range' && test.status === 'Normal') return false
      if (activeTab === 'lipid' && test.panel !== 'lipid') return false
      if (activeTab === 'metabolic-renal' && test.panel !== 'metabolic' && test.panel !== 'renal') return false

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        return (
          test.name.toLowerCase().includes(q) ||
          test.loinc.toLowerCase().includes(q) ||
          test.panelLabel.toLowerCase().includes(q)
        )
      }

      return true
    })
  }, [activeTab, searchQuery])

  const totalNormalCount = labTests.filter((t) => t.status === 'Normal').length
  const totalOutOfRangeCount = labTests.filter((t) => t.status !== 'Normal').length

  const handleShare = React.useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(
        `Lab Results for ${patientInfo.name} (${patientInfo.accession}) - ${patientInfo.collectedDate}`,
      )
      setIsCopiedShare(true)
      setTimeout(() => {
        setIsCopiedShare(false)
      }, 2000)
    }
  }, [])

  const handleDownloadPdf = React.useCallback(() => {
    setIsDownloadingPdf(true)
    setTimeout(() => {
      setIsDownloadingPdf(false)
    }, 1500)
  }, [])

  const handlePrint = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }, [])

  return (
    <div data-slot="lab-results-viewer" className={cn('text-foreground w-full space-y-6', className)}>
      {/* Header: Diagnostic Pathology Report */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="p-5 pb-4 sm:p-6 sm:pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1.5 font-mono text-xs">
                  <FlaskConical className="text-primary size-3.5" />
                  {patientInfo.accession}
                </Badge>
                <Badge variant="success" className="gap-1 text-xs">
                  <FileCheck2 className="size-3" />
                  Final Diagnostic Report
                </Badge>
              </div>
              <CardTitle className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
                Comprehensive Metabolic Panel & Lipid Panel
              </CardTitle>
              <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                Clinical chemistry and lipid risk profiling conducted by {patientInfo.facility}
              </CardDescription>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 lg:pt-0">
              <Button
                aria-label="Download attachment"
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs shadow-xs"
                disabled={isDownloadingPdf}
                onClick={handleDownloadPdf}
              >
                <FileDown className="size-4" />
                {isDownloadingPdf ? 'Generating PDF...' : 'Download Official PDF'}
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-xs" onClick={handleShare}>
                <Share2 className="size-4" />
                {isCopiedShare ? 'Link Copied!' : 'Share with Doctor'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hidden sm:inline-flex"
                onClick={handlePrint}
              >
                <Printer className="size-4" />
                <span className="sr-only">Print Report</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0 sm:p-6 sm:pt-0">
          <Separator className="mb-4" />

          {/* Patient & Order Metadata Grid */}
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-0.5">
              <dt className="text-muted-foreground text-xs font-medium">Patient Details</dt>
              <dd className="text-foreground text-xs font-semibold sm:text-sm">{patientInfo.name}</dd>
              <p className="text-muted-foreground text-xs">
                {patientInfo.sex} · {patientInfo.dob}
              </p>
            </div>

            <div className="space-y-0.5">
              <dt className="text-muted-foreground text-xs font-medium">Ordering Physician</dt>
              <dd className="text-foreground text-xs font-semibold sm:text-sm">{patientInfo.orderedBy}</dd>
              <p className="text-muted-foreground text-xs">Internal Medicine & Cardiology</p>
            </div>

            <div className="space-y-0.5">
              <dt className="text-muted-foreground text-xs font-medium">Collection & Fasting</dt>
              <dd className="text-foreground text-xs font-semibold tabular-nums sm:text-sm">
                {patientInfo.collectedDate}
              </dd>
              <p className="text-muted-foreground text-xs">{patientInfo.fasting}</p>
            </div>

            <div className="space-y-0.5">
              <dt className="text-muted-foreground text-xs font-medium">Testing Facility</dt>
              <dd className="text-foreground text-xs font-semibold sm:text-sm">{patientInfo.facility}</dd>
              <p className="text-muted-foreground text-xs">CLIA ID: 31D0691234 · CAP Accredited</p>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Overall Summary Banner */}
      <div className="border-warning/30 bg-warning/10 text-foreground flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3.5">
          <div className="border-warning/30 bg-warning/20 text-warning mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border">
            <AlertTriangle className="size-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-foreground text-sm font-semibold sm:text-base">
                14 tests normal · 2 tests out of reference range
              </h3>
              <Badge variant="warning" className="text-xs font-medium">
                Clinical Review Advised
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
              Total Cholesterol and LDL Cholesterol exceed recommended reference thresholds. Fasting glucose metabolism
              and renal function (eGFR) remain optimal.
            </p>
          </div>
        </div>

        {/* Quick Statistical Count Badges */}
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:self-center">
          <div className="border-border bg-card/90 flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs shadow-2xs">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground font-medium">In Range:</span>
            <span className="text-foreground font-semibold tabular-nums">14</span>
          </div>
          <div className="border-border bg-card/90 flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs shadow-2xs">
            <span className="size-2 rounded-full bg-amber-500" />
            <span className="text-muted-foreground font-medium">Out of Range:</span>
            <span className="text-warning font-semibold tabular-nums">2</span>
          </div>
        </div>
      </div>

      {/* Interactive Filtering & Search Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-4 sm:inline-flex">
            <TabsTrigger value="all" className="text-xs font-medium">
              All ({labTests.length})
            </TabsTrigger>
            <TabsTrigger value="out-of-range" className="text-xs font-medium">
              Out of Range ({totalOutOfRangeCount})
            </TabsTrigger>
            <TabsTrigger value="lipid" className="text-xs font-medium">
              Lipid (4)
            </TabsTrigger>
            <TabsTrigger value="metabolic-renal" className="text-xs font-medium">
              Metabolic & Renal (2)
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Test Search Filter Input */}
        <div className="relative w-full sm:w-64">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Filter tests or LOINC..."
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-8.5 w-full rounded-lg border pr-3 pl-9 text-xs transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
          />
        </div>
      </div>

      {/* Diagnostic Panels & Test Results Table */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="border-border border-b p-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Laboratory Test Panels</CardTitle>
              <CardDescription className="text-xs">
                Quantitative measurements, standard LOINC reference intervals, and 6-month historical trend comparison.
              </CardDescription>
            </div>
            <span className="text-muted-foreground hidden font-mono text-xs tabular-nums sm:inline-block">
              Showing {filteredTests.length} of {labTests.length} tests
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="min-w-[180px] text-xs font-semibold">Test Name & Code</TableHead>
                  <TableHead className="min-w-[120px] text-xs font-semibold">Measured Value</TableHead>
                  <TableHead className="w-24 text-xs font-semibold">Flag</TableHead>
                  <TableHead className="min-w-[120px] text-xs font-semibold">Reference Range</TableHead>
                  <TableHead className="min-w-[210px] text-xs font-semibold">Visual Scale</TableHead>
                  <TableHead className="min-w-[170px] text-right text-xs font-semibold">
                    Historical 6-Mo Delta
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.map((test) => (
                  <TableRow
                    key={test.id}
                    className={cn('transition-colors', test.status === 'High' && 'bg-warning/5 hover:bg-warning/10')}
                  >
                    {/* Test Name & LOINC */}
                    <TableCell className="py-3.5">
                      <div className="space-y-0.5">
                        <p className="text-foreground text-xs font-semibold sm:text-sm">{test.name}</p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground font-mono text-xs">LOINC: {test.loinc}</span>
                          <span className="text-muted-foreground text-xs">{test.panelLabel}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Measured Result */}
                    <TableCell className="py-3.5">
                      <div className="flex items-baseline gap-1">
                        <span
                          className={cn(
                            'text-base font-semibold tabular-nums sm:text-lg',
                            test.status === 'High' && 'text-warning font-semibold',
                            test.status === 'Normal' && 'text-foreground',
                          )}
                        >
                          {test.value}
                        </span>
                        <span className="text-muted-foreground text-xs font-medium">{test.unit}</span>
                      </div>
                    </TableCell>

                    {/* Status Flag Badge */}
                    <TableCell className="py-3.5">
                      <Badge
                        variant={test.status === 'High' ? 'warning' : 'success'}
                        className="px-2 py-0.5 text-xs font-semibold"
                      >
                        {test.status}
                      </Badge>
                    </TableCell>

                    {/* Reference Range */}
                    <TableCell className="py-3.5">
                      <span className="text-foreground font-mono text-xs font-medium tabular-nums">
                        {test.referenceRangeText}
                      </span>
                    </TableCell>

                    {/* Visual Reference Range Bar with Patient Needle Marker */}
                    <TableCell className="py-3.5">
                      <div className="w-full max-w-[210px] space-y-1">
                        <div className="bg-muted/80 relative flex h-2.5 w-full items-center overflow-visible rounded-full">
                          {/* Normal Safe Zone (Green Region) */}
                          <div
                            className="absolute h-full rounded-full border-x border-emerald-500/40 bg-emerald-500/25 dark:bg-emerald-500/35"
                            style={{
                              left: `${test.rangeZoneLeft}%`,
                              width: `${test.rangeZoneWidth}%`,
                            }}
                          />

                          {/* Patient Value Marker Pin */}
                          <div
                            className="absolute flex -translate-x-1/2 flex-col items-center"
                            style={{ left: `${test.markerPercent}%` }}
                          >
                            <span
                              className={cn(
                                'border-background size-3.5 rounded-full border-2 shadow-xs transition-transform hover:scale-125',
                                test.status === 'High' && 'bg-warning ring-warning/30 ring-2',
                                test.status === 'Normal' && 'bg-emerald-500 ring-2 ring-emerald-500/30',
                                test.status === 'Low' && 'bg-sky-500 ring-2 ring-sky-500/30',
                              )}
                            />
                          </div>
                        </div>

                        {/* Min, Target, and Max Scale Labels */}
                        <div className="text-muted-foreground flex items-center justify-between font-mono text-xs tabular-nums">
                          <span>{test.scaleMin}</span>
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Normal</span>
                          <span>{test.scaleMax}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Historical 6-Mo Trend Delta */}
                    <TableCell className="py-3.5 text-right">
                      <div className="flex flex-col items-end gap-0.5">
                        <div className="flex items-center gap-1">
                          {test.trendDirection === 'up' ? (
                            <TrendingUp
                              className={cn(
                                'size-3.5',
                                test.trendStatus === 'warning' && 'text-warning',
                                test.trendStatus === 'success' && 'text-emerald-500',
                              )}
                            />
                          ) : (
                            <TrendingDown
                              className={cn(
                                'size-3.5',
                                test.trendStatus === 'warning' && 'text-warning',
                                test.trendStatus === 'success' && 'text-emerald-500',
                              )}
                            />
                          )}
                          <span
                            className={cn(
                              'text-xs font-semibold tabular-nums',
                              test.trendStatus === 'warning' && 'text-warning',
                              test.trendStatus === 'success' && 'text-foreground',
                            )}
                          >
                            {test.trendDelta}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-xs tabular-nums"> Prior: {test.priorValue} </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredTests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center">
                      <p className="text-muted-foreground text-xs">
                        No laboratory test records matched your filter criteria.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Doctor's Clinical Impression Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="p-5 pb-3 sm:p-6 sm:pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <Stethoscope className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Doctor's Clinical Impression & Action Plan</CardTitle>
                <CardDescription className="text-xs">
                  Physician interpretation provided by {patientInfo.orderedBy}
                </CardDescription>
              </div>
            </div>

            <Badge variant="outline" className="gap-1.5 text-xs font-normal">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              Verified Electronic Signature
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-5 pt-0 sm:p-6 sm:pt-0">
          {/* Physician Qualitative Commentary */}
          <div className="border-border/70 bg-muted/30 rounded-lg border p-4">
            <p className="text-foreground text-xs leading-relaxed sm:text-sm">
              “Lipid panel shows mild elevation in LDL Cholesterol (138 mg/dL) and Total Cholesterol (215 mg/dL).
              Fasting blood glucose (92 mg/dL) and renal filtration markers (eGFR 104 mL/min/1.73m²) demonstrate
              outstanding stability. Recommend continuing Mediterranean dietary pattern with emphasis on soluble fiber
              and healthy monounsaturated fats, 150 minutes of moderate aerobic exercise weekly, and repeat lipid panel
              in 3 months. Statin therapy is not warranted at the patient's current 10-year ASCVD risk threshold.”
            </p>
          </div>

          {/* Clinical Action Checklist */}
          <div className="space-y-2">
            <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Recommended Clinical Action Items
            </span>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <div className="border-border bg-card flex items-start gap-2.5 rounded-lg border p-3">
                <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-foreground text-xs font-medium">Repeat Lipid Panel</p>
                  <p className="text-muted-foreground text-xs">Schedule re-test in 90 days (Nov 2026)</p>
                </div>
              </div>

              <div className="border-border bg-card flex items-start gap-2.5 rounded-lg border p-3">
                <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-foreground text-xs font-medium">Mediterranean Diet</p>
                  <p className="text-muted-foreground text-xs">Maintain high fiber and plant sterols intake</p>
                </div>
              </div>

              <div className="border-border bg-card flex items-start gap-2.5 rounded-lg border p-3">
                <CheckCircle2 className="text-primary mt-0.5 size-4 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-foreground text-xs font-medium">Cardiovascular Wellness</p>
                  <p className="text-muted-foreground text-xs">150 mins weekly moderate aerobic activity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Physician Signature Footer Strip */}
          <Separator />
          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="border-border bg-muted flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                MT
              </div>
              <div>
                <p className="text-foreground text-xs font-semibold">{patientInfo.orderedBy}</p>
                <p className="text-muted-foreground text-xs">NPI #1849204812 · Medical License #20MD084721</p>
              </div>
            </div>

            <p className="text-muted-foreground font-mono text-xs tabular-nums">
              Digitally signed on Aug 18, 2026 · 15:45 EDT
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lab Facility Certification Footer */}
      <div className="border-border/60 text-muted-foreground flex flex-col gap-2 rounded-lg border border-dashed px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" />
          <span>{patientInfo.facilityAddress}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span>Specimen: {patientInfo.specimen}</span>
          <span>·</span>
          <span>CLIA Certified</span>
        </div>
      </div>
    </div>
  )
}
