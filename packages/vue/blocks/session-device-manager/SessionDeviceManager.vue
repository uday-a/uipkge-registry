<script setup lang="ts">
import { ref } from 'vue'
import type { HTMLAttributes } from 'vue'
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
} from 'lucide-vue-next'
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

const props = withDefaults(
  defineProps<{
    initialOtherSessions?: SessionDevice[]
    initialShowSuspiciousAlert?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    initialOtherSessions: undefined,
    initialShowSuspiciousAlert: true,
  },
)

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

const otherSessions = ref<SessionDevice[]>(
  props.initialOtherSessions
    ? props.initialOtherSessions.map((s) => ({ ...s }))
    : stubOtherSessions.map((s) => ({ ...s })),
)

const showSuspiciousAlert = ref(props.initialShowSuspiciousAlert)
const revokingAll = ref(false)
const confirmingRevokeId = ref<string | null>(null)
let confirmTimer: number | undefined

function dismissAlert() {
  showSuspiciousAlert.value = false
}

function revokeSuspicious() {
  otherSessions.value = otherSessions.value.filter((s) => !s.isSuspicious)
  showSuspiciousAlert.value = false
}

function requestRevoke(id: string) {
  if (confirmingRevokeId.value === id) {
    revokeSession(id)
    return
  }
  confirmingRevokeId.value = id
  window.clearTimeout(confirmTimer)
  confirmTimer = window.setTimeout(() => {
    confirmingRevokeId.value = null
  }, 3000)
}

function cancelRevoke(id: string) {
  if (confirmingRevokeId.value === id) {
    window.clearTimeout(confirmTimer)
    confirmingRevokeId.value = null
  }
}

function revokeSession(id: string) {
  window.clearTimeout(confirmTimer)
  confirmingRevokeId.value = null
  const target = otherSessions.value.find((s) => s.id === id)
  if (target?.isSuspicious) {
    showSuspiciousAlert.value = false
  }
  otherSessions.value = otherSessions.value.filter((s) => s.id !== id)
}

function revokeAllOtherSessions() {
  revokingAll.value = true
  otherSessions.value = []
  showSuspiciousAlert.value = false
  setTimeout(() => {
    revokingAll.value = false
  }, 600)
}
</script>

<template>
  <div data-slot="session-device-manager" :class="cn('mx-auto w-full max-w-4xl space-y-6', props.class)">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <h2 class="text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
          Active Sessions & Connected Devices
        </h2>
        <p class="text-muted-foreground text-xs sm:text-sm">
          Manage and revoke active login sessions across your desktop, mobile, and CLI tokens.
        </p>
      </div>
      <Button
        variant="destructive"
        size="sm"
        :disabled="otherSessions.length === 0 || revokingAll"
        class="shrink-0"
        @click="revokeAllOtherSessions"
      >
        <LogOut class="size-4" />
        Revoke All Other Sessions
      </Button>
    </div>

    <!-- Suspicious Login Alert Banner -->
    <div
      v-if="showSuspiciousAlert"
      class="border-warning/30 bg-warning/10 text-foreground relative flex flex-col gap-3 rounded-lg border p-4 text-sm sm:flex-row sm:items-start sm:justify-between"
      role="alert"
    >
      <div class="flex items-start gap-3">
        <div class="bg-warning/20 text-warning mt-0.5 grid size-8 shrink-0 place-items-center rounded-md">
          <TriangleAlert class="size-4" />
        </div>
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-foreground font-semibold">Suspicious Login Detected</p>
            <Badge variant="warning" class="text-xs">Is this you?</Badge>
          </div>
          <p class="text-muted-foreground text-xs leading-relaxed">
            Recent new login on <span class="text-foreground font-medium">Workstation · Firefox 130</span> from
            <span class="text-foreground font-medium">London, UK (IP 185.220.101.5)</span> on Aug 21, 2026. If you do
            not recognize this activity, revoke the session immediately.
          </p>
        </div>
      </div>
      <div class="flex shrink-0 items-center gap-2 sm:self-center">
        <Button
          variant="outline"
          size="sm"
          class="text-muted-foreground hover:text-foreground h-8 text-xs"
          @click="dismissAlert"
        >
          This was me
        </Button>
        <Button variant="destructive" size="sm" class="h-8 text-xs" @click="revokeSuspicious"> Revoke Session </Button>
      </div>
    </div>

    <!-- Current Session Hero Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2.5">
            <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase"> This Device </span>
            <Badge variant="success" class="gap-1.5 py-0.5 text-xs">
              <span class="relative flex size-2">
                <span class="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75" />
                <span class="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Current Active Session
            </Badge>
          </div>
          <Badge variant="outline" class="text-muted-foreground gap-1 text-xs">
            <ShieldCheck class="text-success size-3.5" />
            2FA Verified
          </Badge>
        </div>
      </CardHeader>

      <CardContent class="space-y-4">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex items-start gap-3.5">
            <div
              class="border-border bg-muted/80 text-foreground flex size-11 shrink-0 items-center justify-center rounded-lg border shadow-xs"
            >
              <Laptop class="size-5" />
            </div>
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-foreground text-base font-semibold sm:text-lg">
                  {{ currentSession.name }} · {{ currentSession.os }}
                </h3>
              </div>
              <p class="text-muted-foreground text-xs font-medium sm:text-sm">
                {{ currentSession.browser }}
              </p>
            </div>
          </div>

          <div
            class="border-border bg-muted/40 text-muted-foreground flex items-center gap-1.5 self-start rounded-md border px-2.5 py-1 text-xs sm:self-auto"
          >
            <Radio class="text-success size-3.5" />
            <span class="text-foreground font-medium">{{ currentSession.lastActive }}</span>
          </div>
        </div>

        <Separator />

        <div class="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
          <div class="text-muted-foreground flex items-center gap-2">
            <MapPin class="text-foreground size-3.5 shrink-0" />
            <span class="truncate"> {{ currentSession.countryFlag }} {{ currentSession.location }} </span>
          </div>

          <div class="text-muted-foreground flex items-center gap-2 font-mono">
            <Globe class="text-foreground size-3.5 shrink-0" />
            <span>IP: {{ currentSession.ip }}</span>
          </div>

          <div class="text-muted-foreground flex items-center gap-2 sm:col-span-2 lg:col-span-1">
            <Clock class="text-foreground size-3.5 shrink-0" />
            <span>Signed in: {{ currentSession.signedInAt }}</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Other Active Sessions List -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle class="text-foreground text-base font-semibold sm:text-lg"> Other Active Sessions </CardTitle>
            <CardDescription class="mt-1 text-xs sm:text-sm">
              {{ otherSessions.length }} active session{{ otherSessions.length === 1 ? '' : 's' }} authenticated across
              your secondary devices and automation workflows.
            </CardDescription>
          </div>
          <Badge variant="secondary" class="font-mono text-xs"> {{ otherSessions.length }} active </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <!-- Empty State -->
        <div
          v-if="otherSessions.length === 0"
          class="border-border flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center"
        >
          <div class="bg-muted text-muted-foreground grid size-11 place-items-center rounded-full">
            <CheckCircle2 class="text-success size-5" />
          </div>
          <p class="text-foreground mt-3 text-sm font-medium">No other active sessions</p>
          <p class="text-muted-foreground mt-1 max-w-sm text-xs">
            Your account is only signed in on this device. All previous mobile, workstation, and CLI sessions have been
            revoked.
          </p>
        </div>

        <!-- Sessions List -->
        <ul v-else class="divide-border -my-2 divide-y">
          <li
            v-for="session in otherSessions"
            :key="session.id"
            class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex items-start gap-3">
              <!-- Device Icon -->
              <div
                class="border-border bg-muted/60 text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg border shadow-xs"
              >
                <Smartphone v-if="session.deviceType === 'mobile'" class="size-4" />
                <Monitor v-else-if="session.deviceType === 'desktop'" class="size-4" />
                <Terminal v-else-if="session.deviceType === 'terminal'" class="size-4" />
                <Tablet v-else-if="session.deviceType === 'tablet'" class="size-4" />
                <Laptop v-else class="size-4" />
              </div>

              <!-- Details -->
              <div class="min-w-0 space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <p class="text-foreground truncate text-sm font-medium">{{ session.name }} · {{ session.browser }}</p>
                  <Badge variant="outline" class="gap-1 py-0 text-xs">
                    <ShieldCheck class="text-success size-3" />
                    2FA Verified
                  </Badge>
                  <Badge v-if="session.customBadge" :variant="session.customBadge.variant" class="text-xs">
                    {{ session.customBadge.label }}
                  </Badge>
                </div>

                <div class="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span class="flex items-center gap-1">
                    <MapPin class="size-3 shrink-0" />
                    {{ session.countryFlag }} {{ session.location }}
                  </span>
                  <span>·</span>
                  <span class="font-mono">IP: {{ session.ip }}</span>
                </div>

                <p class="text-muted-foreground text-xs">
                  Signed in {{ session.signedInAt }} · Last active
                  <span class="text-foreground font-medium">{{ session.lastActive }}</span>
                </p>
              </div>
            </div>

            <!-- Action -->
            <div class="flex shrink-0 items-center gap-2 self-end sm:self-center">
              <Button
                variant="outline"
                size="sm"
                :class="
                  confirmingRevokeId === session.id
                    ? 'bg-destructive hover:bg-destructive/90 border-transparent text-white'
                    : 'text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive'
                "
                @click="requestRevoke(session.id)"
                @blur="cancelRevoke(session.id)"
              >
                {{ confirmingRevokeId === session.id ? 'Confirm Revoke?' : 'Revoke Session' }}
              </Button>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  </div>
</template>
