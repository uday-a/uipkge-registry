'use client'

import * as React from 'react'
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
} from 'lucide-react'
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

export interface ExitInterviewSurveyProps {
  className?: string
}

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

export function ExitInterviewSurvey({ className }: ExitInterviewSurveyProps) {
  const [primaryReason, setPrimaryReason] = React.useState<string>('career-growth')
  const [departureNotes, setDepartureNotes] = React.useState<string>(
    'Accepted a Principal Systems Architect role at a Series B infrastructure startup focusing on WebAssembly runtime tooling.',
  )

  const [ratings, setRatings] = React.useState<Record<RatingDimension['id'], number>>({
    management: 4,
    collaboration: 5,
    compensation: 4,
    culture: 5,
    flexibility: 4,
  })

  const [enjoyedMost, setEnjoyedMost] = React.useState<string>(
    'The engineering team’s exceptional craft and collaborative spirit. Building high-scale distributed platform services alongside humble, brilliant peers was deeply rewarding. Leadership always supported architectural innovation and design system investments.',
  )

  const [toImprove, setToImprove] = React.useState<string>(
    'Cross-functional roadmap alignment between product management and core platform squads. Late-quarter requirement shifts occasionally created sprint friction and compressed delivery timelines.',
  )

  const [returnWillingness, setReturnWillingness] = React.useState<string>('yes')

  const [handoverChecklist, setHandoverChecklist] = React.useState({
    codebase: true,
    architecture: true,
    credentials: true,
    equipment: false,
  })

  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false)
  const submissionId = 'EXIT-2026-9042'

  // Computed Metrics
  const averageRating = React.useMemo(() => {
    const values = Object.values(ratings)
    const sum = values.reduce((acc, val) => acc + val, 0)
    return (sum / values.length).toFixed(1)
  }, [ratings])

  const sentimentPercentage = React.useMemo(() => {
    return Math.round((Number(averageRating) / 5) * 100)
  }, [averageRating])

  const handoverCompletedCount = React.useMemo(() => {
    return Object.values(handoverChecklist).filter(Boolean).length
  }, [handoverChecklist])

  const handoverPercentage = React.useMemo(() => {
    return Math.round((handoverCompletedCount / 4) * 100)
  }, [handoverCompletedCount])

  const updateRating = (id: RatingDimension['id'], val: number) => {
    setRatings((prev) => ({ ...prev, [id]: val }))
  }

  const toggleHandover = (key: keyof typeof handoverChecklist, checked: boolean) => {
    setHandoverChecklist((prev) => ({ ...prev, [key]: checked }))
  }

  return (
    <div data-slot="exit-interview-survey" className={cn('w-full space-y-6', className)}>
      {/* Header & Employee Context Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Employee Details */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar className="border-border size-16 shrink-0 border sm:size-20">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                  alt="Elena Rostova"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                    Employee Exit Survey & Offboarding Review
                  </h1>
                </div>
                <p className="text-muted-foreground text-sm font-medium">
                  Elena Rostova · Senior Staff Engineer · 3.5 Years Tenure
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <Badge variant="secondary" className="font-medium">
                    Engineering · Core Platform
                  </Badge>
                  <Badge variant="outline" className="gap-1 text-xs font-normal">
                    <Calendar className="size-3" />
                    Final Day: Sep 30, 2026
                  </Badge>
                  <span className="text-muted-foreground">
                    Manager: <strong className="text-foreground font-medium">Marcus Vance</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex flex-wrap items-center gap-3 sm:self-start lg:self-center">
              {!isSubmitted ? (
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground gap-2 shadow-xs"
                  onClick={() => setIsSubmitted(true)}
                >
                  <Send className="size-4" />
                  Submit Survey
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="gap-2 shadow-xs" onClick={() => setIsSubmitted(false)}>
                  <RotateCcw className="size-4" />
                  Edit Survey Answers
                </Button>
              )}
            </div>
          </div>

          {/* Confidentiality Notice Banner */}
          <div className="border-border/80 bg-muted/40 mt-6 flex items-start gap-3 rounded-lg border p-3.5 text-xs">
            <ShieldCheck className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div className="space-y-0.5">
              <p className="text-foreground font-semibold">Strictly Confidential People Ops Review</p>
              <p className="text-muted-foreground leading-relaxed">
                Your candid responses are confidential and used exclusively by People Ops to improve company culture,
                leadership effectiveness, and engineering workflows. Summary insights are aggregated and anonymized.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submission Success Alert (When Submitted) */}
      {isSubmitted && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-900 shadow-xs dark:text-emerald-200">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold">Exit Survey Successfully Submitted</p>
              <span className="font-mono text-xs font-medium">Receipt #{submissionId}</span>
            </div>
            <p className="text-xs leading-relaxed text-emerald-800 dark:text-emerald-300">
              Thank you for your dedicated 3.5 years of service and leadership. Your constructive feedback has been
              securely logged for the People Ops quarterly retention review and alumni network registration.
            </p>
          </div>
        </div>
      )}

      {/* Department Sentiment & Handover Scorecard Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Overall Sentiment Index */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Overall Experience Score</CardTitle>
            <Star className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                {averageRating}
              </span>
              <span className="text-muted-foreground text-xs font-medium">/ 5.0</span>
            </div>
            <div className="space-y-1">
              <Progress value={sentimentPercentage} className="h-1.5 w-full" />
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-emerald-600 dark:text-emerald-400">+0.4 vs Dept Avg</span>
                <span className="text-muted-foreground font-mono tabular-nums">{sentimentPercentage}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Primary Driver */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Primary Departure Driver</CardTitle>
            <Compass className="text-primary size-4" />
          </CardHeader>
          <CardContent className="space-y-1.5">
            <div className="text-foreground text-base font-bold tracking-tight sm:text-lg">Career Growth</div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Targeting Principal/Architect roles in cloud infrastructure.
            </p>
          </CardContent>
        </Card>

        {/* Knowledge Handover Progress */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Knowledge Handover</CardTitle>
            <ClipboardCheck className="text-primary size-4" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                {handoverPercentage}%
              </span>
              <span className="text-muted-foreground text-xs font-medium">({handoverCompletedCount} of 4 tasks)</span>
            </div>
            <div className="space-y-1">
              <Progress value={handoverPercentage} className="h-1.5 w-full" />
              <p className="text-muted-foreground text-xs">IT asset return pending</p>
            </div>
          </CardContent>
        </Card>

        {/* Alumni & Return Eligibility */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Alumni Status</CardTitle>
            <Sparkles className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Badge variant="success" className="text-xs font-semibold">
                Eligible for Re-Hire
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Registered for Alumni Leadership Network & fast-track referrals.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ================================================================= */}
      {/* SECTION 1: Primary Reason for Departure                           */}
      {/* ================================================================= */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
              <Compass className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">1. Primary Reason for Departure</CardTitle>
              <CardDescription className="text-xs">
                Select the primary factor that most heavily influenced your decision to pursue new opportunities.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <RadioGroup
            value={primaryReason}
            onValueChange={setPrimaryReason}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {departureReasons.map((item) => (
              <label
                key={item.value}
                htmlFor={`reason-${item.value}`}
                className={cn(
                  'hover:bg-muted/30 flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-all',
                  primaryReason === item.value
                    ? 'border-primary/80 bg-primary/5 ring-primary/20 ring-1'
                    : 'border-border bg-card',
                )}
              >
                <RadioGroupItem id={`reason-${item.value}`} value={item.value} className="mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-foreground text-xs leading-none font-semibold">{item.label}</span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{item.description}</p>
                </div>
              </label>
            ))}
          </RadioGroup>

          {/* Departure Context Details */}
          <div className="space-y-2 pt-2">
            <Label htmlFor="departure-notes" className="text-xs font-medium">
              Additional Context on Your Departure Decision (Optional)
            </Label>
            <Textarea
              id="departure-notes"
              value={departureNotes}
              onValueChange={setDepartureNotes}
              rows={2}
              placeholder="Share specific context regarding your career progression, next steps, or decision drivers..."
              className="text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* ================================================================= */}
      {/* SECTION 2: Experience & Culture Ratings (1 to 5 Stars)            */}
      {/* ================================================================= */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                <Star className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">2. Experience & Culture Ratings</CardTitle>
                <CardDescription className="text-xs">
                  Rate each dimension of your experience on a scale of 1 (Needs Serious Improvement) to 5 (Outstanding).
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="w-fit text-xs font-medium tabular-nums">
              Average: {averageRating} / 5.0
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="divide-border divide-y rounded-lg border">
            {ratingDimensions.map((dim) => (
              <div
                key={dim.id}
                className="hover:bg-muted/20 flex flex-col gap-3 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-semibold">{dim.title}</span>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {dim.category}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground max-w-xl text-xs leading-relaxed">{dim.description}</p>
                </div>

                {/* Star Rating Control */}
                <div className="flex shrink-0 items-center gap-3 sm:self-center">
                  <Rating
                    value={ratings[dim.id]}
                    onValueChange={(val) => updateRating(dim.id, val)}
                    max={5}
                    density="comfortable"
                    size="small"
                  />
                  <span className="text-foreground min-w-8 text-right font-mono text-xs font-semibold tabular-nums">
                    {ratings[dim.id]} / 5
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ================================================================= */}
      {/* SECTION 3: Qualitative In-Depth Feedback                          */}
      {/* ================================================================= */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
              <MessageSquareQuote className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">3. Qualitative In-Depth Feedback</CardTitle>
              <CardDescription className="text-xs">
                Detailed reflections to guide organizational enhancements and executive leadership planning.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Question 1: What did you enjoy most */}
          <div className="space-y-2">
            <Label htmlFor="enjoyed-most" className="text-foreground text-xs font-semibold tracking-wide">
              What did you enjoy most about working at the company?
            </Label>
            <Textarea
              id="enjoyed-most"
              value={enjoyedMost}
              onValueChange={setEnjoyedMost}
              rows={3}
              placeholder="Highlight positive aspects of your team, projects, technical challenges, or company traditions..."
              className="text-xs leading-relaxed"
            />
          </div>

          <Separator />

          {/* Question 2: What should leadership improve */}
          <div className="space-y-2">
            <Label htmlFor="to-improve" className="text-foreground text-xs font-semibold tracking-wide">
              What is one thing the leadership team should immediately improve?
            </Label>
            <Textarea
              id="to-improve"
              value={toImprove}
              onValueChange={setToImprove}
              rows={3}
              placeholder="Suggest actionable improvements for strategy, tooling, engineering velocity, or team communication..."
              className="text-xs leading-relaxed"
            />
          </div>

          <Separator />

          {/* Question 3: Would you consider returning */}
          <div className="space-y-3">
            <Label className="text-foreground text-xs font-semibold tracking-wide">
              Would you consider returning to the company in the future?
            </Label>
            <RadioGroup
              value={returnWillingness}
              onValueChange={setReturnWillingness}
              className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
              {returnOptions.map((opt) => (
                <label
                  key={opt.value}
                  htmlFor={`return-${opt.value}`}
                  className={cn(
                    'hover:bg-muted/30 flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-all',
                    returnWillingness === opt.value
                      ? 'border-primary/80 bg-primary/5 ring-primary/20 ring-1'
                      : 'border-border bg-card',
                  )}
                >
                  <RadioGroupItem id={`return-${opt.value}`} value={opt.value} className="mt-0.5" />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-foreground text-xs font-semibold">{opt.label}</span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{opt.description}</p>
                    <Badge variant={opt.badgeVariant} className="text-xs font-normal">
                      {opt.badge}
                    </Badge>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* ================================================================= */}
      {/* SECTION 4: Knowledge Handover & Asset Return Checklist            */}
      {/* ================================================================= */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                <ClipboardCheck className="size-4" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  4. Knowledge Handover & Asset Return Checklist
                </CardTitle>
                <CardDescription className="text-xs">
                  Administrative and technical transition milestones prior to official offboarding date.
                </CardDescription>
              </div>
            </div>
            <Badge
              variant={handoverCompletedCount === 4 ? 'success' : 'secondary'}
              className="w-fit text-xs font-medium tabular-nums"
            >
              {handoverCompletedCount} of 4 Completed ({handoverPercentage}%)
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="divide-border divide-y rounded-lg border">
            {/* Item 1: Codebase Ownership */}
            <div className="hover:bg-muted/20 flex items-start gap-3.5 p-4 transition-colors">
              <Checkbox
                id="ho-codebase"
                checked={handoverChecklist.codebase}
                onCheckedChange={(val) => toggleHandover('codebase', val === true)}
                className="mt-0.5"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileCode2 className="text-primary size-4" />
                  <Label htmlFor="ho-codebase" className="text-foreground cursor-pointer text-xs font-semibold">
                    Codebase repository ownership transferred
                  </Label>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Transferred GitHub admin rights, codeowners assignments, and CI/CD secret manager access to incoming
                  lead (Liam Vance).
                </p>
              </div>
            </div>

            {/* Item 2: Architecture Documentation */}
            <div className="hover:bg-muted/20 flex items-start gap-3.5 p-4 transition-colors">
              <Checkbox
                id="ho-architecture"
                checked={handoverChecklist.architecture}
                onCheckedChange={(val) => toggleHandover('architecture', val === true)}
                className="mt-0.5"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileCheck className="text-primary size-4" />
                  <Label htmlFor="ho-architecture" className="text-foreground cursor-pointer text-xs font-semibold">
                    Architecture documentation updated
                  </Label>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Core system architecture diagrams, service topology maps, and disaster recovery runbooks completed in
                  Notion & DevPortal.
                </p>
              </div>
            </div>

            {/* Item 3: Credentials Rotated */}
            <div className="hover:bg-muted/20 flex items-start gap-3.5 p-4 transition-colors">
              <Checkbox
                id="ho-credentials"
                checked={handoverChecklist.credentials}
                onCheckedChange={(val) => toggleHandover('credentials', val === true)}
                className="mt-0.5"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <KeyRound className="text-primary size-4" />
                  <Label htmlFor="ho-credentials" className="text-foreground cursor-pointer text-xs font-semibold">
                    Passwords & credentials rotated
                  </Label>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Revoked personal staging SSH keys, rotated AWS IAM secret access tokens, and decommissioned VPN and
                  Vault credentials.
                </p>
              </div>
            </div>

            {/* Item 4: Hardware Returned */}
            <div className="hover:bg-muted/20 flex items-start gap-3.5 p-4 transition-colors">
              <Checkbox
                id="ho-equipment"
                checked={handoverChecklist.equipment}
                onCheckedChange={(val) => toggleHandover('equipment', val === true)}
                className="mt-0.5"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Laptop className="text-primary size-4" />
                  <Label htmlFor="ho-equipment" className="text-foreground cursor-pointer text-xs font-semibold">
                    Company laptop & security hardware returned
                  </Label>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  MacBook Pro M3 Max, hardware security YubiKey, and company physical access badge received by IT Asset
                  Ops.
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-border/60 bg-muted/20 flex flex-wrap items-center justify-between gap-3 border-t p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Lock className="size-3.5" />
            <span>Requires final sign-off from IT Security & People Operations</span>
          </div>
          {!isSubmitted && (
            <Button
              size="sm"
              className="bg-primary text-primary-foreground gap-2 shadow-xs"
              onClick={() => setIsSubmitted(true)}
            >
              <Send className="size-4" />
              Submit Final Exit Review
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
