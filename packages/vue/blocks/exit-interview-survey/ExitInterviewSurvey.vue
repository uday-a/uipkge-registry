<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  FileCheck,
  FileCode2,
  HeartHandshake,
  KeyRound,
  Laptop,
  Lock,
  MessageSquareQuote,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Rating } from '@/components/ui/rating'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

// Primary Departure Reasons
interface DepartureReason {
  value: string
  label: string
  description: string
  icon: typeof Compass
}

const departureReasons: DepartureReason[] = [
  {
    value: 'career-growth',
    label: 'Career Growth & Promotion',
    description: 'Seeking broader technical leadership scope, faster progression, or new architectural challenges.',
    icon: TrendingUp,
  },
  {
    value: 'compensation',
    label: 'Compensation / Total Rewards',
    description: 'Competitive market offers, higher base salary band, equity incentives, or bonus structures.',
    icon: Award,
  },
  {
    value: 'relocation',
    label: 'Relocation & Remote Freedom',
    description: 'Geographic move, personal relocation, or seeking broader international and async flexibility.',
    icon: Building2,
  },
  {
    value: 'work-life',
    label: 'Work-Life Balance',
    description: 'Need for sustainable working cadence, reduced on-call intensity, and dedicated personal time.',
    icon: HeartHandshake,
  },
  {
    value: 'leadership',
    label: 'Leadership & Direction',
    description: 'Strategic alignment with executive roadmap, product vision, or communication cadence.',
    icon: Compass,
  },
  {
    value: 'venture',
    label: 'Starting Own Venture',
    description: 'Launching an independent technical startup, consulting practice, or entrepreneurial venture.',
    icon: Sparkles,
  },
]

// Experience Rating Dimensions
interface RatingDimension {
  id: 'management' | 'collaboration' | 'compensation' | 'culture' | 'flexibility'
  title: string
  description: string
  category: string
}

const ratingDimensions: RatingDimension[] = [
  {
    id: 'management',
    title: 'Management & Leadership',
    description: 'Direct manager support, transparent 1:1 mentorship, goal clarity, and career advocacy.',
    category: 'Leadership',
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Cross-functional synergy, peer code review quality, mutual trust, and psychological safety.',
    category: 'Team Dynamics',
  },
  {
    id: 'compensation',
    title: 'Compensation & Benefits',
    description: 'Base salary competitiveness, equity appreciation, health coverage, and wellness allowances.',
    category: 'Total Rewards',
  },
  {
    id: 'culture',
    title: 'Engineering Culture',
    description: 'Architectural standards, modern tooling, automated testing, CI/CD speed, and technical autonomy.',
    category: 'Craft & Standards',
  },
  {
    id: 'flexibility',
    title: 'Work-Life Flexibility',
    description: 'Async-first communication, sustainable sprint planning, and reasonable on-call expectations.',
    category: 'Well-being',
  },
]

// Return Willingness Options
const returnOptions = [
  {
    value: 'yes',
    label: 'Yes, definitely open',
    description: 'Strongly open to returning for future leadership or staff-level architectural initiatives.',
    badge: 'Alumni Priority',
    badgeVariant: 'success' as const,
  },
  {
    value: 'maybe',
    label: 'Maybe, under right conditions',
    description: 'Would consider returning under different organizational structure or roadmap scope.',
    badge: 'Conditionally Open',
    badgeVariant: 'secondary' as const,
  },
  {
    value: 'no',
    label: 'No, pursuing new pathways',
    description: 'Focused on long-term career growth in independent ventures or other sectors.',
    badge: 'New Trajectory',
    badgeVariant: 'outline' as const,
  },
]

// Form State
const primaryReason = ref<string>('career-growth')
const departureNotes = ref<string>(
  'Accepted a Principal Systems Architect role at a Series B infrastructure startup focusing on WebAssembly runtime tooling.',
)

const ratings = reactive<Record<RatingDimension['id'], number>>({
  management: 4,
  collaboration: 5,
  compensation: 4,
  culture: 5,
  flexibility: 4,
})

const enjoyedMost = ref<string>(
  'The engineering team’s exceptional craft and collaborative spirit. Building high-scale distributed platform services alongside humble, brilliant peers was deeply rewarding. Leadership always supported architectural innovation and design system investments.',
)

const toImprove = ref<string>(
  'Cross-functional roadmap alignment between product management and core platform squads. Late-quarter requirement shifts occasionally created sprint friction and compressed delivery timelines.',
)

const returnWillingness = ref<string>('yes')

const handoverChecklist = reactive({
  codebase: true,
  architecture: true,
  credentials: true,
  equipment: false,
})

const isSubmitted = ref<boolean>(false)
const submissionId = ref<string>('EXIT-2026-9042')

// Computed Metrics
const averageRating = computed(() => {
  const values = Object.values(ratings)
  const sum = values.reduce((acc, val) => acc + val, 0)
  return (sum / values.length).toFixed(1)
})

const sentimentPercentage = computed(() => {
  return Math.round((Number(averageRating.value) / 5) * 100)
})

const handoverCompletedCount = computed(() => {
  return Object.values(handoverChecklist).filter(Boolean).length
})

const handoverPercentage = computed(() => {
  return Math.round((handoverCompletedCount.value / 4) * 100)
})

function handleSubmit() {
  isSubmitted.value = true
}

function handleReset() {
  isSubmitted.value = false
}
</script>

<template>
  <div data-slot="exit-interview-survey" :class="cn('w-full space-y-6', props.class)">
    <!-- Header & Employee Context Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardContent class="p-6">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <!-- Employee Details -->
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar class="border-border size-16 shrink-0 border sm:size-20">
              <AvatarImage
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                alt="Elena Rostova"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  Employee Exit Survey & Offboarding Review
                </h1>
              </div>
              <p class="text-muted-foreground text-sm font-medium">
                Elena Rostova · Senior Staff Engineer · 3.5 Years Tenure
              </p>
              <div class="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <Badge variant="secondary" class="font-medium"> Engineering · Core Platform </Badge>
                <Badge variant="outline" class="gap-1 text-xs font-normal">
                  <Calendar class="size-3" />
                  Final Day: Sep 30, 2026
                </Badge>
                <span class="text-muted-foreground">
                  Manager: <strong class="text-foreground font-medium">Marcus Vance</strong>
                </span>
              </div>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="flex flex-wrap items-center gap-3 sm:self-start lg:self-center">
            <Button
              v-if="!isSubmitted"
              size="sm"
              class="bg-primary text-primary-foreground gap-2 shadow-xs"
              @click="handleSubmit"
            >
              <Send class="size-4" />
              Submit Survey
            </Button>
            <Button v-else variant="outline" size="sm" class="gap-2 shadow-xs" @click="handleReset">
              <RotateCcw class="size-4" />
              Edit Survey Answers
            </Button>
          </div>
        </div>

        <!-- Confidentiality Notice Banner -->
        <div class="border-border/80 bg-muted/40 mt-6 flex items-start gap-3 rounded-lg border p-3.5 text-xs">
          <ShieldCheck class="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div class="space-y-0.5">
            <p class="text-foreground font-semibold">Strictly Confidential People Ops Review</p>
            <p class="text-muted-foreground leading-relaxed">
              Your candid responses are confidential and used exclusively by People Ops to improve company culture,
              leadership effectiveness, and engineering workflows. Summary insights are aggregated and anonymized.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Submission Success Alert (When Submitted) -->
    <div
      v-if="isSubmitted"
      class="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-900 shadow-xs dark:text-emerald-200"
    >
      <CheckCircle2 class="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
      <div class="flex-1 space-y-1">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-sm font-semibold">Exit Survey Successfully Submitted</p>
          <span class="font-mono text-xs font-medium">Receipt #{{ submissionId }}</span>
        </div>
        <p class="text-xs leading-relaxed text-emerald-800 dark:text-emerald-300">
          Thank you for your dedicated 3.5 years of service and leadership. Your constructive feedback has been securely
          logged for the People Ops quarterly retention review and alumni network registration.
        </p>
      </div>
    </div>

    <!-- Department Sentiment & Handover Scorecard Strip -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Overall Sentiment Index -->
      <Card class="border-border bg-card shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">Overall Experience Score</CardTitle>
          <Star class="size-4 text-amber-500" />
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="flex items-baseline gap-2">
            <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
              {{ averageRating }}
            </span>
            <span class="text-muted-foreground text-xs font-medium">/ 5.0</span>
          </div>
          <div class="space-y-1">
            <Progress :model-value="sentimentPercentage" class="h-1.5 w-full" />
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-emerald-600 dark:text-emerald-400">+0.4 vs Dept Avg</span>
              <span class="text-muted-foreground font-mono tabular-nums">{{ sentimentPercentage }}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Primary Driver -->
      <Card class="border-border bg-card shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">Primary Departure Driver</CardTitle>
          <Compass class="text-primary size-4" />
        </CardHeader>
        <CardContent class="space-y-1.5">
          <div class="text-foreground text-base font-bold tracking-tight sm:text-lg">Career Growth</div>
          <p class="text-muted-foreground text-xs leading-relaxed">
            Targeting Principal/Architect roles in cloud infrastructure.
          </p>
        </CardContent>
      </Card>

      <!-- Knowledge Handover Progress -->
      <Card class="border-border bg-card shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">Knowledge Handover</CardTitle>
          <ClipboardCheck class="text-primary size-4" />
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="flex items-baseline gap-2">
            <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
              {{ handoverPercentage }}%
            </span>
            <span class="text-muted-foreground text-xs font-medium">({{ handoverCompletedCount }} of 4 tasks)</span>
          </div>
          <div class="space-y-1">
            <Progress :model-value="handoverPercentage" class="h-1.5 w-full" />
            <p class="text-muted-foreground text-xs">IT asset return pending</p>
          </div>
        </CardContent>
      </Card>

      <!-- Alumni & Return Eligibility -->
      <Card class="border-border bg-card shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium">Alumni Status</CardTitle>
          <Sparkles class="size-4 text-emerald-500" />
        </CardHeader>
        <CardContent class="space-y-1.5">
          <div class="flex items-center gap-1.5">
            <Badge variant="success" class="text-xs font-semibold">Eligible for Re-Hire</Badge>
          </div>
          <p class="text-muted-foreground text-xs leading-relaxed">
            Registered for Alumni Leadership Network & fast-track referrals.
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- ================================================================= -->
    <!-- SECTION 1: Primary Reason for Departure                           -->
    <!-- ================================================================= -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-4">
        <div class="flex items-center gap-2">
          <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
            <Compass class="size-4" />
          </div>
          <div>
            <CardTitle class="text-base font-semibold">1. Primary Reason for Departure</CardTitle>
            <CardDescription class="text-xs">
              Select the primary factor that most heavily influenced your decision to pursue new opportunities.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent class="space-y-4">
        <RadioGroup v-model="primaryReason" class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label
            v-for="item in departureReasons"
            :key="item.value"
            :for="`reason-${item.value}`"
            :class="
              cn(
                'hover:bg-muted/30 flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-all',
                primaryReason === item.value
                  ? 'border-primary/80 bg-primary/5 ring-primary/20 ring-1'
                  : 'border-border bg-card',
              )
            "
          >
            <RadioGroupItem :id="`reason-${item.value}`" :value="item.value" class="mt-0.5" />
            <div class="space-y-1">
              <div class="flex items-center gap-1.5">
                <span class="text-foreground text-xs leading-none font-semibold">{{ item.label }}</span>
              </div>
              <p class="text-muted-foreground text-xs leading-relaxed">{{ item.description }}</p>
            </div>
          </label>
        </RadioGroup>

        <!-- Departure Context Details -->
        <div class="space-y-2 pt-2">
          <Label for="departure-notes" class="text-xs font-medium">
            Additional Context on Your Departure Decision (Optional)
          </Label>
          <Textarea
            id="departure-notes"
            v-model="departureNotes"
            :rows="2"
            placeholder="Share specific context regarding your career progression, next steps, or decision drivers..."
            class="text-xs"
          />
        </div>
      </CardContent>
    </Card>

    <!-- ================================================================= -->
    <!-- SECTION 2: Experience & Culture Ratings (1 to 5 Stars)            -->
    <!-- ================================================================= -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-4">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2">
            <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
              <Star class="size-4" />
            </div>
            <div>
              <CardTitle class="text-base font-semibold">2. Experience & Culture Ratings</CardTitle>
              <CardDescription class="text-xs">
                Rate each dimension of your experience on a scale of 1 (Needs Serious Improvement) to 5 (Outstanding).
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" class="w-fit text-xs font-medium tabular-nums">
            Average: {{ averageRating }} / 5.0
          </Badge>
        </div>
      </CardHeader>

      <CardContent class="space-y-4">
        <div class="divide-border divide-y rounded-lg border">
          <div
            v-for="dim in ratingDimensions"
            :key="dim.id"
            class="hover:bg-muted/20 flex flex-col gap-3 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-foreground text-sm font-semibold">{{ dim.title }}</span>
                <Badge variant="secondary" class="text-xs font-normal">
                  {{ dim.category }}
                </Badge>
              </div>
              <p class="text-muted-foreground max-w-xl text-xs leading-relaxed">
                {{ dim.description }}
              </p>
            </div>

            <!-- Star Rating Control -->
            <div class="flex shrink-0 items-center gap-3 sm:self-center">
              <Rating v-model="ratings[dim.id]" :max="5" density="comfortable" size="small" />
              <span class="text-foreground min-w-8 text-right font-mono text-xs font-semibold tabular-nums">
                {{ ratings[dim.id] }} / 5
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- ================================================================= -->
    <!-- SECTION 3: Qualitative In-Depth Feedback                          -->
    <!-- ================================================================= -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-4">
        <div class="flex items-center gap-2">
          <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
            <MessageSquareQuote class="size-4" />
          </div>
          <div>
            <CardTitle class="text-base font-semibold">3. Qualitative In-Depth Feedback</CardTitle>
            <CardDescription class="text-xs">
              Detailed reflections to guide organizational enhancements and executive leadership planning.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent class="space-y-5">
        <!-- Question 1: What did you enjoy most -->
        <div class="space-y-2">
          <Label for="enjoyed-most" class="text-foreground text-xs font-semibold tracking-wide">
            What did you enjoy most about working at the company?
          </Label>
          <Textarea
            id="enjoyed-most"
            v-model="enjoyedMost"
            :rows="3"
            placeholder="Highlight positive aspects of your team, projects, technical challenges, or company traditions..."
            class="text-xs leading-relaxed"
          />
        </div>

        <Separator />

        <!-- Question 2: What should leadership improve -->
        <div class="space-y-2">
          <Label for="to-improve" class="text-foreground text-xs font-semibold tracking-wide">
            What is one thing the leadership team should immediately improve?
          </Label>
          <Textarea
            id="to-improve"
            v-model="toImprove"
            :rows="3"
            placeholder="Suggest actionable improvements for strategy, tooling, engineering velocity, or team communication..."
            class="text-xs leading-relaxed"
          />
        </div>

        <Separator />

        <!-- Question 3: Would you consider returning -->
        <div class="space-y-3">
          <Label class="text-foreground text-xs font-semibold tracking-wide">
            Would you consider returning to the company in the future?
          </Label>
          <RadioGroup v-model="returnWillingness" class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label
              v-for="opt in returnOptions"
              :key="opt.value"
              :for="`return-${opt.value}`"
              :class="
                cn(
                  'hover:bg-muted/30 flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-all',
                  returnWillingness === opt.value
                    ? 'border-primary/80 bg-primary/5 ring-primary/20 ring-1'
                    : 'border-border bg-card',
                )
              "
            >
              <RadioGroupItem :id="`return-${opt.value}`" :value="opt.value" class="mt-0.5" />
              <div class="space-y-1.5">
                <div class="flex items-center gap-1.5">
                  <span class="text-foreground text-xs font-semibold">{{ opt.label }}</span>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">{{ opt.description }}</p>
                <Badge :variant="opt.badgeVariant" class="text-xs font-normal">
                  {{ opt.badge }}
                </Badge>
              </div>
            </label>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>

    <!-- ================================================================= -->
    <!-- SECTION 4: Knowledge Handover & Asset Return Checklist            -->
    <!-- ================================================================= -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-4">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2">
            <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
              <ClipboardCheck class="size-4" />
            </div>
            <div>
              <CardTitle class="text-base font-semibold"> 4. Knowledge Handover & Asset Return Checklist </CardTitle>
              <CardDescription class="text-xs">
                Administrative and technical transition milestones prior to official offboarding date.
              </CardDescription>
            </div>
          </div>
          <Badge
            :variant="handoverCompletedCount === 4 ? 'success' : 'secondary'"
            class="w-fit text-xs font-medium tabular-nums"
          >
            {{ handoverCompletedCount }} of 4 Completed ({{ handoverPercentage }}%)
          </Badge>
        </div>
      </CardHeader>

      <CardContent class="space-y-4">
        <div class="divide-border divide-y rounded-lg border">
          <!-- Item 1: Codebase Ownership -->
          <div class="hover:bg-muted/20 flex items-start gap-3.5 p-4 transition-colors">
            <Checkbox id="ho-codebase" v-model="handoverChecklist.codebase" class="mt-0.5" />
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <FileCode2 class="text-primary size-4" />
                <Label for="ho-codebase" class="text-foreground cursor-pointer text-xs font-semibold">
                  Codebase repository ownership transferred
                </Label>
              </div>
              <p class="text-muted-foreground text-xs leading-relaxed">
                Transferred GitHub admin rights, codeowners assignments, and CI/CD secret manager access to incoming
                lead (Liam Vance).
              </p>
            </div>
          </div>

          <!-- Item 2: Architecture Documentation -->
          <div class="hover:bg-muted/20 flex items-start gap-3.5 p-4 transition-colors">
            <Checkbox id="ho-architecture" v-model="handoverChecklist.architecture" class="mt-0.5" />
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <FileCheck class="text-primary size-4" />
                <Label for="ho-architecture" class="text-foreground cursor-pointer text-xs font-semibold">
                  Architecture documentation updated
                </Label>
              </div>
              <p class="text-muted-foreground text-xs leading-relaxed">
                Core system architecture diagrams, service topology maps, and disaster recovery runbooks completed in
                Notion & DevPortal.
              </p>
            </div>
          </div>

          <!-- Item 3: Credentials Rotated -->
          <div class="hover:bg-muted/20 flex items-start gap-3.5 p-4 transition-colors">
            <Checkbox id="ho-credentials" v-model="handoverChecklist.credentials" class="mt-0.5" />
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <KeyRound class="text-primary size-4" />
                <Label for="ho-credentials" class="text-foreground cursor-pointer text-xs font-semibold">
                  Passwords & credentials rotated
                </Label>
              </div>
              <p class="text-muted-foreground text-xs leading-relaxed">
                Revoked personal staging SSH keys, rotated AWS IAM secret access tokens, and decommissioned VPN and
                Vault credentials.
              </p>
            </div>
          </div>

          <!-- Item 4: Hardware Returned -->
          <div class="hover:bg-muted/20 flex items-start gap-3.5 p-4 transition-colors">
            <Checkbox id="ho-equipment" v-model="handoverChecklist.equipment" class="mt-0.5" />
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <Laptop class="text-primary size-4" />
                <Label for="ho-equipment" class="text-foreground cursor-pointer text-xs font-semibold">
                  Company laptop & security hardware returned
                </Label>
              </div>
              <p class="text-muted-foreground text-xs leading-relaxed">
                MacBook Pro M3 Max, hardware security YubiKey, and company physical access badge received by IT Asset
                Ops.
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter class="border-border/60 bg-muted/20 flex flex-wrap items-center justify-between gap-3 border-t p-4">
        <div class="text-muted-foreground flex items-center gap-2 text-xs">
          <Lock class="size-3.5" />
          <span>Requires final sign-off from IT Security & People Operations</span>
        </div>
        <Button
          v-if="!isSubmitted"
          size="sm"
          class="bg-primary text-primary-foreground gap-2 shadow-xs"
          @click="handleSubmit"
        >
          <Send class="size-4" />
          Submit Final Exit Review
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
