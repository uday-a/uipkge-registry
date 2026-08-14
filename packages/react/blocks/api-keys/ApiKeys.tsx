'use client'

import * as React from 'react'
import { Check, Copy, Eye, EyeOff, KeyRound, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionCard } from '@/components/ui/section-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export type ApiKeyEnvironment = 'production' | 'staging' | 'development'

export type ApiKeyStatus = 'active' | 'revoked' | 'expiring'

export interface ApiKeyItem {
  id: string
  name: string
  environment: ApiKeyEnvironment
  value: string
  createdAt: Date
  lastUsedAt: Date | null
  status: ApiKeyStatus
}

export interface ApiKeysProps {
  /** Replacement seed data. Pass [] to start from the empty state. */
  initialKeys?: ApiKeyItem[]
  initialCreateOpen?: boolean
  density?: 'default' | 'compact'
  className?: string
}

const statusMeta: Record<ApiKeyStatus, { label: string; variant: 'success' | 'warning' | 'destructive' }> = {
  active: { label: 'Active', variant: 'success' },
  expiring: { label: 'Expires soon', variant: 'warning' },
  revoked: { label: 'Revoked', variant: 'destructive' },
}

const environmentPrefix: Record<ApiKeyEnvironment, string> = {
  production: 'uipkge_live_',
  staging: 'sk_stg_',
  development: 'sk_dev_',
}

function maskKeyValue(value: string): string {
  const parts = value.split('_')
  const prefix = parts.length > 2 ? `${parts[0]}_${parts[1]}_` : ''
  return `${prefix}••••••••${value.slice(-4)}`
}

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function createStubKeys(now: Date): ApiKeyItem[] {
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000)
  return [
    {
      id: 'key-prod-server',
      name: 'Production server',
      environment: 'production',
      value: 'uipkge_live_51HxQp9mZvKYlo2C4f2a',
      createdAt: daysAgo(94),
      lastUsedAt: hoursAgo(2),
      status: 'active',
    },
    {
      id: 'key-ci-pipeline',
      name: 'CI pipeline (GitHub Actions)',
      environment: 'staging',
      value: 'sk_stg_6JdRw3nAwLZmp7xQb91e',
      createdAt: daysAgo(41),
      lastUsedAt: hoursAgo(26),
      status: 'active',
    },
    {
      id: 'key-mobile-backend',
      name: 'Mobile app backend',
      environment: 'production',
      value: 'uipkge_live_8KfSx1oCyUZiqw9Ma2b7',
      createdAt: daysAgo(27),
      lastUsedAt: hoursAgo(5),
      status: 'expiring',
    },
    {
      id: 'key-local-dev',
      name: 'Local development',
      environment: 'development',
      value: 'sk_dev_k2MnQ8tReFvBgy5Xc40d',
      createdAt: daysAgo(12),
      lastUsedAt: daysAgo(3),
      status: 'active',
    },
    {
      id: 'key-legacy-webhooks',
      name: 'Legacy webhook integration',
      environment: 'production',
      value: 'uipkge_live_2PvBgR6nTxAokdJe5f8c',
      createdAt: daysAgo(210),
      lastUsedAt: daysAgo(64),
      status: 'revoked',
    },
  ]
}

export function ApiKeys({ initialKeys, initialCreateOpen = false, density = 'default', className }: ApiKeysProps) {
  const [now] = React.useState(() => new Date())
  const [keys, setKeys] = React.useState<ApiKeyItem[]>(() =>
    initialKeys ? initialKeys.map((k) => ({ ...k })) : createStubKeys(now),
  )
  const [revealed, setRevealed] = React.useState<Record<string, boolean>>({})
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [confirmingId, setConfirmingId] = React.useState<string | null>(null)
  const [createOpen, setCreateOpen] = React.useState(initialCreateOpen)
  const [newName, setNewName] = React.useState('')
  const [newEnv, setNewEnv] = React.useState<ApiKeyEnvironment>('production')
  const copyTimer = React.useRef<number | undefined>(undefined)
  const confirmTimer = React.useRef<number | undefined>(undefined)

  const dense = density === 'compact'

  function lastUsedText(d: Date | null): string {
    if (!d) return 'Never'
    const minutes = Math.max(1, Math.round((now.getTime() - d.getTime()) / 60000))
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.round(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.round(hours / 24)}d ago`
  }

  function toggleRevealed(id: string) {
    setRevealed((r) => ({ ...r, [id]: !r[id] }))
  }

  async function copyKey(key: ApiKeyItem) {
    try {
      await navigator.clipboard.writeText(key.value)
      setCopiedId(key.id)
      window.clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => setCopiedId(null), 1600)
    } catch {
      // Clipboard unavailable (e.g. insecure context) — skip the feedback swap.
    }
  }

  function requestRevoke(id: string) {
    if (confirmingId === id) {
      revokeKey(id)
      return
    }
    setConfirmingId(id)
    window.clearTimeout(confirmTimer.current)
    confirmTimer.current = window.setTimeout(() => setConfirmingId(null), 3000)
  }

  function cancelRevoke(id: string) {
    if (confirmingId === id) {
      window.clearTimeout(confirmTimer.current)
      setConfirmingId(null)
    }
  }

  function revokeKey(id: string) {
    window.clearTimeout(confirmTimer.current)
    setConfirmingId(null)
    setKeys((ks) => ks.map((k) => (k.id === id ? { ...k, status: 'revoked' as const } : k)))
  }

  function openCreate() {
    setNewName('')
    setNewEnv('production')
    setCreateOpen(true)
  }

  function handleCreateOpenChange(open: boolean) {
    if (open) openCreate()
    else setCreateOpen(false)
  }

  function createKey() {
    const name = newName.trim()
    if (!name) return
    const random = Array.from({ length: 2 }, () => Math.random().toString(36).slice(2, 14)).join('')
    setKeys((ks) => [
      {
        id: `key-${Date.now()}`,
        name,
        environment: newEnv,
        value: `${environmentPrefix[newEnv]}${random}`,
        createdAt: new Date(),
        lastUsedAt: null,
        status: 'active',
      },
      ...ks,
    ])
    setCreateOpen(false)
  }

  return (
    <div data-slot="api-keys" className={cn('w-full', className)}>
      <SectionCard
        title="API Keys"
        description="Secret keys used to authenticate requests to your API."
        headerAction={
          <Button size="sm" onClick={openCreate}>
            <Plus className="size-4" />
            Create key
          </Button>
        }
      >
        {keys.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="bg-muted text-muted-foreground mx-auto grid size-12 place-items-center rounded-full">
              <KeyRound className="size-5" />
            </div>
            <p className="mt-3 text-sm font-medium">No API keys yet</p>
            <p className="text-muted-foreground mt-0.5 max-w-xs text-xs">
              Create a key to start authenticating requests against your API.
            </p>
            <Button size="sm" className="mt-4" onClick={openCreate}>
              Create your first key
            </Button>
          </div>
        ) : (
          <ul className="-my-4 divide-y">
            {keys.map((key) => (
              <li key={key.id} className={cn('flex items-center gap-3 sm:gap-4', dense ? 'py-2.5' : 'py-4')}>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{key.name}</p>
                    <Badge variant={statusMeta[key.status].variant}>{statusMeta[key.status].label}</Badge>
                  </div>
                  <p className="text-muted-foreground mt-0.5 truncate text-xs">
                    Created {formatDate(key.createdAt)} · Last used {lastUsedText(key.lastUsedAt)}
                  </p>
                </div>

                <code className="bg-muted hidden shrink-0 rounded px-2 py-1 font-mono text-xs md:block">
                  {revealed[key.id] ? key.value : maskKeyValue(key.value)}
                </code>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={revealed[key.id] ? 'Hide key value' : 'Reveal key value'}
                    onClick={() => toggleRevealed(key.id)}
                  >
                    {revealed[key.id] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={copiedId === key.id ? 'Copied' : 'Copy key value'}
                    onClick={() => copyKey(key)}
                  >
                    {copiedId === key.id ? (
                      <Check className="text-success size-4" />
                    ) : (
                      <Copy className="text-muted-foreground size-4" />
                    )}
                  </Button>
                  {key.status !== 'revoked' && (
                    <Button
                      size="sm"
                      variant={confirmingId === key.id ? 'destructive' : 'ghost'}
                      className={confirmingId === key.id ? undefined : 'text-muted-foreground hover:text-destructive'}
                      onClick={() => requestRevoke(key.id)}
                      onBlur={() => cancelRevoke(key.id)}
                    >
                      {confirmingId === key.id ? 'Confirm?' : 'Revoke'}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <Dialog open={createOpen} onOpenChange={handleCreateOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create API key</DialogTitle>
            <DialogDescription>
              Generate a new secret key. The full value is only shown once — store it somewhere safe.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <label htmlFor="api-key-name" className="text-sm leading-none font-medium">
                Name
              </label>
              <Input
                id="api-key-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Production server"
                onKeyDown={(e) => e.key === 'Enter' && createKey()}
              />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="api-key-environment" className="text-sm leading-none font-medium">
                Environment
              </label>
              <Select value={newEnv} onValueChange={(v) => setNewEnv(v as ApiKeyEnvironment)}>
                <SelectTrigger id="api-key-environment" className="w-full">
                  <SelectValue placeholder="Choose an environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!newName.trim()} onClick={createKey}>
              Create key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
