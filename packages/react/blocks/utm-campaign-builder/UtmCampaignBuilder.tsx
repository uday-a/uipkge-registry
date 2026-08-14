'use client'

import * as React from 'react'
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Globe,
  Link2,
  QrCode,
  RotateCcw,
  Sparkles,
  Tag,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface UtmPreset {
  id: string
  name: string
  description: string
  baseUrl: string
  source: string
  medium: string
  campaign: string
  term?: string
  content?: string
  shortlinkSlug: string
}

export interface UtmCampaignData {
  baseUrl: string
  source: string
  medium: string
  campaign: string
  term: string
  content: string
  fullUrl: string
  shortlinkUrl: string
}

export interface UtmCampaignBuilderProps {
  className?: string
  initialPreset?: string
  initialBaseUrl?: string
  initialSource?: string
  initialMedium?: string
  initialCampaign?: string
  initialTerm?: string
  initialContent?: string
  initialShortlinkDomain?: string
  initialShortlinkSlug?: string
  onCopyUrl?: (url: string) => void
  onCopyShortlink?: (shortlink: string) => void
  onDownloadQr?: (payload: { url: string; filename: string }) => void
  onChange?: (data: UtmCampaignData) => void
}

export const CAMPAIGN_PRESETS: UtmPreset[] = [
  {
    id: 'product_launch',
    name: 'Product Launch',
    description: 'SaaS feature launch across social platforms',
    baseUrl: 'https://uipkge.dev/pricing',
    source: 'twitter',
    medium: 'social',
    campaign: 'launch_2026_q3',
    term: 'ui_components',
    content: 'banner_hero_cta',
    shortlinkSlug: 'q3-launch',
  },
  {
    id: 'weekly_newsletter',
    name: 'Weekly Newsletter',
    description: 'Substack / Mailchimp subscriber digest campaign',
    baseUrl: 'https://uipkge.dev/blog',
    source: 'newsletter',
    medium: 'email',
    campaign: 'weekly_digest_issue_48',
    term: 'developer_tools',
    content: 'featured_article_button',
    shortlinkSlug: 'digest-48',
  },
  {
    id: 'google_search_ads',
    name: 'Google Search Ads',
    description: 'Targeted Google Search CPC keyword campaign',
    baseUrl: 'https://uipkge.dev',
    source: 'google',
    medium: 'cpc',
    campaign: 'search_brand_core_us',
    term: 'vue_react_components',
    content: 'headline_v2_price_test',
    shortlinkSlug: 'google-ads',
  },
  {
    id: 'twitter_promo',
    name: 'Twitter / X Promo',
    description: 'Promotional & organic posts on X/Twitter',
    baseUrl: 'https://uipkge.dev/components',
    source: 'twitter',
    medium: 'social',
    campaign: 'flash_discount_august',
    term: 'lifetime_deal',
    content: 'video_card_preview',
    shortlinkSlug: 'x-promo',
  },
]

const SOURCE_CHIPS = [
  { label: 'twitter', display: 'Twitter / X' },
  { label: 'google', display: 'Google' },
  { label: 'newsletter', display: 'Newsletter' },
  { label: 'linkedin', display: 'LinkedIn' },
  { label: 'facebook', display: 'Meta / FB' },
  { label: 'youtube', display: 'YouTube' },
]

const MEDIUM_CHIPS = [
  { label: 'social', display: 'social' },
  { label: 'cpc', display: 'cpc' },
  { label: 'email', display: 'email' },
  { label: 'referral', display: 'referral' },
  { label: 'organic_social', display: 'organic_social' },
  { label: 'display', display: 'display' },
]

interface QueryParamItem {
  key: string
  value: string
  label: string
  required: boolean
}

// Standalone Pure QR Matrix Generator (Byte mode, standard GF(256) Reed-Solomon)
function generateQrMatrix(text: string): { matrix: boolean[][]; size: number } {
  const bytes: number[] = []
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    if (code < 0x80) bytes.push(code)
    else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f))
    } else {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f))
    }
  }

  const versions = [
    { version: 1, size: 21, dataCap: 16, ecWords: 10, blocks: 1, alignPos: [] as number[] },
    { version: 2, size: 25, dataCap: 28, ecWords: 16, blocks: 1, alignPos: [6, 18] },
    { version: 3, size: 29, dataCap: 44, ecWords: 26, blocks: 1, alignPos: [6, 22] },
    { version: 4, size: 33, dataCap: 64, ecWords: 18, blocks: 2, alignPos: [6, 26] },
    { version: 5, size: 37, dataCap: 86, ecWords: 24, blocks: 2, alignPos: [6, 30] },
    { version: 6, size: 41, dataCap: 108, ecWords: 16, blocks: 4, alignPos: [6, 34] },
    { version: 7, size: 45, dataCap: 124, ecWords: 18, blocks: 4, alignPos: [6, 22, 38] },
    { version: 8, size: 49, dataCap: 154, ecWords: 22, blocks: 4, alignPos: [6, 24, 42] },
    { version: 9, size: 53, dataCap: 182, ecWords: 22, blocks: 5, alignPos: [6, 26, 46] },
    { version: 10, size: 57, dataCap: 216, ecWords: 26, blocks: 5, alignPos: [6, 28, 50] },
  ]

  let v = versions.find((spec) => bytes.length <= spec.dataCap - 3)
  if (!v) v = versions[versions.length - 1]

  const size = v.size
  const matrix: (boolean | null)[][] = Array.from({ length: size }, () => Array(size).fill(null))
  const isFunction: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false))

  function placeFinder(r: number, c: number) {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const nr = r + dr
        const nc = c + dc
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          isFunction[nr][nc] = true
          if (dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6) {
            const isBorder = dr === 0 || dr === 6 || dc === 0 || dc === 6
            const isCenter = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4
            matrix[nr][nc] = isBorder || isCenter
          } else {
            matrix[nr][nc] = false
          }
        }
      }
    }
  }

  placeFinder(0, 0)
  placeFinder(0, size - 7)
  placeFinder(size - 7, 0)

  for (const ar of v.alignPos) {
    for (const ac of v.alignPos) {
      if ((ar === 6 && ac === 6) || (ar === 6 && ac === size - 7) || (ar === size - 7 && ac === 6)) {
        continue
      }
      if (isFunction[ar][ac]) continue

      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const nr = ar + dr
          const nc = ac + dc
          isFunction[nr][nc] = true
          const isBorder = Math.abs(dr) === 2 || Math.abs(dc) === 2
          const isCenter = dr === 0 && dc === 0
          matrix[nr][nc] = isBorder || isCenter
        }
      }
    }
  }

  for (let i = 0; i < size; i++) {
    if (!isFunction[6][i]) {
      isFunction[6][i] = true
      matrix[6][i] = i % 2 === 0
    }
    if (!isFunction[i][6]) {
      isFunction[i][6] = true
      matrix[i][6] = i % 2 === 0
    }
  }

  isFunction[4 * v.version + 9][8] = true
  matrix[4 * v.version + 9][8] = true

  for (let i = 0; i < 9; i++) {
    if (i !== 6) {
      isFunction[8][i] = true
      isFunction[i][8] = true
    }
  }
  for (let i = 0; i < 8; i++) {
    isFunction[8][size - 1 - i] = true
    isFunction[size - 1 - i][8] = true
  }

  const bitStream: number[] = []
  function pushBits(val: number, len: number) {
    for (let i = len - 1; i >= 0; i--) {
      bitStream.push((val >> i) & 1)
    }
  }

  pushBits(0b0100, 4)
  pushBits(bytes.length, 8)
  for (const b of bytes) {
    pushBits(b, 8)
  }

  const totalDataBits = v.dataCap * 8
  const termLen = Math.min(4, totalDataBits - bitStream.length)
  pushBits(0, termLen)

  while (bitStream.length % 8 !== 0) {
    bitStream.push(0)
  }

  const padBytes = [0xec, 0x11]
  let padIdx = 0
  while (bitStream.length < totalDataBits) {
    pushBits(padBytes[padIdx % 2], 8)
    padIdx++
  }

  const dataWords: number[] = []
  for (let i = 0; i < bitStream.length; i += 8) {
    let word = 0
    for (let j = 0; j < 8; j++) {
      word = (word << 1) | bitStream[i + j]
    }
    dataWords.push(word)
  }

  const EXP: number[] = new Array(512)
  const LOG: number[] = new Array(256)
  let cur = 1
  for (let i = 0; i < 255; i++) {
    EXP[i] = cur
    EXP[i + 255] = cur
    LOG[cur] = i
    cur = (cur << 1) ^ (cur >= 128 ? 0x11d : 0)
  }
  function gfMul(a: number, b: number): number {
    if (a === 0 || b === 0) return 0
    return EXP[LOG[a] + LOG[b]]
  }

  function getGeneratorPoly(numEc: number): number[] {
    let poly = [1]
    for (let i = 0; i < numEc; i++) {
      const next = new Array(poly.length + 1).fill(0)
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= gfMul(poly[j], EXP[i])
        next[j + 1] ^= poly[j]
      }
      poly = next
    }
    return poly
  }

  const ecWordsPerBlock = v.ecWords
  const numBlocks = v.blocks
  const blockSize = Math.floor(dataWords.length / numBlocks)
  const rawBlocks: number[][] = []
  const ecBlocks: number[][] = []
  const genPoly = getGeneratorPoly(ecWordsPerBlock)

  for (let b = 0; b < numBlocks; b++) {
    const blockData = dataWords.slice(b * blockSize, (b + 1) * blockSize)
    rawBlocks.push(blockData)

    const rem = new Array(blockData.length + ecWordsPerBlock).fill(0)
    for (let i = 0; i < blockData.length; i++) rem[i] = blockData[i]
    for (let i = 0; i < blockData.length; i++) {
      const factor = rem[i]
      if (factor !== 0) {
        for (let j = 0; j < genPoly.length; j++) {
          rem[i + j] ^= gfMul(genPoly[j], factor)
        }
      }
    }
    ecBlocks.push(rem.slice(blockData.length))
  }

  const finalBits: number[] = []
  for (let i = 0; i < blockSize; i++) {
    for (let b = 0; b < numBlocks; b++) {
      const val = rawBlocks[b][i] ?? 0
      for (let bit = 7; bit >= 0; bit--) {
        finalBits.push((val >> bit) & 1)
      }
    }
  }
  for (let i = 0; i < ecWordsPerBlock; i++) {
    for (let b = 0; b < numBlocks; b++) {
      const val = ecBlocks[b][i] ?? 0
      for (let bit = 7; bit >= 0; bit--) {
        finalBits.push((val >> bit) & 1)
      }
    }
  }

  let bitPointer = 0
  let right = size - 1
  let upward = true

  while (right > 0) {
    if (right === 6) right--
    const colList = [right, right - 1]
    const rowList = upward
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i)

    for (const r of rowList) {
      for (const c of colList) {
        if (!isFunction[r][c]) {
          let bit = 0
          if (bitPointer < finalBits.length) {
            bit = finalBits[bitPointer++]
          }
          const mask = (r + c) % 2 === 0
          matrix[r][c] = (bit === 1) !== mask
        }
      }
    }
    right -= 2
    upward = !upward
  }

  const formatInfo = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0]
  const tlCoords: [number, number][] = [
    [8, 0],
    [8, 1],
    [8, 2],
    [8, 3],
    [8, 4],
    [8, 5],
    [8, 7],
    [8, 8],
    [7, 8],
    [5, 8],
    [4, 8],
    [3, 8],
    [2, 8],
    [1, 8],
    [0, 8],
  ]
  for (let i = 0; i < 15; i++) {
    const [r, c] = tlCoords[i]
    matrix[r][c] = formatInfo[i] === 1
  }

  for (let i = 0; i < 8; i++) {
    matrix[8][size - 1 - i] = formatInfo[i] === 1
  }
  for (let i = 8; i < 15; i++) {
    matrix[size - (15 - i)][8] = formatInfo[i] === 1
  }

  const cleanMatrix: boolean[][] = matrix.map((row) => row.map((cell) => cell === true))
  return { matrix: cleanMatrix, size }
}

function qrToSvgPath(matrix: boolean[][]): string {
  let path = ''
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c]) {
        path += `M${c},${r}h1v1h-1z `
      }
    }
  }
  return path
}

export function UtmCampaignBuilder({
  className,
  initialPreset = 'product_launch',
  initialBaseUrl = 'https://uipkge.dev/pricing',
  initialSource = 'twitter',
  initialMedium = 'social',
  initialCampaign = 'launch_2026_q3',
  initialTerm = 'ui_components',
  initialContent = 'banner_hero_cta',
  initialShortlinkDomain = 'https://uipk.ge',
  initialShortlinkSlug = 'q3-launch',
  onCopyUrl,
  onCopyShortlink,
  onDownloadQr,
  onChange,
}: UtmCampaignBuilderProps) {
  const [selectedPreset, setSelectedPreset] = React.useState(initialPreset)
  const [baseUrl, setBaseUrl] = React.useState(initialBaseUrl)
  const [utmSource, setUtmSource] = React.useState(initialSource)
  const [utmMedium, setUtmMedium] = React.useState(initialMedium)
  const [utmCampaign, setUtmCampaign] = React.useState(initialCampaign)
  const [utmTerm, setUtmTerm] = React.useState(initialTerm)
  const [utmContent, setUtmContent] = React.useState(initialContent)

  const [shortlinkDomain] = React.useState(initialShortlinkDomain)
  const [shortlinkSlug, setShortlinkSlug] = React.useState(initialShortlinkSlug)

  const [copiedFullUrl, setCopiedFullUrl] = React.useState(false)
  const [copiedShortlink, setCopiedShortlink] = React.useState(false)
  const [downloadedQr, setDownloadedQr] = React.useState(false)

  const applyPreset = React.useCallback((presetId: string) => {
    setSelectedPreset(presetId)
    if (presetId === 'custom') return

    const preset = CAMPAIGN_PRESETS.find((p) => p.id === presetId)
    if (preset) {
      setBaseUrl(preset.baseUrl)
      setUtmSource(preset.source)
      setUtmMedium(preset.medium)
      setUtmCampaign(preset.campaign)
      setUtmTerm(preset.term ?? '')
      setUtmContent(preset.content ?? '')
      setShortlinkSlug(preset.shortlinkSlug)
    }
  }, [])

  const handleReset = React.useCallback(() => {
    setSelectedPreset('product_launch')
    const def = CAMPAIGN_PRESETS[0]
    setBaseUrl(def.baseUrl)
    setUtmSource(def.source)
    setUtmMedium(def.medium)
    setUtmCampaign(def.campaign)
    setUtmTerm(def.term ?? '')
    setUtmContent(def.content ?? '')
    setShortlinkSlug(def.shortlinkSlug)
  }, [])

  // Active query parameters
  const activeQueryParameters = React.useMemo<QueryParamItem[]>(() => {
    const list: QueryParamItem[] = []
    if (utmSource.trim()) {
      list.push({
        key: 'utm_source',
        value: utmSource.trim(),
        label: 'Campaign Source',
        required: true,
      })
    }
    if (utmMedium.trim()) {
      list.push({
        key: 'utm_medium',
        value: utmMedium.trim(),
        label: 'Campaign Medium',
        required: true,
      })
    }
    if (utmCampaign.trim()) {
      list.push({
        key: 'utm_campaign',
        value: utmCampaign.trim(),
        label: 'Campaign Name',
        required: true,
      })
    }
    if (utmTerm.trim()) {
      list.push({
        key: 'utm_term',
        value: utmTerm.trim(),
        label: 'Campaign Term',
        required: false,
      })
    }
    if (utmContent.trim()) {
      list.push({
        key: 'utm_content',
        value: utmContent.trim(),
        label: 'Campaign Content',
        required: false,
      })
    }
    return list
  }, [utmSource, utmMedium, utmCampaign, utmTerm, utmContent])

  // Full Generated URL
  const generatedFullUrl = React.useMemo(() => {
    const rawBase = baseUrl.trim()
    if (!rawBase) return ''

    let normalized = rawBase
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`
    }

    const params = new URLSearchParams()
    if (utmSource.trim()) params.set('utm_source', utmSource.trim())
    if (utmMedium.trim()) params.set('utm_medium', utmMedium.trim())
    if (utmCampaign.trim()) params.set('utm_campaign', utmCampaign.trim())
    if (utmTerm.trim()) params.set('utm_term', utmTerm.trim())
    if (utmContent.trim()) params.set('utm_content', utmContent.trim())

    const queryString = params.toString()
    if (!queryString) return normalized

    const separator = normalized.includes('?') ? '&' : '?'
    return `${normalized}${separator}${queryString}`
  }, [baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent])

  // Shortlink preview
  const generatedShortlink = React.useMemo(() => {
    const domain = shortlinkDomain.replace(/\/+$/, '')
    const slug =
      shortlinkSlug.trim() ||
      utmCampaign
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') ||
      'link'
    return `${domain}/${slug}`
  }, [shortlinkDomain, shortlinkSlug, utmCampaign])

  const isGa4Compliant = Boolean(baseUrl.trim() && utmSource.trim() && utmMedium.trim() && utmCampaign.trim())

  React.useEffect(() => {
    onChange?.({
      baseUrl,
      source: utmSource,
      medium: utmMedium,
      campaign: utmCampaign,
      term: utmTerm,
      content: utmContent,
      fullUrl: generatedFullUrl,
      shortlinkUrl: generatedShortlink,
    })
  }, [baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, generatedFullUrl, generatedShortlink, onChange])

  const handleCopyFullUrl = async () => {
    const url = generatedFullUrl
    if (!url) return

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = url
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      setCopiedFullUrl(true)
      onCopyUrl?.(url)
      setTimeout(() => setCopiedFullUrl(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const handleCopyShortlink = async () => {
    const link = generatedShortlink
    if (!link) return

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = link
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }

      setCopiedShortlink(true)
      onCopyShortlink?.(link)
      setTimeout(() => setCopiedShortlink(false), 2000)
    } catch (err) {
      console.error('Failed to copy shortlink:', err)
    }
  }

  const qrData = React.useMemo(() => {
    const text = generatedFullUrl || 'https://uipkge.dev'
    return generateQrMatrix(text)
  }, [generatedFullUrl])

  const qrPath = React.useMemo(() => qrToSvgPath(qrData.matrix), [qrData])

  const handleDownloadQr = () => {
    const text = generatedFullUrl || 'https://uipkge.dev'
    const { matrix, size } = generateQrMatrix(text)
    const pathData = qrToSvgPath(matrix)
    const margin = 2
    const totalSize = size + margin * 2
    const filename = utmCampaign.trim() ? `${utmCampaign.trim()}-qr.svg` : 'utm-campaign-qr.svg'

    const svgContent = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="512" height="512">
  <rect width="100%" height="100%" fill="#ffffff" />
  <g transform="translate(${margin}, ${margin})">
    <path d="${pathData}" fill="#0f172a" shape-rendering="crispEdges" />
  </g>
</svg>`

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setDownloadedQr(true)
    onDownloadQr?.({ url: text, filename })
    setTimeout(() => setDownloadedQr(false), 2000)
  }

  return (
    <div data-slot="utm-campaign-builder" className={cn('mx-auto w-full max-w-7xl space-y-6', className)}>
      {/* Header Section */}
      <div className="border-border flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-primary/10 text-primary border-primary/20 flex size-8 items-center justify-center rounded-md border">
              <TrendingUp className="size-4" aria-hidden="true" />
            </div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Campaign URL & UTM Builder</h1>
            <Badge variant={isGa4Compliant ? 'default' : 'outline'} className="gap-1 px-2 py-0.5 text-xs font-semibold">
              <Sparkles className="size-3" aria-hidden="true" />
              {isGa4Compliant ? 'GA4 Standard' : 'Draft Link'}
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Generate trackable marketing links with standardized GA4 parameters, shortlinks, and vector QR codes.
          </p>
        </div>

        {/* Preset Selector & Reset Action */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-56">
            <Select value={selectedPreset} onValueChange={applyPreset}>
              <SelectTrigger size="sm" className="h-9 text-xs">
                <SelectValue placeholder="Select campaign preset" />
              </SelectTrigger>
              <SelectContent>
                {CAMPAIGN_PRESETS.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.name}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom Parameters</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs" onClick={handleReset}>
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Reset
          </Button>
        </div>
      </div>

      {/* 2-Column Builder Layout */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Column: Parameter Inputs Form */}
        <div className="space-y-6 lg:col-span-7">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link2 className="text-primary size-4" aria-hidden="true" />
                  <CardTitle className="text-base font-semibold">Campaign Parameters</CardTitle>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  {activeQueryParameters.length} active params
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Fill in the landing page destination and key attribution parameters for Google Analytics 4.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* 1. Base Website URL */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="utm-base-url" className="text-foreground text-xs font-medium">
                    Website URL <span className="text-destructive">*</span>
                  </label>
                  <span className="text-muted-foreground text-xs">Destination link</span>
                </div>
                <Input
                  id="utm-base-url"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  type="url"
                  placeholder="https://uipkge.dev/pricing"
                  size="middle"
                />
                <p className="text-muted-foreground text-xs">The full landing page URL where users will arrive.</p>
              </div>

              <Separator />

              {/* 2. Campaign Source (utm_source) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <label htmlFor="utm-source" className="text-foreground text-xs font-medium">
                      Campaign Source <span className="text-destructive">*</span>
                    </label>
                    <code className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                      utm_source
                    </code>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Required
                  </Badge>
                </div>
                <Input
                  id="utm-source"
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  placeholder="e.g. twitter, google, newsletter"
                  size="middle"
                />
                {/* Quick Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-muted-foreground mr-1 text-xs">Suggestions:</span>
                  {SOURCE_CHIPS.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      className={cn(
                        'min-h-6 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
                        utmSource === chip.label
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                      onClick={() => setUtmSource(chip.label)}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Campaign Medium (utm_medium) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <label htmlFor="utm-medium" className="text-foreground text-xs font-medium">
                      Campaign Medium <span className="text-destructive">*</span>
                    </label>
                    <code className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                      utm_medium
                    </code>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Required
                  </Badge>
                </div>
                <Input
                  id="utm-medium"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  placeholder="e.g. social, cpc, email, referral"
                  size="middle"
                />
                {/* Quick Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-muted-foreground mr-1 text-xs">Suggestions:</span>
                  {MEDIUM_CHIPS.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      className={cn(
                        'min-h-6 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
                        utmMedium === chip.label
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                      onClick={() => setUtmMedium(chip.label)}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Campaign Name (utm_campaign) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <label htmlFor="utm-campaign" className="text-foreground text-xs font-medium">
                      Campaign Name <span className="text-destructive">*</span>
                    </label>
                    <code className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                      utm_campaign
                    </code>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Required
                  </Badge>
                </div>
                <Input
                  id="utm-campaign"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  placeholder="e.g. launch_2026_q3, summer_promo"
                  size="middle"
                />
                <p className="text-muted-foreground text-xs">
                  Unique promotion identifier, product slogan, or promo code.
                </p>
              </div>

              <Separator />

              {/* Optional Parameters Section Header */}
              <div className="flex items-center gap-2 pt-1">
                <Tag className="text-muted-foreground size-3.5" aria-hidden="true" />
                <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Optional GA4 Attributes
                </span>
              </div>

              {/* 5. Campaign Term (utm_term) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <label htmlFor="utm-term" className="text-foreground text-xs font-medium">
                      Campaign Term
                    </label>
                    <code className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                      utm_term
                    </code>
                  </div>
                  <span className="text-muted-foreground text-xs">Optional · Paid search keywords</span>
                </div>
                <Input
                  id="utm-term"
                  value={utmTerm}
                  onChange={(e) => setUtmTerm(e.target.value)}
                  placeholder="e.g. ui_components, vue_dashboard"
                  size="middle"
                />
              </div>

              {/* 6. Campaign Content (utm_content) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <label htmlFor="utm-content" className="text-foreground text-xs font-medium">
                      Campaign Content
                    </label>
                    <code className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                      utm_content
                    </code>
                  </div>
                  <span className="text-muted-foreground text-xs">Optional · A/B test & ad creative</span>
                </div>
                <Input
                  id="utm-content"
                  value={utmContent}
                  onChange={(e) => setUtmContent(e.target.value)}
                  placeholder="e.g. banner_cta_blue, sidebar_link_v2"
                  size="middle"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Generated Campaign URL Card (Sticky) */}
        <div className="space-y-5 lg:sticky lg:top-6 lg:col-span-5">
          <Card className="border-border overflow-hidden shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  <CardTitle className="text-base font-semibold">Generated Campaign URL</CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                >
                  Live Ready
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Formatted destination URL with tracking query parameters.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Monospace Syntax-Highlighted Code Container */}
              <div className="bg-muted/70 border-border/80 relative rounded-lg border p-3.5 font-mono text-xs leading-relaxed break-all select-all">
                {generatedFullUrl ? (
                  <div>
                    <span className="text-foreground font-semibold">{baseUrl.trim()}</span>
                    {activeQueryParameters.length > 0 && (
                      <>
                        <span className="text-muted-foreground font-bold">{baseUrl.includes('?') ? '&' : '?'}</span>
                        {activeQueryParameters.map((param, index) => (
                          <React.Fragment key={param.key}>
                            <span className="font-medium text-sky-600 dark:text-sky-400">{param.key}</span>
                            <span className="text-muted-foreground">=</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {encodeURIComponent(param.value)}
                            </span>
                            {index < activeQueryParameters.length - 1 && (
                              <span className="text-muted-foreground font-bold">&amp;</span>
                            )}
                          </React.Fragment>
                        ))}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground italic">
                    Enter a destination website URL to generate your campaign link...
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button
                  size="sm"
                  className="w-full gap-1.5 text-xs font-semibold"
                  disabled={!generatedFullUrl}
                  onClick={handleCopyFullUrl}
                >
                  {copiedFullUrl ? (
                    <Check className="size-3.5 text-emerald-300" aria-hidden="true" />
                  ) : (
                    <Copy className="size-3.5" aria-hidden="true" />
                  )}
                  {copiedFullUrl ? 'Copied Full URL!' : 'Copy Full URL'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5 text-xs"
                  disabled={!generatedFullUrl}
                  asChild
                >
                  <a href={generatedFullUrl || undefined} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                    Test in New Tab
                  </a>
                </Button>
              </div>

              <Separator />

              {/* Shortlink Generator Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Globe className="text-primary size-3.5" aria-hidden="true" />
                    <span className="text-foreground text-xs font-semibold">Shortlink Generator</span>
                  </div>
                  <span className="text-muted-foreground text-xs">For SMS & Social</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      value={shortlinkSlug}
                      onChange={(e) => setShortlinkSlug(e.target.value)}
                      placeholder="custom-slug"
                      size="small"
                      prefix={<span className="text-muted-foreground font-mono text-xs">uipk.ge/</span>}
                      className="font-mono text-xs"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 gap-1 text-xs" onClick={handleCopyShortlink}>
                    {copiedShortlink ? (
                      <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="size-3" aria-hidden="true" />
                    )}
                    {copiedShortlink ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* SVG QR Code Generator Pass */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <QrCode className="text-primary size-3.5" aria-hidden="true" />
                    <span className="text-foreground text-xs font-semibold">QR Code Campaign Pass</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Print & Banners
                  </Badge>
                </div>

                <div className="bg-muted/40 border-border/70 flex flex-col items-center justify-center gap-3 rounded-lg border p-4 text-center">
                  {/* Crisp Vector SVG QR Code */}
                  <div className="bg-card text-foreground border-border flex size-36 items-center justify-center rounded-md border p-2 shadow-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox={`0 0 ${qrData.size + 4} ${qrData.size + 4}`}
                      className="size-full"
                      shapeRendering="crispEdges"
                    >
                      <rect width="100%" height="100%" fill="transparent" />
                      <g transform="translate(2, 2)">
                        <path d={qrPath} fill="currentColor" />
                      </g>
                    </svg>
                  </div>

                  <p className="text-muted-foreground text-xs">
                    Vector SVG scales to any resolution for billboard, print collateral, or event badges.
                  </p>

                  <Button
                    aria-label="Download attachment"
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 text-xs"
                    disabled={!generatedFullUrl}
                    onClick={handleDownloadQr}
                  >
                    {downloadedQr ? (
                      <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Download className="size-3.5" aria-hidden="true" />
                    )}
                    {downloadedQr ? 'Downloaded SVG!' : 'Download QR Code (.SVG)'}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Parameters Breakdown Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-xs font-semibold">Parameters Verification</span>
                  <span className="text-muted-foreground text-xs">{activeQueryParameters.length}/5 Active</span>
                </div>

                <div className="border-border overflow-hidden rounded-md border text-xs">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="h-7 text-xs font-medium">Parameter</TableHead>
                        <TableHead className="h-7 text-xs font-medium">Value</TableHead>
                        <TableHead className="h-7 text-right text-xs font-medium">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="py-2 font-mono text-xs font-semibold">utm_source</TableCell>
                        <TableCell className="text-muted-foreground py-2 font-mono text-xs">
                          {utmSource.trim() || '—'}
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <Badge
                            variant={utmSource.trim() ? 'default' : 'destructive'}
                            className="px-1.5 py-0 text-xs font-normal"
                          >
                            {utmSource.trim() ? 'Set' : 'Missing'}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="py-2 font-mono text-xs font-semibold">utm_medium</TableCell>
                        <TableCell className="text-muted-foreground py-2 font-mono text-xs">
                          {utmMedium.trim() || '—'}
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <Badge
                            variant={utmMedium.trim() ? 'default' : 'destructive'}
                            className="px-1.5 py-0 text-xs font-normal"
                          >
                            {utmMedium.trim() ? 'Set' : 'Missing'}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="py-2 font-mono text-xs font-semibold">utm_campaign</TableCell>
                        <TableCell className="text-muted-foreground py-2 font-mono text-xs">
                          {utmCampaign.trim() || '—'}
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <Badge
                            variant={utmCampaign.trim() ? 'default' : 'destructive'}
                            className="px-1.5 py-0 text-xs font-normal"
                          >
                            {utmCampaign.trim() ? 'Set' : 'Missing'}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="py-2 font-mono text-xs font-semibold">utm_term</TableCell>
                        <TableCell className="text-muted-foreground py-2 font-mono text-xs">
                          {utmTerm.trim() || '—'}
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <Badge variant="outline" className="px-1.5 py-0 text-xs font-normal">
                            {utmTerm.trim() ? 'Set' : 'Optional'}
                          </Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="py-2 font-mono text-xs font-semibold">utm_content</TableCell>
                        <TableCell className="text-muted-foreground py-2 font-mono text-xs">
                          {utmContent.trim() || '—'}
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <Badge variant="outline" className="px-1.5 py-0 text-xs font-normal">
                            {utmContent.trim() ? 'Set' : 'Optional'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
