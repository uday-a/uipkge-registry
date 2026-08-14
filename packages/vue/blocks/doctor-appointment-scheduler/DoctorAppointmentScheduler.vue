<script setup lang="ts">
import { ref, computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  BadgeCheck,
  Building2,
  Calendar,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Lock,
  MapPin,
  RotateCcw,
  ShieldCheck,
  Star,
  Stethoscope,
  Sun,
  Sunset,
  Video,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

export interface DoctorAppointmentSchedulerProps {
  doctorName?: string
  doctorTitle?: string
  doctorAvatar?: string
  specialty?: string
  clinicName?: string
  clinicAddress?: string
  rating?: number
  reviewCount?: number
  insurances?: string[]
  initialDate?: string
  initialTime?: string
  initialVisitType?: 'in-person' | 'telehealth'
  initialReason?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<DoctorAppointmentSchedulerProps>(), {
  doctorName: 'Dr. Marcus Thorne, MD, FACC',
  doctorTitle: 'Board-Certified Cardiologist · Cedars-Sinai Heart Institute',
  doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=320&auto=format&fit=crop',
  specialty: 'Cardiology & Internal Medicine',
  clinicName: 'Cedars-Sinai Medical Plaza',
  clinicAddress: 'Cedars-Sinai Medical Plaza, Suite 400, Los Angeles, CA',
  rating: 4.9,
  reviewCount: 240,
  insurances: () => ['BlueCross BlueShield', 'Aetna', 'UnitedHealthcare', 'Medicare', 'Cigna'],
  initialDate: '2026-08-27',
  initialTime: '10:15 AM',
  initialVisitType: 'in-person',
  initialReason: 'chest-pain',
})

// Hardcoded week selector data
const weekDays = [
  { id: '2026-08-24', weekday: 'Mon', day: '24', month: 'Aug', fullDate: 'Monday, Aug 24, 2026', slotsCount: 6 },
  { id: '2026-08-25', weekday: 'Tue', day: '25', month: 'Aug', fullDate: 'Tuesday, Aug 25, 2026', slotsCount: 8 },
  { id: '2026-08-26', weekday: 'Wed', day: '26', month: 'Aug', fullDate: 'Wednesday, Aug 26, 2026', slotsCount: 5 },
  { id: '2026-08-27', weekday: 'Thu', day: '27', month: 'Aug', fullDate: 'Thursday, Aug 27, 2026', slotsCount: 8 },
  { id: '2026-08-28', weekday: 'Fri', day: '28', month: 'Aug', fullDate: 'Friday, Aug 28, 2026', slotsCount: 7 },
  { id: '2026-08-29', weekday: 'Sat', day: '29', month: 'Aug', fullDate: 'Saturday, Aug 29, 2026', slotsCount: 4 },
]

// Available Time Slots
const morningSlots = ['09:00 AM', '09:30 AM', '10:15 AM', '11:00 AM']
const afternoonSlots = ['02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM']

// Reasons for consultation
const visitReasons = [
  {
    value: 'annual-checkup',
    label: 'Annual Checkup',
    description: 'Routine wellness & cardiovascular health screening',
    copay: '$25.00',
  },
  {
    value: 'follow-up',
    label: 'Follow-up',
    description: 'Post-treatment evaluation & diagnostic review',
    copay: '$20.00',
  },
  {
    value: 'chest-pain',
    label: 'Chest Pain Consultation',
    description: 'Comprehensive symptom evaluation & urgent diagnostics',
    copay: '$30.00',
  },
  {
    value: 'medication-review',
    label: 'Medication Review',
    description: 'Prescription adjustment & therapeutic monitoring',
    copay: '$15.00',
  },
  {
    value: 'hypertension-evaluation',
    label: 'Hypertension Evaluation',
    description: 'Blood pressure assessment & ongoing care plan',
    copay: '$25.00',
  },
]

// State
const selectedDate = ref(props.initialDate)
const selectedTime = ref(props.initialTime)
const visitType = ref<'in-person' | 'telehealth'>(props.initialVisitType)
const selectedReason = ref(props.initialReason)
const patientName = ref('Sarah Jenkins')
const patientPhone = ref('+1 (555) 382-9104')
const insurancePolicy = ref('BCBS-90481240')
const notes = ref('Occasional mild tightness after morning workouts; seeking ECG review.')
const isBooked = ref(false)
const bookingReference = ref('APT-84920')
const calendarAdded = ref(false)

// Computed helpers
const currentDateObj = computed(() => {
  return weekDays.find((d) => d.id === selectedDate.value) || weekDays[3]
})

const currentReasonObj = computed(() => {
  return visitReasons.find((r) => r.value === selectedReason.value) || visitReasons[2]
})

const selectedSlotFormatted = computed(() => {
  return `${currentDateObj.value.weekday}, ${currentDateObj.value.month} ${currentDateObj.value.day} at ${selectedTime.value}`
})

const locationText = computed(() => {
  if (visitType.value === 'in-person') {
    return 'In-Person · Room 402, Cedars-Sinai Plaza'
  }
  return 'Video Telehealth · Secure HIPAA Link'
})

function handleBook() {
  if (!patientName.value.trim() || !patientPhone.value.trim()) return
  isBooked.value = true
}

function handleReset() {
  isBooked.value = false
  calendarAdded.value = false
}

function handleAddToCalendar() {
  calendarAdded.value = true
}
</script>

<template>
  <div data-slot="doctor-appointment-scheduler" :class="cn('mx-auto w-full max-w-6xl space-y-6', props.class)">
    <!-- 1. Doctor Profile Hero Card -->
    <Card class="border-border bg-card overflow-hidden shadow-xs">
      <CardContent class="p-6 md:p-8">
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <!-- Left: Avatar + Core Bio -->
          <div class="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div class="relative shrink-0">
              <Avatar class="border-primary/20 bg-muted size-20 rounded-2xl border-2 shadow-xs md:size-24">
                <AvatarImage :src="doctorAvatar" :alt="doctorName" class="rounded-2xl object-cover" />
                <AvatarFallback class="bg-primary/10 text-primary rounded-2xl text-lg font-bold"> MT </AvatarFallback>
              </Avatar>
              <div
                class="absolute -right-1.5 -bottom-1.5 flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 backdrop-blur-sm dark:text-emerald-300"
              >
                <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span>Available</span>
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-foreground text-xl font-bold tracking-tight md:text-2xl">
                  {{ doctorName }}
                </h1>
                <BadgeCheck class="text-primary size-5 shrink-0" aria-label="Verified Doctor" />
              </div>

              <p class="text-muted-foreground text-xs font-normal md:text-sm">
                {{ doctorTitle }}
              </p>

              <div class="flex flex-wrap items-center gap-2 pt-0.5">
                <Badge wrap variant="secondary" class="text-xs font-medium">
                  {{ specialty }}
                </Badge>
                <Badge wrap variant="outline" class="text-muted-foreground border-border text-xs font-medium">
                  16+ Yrs Experience
                </Badge>
                <Badge wrap variant="outline" class="text-muted-foreground border-border text-xs font-medium">
                  Cedars-Sinai Affiliated
                </Badge>
              </div>
            </div>
          </div>

          <!-- Right: Rating, Clinic & Insurance Highlights -->
          <div class="border-border/80 bg-muted/30 flex shrink-0 flex-col gap-2.5 rounded-xl border p-4 md:max-w-xs">
            <div class="flex items-center justify-between gap-3">
              <div class="text-foreground flex items-center gap-1.5">
                <Star class="size-4 shrink-0 fill-amber-500 text-amber-500" />
                <span class="text-sm font-bold tabular-nums">{{ rating }}</span>
                <span class="text-muted-foreground text-xs">({{ reviewCount }} reviews)</span>
              </div>
              <span class="text-xs font-medium text-emerald-600 dark:text-emerald-400">Top Rated</span>
            </div>

            <div class="text-muted-foreground flex items-start gap-2 text-xs">
              <MapPin class="text-primary mt-0.5 size-3.5 shrink-0" />
              <span class="line-clamp-2 leading-relaxed">{{ clinicAddress }}</span>
            </div>

            <div class="text-muted-foreground flex items-start gap-2 text-xs">
              <ShieldCheck class="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span class="line-clamp-2 leading-relaxed"> Accepts BlueCross, Aetna, UnitedHealthcare, Medicare </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 2. Interactive Booking Flow (2-Column) -->
    <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
      <!-- Left Column: Calendar & Slot Picker (7 Cols) -->
      <div class="space-y-6 lg:col-span-7">
        <!-- Step 1: Visit Type Selection -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <div
              class="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs font-bold"
            >
              1
            </div>
            <h2 class="text-foreground text-sm font-semibold">Select Visit Type</h2>
          </div>

          <RadioGroup v-model="visitType" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label
              for="visit-in-person"
              :class="
                cn(
                  'flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-all duration-150',
                  visitType === 'in-person'
                    ? 'border-primary bg-primary/5 ring-primary/30 shadow-xs ring-1'
                    : 'border-border bg-card hover:bg-muted/40',
                )
              "
            >
              <RadioGroupItem id="visit-in-person" value="in-person" class="mt-0.5" />
              <div class="min-w-0 flex-1 space-y-1">
                <div class="flex items-center gap-1.5">
                  <Building2 class="text-primary size-4 shrink-0" />
                  <span class="text-foreground text-sm font-semibold">In-Person Visit</span>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Cedars-Sinai Medical Plaza, Suite 400 · In-office diagnostics & exam
                </p>
              </div>
            </label>

            <label
              for="visit-telehealth"
              :class="
                cn(
                  'flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-all duration-150',
                  visitType === 'telehealth'
                    ? 'border-primary bg-primary/5 ring-primary/30 shadow-xs ring-1'
                    : 'border-border bg-card hover:bg-muted/40',
                )
              "
            >
              <RadioGroupItem id="visit-telehealth" value="telehealth" class="mt-0.5" />
              <div class="min-w-0 flex-1 space-y-1">
                <div class="flex items-center gap-1.5">
                  <Video class="text-primary size-4 shrink-0" />
                  <span class="text-foreground text-sm font-semibold">Video Telehealth</span>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  HD video consultation · HIPAA link sent via SMS & email
                </p>
              </div>
            </label>
          </RadioGroup>
        </div>

        <!-- Step 2: Reason for Visit -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <div
              class="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs font-bold"
            >
              2
            </div>
            <h2 class="text-foreground text-sm font-semibold">Reason for Visit</h2>
          </div>

          <Select v-model="selectedReason">
            <SelectTrigger class="bg-card border-border h-11 w-full rounded-xl px-4 text-sm font-medium">
              <SelectValue placeholder="Choose a clinical reason for consultation" />
            </SelectTrigger>
            <SelectContent class="border-border bg-popover rounded-xl">
              <SelectItem
                v-for="reason in visitReasons"
                :key="reason.value"
                :value="reason.value"
                class="cursor-pointer px-3 py-2.5 text-sm"
              >
                <div class="flex flex-col gap-0.5">
                  <span class="text-foreground font-medium">{{ reason.label }}</span>
                  <span class="text-muted-foreground text-xs">{{ reason.description }}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Step 3: Date Carousel / Week Selector -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div
                class="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs font-bold"
              >
                3
              </div>
              <h2 class="text-foreground text-sm font-semibold">Select Date</h2>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-muted-foreground text-xs font-medium">August 2026</span>
              <div class="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  class="border-border size-7 rounded-lg"
                  aria-label="Previous week"
                >
                  <ChevronLeft class="size-3.5" />
                </Button>
                <Button variant="outline" size="icon-sm" class="border-border size-7 rounded-lg" aria-label="Next week">
                  <ChevronRight class="size-3.5" />
                </Button>
              </div>
            </div>
          </div>

          <!-- 6-Day Carousel Strip -->
          <div class="grid grid-cols-3 gap-2 sm:grid-cols-6">
            <button
              v-for="day in weekDays"
              :key="day.id"
              type="button"
              :class="
                cn(
                  'focus-visible:ring-primary flex cursor-pointer flex-col items-center justify-center rounded-xl border p-3 text-center transition-all duration-150 outline-none focus-visible:ring-2',
                  selectedDate === day.id
                    ? 'border-primary bg-primary text-primary-foreground ring-primary/20 font-semibold shadow-xs ring-2'
                    : 'border-border bg-card hover:bg-muted/50 text-foreground',
                )
              "
              @click="selectedDate = day.id"
            >
              <span
                :class="
                  cn(
                    'text-xs font-medium tracking-wider uppercase',
                    selectedDate === day.id ? 'text-primary-foreground/90' : 'text-muted-foreground',
                  )
                "
              >
                {{ day.weekday }}
              </span>
              <span class="my-0.5 text-xl font-bold tabular-nums">
                {{ day.day }}
              </span>
              <span
                :class="
                  cn(
                    'text-xs font-medium',
                    selectedDate === day.id ? 'text-primary-foreground/80' : 'text-emerald-600 dark:text-emerald-400',
                  )
                "
              >
                {{ day.slotsCount }} slots
              </span>
            </button>
          </div>
        </div>

        <!-- Step 4: Available Time Slots Grid -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div
                class="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs font-bold"
              >
                4
              </div>
              <h2 class="text-foreground text-sm font-semibold">Available Time Slots</h2>
            </div>
            <span class="text-muted-foreground text-xs tabular-nums">
              8 slots on {{ currentDateObj.weekday }}, {{ currentDateObj.month }} {{ currentDateObj.day }}
            </span>
          </div>

          <!-- Morning Section -->
          <div class="border-border/70 bg-card space-y-2 rounded-xl border p-4">
            <div class="text-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
              <Sun class="size-3.5 text-amber-500" />
              <span>Morning Slots</span>
            </div>
            <div class="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-4">
              <button
                v-for="slot in morningSlots"
                :key="slot"
                type="button"
                :class="
                  cn(
                    'focus-visible:ring-primary flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-medium tabular-nums transition-all duration-150 outline-none focus-visible:ring-2',
                    selectedTime === slot
                      ? 'border-primary bg-primary text-primary-foreground ring-primary/30 font-semibold shadow-xs ring-2'
                      : 'border-border bg-background hover:bg-muted/60 text-foreground',
                  )
                "
                @click="selectedTime = slot"
              >
                {{ slot }}
              </button>
            </div>
          </div>

          <!-- Afternoon Section -->
          <div class="border-border/70 bg-card space-y-2 rounded-xl border p-4">
            <div class="text-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
              <Sunset class="size-3.5 text-orange-500" />
              <span>Afternoon Slots</span>
            </div>
            <div class="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-4">
              <button
                v-for="slot in afternoonSlots"
                :key="slot"
                type="button"
                :class="
                  cn(
                    'focus-visible:ring-primary flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-medium tabular-nums transition-all duration-150 outline-none focus-visible:ring-2',
                    selectedTime === slot
                      ? 'border-primary bg-primary text-primary-foreground ring-primary/30 font-semibold shadow-xs ring-2'
                      : 'border-border bg-background hover:bg-muted/60 text-foreground',
                  )
                "
                @click="selectedTime = slot"
              >
                {{ slot }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Appointment Summary Card (5 Cols) -->
      <div class="lg:col-span-5">
        <div class="sticky top-6">
          <!-- State A: Active Booking Form Summary -->
          <Card v-if="!isBooked" class="border-border bg-card overflow-hidden shadow-xs">
            <CardHeader class="border-border/70 bg-muted/20 border-b pb-3">
              <div class="flex items-center justify-between">
                <div class="space-y-0.5">
                  <CardTitle class="text-foreground text-base font-bold"> Appointment Summary </CardTitle>
                  <CardDescription class="text-muted-foreground text-xs">
                    Live schedule & patient registration
                  </CardDescription>
                </div>
                <Badge
                  wrap
                  variant="outline"
                  class="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                >
                  <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span>Slot Held: 09:48</span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent class="space-y-4 p-5">
              <!-- Selected Slot Readout Banner -->
              <div class="border-primary/25 bg-primary/5 space-y-2.5 rounded-xl border p-4">
                <div class="flex items-start gap-2.5">
                  <CalendarCheck class="text-primary mt-0.5 size-4 shrink-0" />
                  <div class="space-y-0.5">
                    <p class="text-muted-foreground text-xs font-medium">Selected Slot</p>
                    <p class="text-foreground text-sm font-bold tabular-nums">
                      {{ selectedSlotFormatted }}
                    </p>
                  </div>
                </div>

                <div class="border-primary/15 flex items-start gap-2.5 border-t pt-1">
                  <Building2 v-if="visitType === 'in-person'" class="text-primary mt-0.5 size-4 shrink-0" />
                  <Video v-else class="text-primary mt-0.5 size-4 shrink-0" />
                  <div class="space-y-0.5">
                    <p class="text-muted-foreground text-xs font-medium">Location / Mode</p>
                    <p class="text-foreground text-xs font-medium">
                      {{ locationText }}
                    </p>
                  </div>
                </div>

                <div class="border-primary/15 flex items-start gap-2.5 border-t pt-1">
                  <Stethoscope class="text-primary mt-0.5 size-4 shrink-0" />
                  <div class="space-y-0.5">
                    <p class="text-muted-foreground text-xs font-medium">Visit Type</p>
                    <p class="text-foreground text-xs font-medium">
                      {{ currentReasonObj.label }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Estimated Copay Readout -->
              <div class="border-border/80 bg-muted/40 flex items-center justify-between rounded-xl border p-3.5">
                <div class="flex items-center gap-2">
                  <ShieldCheck class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <div class="space-y-0.5">
                    <p class="text-muted-foreground text-xs font-medium">Estimated Copay</p>
                    <p class="text-foreground text-xs font-semibold">BlueCross PPO In-Network</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-foreground text-base font-bold tabular-nums">
                    {{ currentReasonObj.copay }}
                  </span>
                  <p class="text-muted-foreground text-xs">Covered at 90%</p>
                </div>
              </div>

              <Separator class="my-2" />

              <!-- Patient Details Form -->
              <div class="space-y-3">
                <p class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Patient Information</p>

                <div class="space-y-1.5">
                  <label for="sched-patient-name" class="text-foreground text-xs font-medium">
                    Full Name <span class="text-destructive">*</span>
                  </label>
                  <Input
                    id="sched-patient-name"
                    v-model="patientName"
                    placeholder="e.g. Sarah Jenkins"
                    class="h-9 text-xs"
                  />
                </div>

                <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <div class="space-y-1.5">
                    <label for="sched-patient-phone" class="text-foreground text-xs font-medium">
                      Phone Number <span class="text-destructive">*</span>
                    </label>
                    <Input
                      id="sched-patient-phone"
                      v-model="patientPhone"
                      placeholder="+1 (555) 382-9104"
                      class="h-9 text-xs tabular-nums"
                    />
                  </div>

                  <div class="space-y-1.5">
                    <label for="sched-insurance" class="text-foreground text-xs font-medium">
                      Insurance Policy #
                    </label>
                    <Input
                      id="sched-insurance"
                      v-model="insurancePolicy"
                      placeholder="BCBS-90481240"
                      class="h-9 font-mono text-xs uppercase"
                    />
                  </div>
                </div>

                <div class="space-y-1.5">
                  <label for="sched-notes" class="text-foreground text-xs font-medium">
                    Clinical Symptoms / Notes
                  </label>
                  <Textarea
                    id="sched-notes"
                    v-model="notes"
                    rows="2"
                    placeholder="Briefly describe your symptoms or current medications..."
                    class="text-xs leading-relaxed"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter class="border-border/60 bg-muted/10 flex flex-col gap-3 border-t p-5 pt-0">
              <Button class="h-11 w-full rounded-xl text-sm font-semibold shadow-xs" @click="handleBook">
                <CalendarCheck class="mr-2 size-4 shrink-0" />
                <span>Confirm & Book Appointment</span>
              </Button>

              <div class="text-muted-foreground flex items-center justify-center gap-1.5 text-xs">
                <Lock class="size-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>256-bit encrypted · HIPAA compliant · Free cancellation up to 24h</span>
              </div>
            </CardFooter>
          </Card>

          <!-- State B: Confirmed Appointment Screen -->
          <Card v-else class="overflow-hidden border-emerald-500/30 bg-emerald-500/5 shadow-xs">
            <CardHeader class="pt-6 pb-3 text-center">
              <div
                class="mx-auto mb-2 flex size-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 ring-4 ring-emerald-500/10 dark:text-emerald-400"
              >
                <CheckCircle2 class="size-6" />
              </div>
              <CardTitle class="text-foreground text-lg font-bold"> Appointment Confirmed! </CardTitle>
              <CardDescription class="text-muted-foreground text-xs">
                Confirmation #{{ bookingReference }} dispatched to {{ patientPhone }}
              </CardDescription>
            </CardHeader>

            <CardContent class="space-y-4 p-5">
              <div class="border-border bg-card space-y-3 rounded-xl border p-4 text-xs">
                <div class="border-border/80 flex items-center justify-between border-b pb-2">
                  <span class="text-muted-foreground">Physician</span>
                  <span class="text-foreground font-semibold">{{ doctorName }}</span>
                </div>
                <div class="border-border/80 flex items-center justify-between border-b pb-2">
                  <span class="text-muted-foreground">Date & Time</span>
                  <span class="text-foreground font-semibold tabular-nums">{{ selectedSlotFormatted }}</span>
                </div>
                <div class="border-border/80 flex items-center justify-between border-b pb-2">
                  <span class="text-muted-foreground">Location</span>
                  <span class="text-foreground font-semibold">{{ locationText }}</span>
                </div>
                <div class="border-border/80 flex items-center justify-between border-b pb-2">
                  <span class="text-muted-foreground">Visit Type</span>
                  <span class="text-foreground font-semibold">{{ currentReasonObj.label }}</span>
                </div>
                <div class="border-border/80 flex items-center justify-between border-b pb-2">
                  <span class="text-muted-foreground">Patient</span>
                  <span class="text-foreground font-semibold">{{ patientName }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-muted-foreground">Est. Copay Due</span>
                  <span class="text-foreground font-bold tabular-nums">{{ currentReasonObj.copay }}</span>
                </div>
              </div>

              <div class="bg-muted/40 border-border/80 text-muted-foreground space-y-1 rounded-xl border p-3 text-xs">
                <p class="text-foreground flex items-center gap-1.5 font-medium">
                  <Info class="text-primary size-3.5 shrink-0" />
                  Pre-Appointment Instructions
                </p>
                <p class="leading-relaxed">
                  Please arrive 15 minutes early with your photo ID and active insurance card. For telehealth, join link
                  activates 10 minutes prior to visit.
                </p>
              </div>
            </CardContent>

            <CardFooter class="flex flex-col gap-2.5 p-5 pt-0">
              <Button
                variant="outline"
                class="border-border h-10 w-full rounded-xl text-xs font-semibold"
                :disabled="calendarAdded"
                @click="handleAddToCalendar"
              >
                <Check v-if="calendarAdded" class="mr-1.5 size-3.5 text-emerald-600" />
                <Calendar v-else class="mr-1.5 size-3.5" />
                <span>{{ calendarAdded ? 'Added to Calendar' : 'Add to Google / Apple Calendar' }}</span>
              </Button>

              <Button
                variant="ghost"
                class="text-muted-foreground hover:text-foreground h-9 w-full text-xs font-medium"
                @click="handleReset"
              >
                <RotateCcw class="mr-1.5 size-3" />
                <span>Schedule Another Appointment</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
