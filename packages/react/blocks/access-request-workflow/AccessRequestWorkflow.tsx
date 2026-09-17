'use client'

import * as React from 'react'
import {
  Check,
  Clock,
  Copy,
  FileText,
  History,
  Hourglass,
  KeyRound,
  Lock,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge, type BadgeVariants } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

export interface AccessRequest {
  id: string
  requester: {
    name: string
    email: string
    team: string
    avatar: string
  }
  targetRole: string
  system: string
  duration: string
  timeLeftLabel: string
  secondsLeft: number
  justification: string
  ticketId: string
  approver: string
  status: 'active' | 'pending' | 'expired' | 'rejected'
  createdAt: string
  expiresAt: string
}

export interface AccessRequestWorkflowProps {
  title?: string
  subtitle?: string
  className?: string
}

const initialRequests: AccessRequest[] = [
  {
    id: 'req-1',
    requester: {
      name: 'Elena Rostova',
      email: 'elena.rostova@acme.corp',
      team: 'SecOps Team',
      avatar: 'ER',
    },
    targetRole: 'AWS Production Admin',
    system: 'AWS Cloud IAM (us-east-1)',
    duration: '4 Hours',
    timeLeftLabel: '2h 45m left',
    secondsLeft: 9918,
    justification: 'Investigating latency spike on payment gateway for incident #SEC-849',
    ticketId: 'SEC-849',
    approver: 'Marcus Vance',
    status: 'active',
    createdAt: '1h 15m ago',
    expiresAt: 'Today at 16:30',
  },
  {
    id: 'req-2',
    requester: {
      name: 'Marcus Vance',
      email: 'marcus.vance@acme.corp',
      team: 'DevOps & Infra',
      avatar: 'MV',
    },
    targetRole: 'Production DB Read-Only',
    system: 'PostgreSQL Aurora Primary',
    duration: '1 Hour (Emergency)',
    timeLeftLabel: '48m left',
    secondsLeft: 2892,
    justification: 'Emergency replica query check during PostgreSQL failover testing',
    ticketId: 'INC-2044',
    approver: 'Sarah Chen',
    status: 'active',
    createdAt: '12m ago',
    expiresAt: 'Today at 14:15',
  },
  {
    id: 'req-3',
    requester: {
      name: 'Sarah Chen',
      email: 'sarah.chen@acme.corp',
      team: 'Core Platform',
      avatar: 'SC',
    },
    targetRole: 'Customer PII Decryption',
    system: 'Customer Data Vault (KMS)',
    duration: '8 Hours (1 Shift)',
    timeLeftLabel: 'Pending Approval',
    secondsLeft: 28800,
    justification: 'GDPR user deletion verification request #COMP-1102',
    ticketId: 'COMP-1102',
    approver: 'Marcus Vance',
    status: 'pending',
    createdAt: '10m ago',
    expiresAt: 'Awaiting approval',
  },
  {
    id: 'req-4',
    requester: {
      name: 'David Kim',
      email: 'david.kim@acme.corp',
      team: 'Fintech Systems',
      avatar: 'DK',
    },
    targetRole: 'Stripe Dashboard Full Access',
    system: 'Stripe Merchant Gateway',
    duration: '1 Hour (Emergency)',
    timeLeftLabel: 'Pending Approval',
    secondsLeft: 3600,
    justification: 'Refunding disputed charges for compromised merchant accounts',
    ticketId: 'FIN-582',
    approver: 'Marcus Vance',
    status: 'pending',
    createdAt: '25m ago',
    expiresAt: 'Awaiting approval',
  },
  {
    id: 'req-5',
    requester: {
      name: 'Alex Morgan',
      email: 'alex.m@acme.corp',
      team: 'Data Platform',
      avatar: 'AM',
    },
    targetRole: 'Production DB Read-Only',
    system: 'Snowflake Core Analytics',
    duration: '4 Hours',
    timeLeftLabel: 'Expired',
    secondsLeft: 0,
    justification: 'Quarterly compliance metrics export and audit schema migration verification',
    ticketId: 'AUD-309',
    approver: 'Elena Rostova',
    status: 'expired',
    createdAt: 'Yesterday',
    expiresAt: 'Expired at 18:00',
  },
]

function formatSeconds(seconds: number): string {
  if (seconds <= 0) return '00:00:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function getRoleBadgeVariant(role: string): BadgeVariants['variant'] {
  if (role.includes('AWS') || role.includes('Admin')) return 'destructive'
  if (role.includes('PII') || role.includes('Decryption')) return 'warning'
  if (role.includes('DB') || role.includes('Read-Only')) return 'info'
  if (role.includes('Stripe')) return 'secondary'
  return 'default'
}

export function AccessRequestWorkflow({
  title = 'Access Requests & Privilege Elevation',
  subtitle = 'Request temporary Just-In-Time production access with audit approval.',
  className,
}: AccessRequestWorkflowProps) {
  const [requests, setRequests] = React.useState<AccessRequest[]>(initialRequests)

  // Timer ticker for active sessions
  React.useEffect(() => {
    const timer = setInterval(() => {
      setRequests((prev) =>
        prev.map((req) => {
          if (req.status === 'active' && req.secondsLeft > 0) {
            const nextSec = req.secondsLeft - 1
            if (nextSec <= 0) {
              return {
                ...req,
                secondsLeft: 0,
                status: 'expired',
                timeLeftLabel: 'Expired',
              }
            }
            const h = Math.floor(nextSec / 3600)
            const m = Math.floor((nextSec % 3600) / 60)
            return {
              ...req,
              secondsLeft: nextSec,
              timeLeftLabel: h > 0 ? `${h}h ${m}m left` : `${m}m left`,
            }
          }
          return req
        }),
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Governance KPI stats
  const activeCount = React.useMemo(() => requests.filter((r) => r.status === 'active').length, [requests])
  const pendingCount = React.useMemo(() => requests.filter((r) => r.status === 'pending').length, [requests])
  const expiringCount = React.useMemo(
    () => requests.filter((r) => r.status === 'active' && r.secondsLeft <= 3600 * 4).length,
    [requests],
  )
  const total30Day = React.useMemo(() => 42 + requests.filter((r) => r.id.startsWith('req-custom')).length, [requests])

  // Modal Form State
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [formRole, setFormRole] = React.useState('AWS Production Admin')
  const [formDuration, setFormDuration] = React.useState('4 Hours')
  const [formApprover, setFormApprover] = React.useState('Security Lead: Marcus Vance')
  const [formJustification, setFormJustification] = React.useState(
    'Investigating latency spike on payment gateway for incident #SEC-849',
  )

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formJustification.trim()) return

    let seconds = 3600 * 4
    if (formDuration.includes('1 Hour')) seconds = 3600
    else if (formDuration.includes('8 Hours')) seconds = 3600 * 8
    else if (formDuration.includes('24 Hours')) seconds = 3600 * 24

    let system = 'AWS Cloud IAM (us-east-1)'
    if (formRole.includes('DB')) system = 'PostgreSQL Aurora Primary'
    else if (formRole.includes('Stripe')) system = 'Stripe Merchant Gateway'
    else if (formRole.includes('PII')) system = 'Customer Data Vault (KMS)'

    const newReq: AccessRequest = {
      id: `req-custom-${Date.now()}`,
      requester: {
        name: 'Current Operator (You)',
        email: 'operator@acme.corp',
        team: 'Platform Engineering',
        avatar: 'OP',
      },
      targetRole: formRole,
      system,
      duration: formDuration,
      timeLeftLabel: 'Pending Approval',
      secondsLeft: seconds,
      justification: formJustification,
      ticketId: `SEC-${Math.floor(100 + Math.random() * 900)}`,
      approver: formApprover,
      status: 'pending',
      createdAt: 'Just now',
      expiresAt: 'Awaiting approval',
    }

    setRequests((prev) => [newReq, ...prev])
    setIsDialogOpen(false)
  }

  // Table Filters
  const [selectedTab, setSelectedTab] = React.useState<'all' | 'pending' | 'active' | 'expired'>('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredRequests = React.useMemo(() => {
    return requests.filter((req) => {
      if (selectedTab !== 'all' && req.status !== selectedTab) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = req.requester.name.toLowerCase().includes(q)
        const matchRole = req.targetRole.toLowerCase().includes(q)
        const matchTicket = req.ticketId.toLowerCase().includes(q)
        const matchJust = req.justification.toLowerCase().includes(q)
        const matchSys = req.system.toLowerCase().includes(q)
        if (!matchName && !matchRole && !matchTicket && !matchJust && !matchSys) {
          return false
        }
      }
      return true
    })
  }, [requests, selectedTab, searchQuery])

  // Manager Actions
  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          const h = Math.floor(req.secondsLeft / 3600)
          const m = Math.floor((req.secondsLeft % 3600) / 60)
          return {
            ...req,
            status: 'active',
            timeLeftLabel: h > 0 ? `${h}h ${m}m left` : `${m}m left`,
          }
        }
        return req
      }),
    )
  }

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          return {
            ...req,
            status: 'rejected',
            timeLeftLabel: 'Rejected',
          }
        }
        return req
      }),
    )
  }

  const handleRevoke = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          return {
            ...req,
            status: 'expired',
            secondsLeft: 0,
            timeLeftLabel: 'Revoked',
          }
        }
        return req
      }),
    )
  }

  const handleExtend = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === id && req.status === 'active') {
          const nextSec = req.secondsLeft + 1800
          const h = Math.floor(nextSec / 3600)
          const m = Math.floor((nextSec % 3600) / 60)
          return {
            ...req,
            secondsLeft: nextSec,
            timeLeftLabel: h > 0 ? `${h}h ${m}m left` : `${m}m left`,
          }
        }
        return req
      }),
    )
  }

  const handleReRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          return {
            ...req,
            status: 'pending',
            timeLeftLabel: 'Pending Approval',
            secondsLeft: 3600 * 4,
          }
        }
        return req
      }),
    )
  }

  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const handleCopyToken = (id: string) => {
    setCopiedId(id)
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev))
    }, 2000)
  }

  return (
    <div data-slot="access-request-workflow" className={cn('flex flex-col gap-6', className)}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
              <KeyRound className="size-5" />
            </div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
        </div>

        {/* Request New Access Modal Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0 gap-2 shadow-xs">
              <Plus className="size-4" />
              Request New Access
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldAlert className="text-primary size-5" />
                Request Temporary Access
              </DialogTitle>
              <DialogDescription>
                Submit a Just-In-Time (JIT) access request with duration and business justification.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4 py-2" onSubmit={handleCreateRequest}>
              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-medium">Target System / Role</label>
                <Select value={formRole} onValueChange={setFormRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select target role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Production DB Read-Only">Production DB Read-Only</SelectItem>
                    <SelectItem value="AWS Production Admin">AWS Production Admin</SelectItem>
                    <SelectItem value="Stripe Dashboard Full Access">Stripe Dashboard Full Access</SelectItem>
                    <SelectItem value="Customer PII Decryption">Customer PII Decryption</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-medium">Access Duration</label>
                  <Select value={formDuration} onValueChange={setFormDuration}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 Hour (Emergency)">1 Hour (Emergency)</SelectItem>
                      <SelectItem value="4 Hours">4 Hours</SelectItem>
                      <SelectItem value="8 Hours (1 Shift)">8 Hours (1 Shift)</SelectItem>
                      <SelectItem value="24 Hours max">24 Hours max</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-foreground text-xs font-medium">Approver / Team</label>
                  <Select value={formApprover} onValueChange={setFormApprover}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select approver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Security Lead: Marcus Vance">Security Lead: Marcus Vance</SelectItem>
                      <SelectItem value="Infrastructure Team: Sarah Chen">Infrastructure Team: Sarah Chen</SelectItem>
                      <SelectItem value="Compliance Officer: Elena Rostova">
                        Compliance Officer: Elena Rostova
                      </SelectItem>
                      <SelectItem value="On-Call Lead: David Kim">On-Call Lead: David Kim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-medium">Business Justification</label>
                <Textarea
                  value={formJustification}
                  onValueChange={(v) => setFormJustification(v)}
                  placeholder="Investigating latency spike on payment gateway for incident #SEC-849"
                  rows={3}
                  className="resize-none text-xs"
                />
                <p className="text-muted-foreground text-xs">
                  All elevated actions are recorded and signed in the immutable IAM audit stream.
                </p>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-2">
                  <Send className="size-4" />
                  Submit Request
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 4 Access Governance KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/80 relative overflow-hidden shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Active Elevated Sessions</CardTitle>
            <div className="rounded-md bg-emerald-500/10 p-1.5 text-emerald-600 dark:text-emerald-400">
              <ShieldAlert className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">{activeCount}</div>
            <p className="text-muted-foreground mt-1 text-xs">Expiring within 8h</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 relative overflow-hidden shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Pending Approvals</CardTitle>
            <div className="rounded-md bg-amber-500/10 p-1.5 text-amber-600 dark:text-amber-400">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">{pendingCount}</div>
            <p className="text-muted-foreground mt-1 text-xs">Requires security lead review</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 relative overflow-hidden shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Requests Expiring Today</CardTitle>
            <div className="rounded-md bg-indigo-500/10 p-1.5 text-indigo-600 dark:text-indigo-400">
              <Hourglass className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">{expiringCount}</div>
            <p className="text-muted-foreground mt-1 text-xs">Auto-revocation armed</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 relative overflow-hidden shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">30-Day Total Requests</CardTitle>
            <div className="bg-primary/10 text-primary rounded-md p-1.5">
              <History className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">{total30Day}</div>
            <p className="text-muted-foreground mt-1 text-xs">98.2% compliance audit pass</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending & Active Requests Table Card */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="border-border/60 border-b pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-foreground text-base font-semibold">Privilege Escalation Queue</CardTitle>
              <CardDescription className="text-muted-foreground mt-0.5 text-xs">
                Review, approve, or reject active and pending privilege requests.
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative w-full sm:w-60">
                <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search requester, role, ticket..."
                  className="h-8 pl-8 text-xs"
                />
              </div>

              {/* Filter Tabs */}
              <div className="border-border bg-muted/40 flex items-center rounded-lg border p-0.5">
                <button
                  type="button"
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    selectedTab === 'all'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setSelectedTab('all')}
                >
                  All ({requests.length})
                </button>
                <button
                  type="button"
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    selectedTab === 'pending'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setSelectedTab('pending')}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  type="button"
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    selectedTab === 'active'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setSelectedTab('active')}
                >
                  Active ({activeCount})
                </button>
                <button
                  type="button"
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    selectedTab === 'expired'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setSelectedTab('expired')}
                >
                  Expired ({requests.filter((r) => r.status === 'expired' || r.status === 'rejected').length})
                </button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[220px] text-xs font-medium">Requester</TableHead>
                  <TableHead className="w-[200px] text-xs font-medium">Target Role & System</TableHead>
                  <TableHead className="w-[170px] text-xs font-medium">Duration & Timer</TableHead>
                  <TableHead className="min-w-[260px] text-xs font-medium">Business Justification</TableHead>
                  <TableHead className="w-[180px] text-xs font-medium">Status</TableHead>
                  <TableHead className="w-[160px] text-right text-xs font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground h-32 text-center text-xs">
                      No access requests match your filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((req) => (
                    <TableRow key={req.id} className="hover:bg-muted/30 transition-colors">
                      {/* Requester */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="border-border/60 size-8 border">
                            <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">
                              {req.requester.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="text-foreground truncate text-xs font-medium">{req.requester.name}</div>
                            <div className="text-muted-foreground truncate text-xs">{req.requester.email}</div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Target Role & System */}
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={getRoleBadgeVariant(req.targetRole)} className="w-fit text-xs font-medium">
                            {req.targetRole}
                          </Badge>
                          <span className="text-muted-foreground truncate text-xs">{req.system}</span>
                        </div>
                      </TableCell>

                      {/* Duration & Timer */}
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-foreground text-xs font-medium">{req.duration}</span>
                          {req.status === 'active' ? (
                            <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-600 tabular-nums dark:text-emerald-400">
                              <Clock className="size-3 shrink-0" />
                              <span>{formatSeconds(req.secondsLeft)}</span>
                            </div>
                          ) : req.status === 'pending' ? (
                            <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs tabular-nums">
                              <Clock className="size-3 shrink-0" />
                              <span>Awaiting start</span>
                            </div>
                          ) : (
                            <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs tabular-nums">
                              <Clock className="size-3 shrink-0" />
                              <span>Session ended</span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Business Justification */}
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="border-border bg-muted/60 text-foreground inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-xs font-medium">
                              #{req.ticketId}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              Approver:{' '}
                              {req.approver
                                .replace('Security Lead: ', '')
                                .replace('Infrastructure Team: ', '')
                                .replace('Compliance Officer: ', '')
                                .replace('On-Call Lead: ', '')}
                            </span>
                          </div>
                          <p className="text-muted-foreground line-clamp-2 text-xs" title={req.justification}>
                            {req.justification}
                          </p>
                        </div>
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell>
                        <div className="flex items-center">
                          {req.status === 'active' ? (
                            <Badge variant="success" className="gap-1.5 text-xs font-medium">
                              <span className="relative flex size-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                              </span>
                              <span>Active - {req.timeLeftLabel}</span>
                            </Badge>
                          ) : req.status === 'pending' ? (
                            <Badge variant="warning" className="gap-1.5 text-xs font-medium">
                              <span className="size-2 animate-pulse rounded-full bg-amber-500" />
                              <span>Pending Approval</span>
                            </Badge>
                          ) : req.status === 'expired' ? (
                            <Badge variant="secondary" className="text-muted-foreground gap-1.5 text-xs font-normal">
                              <span className="bg-muted-foreground/50 size-2 rounded-full" />
                              <span>Expired</span>
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1.5 text-xs font-normal">
                              <span className="size-2 rounded-full bg-red-400" />
                              <span>Rejected</span>
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Pending Actions */}
                          {req.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="h-7 gap-1 px-2.5 text-xs shadow-xs"
                                onClick={() => handleApprove(req.id)}
                              >
                                <Check className="size-3.5" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 gap-1 px-2 text-xs"
                                onClick={() => handleReject(req.id)}
                              >
                                <X className="size-3.5" />
                                Reject
                              </Button>
                            </>
                          )}

                          {/* Active Actions */}
                          {req.status === 'active' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive h-7 gap-1 px-2 text-xs"
                                onClick={() => handleRevoke(req.id)}
                              >
                                <Lock className="size-3.5" />
                                Revoke
                              </Button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="size-7">
                                    <MoreHorizontal className="size-3.5" />
                                    <span className="sr-only">More actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuLabel className="text-xs">Elevated Session</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleExtend(req.id)}>
                                    <Clock className="mr-2 size-3.5" />
                                    Extend 30 Minutes
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleCopyToken(req.id)}>
                                    <Copy className="mr-2 size-3.5" />
                                    {copiedId === req.id ? 'Copied Token!' : 'Copy Token'}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => handleRevoke(req.id)}
                                  >
                                    <ShieldAlert className="mr-2 size-3.5" />
                                    Revoke Immediately
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </>
                          )}

                          {/* Expired / Rejected Actions */}
                          {req.status !== 'pending' && req.status !== 'active' && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                                onClick={() => handleReRequest(req.id)}
                              >
                                Re-request
                              </Button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="size-7">
                                    <MoreHorizontal className="size-3.5" />
                                    <span className="sr-only">More actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                  <DropdownMenuItem onClick={() => handleReRequest(req.id)}>
                                    <History className="mr-2 size-3.5" />
                                    Request Again
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileText className="mr-2 size-3.5" />
                                    View Audit Log
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
