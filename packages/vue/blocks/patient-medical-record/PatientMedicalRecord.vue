<script setup lang="ts">
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Droplets,
  FileText,
  FlaskConical,
  HeartPulse,
  MapPin,
  Phone,
  Pill,
  Printer,
  Scale,
  Stethoscope,
  Thermometer,
  UserCheck,
  Wind,
} from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
</script>

<template>
  <div data-slot="patient-medical-record" class="bg-background text-foreground w-full space-y-6">
    <!-- Patient Header Card -->
    <header class="bg-card border-border rounded-xl border p-5 shadow-xs sm:p-6">
      <div class="flex flex-col gap-5">
        <!-- Top Row: Patient Demographics & Action Buttons -->
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-wrap items-start gap-4 sm:items-center">
            <Avatar class="ring-border size-14 ring-2 sm:size-16">
              <AvatarImage
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                alt="David Chen"
              />
              <AvatarFallback class="bg-primary/10 text-primary text-base font-semibold">DC</AvatarFallback>
            </Avatar>
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">David Chen</h1>
                <span class="text-muted-foreground text-sm font-medium">48 yrs · Male</span>
                <Badge
                  variant="outline"
                  class="gap-1.5 border-emerald-500/30 bg-emerald-500/10 font-medium text-emerald-700 dark:text-emerald-400"
                >
                  <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Active Inpatient · Room 412B
                </Badge>
              </div>

              <div class="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <span class="text-foreground flex items-center gap-1 font-mono font-medium"> #MRN-849201 </span>
                <span class="flex items-center gap-1">
                  <Calendar class="size-3.5" />
                  DOB: <strong class="text-foreground font-medium tabular-nums">Oct 14, 1978</strong>
                </span>
                <span class="flex items-center gap-1">
                  <Droplets class="size-3.5 text-rose-500" />
                  Blood: <strong class="text-foreground font-medium">O+</strong>
                </span>
                <span class="flex items-center gap-1">
                  <Stethoscope class="text-primary size-3.5" />
                  PCP: <strong class="text-foreground font-medium">Dr. Emily Vance, MD</strong>
                </span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" class="gap-1.5 text-xs font-medium">
              <FlaskConical class="text-primary size-3.5" />
              Order Labs
            </Button>
            <Button variant="outline" size="sm" class="gap-1.5 text-xs font-medium">
              <Pill class="text-primary size-3.5" />
              Write Prescription
            </Button>
            <Button variant="outline" size="sm" class="gap-1.5 text-xs font-medium">
              <Printer class="size-3.5" />
              Print Summary
            </Button>
          </div>
        </div>

        <!-- Red Alert Severe Allergy Pill / Banner -->
        <div
          class="border-destructive/30 bg-destructive/10 text-destructive dark:bg-destructive/20 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-xs font-medium sm:text-sm"
        >
          <div class="flex items-center gap-2">
            <AlertTriangle class="text-destructive size-4 shrink-0" />
            <span>
              Severe Allergies: <strong class="font-semibold underline">Penicillin</strong> (Anaphylaxis),
              <strong class="font-semibold underline">Sulfa drugs</strong> (Severe Rash)
            </span>
          </div>
          <Badge variant="destructive" class="text-xs font-semibold tracking-wider uppercase"> High Alert </Badge>
        </div>
      </div>
    </header>

    <!-- 2-Column Clinical Layout -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Main Panel (65%) -->
      <main class="space-y-6 lg:col-span-8">
        <!-- Latest Vitals Strip -->
        <Card>
          <CardHeader class="flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle class="flex items-center gap-2 text-base font-semibold">
                <Activity class="text-primary size-4" />
                Latest Vitals Strip
              </CardTitle>
              <CardDescription class="text-xs">
                Recorded today at 08:30 AM EDT · Nurse J. Miller, RN (Floor 4 East)
              </CardDescription>
            </div>
            <Badge variant="secondary" class="text-xs font-normal">Within Normal Limits</Badge>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <!-- BP -->
              <div class="bg-muted/30 border-border space-y-1 rounded-lg border p-3">
                <div class="text-muted-foreground flex items-center justify-between">
                  <span class="text-xs font-medium tracking-wider uppercase">Blood Pressure</span>
                  <HeartPulse class="size-3.5 text-rose-500" />
                </div>
                <div class="text-foreground text-xl font-bold tracking-tight tabular-nums sm:text-2xl">124/82</div>
                <p class="text-muted-foreground text-xs">mmHg · Normal</p>
              </div>

              <!-- HR -->
              <div class="bg-muted/30 border-border space-y-1 rounded-lg border p-3">
                <div class="text-muted-foreground flex items-center justify-between">
                  <span class="text-xs font-medium tracking-wider uppercase">Heart Rate</span>
                  <Activity class="size-3.5 text-rose-500" />
                </div>
                <div class="text-foreground text-xl font-bold tracking-tight tabular-nums sm:text-2xl">72</div>
                <p class="text-muted-foreground text-xs">bpm · Resting</p>
              </div>

              <!-- Temp -->
              <div class="bg-muted/30 border-border space-y-1 rounded-lg border p-3">
                <div class="text-muted-foreground flex items-center justify-between">
                  <span class="text-xs font-medium tracking-wider uppercase">Temp (Oral)</span>
                  <Thermometer class="size-3.5 text-amber-500" />
                </div>
                <div class="text-foreground text-xl font-bold tracking-tight tabular-nums sm:text-2xl">98.6</div>
                <p class="text-muted-foreground text-xs">°F · Afebrile</p>
              </div>

              <!-- SpO2 -->
              <div class="bg-muted/30 border-border space-y-1 rounded-lg border p-3">
                <div class="text-muted-foreground flex items-center justify-between">
                  <span class="text-xs font-medium tracking-wider uppercase">Oxygen SpO2</span>
                  <Wind class="size-3.5 text-sky-500" />
                </div>
                <div class="text-foreground text-xl font-bold tracking-tight tabular-nums sm:text-2xl">98%</div>
                <p class="text-muted-foreground text-xs">Room air</p>
              </div>

              <!-- BMI -->
              <div class="bg-muted/30 border-border space-y-1 rounded-lg border p-3">
                <div class="text-muted-foreground flex items-center justify-between">
                  <span class="text-xs font-medium tracking-wider uppercase">BMI</span>
                  <Scale class="size-3.5 text-emerald-500" />
                </div>
                <div class="text-foreground text-xl font-bold tracking-tight tabular-nums sm:text-2xl">24.2</div>
                <p class="text-muted-foreground text-xs">kg/m² · Normal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Active Diagnoses & Problem List -->
        <Card>
          <CardHeader class="flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle class="flex items-center gap-2 text-base font-semibold">
                <FileText class="text-primary size-4" />
                Active Diagnoses & Problem List
              </CardTitle>
              <CardDescription class="text-xs">
                Chronic and active conditions under clinical management
              </CardDescription>
            </div>
            <Badge variant="secondary" class="text-xs font-normal">3 Active Conditions</Badge>
          </CardHeader>
          <CardContent class="space-y-3">
            <!-- Item 1: Type 2 Diabetes -->
            <div
              class="border-border bg-card flex flex-col justify-between gap-2 rounded-lg border p-3.5 sm:flex-row sm:items-center"
            >
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-foreground text-sm font-semibold">Type 2 Diabetes Mellitus</span>
                  <Badge variant="outline" class="font-mono text-xs">ICD-10 E11.9</Badge>
                  <Badge variant="secondary" class="text-xs">Chronic</Badge>
                </div>
                <p class="text-muted-foreground text-xs">
                  Onset: <span class="text-foreground font-medium">March 2019</span> · Managed with oral hypoglycemics ·
                  Last HbA1c: <span class="text-foreground font-medium">7.2%</span>
                </p>
              </div>
              <div class="text-left sm:text-right">
                <span class="text-muted-foreground block text-xs">Diagnosed by</span>
                <span class="text-foreground text-xs font-medium">Dr. Emily Vance, MD</span>
              </div>
            </div>

            <!-- Item 2: Essential Hypertension -->
            <div
              class="border-border bg-card flex flex-col justify-between gap-2 rounded-lg border p-3.5 sm:flex-row sm:items-center"
            >
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-foreground text-sm font-semibold">Essential (Primary) Hypertension</span>
                  <Badge variant="outline" class="font-mono text-xs">ICD-10 I10</Badge>
                  <Badge variant="secondary" class="text-xs">Controlled</Badge>
                </div>
                <p class="text-muted-foreground text-xs">
                  Onset: <span class="text-foreground font-medium">November 2021</span> · ACE inhibitor therapy ·
                  Monitored daily
                </p>
              </div>
              <div class="text-left sm:text-right">
                <span class="text-muted-foreground block text-xs">Diagnosed by</span>
                <span class="text-foreground text-xs font-medium">Dr. Emily Vance, MD</span>
              </div>
            </div>

            <!-- Item 3: Asthma -->
            <div
              class="border-border bg-card flex flex-col justify-between gap-2 rounded-lg border p-3.5 sm:flex-row sm:items-center"
            >
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-foreground text-sm font-semibold">Moderate Persistent Asthma</span>
                  <Badge variant="outline" class="font-mono text-xs">ICD-10 J45.40</Badge>
                  <Badge variant="secondary" class="text-xs">Intermittent</Badge>
                </div>
                <p class="text-muted-foreground text-xs">
                  Onset: <span class="text-foreground font-medium">June 2015</span> · Bronchodilator PRN · No
                  hospitalizations in past 12m
                </p>
              </div>
              <div class="text-left sm:text-right">
                <span class="text-muted-foreground block text-xs">Diagnosed by</span>
                <span class="text-foreground text-xs font-medium">Dr. Marcus Vance, MD</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Active Medications Table -->
        <Card>
          <CardHeader class="flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle class="flex items-center gap-2 text-base font-semibold">
                <Pill class="text-primary size-4" />
                Active Medications Table
              </CardTitle>
              <CardDescription class="text-xs">
                Current inpatient and outpatient pharmacotherapy regimen
              </CardDescription>
            </div>
            <Badge variant="secondary" class="text-xs font-normal">4 Prescriptions</Badge>
          </CardHeader>
          <CardContent>
            <div class="border-border overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="text-xs">Medication & Brand</TableHead>
                    <TableHead class="text-xs">Dosage & Route</TableHead>
                    <TableHead class="hidden text-xs md:table-cell">Instructions</TableHead>
                    <TableHead class="text-xs">Prescribed By</TableHead>
                    <TableHead class="text-right text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div class="text-foreground text-sm font-medium">Metformin HCl</div>
                      <div class="text-muted-foreground text-xs">Glucophage · Biguanide</div>
                    </TableCell>
                    <TableCell class="text-foreground font-mono text-xs font-medium"> 500mg PO BID </TableCell>
                    <TableCell class="text-muted-foreground hidden text-xs md:table-cell">
                      Take with morning & evening meals
                    </TableCell>
                    <TableCell class="text-foreground text-xs"> Dr. Emily Vance, MD </TableCell>
                    <TableCell class="text-right">
                      <Badge variant="default" class="text-xs font-medium">Active</Badge>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <div class="text-foreground text-sm font-medium">Lisinopril</div>
                      <div class="text-muted-foreground text-xs">Prinivil · ACE Inhibitor</div>
                    </TableCell>
                    <TableCell class="text-foreground font-mono text-xs font-medium"> 10mg PO Daily </TableCell>
                    <TableCell class="text-muted-foreground hidden text-xs md:table-cell">
                      Take once daily in morning with water
                    </TableCell>
                    <TableCell class="text-foreground text-xs"> Dr. Emily Vance, MD </TableCell>
                    <TableCell class="text-right">
                      <Badge variant="default" class="text-xs font-medium">Active</Badge>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <div class="text-foreground text-sm font-medium">Albuterol Sulfate</div>
                      <div class="text-muted-foreground text-xs">ProAir HFA · SABA</div>
                    </TableCell>
                    <TableCell class="text-foreground font-mono text-xs font-medium">
                      90mcg Inhalation Q4H PRN
                    </TableCell>
                    <TableCell class="text-muted-foreground hidden text-xs md:table-cell">
                      1–2 puffs every 4–6 hrs as needed
                    </TableCell>
                    <TableCell class="text-foreground text-xs"> Dr. Emily Vance, MD </TableCell>
                    <TableCell class="text-right">
                      <Badge variant="default" class="text-xs font-medium">Active</Badge>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <div class="text-foreground text-sm font-medium">Atorvastatin Calcium</div>
                      <div class="text-muted-foreground text-xs">Lipitor · Statin</div>
                    </TableCell>
                    <TableCell class="text-foreground font-mono text-xs font-medium"> 20mg PO QHS </TableCell>
                    <TableCell class="text-muted-foreground hidden text-xs md:table-cell">
                      Take once daily at bedtime
                    </TableCell>
                    <TableCell class="text-foreground text-xs"> Dr. Marcus Vance, MD </TableCell>
                    <TableCell class="text-right">
                      <Badge variant="default" class="text-xs font-medium">Active</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <!-- Recent Clinical Encounter Notes -->
        <Card>
          <CardHeader class="pb-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle class="flex items-center gap-2 text-base font-semibold">
                  <FileText class="text-primary size-4" />
                  Recent Clinical Encounter Notes
                </CardTitle>
                <CardDescription class="text-xs">
                  Inpatient Daily Progress Note · General Internal Medicine
                </CardDescription>
              </div>
              <Badge variant="outline" class="font-mono text-xs">Encounter #ENC-91823</Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <div
              class="bg-muted/30 border-border flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-xs"
            >
              <div class="flex items-center gap-2">
                <span class="text-muted-foreground">Provider:</span>
                <span class="text-foreground font-medium">Dr. Emily Vance, MD (Attending)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-muted-foreground">Date:</span>
                <span class="text-foreground font-medium tabular-nums">Oct 24, 2026 · 09:30 AM EDT</span>
              </div>
            </div>

            <!-- History of Present Illness -->
            <div class="space-y-2">
              <h4
                class="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase"
              >
                <span class="bg-primary size-1.5 rounded-full" />
                History of Present Illness (HPI)
              </h4>
              <div
                class="border-border bg-card text-foreground/90 space-y-2 rounded-lg border p-3.5 text-sm leading-relaxed"
              >
                <p>
                  Patient is a 48-year-old male with a documented history of Type 2 Diabetes Mellitus and Essential
                  Hypertension, currently admitted to Inpatient Floor 4 East (Room 412B) for glycemic optimization
                  following mild erratic home glucose readings.
                </p>
                <p>
                  This morning, patient reports feeling well with notable improvement in energy levels. Denies episodes
                  of dizziness, diaphoresis, chest pain, palpitations, or acute dyspnea. Fasting blood glucose at 07:00
                  was 118 mg/dL on Metformin 500mg BID. Vital signs remain within normal physiological parameters.
                  Tolerating scheduled diabetic meal plan without gastrointestinal distress.
                </p>
              </div>
            </div>

            <!-- Assessment & Plan -->
            <div class="space-y-2">
              <h4
                class="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase"
              >
                <span class="bg-primary size-1.5 rounded-full" />
                Assessment & Plan (A&P)
              </h4>
              <div
                class="border-border bg-card text-foreground/90 space-y-3 rounded-lg border p-3.5 text-sm leading-relaxed"
              >
                <div>
                  <div class="text-foreground text-xs font-semibold tracking-wide uppercase">
                    1. Type 2 Diabetes Mellitus (E11.9) — Controlled
                  </div>
                  <p class="text-muted-foreground mt-0.5 text-xs sm:text-sm">
                    Glycemic control stabilized. Continue Metformin HCl 500mg PO BID with meals. Re-check fasting blood
                    sugar tomorrow at 07:00. HbA1c stable at 7.2%. No need for supplementary sliding-scale insulin at
                    this time.
                  </p>
                </div>
                <Separator />
                <div>
                  <div class="text-foreground text-xs font-semibold tracking-wide uppercase">
                    2. Essential Hypertension (I10) — Stable
                  </div>
                  <p class="text-muted-foreground mt-0.5 text-xs sm:text-sm">
                    Normotensive on Lisinopril 10mg PO Daily (today BP 124/82 mmHg). Maintain current dosage. Continue
                    routine Q8H vital signs monitoring.
                  </p>
                </div>
                <Separator />
                <div>
                  <div class="text-foreground text-xs font-semibold tracking-wide uppercase">
                    3. Bronchial Asthma (J45.40) — Quiescent
                  </div>
                  <p class="text-muted-foreground mt-0.5 text-xs sm:text-sm">
                    Bilateral breath sounds clear to auscultation without wheeze or crackles. Continue Albuterol 90mcg
                    MDI PRN.
                  </p>
                </div>
                <Separator />
                <div>
                  <div class="text-foreground text-xs font-semibold tracking-wide uppercase">
                    4. Disposition & Discharge Planning
                  </div>
                  <p class="text-muted-foreground mt-0.5 text-xs sm:text-sm">
                    Anticipate discharge tomorrow morning pending afternoon CMP and final attending evaluation.
                    Outpatient follow-up with PCP in 2 weeks.
                  </p>
                </div>
              </div>
            </div>

            <!-- Signature block -->
            <div
              class="border-border text-muted-foreground flex flex-wrap items-center justify-between border-t pt-3 text-xs"
            >
              <div class="flex items-center gap-1.5">
                <CheckCircle2 class="size-4 text-emerald-500" />
                <span>
                  Electronically Signed by: <strong class="text-foreground font-medium">Dr. Emily Vance, MD</strong>
                </span>
              </div>
              <span class="tabular-nums">Signed: Oct 24, 2026 at 10:15 AM EDT</span>
            </div>
          </CardContent>
        </Card>
      </main>

      <!-- Right Side Panel (35%) -->
      <aside class="space-y-6 lg:col-span-4">
        <!-- Upcoming Appointments & Labs schedule -->
        <Card>
          <CardHeader class="flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle class="flex items-center gap-2 text-base font-semibold">
                <Calendar class="text-primary size-4" />
                Upcoming Schedule & Labs
              </CardTitle>
              <CardDescription class="text-xs"> Pending orders and scheduled consultations </CardDescription>
            </div>
          </CardHeader>
          <CardContent class="space-y-3">
            <!-- Item 1: CMP -->
            <div class="border-border bg-muted/20 space-y-1.5 rounded-lg border p-3">
              <div class="flex items-center justify-between gap-2">
                <span class="text-foreground text-xs font-semibold">Comprehensive Metabolic Panel</span>
                <Badge variant="secondary" class="text-xs">Today</Badge>
              </div>
              <div class="text-muted-foreground flex items-center gap-2 text-xs">
                <Clock class="size-3.5" />
                <span class="text-foreground font-medium tabular-nums">02:00 PM EDT</span>
                <span>· Main Clinical Lab</span>
              </div>
              <div class="text-muted-foreground text-xs">Order #LAB-4819 · Stat processing</div>
            </div>

            <!-- Item 2: Echocardiogram -->
            <div class="border-border bg-muted/20 space-y-1.5 rounded-lg border p-3">
              <div class="flex items-center justify-between gap-2">
                <span class="text-foreground text-xs font-semibold">Transthoracic Echocardiogram</span>
                <Badge variant="outline" class="text-xs">Tomorrow</Badge>
              </div>
              <div class="text-muted-foreground flex items-center gap-2 text-xs">
                <Clock class="size-3.5" />
                <span class="text-foreground font-medium tabular-nums">10:30 AM EDT</span>
                <span>· Cardiology Suite 2B</span>
              </div>
              <div class="text-muted-foreground text-xs">Non-invasive Doppler evaluation</div>
            </div>

            <!-- Item 3: Endo consult -->
            <div class="border-border bg-muted/20 space-y-1.5 rounded-lg border p-3">
              <div class="flex items-center justify-between gap-2">
                <span class="text-foreground text-xs font-semibold">Endocrinology Follow-Up</span>
                <Badge variant="outline" class="text-xs">Nov 02</Badge>
              </div>
              <div class="text-muted-foreground flex items-center gap-2 text-xs">
                <Clock class="size-3.5" />
                <span class="text-foreground font-medium tabular-nums">11:00 AM EDT</span>
                <span>· Outpatient Clinic Rm 304</span>
              </div>
              <div class="text-muted-foreground text-xs">Dr. Robert Chen, MD · Glycemic review</div>
            </div>
          </CardContent>
        </Card>

        <!-- Care Team Contact list -->
        <Card>
          <CardHeader class="pb-3">
            <CardTitle class="flex items-center gap-2 text-base font-semibold">
              <UserCheck class="text-primary size-4" />
              Care Team Directory
            </CardTitle>
            <CardDescription class="text-xs"> Assigned inpatient clinical providers </CardDescription>
          </CardHeader>
          <CardContent class="space-y-3.5">
            <!-- Doctor -->
            <div class="flex items-center justify-between gap-3">
              <div class="flex min-w-0 items-center gap-3">
                <Avatar class="size-9">
                  <AvatarFallback class="bg-primary/10 text-primary text-xs font-semibold">EV</AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                  <div class="text-foreground truncate text-sm font-semibold">Dr. Emily Vance, MD</div>
                  <div class="text-muted-foreground truncate text-xs">Attending Physician · Internal Med</div>
                </div>
              </div>
              <Badge variant="secondary" class="shrink-0 font-mono text-xs">ext. 2940</Badge>
            </div>

            <Separator />

            <!-- Nurse -->
            <div class="flex items-center justify-between gap-3">
              <div class="flex min-w-0 items-center gap-3">
                <Avatar class="size-9">
                  <AvatarFallback class="bg-primary/10 text-primary text-xs font-semibold">JM</AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                  <div class="text-foreground truncate text-sm font-semibold">Jason Miller, BSN, RN</div>
                  <div class="text-muted-foreground truncate text-xs">Charge Nurse · Floor 4 East</div>
                </div>
              </div>
              <Badge variant="secondary" class="shrink-0 font-mono text-xs">ext. 4802</Badge>
            </div>

            <Separator />

            <!-- Pharmacist -->
            <div class="flex items-center justify-between gap-3">
              <div class="flex min-w-0 items-center gap-3">
                <Avatar class="size-9">
                  <AvatarFallback class="bg-primary/10 text-primary text-xs font-semibold">SL</AvatarFallback>
                </Avatar>
                <div class="min-w-0">
                  <div class="text-foreground truncate text-sm font-semibold">Sarah Lin, PharmD</div>
                  <div class="text-muted-foreground truncate text-xs">Clinical Pharmacist · Inpatient</div>
                </div>
              </div>
              <Badge variant="secondary" class="shrink-0 font-mono text-xs">ext. 3319</Badge>
            </div>
          </CardContent>
        </Card>

        <!-- Emergency Contact card -->
        <Card>
          <CardHeader class="flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle class="flex items-center gap-2 text-base font-semibold">
                <Phone class="text-primary size-4" />
                Emergency Contact
              </CardTitle>
              <CardDescription class="text-xs"> Designated healthcare surrogate </CardDescription>
            </div>
            <Badge variant="secondary" class="text-xs font-medium">Primary</Badge>
          </CardHeader>
          <CardContent class="space-y-3 text-xs">
            <div class="space-y-1">
              <div class="text-foreground text-sm font-semibold">Elena Chen</div>
              <div class="text-muted-foreground text-xs">Spouse · Full Medical Power of Attorney</div>
            </div>

            <Separator />

            <div class="text-muted-foreground space-y-2">
              <div class="flex items-center justify-between gap-2">
                <span class="text-foreground flex items-center gap-1.5 font-medium">
                  <Phone class="text-primary size-3.5" />
                  Primary Mobile
                </span>
                <span class="text-foreground font-mono font-medium tabular-nums">+1 (555) 234-8901</span>
              </div>
              <div class="flex items-center justify-between gap-2">
                <span class="flex items-center gap-1.5">
                  <Phone class="size-3.5" />
                  Secondary Work
                </span>
                <span class="font-mono tabular-nums">+1 (555) 234-8902</span>
              </div>
              <div class="flex items-start justify-between gap-2 pt-1">
                <span class="flex shrink-0 items-center gap-1.5">
                  <MapPin class="size-3.5" />
                  Home
                </span>
                <span class="text-foreground text-right">742 Evergreen Terrace, Seattle, WA 98101</span>
              </div>
            </div>

            <Separator />

            <Button variant="outline" size="sm" class="w-full justify-center gap-1.5 text-xs font-medium">
              <Phone class="size-3.5" />
              Call Emergency Contact
            </Button>
          </CardContent>
        </Card>
      </aside>
    </div>
  </div>
</template>
