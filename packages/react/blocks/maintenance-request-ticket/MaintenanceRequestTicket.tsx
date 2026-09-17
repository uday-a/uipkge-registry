'use client'

import * as React from 'react'
import { useState } from 'react'
import {
  AlertCircle,
  Bug,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Droplets,
  FileImage,
  FileVideo,
  Flame,
  KeyRound,
  PhoneCall,
  Plus,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UploadCloud,
  UserCheck,
  Wrench,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

export interface AttachedFile {
  id: string
  name: string
  size: string
  type: 'image' | 'video'
  uploadedAt: string
}

export interface MaintenanceRequestTicketProps {
  className?: string
  initialCategory?: string
  initialUrgency?: 'routine' | 'standard' | 'emergency'
  initialLocation?: string
  initialDescription?: string
  initialPermission?: 'granted' | 'call_first'
  initialFiles?: AttachedFile[]
}

const defaultFiles: AttachedFile[] = [
  {
    id: 'f-1',
    name: 'kitchen-sink-leak-pipe.jpg',
    size: '2.4 MB',
    type: 'image',
    uploadedAt: 'Today, 10:14 AM',
  },
  {
    id: 'f-2',
    name: 'disposal-motor-hum.mp4',
    size: '8.1 MB',
    type: 'video',
    uploadedAt: 'Today, 10:16 AM',
  },
]

const categories = [
  {
    id: 'plumbing',
    label: 'Plumbing & Leaks',
    description: 'Faucets, pipes, toilets, drains',
    icon: Droplets,
    badgeColor: 'text-sky-500 bg-sky-500/10 dark:text-sky-400',
  },
  {
    id: 'electrical',
    label: 'Electrical & Lighting',
    description: 'Outlets, switches, fixtures, breakers',
    icon: Zap,
    badgeColor: 'text-amber-500 bg-amber-500/10 dark:text-amber-400',
  },
  {
    id: 'hvac',
    label: 'HVAC & AC Heating',
    description: 'AC, thermostat, heater, airflow',
    icon: Flame,
    badgeColor: 'text-orange-500 bg-orange-500/10 dark:text-orange-400',
  },
  {
    id: 'appliances',
    label: 'Appliances',
    description: 'Dishwasher, oven, disposal, fridge',
    icon: Wrench,
    badgeColor: 'text-indigo-500 bg-indigo-500/10 dark:text-indigo-400',
  },
  {
    id: 'locks',
    label: 'Doors & Locks',
    description: 'Keys, latches, deadbolts, windows',
    icon: KeyRound,
    badgeColor: 'text-emerald-500 bg-emerald-500/10 dark:text-emerald-400',
  },
  {
    id: 'pest',
    label: 'Pest Control',
    description: 'Insects, rodents, preventative traps',
    icon: Bug,
    badgeColor: 'text-rose-500 bg-rose-500/10 dark:text-rose-400',
  },
]

const urgencyOptions = [
  {
    value: 'routine',
    label: 'Low / Routine',
    badge: '3–5 Business Days',
    badgeVariant: 'outline' as const,
    description: 'Non-urgent preventative maintenance or routine hardware adjustments.',
  },
  {
    value: 'standard',
    label: 'Medium / Standard 48h',
    badge: '24–48h SLA',
    badgeVariant: 'secondary' as const,
    description: 'Standard repair with moderate impact on daily convenience or appliance usage.',
  },
  {
    value: 'emergency',
    label: 'High / Emergency 2h SLA',
    badge: 'Emergency < 2h',
    badgeVariant: 'destructive' as const,
    description: 'Immediate hazard to property or habitability. Triggers 24/7 on-call dispatch.',
  },
]

const locationOptions = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'master_bathroom', label: 'Master Bathroom' },
  { value: 'guest_bathroom', label: 'Guest Bathroom' },
  { value: 'living_room', label: 'Living Room' },
  { value: 'balcony', label: 'Balcony / Patio' },
  { value: 'master_bedroom', label: 'Master Bedroom' },
  { value: 'guest_bedroom', label: 'Guest Bedroom' },
  { value: 'hallway', label: 'Hallway / Entryway' },
  { value: 'laundry', label: 'Laundry & Utility Closet' },
]

const quickSnippets = [
  'Motor humming but not spinning',
  'Water leaking under sink',
  'Reset button tripped',
  'Slow draining',
]

const maxChars = 500

export function MaintenanceRequestTicket({
  className,
  initialCategory = 'appliances',
  initialUrgency = 'standard',
  initialLocation = 'kitchen',
  initialDescription = 'Kitchen sink garbage disposal is jammed and leaking slightly under the cabinet when water runs. Motor makes a low humming sound.',
  initialPermission = 'granted',
  initialFiles = defaultFiles,
}: MaintenanceRequestTicketProps) {
  const [category, setCategory] = useState<string>(initialCategory)
  const [urgency, setUrgency] = useState<'routine' | 'standard' | 'emergency'>(initialUrgency)
  const [location, setLocation] = useState<string>(initialLocation)
  const [description, setDescription] = useState<string>(initialDescription)
  const [permission, setPermission] = useState<'granted' | 'call_first'>(initialPermission)
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([...initialFiles])
  const [isDragging, setIsDragging] = useState(false)
  const [showOpenRequests, setShowOpenRequests] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [generatedTicketId, setGeneratedTicketId] = useState('MNT-9042')

  const descriptionLength = description.length

  const appendSnippet = (snippet: string) => {
    if (!description) {
      setDescription(snippet)
    } else if (!description.includes(snippet)) {
      setDescription(`${description.trim()} ${snippet}.`)
    }
  }

  const removeFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const newFiles: AttachedFile[] = []
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i]
        newFiles.push({
          id: `f-${Date.now()}-${i}`,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.type.startsWith('video') ? 'video' : 'image',
          uploadedAt: 'Just now',
        })
      }
      setAttachedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const simulateAddFile = () => {
    const sampleNames = ['cabinet-water-mark.jpg', 'under-sink-plumbing.jpg', 'noise-recording.mp4']
    const randomName = sampleNames[attachedFiles.length % sampleNames.length]
    setAttachedFiles((prev) => [
      ...prev,
      {
        id: `f-${Date.now()}`,
        name: randomName,
        size: '3.1 MB',
        type: randomName.endsWith('.mp4') ? 'video' : 'image',
        uploadedAt: 'Just now',
      },
    ])
  }

  const handleSaveDraft = () => {
    setDraftSaved(true)
    setTimeout(() => {
      setDraftSaved(false)
    }, 3000)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setGeneratedTicketId(`MNT-${Math.floor(1000 + Math.random() * 9000)}`)
    }, 700)
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setCategory('appliances')
    setUrgency('standard')
    setLocation('kitchen')
    setDescription(
      'Kitchen sink garbage disposal is jammed and leaking slightly under the cabinet when water runs. Motor makes a low humming sound.',
    )
    setPermission('granted')
    setAttachedFiles([
      {
        id: 'f-1',
        name: 'kitchen-sink-leak-pipe.jpg',
        size: '2.4 MB',
        type: 'image',
        uploadedAt: 'Today, 10:14 AM',
      },
      {
        id: 'f-2',
        name: 'disposal-motor-hum.mp4',
        size: '8.1 MB',
        type: 'video',
        uploadedAt: 'Today, 10:16 AM',
      },
    ])
  }

  return (
    <div data-slot="maintenance-request-ticket" className={cn('w-full space-y-6', className)}>
      {/* Header Banner */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  Submit Maintenance Request
                </h1>
                <Badge variant="outline" className="gap-1.5 font-mono text-xs">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Unit 4B · Pacific Heights
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                Resident: <span className="text-foreground font-medium">Elena Rostova</span> · Facility maintenance &
                repair portal
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="bg-muted/60 border-border inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
                </span>
                <span className="text-foreground font-medium">1 In Progress</span>
                <span className="text-muted-foreground hidden sm:inline">· #MNT-8821</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 shadow-xs"
                onClick={() => setShowOpenRequests(!showOpenRequests)}
              >
                <span>{showOpenRequests ? 'Hide Open Requests' : 'View Open Requests'}</span>
                <ChevronDown
                  className={cn('size-3.5 transition-transform duration-200', showOpenRequests && 'rotate-180')}
                />
              </Button>
            </div>
          </div>

          {/* Collapsible Active Work Orders Panel */}
          {showOpenRequests && (
            <div className="border-border bg-muted/30 mt-4 space-y-3 rounded-lg border p-4 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="text-muted-foreground size-4" />
                  <span className="text-foreground text-xs font-semibold tracking-wider uppercase">
                    Currently Active Work Orders (1)
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Technician Assigned
                </Badge>
              </div>
              <div className="bg-card border-border flex flex-col justify-between gap-3 rounded-md border p-3 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-semibold">
                      #MNT-8821 · HVAC Filter & Thermostat Inspection
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Living Room
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Assigned to: <span className="text-foreground font-medium">Dave Miller (Lead HVAC Specialist)</span>{' '}
                    · Scheduled window: Today 2:00 PM – 4:00 PM
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="info" className="text-xs">
                    In Progress
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Left Column: Work Order Form (8 cols) */}
        <div className="space-y-6 lg:col-span-8">
          {/* Submission Success State */}
          {isSubmitted ? (
            <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-xs dark:bg-emerald-950/20">
              <CardContent className="space-y-4 p-6 text-center sm:p-8">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-foreground text-xl font-bold">Maintenance Request Submitted!</h2>
                  <p className="text-muted-foreground mx-auto max-w-md text-sm">
                    Your request <span className="text-foreground font-mono font-semibold">#{generatedTicketId}</span>{' '}
                    has been logged and dispatched to the Pacific Heights Facility Operations team.
                  </p>
                </div>
                <div className="border-border bg-card mx-auto max-w-lg space-y-2 rounded-lg border p-4 text-left text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ticket ID:</span>
                    <span className="text-foreground font-mono font-medium">#{generatedTicketId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unit:</span>
                    <span className="text-foreground font-medium">Unit 4B (Pacific Heights)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="text-foreground font-medium capitalize">{category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Urgency Tier:</span>
                    <span className="text-foreground font-medium capitalize">{urgency} SLA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entry Authorization:</span>
                    <span className="text-foreground font-medium">
                      {permission === 'granted' ? 'Permission Granted (Master Key)' : 'Call Resident First'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <Button className="gap-1.5 shadow-xs" onClick={handleReset}>
                    <RefreshCw className="size-4" />
                    <span>Submit Another Request</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border shadow-xs">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Work Order Details</CardTitle>
                <CardDescription>Complete the fields below to schedule a maintenance technician visit.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* 1. Category Selection Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-foreground text-sm font-semibold">
                      1. Issue Category <span className="text-destructive">*</span>
                    </label>
                    <span className="text-muted-foreground text-xs">Select one primary discipline</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {categories.map((cat) => {
                      const Icon = cat.icon
                      const isSelected = category === cat.id
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          aria-pressed={isSelected}
                          className={cn(
                            'group focus-visible:ring-ring relative flex cursor-pointer flex-col items-start gap-2.5 rounded-lg border p-3.5 text-left transition-all outline-none select-none focus-visible:ring-2',
                            isSelected
                              ? 'border-primary bg-primary/5 ring-primary/30 shadow-xs ring-1'
                              : 'border-border bg-card hover:bg-muted/40 hover:border-muted-foreground/30',
                          )}
                          onClick={() => setCategory(cat.id)}
                        >
                          <div className="flex w-full items-center justify-between">
                            <div className={cn('flex size-8 items-center justify-center rounded-md', cat.badgeColor)}>
                              <Icon className="size-4.5" />
                            </div>
                            <div
                              className={cn(
                                'flex size-4 items-center justify-center rounded-full border transition-colors',
                                isSelected
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-muted-foreground/30 opacity-0 group-hover:opacity-60',
                              )}
                            >
                              {isSelected && <Check className="size-2.5 stroke-[3]" />}
                            </div>
                          </div>
                          <div>
                            <p className="text-foreground text-xs font-semibold">{cat.label}</p>
                            <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">{cat.description}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                {/* 2. Urgency Level Radios */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-foreground text-sm font-semibold">
                      2. Urgency Priority <span className="text-destructive">*</span>
                    </label>
                    <span className="text-muted-foreground text-xs">Determines facility response window</span>
                  </div>

                  {/* Emergency Banner Alert if High Selected */}
                  {urgency === 'emergency' && (
                    <div className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-3 rounded-lg border p-3.5 text-xs">
                      <AlertCircle className="mt-0.5 size-4 shrink-0" />
                      <div className="space-y-1">
                        <p className="font-semibold">High / Emergency SLA Activated</p>
                        <p className="text-destructive/90 leading-relaxed">
                          Emergency requests notify on-call building engineers immediately. For active gas leaks or
                          major structural flooding, call the 24/7 hotline directly at <strong>(415) 555-0192</strong>.
                        </p>
                      </div>
                    </div>
                  )}

                  <RadioGroup
                    value={urgency}
                    onValueChange={(val) => setUrgency(val as 'routine' | 'standard' | 'emergency')}
                    className="grid gap-3 sm:grid-cols-3"
                  >
                    {urgencyOptions.map((opt) => (
                      <div
                        key={opt.value}
                        className={cn(
                          'border-border relative flex cursor-pointer flex-col justify-between gap-3 rounded-lg border p-3.5 transition-all',
                          urgency === opt.value
                            ? 'border-primary bg-primary/5 ring-primary/30 shadow-xs ring-1'
                            : 'bg-card hover:bg-muted/40 hover:border-muted-foreground/30',
                        )}
                        onClick={() => setUrgency(opt.value as any)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <RadioGroupItem id={`urgency-${opt.value}`} value={opt.value} />
                            <label
                              htmlFor={`urgency-${opt.value}`}
                              className="text-foreground cursor-pointer text-xs font-semibold select-none"
                            >
                              {opt.label}
                            </label>
                          </div>
                        </div>
                        <div>
                          <Badge variant={opt.badgeVariant} className="mb-1 text-xs">
                            {opt.badge}
                          </Badge>
                          <p className="text-muted-foreground text-xs leading-relaxed">{opt.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Separator />

                {/* 3. Location in Unit */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-foreground text-sm font-semibold">
                      3. Location in Unit <span className="text-destructive">*</span>
                    </label>
                    <span className="text-muted-foreground text-xs">Specific area or room</span>
                  </div>

                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select location in unit..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Unit 4B Interior Areas</SelectLabel>
                        {locationOptions.map((loc) => (
                          <SelectItem key={loc.value} value={loc.value}>
                            {loc.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* 4. Issue Description */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="mnt-description" className="text-foreground text-sm font-semibold">
                      4. Issue Description <span className="text-destructive">*</span>
                    </label>
                    <span
                      className={cn(
                        'text-xs',
                        descriptionLength > maxChars ? 'text-destructive font-medium' : 'text-muted-foreground',
                      )}
                    >
                      {descriptionLength} / {maxChars}
                    </span>
                  </div>

                  <Textarea
                    id="mnt-description"
                    value={description}
                    onValueChange={setDescription}
                    rows={4}
                    placeholder="Please describe the maintenance issue with as much detail as possible..."
                    className="w-full text-sm"
                  />

                  {/* Quick Snippet Helper Chips */}
                  <div className="space-y-1.5">
                    <p className="text-muted-foreground text-xs">Quick details:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {quickSnippets.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          className="bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-xs transition-colors"
                          onClick={() => appendSnippet(chip)}
                        >
                          <Plus className="size-3" />
                          <span>{chip}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 5. Permission to Enter Unit */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-foreground text-sm font-semibold">
                      5. Permission to Enter Unit <span className="text-destructive">*</span>
                    </label>
                    <span className="text-muted-foreground text-xs">Access protocol</span>
                  </div>

                  <RadioGroup
                    value={permission}
                    onValueChange={(val) => setPermission(val as 'granted' | 'call_first')}
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    <div
                      className={cn(
                        'border-border relative flex cursor-pointer flex-col justify-between gap-2.5 rounded-lg border p-4 transition-all',
                        permission === 'granted'
                          ? 'border-primary bg-primary/5 ring-primary/30 shadow-xs ring-1'
                          : 'bg-card hover:bg-muted/40 hover:border-muted-foreground/30',
                      )}
                      onClick={() => setPermission('granted')}
                    >
                      <div className="flex items-start gap-2.5">
                        <RadioGroupItem id="perm-granted" value="granted" className="mt-0.5" />
                        <div className="space-y-1">
                          <label
                            htmlFor="perm-granted"
                            className="text-foreground cursor-pointer text-xs font-semibold select-none"
                          >
                            Permission Granted to Enter
                          </label>
                          <p className="text-muted-foreground text-xs leading-relaxed">
                            Authorized staff may enter with master key if resident is not home. Work order sign-off
                            notice will be left in unit.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 pl-6 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <UserCheck className="size-3.5" />
                        <span>Faster dispatch window</span>
                      </div>
                    </div>

                    <div
                      className={cn(
                        'border-border relative flex cursor-pointer flex-col justify-between gap-2.5 rounded-lg border p-4 transition-all',
                        permission === 'call_first'
                          ? 'border-primary bg-primary/5 ring-primary/30 shadow-xs ring-1'
                          : 'bg-card hover:bg-muted/40 hover:border-muted-foreground/30',
                      )}
                      onClick={() => setPermission('call_first')}
                    >
                      <div className="flex items-start gap-2.5">
                        <RadioGroupItem id="perm-call" value="call_first" className="mt-0.5" />
                        <div className="space-y-1">
                          <label
                            htmlFor="perm-call"
                            className="text-foreground cursor-pointer text-xs font-semibold select-none"
                          >
                            Call Resident Before Entering
                          </label>
                          <p className="text-muted-foreground text-xs leading-relaxed">
                            Technician must call <span className="text-foreground font-medium">(415) 890-4412</span> 30
                            mins prior to arrival. Adult must be present.
                          </p>
                        </div>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-1.5 pl-6 text-xs">
                        <Clock className="size-3.5" />
                        <span>Requires resident appointment</span>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* 6. Photo & Video Dropzone */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-foreground text-sm font-semibold">
                      6. Photo & Video Dropzone{' '}
                      <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
                    </label>
                    <span className="text-muted-foreground text-xs">{attachedFiles.length} Attached</span>
                  </div>

                  {/* Interactive Drop Area */}
                  <div
                    className={cn(
                      'cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-all',
                      isDragging
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-muted/20 hover:border-muted-foreground/40 hover:bg-muted/40',
                    )}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragging(true)
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault()
                      setIsDragging(false)
                    }}
                    onDrop={handleDrop}
                    onClick={simulateAddFile}
                  >
                    <div className="bg-muted text-muted-foreground mx-auto flex size-10 items-center justify-center rounded-full">
                      <UploadCloud className="size-5" />
                    </div>
                    <div className="mt-2.5 space-y-1">
                      <p className="text-foreground text-xs font-medium">
                        <span className="text-primary font-semibold hover:underline">Click to upload</span> or drag and
                        drop media files
                      </p>
                      <p className="text-muted-foreground text-xs">
                        PNG, JPG, HEIC, MP4 up to 25MB (helps technician arrive with correct parts)
                      </p>
                    </div>
                  </div>

                  {/* Attached Files Previews */}
                  {attachedFiles.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {attachedFiles.map((f) => (
                        <div
                          key={f.id}
                          className="bg-card border-border flex items-center justify-between gap-3 rounded-lg border p-2.5 text-xs transition-colors"
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
                              {f.type === 'video' ? <FileVideo className="size-4" /> : <FileImage className="size-4" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-foreground truncate font-medium">{f.name}</p>
                              <p className="text-muted-foreground text-xs">
                                {f.size} · {f.uploadedAt}
                              </p>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <Badge
                              variant="outline"
                              className="border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-400"
                            >
                              Attached
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-muted-foreground hover:text-destructive size-7"
                              onClick={() => removeFile(f.id)}
                            >
                              <Trash2 className="size-3.5" />
                              <span className="sr-only">Remove file</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="border-border bg-muted/20 flex flex-col-reverse justify-between gap-3 border-t p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="shadow-xs"
                    disabled={isSubmitting}
                    onClick={handleSaveDraft}
                  >
                    <span>{draftSaved ? 'Draft Saved!' : 'Save as Draft'}</span>
                  </Button>
                  {draftSaved && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                      <Check className="size-3" />
                      Saved locally
                    </span>
                  )}
                </div>

                <Button
                  size="default"
                  className="w-full gap-2 shadow-xs sm:w-auto"
                  disabled={isSubmitting || !description.trim()}
                  onClick={handleSubmit}
                >
                  {!isSubmitting ? <Wrench className="size-4" /> : <RefreshCw className="size-4 animate-spin" />}
                  <span>{isSubmitting ? 'Dispatching Work Order...' : 'Submit Maintenance Request'}</span>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Right Column: Emergency & SLA Sidebar (4 cols) */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:col-span-4">
          {/* 24/7 Emergency Maintenance Hotline Card */}
          <Card className="border-destructive/40 bg-destructive/5 dark:bg-destructive/10 shadow-xs">
            <CardHeader className="pb-3">
              <div className="text-destructive flex items-center gap-2">
                <ShieldAlert className="size-5 shrink-0" />
                <CardTitle className="text-destructive text-base">24/7 Emergency Hotline</CardTitle>
              </div>
              <CardDescription className="text-foreground/80 text-xs">
                For urgent situations threatening life safety, gas leaks, or active flooding.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-card border-destructive/30 space-y-1 rounded-lg border p-3 text-center">
                <p className="text-muted-foreground text-xs font-medium">Immediate Dispatch Phone</p>
                <p className="text-foreground font-mono text-xl font-semibold tracking-tight">(415) 555-0192</p>
                <p className="text-muted-foreground text-xs">Facility Operations On-Call Desk</p>
              </div>

              <div className="space-y-2">
                <p className="text-foreground text-xs font-semibold">What qualifies as an emergency:</p>
                <ul className="text-muted-foreground space-y-1.5 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Active uncontrolled water leaks or burst pipes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Smell of natural gas or carbon monoxide alert</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Complete electrical power loss in unit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Inoperable exterior lock or door security issue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-bold">•</span>
                    <span>Total loss of heating when temp is below 55°F</span>
                  </li>
                </ul>
              </div>

              <Button asChild variant="destructive" className="w-full gap-2 shadow-xs">
                <a href="tel:4155550192">
                  <PhoneCall className="size-4" />
                  <span>Call Emergency Dispatch</span>
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Service Level Agreement (SLA) Card */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Clock className="text-primary size-4.5" />
                <CardTitle className="text-base">Service Level Agreement (SLA)</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Response benchmarks for Pacific Heights property maintenance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <div className="bg-muted/40 border-border space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-destructive size-2 rounded-full" />
                    <span className="text-foreground text-xs font-semibold">Emergency Priority</span>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    &lt; 2 Hours
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  24/7/365 immediate dispatch with on-call technician response.
                </p>
              </div>

              <div className="bg-muted/40 border-border space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-secondary-foreground size-2 rounded-full" />
                    <span className="text-foreground text-xs font-semibold">Standard Priority</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    24–48 Hours
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  Standard repairs scheduled Mon–Fri during normal operational hours.
                </p>
              </div>

              <div className="bg-muted/40 border-border space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-muted-foreground size-2 rounded-full" />
                    <span className="text-foreground text-xs font-semibold">Routine / Preventative</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    3–5 Days
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  Filter changes, caulking touch-ups, and scheduled inspections.
                </p>
              </div>

              <div className="border-border bg-card flex items-start gap-2.5 rounded-lg border p-3 text-xs">
                <ShieldCheck className="text-primary mt-0.5 size-4 shrink-0" />
                <p className="text-muted-foreground leading-relaxed">
                  Status notifications are automatically sent via SMS and resident email as work orders progress.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Building Operations Info Card */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="text-muted-foreground size-4.5" />
                <CardTitle className="text-base">Building Operations</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="border-border/60 flex justify-between border-b py-1">
                <span className="text-muted-foreground">Building Super:</span>
                <span className="text-foreground font-medium">Marcus Vance (Office #102)</span>
              </div>
              <div className="border-border/60 flex justify-between border-b py-1">
                <span className="text-muted-foreground">Service Window:</span>
                <span className="text-foreground font-medium">Mon – Sat · 8:00 AM – 6:00 PM</span>
              </div>
              <div className="border-border/60 flex justify-between border-b py-1">
                <span className="text-muted-foreground">Quiet Hours:</span>
                <span className="text-foreground font-medium">10:00 PM – 8:00 AM</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Resident Portal ID:</span>
                <span className="text-foreground font-mono font-medium">PH-RES-4B</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MaintenanceRequestTicket
