<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Eye,
  Flame,
  Inbox,
  Lock,
  Mail,
  Monitor,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Split,
  Terminal,
  UserCheck,
  Users,
  Zap,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
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
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
}

const props = defineProps<Props>()

// Campaign state
const campaignName = ref('Product Launch: UIPKGE 2.0 Global Release')
const selectedAudience = ref('active-devs')

// Subject line & Preheader state
const subjectA = ref('🚀 Introducing UIPKGE 2.0: The unbundled UI registry')
const subjectB = ref('Ship polished UIs 10x faster with UIPKGE 2.0 ⚡')
const previewText = ref('370+ production components with zero npm dependencies. Native Vue 3 & React code.')
const senderName = ref('UIPKGE Team')
const senderEmail = ref('updates@uipkge.dev')
const replyToEmail = ref('support@uipkge.dev')

// A/B testing state
const isAbTestEnabled = ref(false)
const activePreviewVariant = ref<'A' | 'B'>('A')

// Viewport state
type ViewportMode = 'desktop' | 'mobile'
const viewport = ref<ViewportMode>('desktop')

// Test Proof Dialog state
const isTestModalOpen = ref(false)
const testTargetEmail = ref('alex.developer@company.com')
const selectedClient = ref<'all' | 'gmail' | 'apple' | 'outlook'>('all')
const isSendingTest = ref(false)
const testSentSuccess = ref(false)

// Schedule Broadcast Dialog state
const isScheduleModalOpen = ref(false)
const scheduleTiming = ref<'optimal' | 'immediate' | 'custom'>('optimal')
const isScheduling = ref(false)
const scheduleSuccess = ref(false)

// Audience segment metadata
const audienceOptions = [
  {
    id: 'active-devs',
    label: 'All Active Developers (42,500 subscribers)',
    count: 42500,
    formattedCount: '42.5k',
    openRate: '38.4%',
    clickRate: '12.2%',
    deliverability: '99.9%',
  },
  {
    id: 'tech-leads',
    label: 'Enterprise Tech Leads (8,200 subscribers)',
    count: 8200,
    formattedCount: '8.2k',
    openRate: '46.1%',
    clickRate: '18.5%',
    deliverability: '99.8%',
  },
  {
    id: 'free-users',
    label: 'Free Plan Users (28,000 subscribers)',
    count: 28000,
    formattedCount: '28.0k',
    openRate: '31.2%',
    clickRate: '8.9%',
    deliverability: '99.7%',
  },
]

const currentAudience = computed(() => {
  return audienceOptions.find((item) => item.id === selectedAudience.value) ?? audienceOptions[0]
})

// Subject analysis
const currentActiveSubject = computed(() => {
  if (isAbTestEnabled.value && activePreviewVariant.value === 'B') {
    return subjectB.value
  }
  return subjectA.value
})

const subjectCharCount = computed(() => currentActiveSubject.value.length)
const preheaderCharCount = computed(() => previewText.value.length)

const emojiCount = computed(() => {
  const matches = currentActiveSubject.value.match(/\p{Extended_Pictographic}/gu)
  return matches ? matches.length : 0
})

// AI suggestions list
const aiSuggestions = [
  {
    text: '🚀 Introducing UIPKGE 2.0: The unbundled UI registry',
    score: 94,
    tag: 'High Open Rate Impact',
  },
  {
    text: 'Ship polished UIs 10x faster with UIPKGE 2.0 ⚡',
    score: 92,
    tag: 'Strong Action Verb',
  },
  {
    text: 'Zero npm dependencies: How UIPKGE 2.0 changes frontend dev',
    score: 89,
    tag: 'Curiosity Spike',
  },
]

function applyAiSubject(text: string) {
  if (isAbTestEnabled.value && activePreviewVariant.value === 'B') {
    subjectB.value = text
  } else {
    subjectA.value = text
  }
}

function handleSendTest() {
  if (!testTargetEmail.value) return
  isSendingTest.value = true
  testSentSuccess.value = false

  setTimeout(() => {
    isSendingTest.value = false
    testSentSuccess.value = true
    setTimeout(() => {
      testSentSuccess.value = false
      isTestModalOpen.value = false
    }, 1800)
  }, 800)
}

function handleScheduleBroadcast() {
  isScheduling.value = true
  scheduleSuccess.value = false

  setTimeout(() => {
    isScheduling.value = false
    scheduleSuccess.value = true
    setTimeout(() => {
      scheduleSuccess.value = false
      isScheduleModalOpen.value = false
    }, 1800)
  }, 900)
}
</script>

<template>
  <div data-slot="email-campaign-composer" :class="cn('w-full space-y-6', props.className)">
    <!-- Top Header Bar -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-4">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <!-- Campaign Title & Status Badge -->
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2.5">
              <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg shadow-xs">
                <Mail class="size-4" />
              </div>
              <h2 class="text-foreground text-lg font-semibold tracking-tight sm:text-xl">
                {{ campaignName }}
              </h2>
              <!-- Status Badge: Blue info styled -->
              <Badge
                variant="outline"
                class="gap-1.5 border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-600 dark:text-sky-400"
              >
                <span class="size-1.5 rounded-full bg-sky-500" />
                <span>Draft Saved · {{ currentAudience.formattedCount }} Recipients</span>
              </Badge>
            </div>
            <p class="text-muted-foreground text-xs">
              Configure campaign targeting, optimize open rates with AI scoring, and preview live multi-device inbox
              rendering.
            </p>
          </div>

          <!-- Top Actions: Send Test Proof & Schedule Broadcast -->
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Send Test Proof Dialog -->
            <Dialog v-model:open="isTestModalOpen">
              <DialogTrigger as-child>
                <Button variant="outline" size="sm" class="gap-1.5 text-xs font-medium">
                  <Mail class="text-muted-foreground size-3.5" />
                  <span>Send Test Proof</span>
                </Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle class="flex items-center gap-2 text-base">
                    <Mail class="text-primary size-4" />
                    Dispatch Test Proof
                  </DialogTitle>
                  <DialogDescription class="text-xs">
                    Send a full fidelity rendering test to inspect subject line, preheader, and layout across email
                    clients.
                  </DialogDescription>
                </DialogHeader>

                <div class="space-y-4 py-2">
                  <div class="space-y-1.5">
                    <label class="text-muted-foreground text-xs font-medium">Proof Recipient Address</label>
                    <Input
                      v-model="testTargetEmail"
                      type="email"
                      placeholder="alex.developer@company.com"
                      class="text-xs"
                      :disabled="isSendingTest"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label class="text-muted-foreground text-xs font-medium">Email Client Engine Simulation</label>
                    <div class="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        size="xs"
                        :variant="selectedClient === 'all' ? 'default' : 'outline'"
                        class="justify-start text-xs font-medium"
                        @click="selectedClient = 'all'"
                      >
                        🌐 All Clients (Auto)
                      </Button>
                      <Button
                        type="button"
                        size="xs"
                        :variant="selectedClient === 'gmail' ? 'default' : 'outline'"
                        class="justify-start text-xs font-medium"
                        @click="selectedClient = 'gmail'"
                      >
                        ✉️ Gmail (Web/App)
                      </Button>
                      <Button
                        type="button"
                        size="xs"
                        :variant="selectedClient === 'apple' ? 'default' : 'outline'"
                        class="justify-start text-xs font-medium"
                        @click="selectedClient = 'apple'"
                      >
                        🍏 Apple Mail (iOS)
                      </Button>
                      <Button
                        type="button"
                        size="xs"
                        :variant="selectedClient === 'outlook' ? 'default' : 'outline'"
                        class="justify-start text-xs font-medium"
                        @click="selectedClient = 'outlook'"
                      >
                        💼 Outlook 365
                      </Button>
                    </div>
                  </div>

                  <div
                    v-if="testSentSuccess"
                    class="border-success/30 bg-success/10 text-success flex items-center gap-2 rounded-md border p-2.5 text-xs font-medium"
                  >
                    <CheckCircle2 class="size-4 shrink-0" />
                    <span>Test proof dispatched to {{ testTargetEmail }}!</span>
                  </div>
                </div>

                <DialogFooter class="gap-2 sm:gap-0">
                  <Button variant="outline" size="sm" :disabled="isSendingTest" @click="isTestModalOpen = false">
                    Cancel
                  </Button>
                  <Button size="sm" class="gap-1.5" :disabled="isSendingTest" @click="handleSendTest">
                    <Send class="size-3.5" />
                    <span>{{ isSendingTest ? 'Dispatching...' : 'Send Test Proof' }}</span>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <!-- Schedule Broadcast Dialog -->
            <Dialog v-model:open="isScheduleModalOpen">
              <DialogTrigger as-child>
                <Button size="sm" class="gap-1.5 text-xs font-medium shadow-xs">
                  <Send class="size-3.5 fill-current" />
                  <span>Schedule Broadcast</span>
                </Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle class="flex items-center gap-2 text-base">
                    <Calendar class="text-primary size-4" />
                    Schedule Email Broadcast
                  </DialogTitle>
                  <DialogDescription class="text-xs">
                    Queue this broadcast for {{ currentAudience.count.toLocaleString() }} verified subscribers with
                    deliverability rate limit guardrails.
                  </DialogDescription>
                </DialogHeader>

                <div class="space-y-4 py-2">
                  <div class="border-border bg-muted/40 space-y-2 rounded-lg border p-3 text-xs">
                    <div class="flex flex-wrap items-center justify-between">
                      <span class="text-muted-foreground">Audience Target</span>
                      <span class="text-foreground font-medium">{{ currentAudience.label }}</span>
                    </div>
                    <div class="flex flex-wrap items-center justify-between">
                      <span class="text-muted-foreground">Estimated Reach</span>
                      <span class="text-foreground font-semibold"
                        >{{ currentAudience.count.toLocaleString() }} recipients</span
                      >
                    </div>
                    <div class="flex flex-wrap items-center justify-between">
                      <span class="text-muted-foreground">Spam Safety Score</span>
                      <Badge variant="success" class="h-4.5 px-1.5 text-xs font-normal">0.2 / 10.0 (Safe)</Badge>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="text-muted-foreground text-xs font-medium">Broadcast Timing</label>
                    <div class="grid grid-cols-1 gap-2">
                      <button
                        type="button"
                        class="border-border hover:border-primary/50 flex flex-wrap items-center justify-between rounded-lg border p-3 text-left text-xs transition-colors"
                        :class="scheduleTiming === 'optimal' ? 'border-primary bg-primary/5' : 'bg-card'"
                        @click="scheduleTiming = 'optimal'"
                      >
                        <div class="space-y-0.5">
                          <div class="text-foreground font-medium">✨ AI Optimal Send Time (Recommended)</div>
                          <div class="text-muted-foreground text-xs">
                            Tuesday, Aug 25 @ 9:00 AM EDT (+18% projected opens)
                          </div>
                        </div>
                        <div
                          class="flex size-4 items-center justify-center rounded-full border"
                          :class="
                            scheduleTiming === 'optimal'
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border'
                          "
                        >
                          <div v-if="scheduleTiming === 'optimal'" class="size-1.5 rounded-full bg-white" />
                        </div>
                      </button>

                      <button
                        type="button"
                        class="border-border hover:border-primary/50 flex flex-wrap items-center justify-between rounded-lg border p-3 text-left text-xs transition-colors"
                        :class="scheduleTiming === 'immediate' ? 'border-primary bg-primary/5' : 'bg-card'"
                        @click="scheduleTiming = 'immediate'"
                      >
                        <div class="space-y-0.5">
                          <div class="text-foreground font-medium">⚡ Send Immediately</div>
                          <div class="text-muted-foreground text-xs">
                            Dispatch immediately with warm-up concurrency pacing
                          </div>
                        </div>
                        <div
                          class="flex size-4 items-center justify-center rounded-full border"
                          :class="
                            scheduleTiming === 'immediate'
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border'
                          "
                        >
                          <div v-if="scheduleTiming === 'immediate'" class="size-1.5 rounded-full bg-white" />
                        </div>
                      </button>
                    </div>
                  </div>

                  <div
                    v-if="scheduleSuccess"
                    class="border-success/30 bg-success/10 text-success flex items-center gap-2 rounded-md border p-2.5 text-xs font-medium"
                  >
                    <CheckCircle2 class="size-4 shrink-0" />
                    <span>Broadcast successfully queued for dispatch!</span>
                  </div>
                </div>

                <DialogFooter class="gap-2 sm:gap-0">
                  <Button variant="outline" size="sm" :disabled="isScheduling" @click="isScheduleModalOpen = false">
                    Cancel
                  </Button>
                  <Button size="sm" class="gap-1.5" :disabled="isScheduling" @click="handleScheduleBroadcast">
                    <Send class="size-3.5" />
                    <span>{{ isScheduling ? 'Scheduling...' : 'Confirm & Schedule' }}</span>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
    </Card>

    <!-- 2-Column Campaign Studio Grid -->
    <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
      <!-- LEFT PANEL: Campaign Setup & Audience (45% -> lg:col-span-5) -->
      <div class="space-y-5 lg:col-span-5">
        <!-- 1. Audience Segment Selector Card -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                  <Users class="size-3.5" />
                </div>
                <CardTitle class="text-sm font-semibold tracking-tight">Audience Segment</CardTitle>
              </div>
              <Badge variant="secondary" class="h-5 gap-1 px-2 text-xs font-normal">
                <UserCheck class="size-3 text-emerald-500" />
                Verified List
              </Badge>
            </div>
            <CardDescription class="text-xs">
              Select subscriber segment to calculate deliverability pacing and personalization tags.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-3.5 pt-0">
            <div class="space-y-1.5">
              <label class="text-foreground text-xs font-medium">Target Segment</label>
              <Select v-model="selectedAudience">
                <SelectTrigger
                  class="h-9 w-full text-xs font-medium [&>span]:truncate [&>svg]:shrink-0"
                  aria-label="Select Audience Segment"
                >
                  <SelectValue placeholder="Select audience segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="aud in audienceOptions" :key="aud.id" :value="aud.id">
                    <span>{{ aud.label }}</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Audience Telemetry Badges Grid -->
            <div class="grid grid-cols-3 gap-2 pt-1">
              <div class="border-border bg-muted/40 rounded-lg border p-2.5 text-center">
                <div class="text-muted-foreground text-xs font-medium">Recipients</div>
                <div class="text-foreground mt-0.5 text-sm font-bold tracking-tight">
                  {{ currentAudience.formattedCount }}
                </div>
              </div>
              <div class="border-border bg-muted/40 rounded-lg border p-2.5 text-center">
                <div class="text-muted-foreground text-xs font-medium">Avg Open Rate</div>
                <div
                  class="text-foreground mt-0.5 text-sm font-bold tracking-tight text-emerald-600 dark:text-emerald-400"
                >
                  {{ currentAudience.openRate }}
                </div>
              </div>
              <div class="border-border bg-muted/40 rounded-lg border p-2.5 text-center">
                <div class="text-muted-foreground text-xs font-medium">Avg CTR</div>
                <div class="text-foreground mt-0.5 text-sm font-bold tracking-tight text-sky-600 dark:text-sky-400">
                  {{ currentAudience.clickRate }}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 2. Subject Line & AI Optimizer Card -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                  <Sparkles class="size-3.5" />
                </div>
                <CardTitle class="text-sm font-semibold tracking-tight">Subject Line & AI Scorer</CardTitle>
              </div>
              <!-- AI Subject Scorer Green Badge -->
              <Badge
                variant="outline"
                class="gap-1 border-emerald-500/30 bg-emerald-500/10 px-2 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                <Sparkles class="size-3 text-emerald-500" />
                <span>94 / 100 · High Open Rate Impact</span>
              </Badge>
            </div>
            <CardDescription class="text-xs">
              AI predictive heuristic analyzing urgency, sentiment, character count, and spam filter risk.
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-4 pt-0">
            <!-- A/B Subject Variant Switcher -->
            <div class="border-border bg-muted/30 flex flex-wrap items-center justify-between rounded-lg border p-3">
              <div class="space-y-0.5">
                <div class="text-foreground flex items-center gap-1.5 text-xs font-medium">
                  <Split class="text-primary size-3.5" />
                  <span>A/B Subject Variant Testing</span>
                </div>
                <p class="text-muted-foreground text-xs">Test 2 subject lines with 50/50 subscriber split</p>
              </div>
              <Switch id="vue-ab-toggle" v-model="isAbTestEnabled" />
            </div>

            <!-- Subject Input Variant A -->
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center justify-between text-xs">
                <label class="text-foreground font-medium">
                  Subject Line {{ isAbTestEnabled ? '(Variant A · 50%)' : '' }}
                </label>
                <div class="flex items-center gap-1.5">
                  <span class="text-muted-foreground font-mono text-xs">{{ subjectA.length }}/60 chars</span>
                  <Badge variant="outline" class="text-muted-foreground h-4.5 gap-1 px-1.5 text-xs font-normal">
                    <Flame class="size-2.5 text-amber-500" />
                    <span>{{ emojiCount }} emoji</span>
                  </Badge>
                </div>
              </div>
              <Input v-model="subjectA" class="text-xs" placeholder="Enter campaign subject line..." />
            </div>

            <!-- Subject Input Variant B (Visible if A/B Enabled) -->
            <div v-if="isAbTestEnabled" class="space-y-1.5">
              <div class="flex flex-wrap items-center justify-between text-xs">
                <label class="text-foreground font-medium">Subject Line (Variant B · 50%)</label>
                <span class="text-muted-foreground font-mono text-xs">{{ subjectB.length }}/60 chars</span>
              </div>
              <Input v-model="subjectB" class="text-xs" placeholder="Enter alternate subject line B..." />
              <div class="flex items-center gap-1 pt-1">
                <Button
                  type="button"
                  size="xs"
                  :variant="activePreviewVariant === 'A' ? 'default' : 'outline'"
                  class="text-xs font-medium"
                  @click="activePreviewVariant = 'A'"
                >
                  Preview Variant A
                </Button>
                <Button
                  type="button"
                  size="xs"
                  :variant="activePreviewVariant === 'B' ? 'default' : 'outline'"
                  class="text-xs font-medium"
                  @click="activePreviewVariant = 'B'"
                >
                  Preview Variant B
                </Button>
              </div>
            </div>

            <!-- AI Subject Score Breakdown Metrics -->
            <div class="border-border bg-muted/20 space-y-2 rounded-lg border p-3 text-xs">
              <div class="flex flex-wrap items-center justify-between">
                <span class="text-muted-foreground flex items-center gap-1.5">
                  <Check class="size-3 text-emerald-500" />
                  Sentiment Tone
                </span>
                <span class="text-foreground font-medium">Positive (98%)</span>
              </div>
              <div class="flex flex-wrap items-center justify-between">
                <span class="text-muted-foreground flex items-center gap-1.5">
                  <Check class="size-3 text-emerald-500" />
                  Urgency & Relevance
                </span>
                <span class="text-foreground font-medium">High (91%)</span>
              </div>
              <div class="flex flex-wrap items-center justify-between">
                <span class="text-muted-foreground flex items-center gap-1.5">
                  <Check class="size-3 text-emerald-500" />
                  Spam Keyword Risk
                </span>
                <span class="text-foreground font-medium text-emerald-600 dark:text-emerald-400">Very Low (0.1%)</span>
              </div>
            </div>

            <!-- 1-Click AI Subject Line Suggestions -->
            <div class="space-y-2">
              <span class="text-muted-foreground flex items-center gap-1 text-xs font-medium">
                <Sparkles class="text-primary size-3" />
                AI Optimization Suggestions (Click to apply):
              </span>
              <div class="space-y-1.5">
                <button
                  v-for="(suggestion, idx) in aiSuggestions"
                  :key="idx"
                  type="button"
                  class="border-border hover:border-primary/40 hover:bg-muted/50 flex w-full items-center justify-between rounded-md border p-2 text-left text-xs transition-colors"
                  @click="applyAiSubject(suggestion.text)"
                >
                  <span class="text-foreground truncate font-medium">{{ suggestion.text }}</span>
                  <Badge
                    variant="secondary"
                    class="ml-2 shrink-0 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    {{ suggestion.score }}/100
                  </Badge>
                </button>
              </div>
            </div>

            <Separator />

            <!-- 3. Preview Text / Preheader -->
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center justify-between text-xs">
                <label class="text-foreground font-medium">Preview Text / Preheader</label>
                <span class="text-muted-foreground font-mono text-xs">{{ preheaderCharCount }}/90 chars</span>
              </div>
              <Input
                v-model="previewText"
                class="text-xs"
                placeholder="Secondary snippet displayed in subscriber inbox lists..."
              />
            </div>

            <Separator />

            <!-- 4. Sender Identity -->
            <div class="space-y-3">
              <label class="text-foreground text-xs font-medium">Sender Identity</label>
              <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div class="space-y-1">
                  <span class="text-muted-foreground text-xs">Sender Display Name</span>
                  <Input v-model="senderName" class="text-xs" placeholder="UIPKGE Team" />
                </div>
                <div class="space-y-1">
                  <span class="text-muted-foreground text-xs">From Address</span>
                  <Input v-model="senderEmail" class="text-xs" placeholder="updates@uipkge.dev" />
                </div>
              </div>
              <div
                class="flex flex-wrap items-center justify-between rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1.5 text-xs text-emerald-600 dark:text-emerald-400"
              >
                <div class="flex items-center gap-1.5">
                  <ShieldCheck class="size-3.5 shrink-0" />
                  <span>Domain verified: <strong>mail.uipkge.dev</strong> (SPF & DKIM valid)</span>
                </div>
                <Badge
                  variant="outline"
                  class="h-4.5 border-emerald-500/30 px-1.5 text-xs text-emerald-600 dark:text-emerald-400"
                >
                  TLS 1.3
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- RIGHT PANEL: Live Multi-Device Email Preview (55% -> lg:col-span-7) -->
      <div class="space-y-5 lg:col-span-7">
        <!-- Live Email Canvas Container Card -->
        <Card class="border-border bg-card overflow-hidden shadow-xs">
          <CardHeader class="border-border bg-muted/20 border-b pb-3">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-2">
                <Eye class="text-primary size-4" />
                <CardTitle class="text-sm font-semibold tracking-tight">Live Newsletter Preview</CardTitle>
                <Badge v-if="isAbTestEnabled" variant="secondary" class="text-xs font-normal">
                  Showing Variant {{ activePreviewVariant }}
                </Badge>
              </div>

              <!-- Device Viewport Toggle (Desktop 600px vs Mobile 375px) -->
              <div class="bg-muted border-border inline-flex items-center rounded-lg border p-1 shadow-xs">
                <Button
                  type="button"
                  size="xs"
                  :variant="viewport === 'desktop' ? 'default' : 'ghost'"
                  class="gap-1.5 text-xs font-medium"
                  @click="viewport = 'desktop'"
                >
                  <Monitor class="size-3.5" />
                  <span>Desktop 600px</span>
                </Button>
                <Button
                  type="button"
                  size="xs"
                  :variant="viewport === 'mobile' ? 'default' : 'ghost'"
                  class="gap-1.5 text-xs font-medium"
                  @click="viewport = 'mobile'"
                >
                  <Smartphone class="size-3.5" />
                  <span>Mobile 375px</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <!-- Rendered Newsletter Preview Canvas -->
          <CardContent class="bg-muted/30 flex min-h-[580px] flex-col items-center justify-start p-4 sm:p-6">
            <div
              :class="
                cn(
                  'w-full transition-[max-width] duration-300 ease-in-out',
                  viewport === 'desktop' ? 'max-w-[580px]' : 'max-w-[360px]',
                )
              "
            >
              <!-- Window Chrome Bar Frame -->
              <div class="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
                <!-- Top Chrome Bar -->
                <div class="border-border bg-muted/60 flex flex-wrap items-center justify-between border-b px-4 py-2.5">
                  <div class="flex items-center gap-1.5">
                    <div class="size-2.5 rounded-full bg-red-500/80" />
                    <div class="size-2.5 rounded-full bg-amber-500/80" />
                    <div class="size-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div class="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
                    <Inbox class="size-3" />
                    <span>UIPKGE Preview · {{ viewport === 'desktop' ? '600px' : '375px' }}</span>
                  </div>
                  <Badge
                    variant="outline"
                    class="border-border text-muted-foreground h-4.5 gap-1 px-1.5 text-xs font-normal"
                  >
                    <Lock class="size-2.5 text-emerald-500" />
                    TLS 1.3
                  </Badge>
                </div>

                <!-- Envelope Metadata Readout -->
                <div class="border-border bg-card/70 space-y-2 border-b p-4 text-xs">
                  <div class="flex flex-wrap items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div
                        class="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-full font-bold"
                      >
                        U
                      </div>
                      <div>
                        <div class="flex items-center gap-1.5">
                          <span class="text-foreground font-semibold">{{ senderName }}</span>
                          <span class="text-muted-foreground">&lt;{{ senderEmail }}&gt;</span>
                        </div>
                        <div class="text-muted-foreground text-xs">To: alex.developer@enterprise.com</div>
                      </div>
                    </div>
                    <span class="text-muted-foreground text-xs">Aug 21, 2026</span>
                  </div>

                  <div class="space-y-0.5 pt-1">
                    <div class="text-foreground text-sm font-semibold tracking-tight">
                      {{ currentActiveSubject }}
                    </div>
                    <div class="text-muted-foreground line-clamp-1 text-xs">
                      {{ previewText }}
                    </div>
                  </div>
                </div>

                <!-- High-Fidelity Rendered Email Newsletter Body -->
                <div class="bg-card space-y-5 p-5 sm:p-7">
                  <!-- Logo Banner -->
                  <div class="border-border flex flex-wrap items-center justify-between border-b pb-3.5">
                    <div class="flex items-center gap-2">
                      <div
                        class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"
                      >
                        <Zap class="size-3.5 fill-current" />
                      </div>
                      <span class="text-foreground text-sm font-bold tracking-tight">UIPKGE</span>
                    </div>
                    <Badge variant="secondary" class="text-xs font-medium">Changelog #24 · Release 2.0</Badge>
                  </div>

                  <!-- Hero Headline & Description -->
                  <div class="space-y-2.5">
                    <Badge
                      variant="outline"
                      class="text-primary border-primary/30 text-xs font-semibold tracking-wider uppercase"
                    >
                      Major Product Release
                    </Badge>
                    <h3 class="text-foreground text-xl leading-tight font-bold tracking-tight sm:text-2xl">
                      Ship polished UIs in minutes
                    </h3>
                    <p class="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                      We completely rebuilt the registry engine. 370+ production components with zero npm dependencies,
                      100% code ownership, and full native support for Vue 3 and React with modern OKLCH tokens.
                    </p>
                  </div>

                  <!-- Product Visual with Code Snippet & Callout Pills -->
                  <div class="border-border bg-muted/40 overflow-hidden rounded-lg border">
                    <div
                      class="border-border bg-muted/60 flex flex-wrap items-center justify-between border-b px-3.5 py-2"
                    >
                      <div class="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
                        <Terminal class="text-primary size-3" />
                        <span>components/ui/button.vue</span>
                      </div>
                      <span class="font-mono text-xs font-medium text-emerald-500">TypeScript</span>
                    </div>
                    <div class="space-y-3 p-3.5">
                      <div
                        class="border-border bg-background text-muted-foreground rounded-md border p-2.5 font-mono text-xs"
                      >
                        <span class="text-primary font-semibold">$</span> npx shadcn-vue add @uipkge/button
                      </div>

                      <!-- Mini Interactive UI Demo inside Email -->
                      <div
                        class="bg-card border-border flex flex-wrap items-center justify-center gap-2 rounded-md border p-3"
                      >
                        <Button size="xs" variant="default">Primary</Button>
                        <Button size="xs" variant="secondary">Secondary</Button>
                        <Button size="xs" variant="outline">Outline</Button>
                        <Button size="xs" variant="destructive">Destructive</Button>
                      </div>

                      <!-- 3 Callout Pills -->
                      <div class="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                        <Badge variant="secondary" class="text-xs font-normal">⚡ Zero npm dependencies</Badge>
                        <Badge variant="secondary" class="text-xs font-normal">🎨 OKLCH Dark Mode</Badge>
                        <Badge variant="secondary" class="text-xs font-normal">🧩 Vue 3 + React Parity</Badge>
                      </div>
                    </div>
                  </div>

                  <!-- Primary CTA Button -->
                  <div class="flex flex-col items-center justify-center space-y-2 pt-1 text-center">
                    <Button size="lg" class="w-full px-8 font-semibold shadow-xs sm:w-auto">
                      <span>Explore Components</span>
                      <ArrowRight class="ml-1 size-4" />
                    </Button>
                    <p class="text-muted-foreground text-xs">
                      Free & Open Source · MIT License · 370+ Primitives & Blocks
                    </p>
                  </div>

                  <Separator />

                  <!-- Unsubscribe & Footer Details -->
                  <div class="text-muted-foreground space-y-2.5 pt-1 text-center text-xs">
                    <div class="flex flex-wrap items-center justify-center gap-3 font-medium">
                      <span class="hover:text-foreground cursor-pointer transition-colors">Documentation</span>
                      <span>·</span>
                      <span class="hover:text-foreground cursor-pointer transition-colors">GitHub</span>
                      <span>·</span>
                      <span class="hover:text-foreground cursor-pointer transition-colors">Discord</span>
                      <span>·</span>
                      <span class="hover:text-foreground cursor-pointer transition-colors">Preferences</span>
                    </div>
                    <p class="text-xs">UIPKGE Inc. · 548 Market St, Suite 29314, San Francisco, CA 94104</p>
                    <p class="text-xs">
                      You received this email because you subscribed to UIPKGE updates.
                      <span class="hover:text-foreground cursor-pointer underline"> Unsubscribe anytime (RFC 8058)</span
                      >.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Deliverability & Inbox Placement Card -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between">
              <div class="flex items-center gap-2">
                <div
                  class="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                >
                  <ShieldCheck class="size-4" />
                </div>
                <CardTitle class="text-sm font-semibold tracking-tight"
                  >Deliverability & Inbox Placement Scorecard</CardTitle
                >
              </div>
              <Badge
                variant="outline"
                class="h-5 border-emerald-500/30 px-2 text-xs text-emerald-600 dark:text-emerald-400"
              >
                99.8% Inbox Probability
              </Badge>
            </div>
            <CardDescription class="text-xs">
              Heuristic spam risk evaluation, DNS authentication compliance, and subscriber engagement telemetry.
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-4 pt-0">
            <!-- 3 Core Scorecard Metrics -->
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <!-- Metric 1: Spam Score -->
              <div class="border-border bg-muted/30 rounded-lg border p-3">
                <div class="flex flex-wrap items-center justify-between text-xs">
                  <span class="text-muted-foreground">Spam Score</span>
                  <Badge variant="success" class="h-4.5 px-1 text-xs">Optimal</Badge>
                </div>
                <div class="mt-1 flex items-baseline gap-1">
                  <span class="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">0.2</span>
                  <span class="text-muted-foreground text-xs">/ 10.0</span>
                </div>
                <div class="bg-muted mt-2 h-1.5 w-full overflow-hidden rounded-full">
                  <div class="h-full w-[98%] rounded-full bg-emerald-500" />
                </div>
              </div>

              <!-- Metric 2: Domain Auth -->
              <div class="border-border bg-muted/30 rounded-lg border p-3">
                <div class="flex flex-wrap items-center justify-between text-xs">
                  <span class="text-muted-foreground">Auth Headers</span>
                  <Badge variant="success" class="h-4.5 px-1 text-xs">100% Pass</Badge>
                </div>
                <div class="mt-1 space-y-0.5 text-xs">
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">SPF / DKIM</span>
                    <span class="text-foreground font-medium">Valid (2048-bit)</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted-foreground">DMARC</span>
                    <span class="text-foreground font-medium">p=reject</span>
                  </div>
                </div>
              </div>

              <!-- Metric 3: Reading Time -->
              <div class="border-border bg-muted/30 rounded-lg border p-3">
                <div class="flex flex-wrap items-center justify-between text-xs">
                  <span class="text-muted-foreground">Reading Time</span>
                  <span class="text-foreground font-mono font-medium">185 words</span>
                </div>
                <div class="mt-1 flex items-baseline gap-1">
                  <span class="text-foreground text-xl font-bold tracking-tight">45</span>
                  <span class="text-muted-foreground text-xs">seconds</span>
                </div>
                <div class="text-muted-foreground mt-1 text-xs">Payload size: 14.2 KB (Safe)</div>
              </div>
            </div>

            <!-- Detailed Checklist Row -->
            <div class="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <div
                class="border-border/80 bg-muted/20 flex flex-wrap items-center justify-between rounded-md border px-3 py-2"
              >
                <span class="text-muted-foreground flex items-center gap-1.5">
                  <Check class="size-3.5 text-emerald-500" />
                  Primary Tab Placement
                </span>
                <span class="text-foreground font-medium">99.8% (Gmail / Apple)</span>
              </div>
              <div
                class="border-border/80 bg-muted/20 flex flex-wrap items-center justify-between rounded-md border px-3 py-2"
              >
                <span class="text-muted-foreground flex items-center gap-1.5">
                  <Check class="size-3.5 text-emerald-500" />
                  RFC 8058 One-Click
                </span>
                <span class="text-foreground font-medium">Compliant</span>
              </div>
              <div
                class="border-border/80 bg-muted/20 flex flex-wrap items-center justify-between rounded-md border px-3 py-2"
              >
                <span class="text-muted-foreground flex items-center gap-1.5">
                  <Check class="size-3.5 text-emerald-500" />
                  Dark Mode Contrast
                </span>
                <span class="text-foreground font-medium">100% WCAG AAA</span>
              </div>
              <div
                class="border-border/80 bg-muted/20 flex flex-wrap items-center justify-between rounded-md border px-3 py-2"
              >
                <span class="text-muted-foreground flex items-center gap-1.5">
                  <Check class="size-3.5 text-emerald-500" />
                  HTTPS Asset Links
                </span>
                <span class="text-foreground font-medium">6 Valid Links</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
