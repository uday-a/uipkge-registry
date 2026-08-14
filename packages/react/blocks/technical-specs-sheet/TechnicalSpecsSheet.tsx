'use client'

import * as React from 'react'
import { FileDown, ShieldCheck, CheckCircle2, Search, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface SpecItem {
  id: string
  category: 'acoustic' | 'electrical' | 'physical' | 'connectivity' | 'compliance'
  parameter: string
  metricValue: string
  imperialValue: string
  tolerance?: string
  testCondition?: string
  highlight?: boolean
}

export interface TechnicalSpecsProps {
  productTitle?: string
  modelNumber?: string
  revision?: string
  specs?: SpecItem[]
  className?: string
}

const defaultSpecs: SpecItem[] = [
  // Acoustic
  {
    id: 's1',
    category: 'acoustic',
    parameter: 'Transducer Type',
    metricValue: '50mm Planar-Magnetic with Neodymium N52 Array',
    imperialValue: '1.97 in Planar-Magnetic with Neodymium N52 Array',
    highlight: true,
  },
  {
    id: 's2',
    category: 'acoustic',
    parameter: 'Frequency Response',
    metricValue: '5 Hz – 52,000 Hz',
    imperialValue: '5 Hz – 52,000 Hz',
    tolerance: '± 0.5 dB (20 Hz - 20 kHz)',
    highlight: true,
  },
  {
    id: 's3',
    category: 'acoustic',
    parameter: 'Total Harmonic Distortion (THD)',
    metricValue: '< 0.04% @ 1 kHz, 100 dB SPL',
    imperialValue: '< 0.04% @ 1 kHz, 100 dB SPL',
    testCondition: 'IEC 60268-7 Standard',
  },
  {
    id: 's4',
    category: 'acoustic',
    parameter: 'Sound Pressure Level (SPL)',
    metricValue: '106 dB / 1 mW @ 1 kHz',
    imperialValue: '106 dB / 1 mW @ 1 kHz',
    testCondition: 'Free-field calibrated',
  },
  {
    id: 's5',
    category: 'acoustic',
    parameter: 'Acoustic Enclosure',
    metricValue: 'Open-Back CNC Milled Aircraft-Grade Aluminum Grille',
    imperialValue: 'Open-Back CNC Milled Aircraft-Grade Aluminum Grille',
  },

  // Electrical
  {
    id: 's6',
    category: 'electrical',
    parameter: 'Nominal Impedance',
    metricValue: '32 Ω pure resistive load',
    imperialValue: '32 Ω pure resistive load',
    tolerance: '± 5% @ 1 kHz',
    highlight: true,
  },
  {
    id: 's7',
    category: 'electrical',
    parameter: 'Maximum Input Power Handling',
    metricValue: '3,000 mW (3.0 W Continuous)',
    imperialValue: '3,000 mW (3.0 W Continuous)',
    testCondition: 'Thermal peak 5,000 mW (100ms)',
  },
  {
    id: 's8',
    category: 'electrical',
    parameter: 'Recommended Amplifier Output',
    metricValue: '250 mW – 2,000 mW @ 32 Ω',
    imperialValue: '250 mW – 2,000 mW @ 32 Ω',
  },

  // Physical
  {
    id: 's9',
    category: 'physical',
    parameter: 'Weight (excluding cable)',
    metricValue: '385 grams',
    imperialValue: '13.58 oz (0.85 lbs)',
    tolerance: '± 5g',
    highlight: true,
  },
  {
    id: 's10',
    category: 'physical',
    parameter: 'Ear Cushion Dimensions (Inner ID)',
    metricValue: '68 mm (H) × 52 mm (W) × 26 mm (D)',
    imperialValue: '2.68 in (H) × 2.05 in (W) × 1.02 in (D)',
  },
  {
    id: 's11',
    category: 'physical',
    parameter: 'Headband Clamping Force',
    metricValue: '4.2 Newtons',
    imperialValue: '0.94 lbf (Pound-force)',
    tolerance: '± 0.3 N',
  },
  {
    id: 's12',
    category: 'physical',
    parameter: 'Earpad Material Composition',
    metricValue: 'Perforated Lambskin + Cooling Gel Memory Foam Core',
    imperialValue: 'Perforated Lambskin + Cooling Gel Memory Foam Core',
  },

  // Connectivity
  {
    id: 's13',
    category: 'connectivity',
    parameter: 'Headphone Terminals',
    metricValue: 'Dual 3.5mm Gold-Plated TRRS Balanced Sockets',
    imperialValue: 'Dual 1/8 in Gold-Plated TRRS Balanced Sockets',
  },
  {
    id: 's14',
    category: 'connectivity',
    parameter: 'Included Studio Cable',
    metricValue: '2.5 meter 8-Core Monocrystalline Silver-Plated Copper (OCC)',
    imperialValue: '8.20 feet 8-Core Monocrystalline Silver-Plated Copper (OCC)',
    highlight: true,
  },
  {
    id: 's15',
    category: 'connectivity',
    parameter: 'Source Termination',
    metricValue: '4.4mm Pentaconn Balanced + 6.35mm Gold-Plated Adapter',
    imperialValue: '4.4mm Pentaconn Balanced + 1/4 in Gold-Plated Adapter',
  },

  // Compliance
  {
    id: 's16',
    category: 'compliance',
    parameter: 'Certifications & Directives',
    metricValue: 'Hi-Res Audio Certified, CE Mark, FCC Class B, RoHS 3, WEEE',
    imperialValue: 'Hi-Res Audio Certified, CE Mark, FCC Class B, RoHS 3, WEEE',
    highlight: true,
  },
  {
    id: 's17',
    category: 'compliance',
    parameter: 'Operating Temperature & Humidity',
    metricValue: '-10°C to +45°C (10% to 90% RH non-condensing)',
    imperialValue: '14°F to 113°F (10% to 90% RH non-condensing)',
  },
]

const categories = [
  { id: 'all', label: 'All Specifications' },
  { id: 'acoustic', label: 'Acoustic Architecture' },
  { id: 'electrical', label: 'Electrical & Power' },
  { id: 'physical', label: 'Dimensions & Weight' },
  { id: 'connectivity', label: 'Cables & Interconnects' },
  { id: 'compliance', label: 'Standards & Compliance' },
]

export function TechnicalSpecsSheet({
  productTitle = 'Apex Pro Reference Planar-Magnetic Studio Monitor Headphones',
  modelNumber = 'APX-950-PRO',
  revision = 'Rev 2.4 (2026)',
  specs = defaultSpecs,
  className,
}: TechnicalSpecsProps) {
  const [isMetric, setIsMetric] = React.useState(true)
  const [activeCategory, setActiveCategory] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredSpecs = React.useMemo(() => {
    return specs.filter((item) => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.parameter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.metricValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.imperialValue.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCat && matchesSearch
    })
  }, [specs, activeCategory, searchQuery])

  function downloadPdf() {
    alert(`Downloading official engineering data sheet for ${modelNumber} (${revision})...`)
  }

  return (
    <Card data-slot="technical-specs-sheet" className={`border-border w-full shadow-xs ${className ?? ''}`}>
      <CardHeader className="border-border bg-muted/20 border-b pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                {modelNumber} · {revision}
              </span>
              <Badge variant="outline" className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                Laboratory Certified
              </Badge>
            </div>
            <CardTitle className="text-foreground text-lg font-semibold tracking-tight sm:text-xl">
              Engineering & Technical Specifications Sheet
            </CardTitle>
            <CardDescription className="text-xs">
              Comprehensive acoustic measurements, electrical parameters, material tolerances, and compliance standards.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Metric / Imperial Toggle */}
            <div className="border-border bg-background flex items-center rounded-lg border p-0.5 text-xs shadow-2xs">
              <button
                type="button"
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  isMetric
                    ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setIsMetric(true)}
              >
                Metric (SI)
              </button>
              <button
                type="button"
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  !isMetric
                    ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setIsMetric(false)}
              >
                Imperial (US)
              </button>
            </div>

            <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-2xs" onClick={downloadPdf}>
              <FileDown className="size-3.5" />
              <span>Download Spec PDF</span>
            </Button>
          </div>
        </div>

        {/* Controls: Category Filter Tabs & Search Bar */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-foreground text-background shadow-2xs'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parameters..."
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[280px]">Parameter / Measurement</TableHead>
              <TableHead>Specification ({isMetric ? 'Metric' : 'Imperial'})</TableHead>
              <TableHead className="w-[180px]">Tolerance / Range</TableHead>
              <TableHead className="w-[220px]">Test Standard / Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSpecs.map((spec) => (
              <TableRow key={spec.id} className={spec.highlight ? 'bg-primary/5' : ''}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-xs font-medium">{spec.parameter}</span>
                    {spec.highlight && (
                      <Badge variant="secondary" className="h-4.5 px-1.5 font-mono text-xs font-semibold uppercase">
                        Key Spec
                      </Badge>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-foreground font-mono text-xs font-semibold">
                    {isMetric ? spec.metricValue : spec.imperialValue}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-muted-foreground font-mono text-xs">{spec.tolerance || '—'}</span>
                </TableCell>

                <TableCell>
                  <span className="text-muted-foreground text-xs">{spec.testCondition || 'Factory Standard Q/C'}</span>
                </TableCell>
              </TableRow>
            ))}

            {filteredSpecs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground h-28 text-center text-xs">
                  No matching specifications found for &quot;{searchQuery}&quot;.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Bottom Compliance Certification Footer Badges */}
        <div className="border-border bg-muted/20 flex flex-wrap items-center justify-between gap-3 border-t p-4 text-xs">
          <div className="text-muted-foreground flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="text-primary size-4" />
              <span className="text-foreground font-medium">Calibrated Precision</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>3-Year Studio Warranty Included</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Info className="size-4 text-blue-500" />
              <span>Serial matched drivers (± 0.3 dB stereo tracking)</span>
            </div>
          </div>

          <span className="text-muted-foreground font-mono text-xs">Document ID: SPEC-APX-{modelNumber}-2026</span>
        </div>
      </CardContent>
    </Card>
  )
}
