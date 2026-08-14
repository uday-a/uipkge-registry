'use client'

import * as React from 'react'
import { Globe, Link2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { SectionCard } from '@/components/ui/section-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const DESCRIPTION_LIMIT = 280

export interface FormLayoutsProps {
  className?: string
}

export function FormLayouts({ className }: FormLayoutsProps) {
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [visibility, setVisibility] = React.useState('internal')
  const [startDate, setStartDate] = React.useState('')
  const [budget, setBudget] = React.useState('')
  const [access, setAccess] = React.useState<'link' | 'restricted'>('link')
  const [notifications, setNotifications] = React.useState(true)
  const [comments, setComments] = React.useState(true)
  const [submitted, setSubmitted] = React.useState(false)

  const slug =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'your-project'

  const showNameError = submitted && name.trim() === ''

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    if (name.trim() === '') return
  }

  return (
    <div data-slot="form-layouts" className={`max-w-2xl ${className ?? ''}`}>
      <form className="space-y-6" noValidate onSubmit={handleSubmit}>
        <SectionCard title="Project details" description="Name your project and describe what it covers.">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fl-name">Name</Label>
              <Input
                id="fl-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Q3 launch site"
                autoComplete="off"
                aria-invalid={showNameError || undefined}
              />
              {showNameError && (
                <p role="alert" className="text-destructive text-xs">
                  Project name is required.
                </p>
              )}
            </div>
            <div className="border-border bg-muted/40 flex items-center gap-2 rounded-md border px-3 py-2">
              <Globe className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
              <p className="min-w-0 truncate text-xs">
                <span className="text-muted-foreground">acme.uipkge.app/</span>
                <span className="text-foreground font-medium">{slug}</span>
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fl-description">Description</Label>
              <Textarea
                id="fl-description"
                value={description}
                onValueChange={setDescription}
                rows={3}
                placeholder="What is this project about?"
              />
              <p
                className={`text-right text-xs ${
                  description.length > DESCRIPTION_LIMIT ? 'text-destructive' : 'text-muted-foreground'
                }`}
              >
                {description.length}/{DESCRIPTION_LIMIT}
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Configuration" description="Visibility, schedule and budget for the project.">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="fl-visibility">Visibility</Label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger id="fl-visibility" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fl-start-date">Start date</Label>
              <Input
                id="fl-start-date"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fl-budget">Budget</Label>
              <Input
                id="fl-budget"
                type="number"
                min={0}
                step={500}
                className="text-left"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Access" description="Decide who can open the project and what they can do.">
          <div className="space-y-5">
            <RadioGroup
              value={access}
              onValueChange={(value) => setAccess(value as 'link' | 'restricted')}
              className="gap-3"
            >
              <div className="hover:bg-accent/50 has-data-[state=checked]:border-primary flex items-start gap-3 rounded-lg border p-3 transition-colors">
                <RadioGroupItem id="fl-access-link" value="link" className="mt-0.5" />
                <label htmlFor="fl-access-link" className="cursor-pointer select-none">
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    <Link2 className="size-4" aria-hidden="true" />
                    Anyone with the link
                  </span>
                  <span className="text-muted-foreground mt-0.5 block text-xs">
                    Guests can view without signing in.
                  </span>
                </label>
              </div>
              <div className="hover:bg-accent/50 has-data-[state=checked]:border-primary flex items-start gap-3 rounded-lg border p-3 transition-colors">
                <RadioGroupItem id="fl-access-restricted" value="restricted" className="mt-0.5" />
                <label htmlFor="fl-access-restricted" className="cursor-pointer select-none">
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    <Lock className="size-4" aria-hidden="true" />
                    Restricted
                  </span>
                  <span className="text-muted-foreground mt-0.5 block text-xs">
                    Only invited members can open the project.
                  </span>
                </label>
              </div>
            </RadioGroup>

            <div className="divide-y rounded-lg border">
              <div className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Notifications</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">Email the team on status changes and mentions.</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} aria-label="Toggle notifications" />
              </div>
              <div className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Comments</p>
                  <p className="text-muted-foreground mt-0.5 text-xs">Let viewers comment on tasks and updates.</p>
                </div>
                <Switch checked={comments} onCheckedChange={setComments} aria-label="Toggle comments" />
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="bg-background/80 border-border sticky bottom-0 -mx-1 flex items-center justify-end gap-2 rounded-b-xl border-t px-1 py-4 backdrop-blur">
          <Button type="button" variant="ghost" size="sm">
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={name.trim() === ''}>
            Create project
          </Button>
        </div>
      </form>
    </div>
  )
}
