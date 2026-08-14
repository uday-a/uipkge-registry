'use client'

import * as React from 'react'
import {
  CheckCircle2,
  Clock,
  Globe,
  Laptop,
  LogOut,
  MapPin,
  Monitor,
  Radio,
  ShieldCheck,
  Smartphone,
  Tablet,
  Terminal,
  TriangleAlert,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export interface SessionDevice {
  id: string
  name: string
  deviceType: 'laptop' | 'desktop' | 'mobile' | 'tablet' | 'terminal'
  os: string
  browser: string
  location: string
  countryFlag: string
  ip: string
  signedInAt: string
  lastActive: string
  isMfa: boolean
  isSuspicious?: boolean
  customBadge?: {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'
  }
}

export interface SessionDeviceManagerProps {
  initialOtherSessions?: SessionDevice[]
  initialShowSuspiciousAlert?: boolean
  className?: string
}

const currentSession = {
  id: 'sess-current-01',
  name: 'MacBook Pro 16"',
  deviceType: 'laptop' as const,
  os: 'macOS Sequoia',
  browser: 'Chrome 128.0',
  location: 'San Francisco, CA, United States',
  countryFlag: '🇺🇸',
  ip: '76.76.21.21',
  signedInAt: 'Aug 18, 2026 · 09:42 AM',
  lastActive: 'Active right now',
  isMfa: true,
}

const stubOtherSessions: SessionDevice[] = [
  {
    id: 'sess-02',
    name: 'iPhone 16 Pro',
    deviceType: 'mobile',
    os: 'iOS 18.0',
    browser: 'Safari Mobile',
    location: 'Los Angeles, CA, United States',
    countryFlag: '🇺🇸',
    ip: '172.56.21.89',
    signedInAt: 'Aug 19, 2026',
    lastActive: '12m ago',
    isMfa: true,
  },
  {
    id: 'sess-03',
    name: 'Workstation',
    deviceType: 'desktop',
    os: 'Ubuntu 24.04 LTS',
    browser: 'Firefox 130',
    location: 'London, Greater London, United Kingdom',
    countryFlag: '🇬🇧',
    ip: '185.220.101.5',
    signedInAt: 'Aug 21, 2026',
    lastActive: '2h ago',
    isMfa: true,
    isSuspicious: true,
    customBadge: {
      label: 'New Location',
      variant: 'warning',
    },
  },
  {
    id: 'sess-04',
    name: 'CLI Token',
    deviceType: 'terminal',
    os: 'Darwin x64',
    browser: 'Node.js SDK',
    location: 'AWS us-east-1 (N. Virginia), United States',
    countryFlag: '🇺🇸',
    ip: '54.234.19.102',
    signedInAt: 'Aug 10, 2026',
    lastActive: '34m ago',
    isMfa: true,
    customBadge: {
      label: 'CLI Token',
      variant: 'secondary',
    },
  },
  {
    id: 'sess-05',
    name: 'iPad Air',
    deviceType: 'tablet',
    os: 'iPadOS 17.6',
    browser: 'Safari',
    location: 'New York, NY, United States',
    countryFlag: '🇺🇸',
    ip: '68.195.44.110',
    signedInAt: 'Aug 14, 2026',
    lastActive: '3d ago',
    isMfa: true,
  },
]

export function SessionDeviceManager({
  initialOtherSessions,
  initialShowSuspiciousAlert = true,
  className,
}: SessionDeviceManagerProps) {
  const [otherSessions, setOtherSessions] = React.useState<SessionDevice[]>(
    initialOtherSessions ? initialOtherSessions.map((s) => ({ ...s })) : stubOtherSessions.map((s) => ({ ...s })),
  )
  const [showSuspiciousAlert, setShowSuspiciousAlert] = React.useState(initialShowSuspiciousAlert)
  const [revokingAll, setRevokingAll] = React.useState(false)
  const [confirmingRevokeId, setConfirmingRevokeId] = React.useState<string | null>(null)
  const confirmTimerRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (confirmTimerRef.current) {
        window.clearTimeout(confirmTimerRef.current)
      }
    }
  }, [])

  const dismissAlert = () => {
    setShowSuspiciousAlert(false)
  }

  const revokeSuspicious = () => {
    setOtherSessions((prev) => prev.filter((s) => !s.isSuspicious))
    setShowSuspiciousAlert(false)
  }

  const revokeSession = (id: string) => {
    if (confirmTimerRef.current) {
      window.clearTimeout(confirmTimerRef.current)
    }
    setConfirmingRevokeId(null)
    setOtherSessions((prev) => {
      const target = prev.find((s) => s.id === id)
      if (target?.isSuspicious) {
        setShowSuspiciousAlert(false)
      }
      return prev.filter((s) => s.id !== id)
    })
  }

  const requestRevoke = (id: string) => {
    if (confirmingRevokeId === id) {
      revokeSession(id)
      return
    }
    setConfirmingRevokeId(id)
    if (confirmTimerRef.current) {
      window.clearTimeout(confirmTimerRef.current)
    }
    confirmTimerRef.current = window.setTimeout(() => {
      setConfirmingRevokeId(null)
    }, 3000)
  }

  const cancelRevoke = (id: string) => {
    if (confirmingRevokeId === id) {
      if (confirmTimerRef.current) {
        window.clearTimeout(confirmTimerRef.current)
      }
      setConfirmingRevokeId(null)
    }
  }

  const revokeAllOtherSessions = () => {
    setRevokingAll(true)
    setOtherSessions([])
    setShowSuspiciousAlert(false)
    window.setTimeout(() => {
      setRevokingAll(false)
    }, 600)
  }

  return (
    <div data-slot="session-device-manager" className={cn('mx-auto w-full max-w-4xl space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
            Active Sessions & Connected Devices
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Manage and revoke active login sessions across your desktop, mobile, and CLI tokens.
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          disabled={otherSessions.length === 0 || revokingAll}
          className="shrink-0"
          onClick={revokeAllOtherSessions}
        >
          <LogOut className="size-4" />
          Revoke All Other Sessions
        </Button>
      </div>

      {/* Suspicious Login Alert Banner */}
      {showSuspiciousAlert && (
        <div
          className="border-warning/30 bg-warning/10 text-foreground relative flex flex-col gap-3 rounded-lg border p-4 text-sm sm:flex-row sm:items-start sm:justify-between"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <div className="bg-warning/20 text-warning mt-0.5 grid size-8 shrink-0 place-items-center rounded-md">
              <TriangleAlert className="size-4" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-foreground font-semibold">Suspicious Login Detected</p>
                <Badge variant="warning" className="text-xs">
                  Is this you?
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Recent new login on <span className="text-foreground font-medium">Workstation · Firefox 130</span> from{' '}
                <span className="text-foreground font-medium">London, UK (IP 185.220.101.5)</span> on Aug 21, 2026. If
                you do not recognize this activity, revoke the session immediately.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:self-center">
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-8 text-xs"
              onClick={dismissAlert}
            >
              This was me
            </Button>
            <Button variant="destructive" size="sm" className="h-8 text-xs" onClick={revokeSuspicious}>
              Revoke Session
            </Button>
          </div>
        </div>
      )}

      {/* Current Session Hero Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">This Device</span>
              <Badge variant="success" className="gap-1.5 py-0.5 text-xs">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                Current Active Session
              </Badge>
            </div>
            <Badge variant="outline" className="text-muted-foreground gap-1 text-xs">
              <ShieldCheck className="text-success size-3.5" />
              2FA Verified
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3.5">
              <div className="border-border bg-muted/80 text-foreground flex size-11 shrink-0 items-center justify-center rounded-lg border shadow-xs">
                <Laptop className="size-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-foreground text-base font-semibold sm:text-lg">
                    {currentSession.name} · {currentSession.os}
                  </h3>
                </div>
                <p className="text-muted-foreground text-xs font-medium sm:text-sm">{currentSession.browser}</p>
              </div>
            </div>

            <div className="border-border bg-muted/40 text-muted-foreground flex items-center gap-1.5 self-start rounded-md border px-2.5 py-1 text-xs sm:self-auto">
              <Radio className="text-success size-3.5" />
              <span className="text-foreground font-medium">{currentSession.lastActive}</span>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-muted-foreground flex items-center gap-2">
              <MapPin className="text-foreground size-3.5 shrink-0" />
              <span className="truncate">
                {currentSession.countryFlag} {currentSession.location}
              </span>
            </div>

            <div className="text-muted-foreground flex items-center gap-2 font-mono">
              <Globe className="text-foreground size-3.5 shrink-0" />
              <span>IP: {currentSession.ip}</span>
            </div>

            <div className="text-muted-foreground flex items-center gap-2 sm:col-span-2 lg:col-span-1">
              <Clock className="text-foreground size-3.5 shrink-0" />
              <span>Signed in: {currentSession.signedInAt}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Active Sessions List */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-foreground text-base font-semibold sm:text-lg">
                Other Active Sessions
              </CardTitle>
              <CardDescription className="mt-1 text-xs sm:text-sm">
                {otherSessions.length} active session{otherSessions.length === 1 ? '' : 's'} authenticated across your
                secondary devices and automation workflows.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              {otherSessions.length} active
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {/* Empty State */}
          {otherSessions.length === 0 ? (
            <div className="border-border flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
              <div className="bg-muted text-muted-foreground grid size-11 place-items-center rounded-full">
                <CheckCircle2 className="text-success size-5" />
              </div>
              <p className="text-foreground mt-3 text-sm font-medium">No other active sessions</p>
              <p className="text-muted-foreground mt-1 max-w-sm text-xs">
                Your account is only signed in on this device. All previous mobile, workstation, and CLI sessions have
                been revoked.
              </p>
            </div>
          ) : (
            /* Sessions List */
            <ul className="divide-border -my-2 divide-y">
              {otherSessions.map((session) => (
                <li
                  key={session.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    {/* Device Icon */}
                    <div className="border-border bg-muted/60 text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg border shadow-xs">
                      {session.deviceType === 'mobile' ? (
                        <Smartphone className="size-4" />
                      ) : session.deviceType === 'desktop' ? (
                        <Monitor className="size-4" />
                      ) : session.deviceType === 'terminal' ? (
                        <Terminal className="size-4" />
                      ) : session.deviceType === 'tablet' ? (
                        <Tablet className="size-4" />
                      ) : (
                        <Laptop className="size-4" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-foreground truncate text-sm font-medium">
                          {session.name} · {session.browser}
                        </p>
                        <Badge variant="outline" className="gap-1 py-0 text-xs">
                          <ShieldCheck className="text-success size-3" />
                          2FA Verified
                        </Badge>
                        {session.customBadge && (
                          <Badge variant={session.customBadge.variant} className="text-xs">
                            {session.customBadge.label}
                          </Badge>
                        )}
                      </div>

                      <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 shrink-0" />
                          {session.countryFlag} {session.location}
                        </span>
                        <span>·</span>
                        <span className="font-mono">IP: {session.ip}</span>
                      </div>

                      <p className="text-muted-foreground text-xs">
                        Signed in {session.signedInAt} · Last active{' '}
                        <span className="text-foreground font-medium">{session.lastActive}</span>
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className={
                        confirmingRevokeId === session.id
                          ? 'bg-destructive hover:bg-destructive/90 border-transparent text-white'
                          : 'border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive'
                      }
                      onClick={() => requestRevoke(session.id)}
                      onBlur={() => cancelRevoke(session.id)}
                    >
                      {confirmingRevokeId === session.id ? 'Confirm Revoke?' : 'Revoke Session'}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SessionDeviceManager
