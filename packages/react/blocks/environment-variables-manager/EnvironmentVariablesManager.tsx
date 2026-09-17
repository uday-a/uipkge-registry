'use client'

import * as React from 'react'
import {
  AlertCircle,
  Check,
  Copy,
  Download,
  Eye,
  EyeOff,
  FileCode,
  KeyRound,
  Lock,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

export type EnvironmentScope = 'production' | 'preview' | 'development'
export type EnvVarTypeFilter = 'all' | 'secret' | 'plain'

export interface EnvironmentVariable {
  id: string
  key: string
  value: string
  environments: EnvironmentScope[]
  isSecret: boolean
  updatedAt: string
  updatedBy: string
}

const defaultVariables: EnvironmentVariable[] = [
  {
    id: 'env-1',
    key: 'DATABASE_URL',
    value: 'postgresql://postgres:p4ssw0rd_secure_vault@db.prod.aws.internal:5432/primary_db',
    environments: ['production', 'preview', 'development'],
    isSecret: true,
    updatedAt: 'Updated 2h ago',
    updatedBy: 'alex.chen',
  },
  {
    id: 'env-2',
    key: 'STRIPE_SECRET_KEY',
    value: 'mock_key_51NwY2xK9mPqL8vR4tZa0bCeFgHiJkLmNoPqRsTuVwXyZ',
    environments: ['production'],
    isSecret: true,
    updatedAt: 'Updated 3d ago',
    updatedBy: 'sarah.dev',
  },
  {
    id: 'env-3',
    key: 'NEXT_PUBLIC_APP_URL',
    value: 'https://app.uipkge.dev',
    environments: ['production', 'preview', 'development'],
    isSecret: false,
    updatedAt: 'Updated 5d ago',
    updatedBy: 'uday.craft',
  },
  {
    id: 'env-4',
    key: 'REDIS_PASSWORD',
    value: 'redis_auth_98f4b6201e9d4a87b32c',
    environments: ['production', 'preview'],
    isSecret: true,
    updatedAt: 'Updated 1w ago',
    updatedBy: 'alex.chen',
  },
  {
    id: 'env-5',
    key: 'SENTRY_DSN',
    value: 'https://o45089@sentry.io/45089234871923',
    environments: ['production', 'preview', 'development'],
    isSecret: false,
    updatedAt: 'Updated 2w ago',
    updatedBy: 'sarah.dev',
  },
  {
    id: 'env-6',
    key: 'AWS_SECRET_ACCESS_KEY',
    value: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    environments: ['production'],
    isSecret: true,
    updatedAt: 'Updated 1mo ago',
    updatedBy: 'infra-bot',
  },
]

export interface EnvironmentVariablesManagerProps {
  initialVariables?: EnvironmentVariable[]
  initialAddOpen?: boolean
  initialImportOpen?: boolean
  defaultEnvironment?: 'all' | EnvironmentScope
  className?: string
}

function maskString(val: string): string {
  if (val.length <= 12) return '••••••••••••'
  return '••••••••••••••••••••'
}

export function EnvironmentVariablesManager({
  initialVariables,
  initialAddOpen = false,
  initialImportOpen = false,
  defaultEnvironment = 'all',
  className,
}: EnvironmentVariablesManagerProps) {
  const [variables, setVariables] = React.useState<EnvironmentVariable[]>(() =>
    initialVariables ? initialVariables.map((v) => ({ ...v })) : defaultVariables.map((v) => ({ ...v })),
  )

  const [activeTab, setActiveTab] = React.useState<'all' | EnvironmentScope>(defaultEnvironment)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<EnvVarTypeFilter>('all')
  const [revealAll, setRevealAll] = React.useState(false)
  const [revealedMap, setRevealedMap] = React.useState<Record<string, boolean>>({})

  const [isAddOpen, setIsAddOpen] = React.useState(initialAddOpen)
  const [isImportOpen, setIsImportOpen] = React.useState(initialImportOpen)
  const [editingVariable, setEditingVariable] = React.useState<EnvironmentVariable | null>(null)

  // Add variable state
  const [newKey, setNewKey] = React.useState('')
  const [newValue, setNewValue] = React.useState('')
  const [newIsSecret, setNewIsSecret] = React.useState(true)
  const [newEnvs, setNewEnvs] = React.useState<EnvironmentScope[]>(['production', 'preview', 'development'])

  // Import state
  const [importText, setImportText] = React.useState('')
  const [importEnvs, setImportEnvs] = React.useState<EnvironmentScope[]>(['production', 'preview', 'development'])
  const [importEncryptAll, setImportEncryptAll] = React.useState(true)

  // Copy state
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const copyTimer = React.useRef<number | undefined>(undefined)

  const filteredVariables = React.useMemo(() => {
    return variables.filter((item) => {
      // Environment filter
      if (activeTab !== 'all' && !item.environments.includes(activeTab)) {
        return false
      }

      // Type filter
      if (typeFilter === 'secret' && !item.isSecret) return false
      if (typeFilter === 'plain' && item.isSecret) return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const keyMatch = item.key.toLowerCase().includes(q)
        const authorMatch = item.updatedBy.toLowerCase().includes(q)
        if (!keyMatch && !authorMatch) return false
      }

      return true
    })
  }, [variables, activeTab, typeFilter, searchQuery])

  const counts = React.useMemo(() => {
    return {
      all: variables.length,
      production: variables.filter((v) => v.environments.includes('production')).length,
      preview: variables.filter((v) => v.environments.includes('preview')).length,
      development: variables.filter((v) => v.environments.includes('development')).length,
    }
  }, [variables])

  function isRevealed(id: string): boolean {
    if (revealAll) return true
    return Boolean(revealedMap[id])
  }

  function toggleReveal(id: string) {
    setRevealedMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function toggleRevealAll() {
    setRevealAll((prev) => {
      const next = !prev
      if (!next) setRevealedMap({})
      return next
    })
  }

  async function copyValue(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      window.clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => {
        setCopiedId(null)
      }, 1600)
    } catch {
      // Clipboard fallback
    }
  }

  function toggleNewEnv(env: EnvironmentScope) {
    setNewEnvs((prev) => {
      if (prev.includes(env)) {
        return prev.length > 1 ? prev.filter((e) => e !== env) : prev
      }
      return [...prev, env]
    })
  }

  function resetAddForm() {
    setNewKey('')
    setNewValue('')
    setNewIsSecret(true)
    setNewEnvs(['production', 'preview', 'development'])
    setIsAddOpen(false)
  }

  function handleAddVariable() {
    const key = newKey.trim().toUpperCase()
    const val = newValue.trim()
    if (!key || !val) return

    const newVar: EnvironmentVariable = {
      id: `env-${Date.now()}`,
      key,
      value: val,
      environments: [...newEnvs],
      isSecret: newIsSecret,
      updatedAt: 'Just now',
      updatedBy: 'you',
    }

    setVariables((prev) => [newVar, ...prev])
    resetAddForm()
  }

  function handleDuplicate(item: EnvironmentVariable) {
    const duplicateVar: EnvironmentVariable = {
      ...item,
      id: `env-${Date.now()}`,
      key: `${item.key}_COPY`,
      updatedAt: 'Just now',
      updatedBy: 'you',
    }
    setVariables((prev) => {
      const index = prev.findIndex((v) => v.id === item.id)
      if (index >= 0) {
        const next = [...prev]
        next.splice(index + 1, 0, duplicateVar)
        return next
      }
      return [duplicateVar, ...prev]
    })
  }

  function handleDelete(id: string) {
    setVariables((prev) => prev.filter((v) => v.id !== id))
  }

  function openEdit(item: EnvironmentVariable) {
    setEditingVariable({
      ...item,
      environments: [...item.environments],
    })
  }

  function saveEdit() {
    if (!editingVariable) return
    const key = editingVariable.key.trim().toUpperCase()
    const val = editingVariable.value.trim()
    if (!key || !val) return

    setVariables((prev) =>
      prev.map((v) =>
        v.id === editingVariable.id
          ? {
              ...editingVariable,
              key,
              value: val,
              updatedAt: 'Just now',
              updatedBy: 'you',
            }
          : v,
      ),
    )
    setEditingVariable(null)
  }

  function toggleEditEnv(env: EnvironmentScope) {
    if (!editingVariable) return
    const current = editingVariable.environments
    const next = current.includes(env)
      ? current.length > 1
        ? current.filter((e) => e !== env)
        : current
      : [...current, env]
    setEditingVariable({ ...editingVariable, environments: next })
  }

  function toggleImportEnv(env: EnvironmentScope) {
    setImportEnvs((prev) => {
      if (prev.includes(env)) {
        return prev.length > 1 ? prev.filter((e) => e !== env) : prev
      }
      return [...prev, env]
    })
  }

  const parsedImportItems = React.useMemo(() => {
    if (!importText.trim()) return []
    const lines = importText.split('\n')
    const results: { key: string; value: string; isSecret: boolean }[] = []

    for (const rawLine of lines) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const eqIdx = line.indexOf('=')
      if (eqIdx > 0) {
        const k = line.slice(0, eqIdx).trim().toUpperCase()
        let v = line.slice(eqIdx + 1).trim()
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.slice(1, -1)
        }
        if (k) {
          const isSecret =
            importEncryptAll ||
            k.includes('SECRET') ||
            k.includes('KEY') ||
            k.includes('PASSWORD') ||
            k.includes('TOKEN') ||
            k.includes('PRIVATE') ||
            k.includes('AUTH')
          results.push({ key: k, value: v, isSecret })
        }
      }
    }
    return results
  }, [importText, importEncryptAll])

  function handleImport() {
    const items = parsedImportItems
    if (items.length === 0) return

    const newVars: EnvironmentVariable[] = items.map((item, index) => ({
      id: `env-imported-${Date.now()}-${index}`,
      key: item.key,
      value: item.value,
      environments: [...importEnvs],
      isSecret: item.isSecret,
      updatedAt: 'Imported just now',
      updatedBy: 'you',
    }))

    setVariables((prev) => [...newVars, ...prev])
    setImportText('')
    setIsImportOpen(false)
  }

  function exportEnvFile() {
    const lines = variables.map((v) => `# ${v.environments.join(', ')}\n${v.key}=${v.value}`)
    const blob = new Blob([lines.join('\n\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '.env.production'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div data-slot="environment-variables-manager" className={cn('w-full space-y-6', className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 text-primary grid size-8 place-items-center rounded-lg border">
              <KeyRound className="size-4" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Environment Variables</h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage encrypted secrets, API keys, and configuration for your deployments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 shadow-xs" onClick={() => setIsImportOpen(true)}>
            <Upload className="size-3.5" />
            <span>Import .env</span>
          </Button>
          <Button
            aria-label="Download attachment"
            variant="outline"
            size="sm"
            className="gap-1.5 shadow-xs"
            onClick={exportEnvFile}
          >
            <Download className="size-3.5" />
            <span>Export</span>
          </Button>
          <Button
            size="sm"
            className="gap-1.5 shadow-xs"
            variant={isAddOpen ? 'secondary' : 'default'}
            onClick={() => setIsAddOpen(!isAddOpen)}
          >
            {!isAddOpen ? <Plus className="size-4" /> : <X className="size-4" />}
            <span>{isAddOpen ? 'Close Form' : 'Add Variable'}</span>
          </Button>
        </div>
      </div>

      {/* Add Variable Expandable Card */}
      {isAddOpen && (
        <Card className="border-primary/30 bg-card/60 relative shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">New Environment Variable</CardTitle>
                <CardDescription className="text-xs">
                  Add a new secret key or configuration parameter to your environment scopes.
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon-sm" aria-label="Cancel adding variable" onClick={resetAddForm}>
                <X className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-medium">Variable Key</label>
                <Input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="e.g. STRIPE_SECRET_KEY"
                  className="font-mono text-xs uppercase"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddVariable()}
                />
                <p className="text-muted-foreground text-xs">Uppercase characters and underscores recommended.</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-medium">Variable Value</label>
                <Input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  type={newIsSecret ? 'password' : 'text'}
                  placeholder="Enter secret token or value..."
                  className="font-mono text-xs"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddVariable()}
                />
                <p className="text-muted-foreground text-xs">Values are encrypted at rest with AES-256-GCM.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <span className="text-foreground text-xs font-medium">Environment Scopes</span>
                <div className="flex flex-wrap items-center gap-3">
                  <label
                    className={cn(
                      'hover:bg-accent/50 flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition-colors select-none',
                      newEnvs.includes('production') && 'border-emerald-500/40 bg-emerald-500/5',
                    )}
                  >
                    <Checkbox
                      checked={newEnvs.includes('production')}
                      onCheckedChange={() => toggleNewEnv('production')}
                    />
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">Production</span>
                  </label>
                  <label
                    className={cn(
                      'hover:bg-accent/50 flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition-colors select-none',
                      newEnvs.includes('preview') && 'border-blue-500/40 bg-blue-500/5',
                    )}
                  >
                    <Checkbox checked={newEnvs.includes('preview')} onCheckedChange={() => toggleNewEnv('preview')} />
                    <span className="font-medium text-blue-600 dark:text-blue-400">Preview</span>
                  </label>
                  <label
                    className={cn(
                      'hover:bg-accent/50 flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition-colors select-none',
                      newEnvs.includes('development') && 'border-purple-500/40 bg-purple-500/5',
                    )}
                  >
                    <Checkbox
                      checked={newEnvs.includes('development')}
                      onCheckedChange={() => toggleNewEnv('development')}
                    />
                    <span className="font-medium text-purple-600 dark:text-purple-400">Development</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="react-new-is-secret"
                  checked={newIsSecret}
                  onCheckedChange={(c) => setNewIsSecret(Boolean(c))}
                />
                <label htmlFor="react-new-is-secret" className="cursor-pointer text-xs font-medium select-none">
                  Encrypt as Secret
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t pt-3">
              <Button aria-label="Cancel adding variable" variant="ghost" size="sm" onClick={resetAddForm}>
                Cancel
              </Button>
              <Button size="sm" disabled={!newKey.trim() || !newValue.trim()} onClick={handleAddVariable}>
                Save Variable
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Environment Tabs & Search / Filter Controls */}
      <div className="space-y-3">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as 'all' | EnvironmentScope)}
          className="w-full"
        >
          <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
            <TabsTrigger value="all" className="text-xs">
              All Environments
              <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-xs font-semibold">
                {counts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="production" className="text-xs">
              Production
              <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-xs font-semibold">
                {counts.production}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">
              Preview
              <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-xs font-semibold">
                {counts.preview}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="development" className="text-xs">
              Development
              <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-xs font-semibold">
                {counts.development}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="relative max-w-sm min-w-[200px] flex-1">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search variables by key..."
                className="h-8.5 pl-8 text-xs shadow-xs"
              />
            </div>

            <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val as EnvVarTypeFilter)}>
              <SelectTrigger className="h-8.5 w-[140px] text-xs shadow-xs">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="secret">Encrypted Secrets</SelectItem>
                <SelectItem value="plain">Plaintext</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={cn('h-8.5 gap-1.5 text-xs shadow-xs', revealAll && 'border-primary text-primary')}
              onClick={toggleRevealAll}
            >
              {revealAll ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              <span>{revealAll ? 'Hide All' : 'Reveal All Values'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Variables Table */}
      <div className="bg-card overflow-hidden rounded-lg border shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-muted-foreground text-xs font-medium">Variable Key</TableHead>
                <TableHead className="text-muted-foreground text-xs font-medium">Value</TableHead>
                <TableHead className="text-muted-foreground text-xs font-medium">Environments</TableHead>
                <TableHead className="text-muted-foreground text-xs font-medium">Type</TableHead>
                <TableHead className="text-muted-foreground hidden text-xs font-medium md:table-cell">
                  Updated
                </TableHead>
                <TableHead className="w-[70px] text-right text-xs font-medium">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVariables.map((item) => (
                <TableRow key={item.id} className="group hover:bg-muted/30 transition-colors">
                  {/* Key */}
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-mono text-xs font-semibold tracking-tight select-all sm:text-sm">
                        {item.key}
                      </span>
                      <button
                        type="button"
                        aria-label="Copy variable key"
                        className="text-muted-foreground hover:text-foreground opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                        onClick={() => copyValue(item.key, `key-${item.id}`)}
                      >
                        {copiedId === `key-${item.id}` ? (
                          <Check className="text-success size-3.5" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    </div>
                  </TableCell>

                  {/* Value Mask / Plain */}
                  <TableCell className="py-3.5">
                    <div className="flex max-w-[280px] items-center gap-1.5 sm:max-w-xs md:max-w-sm">
                      <code
                        className="bg-muted/60 text-foreground max-w-[200px] min-w-0 truncate rounded border px-2 py-1 font-mono text-xs sm:max-w-[240px]"
                        title={isRevealed(item.id) ? item.value : 'Masked secret value'}
                      >
                        {isRevealed(item.id) ? item.value : maskString(item.value)}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-muted-foreground hover:text-foreground size-7 shrink-0"
                        aria-label={isRevealed(item.id) ? 'Hide value' : 'Reveal value'}
                        onClick={() => toggleReveal(item.id)}
                      >
                        {isRevealed(item.id) ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-muted-foreground hover:text-foreground size-7 shrink-0"
                        aria-label={copiedId === item.id ? 'Copied' : 'Copy value'}
                        onClick={() => copyValue(item.value, item.id)}
                      >
                        {copiedId === item.id ? (
                          <Check className="text-success size-3.5" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  </TableCell>

                  {/* Environments */}
                  <TableCell className="py-3.5">
                    <div className="flex flex-wrap items-center gap-1">
                      {item.environments.includes('production') && (
                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 bg-emerald-500/10 px-2 py-0 text-xs font-medium text-emerald-700 dark:text-emerald-400"
                        >
                          Production
                        </Badge>
                      )}
                      {item.environments.includes('preview') && (
                        <Badge
                          variant="outline"
                          className="border-blue-500/30 bg-blue-500/10 px-2 py-0 text-xs font-medium text-blue-700 dark:text-blue-400"
                        >
                          Preview
                        </Badge>
                      )}
                      {item.environments.includes('development') && (
                        <Badge
                          variant="outline"
                          className="border-purple-500/30 bg-purple-500/10 px-2 py-0 text-xs font-medium text-purple-700 dark:text-purple-400"
                        >
                          Development
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* Type */}
                  <TableCell className="py-3.5">
                    {item.isSecret ? (
                      <Badge
                        variant="secondary"
                        className="gap-1 border-amber-500/30 bg-amber-500/10 px-2 py-0 text-xs font-medium text-amber-700 dark:text-amber-400"
                      >
                        <Lock className="size-3" />
                        Encrypted Secret
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground gap-1 px-2 py-0 text-xs font-medium">
                        <FileCode className="size-3" />
                        Plaintext
                      </Badge>
                    )}
                  </TableCell>

                  {/* Updated */}
                  <TableCell className="text-muted-foreground hidden py-3.5 text-xs whitespace-nowrap md:table-cell">
                    <span>{item.updatedAt}</span>
                    <span className="block text-xs opacity-75">by {item.updatedBy}</span>
                  </TableCell>

                  {/* Actions Dropdown */}
                  <TableCell className="py-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-muted-foreground hover:text-foreground size-8"
                        >
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Actions for {item.key}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 text-xs">
                        <DropdownMenuItem onClick={() => openEdit(item)}>
                          <Pencil className="mr-2 size-3.5" />
                          <span>Edit variable</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(item)}>
                          <Copy className="mr-2 size-3.5" />
                          <span>Duplicate</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyValue(item.value, item.id)}>
                          {copiedId === item.id ? (
                            <Check className="mr-2 size-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="mr-2 size-3.5" />
                          )}
                          <span>Copy value</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="mr-2 size-3.5" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}

              {/* Empty State */}
              {filteredVariables.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-44 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 py-6">
                      <div className="bg-muted text-muted-foreground grid size-10 place-items-center rounded-full border">
                        <AlertCircle className="size-5" />
                      </div>
                      <p className="text-foreground text-sm font-medium">No environment variables found</p>
                      <p className="text-muted-foreground max-w-xs text-xs">
                        {searchQuery || typeFilter !== 'all' || activeTab !== 'all'
                          ? 'Try adjusting your filters or search keywords.'
                          : 'Add your first environment secret or configuration key.'}
                      </p>
                      {!searchQuery && typeFilter === 'all' && activeTab === 'all' && (
                        <Button size="sm" className="mt-2 text-xs" onClick={() => setIsAddOpen(true)}>
                          <Plus className="mr-1.5 size-3.5" />
                          Add Variable
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Variable Dialog */}
      <Dialog open={Boolean(editingVariable)} onOpenChange={(open) => !open && setEditingVariable(null)}>
        {editingVariable && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Environment Variable</DialogTitle>
              <DialogDescription>Update variable value and configured environment scopes.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Variable Key</label>
                <Input
                  value={editingVariable.key}
                  onChange={(e) => setEditingVariable({ ...editingVariable, key: e.target.value })}
                  className="font-mono text-xs uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium">Variable Value</label>
                <Input
                  value={editingVariable.value}
                  onChange={(e) => setEditingVariable({ ...editingVariable, value: e.target.value })}
                  type={editingVariable.isSecret ? 'password' : 'text'}
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium">Environments</span>
                <div className="flex flex-wrap items-center gap-2">
                  <label
                    className={cn(
                      'hover:bg-accent/50 flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs select-none',
                      editingVariable.environments.includes('production') && 'border-emerald-500/40 bg-emerald-500/5',
                    )}
                  >
                    <Checkbox
                      checked={editingVariable.environments.includes('production')}
                      onCheckedChange={() => toggleEditEnv('production')}
                    />
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">Production</span>
                  </label>
                  <label
                    className={cn(
                      'hover:bg-accent/50 flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs select-none',
                      editingVariable.environments.includes('preview') && 'border-blue-500/40 bg-blue-500/5',
                    )}
                  >
                    <Checkbox
                      checked={editingVariable.environments.includes('preview')}
                      onCheckedChange={() => toggleEditEnv('preview')}
                    />
                    <span className="font-medium text-blue-600 dark:text-blue-400">Preview</span>
                  </label>
                  <label
                    className={cn(
                      'hover:bg-accent/50 flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs select-none',
                      editingVariable.environments.includes('development') && 'border-purple-500/40 bg-purple-500/5',
                    )}
                  >
                    <Checkbox
                      checked={editingVariable.environments.includes('development')}
                      onCheckedChange={() => toggleEditEnv('development')}
                    />
                    <span className="font-medium text-purple-600 dark:text-purple-400">Development</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Checkbox
                  id="react-edit-is-secret"
                  checked={editingVariable.isSecret}
                  onCheckedChange={(c) => setEditingVariable({ ...editingVariable, isSecret: Boolean(c) })}
                />
                <label htmlFor="react-edit-is-secret" className="cursor-pointer text-xs font-medium select-none">
                  Encrypt as Secret
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" size="sm" onClick={() => setEditingVariable(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={saveEdit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Import .env Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary grid size-7 place-items-center rounded-md border">
                <Upload className="size-3.5" />
              </div>
              <DialogTitle>Import .env File</DialogTitle>
            </div>
            <DialogDescription>
              Paste your raw .env, .env.local, or .env.production file contents to bulk add variables.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium">.env File Content</label>
              <Textarea
                value={importText}
                onValueChange={(v) => setImportText(v)}
                rows={6}
                placeholder="DATABASE_URL=postgresql://user:pass@host:5432/db&#10;STRIPE_SECRET_KEY=mock_key_...&#10;NEXT_PUBLIC_APP_URL=https://app.example.com"
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-medium">Assign to Environments</span>
              <div className="flex flex-wrap items-center gap-2">
                <label
                  className={cn(
                    'hover:bg-accent/50 flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs select-none',
                    importEnvs.includes('production') && 'border-emerald-500/40 bg-emerald-500/5',
                  )}
                >
                  <Checkbox
                    checked={importEnvs.includes('production')}
                    onCheckedChange={() => toggleImportEnv('production')}
                  />
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">Production</span>
                </label>
                <label
                  className={cn(
                    'hover:bg-accent/50 flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs select-none',
                    importEnvs.includes('preview') && 'border-blue-500/40 bg-blue-500/5',
                  )}
                >
                  <Checkbox
                    checked={importEnvs.includes('preview')}
                    onCheckedChange={() => toggleImportEnv('preview')}
                  />
                  <span className="font-medium text-blue-600 dark:text-blue-400">Preview</span>
                </label>
                <label
                  className={cn(
                    'hover:bg-accent/50 flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs select-none',
                    importEnvs.includes('development') && 'border-purple-500/40 bg-purple-500/5',
                  )}
                >
                  <Checkbox
                    checked={importEnvs.includes('development')}
                    onCheckedChange={() => toggleImportEnv('development')}
                  />
                  <span className="font-medium text-purple-600 dark:text-purple-400">Development</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="react-import-encrypt-all"
                checked={importEncryptAll}
                onCheckedChange={(c) => setImportEncryptAll(Boolean(c))}
              />
              <label htmlFor="react-import-encrypt-all" className="cursor-pointer text-xs font-medium select-none">
                Encrypt all variables by default
              </label>
            </div>

            {parsedImportItems.length > 0 && (
              <div className="bg-muted/60 flex items-center gap-2 rounded-md border px-3 py-2 text-xs">
                <ShieldCheck className="text-success size-4 shrink-0" />
                <span>
                  Ready to import <strong>{parsedImportItems.length}</strong> variable(s).
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setIsImportOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" disabled={parsedImportItems.length === 0} onClick={handleImport}>
              Import {parsedImportItems.length > 0 ? `(${parsedImportItems.length})` : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
