'use client'

import * as React from 'react'
import { Check, ChevronLeft, ChevronRight, Globe, Plus, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SectionCard } from '@/components/ui/section-card'
import { Stepper } from '@/components/ui/stepper'
import { Switch } from '@/components/ui/switch'

interface Preference {
  id: string
  label: string
  description: string
  enabled: boolean
}

export interface OnboardingWizardProps {
  /** Jump straight to a step (1 Workspace · 2 Team · 3 Preferences · 4 Done). */
  initialStep?: number
  /** Pre-fill the workspace name so later steps read naturally in isolation. */
  initialWorkspaceName?: string
  /** Pre-seed invited teammates. */
  initialInvites?: string[]
  className?: string
}

const steps = [
  { id: 1, title: 'Workspace' },
  { id: 2, title: 'Team' },
  { id: 3, title: 'Preferences' },
  { id: 4, title: 'Done' },
]

const defaultPreferences: Preference[] = [
  {
    id: 'digests',
    label: 'Email digests',
    description: 'A daily summary of workspace activity.',
    enabled: true,
  },
  {
    id: 'updates',
    label: 'Product updates',
    description: 'Occasional notes about new features and improvements.',
    enabled: false,
  },
  {
    id: 'reports',
    label: 'Weekly reports',
    description: 'Usage analytics delivered every Monday morning.',
    enabled: true,
  },
]

export function OnboardingWizard({
  initialStep = 1,
  initialWorkspaceName = 'Acme Inc',
  initialInvites = [],
  className,
}: OnboardingWizardProps) {
  const [step, setStep] = React.useState(initialStep)
  const [workspaceName, setWorkspaceName] = React.useState(initialWorkspaceName)
  const [invites, setInvites] = React.useState<string[]>(initialInvites)
  const [inviteDraft, setInviteDraft] = React.useState('')
  const [inviteInvalid, setInviteInvalid] = React.useState(false)
  const [preferences, setPreferences] = React.useState<Preference[]>(defaultPreferences)

  const slug =
    workspaceName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'your-workspace'

  function addInvite() {
    const email = inviteDraft.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || invites.includes(email)) {
      setInviteInvalid(true)
      return
    }
    setInviteInvalid(false)
    setInvites((prev) => [...prev, email])
    setInviteDraft('')
  }

  function removeInvite(email: string) {
    setInvites((prev) => prev.filter((e) => e !== email))
  }

  function onStepperInput(value: number) {
    // Free backward navigation; forward goes through the footer button only.
    if (value < step && step !== 4) setStep(value)
  }

  function goNext() {
    if (step < 4) setStep(step + 1)
  }

  function reset() {
    setStep(1)
    setWorkspaceName('')
    setInvites([])
    setInviteDraft('')
  }

  return (
    <SectionCard
      data-slot="onboarding-wizard"
      title="Set up your workspace"
      description="Four quick steps and your team is ready to collaborate."
      className={className}
      footer={
        <div className="flex w-full items-center justify-between">
          {step > 1 && step < 4 ? (
            <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
              <ChevronLeft aria-hidden="true" />
              Back
            </Button>
          ) : (
            <span aria-hidden="true" />
          )}
          <span className="text-muted-foreground text-xs">Step {step} of 4</span>
          {step < 4 ? (
            <Button size="sm" disabled={step === 1 && workspaceName.trim() === ''} onClick={goNext}>
              {step === 3 ? 'Finish' : 'Continue'}
              <ChevronRight aria-hidden="true" />
            </Button>
          ) : (
            <span aria-hidden="true" />
          )}
        </div>
      }
    >
      <Stepper steps={steps} value={step} onValueChange={onStepperInput} className="mb-6" />

      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="onboarding-workspace-name" className="text-sm font-medium">
              Workspace name
            </label>
            <Input
              id="onboarding-workspace-name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Acme Inc"
              autoComplete="off"
            />
          </div>
          <div className="border-border bg-muted/40 flex items-center gap-2 rounded-md border px-3 py-2">
            <Globe className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
            <p className="min-w-0 truncate text-xs">
              <span className="text-muted-foreground">uipkge.dev/</span>
              <span className="text-foreground font-medium">{slug}</span>
            </p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              addInvite()
            }}
          >
            <Input
              value={inviteDraft}
              onChange={(e) => {
                setInviteDraft(e.target.value)
                setInviteInvalid(false)
              }}
              type="email"
              placeholder="teammate@company.com"
              status={inviteInvalid ? 'error' : undefined}
              className="flex-1"
            />
            <Button type="submit" variant="outline" size="sm" className="shrink-0">
              <Plus aria-hidden="true" />
              Add
            </Button>
          </form>
          {inviteInvalid && (
            <p role="alert" className="text-destructive text-xs">
              Enter a valid email address.
            </p>
          )}
          {invites.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {invites.map((email) => (
                <Badge key={email} variant="secondary" className="gap-1 py-1 pr-1 pl-2.5">
                  {email}
                  <button
                    type="button"
                    aria-label={`Remove ${email}`}
                    className="hover:bg-foreground/10 focus-visible:ring-ring min-h-6 rounded-full p-0.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    onClick={() => removeInvite(email)}
                  >
                    <X className="size-3" aria-hidden="true" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-xs">No teammates invited yet.</p>
          )}
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring min-h-6 text-xs underline-offset-4 transition-colors hover:underline focus-visible:ring-2 focus-visible:outline-none"
            onClick={goNext}
          >
            Skip for now
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="divide-y rounded-lg border">
          {preferences.map((pref) => (
            <div key={pref.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">{pref.label}</p>
                <p className="text-muted-foreground mt-0.5 text-xs">{pref.description}</p>
              </div>
              <Switch
                aria-label={pref.label}
                checked={pref.enabled}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => prev.map((p) => (p.id === pref.id ? { ...p, enabled: checked } : p)))
                }
              />
            </div>
          ))}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4 py-6 text-center">
          <div className="relative mx-auto size-16">
            <span className="bg-primary/20 absolute inset-0 rounded-full blur-2xl" aria-hidden="true"></span>
            <span className="border-success/30 bg-success/10 text-success relative flex size-16 items-center justify-center rounded-full border shadow-xs">
              <Check className="size-8" aria-hidden="true" />
            </span>
          </div>
          <div>
            <p className="text-lg font-semibold">You're all set</p>
            <p className="text-muted-foreground mx-auto mt-1 max-w-sm text-sm">
              {invites.length > 0
                ? `${workspaceName || 'Your workspace'} is ready and ${invites.length} invitation${invites.length === 1 ? '' : 's'} sent.`
                : `${workspaceName || 'Your workspace'} is ready — invite teammates anytime from settings.`}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={reset}>
            Set up another workspace
          </Button>
        </div>
      )}
    </SectionCard>
  )
}
