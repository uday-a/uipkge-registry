'use client'

import * as React from 'react'
import {
  Check,
  Cloud,
  CloudOff,
  Copy,
  Download,
  Edit2,
  FileCode,
  Globe,
  MoreHorizontal,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'CAA'

export interface DnsRecord {
  id: string
  type: DnsRecordType
  name: string
  content: string
  ttl: string
  proxied: boolean
  priority?: number
  comment?: string
}

export interface DnsRecordManagerProps {
  domain?: string
  nameservers?: string[]
  dnssecEnabled?: boolean
  initialRecords?: DnsRecord[]
  initialAddOpen?: boolean
  className?: string
}

const defaultRecords: DnsRecord[] = [
  {
    id: 'rec-1',
    type: 'A',
    name: '@',
    content: '76.76.21.21',
    ttl: 'Auto',
    proxied: true,
    comment: 'Apex production load balancer',
  },
  {
    id: 'rec-2',
    type: 'CNAME',
    name: 'www',
    content: 'cname.vercel-dns.com',
    ttl: 'Auto',
    proxied: true,
    comment: 'Primary web redirect',
  },
  {
    id: 'rec-3',
    type: 'CNAME',
    name: 'api',
    content: 'api-gateway.uipkge.net',
    ttl: '300s',
    proxied: false,
    comment: 'Direct REST gateway route',
  },
  {
    id: 'rec-4',
    type: 'AAAA',
    name: '@',
    content: '2606:4700:3038::6815:1515',
    ttl: 'Auto',
    proxied: true,
    comment: 'IPv6 edge ingress',
  },
  {
    id: 'rec-5',
    type: 'MX',
    name: 'mail',
    content: 'aspmx.l.google.com',
    ttl: '3600s',
    proxied: false,
    priority: 10,
    comment: 'Google Workspace MX',
  },
  {
    id: 'rec-6',
    type: 'TXT',
    name: '_dmarc',
    content: 'v=spf1 include:_spf.google.com ~all',
    ttl: '3600s',
    proxied: false,
    comment: 'Sender Policy Framework verification',
  },
  {
    id: 'rec-7',
    type: 'CAA',
    name: '@',
    content: '0 issue "letsencrypt.org"',
    ttl: 'Auto',
    proxied: false,
    comment: 'Certificate authority restriction',
  },
]

const typeBadgeStyles: Record<DnsRecordType, { bg: string; text: string; border: string }> = {
  A: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/30',
  },
  AAAA: {
    bg: 'bg-teal-500/10 dark:bg-teal-500/20',
    text: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-500/30',
  },
  CNAME: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/30',
  },
  MX: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
  },
  TXT: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
  },
  CAA: {
    bg: 'bg-sky-500/10 dark:bg-sky-500/20',
    text: 'text-sky-600 dark:text-sky-400',
    border: 'border-sky-500/30',
  },
}

const placeholderMap: Record<DnsRecordType, string> = {
  A: 'e.g. 76.76.21.21',
  AAAA: 'e.g. 2606:4700:3038::6815:1515',
  CNAME: 'e.g. cname.vercel-dns.com',
  MX: 'e.g. mail.google.com',
  TXT: 'e.g. v=spf1 include:_spf.google.com ~all',
  CAA: 'e.g. 0 issue "letsencrypt.org"',
}

export function DnsRecordManager({
  domain = 'uipkge.dev',
  nameservers = ['ns1.uipkge.net', 'ns2.uipkge.net'],
  dnssecEnabled = true,
  initialRecords,
  initialAddOpen = false,
  className,
}: DnsRecordManagerProps) {
  const [records, setRecords] = React.useState<DnsRecord[]>(() =>
    initialRecords ? initialRecords.map((r) => ({ ...r })) : defaultRecords.map((r) => ({ ...r })),
  )

  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedTypeFilter, setSelectedTypeFilter] = React.useState<string>('ALL')
  const [isAddOpen, setIsAddOpen] = React.useState(initialAddOpen)
  const [isZoneFileOpen, setIsZoneFileOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)

  // Form states
  const [formType, setFormType] = React.useState<DnsRecordType>('A')
  const [formName, setFormName] = React.useState('')
  const [formContent, setFormContent] = React.useState('')
  const [formTtl, setFormTtl] = React.useState('Auto')
  const [formProxied, setFormProxied] = React.useState(true)
  const [formPriority, setFormPriority] = React.useState(10)
  const [formComment, setFormComment] = React.useState('')

  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)
  const copyTimeoutRef = React.useRef<number | undefined>(undefined)

  const copyText = React.useCallback(async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      window.clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopiedKey(null)
      }, 1600)
    } catch {
      // Clipboard unavailable
    }
  }, [])

  const handleTypeChange = (newType: DnsRecordType) => {
    setFormType(newType)
    if (['MX', 'TXT', 'CAA'].includes(newType)) {
      setFormProxied(false)
    } else if (!editingId) {
      setFormProxied(true)
    }
  }

  const toggleProxy = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === id && ['A', 'AAAA', 'CNAME'].includes(r.type)) {
          return { ...r, proxied: !r.proxied }
        }
        return r
      }),
    )
  }

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id))
    if (editingId === id) {
      cancelForm()
    }
  }

  const startAdd = () => {
    setEditingId(null)
    setFormType('A')
    setFormName('')
    setFormContent('')
    setFormTtl('Auto')
    setFormProxied(true)
    setFormPriority(10)
    setFormComment('')
    setIsAddOpen(true)
  }

  const startEdit = (record: DnsRecord) => {
    setEditingId(record.id)
    setFormType(record.type)
    setFormName(record.name)
    setFormContent(record.content)
    setFormTtl(record.ttl)
    setFormProxied(record.proxied)
    setFormPriority(record.priority ?? 10)
    setFormComment(record.comment ?? '')
    setIsAddOpen(true)
  }

  const cancelForm = () => {
    setIsAddOpen(false)
    setEditingId(null)
  }

  const saveRecord = () => {
    const name = formName.trim() || '@'
    const content = formContent.trim()
    if (!content) return

    if (editingId) {
      setRecords((prev) =>
        prev.map((r) => {
          if (r.id === editingId) {
            return {
              ...r,
              type: formType,
              name,
              content,
              ttl: formTtl,
              proxied: ['A', 'AAAA', 'CNAME'].includes(formType) ? formProxied : false,
              priority: formType === 'MX' ? Number(formPriority) : undefined,
              comment: formComment.trim() || undefined,
            }
          }
          return r
        }),
      )
    } else {
      const newRecord: DnsRecord = {
        id: `rec-${Date.now()}`,
        type: formType,
        name,
        content,
        ttl: formTtl,
        proxied: ['A', 'AAAA', 'CNAME'].includes(formType) ? formProxied : false,
        priority: formType === 'MX' ? Number(formPriority) : undefined,
        comment: formComment.trim() || undefined,
      }
      setRecords((prev) => [newRecord, ...prev])
    }

    cancelForm()
  }

  const filteredRecords = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return records.filter((record) => {
      const matchesType = selectedTypeFilter === 'ALL' || record.type === selectedTypeFilter
      const matchesQuery =
        !query ||
        record.name.toLowerCase().includes(query) ||
        record.content.toLowerCase().includes(query) ||
        record.type.toLowerCase().includes(query) ||
        (record.comment && record.comment.toLowerCase().includes(query))
      return matchesType && matchesQuery
    })
  }, [records, searchQuery, selectedTypeFilter])

  const zoneFileContent = React.useMemo(() => {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const lines: string[] = [
      `; BIND zone file for ${domain}`,
      `; Generated on ${new Date().toUTCString()}`,
      `$ORIGIN ${domain}.`,
      `$TTL 3600`,
      ``,
      `; SOA Record`,
      `@       IN  SOA  ${nameservers[0]}. hostmaster.${domain}. (`,
      `                 ${date}01 ; Serial`,
      `                 7200       ; Refresh (2 hours)`,
      `                 3600       ; Retry (1 hour)`,
      `                 1209600    ; Expire (2 weeks)`,
      `                 3600       ; Minimum TTL (1 hour)`,
      `)`,
      ``,
      `; Nameservers`,
    ]

    nameservers.forEach((ns) => {
      lines.push(`@       IN  NS   ${ns}.`)
    })

    lines.push('', '; Resource Records')

    for (const r of records) {
      const recName = (r.name === '@' ? '@' : r.name).padEnd(12, ' ')
      const ttlValue = r.ttl === 'Auto' ? '3600' : r.ttl.replace('s', '')
      const ttlStr = ttlValue.padEnd(6, ' ')
      const typeStr = r.type.padEnd(7, ' ')

      if (r.type === 'MX') {
        const prio = String(r.priority ?? 10).padEnd(4, ' ')
        lines.push(`${recName} ${ttlStr} IN  ${typeStr} ${prio} ${r.content}.`)
      } else if (r.type === 'TXT') {
        lines.push(`${recName} ${ttlStr} IN  ${typeStr} "${r.content}"`)
      } else if (r.type === 'CNAME') {
        lines.push(`${recName} ${ttlStr} IN  ${typeStr} ${r.content}.`)
      } else {
        lines.push(`${recName} ${ttlStr} IN  ${typeStr} ${r.content}`)
      }
    }

    return lines.join('\n')
  }, [domain, nameservers, records])

  const downloadZoneFile = () => {
    const blob = new Blob([zoneFileContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${domain}.zone`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const resolveHostname = (recordName: string): string => {
    if (recordName === '@') return domain
    return `${recordName}.${domain}`
  }

  return (
    <div data-slot="dns-record-manager" className={cn('w-full space-y-6', className)}>
      {/* Domain Header & Status Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                  <Globe className="size-4.5" />
                </div>
                <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">{domain}</h2>
                {dnssecEnabled ? (
                  <Badge
                    variant="outline"
                    className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 py-0.5 text-emerald-600 dark:text-emerald-400"
                  >
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    <ShieldCheck className="size-3.5" />
                    Active · DNSSEC Enabled
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="gap-1.5 border-amber-500/30 bg-amber-500/10 py-0.5 text-amber-600 dark:text-amber-400"
                  >
                    <span className="size-1.5 rounded-full bg-amber-500" />
                    <ShieldAlert className="size-3.5" />
                    Active · DNSSEC Inactive
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Authoritative DNS routing and global edge proxy management for {domain}.
              </p>
            </div>

            {/* Header CTA Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs font-medium"
                onClick={() => setIsZoneFileOpen((prev) => !prev)}
              >
                <FileCode className="size-3.5" />
                {isZoneFileOpen ? 'Hide Zone File' : 'Export Zone File'}
              </Button>
              <Button size="sm" className="h-8 gap-1.5 text-xs font-medium" onClick={startAdd}>
                <Plus className="size-3.5" />
                Add Record
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Nameserver Inspector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground font-medium">Nameservers:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {nameservers.map((ns) => (
                  <button
                    key={ns}
                    type="button"
                    aria-label={`Copy nameserver ${ns}`}
                    className="border-border bg-muted/60 hover:bg-muted focus-visible:ring-ring/50 group text-foreground flex min-h-6 items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs transition-colors focus-visible:ring-[2px] focus-visible:outline-none"
                    onClick={() => copyText(ns, ns)}
                  >
                    <span>{ns}</span>
                    {copiedKey === ns ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <Copy className="text-muted-foreground group-hover:text-foreground size-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-muted-foreground flex items-center gap-2">
              <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
              <span>Propagation: 100% Synced</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Zone File Export Card (Collapsible) */}
      {isZoneFileOpen && (
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold sm:text-base">BIND RFC 1035 Zone File</CardTitle>
                <CardDescription className="text-xs">
                  Complete DNS zone mapping for {domain} ready for import into Route53, Bind9, or Cloudflare.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-7"
                aria-label="Close zone file viewer"
                onClick={() => setIsZoneFileOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="relative">
              <pre className="border-border bg-muted/70 text-foreground max-h-56 overflow-x-auto rounded-lg border p-3 font-mono text-xs leading-relaxed select-all">
                {zoneFileContent}
              </pre>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => copyText('zone-file', zoneFileContent)}
              >
                {copiedKey === 'zone-file' ? (
                  <Check className="size-3.5 text-emerald-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copiedKey === 'zone-file' ? 'Copied Zone File' : 'Copy Zone Content'}
              </Button>
              <Button
                aria-label="Download attachment"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={downloadZoneFile}
              >
                <Download className="size-3.5" />
                Download .zone File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add / Edit DNS Record Card */}
      {isAddOpen && (
        <Card className="border-primary/30 bg-muted/20 shadow-xs">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  {editingId ? 'Edit DNS Record' : 'Add New DNS Record'}
                </CardTitle>
                <CardDescription className="text-xs">
                  {editingId
                    ? 'Update configuration, target destination, or edge proxy status.'
                    : `Configure host routing, MX exchangers, or verification TXT tags for ${domain}.`}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-7"
                aria-label="Cancel record form"
                onClick={cancelForm}
              >
                <X className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
              {/* Type Select */}
              <div className="sm:col-span-3">
                <label htmlFor="dns-type" className="text-foreground mb-1.5 block text-xs font-medium">
                  Type
                </label>
                <Select value={formType} onValueChange={(val) => handleTypeChange(val as DnsRecordType)}>
                  <SelectTrigger id="dns-type" className="w-full [&_svg]:shrink-0 [&>span]:truncate">
                    <SelectValue placeholder="Record type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A (IPv4 Address)</SelectItem>
                    <SelectItem value="AAAA">AAAA (IPv6 Address)</SelectItem>
                    <SelectItem value="CNAME">CNAME (Canonical Alias)</SelectItem>
                    <SelectItem value="MX">MX (Mail Exchanger)</SelectItem>
                    <SelectItem value="TXT">TXT (Text Record)</SelectItem>
                    <SelectItem value="CAA">CAA (Cert Authority)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Name Input */}
              <div className="sm:col-span-5">
                <label htmlFor="dns-name" className="text-foreground mb-1.5 block text-xs font-medium">
                  Name / Subdomain <span className="text-muted-foreground font-normal">(@ for root)</span>
                </label>
                <Input
                  id="dns-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="@ or subdomain"
                  className="font-mono text-xs"
                />
              </div>

              {/* TTL Select */}
              <div className="sm:col-span-4">
                <label htmlFor="dns-ttl" className="text-foreground mb-1.5 block text-xs font-medium">
                  TTL
                </label>
                <Select value={formTtl} onValueChange={setFormTtl}>
                  <SelectTrigger id="dns-ttl" className="w-full [&_svg]:shrink-0 [&>span]:truncate">
                    <SelectValue placeholder="TTL" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Auto">Auto (Automatic)</SelectItem>
                    <SelectItem value="60s">1 min (60s)</SelectItem>
                    <SelectItem value="300s">5 mins (300s)</SelectItem>
                    <SelectItem value="1800s">30 mins (1800s)</SelectItem>
                    <SelectItem value="3600s">1 hour (3600s)</SelectItem>
                    <SelectItem value="86400s">1 day (86400s)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className={cn('grid grid-cols-1 gap-3', formType === 'MX' ? 'sm:grid-cols-12' : '')}>
              {/* Content / Target Input */}
              <div className={formType === 'MX' ? 'sm:col-span-9' : 'w-full'}>
                <label htmlFor="dns-content" className="text-foreground mb-1.5 block text-xs font-medium">
                  {formType === 'A'
                    ? 'IPv4 Address'
                    : formType === 'AAAA'
                      ? 'IPv6 Address'
                      : formType === 'CNAME'
                        ? 'Target Domain'
                        : formType === 'MX'
                          ? 'Mail Server Hostname'
                          : formType === 'TXT'
                            ? 'TXT Content / Value'
                            : 'Target / Tag Value'}
                </label>
                <Input
                  id="dns-content"
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder={placeholderMap[formType]}
                  className="font-mono text-xs"
                />
              </div>

              {/* Priority Input for MX */}
              {formType === 'MX' && (
                <div className="sm:col-span-3">
                  <label htmlFor="dns-priority" className="text-foreground mb-1.5 block text-xs font-medium">
                    Priority
                  </label>
                  <Input
                    id="dns-priority"
                    type="number"
                    min={0}
                    max={65535}
                    value={formPriority}
                    onChange={(e) => setFormPriority(Number(e.target.value))}
                    placeholder="10"
                    className="font-mono text-xs"
                  />
                </div>
              )}
            </div>

            {/* Optional Comment */}
            <div>
              <label htmlFor="dns-comment" className="text-foreground mb-1.5 block text-xs font-medium">
                Comment <span className="text-muted-foreground font-normal">(optional note)</span>
              </label>
              <Input
                id="dns-comment"
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                placeholder="e.g. Production ingress or verification tag"
                className="text-xs"
              />
            </div>

            {/* Proxy Switch (for A, AAAA, CNAME) */}
            {['A', 'AAAA', 'CNAME'].includes(formType) && (
              <div className="border-border bg-background/80 flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Cloud className="size-4 text-amber-500" />
                    <span className="text-foreground text-xs font-medium">Proxy Status</span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {formProxied
                      ? 'Proxied: Accelerate traffic and protect origin IP behind Cloudflare edge.'
                      : 'DNS only: Direct traffic route without edge proxy caching.'}
                  </p>
                </div>
                <Switch id="proxy-toggle" checked={formProxied} onCheckedChange={setFormProxied} />
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={cancelForm}>
                Cancel
              </Button>
              <Button size="sm" className="h-8 text-xs" disabled={!formContent.trim()} onClick={saveRecord}>
                {editingId ? 'Update Record' : 'Save Record'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DNS Records Management Section */}
      <div className="space-y-3">
        {/* Toolbar Filter & Search */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search records by name, target, or content..."
              className="h-8.5 pl-8 text-xs"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              className={cn(
                'min-h-6 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                selectedTypeFilter === 'ALL'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
              onClick={() => setSelectedTypeFilter('ALL')}
            >
              All ({records.length})
            </button>
            {(['A', 'CNAME', 'MX', 'TXT', 'AAAA', 'CAA'] as DnsRecordType[]).map((t) => (
              <button
                key={t}
                type="button"
                className={cn(
                  'min-h-6 min-w-6 rounded-md px-2 py-1 font-mono text-xs font-medium transition-colors',
                  selectedTypeFilter === t
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                onClick={() => setSelectedTypeFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* DNS Records Table */}
        <div className="border-border bg-card overflow-hidden rounded-lg border shadow-xs">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-24">Type</TableHead>
                  <TableHead className="min-w-[140px]">Name</TableHead>
                  <TableHead className="min-w-[240px]">Target Content</TableHead>
                  <TableHead className="w-28 text-center">Proxy Status</TableHead>
                  <TableHead className="w-20">TTL</TableHead>
                  <TableHead className="w-12 text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow
                    key={record.id}
                    className={cn(
                      'hover:bg-muted/30 transition-colors',
                      editingId === record.id ? 'bg-primary/5' : undefined,
                    )}
                  >
                    {/* Record Type Badge */}
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-mono text-xs font-bold',
                          typeBadgeStyles[record.type].bg,
                          typeBadgeStyles[record.type].text,
                          typeBadgeStyles[record.type].border,
                        )}
                      >
                        {record.type}
                      </span>
                    </TableCell>

                    {/* Name & Hostname helper */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-foreground font-mono text-xs font-semibold">{record.name}</span>
                        <span className="text-muted-foreground truncate font-mono text-xs">
                          {resolveHostname(record.name)}
                        </span>
                      </div>
                    </TableCell>

                    {/* Target Content with Copy button */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            {record.type === 'MX' && (
                              <span className="border-border bg-muted text-muted-foreground rounded px-1 font-mono text-xs">
                                Pri {record.priority}
                              </span>
                            )}
                            <code className="text-foreground/90 font-mono text-xs break-all select-all">
                              {record.content}
                            </code>
                          </div>
                          {record.comment && (
                            <p className="text-muted-foreground mt-0.5 truncate text-xs">{record.comment}</p>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:text-foreground size-7 shrink-0"
                          aria-label={`Copy content for ${record.name}`}
                          onClick={() => copyText(record.id, record.content)}
                        >
                          {copiedKey === record.id ? (
                            <Check className="size-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </Button>
                      </div>
                    </TableCell>

                    {/* Proxy Status Switch / Cloud badge */}
                    <TableCell className="text-center">
                      {['A', 'AAAA', 'CNAME'].includes(record.type) ? (
                        <div className="flex justify-center">
                          <button
                            type="button"
                            aria-label={`Toggle proxy status for ${record.name}, currently ${record.proxied ? 'proxied' : 'dns only'}`}
                            className={cn(
                              'group inline-flex min-h-6 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus-visible:ring-[2px] focus-visible:outline-none',
                              record.proxied
                                ? 'border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400'
                                : 'border-border bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
                            )}
                            onClick={() => toggleProxy(record.id)}
                          >
                            {record.proxied ? (
                              <Cloud className="size-3.5 fill-amber-500 text-amber-500" />
                            ) : (
                              <CloudOff className="text-muted-foreground group-hover:text-foreground size-3.5" />
                            )}
                            <span>{record.proxied ? 'Proxied' : 'DNS only'}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <span className="text-muted-foreground/60 inline-flex items-center gap-1 font-mono text-xs">
                            <CloudOff className="size-3" />
                            DNS only
                          </span>
                        </div>
                      )}
                    </TableCell>

                    {/* TTL Badge */}
                    <TableCell>
                      <Badge variant="outline" className="border-border bg-muted/40 font-mono text-xs font-normal">
                        {record.ttl}
                      </Badge>
                    </TableCell>

                    {/* Row Actions Dropdown */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" className="text-muted-foreground size-7 p-0">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open record actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => startEdit(record)}>
                            <Edit2 className="mr-2 size-3.5" />
                            Edit Record
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyText(record.id, record.content)}>
                            <Copy className="mr-2 size-3.5" />
                            Copy Target
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              copyText(`${record.id}-bind`, `${record.name} IN ${record.type} ${record.content}`)
                            }
                          >
                            <FileCode className="mr-2 size-3.5" />
                            Copy BIND Row
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => deleteRecord(record.id)}
                          >
                            <Trash2 className="mr-2 size-3.5" />
                            Delete Record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Empty State */}
                {filteredRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center gap-1.5 text-center">
                        <Globe className="text-muted-foreground/50 size-8" />
                        <p className="text-foreground text-sm font-medium">No DNS records found</p>
                        <p className="text-muted-foreground max-w-sm text-xs">
                          {searchQuery
                            ? 'No records match your search filter query.'
                            : 'No records configured for this domain yet. Add your first record to begin routing.'}
                        </p>
                        <Button size="sm" className="mt-2 h-7 gap-1 text-xs" onClick={startAdd}>
                          <Plus className="size-3" />
                          Add DNS Record
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Table Footer info */}
        <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
          <p>
            Showing <span className="text-foreground font-medium">{filteredRecords.length}</span> of{' '}
            <span className="text-foreground font-medium">{records.length}</span> configured records
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-500" />
              {records.filter((r) => r.proxied).length} Proxied
            </span>
            <span className="flex items-center gap-1.5">
              <span className="bg-muted-foreground size-2 rounded-full" />
              {records.filter((r) => !r.proxied).length} DNS Only
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
