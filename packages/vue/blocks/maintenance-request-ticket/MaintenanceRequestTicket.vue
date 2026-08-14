<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
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
} from 'lucide-vue-next'
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
  class?: HTMLAttributes['class']
  initialCategory?: string
  initialUrgency?: 'routine' | 'standard' | 'emergency'
  initialLocation?: string
  initialDescription?: string
  initialPermission?: 'granted' | 'call_first'
  initialFiles?: AttachedFile[]
}

const props = withDefaults(defineProps<MaintenanceRequestTicketProps>(), {
  initialCategory: 'appliances',
  initialUrgency: 'standard',
  initialLocation: 'kitchen',
  initialDescription:
    'Kitchen sink garbage disposal is jammed and leaking slightly under the cabinet when water runs. Motor makes a low humming sound.',
  initialPermission: 'granted',
  initialFiles: () => [
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
  ],
})

// Form state
const category = ref<string>(props.initialCategory)
const urgency = ref<'routine' | 'standard' | 'emergency'>(props.initialUrgency)
const location = ref<string>(props.initialLocation)
const description = ref<string>(props.initialDescription)
const permission = ref<'granted' | 'call_first'>(props.initialPermission)
const attachedFiles = ref<AttachedFile[]>([...props.initialFiles])
const isDragging = ref(false)
const showOpenRequests = ref(false)
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const draftSaved = ref(false)
const generatedTicketId = ref('MNT-9042')

// Category options
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

// Urgency options
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

// Location options
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

// Sample quick description chips
const quickSnippets = [
  'Motor humming but not spinning',
  'Water leaking under sink',
  'Reset button tripped',
  'Slow draining',
]

const maxChars = 500
const descriptionLength = computed(() => description.value.length)

function selectCategory(id: string) {
  category.value = id
}

function appendSnippet(snippet: string) {
  if (!description.value) {
    description.value = snippet
  } else if (!description.value.includes(snippet)) {
    description.value = `${description.value.trim()} ${snippet}.`
  }
}

function removeFile(id: string) {
  attachedFiles.value = attachedFiles.value.filter((f) => f.id !== id)
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      const file = e.dataTransfer.files[i]
      attachedFiles.value.push({
        id: `f-${Date.now()}-${i}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type.startsWith('video') ? 'video' : 'image',
        uploadedAt: 'Just now',
      })
    }
  }
}

function simulateAddFile() {
  const sampleNames = ['cabinet-water-mark.jpg', 'under-sink-plumbing.jpg', 'noise-recording.mp4']
  const randomName = sampleNames[attachedFiles.value.length % sampleNames.length]
  attachedFiles.value.push({
    id: `f-${Date.now()}`,
    name: randomName,
    size: '3.1 MB',
    type: randomName.endsWith('.mp4') ? 'video' : 'image',
    uploadedAt: 'Just now',
  })
}

function handleSaveDraft() {
  draftSaved.value = true
  setTimeout(() => {
    draftSaved.value = false
  }, 3000)
}

function handleSubmit() {
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    isSubmitted.value = true
    generatedTicketId.value = `MNT-${Math.floor(1000 + Math.random() * 9000)}`
  }, 700)
}

function handleReset() {
  isSubmitted.value = false
  category.value = 'appliances'
  urgency.value = 'standard'
  location.value = 'kitchen'
  description.value =
    'Kitchen sink garbage disposal is jammed and leaking slightly under the cabinet when water runs. Motor makes a low humming sound.'
  permission.value = 'granted'
  attachedFiles.value = [
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
}
</script>

<template>
  <div data-slot="maintenance-request-ticket" :class="cn('w-full space-y-6', props.class)">
    <!-- Header Banner -->
    <Card class="border-border shadow-xs">
      <CardContent class="p-4 sm:p-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2.5">
              <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">Submit Maintenance Request</h1>
              <Badge variant="outline" class="gap-1.5 font-mono text-xs">
                <span class="size-1.5 rounded-full bg-emerald-500"></span>
                Unit 4B · Pacific Heights
              </Badge>
            </div>
            <p class="text-muted-foreground text-sm">
              Resident: <span class="text-foreground font-medium">Elena Rostova</span> · Facility maintenance & repair
              portal
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <div class="bg-muted/60 border-border inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs">
              <span class="relative flex size-2">
                <span class="absolute inline-flex size-full rounded-full bg-amber-400 opacity-75"></span>
                <span class="relative inline-flex size-2 rounded-full bg-amber-500"></span>
              </span>
              <span class="text-foreground font-medium">1 In Progress</span>
              <span class="text-muted-foreground hidden sm:inline">· #MNT-8821</span>
            </div>
            <Button variant="outline" size="sm" class="gap-1.5 shadow-xs" @click="showOpenRequests = !showOpenRequests">
              <span>{{ showOpenRequests ? 'Hide Open Requests' : 'View Open Requests' }}</span>
              <ChevronDown
                :class="cn('size-3.5 transition-transform duration-200', showOpenRequests && 'rotate-180')"
              />
            </Button>
          </div>
        </div>

        <!-- Collapsible Active Work Orders Panel -->
        <div
          v-if="showOpenRequests"
          class="border-border bg-muted/30 mt-4 space-y-3 rounded-lg border p-4 transition-all"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Clock class="text-muted-foreground size-4" />
              <span class="text-foreground text-xs font-semibold tracking-wider uppercase">
                Currently Active Work Orders (1)
              </span>
            </div>
            <Badge variant="secondary" class="text-xs">Technician Assigned</Badge>
          </div>
          <div
            class="bg-card border-border flex flex-col justify-between gap-3 rounded-md border p-3 sm:flex-row sm:items-center"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-foreground text-sm font-semibold"
                  >#MNT-8821 · HVAC Filter & Thermostat Inspection</span
                >
                <Badge variant="outline" class="text-xs">Living Room</Badge>
              </div>
              <p class="text-muted-foreground text-xs">
                Assigned to: <span class="text-foreground font-medium">Dave Miller (Lead HVAC Specialist)</span> ·
                Scheduled window: Today 2:00 PM – 4:00 PM
              </p>
            </div>
            <div class="flex shrink-0 items-center gap-2">
              <Badge variant="info" class="text-xs">In Progress</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Main 2-Column Layout -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      <!-- Left Column: Work Order Form (8 cols) -->
      <div class="space-y-6 lg:col-span-8">
        <!-- Submission Success State -->
        <Card v-if="isSubmitted" class="border-emerald-500/30 bg-emerald-500/5 shadow-xs dark:bg-emerald-950/20">
          <CardContent class="space-y-4 p-6 text-center sm:p-8">
            <div
              class="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 class="size-8" />
            </div>
            <div class="space-y-2">
              <h2 class="text-foreground text-xl font-bold">Maintenance Request Submitted!</h2>
              <p class="text-muted-foreground mx-auto max-w-md text-sm">
                Your request <span class="text-foreground font-mono font-semibold">#{{ generatedTicketId }}</span> has
                been logged and dispatched to the Pacific Heights Facility Operations team.
              </p>
            </div>
            <div class="border-border bg-card mx-auto max-w-lg space-y-2 rounded-lg border p-4 text-left text-xs">
              <div class="flex justify-between">
                <span class="text-muted-foreground">Ticket ID:</span>
                <span class="text-foreground font-mono font-medium">#{{ generatedTicketId }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Unit:</span>
                <span class="text-foreground font-medium">Unit 4B (Pacific Heights)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Category:</span>
                <span class="text-foreground font-medium capitalize">{{ category }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Urgency Tier:</span>
                <span class="text-foreground font-medium capitalize">{{ urgency }} SLA</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">Entry Authorization:</span>
                <span class="text-foreground font-medium">
                  {{ permission === 'granted' ? 'Permission Granted (Master Key)' : 'Call Resident First' }}
                </span>
              </div>
            </div>
            <div class="flex flex-wrap justify-center gap-3 pt-2">
              <Button class="gap-1.5 shadow-xs" @click="handleReset">
                <RefreshCw class="size-4" />
                <span>Submit Another Request</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Work Order Submission Form -->
        <Card v-else class="border-border shadow-xs">
          <CardHeader class="pb-4">
            <CardTitle class="text-lg">Work Order Details</CardTitle>
            <CardDescription> Complete the fields below to schedule a maintenance technician visit. </CardDescription>
          </CardHeader>

          <CardContent class="space-y-6">
            <!-- 1. Category Selection Grid -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-foreground text-sm font-semibold">
                  1. Issue Category <span class="text-destructive">*</span>
                </label>
                <span class="text-muted-foreground text-xs">Select one primary discipline</span>
              </div>

              <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  type="button"
                  :aria-pressed="category === cat.id"
                  :class="
                    cn(
                      'group focus-visible:ring-ring relative flex cursor-pointer flex-col items-start gap-2.5 rounded-lg border p-3.5 text-left transition-all outline-none select-none focus-visible:ring-2',
                      category === cat.id
                        ? 'border-primary bg-primary/5 ring-primary/30 shadow-xs ring-1'
                        : 'border-border bg-card hover:bg-muted/40 hover:border-muted-foreground/30',
                    )
                  "
                  @click="selectCategory(cat.id)"
                >
                  <div class="flex w-full items-center justify-between">
                    <div :class="cn('flex size-8 items-center justify-center rounded-md', cat.badgeColor)">
                      <component :is="cat.icon" class="size-4.5" />
                    </div>
                    <div
                      :class="
                        cn(
                          'flex size-4 items-center justify-center rounded-full border transition-colors',
                          category === cat.id
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground/30 opacity-0 group-hover:opacity-60',
                        )
                      "
                    >
                      <Check v-if="category === cat.id" class="size-2.5 stroke-[3]" />
                    </div>
                  </div>
                  <div>
                    <p class="text-foreground text-xs font-semibold">{{ cat.label }}</p>
                    <p class="text-muted-foreground mt-0.5 line-clamp-1 text-xs">{{ cat.description }}</p>
                  </div>
                </button>
              </div>
            </div>

            <Separator />

            <!-- 2. Urgency Level Radios -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-foreground text-sm font-semibold">
                  2. Urgency Priority <span class="text-destructive">*</span>
                </label>
                <span class="text-muted-foreground text-xs">Determines facility response window</span>
              </div>

              <!-- Emergency Banner Alert if High Selected -->
              <div
                v-if="urgency === 'emergency'"
                class="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-3 rounded-lg border p-3.5 text-xs"
              >
                <AlertCircle class="mt-0.5 size-4 shrink-0" />
                <div class="space-y-1">
                  <p class="font-semibold">High / Emergency SLA Activated</p>
                  <p class="text-destructive/90 leading-relaxed">
                    Emergency requests notify on-call building engineers immediately. For active gas leaks or major
                    structural flooding, call the 24/7 hotline directly at <strong>(415) 555-0192</strong>.
                  </p>
                </div>
              </div>

              <RadioGroup v-model="urgency" class="grid gap-3 sm:grid-cols-3">
                <div
                  v-for="opt in urgencyOptions"
                  :key="opt.value"
                  :class="
                    cn(
                      'border-border relative flex cursor-pointer flex-col justify-between gap-3 rounded-lg border p-3.5 transition-all',
                      urgency === opt.value
                        ? 'border-primary bg-primary/5 ring-primary/30 shadow-xs ring-1'
                        : 'bg-card hover:bg-muted/40 hover:border-muted-foreground/30',
                    )
                  "
                  @click="urgency = opt.value as any"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex items-center gap-2">
                      <RadioGroupItem :id="`urgency-${opt.value}`" :value="opt.value" />
                      <label
                        :for="`urgency-${opt.value}`"
                        class="text-foreground cursor-pointer text-xs font-semibold select-none"
                      >
                        {{ opt.label }}
                      </label>
                    </div>
                  </div>
                  <div>
                    <Badge :variant="opt.badgeVariant" class="mb-1 text-xs">
                      {{ opt.badge }}
                    </Badge>
                    <p class="text-muted-foreground text-xs leading-relaxed">
                      {{ opt.description }}
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <!-- 3. Location in Unit -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-foreground text-sm font-semibold">
                  3. Location in Unit <span class="text-destructive">*</span>
                </label>
                <span class="text-muted-foreground text-xs">Specific area or room</span>
              </div>

              <Select v-model="location">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select location in unit..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Unit 4B Interior Areas</SelectLabel>
                    <SelectItem v-for="loc in locationOptions" :key="loc.value" :value="loc.value">
                      {{ loc.label }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <!-- 4. Issue Description -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label for="mnt-description" class="text-foreground text-sm font-semibold">
                  4. Issue Description <span class="text-destructive">*</span>
                </label>
                <span
                  class="text-xs"
                  :class="descriptionLength > maxChars ? 'text-destructive font-medium' : 'text-muted-foreground'"
                >
                  {{ descriptionLength }} / {{ maxChars }}
                </span>
              </div>

              <Textarea
                id="mnt-description"
                v-model="description"
                :rows="4"
                placeholder="Please describe the maintenance issue with as much detail as possible..."
                class="w-full text-sm"
              />

              <!-- Quick Snippet Helper Chips -->
              <div class="space-y-1.5">
                <p class="text-muted-foreground text-xs">Quick details:</p>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="chip in quickSnippets"
                    :key="chip"
                    type="button"
                    class="bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-xs transition-colors"
                    @click="appendSnippet(chip)"
                  >
                    <Plus class="size-3" />
                    <span>{{ chip }}</span>
                  </button>
                </div>
              </div>
            </div>

            <Separator />

            <!-- 5. Permission to Enter Unit -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-foreground text-sm font-semibold">
                  5. Permission to Enter Unit <span class="text-destructive">*</span>
                </label>
                <span class="text-muted-foreground text-xs">Access protocol</span>
              </div>

              <RadioGroup v-model="permission" class="grid gap-3 sm:grid-cols-2">
                <div
                  :class="
                    cn(
                      'border-border relative flex cursor-pointer flex-col justify-between gap-2.5 rounded-lg border p-4 transition-all',
                      permission === 'granted'
                        ? 'border-primary bg-primary/5 ring-primary/30 shadow-xs ring-1'
                        : 'bg-card hover:bg-muted/40 hover:border-muted-foreground/30',
                    )
                  "
                  @click="permission = 'granted'"
                >
                  <div class="flex items-start gap-2.5">
                    <RadioGroupItem id="perm-granted" value="granted" class="mt-0.5" />
                    <div class="space-y-1">
                      <label
                        for="perm-granted"
                        class="text-foreground cursor-pointer text-xs font-semibold select-none"
                      >
                        Permission Granted to Enter
                      </label>
                      <p class="text-muted-foreground text-xs leading-relaxed">
                        Authorized staff may enter with master key if resident is not home. Work order sign-off notice
                        will be left in unit.
                      </p>
                    </div>
                  </div>
                  <div
                    class="flex items-center gap-1.5 pl-6 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                  >
                    <UserCheck class="size-3.5" />
                    <span>Faster dispatch window</span>
                  </div>
                </div>

                <div
                  :class="
                    cn(
                      'border-border relative flex cursor-pointer flex-col justify-between gap-2.5 rounded-lg border p-4 transition-all',
                      permission === 'call_first'
                        ? 'border-primary bg-primary/5 ring-primary/30 shadow-xs ring-1'
                        : 'bg-card hover:bg-muted/40 hover:border-muted-foreground/30',
                    )
                  "
                  @click="permission = 'call_first'"
                >
                  <div class="flex items-start gap-2.5">
                    <RadioGroupItem id="perm-call" value="call_first" class="mt-0.5" />
                    <div class="space-y-1">
                      <label for="perm-call" class="text-foreground cursor-pointer text-xs font-semibold select-none">
                        Call Resident Before Entering
                      </label>
                      <p class="text-muted-foreground text-xs leading-relaxed">
                        Technician must call <span class="text-foreground font-medium">(415) 890-4412</span> 30 mins
                        prior to arrival. Adult must be present.
                      </p>
                    </div>
                  </div>
                  <div class="text-muted-foreground flex items-center gap-1.5 pl-6 text-xs">
                    <Clock class="size-3.5" />
                    <span>Requires resident appointment</span>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <!-- 6. Photo & Video Dropzone -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-foreground text-sm font-semibold">
                  6. Photo & Video Dropzone <span class="text-muted-foreground text-xs font-normal">(Optional)</span>
                </label>
                <span class="text-muted-foreground text-xs">{{ attachedFiles.length }} Attached</span>
              </div>

              <!-- Interactive Drop Area -->
              <div
                :class="
                  cn(
                    'cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-all',
                    isDragging
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-muted/20 hover:border-muted-foreground/40 hover:bg-muted/40',
                  )
                "
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop="handleDrop"
                @click="simulateAddFile"
              >
                <div
                  class="bg-muted text-muted-foreground mx-auto flex size-10 items-center justify-center rounded-full"
                >
                  <UploadCloud class="size-5" />
                </div>
                <div class="mt-2.5 space-y-1">
                  <p class="text-foreground text-xs font-medium">
                    <span class="text-primary font-semibold hover:underline">Click to upload</span> or drag and drop
                    media files
                  </p>
                  <p class="text-muted-foreground text-xs">
                    PNG, JPG, HEIC, MP4 up to 25MB (helps technician arrive with correct parts)
                  </p>
                </div>
              </div>

              <!-- Attached Files Previews -->
              <div v-if="attachedFiles.length > 0" class="space-y-2 pt-1">
                <div
                  v-for="f in attachedFiles"
                  :key="f.id"
                  class="bg-card border-border flex items-center justify-between gap-3 rounded-lg border p-2.5 text-xs transition-colors"
                >
                  <div class="flex min-w-0 items-center gap-2.5">
                    <div class="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
                      <FileVideo v-if="f.type === 'video'" class="size-4" />
                      <FileImage v-else class="size-4" />
                    </div>
                    <div class="min-w-0">
                      <p class="text-foreground truncate font-medium">{{ f.name }}</p>
                      <p class="text-muted-foreground text-xs">{{ f.size }} · {{ f.uploadedAt }}</p>
                    </div>
                  </div>
                  <div class="flex shrink-0 items-center gap-2">
                    <Badge
                      variant="outline"
                      class="border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-400"
                    >
                      Attached
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      class="text-muted-foreground hover:text-destructive size-7"
                      @click="removeFile(f.id)"
                    >
                      <Trash2 class="size-3.5" />
                      <span class="sr-only">Remove file</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter
            class="border-border bg-muted/20 flex flex-col-reverse justify-between gap-3 border-t p-4 sm:flex-row sm:items-center"
          >
            <div class="flex items-center gap-2">
              <Button variant="outline" size="sm" class="shadow-xs" :disabled="isSubmitting" @click="handleSaveDraft">
                <span>{{ draftSaved ? 'Draft Saved!' : 'Save as Draft' }}</span>
              </Button>
              <span v-if="draftSaved" class="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <Check class="size-3" />
                Saved locally
              </span>
            </div>

            <Button
              size="default"
              class="w-full gap-2 shadow-xs sm:w-auto"
              :disabled="isSubmitting || !description.trim()"
              @click="handleSubmit"
            >
              <Wrench v-if="!isSubmitting" class="size-4" />
              <RefreshCw v-else class="size-4 animate-spin" />
              <span>{{ isSubmitting ? 'Dispatching Work Order...' : 'Submit Maintenance Request' }}</span>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <!-- Right Column: Emergency & SLA Sidebar (4 cols) -->
      <div class="space-y-6 lg:sticky lg:top-6 lg:col-span-4">
        <!-- 24/7 Emergency Maintenance Hotline Card -->
        <Card class="border-destructive/40 bg-destructive/5 dark:bg-destructive/10 shadow-xs">
          <CardHeader class="pb-3">
            <div class="text-destructive flex items-center gap-2">
              <ShieldAlert class="size-5 shrink-0" />
              <CardTitle class="text-destructive text-base">24/7 Emergency Hotline</CardTitle>
            </div>
            <CardDescription class="text-foreground/80 text-xs">
              For urgent situations threatening life safety, gas leaks, or active flooding.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="bg-card border-destructive/30 space-y-1 rounded-lg border p-3 text-center">
              <p class="text-muted-foreground text-xs font-medium">Immediate Dispatch Phone</p>
              <p class="text-foreground font-mono text-xl font-semibold tracking-tight">(415) 555-0192</p>
              <p class="text-muted-foreground text-xs">Facility Operations On-Call Desk</p>
            </div>

            <div class="space-y-2">
              <p class="text-foreground text-xs font-semibold">What qualifies as an emergency:</p>
              <ul class="text-muted-foreground space-y-1.5 text-xs">
                <li class="flex items-start gap-2">
                  <span class="text-destructive font-bold">•</span>
                  <span>Active uncontrolled water leaks or burst pipes</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-destructive font-bold">•</span>
                  <span>Smell of natural gas or carbon monoxide alert</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-destructive font-bold">•</span>
                  <span>Complete electrical power loss in unit</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-destructive font-bold">•</span>
                  <span>Inoperable exterior lock or door security issue</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-destructive font-bold">•</span>
                  <span>Total loss of heating when temp is below 55°F</span>
                </li>
              </ul>
            </div>

            <Button as="a" href="tel:4155550192" variant="destructive" class="w-full gap-2 shadow-xs">
              <PhoneCall class="size-4" />
              <span>Call Emergency Dispatch</span>
            </Button>
          </CardContent>
        </Card>

        <!-- Service Level Agreement (SLA) Card -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center gap-2">
              <Clock class="text-primary size-4.5" />
              <CardTitle class="text-base">Service Level Agreement (SLA)</CardTitle>
            </div>
            <CardDescription class="text-xs">
              Response benchmarks for Pacific Heights property maintenance.
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-3.5">
            <div class="bg-muted/40 border-border space-y-2 rounded-lg border p-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="bg-destructive size-2 rounded-full"></span>
                  <span class="text-foreground text-xs font-semibold">Emergency Priority</span>
                </div>
                <Badge variant="destructive" class="text-xs">&lt; 2 Hours</Badge>
              </div>
              <p class="text-muted-foreground text-xs">24/7/365 immediate dispatch with on-call technician response.</p>
            </div>

            <div class="bg-muted/40 border-border space-y-2 rounded-lg border p-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="bg-secondary-foreground size-2 rounded-full"></span>
                  <span class="text-foreground text-xs font-semibold">Standard Priority</span>
                </div>
                <Badge variant="secondary" class="text-xs">24–48 Hours</Badge>
              </div>
              <p class="text-muted-foreground text-xs">
                Standard repairs scheduled Mon–Fri during normal operational hours.
              </p>
            </div>

            <div class="bg-muted/40 border-border space-y-2 rounded-lg border p-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="bg-muted-foreground size-2 rounded-full"></span>
                  <span class="text-foreground text-xs font-semibold">Routine / Preventative</span>
                </div>
                <Badge variant="outline" class="text-xs">3–5 Days</Badge>
              </div>
              <p class="text-muted-foreground text-xs">
                Filter changes, caulking touch-ups, and scheduled inspections.
              </p>
            </div>

            <div class="border-border bg-card flex items-start gap-2.5 rounded-lg border p-3 text-xs">
              <ShieldCheck class="text-primary mt-0.5 size-4 shrink-0" />
              <p class="text-muted-foreground leading-relaxed">
                Status notifications are automatically sent via SMS and resident email as work orders progress.
              </p>
            </div>
          </CardContent>
        </Card>

        <!-- Building Operations Info Card -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center gap-2">
              <Building2 class="text-muted-foreground size-4.5" />
              <CardTitle class="text-base">Building Operations</CardTitle>
            </div>
          </CardHeader>
          <CardContent class="space-y-2.5 text-xs">
            <div class="border-border/60 flex justify-between border-b py-1">
              <span class="text-muted-foreground">Building Super:</span>
              <span class="text-foreground font-medium">Marcus Vance (Office #102)</span>
            </div>
            <div class="border-border/60 flex justify-between border-b py-1">
              <span class="text-muted-foreground">Service Window:</span>
              <span class="text-foreground font-medium">Mon – Sat · 8:00 AM – 6:00 PM</span>
            </div>
            <div class="border-border/60 flex justify-between border-b py-1">
              <span class="text-muted-foreground">Quiet Hours:</span>
              <span class="text-foreground font-medium">10:00 PM – 8:00 AM</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-muted-foreground">Resident Portal ID:</span>
              <span class="text-foreground font-mono font-medium">PH-RES-4B</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
