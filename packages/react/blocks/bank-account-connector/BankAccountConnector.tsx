'use client'

import * as React from 'react'
import { ArrowLeft, Building2, CheckCircle2, ExternalLink, Loader2, Lock, Search, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export interface BankInstitution {
  id: string
  name: string
  fullName: string
  tagline: string
}

export interface BankAccount {
  id: string
  name: string
  last4: string
  type: 'Checking' | 'Savings' | 'Credit'
  balance: string
  balanceLabel: string
  subtitle: string
}

export interface ConnectPayload {
  bankId: string
  bankName: string
  accountId: string
  accountName: string
  last4: string
  balance: string
}

export interface BankAccountConnectorProps {
  initialBankId?: string
  className?: string
  onConnect?: (payload: ConnectPayload) => void
  onCancel?: () => void
  onSelectBank?: (bankId: string) => void
}

const institutions: BankInstitution[] = [
  { id: 'chase', name: 'Chase', fullName: 'JPMorgan Chase Bank', tagline: 'Checking, Savings & Credit' },
  { id: 'bofa', name: 'Bank of America', fullName: 'Bank of America N.A.', tagline: 'Advantage Banking' },
  { id: 'wellsfargo', name: 'Wells Fargo', fullName: 'Wells Fargo Bank', tagline: 'Everyday & Way2Save' },
  { id: 'citibank', name: 'Citibank', fullName: 'Citibank N.A.', tagline: 'Citi Priority & Access' },
  { id: 'capitalone', name: 'Capital One', fullName: 'Capital One Bank', tagline: '360 Checking & Savings' },
  { id: 'svb', name: 'SVB', fullName: 'Silicon Valley Bank', tagline: 'Commercial & Startup Banking' },
]

const accounts: BankAccount[] = [
  {
    id: 'acc-chk-4892',
    name: 'Checking',
    last4: '4892',
    type: 'Checking',
    balance: '$14,250.00',
    balanceLabel: 'Available balance',
    subtitle: 'Primary checking account',
  },
  {
    id: 'acc-sav-9210',
    name: 'Savings',
    last4: '9210',
    type: 'Savings',
    balance: '$48,900.00',
    balanceLabel: 'Available balance',
    subtitle: 'High yield savings',
  },
  {
    id: 'acc-crd-1049',
    name: 'Business Credit',
    last4: '1049',
    type: 'Credit',
    balance: '$5,200.00',
    balanceLabel: 'Current balance',
    subtitle: 'Corporate credit line',
  },
]

function BankIcon({ id, className }: { id: string; className?: string }) {
  switch (id) {
    case 'chase':
      return (
        <svg
          data-slot="bank-account-connector"
          viewBox="0 0 24 24"
          className={cn('size-5 shrink-0 text-[#117ACA]', className)}
          fill="currentColor"
        >
          <path d="M12 2.5L7.5 7h4.8L16.2 3.1 12 2.5zm9.5 9.5L17 7.5v4.8l3.9 3.9.6-4.2zm-9.5 9.5L16.5 17h-4.8L7.8 20.9l4.2.6zm-9.5-9.5L7 16.5v-4.8L3.1 7.8 2.5 12z" />
        </svg>
      )
    case 'bofa':
      return (
        <svg viewBox="0 0 24 24" className={cn('size-5 shrink-0', className)} fill="none">
          <rect x="2" y="5" width="8" height="4" rx="1" fill="#E31837" />
          <rect x="2" y="10.5" width="8" height="4" rx="1" fill="#002D62" />
          <rect x="2" y="16" width="8" height="3" rx="0.5" fill="#E31837" />
          <rect x="14" y="5" width="8" height="4" rx="1" fill="#002D62" />
          <rect x="14" y="10.5" width="8" height="4" rx="1" fill="#E31837" />
          <rect x="14" y="16" width="8" height="3" rx="0.5" fill="#002D62" />
        </svg>
      )
    case 'wellsfargo':
      return (
        <svg viewBox="0 0 24 24" className={cn('size-5 shrink-0', className)} fill="none">
          <rect width="24" height="24" rx="4" fill="#D71E28" />
          <path d="M4 7h2.2l1.6 7 1.8-7h2.1l1.8 7 1.6-7H17.5l-2.6 10h-2.2l-1.8-7-1.8 7H7.1L4 7z" fill="#FFCC00" />
        </svg>
      )
    case 'citibank':
      return (
        <svg viewBox="0 0 24 24" className={cn('size-5 shrink-0', className)} fill="none">
          <path
            d="M12 4.5C8 4.5 4.5 6.8 4 9.5h2.5c.5-1.5 3-2.5 5.5-2.5s5 1 5.5 2.5H20c-.5-2.7-4-5-8-5z"
            fill="#EC111A"
          />
          <rect x="4" y="11" width="3" height="8" rx="0.5" fill="#003B70" />
          <circle cx="12" cy="15" r="4" fill="#003B70" />
          <rect x="17" y="11" width="3" height="8" rx="0.5" fill="#003B70" />
        </svg>
      )
    case 'capitalone':
      return (
        <svg viewBox="0 0 24 24" className={cn('size-5 shrink-0', className)} fill="none">
          <rect width="24" height="24" rx="4" fill="#004879" />
          <path d="M3.5 15.5C8 9.5 16 8 20.5 12c-5-2-12-1-15 3.5z" fill="#D03027" />
          <rect x="7" y="9" width="10" height="2" rx="1" fill="#FFFFFF" />
        </svg>
      )
    case 'svb':
      return (
        <svg viewBox="0 0 24 24" className={cn('size-5 shrink-0', className)} fill="none">
          <rect width="24" height="24" rx="4" fill="#005587" />
          <path d="M6 15l6-9 6 9-3 1.5-3-4.5-3 4.5L6 15z" fill="#FFFFFF" />
          <path d="M9 16.5l3-4.5 3 4.5-3 1.5-3-1.5z" fill="#00A3E0" />
        </svg>
      )
    default:
      return <Building2 className={cn('text-muted-foreground size-5', className)} />
  }
}

export function BankAccountConnector({
  initialBankId,
  className,
  onConnect,
  onCancel,
  onSelectBank,
}: BankAccountConnectorProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedBankId, setSelectedBankId] = React.useState<string | null>(initialBankId ?? null)
  const [selectedAccountId, setSelectedAccountId] = React.useState<string>('acc-chk-4892')
  const [isConnecting, setIsConnecting] = React.useState(false)
  const [isConnected, setIsConnected] = React.useState(false)

  React.useEffect(() => {
    if (initialBankId) {
      setSelectedBankId(initialBankId)
    }
  }, [initialBankId])

  const filteredInstitutions = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return institutions
    return institutions.filter((b) => b.name.toLowerCase().includes(query) || b.fullName.toLowerCase().includes(query))
  }, [searchQuery])

  const activeBank = React.useMemo(() => {
    if (!selectedBankId) return institutions[0]
    return (
      institutions.find((b) => b.id === selectedBankId) ?? {
        id: selectedBankId,
        name: searchQuery ? searchQuery : 'Custom Institution',
        fullName: 'Financial Institution',
        tagline: 'Direct Open Banking',
      }
    )
  }, [selectedBankId, searchQuery])

  const selectedAccount = React.useMemo(() => {
    return accounts.find((a) => a.id === selectedAccountId) ?? accounts[0]
  }, [selectedAccountId])

  function handleSelectBank(bankId: string) {
    setSelectedBankId(bankId)
    onSelectBank?.(bankId)
  }

  function handleConnect() {
    if (!selectedBankId) {
      setSelectedBankId(institutions[0].id)
      return
    }

    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
      onConnect?.({
        bankId: activeBank.id,
        bankName: activeBank.name,
        accountId: selectedAccount.id,
        accountName: selectedAccount.name,
        last4: selectedAccount.last4,
        balance: selectedAccount.balance,
      })
      setTimeout(() => {
        setIsConnected(false)
      }, 2500)
    }, 900)
  }

  function handleCancel() {
    if (selectedBankId && !initialBankId) {
      setSelectedBankId(null)
    }
    onCancel?.()
  }

  return (
    <Card className={cn('mx-auto w-full max-w-lg overflow-hidden border shadow-sm', className)}>
      <CardContent className="space-y-5 p-6">
        {/* Step 1: Institution Selection */}
        {!selectedBankId ? (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start gap-3.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-4 ring-emerald-500/5 dark:bg-emerald-950/50 dark:text-emerald-400">
                <Shield className="size-5" />
              </div>
              <div className="min-w-0 space-y-1">
                <h3 className="text-foreground text-base leading-tight font-semibold tracking-tight">
                  Connect your bank account
                </h3>
                <p className="text-muted-foreground text-xs">
                  Secure 256-bit encrypted connection powered by open banking.
                </p>
              </div>
            </div>

            {/* Search input */}
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefixIcon={<Search className="size-4" />}
                placeholder="Search institutions (e.g. Chase, Wells Fargo)..."
                className="text-sm"
              />
            </div>

            {/* Popular Institutions Grid */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Popular institutions
                </p>
                <span className="text-muted-foreground text-xs">10,000+ supported</span>
              </div>

              {filteredInstitutions.length > 0 ? (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {filteredInstitutions.map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      className="group border-border bg-card hover:border-primary/40 hover:bg-muted/40 focus-visible:ring-ring flex flex-col items-center justify-center rounded-xl border p-3.5 text-center transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                      onClick={() => handleSelectBank(bank.id)}
                    >
                      <div className="border-border/60 bg-muted/60 dark:bg-muted/30 mb-2 flex size-10 items-center justify-center rounded-lg border shadow-xs transition-transform group-hover:scale-105">
                        <BankIcon id={bank.id} />
                      </div>
                      <span className="text-foreground w-full truncate text-xs font-semibold">{bank.name}</span>
                      <span className="text-muted-foreground mt-0.5 w-full truncate text-xs">{bank.tagline}</span>
                    </button>
                  ))}
                </div>
              ) : (
                /* Direct search fallback */
                <div className="border-border rounded-xl border border-dashed p-4 text-center">
                  <p className="text-muted-foreground mb-2 text-xs">
                    No popular bank matched &ldquo;{searchQuery}&rdquo;. Connect via direct institution link:
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs"
                    onClick={() => handleSelectBank(searchQuery.toLowerCase().replace(/\s+/g, '-'))}
                  >
                    <Building2 className="text-muted-foreground size-3.5" />
                    Connect with {searchQuery}
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Step 2: Account Selection Step */
          <div className="space-y-5">
            {/* Back and Banner Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground -ml-2 h-7 gap-1 px-2 text-xs"
                  onClick={() => setSelectedBankId(null)}
                >
                  <ArrowLeft className="size-3.5" />
                  Back to banks
                </Button>
                <span className="text-muted-foreground font-mono text-xs">Step 2 of 2</span>
              </div>

              {/* Bank Banner */}
              <div className="border-border bg-muted/40 flex items-center justify-between rounded-xl border p-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="border-border/80 bg-background flex size-10 shrink-0 items-center justify-center rounded-lg border shadow-xs">
                    <BankIcon id={activeBank.id} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-foreground truncate text-sm font-semibold">
                      {activeBank.name} Checking &amp; Savings
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Connected</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground h-7 shrink-0 text-xs"
                  onClick={() => setSelectedBankId(null)}
                >
                  Change
                </Button>
              </div>
            </div>

            {/* Account Radio Cards */}
            <div className="space-y-2.5">
              <div className="space-y-1">
                <h4 className="text-foreground text-sm font-semibold">Select an account</h4>
                <p className="text-muted-foreground text-xs">
                  Choose the primary account to link for transactions and balance tracking.
                </p>
              </div>

              <div role="radiogroup" aria-label="Bank accounts" className="space-y-2">
                {accounts.map((account) => {
                  const isSelected = selectedAccountId === account.id
                  return (
                    <div
                      key={account.id}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                      className={cn(
                        'group focus-visible:ring-ring relative flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                        isSelected
                          ? 'border-primary bg-primary/5 ring-primary/20 shadow-xs ring-1'
                          : 'border-border bg-card hover:border-border/80 hover:bg-muted/30',
                      )}
                      onClick={() => setSelectedAccountId(account.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setSelectedAccountId(account.id)
                        }
                      }}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {/* Custom Radio Indicator */}
                        <div
                          className={cn(
                            'flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted-foreground/30 bg-background group-hover:border-muted-foreground/60',
                          )}
                        >
                          {isSelected && <div className="bg-primary-foreground size-1.5 rounded-full" />}
                        </div>

                        {/* Account Info */}
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-foreground truncate text-sm font-medium">{account.name}</span>
                            <span className="text-muted-foreground font-mono text-xs">•••• {account.last4}</span>
                            <Badge
                              variant={account.type === 'Credit' ? 'outline' : 'secondary'}
                              className="h-5 px-2 py-0 text-xs font-normal"
                            >
                              {account.type}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-xs">{account.subtitle}</p>
                        </div>
                      </div>

                      {/* Balance */}
                      <div className="shrink-0 pl-3 text-right">
                        <div className="text-foreground font-mono text-sm font-semibold tabular-nums">
                          {account.balance}
                        </div>
                        <div className="text-muted-foreground text-xs">{account.balanceLabel}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Security Footer */}
        <div className="space-y-4 pt-2">
          <Separator />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge
              variant="outline"
              className="text-muted-foreground border-border/80 gap-1.5 py-1 text-xs font-normal"
            >
              <Lock className="size-3 shrink-0 text-emerald-500" />
              <span>Encrypted with AES-256</span>
            </Badge>

            <a
              href="#"
              className="text-muted-foreground hover:text-foreground flex min-h-6 items-center gap-1 text-xs underline underline-offset-4 transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Privacy policy
              <ExternalLink className="size-3" />
            </a>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:items-center sm:justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-9 text-xs"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-9 text-xs font-medium"
              disabled={isConnecting || isConnected}
              onClick={handleConnect}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  Connecting…
                </>
              ) : isConnected ? (
                <>
                  <CheckCircle2 className="mr-1.5 size-3.5 text-emerald-400" />
                  Account Connected!
                </>
              ) : !selectedBankId ? (
                'Continue'
              ) : (
                'Connect Selected Account'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
