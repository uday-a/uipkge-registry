<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref, watch } from 'vue'
import {
  ArrowUpRight,
  BarChart3,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Globe,
  Hash,
  Layers,
  Link2,
  QrCode,
  RotateCcw,
  Share2,
  Sparkles,
  Tag,
  Target,
  TrendingUp,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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

interface Props {
  class?: HTMLAttributes['class']
  initialPreset?: string
  initialBaseUrl?: string
  initialSource?: string
  initialMedium?: string
  initialCampaign?: string
  initialTerm?: string
  initialContent?: string
  initialShortlinkDomain?: string
  initialShortlinkSlug?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialPreset: 'product_launch',
  initialBaseUrl: 'https://uipkge.dev/pricing',
  initialSource: 'twitter',
  initialMedium: 'social',
  initialCampaign: 'launch_2026_q3',
  initialTerm: 'ui_components',
  initialContent: 'banner_hero_cta',
  initialShortlinkDomain: 'https://uipk.ge',
  initialShortlinkSlug: 'q3-launch',
})

const emits = defineEmits<{
  (e: 'copy-url', url: string): void
  (e: 'copy-shortlink', shortlink: string): void
  (e: 'download-qr', payload: { url: string; filename: string }): void
  (e: 'change', data: UtmCampaignData): void
}>()

const CAMPAIGN_PRESETS: UtmPreset[] = [
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

// Form State
const selectedPreset = ref(props.initialPreset)
const baseUrl = ref(props.initialBaseUrl)
const utmSource = ref(props.initialSource)
const utmMedium = ref(props.initialMedium)
const utmCampaign = ref(props.initialCampaign)
const utmTerm = ref(props.initialTerm)
const utmContent = ref(props.initialContent)

const shortlinkDomain = ref(props.initialShortlinkDomain)
const shortlinkSlug = ref(props.initialShortlinkSlug)

// Feedback states
const copiedFullUrl = ref(false)
const copiedShortlink = ref(false)
const downloadedQr = ref(false)
let copyUrlTimer: ReturnType<typeof setTimeout> | null = null
let copyShortlinkTimer: ReturnType<typeof setTimeout> | null = null
let downloadQrTimer: ReturnType<typeof setTimeout> | null = null

function applyPreset(presetId: unknown) {
  const id = String(presetId)
  selectedPreset.value = id
  if (id === 'custom') return

  const preset = CAMPAIGN_PRESETS.find((p) => p.id === id)
  if (preset) {
    baseUrl.value = preset.baseUrl
    utmSource.value = preset.source
    utmMedium.value = preset.medium
    utmCampaign.value = preset.campaign
    utmTerm.value = preset.term ?? ''
    utmContent.value = preset.content ?? ''
    shortlinkSlug.value = preset.shortlinkSlug
  }
}

function handleReset() {
  selectedPreset.value = 'product_launch'
  const def = CAMPAIGN_PRESETS[0]
  baseUrl.value = def.baseUrl
  utmSource.value = def.source
  utmMedium.value = def.medium
  utmCampaign.value = def.campaign
  utmTerm.value = def.term ?? ''
  utmContent.value = def.content ?? ''
  shortlinkSlug.value = def.shortlinkSlug
}

// Generated parameters array for structured preview
interface QueryParamItem {
  key: string
  value: string
  label: string
  required: boolean
}

const activeQueryParameters = computed<QueryParamItem[]>(() => {
  const list: QueryParamItem[] = []
  if (utmSource.value.trim()) {
    list.push({
      key: 'utm_source',
      value: utmSource.value.trim(),
      label: 'Campaign Source',
      required: true,
    })
  }
  if (utmMedium.value.trim()) {
    list.push({
      key: 'utm_medium',
      value: utmMedium.value.trim(),
      label: 'Campaign Medium',
      required: true,
    })
  }
  if (utmCampaign.value.trim()) {
    list.push({
      key: 'utm_campaign',
      value: utmCampaign.value.trim(),
      label: 'Campaign Name',
      required: true,
    })
  }
  if (utmTerm.value.trim()) {
    list.push({
      key: 'utm_term',
      value: utmTerm.value.trim(),
      label: 'Campaign Term',
      required: false,
    })
  }
  if (utmContent.value.trim()) {
    list.push({
      key: 'utm_content',
      value: utmContent.value.trim(),
      label: 'Campaign Content',
      required: false,
    })
  }
  return list
})

// Full Generated URL
const generatedFullUrl = computed(() => {
  const rawBase = baseUrl.value.trim()
  if (!rawBase) return ''

  let normalized = rawBase
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`
  }

  const params = new URLSearchParams()
  if (utmSource.value.trim()) params.set('utm_source', utmSource.value.trim())
  if (utmMedium.value.trim()) params.set('utm_medium', utmMedium.value.trim())
  if (utmCampaign.value.trim()) params.set('utm_campaign', utmCampaign.value.trim())
  if (utmTerm.value.trim()) params.set('utm_term', utmTerm.value.trim())
  if (utmContent.value.trim()) params.set('utm_content', utmContent.value.trim())

  const queryString = params.toString()
  if (!queryString) return normalized

  const separator = normalized.includes('?') ? '&' : '?'
  return `${normalized}${separator}${queryString}`
})

// Shortlink preview computation
const generatedShortlink = computed(() => {
  const domain = shortlinkDomain.value.replace(/\/+$/, '')
  const slug =
    shortlinkSlug.value.trim() ||
    utmCampaign.value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') ||
    'link'
  return `${domain}/${slug}`
})

// Check if all 3 required UTM parameters are filled
const isGa4Compliant = computed(() => {
  return Boolean(baseUrl.value.trim() && utmSource.value.trim() && utmMedium.value.trim() && utmCampaign.value.trim())
})

// Notify changes
watch(
  [baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, generatedFullUrl, generatedShortlink],
  () => {
    emits('change', {
      baseUrl: baseUrl.value,
      source: utmSource.value,
      medium: utmMedium.value,
      campaign: utmCampaign.value,
      term: utmTerm.value,
      content: utmContent.value,
      fullUrl: generatedFullUrl.value,
      shortlinkUrl: generatedShortlink.value,
    })
  },
  { immediate: true },
)

// Copy Handlers
async function handleCopyFullUrl() {
  const url = generatedFullUrl.value
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

    if (copyUrlTimer) clearTimeout(copyUrlTimer)
    copiedFullUrl.value = true
    emits('copy-url', url)
    copyUrlTimer = setTimeout(() => {
      copiedFullUrl.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy URL:', err)
  }
}

async function handleCopyShortlink() {
  const link = generatedShortlink.value
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

    if (copyShortlinkTimer) clearTimeout(copyShortlinkTimer)
    copiedShortlink.value = true
    emits('copy-shortlink', link)
    copyShortlinkTimer = setTimeout(() => {
      copiedShortlink.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy shortlink:', err)
  }
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

const qrData = computed(() => {
  const text = generatedFullUrl.value || 'https://uipkge.dev'
  return generateQrMatrix(text)
})

const qrPath = computed(() => qrToSvgPath(qrData.value.matrix))

function handleDownloadQr() {
  const text = generatedFullUrl.value || 'https://uipkge.dev'
  const { matrix, size } = generateQrMatrix(text)
  const pathData = qrToSvgPath(matrix)
  const margin = 2
  const totalSize = size + margin * 2
  const filename = utmCampaign.value.trim() ? `${utmCampaign.value.trim()}-qr.svg` : 'utm-campaign-qr.svg'

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

  if (downloadQrTimer) clearTimeout(downloadQrTimer)
  downloadedQr.value = true
  emits('download-qr', { url: text, filename })
  downloadQrTimer = setTimeout(() => {
    downloadedQr.value = false
  }, 2000)
}
</script>

<template>
  <div data-slot="utm-campaign-builder" :class="cn('mx-auto w-full max-w-7xl space-y-6', props.class)">
    <!-- Header Section -->
    <div class="border-border flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <div class="flex flex-wrap items-center gap-2.5">
          <div
            class="bg-primary/10 text-primary border-primary/20 flex size-8 items-center justify-center rounded-md border"
          >
            <TrendingUp class="size-4" aria-hidden="true" />
          </div>
          <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Campaign URL & UTM Builder</h1>
          <Badge :variant="isGa4Compliant ? 'default' : 'outline'" class="gap-1 px-2 py-0.5 text-xs font-semibold">
            <Sparkles class="size-3" aria-hidden="true" />
            {{ isGa4Compliant ? 'GA4 Standard' : 'Draft Link' }}
          </Badge>
        </div>
        <p class="text-muted-foreground text-xs sm:text-sm">
          Generate trackable marketing links with standardized GA4 parameters, shortlinks, and vector QR codes.
        </p>
      </div>

      <!-- Preset Selector & Reset Action -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="w-56">
          <Select :model-value="selectedPreset" @update:model-value="applyPreset">
            <SelectTrigger size="sm" class="h-9 text-xs">
              <SelectValue placeholder="Select campaign preset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="preset in CAMPAIGN_PRESETS" :key="preset.id" :value="preset.id">
                {{ preset.name }}
              </SelectItem>
              <SelectItem value="custom">Custom Parameters</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="sm" class="h-9 gap-1.5 text-xs" @click="handleReset">
          <RotateCcw class="size-3.5" aria-hidden="true" />
          Reset
        </Button>
      </div>
    </div>

    <!-- 2-Column Builder Layout -->
    <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      <!-- Left Column: Parameter Inputs Form -->
      <div class="space-y-6 lg:col-span-7">
        <Card>
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Link2 class="text-primary size-4" aria-hidden="true" />
                <CardTitle class="text-base font-semibold">Campaign Parameters</CardTitle>
              </div>
              <Badge variant="secondary" class="font-mono text-xs">
                {{ activeQueryParameters.length }} active params
              </Badge>
            </div>
            <CardDescription class="text-xs">
              Fill in the landing page destination and key attribution parameters for Google Analytics 4.
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-5">
            <!-- 1. Base Website URL -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label for="utm-base-url" class="text-foreground text-xs font-medium">
                  Website URL <span class="text-destructive">*</span>
                </label>
                <span class="text-muted-foreground text-xs">Destination link</span>
              </div>
              <Input
                id="utm-base-url"
                v-model="baseUrl"
                type="url"
                placeholder="https://uipkge.dev/pricing"
                size="middle"
              />
              <p class="text-muted-foreground text-xs">The full landing page URL where users will arrive.</p>
            </div>

            <Separator />

            <!-- 2. Campaign Source (utm_source) -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <label for="utm-source" class="text-foreground text-xs font-medium">
                    Campaign Source <span class="text-destructive">*</span>
                  </label>
                  <code class="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">utm_source</code>
                </div>
                <Badge variant="outline" class="text-xs">Required</Badge>
              </div>
              <Input id="utm-source" v-model="utmSource" placeholder="e.g. twitter, google, newsletter" size="middle" />
              <!-- Quick Chips -->
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <span class="text-muted-foreground mr-1 text-xs">Suggestions:</span>
                <button
                  v-for="chip in SOURCE_CHIPS"
                  :key="chip.label"
                  type="button"
                  :class="
                    cn(
                      'min-h-6 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
                      utmSource === chip.label
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground',
                    )
                  "
                  @click="utmSource = chip.label"
                >
                  {{ chip.label }}
                </button>
              </div>
            </div>

            <!-- 3. Campaign Medium (utm_medium) -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <label for="utm-medium" class="text-foreground text-xs font-medium">
                    Campaign Medium <span class="text-destructive">*</span>
                  </label>
                  <code class="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">utm_medium</code>
                </div>
                <Badge variant="outline" class="text-xs">Required</Badge>
              </div>
              <Input
                id="utm-medium"
                v-model="utmMedium"
                placeholder="e.g. social, cpc, email, referral"
                size="middle"
              />
              <!-- Quick Chips -->
              <div class="flex flex-wrap items-center gap-1.5 pt-1">
                <span class="text-muted-foreground mr-1 text-xs">Suggestions:</span>
                <button
                  v-for="chip in MEDIUM_CHIPS"
                  :key="chip.label"
                  type="button"
                  :class="
                    cn(
                      'min-h-6 rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
                      utmMedium === chip.label
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground',
                    )
                  "
                  @click="utmMedium = chip.label"
                >
                  {{ chip.label }}
                </button>
              </div>
            </div>

            <!-- 4. Campaign Name (utm_campaign) -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <label for="utm-campaign" class="text-foreground text-xs font-medium">
                    Campaign Name <span class="text-destructive">*</span>
                  </label>
                  <code class="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs"
                    >utm_campaign</code
                  >
                </div>
                <Badge variant="outline" class="text-xs">Required</Badge>
              </div>
              <Input
                id="utm-campaign"
                v-model="utmCampaign"
                placeholder="e.g. launch_2026_q3, summer_promo"
                size="middle"
              />
              <p class="text-muted-foreground text-xs">Unique promotion identifier, product slogan, or promo code.</p>
            </div>

            <Separator />

            <!-- Optional Parameters Section Header -->
            <div class="flex items-center gap-2 pt-1">
              <Tag class="text-muted-foreground size-3.5" aria-hidden="true" />
              <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Optional GA4 Attributes
              </span>
            </div>

            <!-- 5. Campaign Term (utm_term) -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <label for="utm-term" class="text-foreground text-xs font-medium">Campaign Term</label>
                  <code class="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">utm_term</code>
                </div>
                <span class="text-muted-foreground text-xs">Optional · Paid search keywords</span>
              </div>
              <Input id="utm-term" v-model="utmTerm" placeholder="e.g. ui_components, vue_dashboard" size="middle" />
            </div>

            <!-- 6. Campaign Content (utm_content) -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <label for="utm-content" class="text-foreground text-xs font-medium">Campaign Content</label>
                  <code class="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs"
                    >utm_content</code
                  >
                </div>
                <span class="text-muted-foreground text-xs">Optional · A/B test & ad creative</span>
              </div>
              <Input
                id="utm-content"
                v-model="utmContent"
                placeholder="e.g. banner_cta_blue, sidebar_link_v2"
                size="middle"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: Generated Campaign URL Card (Sticky) -->
      <div class="space-y-5 lg:sticky lg:top-6 lg:col-span-5">
        <Card class="border-border overflow-hidden shadow-sm">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="relative flex size-2">
                  <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span class="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <CardTitle class="text-base font-semibold">Generated Campaign URL</CardTitle>
              </div>
              <Badge
                variant="outline"
                class="border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                Live Ready
              </Badge>
            </div>
            <CardDescription class="text-xs">
              Formatted destination URL with tracking query parameters.
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- Monospace Syntax-Highlighted Code Container -->
            <div
              class="bg-muted/70 border-border/80 relative rounded-lg border p-3.5 font-mono text-xs leading-relaxed break-all select-all"
            >
              <div v-if="generatedFullUrl">
                <span class="text-foreground font-semibold">{{ baseUrl.trim() }}</span>
                <template v-if="activeQueryParameters.length > 0">
                  <span class="text-muted-foreground font-bold">{{ baseUrl.includes('?') ? '&' : '?' }}</span>
                  <template v-for="(param, index) in activeQueryParameters" :key="param.key">
                    <span class="font-medium text-sky-600 dark:text-sky-400">{{ param.key }}</span>
                    <span class="text-muted-foreground">=</span>
                    <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{
                      encodeURIComponent(param.value)
                    }}</span>
                    <span v-if="index < activeQueryParameters.length - 1" class="text-muted-foreground font-bold"
                      >&amp;</span
                    >
                  </template>
                </template>
              </div>
              <div v-else class="text-muted-foreground italic">
                Enter a destination website URL to generate your campaign link...
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                size="sm"
                class="w-full gap-1.5 text-xs font-semibold"
                :disabled="!generatedFullUrl"
                @click="handleCopyFullUrl"
              >
                <Check v-if="copiedFullUrl" class="size-3.5 text-emerald-300" aria-hidden="true" />
                <Copy v-else class="size-3.5" aria-hidden="true" />
                {{ copiedFullUrl ? 'Copied Full URL!' : 'Copy Full URL' }}
              </Button>

              <Button
                variant="outline"
                size="sm"
                class="w-full gap-1.5 text-xs"
                :disabled="!generatedFullUrl"
                as="a"
                :href="generatedFullUrl || undefined"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink class="size-3.5" aria-hidden="true" />
                Test in New Tab
              </Button>
            </div>

            <Separator />

            <!-- Shortlink Generator Preview -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <Globe class="text-primary size-3.5" aria-hidden="true" />
                  <span class="text-foreground text-xs font-semibold">Shortlink Generator</span>
                </div>
                <span class="text-muted-foreground text-xs">For SMS & Social</span>
              </div>

              <div class="flex items-center gap-2">
                <div class="relative flex-1">
                  <Input v-model="shortlinkSlug" placeholder="custom-slug" size="small" class="font-mono text-xs">
                    <template #prefix>
                      <span class="text-muted-foreground font-mono text-xs">uipk.ge/</span>
                    </template>
                  </Input>
                </div>
                <Button variant="outline" size="sm" class="shrink-0 gap-1 text-xs" @click="handleCopyShortlink">
                  <Check
                    v-if="copiedShortlink"
                    class="size-3 text-emerald-600 dark:text-emerald-400"
                    aria-hidden="true"
                  />
                  <Copy v-else class="size-3" aria-hidden="true" />
                  {{ copiedShortlink ? 'Copied!' : 'Copy' }}
                </Button>
              </div>
            </div>

            <Separator />

            <!-- SVG QR Code Generator Pass -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <QrCode class="text-primary size-3.5" aria-hidden="true" />
                  <span class="text-foreground text-xs font-semibold">QR Code Campaign Pass</span>
                </div>
                <Badge variant="outline" class="text-xs">Print & Banners</Badge>
              </div>

              <div
                class="bg-muted/40 border-border/70 flex flex-col items-center justify-center gap-3 rounded-lg border p-4 text-center"
              >
                <!-- Crisp Vector SVG QR Code -->
                <div
                  class="bg-card text-foreground border-border flex size-36 items-center justify-center rounded-md border p-2 shadow-xs"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    :viewBox="`0 0 ${qrData.size + 4} ${qrData.size + 4}`"
                    class="size-full"
                    shape-rendering="crispEdges"
                  >
                    <rect width="100%" height="100%" fill="transparent" />
                    <g transform="translate(2, 2)">
                      <path :d="qrPath" fill="currentColor" />
                    </g>
                  </svg>
                </div>

                <p class="text-muted-foreground text-xs">
                  Vector SVG scales to any resolution for billboard, print collateral, or event badges.
                </p>

                <Button
                  aria-label="Download attachment"
                  variant="outline"
                  size="sm"
                  class="w-full gap-1.5 text-xs"
                  :disabled="!generatedFullUrl"
                  @click="handleDownloadQr"
                >
                  <Check
                    v-if="downloadedQr"
                    class="size-3.5 text-emerald-600 dark:text-emerald-400"
                    aria-hidden="true"
                  />
                  <Download v-else class="size-3.5" aria-hidden="true" />
                  {{ downloadedQr ? 'Downloaded SVG!' : 'Download QR Code (.SVG)' }}
                </Button>
              </div>
            </div>

            <Separator />

            <!-- Parameters Breakdown Table -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-foreground text-xs font-semibold">Parameters Verification</span>
                <span class="text-muted-foreground text-xs">{{ activeQueryParameters.length }}/5 Active</span>
              </div>

              <div class="border-border overflow-hidden rounded-md border text-xs">
                <Table>
                  <TableHeader>
                    <TableRow class="hover:bg-transparent">
                      <TableHead class="h-7 text-xs font-medium">Parameter</TableHead>
                      <TableHead class="h-7 text-xs font-medium">Value</TableHead>
                      <TableHead class="h-7 text-right text-xs font-medium">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell class="py-2 font-mono text-xs font-semibold">utm_source</TableCell>
                      <TableCell class="text-muted-foreground py-2 font-mono text-xs">
                        {{ utmSource.trim() || '—' }}
                      </TableCell>
                      <TableCell class="py-2 text-right">
                        <Badge
                          :variant="utmSource.trim() ? 'default' : 'destructive'"
                          class="px-1.5 py-0 text-xs font-normal"
                        >
                          {{ utmSource.trim() ? 'Set' : 'Missing' }}
                        </Badge>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell class="py-2 font-mono text-xs font-semibold">utm_medium</TableCell>
                      <TableCell class="text-muted-foreground py-2 font-mono text-xs">
                        {{ utmMedium.trim() || '—' }}
                      </TableCell>
                      <TableCell class="py-2 text-right">
                        <Badge
                          :variant="utmMedium.trim() ? 'default' : 'destructive'"
                          class="px-1.5 py-0 text-xs font-normal"
                        >
                          {{ utmMedium.trim() ? 'Set' : 'Missing' }}
                        </Badge>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell class="py-2 font-mono text-xs font-semibold">utm_campaign</TableCell>
                      <TableCell class="text-muted-foreground py-2 font-mono text-xs">
                        {{ utmCampaign.trim() || '—' }}
                      </TableCell>
                      <TableCell class="py-2 text-right">
                        <Badge
                          :variant="utmCampaign.trim() ? 'default' : 'destructive'"
                          class="px-1.5 py-0 text-xs font-normal"
                        >
                          {{ utmCampaign.trim() ? 'Set' : 'Missing' }}
                        </Badge>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell class="py-2 font-mono text-xs font-semibold">utm_term</TableCell>
                      <TableCell class="text-muted-foreground py-2 font-mono text-xs">
                        {{ utmTerm.trim() || '—' }}
                      </TableCell>
                      <TableCell class="py-2 text-right">
                        <Badge variant="outline" class="px-1.5 py-0 text-xs font-normal">
                          {{ utmTerm.trim() ? 'Set' : 'Optional' }}
                        </Badge>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell class="py-2 font-mono text-xs font-semibold">utm_content</TableCell>
                      <TableCell class="text-muted-foreground py-2 font-mono text-xs">
                        {{ utmContent.trim() || '—' }}
                      </TableCell>
                      <TableCell class="py-2 text-right">
                        <Badge variant="outline" class="px-1.5 py-0 text-xs font-normal">
                          {{ utmContent.trim() ? 'Set' : 'Optional' }}
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
</template>
