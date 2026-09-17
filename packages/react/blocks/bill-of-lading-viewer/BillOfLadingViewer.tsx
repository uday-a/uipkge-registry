'use client'

import * as React from 'react'
import { useState } from 'react'
import {
  AlertCircle,
  Anchor,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  Printer,
  ShieldCheck,
  Ship,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface ContainerCargoItem {
  id: string
  containerNo: string
  sealNo: string
  containerType: string
  packagesCount: number
  packagesKind: string
  description: string
  hsCode: string
  grossWeightKg: number
  grossWeightLbs: number
  volumeCbm: number
  hazardClass?: string
  temperature?: string
}

export interface ComplianceGate {
  id: string
  name: string
  status: 'passed' | 'warning' | 'pending'
  authority: string
  reference: string
  details: string
}

export interface BillOfLadingViewerProps {
  className?: string
  documentTitle?: string
  bolNumber?: string
  carrierName?: string
  scacCode?: string
  bookingReference?: string
  exportReference?: string
  issueDate?: string
  placeOfIssue?: string
  shipperName?: string
  shipperAddress?: string
  shipperContact?: string
  shipperEmail?: string
  shipperEori?: string
  consigneeName?: string
  consigneeAddress?: string
  consigneeContact?: string
  consigneeEmail?: string
  consigneeEori?: string
  notifyPartyName?: string
  notifyPartyAddress?: string
  notifyPartyContact?: string
  notifyPartyEmail?: string
  notifyPartyAttention?: string
  preCarriageBy?: string
  placeOfReceipt?: string
  vesselVoyage?: string
  vesselImo?: string
  vesselFlag?: string
  portOfLoading?: string
  portOfDischarge?: string
  placeOfDelivery?: string
  finalDestination?: string
  freightTerms?: string
  freightPayableAt?: string
  declaredValue?: string
  insuranceCert?: string
  incoterms?: string
  letterOfCredit?: string
  blockchainTxHash?: string
  blockchainBlock?: string
  blockchainNetwork?: string
  onDownloadPdf?: () => void
  onVerifyBlockchain?: () => void
  onPrint?: () => void
}

const CARGO_ITEMS: ContainerCargoItem[] = [
  {
    id: 'cargo-1',
    containerNo: 'MSKU-948201-4',
    sealNo: 'SL-94021',
    containerType: "40' High Cube (40' HC)",
    packagesCount: 24,
    packagesKind: 'Pallets / 480 Cartons',
    description: 'Consumer Electronics: Pro Audio Studio Headphones, Dynamic Transducers & Wireless DAC Amplifiers',
    hsCode: '8518.30.00',
    grossWeightKg: 4850.0,
    grossWeightLbs: 10692.42,
    volumeCbm: 32.4,
    hazardClass: 'UN3481 Class 9 (Lithium Ion Batteries contained in equipment)',
    temperature: 'Ambient (Dry Van)',
  },
  {
    id: 'cargo-2',
    containerNo: 'MSKU-819034-2',
    sealNo: 'SL-94022',
    containerType: "40' High Cube (40' HC)",
    packagesCount: 16,
    packagesKind: 'Pallets / 320 Cartons',
    description: 'Audio Accessories: Braided MMCX Oxygen-Free Cables, Velour Replacement Earpads & Hard Travel Cases',
    hsCode: '8518.90.80',
    grossWeightKg: 2320.0,
    grossWeightLbs: 5114.72,
    volumeCbm: 18.6,
    hazardClass: 'Non-Hazardous / Standard Cargo',
    temperature: 'Ambient (Dry Van)',
  },
]

const COMPLIANCE_GATES: ComplianceGate[] = [
  {
    id: 'gate-1',
    name: 'EU EORI & VAT Identity Verification',
    status: 'passed',
    authority: 'European Customs Agency (VIES / EOS)',
    reference: 'NL864219034',
    details: 'Consignee EORI validated against EU Economic Operators Registry with valid Dutch VAT matching.',
  },
  {
    id: 'gate-2',
    name: 'ICS2 Entry Summary Declaration (ENS)',
    status: 'passed',
    authority: 'EU Customs Import Control System 2',
    reference: 'MRN: 26NL948201083921A',
    details: 'Pre-arrival cargo security manifest filed 24 hours prior to loading in Shanghai (Approved).',
  },
  {
    id: 'gate-3',
    name: 'HS Tariff Classification & Duty Schedule',
    status: 'passed',
    authority: 'TARIC European Customs Database',
    reference: 'HS 8518.30.00 / 8518.90.80',
    details: 'Eligible for 0.0% EU base tariff rate + standard 21.0% Netherlands Import VAT under Article 23.',
  },
  {
    id: 'gate-4',
    name: 'ISO 17712 High-Security Container Seals',
    status: 'passed',
    authority: 'International Maritime Organization (IMO)',
    reference: 'SL-94021 / SL-94022',
    details: 'High-security mechanical bolt seals verified intact at origin terminal container gate-in.',
  },
  {
    id: 'gate-5',
    name: 'IMDG Dangerous Goods UN3481 Compliance',
    status: 'passed',
    authority: 'International Maritime Dangerous Goods (IMDG)',
    reference: 'UN3481 PI966 Sec. II',
    details: 'Lithium-ion cells packed with equipment certified under special provision 188 for under-deck stowage.',
  },
  {
    id: 'gate-6',
    name: 'Global Sanctions & Denied Party Screening',
    status: 'passed',
    authority: 'UN, OFAC & EU Consolidated Sanction Lists',
    reference: 'SCR-2026-99104',
    details: '0 matches identified across all parties (Shipper, Consignee, Notify Party, Carrier vessel).',
  },
]

export function BillOfLadingViewer({
  className,
  documentTitle = 'Straight Bill of Lading (Original)',
  bolNumber = '#BOL-2026-894210',
  carrierName = 'Maersk Line A/S',
  scacCode = 'MAEU',
  bookingReference = 'BKG-771920-EU',
  exportReference = 'EXP-2026-0812',
  issueDate = 'August 21, 2026',
  placeOfIssue = 'Shanghai, China',
  shipperName = 'Shenzhen AudioTech Precision Ltd.',
  shipperAddress = 'Building 4, High-Tech Industrial Park, Nanshan District, Shenzhen, Guangdong 518057, China',
  shipperContact = '+86 755 8892 1044',
  shipperEmail = 'export@audiotech-cn.com',
  shipperEori = 'CN-91440300MA5EXP01',
  consigneeName = 'SonicAura Europe B.V.',
  consigneeAddress = 'Keizersgracht 421, 1016 EK Amsterdam, Netherlands',
  consigneeContact = '+31 20 894 3300',
  consigneeEmail = 'import@sonicaura.eu',
  consigneeEori = 'NL864219034 / VAT: NL864219034B01',
  notifyPartyName = 'Rotterdam Intermodal Logistics GmbH',
  notifyPartyAddress = 'Willemskade 18, 3016 DK Rotterdam, Netherlands',
  notifyPartyContact = '+31 10 400 9820',
  notifyPartyEmail = 'clearance@rotterdam-intermodal.com',
  notifyPartyAttention = 'Customs Brokerage Dept. / Desk 4B',
  preCarriageBy = 'Feeder Barge "Yangtze River 12"',
  placeOfReceipt = 'Shenzhen Inland Depot, China (CNSZX)',
  vesselVoyage = 'Ever Given / V.042W',
  vesselImo = 'IMO 9811000',
  vesselFlag = 'Panama (PA)',
  portOfLoading = 'Shanghai Port, China (CNSHA)',
  portOfDischarge = 'Rotterdam Port, Netherlands (NLRTM)',
  placeOfDelivery = 'Duisburg Intermodal Terminal, Germany (DEDUI)',
  finalDestination = 'Duisburg Central DC #4 (DEDUI)',
  freightTerms = 'Prepaid',
  freightPayableAt = 'Shanghai, China',
  declaredValue = '$142,500.00 USD',
  insuranceCert = '#INS-9421-MAR',
  incoterms = 'CIF Rotterdam Port (Incoterms 2020)',
  letterOfCredit = 'LC-BNP-2026-99410-EU (BNP Paribas)',
  blockchainTxHash = '0x71e4d3a8904f84c8a5142d131fba827b5e4c91a2',
  blockchainBlock = '59,182,904',
  blockchainNetwork = 'Polygon Mainnet (Decentralized Cargo Registry)',
  onDownloadPdf,
  onVerifyBlockchain,
  onPrint,
}: BillOfLadingViewerProps) {
  const [activeTab, setActiveTab] = useState<'document' | 'compliance' | 'edi'>('document')
  const [copiedBol, setCopiedBol] = useState(false)
  const [copiedEdi, setCopiedEdi] = useState(false)
  const [showVerifyDetails, setShowVerifyDetails] = useState(false)

  const totalPackagesCount = CARGO_ITEMS.reduce((acc, item) => acc + item.packagesCount, 0)
  const totalGrossWeightKg = CARGO_ITEMS.reduce((acc, item) => acc + item.grossWeightKg, 0)
  const totalGrossWeightLbs = CARGO_ITEMS.reduce((acc, item) => acc + item.grossWeightLbs, 0)
  const totalVolumeCbm = CARGO_ITEMS.reduce((acc, item) => acc + item.volumeCbm, 0)

  const generateEdiText = () => {
    return `UNB+UNOA:2+${scacCode}:ZZ+SONICAURA:ZZ+260821:1400+0000001'
UNH+1+IFTMIN:D:01B:UN:EAN004'
BGM+705+${bolNumber.replace('#', '')}+9'
DTM+137:20260821:102'
NAD+CZ+${shipperEori}::9++${shipperName}+${shipperAddress}+SHENZHEN++518057+CN'
NAD+CN+NL864219034::9++${consigneeName}+${consigneeAddress}+AMSTERDAM++1016EK+NL'
NAD+NI+++${notifyPartyName}+${notifyPartyAddress}+ROTTERDAM++3016DK+NL'
TDT+20+V.042W+1+13+MAEU:172:20+++${vesselImo}::11:${vesselVoyage}'
LOC+9+CNSHA:139:6+SHANGHAI PORT'
LOC+11+NLRTM:139:6+ROTTERDAM PORT'
LOC+7+DEDUI:139:6+DUISBURG TERMINAL'
EQD+CN+MSKU9482014+45G1:102:5++2+5'
SEL+SL94021+SH'
GID+1+24:BX+PRO AUDIO HEADPHONES:85183000'
MEA+WT+G+KGM:4850.00'
MEA+VOL+AAW+MTQ:32.40'
MOA+39:142500:USD'
UNT+18+1'
UNZ+1+0000001'`
  }

  const handleCopyBol = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(bolNumber)
      setCopiedBol(true)
      setTimeout(() => setCopiedBol(false), 2000)
    }
  }

  const handleCopyEdi = () => {
    const ediContent = generateEdiText()
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(ediContent)
      setCopiedEdi(true)
      setTimeout(() => setCopiedEdi(false), 2000)
    }
  }

  const handlePrint = () => {
    onPrint?.()
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const handleDownloadPdf = () => {
    onDownloadPdf?.()
    handlePrint()
  }

  const toggleBlockchainDetails = () => {
    setShowVerifyDetails((prev) => !prev)
    onVerifyBlockchain?.()
  }

  return (
    <div data-slot="bill-of-lading-viewer" className={cn('text-foreground w-full space-y-6', className)}>
      {/* Top Action Bar / Document Control Header */}
      <div className="border-border bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge wrap variant="outline" className="font-mono text-xs tracking-wider uppercase">
              {scacCode} &bull; Maritime Ocean BOL
            </Badge>
            <button
              type="button"
              className="group focus-visible:ring-ring inline-flex min-h-6 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-500/20 focus-visible:ring-2 focus-visible:outline-none dark:text-emerald-400"
              onClick={toggleBlockchainDetails}
            >
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              <span>Verify Blockchain Authenticity</span>
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{documentTitle}</h1>
            <span className="text-muted-foreground font-mono text-base font-semibold tabular-nums">{bolNumber}</span>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground size-7"
              title="Copy BOL number"
              onClick={handleCopyBol}
            >
              {copiedBol ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              <span className="sr-only">Copy BOL number</span>
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            Carrier: <strong className="text-foreground font-medium">{carrierName}</strong> &bull; Issued: {issueDate}{' '}
            in {placeOfIssue}
          </p>
        </div>

        {/* Action Buttons & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 sm:self-center">
          <div className="border-border bg-muted/40 flex items-center rounded-lg border p-1">
            <button
              type="button"
              className={cn(
                'focus-visible:ring-ring rounded-md px-3 py-1.5 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                activeTab === 'document'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setActiveTab('document')}
            >
              Document View
            </button>
            <button
              type="button"
              className={cn(
                'focus-visible:ring-ring flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                activeTab === 'compliance'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setActiveTab('compliance')}
            >
              <span>Customs &amp; Compliance</span>
              <Badge
                wrap
                variant="success"
                className="size-4 justify-center p-0 text-center font-mono text-xs leading-4"
              >
                6
              </Badge>
            </button>
            <button
              type="button"
              className={cn(
                'focus-visible:ring-ring rounded-md px-3 py-1.5 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:outline-none',
                activeTab === 'edi'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setActiveTab('edi')}
            >
              Raw EDI / JSON
            </button>
          </div>

          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handlePrint}>
            <Printer className="size-3.5" aria-hidden="true" />
            <span>Print</span>
          </Button>

          <Button aria-label="Download attachment" size="sm" className="gap-1.5 text-xs" onClick={handleDownloadPdf}>
            <Download className="size-3.5" aria-hidden="true" />
            <span>Download Printable BOL</span>
          </Button>
        </div>
      </div>

      {/* Blockchain Cryptographic Proof Drawer / Card */}
      {showVerifyDetails && (
        <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs transition-all">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-5 shrink-0" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-semibold">
                    Cryptographic Bill of Lading Authenticity Verified
                  </span>
                  <Badge wrap variant="success" className="text-xs">
                    Immutable Ledger Record
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Document state verified on {blockchainNetwork}. Digital hash matches original carrier signature at
                  origin.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="bg-background/80 border-border text-foreground rounded border px-2 py-1">
                Block #{blockchainBlock}
              </span>
              <span
                className="bg-background/80 border-border text-foreground max-w-xs truncate rounded border px-2 py-1"
                title={blockchainTxHash}
              >
                Tx: {blockchainTxHash}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: OFFICIAL BILL OF LADING PAPER DOCUMENT */}
      {activeTab === 'document' && (
        <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs print:border-none print:shadow-none">
          {/* Formal Document Header */}
          <div className="border-border bg-muted/20 border-b p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              {/* Carrier Branding & Document Classification */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-lg shadow-xs">
                    <Anchor className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{carrierName}</h2>
                    <p className="text-muted-foreground font-mono text-xs">
                      SCAC: {scacCode} &bull; Standard Ocean Carrier Bill of Lading
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground max-w-xl text-xs leading-relaxed">
                  Issued in accordance with the International Convention for the Unification of Certain Rules of Law
                  relating to Bills of Lading (Hague-Visby Rules) and UN Multimodal Transport Guidelines.
                </p>
              </div>

              {/* Document References & Status Stamp */}
              <div className="border-border bg-background/80 flex flex-col gap-2 rounded-lg border p-4 sm:min-w-[280px]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground text-xs font-medium">Bill of Lading No.</span>
                  <span className="text-primary font-mono text-sm font-semibold tabular-nums">{bolNumber}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground text-xs">Booking Reference:</span>
                  <span className="font-mono text-xs font-semibold tabular-nums">{bookingReference}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground text-xs">Export Reference:</span>
                  <span className="font-mono text-xs tabular-nums">{exportReference}</span>
                </div>
                <Separator className="my-1" />
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground text-xs">Document Status:</span>
                  <Badge wrap variant="default" className="text-xs font-medium">
                    Negotiable / Original
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Parties Grid (Shipper, Consignee, Notify Party) */}
          <div className="divide-border border-border grid grid-cols-1 divide-y border-b md:grid-cols-3 md:divide-x md:divide-y-0">
            {/* Shipper / Exporter */}
            <div className="bg-card space-y-3 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-primary font-mono text-xs font-semibold">1. Shipper / Exporter</span>
                <Building2 className="text-muted-foreground size-4" aria-hidden="true" />
              </div>
              <div className="space-y-1.5 text-xs">
                <p className="text-foreground text-sm font-semibold">{shipperName}</p>
                <p className="text-muted-foreground leading-relaxed">{shipperAddress}</p>
                <div className="text-muted-foreground space-y-1 pt-2">
                  <p className="flex items-center gap-1.5">
                    <Phone className="text-muted-foreground size-3 shrink-0" />
                    <span className="tabular-nums">{shipperContact}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="text-muted-foreground size-3 shrink-0" />
                    <span>{shipperEmail}</span>
                  </p>
                  <p className="text-foreground pt-1 font-mono">
                    <span className="text-muted-foreground">EORI / Tax ID:</span> {shipperEori}
                  </p>
                </div>
              </div>
            </div>

            {/* Consignee / Importer */}
            <div className="bg-card space-y-3 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-primary font-mono text-xs font-semibold">2. Consignee / Importer</span>
                <MapPin className="text-muted-foreground size-4" aria-hidden="true" />
              </div>
              <div className="space-y-1.5 text-xs">
                <p className="text-foreground text-sm font-semibold">{consigneeName}</p>
                <p className="text-muted-foreground leading-relaxed">{consigneeAddress}</p>
                <div className="text-muted-foreground space-y-1 pt-2">
                  <p className="flex items-center gap-1.5">
                    <Phone className="text-muted-foreground size-3 shrink-0" />
                    <span className="tabular-nums">{consigneeContact}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="text-muted-foreground size-3 shrink-0" />
                    <span>{consigneeEmail}</span>
                  </p>
                  <p className="text-foreground pt-1 font-mono">
                    <span className="text-muted-foreground">EORI / VAT:</span> {consigneeEori}
                  </p>
                </div>
              </div>
            </div>

            {/* Notify Party */}
            <div className="bg-card space-y-3 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-primary font-mono text-xs font-semibold">3. Notify Party</span>
                <FileText className="text-muted-foreground size-4" aria-hidden="true" />
              </div>
              <div className="space-y-1.5 text-xs">
                <p className="text-foreground text-sm font-semibold">{notifyPartyName}</p>
                <p className="text-muted-foreground leading-relaxed">{notifyPartyAddress}</p>
                <div className="text-muted-foreground space-y-1 pt-2">
                  <p className="flex items-center gap-1.5">
                    <Phone className="text-muted-foreground size-3 shrink-0" />
                    <span className="tabular-nums">{notifyPartyContact}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="text-muted-foreground size-3 shrink-0" />
                    <span>{notifyPartyEmail}</span>
                  </p>
                  <p className="text-foreground pt-1 font-medium">
                    <span className="text-muted-foreground">Attention:</span> {notifyPartyAttention}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Transport & Routing Details Grid */}
          <div className="border-border bg-muted/10 border-b p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="border-border bg-card space-y-1 rounded-lg border p-3 shadow-xs">
                <span className="text-muted-foreground text-xs font-medium">Pre-Carriage By</span>
                <p className="text-foreground text-xs font-semibold">{preCarriageBy}</p>
                <span className="text-muted-foreground text-xs">Receipt: {placeOfReceipt}</span>
              </div>

              <div className="border-border bg-card space-y-1 rounded-lg border p-3 shadow-xs">
                <span className="text-muted-foreground text-xs font-medium">Ocean Vessel &amp; Voyage</span>
                <p className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                  <Ship className="text-primary size-3.5 shrink-0" />
                  <span>{vesselVoyage}</span>
                </p>
                <span className="text-muted-foreground font-mono text-xs">
                  {vesselImo} &bull; {vesselFlag}
                </span>
              </div>

              <div className="border-border bg-card space-y-1 rounded-lg border p-3 shadow-xs">
                <span className="text-muted-foreground text-xs font-medium">Port of Loading (POL)</span>
                <p className="text-foreground text-xs font-semibold">{portOfLoading}</p>
                <span className="text-muted-foreground text-xs">Departure: Aug 23, 2026</span>
              </div>

              <div className="border-border bg-card space-y-1 rounded-lg border p-3 shadow-xs">
                <span className="text-muted-foreground text-xs font-medium">Port of Discharge (POD)</span>
                <p className="text-foreground text-xs font-semibold">{portOfDischarge}</p>
                <span className="text-muted-foreground text-xs">Delivery: {placeOfDelivery}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Container & Cargo Manifest Table */}
          <div className="space-y-4 p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-foreground text-sm font-semibold">Container &amp; Cargo Description</h3>
                <p className="text-muted-foreground text-xs">
                  Itemized manifest of goods, seal identification, Harmonized Tariff codes, and gross weight
                </p>
              </div>
              <Badge wrap variant="outline" className="w-fit font-mono text-xs">
                FCL / FCL &bull; CY-CY Movement
              </Badge>
            </div>

            <div className="border-border overflow-hidden rounded-lg border">
              <div className="overflow-x-auto">
                <Table density="cozy">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Container No. &amp; Seal No.</TableHead>
                      <TableHead className="text-xs">Packages &amp; Kind</TableHead>
                      <TableHead className="text-xs">Description of Goods</TableHead>
                      <TableHead className="text-xs">HS Tariff Code</TableHead>
                      <TableHead className="text-right text-xs">Gross Wt (kg)</TableHead>
                      <TableHead className="text-right text-xs">Volume (CBM)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CARGO_ITEMS.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="align-top">
                          <div className="text-foreground font-mono text-xs font-semibold">{item.containerNo}</div>
                          <div className="text-muted-foreground font-mono text-xs">Seal: {item.sealNo}</div>
                          <Badge wrap variant="secondary" className="mt-1 text-xs font-normal">
                            {item.containerType}
                          </Badge>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="text-foreground text-xs font-medium tabular-nums">
                            {item.packagesCount} Pallets
                          </div>
                          <div className="text-muted-foreground text-xs">{item.packagesKind}</div>
                        </TableCell>
                        <TableCell className="max-w-md align-top">
                          <div className="text-foreground text-xs leading-relaxed font-medium">{item.description}</div>
                          {item.hazardClass && (
                            <div className="mt-1 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                              <AlertCircle className="size-3 shrink-0" />
                              <span>{item.hazardClass}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-foreground align-top font-mono text-xs tabular-nums">
                          {item.hsCode}
                        </TableCell>
                        <TableCell className="text-foreground text-right align-top font-mono text-xs font-semibold tabular-nums">
                          {item.grossWeightKg.toLocaleString('en-US', { minimumFractionDigits: 2 })} kg
                          <div className="text-muted-foreground font-normal">
                            {item.grossWeightLbs.toLocaleString('en-US', { minimumFractionDigits: 1 })} lbs
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground text-right align-top font-mono text-xs tabular-nums">
                          {item.volumeCbm.toFixed(2)} m³
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2} className="text-xs font-semibold">
                        Totals: {CARGO_ITEMS.length} Containers &bull; {totalPackagesCount} Pallets
                      </TableCell>
                      <TableCell colSpan={2} className="text-muted-foreground text-xs">
                        Dangerous Goods Stowage Declared &bull; Certified Dry Van
                      </TableCell>
                      <TableCell className="text-foreground text-right font-mono text-xs font-semibold tabular-nums">
                        {totalGrossWeightKg.toLocaleString('en-US', { minimumFractionDigits: 2 })} kg
                      </TableCell>
                      <TableCell className="text-foreground text-right font-mono text-xs font-semibold tabular-nums">
                        {totalVolumeCbm.toFixed(2)} m³
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
          </div>

          {/* Section 4: Freight Charges & Commercial Terms */}
          <div className="divide-border border-border grid grid-cols-1 divide-y border-t sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            <div className="bg-muted/10 space-y-1.5 p-5">
              <span className="text-muted-foreground text-xs font-medium">Freight &amp; Charges</span>
              <div className="flex items-center gap-2">
                <Badge wrap variant="default" className="text-xs font-medium tracking-wide uppercase">
                  {freightTerms}
                </Badge>
              </div>
              <p className="text-muted-foreground pt-1 text-xs">
                Payable at: <strong className="text-foreground">{freightPayableAt}</strong>
              </p>
            </div>

            <div className="bg-muted/10 space-y-1.5 p-5">
              <span className="text-muted-foreground text-xs font-medium">Declared Value (Customs)</span>
              <p className="text-foreground font-mono text-sm font-semibold tabular-nums">{declaredValue}</p>
              <p className="text-muted-foreground text-xs">Commercial Invoice #INV-2026-8942</p>
            </div>

            <div className="bg-muted/10 space-y-1.5 p-5">
              <span className="text-muted-foreground text-xs font-medium">Marine Cargo Insurance</span>
              <p className="text-foreground font-mono text-xs font-semibold">{insuranceCert}</p>
              <p className="text-muted-foreground text-xs">Institute Cargo Clauses (A) All Risks</p>
            </div>

            <div className="bg-muted/10 space-y-1.5 p-5">
              <span className="text-muted-foreground text-xs font-medium">Incoterms &amp; Letter of Credit</span>
              <p className="text-foreground text-xs font-semibold">{incoterms}</p>
              <p className="text-muted-foreground truncate font-mono text-xs" title={letterOfCredit}>
                {letterOfCredit}
              </p>
            </div>
          </div>

          {/* Section 5: Carrier Signature & Authorization Stamp */}
          <div className="border-border bg-card border-t p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center">
              {/* Left: Carrier Certification Notice */}
              <div className="space-y-2 md:col-span-6">
                <span className="text-primary text-xs font-semibold">Carrier Authorization &amp; Endorsement</span>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  IN WITNESS whereof the carrier, through its authorized master or port agent, has signed three (3)
                  original Bills of Lading, one of which being accomplished, the others to stand void.
                </p>
                <div className="text-muted-foreground flex flex-col gap-1 pt-2 font-mono text-xs">
                  <p>
                    <span className="text-foreground font-semibold">Authorized Agent:</span> Capt. H. van der Meer
                    (Master / Port Agent)
                  </p>
                  <p>
                    <span className="text-foreground font-semibold">Digital Signature SHA-256:</span>{' '}
                    9b2d8fe14157a3e8...c72194b0
                  </p>
                  <p>
                    <span className="text-foreground font-semibold">Issued:</span> {issueDate} at Port of Shanghai,
                    China
                  </p>
                </div>
              </div>

              {/* Center: Official Maritime Carrier Stamp */}
              <div className="flex justify-center md:col-span-3">
                <div className="border-primary/40 bg-primary/5 text-primary rotate-[-2deg] rounded-lg border-2 border-dashed p-4 text-center font-mono text-xs tracking-widest uppercase shadow-xs">
                  <div className="mb-1 flex justify-center">
                    <Ship className="text-primary size-6" />
                  </div>
                  <div className="text-sm font-semibold tracking-tight">MAERSK LINE A/S</div>
                  <div className="text-muted-foreground text-xs font-semibold">PORT OF SHANGHAI AGENCY</div>
                  <div className="border-primary/30 mt-1 border-t pt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    OFFICIALLY ENDORSED
                  </div>
                </div>
              </div>

              {/* Right: Interactive QR Code Verification */}
              <div className="border-border bg-muted/20 flex flex-col items-center justify-center rounded-lg border p-4 text-center md:col-span-3">
                <svg
                  viewBox="0 0 100 100"
                  className="text-foreground size-20 shrink-0"
                  fill="currentColor"
                  aria-label="QR Code"
                >
                  {/* Top-left finder pattern */}
                  <rect x="2" y="2" width="28" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="10" y="10" width="12" height="12" rx="1.5" />
                  {/* Top-right finder pattern */}
                  <rect x="70" y="2" width="28" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="78" y="10" width="12" height="12" rx="1.5" />
                  {/* Bottom-left finder pattern */}
                  <rect x="2" y="70" width="28" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="10" y="78" width="12" height="12" rx="1.5" />
                  {/* QR data matrix dots */}
                  <rect x="36" y="6" width="6" height="6" rx="1" />
                  <rect x="48" y="6" width="6" height="6" rx="1" />
                  <rect x="58" y="6" width="6" height="6" rx="1" />
                  <rect x="6" y="36" width="6" height="6" rx="1" />
                  <rect x="18" y="36" width="6" height="6" rx="1" />
                  <rect x="36" y="36" width="6" height="6" rx="1" />
                  <rect x="48" y="36" width="6" height="6" rx="1" />
                  <rect x="58" y="36" width="6" height="6" rx="1" />
                  <rect x="74" y="36" width="6" height="6" rx="1" />
                  <rect x="86" y="36" width="6" height="6" rx="1" />
                  <rect x="36" y="48" width="6" height="6" rx="1" />
                  <rect x="48" y="48" width="6" height="6" rx="1" />
                  <rect x="58" y="48" width="6" height="6" rx="1" />
                  <rect x="36" y="60" width="6" height="6" rx="1" />
                  <rect x="48" y="60" width="6" height="6" rx="1" />
                  <rect x="58" y="60" width="6" height="6" rx="1" />
                  <rect x="36" y="76" width="6" height="6" rx="1" />
                  <rect x="48" y="76" width="6" height="6" rx="1" />
                  <rect x="58" y="76" width="6" height="6" rx="1" />
                  <rect x="74" y="76" width="6" height="6" rx="1" />
                  <rect x="86" y="76" width="6" height="6" rx="1" />
                  <rect x="74" y="86" width="6" height="6" rx="1" />
                  <rect x="86" y="86" width="6" height="6" rx="1" />
                </svg>
                <span className="text-foreground mt-2 font-mono text-xs font-medium">
                  Scan for Port Customs e-Verification
                </span>
                <span className="text-muted-foreground text-xs">UIPKGE Trust Protocol</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMS & COMPLIANCE INSPECTOR */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          {/* Compliance Health Score Banner */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="border-border bg-card">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs">Customs Risk Assessment</CardDescription>
                <div className="flex items-baseline gap-2">
                  <CardTitle className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">99 / 100</CardTitle>
                  <Badge wrap variant="success" className="text-xs">
                    Low Risk
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground p-4 pt-1 text-xs">
                Green channel clearance granted for Rotterdam entry. Pre-arrival ICS2 security declaration verified.
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs">Import Duties &amp; VAT Estimation</CardDescription>
                <div className="flex items-baseline gap-2">
                  <CardTitle className="text-foreground font-mono text-2xl font-bold">$29,925.00</CardTitle>
                  <Badge wrap variant="outline" className="font-mono text-xs">
                    EUR 27,665
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground p-4 pt-1 text-xs">
                0% Base Duty (TARIC 8518.30.00) + 21.0% Netherlands Import VAT under Article 23 reverse-charge
                mechanism.
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs">Container Seal Audit</CardDescription>
                <div className="flex items-baseline gap-2">
                  <CardTitle className="text-foreground text-2xl font-bold">2 / 2 Valid</CardTitle>
                  <Badge wrap variant="success" className="text-xs">
                    ISO 17712 Compliant
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground p-4 pt-1 text-xs">
                Bolt seals SL-94021 &amp; SL-94022 confirmed tamper-free at origin gate inspection.
              </CardContent>
            </Card>
          </div>

          {/* Compliance Verification Checklist Grid */}
          <Card className="border-border bg-card">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Customs Compliance &amp; Regulatory Audit Checklist
                  </CardTitle>
                  <CardDescription className="text-xs">
                    International trade compliance checks required for European Union port entry and inland transit
                  </CardDescription>
                </div>
                <Badge wrap variant="success" className="gap-1 text-xs">
                  <CheckCircle2 className="size-3.5" />
                  <span>All 6 Gates Passed</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-5 pt-0">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {COMPLIANCE_GATES.map((gate) => (
                  <div
                    key={gate.id}
                    className="border-border bg-muted/20 flex items-start gap-3 rounded-lg border p-3.5 shadow-xs"
                  >
                    <div className="mt-0.5 shrink-0 rounded-full bg-emerald-500/10 p-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-4" aria-hidden="true" />
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-foreground font-semibold">{gate.name}</span>
                        <span className="text-muted-foreground font-mono text-xs font-medium">{gate.reference}</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{gate.details}</p>
                      <span className="text-primary block text-xs font-medium">Authority: {gate.authority}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: ELECTRONIC DATA INTERCHANGE (EDI) / JSON MANIFEST */}
      {activeTab === 'edi' && (
        <div className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader className="p-5 pb-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Electronic Data Interchange (UN/EDIFACT IFTMIN)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Standardized electronic consignment instructions formatted per UN/EDIFACT D.01B maritime transport
                    standards
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 self-start text-xs sm:self-auto"
                  onClick={handleCopyEdi}
                >
                  {copiedEdi ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                  <span>{copiedEdi ? 'Copied EDI Payload' : 'Copy EDI Payload'}</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <pre className="border-border bg-muted/40 text-foreground overflow-x-auto rounded-lg border p-4 font-mono text-xs leading-relaxed select-all">
                {generateEdiText()}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
