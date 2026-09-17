'use client'

import * as React from 'react'
import {
  BadgeCheck,
  Building2,
  Calendar,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  HeartPulse,
  Info,
  Lock,
  MapPin,
  Phone,
  RotateCcw,
  ShieldCheck,
  Star,
  Stethoscope,
  Sun,
  Sunset,
  User,
  Video,
} from 'lucide-react'
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
  className?: string
}

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

export function DoctorAppointmentScheduler({
  doctorName = 'Dr. Marcus Thorne, MD, FACC',
  doctorTitle = 'Board-Certified Cardiologist · Cedars-Sinai Heart Institute',
  doctorAvatar = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=320&auto=format&fit=crop',
  specialty = 'Cardiology & Internal Medicine',
  clinicName = 'Cedars-Sinai Medical Plaza',
  clinicAddress = 'Cedars-Sinai Medical Plaza, Suite 400, Los Angeles, CA',
  rating = 4.9,
  reviewCount = 240,
  insurances = ['BlueCross BlueShield', 'Aetna', 'UnitedHealthcare', 'Medicare', 'Cigna'],
  initialDate = '2026-08-27',
  initialTime = '10:15 AM',
  initialVisitType = 'in-person',
  initialReason = 'chest-pain',
  className,
}: DoctorAppointmentSchedulerProps) {
  // State
  const [selectedDate, setSelectedDate] = React.useState(initialDate)
  const [selectedTime, setSelectedTime] = React.useState(initialTime)
  const [visitType, setVisitType] = React.useState<'in-person' | 'telehealth'>(initialVisitType)
  const [selectedReason, setSelectedReason] = React.useState(initialReason)
  const [patientName, setPatientName] = React.useState('Sarah Jenkins')
  const [patientPhone, setPatientPhone] = React.useState('+1 (555) 382-9104')
  const [insurancePolicy, setInsurancePolicy] = React.useState('BCBS-90481240')
  const [notes, setNotes] = React.useState('Occasional mild tightness after morning workouts; seeking ECG review.')
  const [isBooked, setIsBooked] = React.useState(false)
  const [calendarAdded, setCalendarAdded] = React.useState(false)
  const bookingReference = 'APT-84920'

  // Computed helpers
  const currentDateObj = React.useMemo(() => {
    return weekDays.find((d) => d.id === selectedDate) || weekDays[3]
  }, [selectedDate])

  const currentReasonObj = React.useMemo(() => {
    return visitReasons.find((r) => r.value === selectedReason) || visitReasons[2]
  }, [selectedReason])

  const selectedSlotFormatted = `${currentDateObj.weekday}, ${currentDateObj.month} ${currentDateObj.day} at ${selectedTime}`

  const locationText =
    visitType === 'in-person' ? 'In-Person · Room 402, Cedars-Sinai Plaza' : 'Video Telehealth · Secure HIPAA Link'

  function handleBook() {
    if (!patientName.trim() || !patientPhone.trim()) return
    setIsBooked(true)
  }

  function handleReset() {
    setIsBooked(false)
    setCalendarAdded(false)
  }

  function handleAddToCalendar() {
    setCalendarAdded(true)
  }

  return (
    <div data-slot="doctor-appointment-scheduler" className={cn('mx-auto w-full max-w-6xl space-y-6', className)}>
      {/* 1. Doctor Profile Hero Card */}
      <Card className="border-border bg-card overflow-hidden shadow-xs">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Left: Avatar + Core Bio */}
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="relative shrink-0">
                <Avatar className="border-primary/20 bg-muted size-20 rounded-2xl border-2 shadow-xs md:size-24">
                  <AvatarImage src={doctorAvatar} alt={doctorName} className="rounded-2xl object-cover" />
                  <AvatarFallback className="bg-primary/10 text-primary rounded-2xl text-lg font-bold">
                    MT
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -right-1.5 -bottom-1.5 flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 backdrop-blur-sm dark:text-emerald-300">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span>Available</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-foreground text-xl font-bold tracking-tight md:text-2xl">{doctorName}</h1>
                  <BadgeCheck className="text-primary size-5 shrink-0" aria-label="Verified Doctor" />
                </div>

                <p className="text-muted-foreground text-xs font-normal md:text-sm">{doctorTitle}</p>

                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <Badge wrap variant="secondary" className="text-xs font-medium">
                    {specialty}
                  </Badge>
                  <Badge wrap variant="outline" className="text-muted-foreground border-border text-xs font-medium">
                    16+ Yrs Experience
                  </Badge>
                  <Badge wrap variant="outline" className="text-muted-foreground border-border text-xs font-medium">
                    Cedars-Sinai Affiliated
                  </Badge>
                </div>
              </div>
            </div>

            {/* Right: Rating, Clinic & Insurance Highlights */}
            <div className="border-border/80 bg-muted/30 flex shrink-0 flex-col gap-2.5 rounded-xl border p-4 md:max-w-xs">
              <div className="flex items-center justify-between gap-3">
                <div className="text-foreground flex items-center gap-1.5">
                  <Star className="size-4 shrink-0 fill-amber-500 text-amber-500" />
                  <span className="text-sm font-bold tabular-nums">{rating}</span>
                  <span className="text-muted-foreground text-xs">({reviewCount} reviews)</span>
                </div>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Top Rated</span>
              </div>

              <div className="text-muted-foreground flex items-start gap-2 text-xs">
                <MapPin className="text-primary mt-0.5 size-3.5 shrink-0" />
                <span className="line-clamp-2 leading-relaxed">{clinicAddress}</span>
              </div>

              <div className="text-muted-foreground flex items-start gap-2 text-xs">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="line-clamp-2 leading-relaxed">
                  Accepts BlueCross, Aetna, UnitedHealthcare, Medicare
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Interactive Booking Flow (2-Column) */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Calendar & Slot Picker (7 Cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Step 1: Visit Type Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs font-bold">
                1
              </div>
              <h2 className="text-foreground text-sm font-semibold">Select Visit Type</h2>
            </div>

            <RadioGroup
              value={visitType}
              onValueChange={(val) => setVisitType(val as 'in-person' | 'telehealth')}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              <label
                htmlFor="visit-in-person-react"
                className={cn(
                  'flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-all duration-150',
                  visitType === 'in-person'
                    ? 'border-primary bg-primary/5 ring-primary/30 shadow-xs ring-1'
                    : 'border-border bg-card hover:bg-muted/40',
                )}
              >
                <RadioGroupItem id="visit-in-person-react" value="in-person" className="mt-0.5" />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="text-primary size-4 shrink-0" />
                    <span className="text-foreground text-sm font-semibold">In-Person Visit</span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Cedars-Sinai Medical Plaza, Suite 400 · In-office diagnostics & exam
                  </p>
                </div>
              </label>

              <label
                htmlFor="visit-telehealth-react"
                className={cn(
                  'flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-all duration-150',
                  visitType === 'telehealth'
                    ? 'border-primary bg-primary/5 ring-primary/30 shadow-xs ring-1'
                    : 'border-border bg-card hover:bg-muted/40',
                )}
              >
                <RadioGroupItem id="visit-telehealth-react" value="telehealth" className="mt-0.5" />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Video className="text-primary size-4 shrink-0" />
                    <span className="text-foreground text-sm font-semibold">Video Telehealth</span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    HD video consultation · HIPAA link sent via SMS & email
                  </p>
                </div>
              </label>
            </RadioGroup>
          </div>

          {/* Step 2: Reason for Visit */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs font-bold">
                2
              </div>
              <h2 className="text-foreground text-sm font-semibold">Reason for Visit</h2>
            </div>

            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger className="bg-card border-border h-11 w-full rounded-xl px-4 text-sm font-medium">
                <SelectValue placeholder="Choose a clinical reason for consultation" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover rounded-xl">
                {visitReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value} className="cursor-pointer px-3 py-2.5 text-sm">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-foreground font-medium">{reason.label}</span>
                      <span className="text-muted-foreground text-xs">{reason.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Step 3: Date Carousel / Week Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs font-bold">
                  3
                </div>
                <h2 className="text-foreground text-sm font-semibold">Select Date</h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium">August 2026</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="border-border size-7 rounded-lg"
                    aria-label="Previous week"
                  >
                    <ChevronLeft className="size-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="border-border size-7 rounded-lg"
                    aria-label="Next week"
                  >
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* 6-Day Carousel Strip */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {weekDays.map((day) => {
                const isSelected = selectedDate === day.id
                return (
                  <button
                    key={day.id}
                    type="button"
                    className={cn(
                      'focus-visible:ring-primary flex cursor-pointer flex-col items-center justify-center rounded-xl border p-3 text-center transition-all duration-150 outline-none focus-visible:ring-2',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground ring-primary/20 font-semibold shadow-xs ring-2'
                        : 'border-border bg-card hover:bg-muted/50 text-foreground',
                    )}
                    onClick={() => setSelectedDate(day.id)}
                  >
                    <span
                      className={cn(
                        'text-xs font-medium tracking-wider uppercase',
                        isSelected ? 'text-primary-foreground/90' : 'text-muted-foreground',
                      )}
                    >
                      {day.weekday}
                    </span>
                    <span className="my-0.5 text-xl font-bold tabular-nums">{day.day}</span>
                    <span
                      className={cn(
                        'text-xs font-medium',
                        isSelected ? 'text-primary-foreground/80' : 'text-emerald-600 dark:text-emerald-400',
                      )}
                    >
                      {day.slotsCount} slots
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 4: Available Time Slots Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-xs font-bold">
                  4
                </div>
                <h2 className="text-foreground text-sm font-semibold">Available Time Slots</h2>
              </div>
              <span className="text-muted-foreground text-xs tabular-nums">
                8 slots on {currentDateObj.weekday}, {currentDateObj.month} {currentDateObj.day}
              </span>
            </div>

            {/* Morning Section */}
            <div className="border-border/70 bg-card space-y-2 rounded-xl border p-4">
              <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                <Sun className="size-3.5 text-amber-500" />
                <span>Morning Slots</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-4">
                {morningSlots.map((slot) => {
                  const isSelected = selectedTime === slot
                  return (
                    <button
                      key={slot}
                      type="button"
                      className={cn(
                        'focus-visible:ring-primary flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-medium tabular-nums transition-all duration-150 outline-none focus-visible:ring-2',
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground ring-primary/30 font-semibold shadow-xs ring-2'
                          : 'border-border bg-background hover:bg-muted/60 text-foreground',
                      )}
                      onClick={() => setSelectedTime(slot)}
                    >
                      {slot}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Afternoon Section */}
            <div className="border-border/70 bg-card space-y-2 rounded-xl border p-4">
              <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                <Sunset className="size-3.5 text-orange-500" />
                <span>Afternoon Slots</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-4">
                {afternoonSlots.map((slot) => {
                  const isSelected = selectedTime === slot
                  return (
                    <button
                      key={slot}
                      type="button"
                      className={cn(
                        'focus-visible:ring-primary flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-medium tabular-nums transition-all duration-150 outline-none focus-visible:ring-2',
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground ring-primary/30 font-semibold shadow-xs ring-2'
                          : 'border-border bg-background hover:bg-muted/60 text-foreground',
                      )}
                      onClick={() => setSelectedTime(slot)}
                    >
                      {slot}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Appointment Summary Card (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-6">
            {/* State A: Active Booking Form Summary */}
            {!isBooked ? (
              <Card className="border-border bg-card overflow-hidden shadow-xs">
                <CardHeader className="border-border/70 bg-muted/20 border-b pb-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <CardTitle className="text-foreground text-base font-bold">Appointment Summary</CardTitle>
                      <CardDescription className="text-muted-foreground text-xs">
                        Live schedule & patient registration
                      </CardDescription>
                    </div>
                    <Badge
                      wrap
                      variant="outline"
                      className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                    >
                      <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                      <span>Slot Held: 09:48</span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 p-5">
                  {/* Selected Slot Readout Banner */}
                  <div className="border-primary/25 bg-primary/5 space-y-2.5 rounded-xl border p-4">
                    <div className="flex items-start gap-2.5">
                      <CalendarCheck className="text-primary mt-0.5 size-4 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="text-muted-foreground text-xs font-medium">Selected Slot</p>
                        <p className="text-foreground text-sm font-bold tabular-nums">{selectedSlotFormatted}</p>
                      </div>
                    </div>

                    <div className="border-primary/15 flex items-start gap-2.5 border-t pt-1">
                      {visitType === 'in-person' ? (
                        <Building2 className="text-primary mt-0.5 size-4 shrink-0" />
                      ) : (
                        <Video className="text-primary mt-0.5 size-4 shrink-0" />
                      )}
                      <div className="space-y-0.5">
                        <p className="text-muted-foreground text-xs font-medium">Location / Mode</p>
                        <p className="text-foreground text-xs font-medium">{locationText}</p>
                      </div>
                    </div>

                    <div className="border-primary/15 flex items-start gap-2.5 border-t pt-1">
                      <Stethoscope className="text-primary mt-0.5 size-4 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="text-muted-foreground text-xs font-medium">Visit Type</p>
                        <p className="text-foreground text-xs font-medium">{currentReasonObj.label}</p>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Copay Readout */}
                  <div className="border-border/80 bg-muted/40 flex items-center justify-between rounded-xl border p-3.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <div className="space-y-0.5">
                        <p className="text-muted-foreground text-xs font-medium">Estimated Copay</p>
                        <p className="text-foreground text-xs font-semibold">BlueCross PPO In-Network</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-foreground text-base font-bold tabular-nums">{currentReasonObj.copay}</span>
                      <p className="text-muted-foreground text-xs">Covered at 90%</p>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  {/* Patient Details Form */}
                  <div className="space-y-3">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Patient Information
                    </p>

                    <div className="space-y-1.5">
                      <label htmlFor="sched-patient-name-react" className="text-foreground text-xs font-medium">
                        Full Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="sched-patient-name-react"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label htmlFor="sched-patient-phone-react" className="text-foreground text-xs font-medium">
                          Phone Number <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="sched-patient-phone-react"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          placeholder="+1 (555) 382-9104"
                          className="h-9 text-xs tabular-nums"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="sched-insurance-react" className="text-foreground text-xs font-medium">
                          Insurance Policy #
                        </label>
                        <Input
                          id="sched-insurance-react"
                          value={insurancePolicy}
                          onChange={(e) => setInsurancePolicy(e.target.value)}
                          placeholder="BCBS-90481240"
                          className="h-9 font-mono text-xs uppercase"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="sched-notes-react" className="text-foreground text-xs font-medium">
                        Clinical Symptoms / Notes
                      </label>
                      <Textarea
                        id="sched-notes-react"
                        value={notes}
                        onValueChange={(v) => setNotes(v)}
                        rows={2}
                        placeholder="Briefly describe your symptoms or current medications..."
                        className="text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-border/60 bg-muted/10 flex flex-col gap-3 border-t p-5 pt-0">
                  <Button className="h-11 w-full rounded-xl text-sm font-semibold shadow-xs" onClick={handleBook}>
                    <CalendarCheck className="mr-2 size-4 shrink-0" />
                    <span>Confirm & Book Appointment</span>
                  </Button>

                  <div className="text-muted-foreground flex items-center justify-center gap-1.5 text-xs">
                    <Lock className="size-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>256-bit encrypted · HIPAA compliant · Free cancellation up to 24h</span>
                  </div>
                </CardFooter>
              </Card>
            ) : (
              /* State B: Confirmed Appointment Screen */
              <Card className="overflow-hidden border-emerald-500/30 bg-emerald-500/5 shadow-xs">
                <CardHeader className="pt-6 pb-3 text-center">
                  <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 ring-4 ring-emerald-500/10 dark:text-emerald-400">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <CardTitle className="text-foreground text-lg font-bold">Appointment Confirmed!</CardTitle>
                  <CardDescription className="text-muted-foreground text-xs">
                    Confirmation #{bookingReference} dispatched to {patientPhone}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 p-5">
                  <div className="border-border bg-card space-y-3 rounded-xl border p-4 text-xs">
                    <div className="border-border/80 flex items-center justify-between border-b pb-2">
                      <span className="text-muted-foreground">Physician</span>
                      <span className="text-foreground font-semibold">{doctorName}</span>
                    </div>
                    <div className="border-border/80 flex items-center justify-between border-b pb-2">
                      <span className="text-muted-foreground">Date & Time</span>
                      <span className="text-foreground font-semibold tabular-nums">{selectedSlotFormatted}</span>
                    </div>
                    <div className="border-border/80 flex items-center justify-between border-b pb-2">
                      <span className="text-muted-foreground">Location</span>
                      <span className="text-foreground font-semibold">{locationText}</span>
                    </div>
                    <div className="border-border/80 flex items-center justify-between border-b pb-2">
                      <span className="text-muted-foreground">Visit Type</span>
                      <span className="text-foreground font-semibold">{currentReasonObj.label}</span>
                    </div>
                    <div className="border-border/80 flex items-center justify-between border-b pb-2">
                      <span className="text-muted-foreground">Patient</span>
                      <span className="text-foreground font-semibold">{patientName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Est. Copay Due</span>
                      <span className="text-foreground font-bold tabular-nums">{currentReasonObj.copay}</span>
                    </div>
                  </div>

                  <div className="bg-muted/40 border-border/80 text-muted-foreground space-y-1 rounded-xl border p-3 text-xs">
                    <p className="text-foreground flex items-center gap-1.5 font-medium">
                      <Info className="text-primary size-3.5 shrink-0" />
                      Pre-Appointment Instructions
                    </p>
                    <p className="leading-relaxed">
                      Please arrive 15 minutes early with your photo ID and active insurance card. For telehealth, join
                      link activates 10 minutes prior to visit.
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-2.5 p-5 pt-0">
                  <Button
                    variant="outline"
                    className="border-border h-10 w-full rounded-xl text-xs font-semibold"
                    disabled={calendarAdded}
                    onClick={handleAddToCalendar}
                  >
                    {calendarAdded ? (
                      <Check className="mr-1.5 size-3.5 text-emerald-600" />
                    ) : (
                      <Calendar className="mr-1.5 size-3.5" />
                    )}
                    <span>{calendarAdded ? 'Added to Calendar' : 'Add to Google / Apple Calendar'}</span>
                  </Button>

                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground h-9 w-full text-xs font-medium"
                    onClick={handleReset}
                  >
                    <RotateCcw className="mr-1.5 size-3" />
                    <span>Schedule Another Appointment</span>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorAppointmentScheduler
