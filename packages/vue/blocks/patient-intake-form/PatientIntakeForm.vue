<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Activity,
  AlertTriangle,
  Building2,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Download,
  FileCheck,
  FileText,
  Lock,
  Phone,
  RotateCcw,
  ShieldCheck,
  Stethoscope,
  User,
  UserCheck,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SectionCard } from '@/components/ui/section-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Stepper } from '@/components/ui/stepper'
import { Textarea } from '@/components/ui/textarea'

export interface PatientIntakeData {
  // Step 1: Personal Information
  firstName: string
  middleName: string
  lastName: string
  preferredName: string
  dob: string
  biologicalSex: string
  maritalStatus: string
  phone: string
  email: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  emergencyName: string
  emergencyRelationship: string
  emergencyPhone: string

  // Step 2: Medical History
  chronicConditions: string[]
  hasAllergies: boolean
  allergyDetails: string
  currentMedications: string
  pastSurgeries: string
  primaryCarePhysician: string
  clinicPhone: string

  // Step 3: Insurance & Billing
  insuranceCarrier: string
  memberId: string
  groupNumber: string
  policyholderName: string
  policyholderRelationship: string
  frontCardUploaded: boolean
  backCardUploaded: boolean

  // Step 4: Consent & Sign
  hipaaConsent: boolean
  treatmentConsent: boolean
  telehealthConsent: boolean
  signatureName: string
  signatureDate: string
  signerRole: string
}

interface Props {
  initialStep?: number
  initialData?: Partial<PatientIntakeData>
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  initialStep: 1,
  initialData: () => ({}),
})

const emits = defineEmits<{
  (e: 'submit', data: PatientIntakeData): void
  (e: 'step-change', step: number): void
}>()

const steps = [
  { id: 1, title: 'Personal Information', description: 'Demographics & Contact' },
  { id: 2, title: 'Medical History', description: 'Conditions & Medications' },
  { id: 3, title: 'Insurance & Billing', description: 'Coverage & Card Photos' },
  { id: 4, title: 'Consent & Sign', description: 'HIPAA & Authorization' },
]

const CHRONIC_CONDITIONS = [
  { id: 'hypertension', label: 'Hypertension (High Blood Pressure)' },
  { id: 'diabetes', label: 'Diabetes (Type 1 or Type 2)' },
  { id: 'asthma', label: 'Asthma / Respiratory Conditions' },
  { id: 'heart_disease', label: 'Coronary Artery / Heart Disease' },
  { id: 'arthritis', label: 'Arthritis / Chronic Joint Pain' },
  { id: 'cancer', label: 'Cancer / Remission History' },
  { id: 'thyroid', label: 'Thyroid / Endocrine Disorder' },
  { id: 'anxiety_depression', label: 'Depression / Clinical Anxiety' },
  { id: 'kidney_disease', label: 'Chronic Kidney Disease' },
  { id: 'gerd', label: 'Acid Reflux / GERD' },
]

const INSURANCE_CARRIERS = [
  { id: 'bcbs', label: 'BlueCross BlueShield' },
  { id: 'aetna', label: 'Aetna Health' },
  { id: 'cigna', label: 'Cigna Healthcare' },
  { id: 'united', label: 'UnitedHealthcare' },
  { id: 'medicare', label: 'Medicare Part A / B' },
  { id: 'medicaid', label: 'Medicaid' },
  { id: 'humana', label: 'Humana' },
  { id: 'kaiser', label: 'Kaiser Permanente' },
  { id: 'self_pay', label: 'Self-Pay (Uninsured)' },
]

const step = ref(props.initialStep)
const submitted = ref(false)
const intakeId = ref('INTAKE-2026-8942')

const formData = reactive<PatientIntakeData>({
  firstName: props.initialData.firstName ?? 'Eleanor',
  middleName: props.initialData.middleName ?? 'Rose',
  lastName: props.initialData.lastName ?? 'Vance',
  preferredName: props.initialData.preferredName ?? 'Ellie',
  dob: props.initialData.dob ?? '1988-10-14',
  biologicalSex: props.initialData.biologicalSex ?? 'female',
  maritalStatus: props.initialData.maritalStatus ?? 'married',
  phone: props.initialData.phone ?? '(555) 234-8921',
  email: props.initialData.email ?? 'eleanor.vance@example.com',
  streetAddress: props.initialData.streetAddress ?? '742 Evergreen Terrace',
  city: props.initialData.city ?? 'Springfield',
  state: props.initialData.state ?? 'OR',
  zipCode: props.initialData.zipCode ?? '97477',
  emergencyName: props.initialData.emergencyName ?? 'Marcus Vance',
  emergencyRelationship: props.initialData.emergencyRelationship ?? 'spouse',
  emergencyPhone: props.initialData.emergencyPhone ?? '(555) 987-6543',

  chronicConditions: props.initialData.chronicConditions ?? ['hypertension', 'asthma'],
  hasAllergies: props.initialData.hasAllergies ?? true,
  allergyDetails:
    props.initialData.allergyDetails ?? 'Penicillin (Anaphylaxis/hives), Sulfa antibiotics (severe skin rash)',
  currentMedications:
    props.initialData.currentMedications ??
    'Lisinopril 10mg PO once daily in morning, Albuterol HFA 90mcg inhaler 1-2 puffs Q4H PRN for bronchospasm, Multivitamin daily',
  pastSurgeries:
    props.initialData.pastSurgeries ??
    'Appendectomy (Laparoscopic, 2016), Right knee arthroscopy / meniscus debridement (2021)',
  primaryCarePhysician: props.initialData.primaryCarePhysician ?? 'Dr. Robert Chen, MD',
  clinicPhone: props.initialData.clinicPhone ?? '(555) 601-2290 — Northwest Health Partners',

  insuranceCarrier: props.initialData.insuranceCarrier ?? 'bcbs',
  memberId: props.initialData.memberId ?? 'XEH-902814891',
  groupNumber: props.initialData.groupNumber ?? 'GRP-44028',
  policyholderName: props.initialData.policyholderName ?? 'Eleanor Vance',
  policyholderRelationship: props.initialData.policyholderRelationship ?? 'self',
  frontCardUploaded: props.initialData.frontCardUploaded ?? true,
  backCardUploaded: props.initialData.backCardUploaded ?? true,

  hipaaConsent: props.initialData.hipaaConsent ?? true,
  treatmentConsent: props.initialData.treatmentConsent ?? true,
  telehealthConsent: props.initialData.telehealthConsent ?? true,
  signatureName: props.initialData.signatureName ?? 'Eleanor R. Vance',
  signatureDate: props.initialData.signatureDate ?? '2026-08-21',
  signerRole: props.initialData.signerRole ?? 'patient',
})

const selectedCarrierLabel = computed(() => {
  const found = INSURANCE_CARRIERS.find((c) => c.id === formData.insuranceCarrier)
  return found ? found.label : formData.insuranceCarrier
})

function toggleCondition(conditionId: string, checked: boolean | 'indeterminate') {
  if (checked === true) {
    if (!formData.chronicConditions.includes(conditionId)) {
      formData.chronicConditions.push(conditionId)
    }
  } else {
    formData.chronicConditions = formData.chronicConditions.filter((id) => id !== conditionId)
  }
}

function onStepperInput(value: number) {
  if (value < step.value && step.value !== 5) {
    step.value = value
    emits('step-change', value)
  }
}

function goNext() {
  if (step.value < 4) {
    step.value += 1
    emits('step-change', step.value)
  }
}

function handleSubmit() {
  submitted.value = true
  step.value = 5
  emits('submit', { ...formData })
  emits('step-change', 5)
}

function resetForm() {
  step.value = 1
  submitted.value = false
  emits('step-change', 1)
}
</script>

<template>
  <SectionCard
    data-slot="patient-intake-form"
    title="New Patient Registration"
    description="HIPAA-compliant digital intake questionnaire & clinical onboarding portal."
    :class="['max-w-4xl', props.class]"
  >
    <template #header-action>
      <div class="flex items-center gap-2">
        <Badge
          wrap
          variant="outline"
          class="gap-1 border-emerald-500/30 bg-emerald-500/10 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
        >
          <ShieldCheck class="size-3.5" aria-hidden="true" />
          HIPAA Protected
        </Badge>
        <Badge wrap variant="secondary" class="hidden font-mono text-xs sm:inline-flex"> Form #PHI-2026-894 </Badge>
      </div>
    </template>

    <!-- Stepper Navigation -->
    <Stepper v-if="step <= 4" :steps="steps" :model-value="step" class="mb-6" @update:model-value="onStepperInput" />

    <!-- ================================================================= -->
    <!-- STEP 1: Personal Information                                      -->
    <!-- ================================================================= -->
    <div v-if="step === 1" class="space-y-6">
      <!-- PHI Notice Banner -->
      <div class="border-border/80 bg-muted/40 flex items-start gap-3 rounded-lg border p-3.5 text-xs">
        <ShieldCheck class="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <div class="space-y-0.5">
          <p class="text-foreground font-semibold">Protected Health Information (PHI) Notice</p>
          <p class="text-muted-foreground leading-relaxed">
            All legal demographics and medical history submitted through this portal are encrypted in accordance with
            federal HIPAA Omnibus rules and directly synchronized with the clinic's Electronic Health Record (EHR).
          </p>
        </div>
      </div>

      <!-- Legal Name Section -->
      <div class="space-y-3">
        <h3 class="text-foreground flex items-center gap-2 text-xs font-semibold">
          <User class="text-primary size-3.5" aria-hidden="true" />
          Legal Patient Identification
        </h3>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div class="space-y-1.5 sm:col-span-1">
            <Label for="pi-first-name" class="text-xs">Legal First Name *</Label>
            <Input id="pi-first-name" v-model="formData.firstName" placeholder="First name" size="small" />
          </div>
          <div class="space-y-1.5 sm:col-span-1">
            <Label for="pi-middle-name" class="text-xs">Middle Name</Label>
            <Input id="pi-middle-name" v-model="formData.middleName" placeholder="Middle name" size="small" />
          </div>
          <div class="space-y-1.5 sm:col-span-1">
            <Label for="pi-last-name" class="text-xs">Legal Last Name *</Label>
            <Input id="pi-last-name" v-model="formData.lastName" placeholder="Last name" size="small" />
          </div>
          <div class="space-y-1.5 sm:col-span-1">
            <Label for="pi-preferred-name" class="text-xs">Preferred Name</Label>
            <Input
              id="pi-preferred-name"
              v-model="formData.preferredName"
              placeholder="Nickname / Preferred"
              size="small"
            />
          </div>
        </div>
      </div>

      <Separator />

      <!-- Demographics Section -->
      <div class="space-y-3">
        <h3 class="text-foreground flex items-center gap-2 text-xs font-semibold">
          <Calendar class="text-primary size-3.5" aria-hidden="true" />
          Birth & Clinical Demographics
        </h3>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div class="space-y-1.5">
            <Label for="pi-dob" class="text-xs">Date of Birth *</Label>
            <Input id="pi-dob" v-model="formData.dob" type="date" size="small" />
          </div>
          <div class="space-y-1.5">
            <Label for="pi-biological-sex" class="text-xs">Biological Sex Assigned at Birth *</Label>
            <Select v-model="formData.biologicalSex">
              <SelectTrigger id="pi-biological-sex" size="sm" class="h-8 text-xs">
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="intersex">Intersex</SelectItem>
                <SelectItem value="undisclosed">Prefer not to disclose</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-1.5">
            <Label for="pi-marital-status" class="text-xs">Marital Status</Label>
            <Select v-model="formData.maritalStatus">
              <SelectTrigger id="pi-marital-status" size="sm" class="h-8 text-xs">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <!-- Contact & Residential Address -->
      <div class="space-y-3">
        <h3 class="text-foreground flex items-center gap-2 text-xs font-semibold">
          <Phone class="text-primary size-3.5" aria-hidden="true" />
          Contact & Residential Address
        </h3>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div class="space-y-1.5">
            <Label for="pi-phone" class="text-xs">Mobile Phone Number *</Label>
            <Input id="pi-phone" v-model="formData.phone" type="tel" placeholder="(555) 234-8921" size="small" />
          </div>
          <div class="space-y-1.5">
            <Label for="pi-email" class="text-xs">Email Address *</Label>
            <Input id="pi-email" v-model="formData.email" type="email" placeholder="patient@example.com" size="small" />
          </div>
          <div class="space-y-1.5 sm:col-span-2">
            <Label for="pi-address" class="text-xs">Street Address *</Label>
            <Input id="pi-address" v-model="formData.streetAddress" placeholder="Street, Apt / Suite" size="small" />
          </div>
          <div class="grid grid-cols-1 gap-3 sm:col-span-2 sm:grid-cols-3">
            <div class="col-span-1 space-y-1.5">
              <Label for="pi-city" class="text-xs">City</Label>
              <Input id="pi-city" v-model="formData.city" placeholder="City" size="small" />
            </div>
            <div class="col-span-1 space-y-1.5">
              <Label for="pi-state" class="text-xs">State</Label>
              <Input id="pi-state" v-model="formData.state" placeholder="State / Province" size="small" />
            </div>
            <div class="col-span-1 space-y-1.5">
              <Label for="pi-zip" class="text-xs">ZIP Code</Label>
              <Input id="pi-zip" v-model="formData.zipCode" placeholder="ZIP code" size="small" />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <!-- Emergency Contact Box -->
      <div class="border-border bg-muted/20 space-y-3 rounded-lg border p-4">
        <div class="flex flex-wrap items-center justify-between">
          <div class="flex items-center gap-2">
            <UserCheck class="text-primary size-4" aria-hidden="true" />
            <h4 class="text-foreground text-xs font-semibold">Emergency Contact (Designated Healthcare Surrogate)</h4>
          </div>
          <Badge wrap variant="secondary" class="text-xs">Required</Badge>
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div class="space-y-1.5">
            <Label for="pi-emg-name" class="text-xs">Contact Full Name *</Label>
            <Input id="pi-emg-name" v-model="formData.emergencyName" placeholder="Full legal name" size="small" />
          </div>
          <div class="space-y-1.5">
            <Label for="pi-emg-rel" class="text-xs">Relationship to Patient *</Label>
            <Select v-model="formData.emergencyRelationship">
              <SelectTrigger id="pi-emg-rel" size="sm" class="h-8 text-xs">
                <SelectValue placeholder="Relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="parent">Parent / Guardian</SelectItem>
                <SelectItem value="child">Adult Child</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="friend">Friend / Relative</SelectItem>
                <SelectItem value="other">Other Legal Representative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-1.5">
            <Label for="pi-emg-phone" class="text-xs">Emergency Phone *</Label>
            <Input
              id="pi-emg-phone"
              v-model="formData.emergencyPhone"
              type="tel"
              placeholder="(555) 987-6543"
              size="small"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- STEP 2: Medical History                                           -->
    <!-- ================================================================= -->
    <div v-else-if="step === 2" class="space-y-6">
      <!-- Chronic Conditions Checklist -->
      <div class="space-y-3">
        <div class="flex flex-wrap items-center justify-between">
          <div class="flex items-center gap-2">
            <Activity class="text-primary size-4" aria-hidden="true" />
            <h3 class="text-foreground text-xs font-semibold">Chronic & Pre-Existing Health Conditions</h3>
          </div>
          <Badge wrap variant="secondary" class="font-mono text-xs tabular-nums">
            {{ formData.chronicConditions.length }} selected
          </Badge>
        </div>
        <p class="text-muted-foreground text-xs">
          Select any conditions diagnosed or treated in the past 5 years. If none apply, leave unchecked.
        </p>
        <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div
            v-for="cond in CHRONIC_CONDITIONS"
            :key="cond.id"
            class="border-border hover:bg-muted/30 flex items-center gap-2.5 rounded-lg border p-2.5 transition-colors"
          >
            <Checkbox
              :id="`condition-${cond.id}`"
              :model-value="formData.chronicConditions.includes(cond.id)"
              @update:model-value="(val) => toggleCondition(cond.id, val)"
            />
            <Label :for="`condition-${cond.id}`" class="flex-1 cursor-pointer text-xs font-normal select-none">
              {{ cond.label }}
            </Label>
          </div>
        </div>
      </div>

      <Separator />

      <!-- Known Allergies -->
      <div class="border-border bg-muted/20 space-y-3 rounded-lg border p-4">
        <div class="flex flex-wrap items-center justify-between">
          <div class="flex items-center gap-2">
            <AlertTriangle class="size-4 text-amber-500" aria-hidden="true" />
            <h4 class="text-foreground text-xs font-semibold">Known Drug, Latex, or Food Allergies</h4>
          </div>
          <div class="flex items-center gap-2">
            <Checkbox id="mh-has-allergies" v-model="formData.hasAllergies" label="I have known allergies" />
          </div>
        </div>
        <div v-if="formData.hasAllergies" class="space-y-1.5 pt-1">
          <Label for="mh-allergy-details" class="text-xs"> List Specific Allergens & Adverse Reactions * </Label>
          <Input
            id="mh-allergy-details"
            v-model="formData.allergyDetails"
            placeholder="e.g., Penicillin (Anaphylaxis), Sulfa (Severe Rash), Peanuts (Hives), Latex"
            size="small"
          />
        </div>
        <p v-else class="text-muted-foreground text-xs italic">No known drug, latex, or food allergies reported.</p>
      </div>

      <Separator />

      <!-- Current Medications -->
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <Stethoscope class="text-primary size-4" aria-hidden="true" />
          <Label for="mh-medications" class="text-xs font-semibold"> Current Prescription & OTC Medications </Label>
        </div>
        <Textarea
          id="mh-medications"
          v-model="formData.currentMedications"
          :rows="3"
          placeholder="Include drug name, dosage, and schedule (e.g., Lisinopril 10mg once daily in AM, Metformin 500mg BID with meals)..."
          class="text-xs"
        />
        <p class="text-muted-foreground text-xs">
          Include all daily vitamins, herbal supplements, inhalers, and injections.
        </p>
      </div>

      <Separator />

      <!-- Past Surgeries -->
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <FileText class="text-primary size-4" aria-hidden="true" />
          <Label for="mh-surgeries" class="text-xs font-semibold">
            Past Surgeries, Major Injuries & Hospitalizations
          </Label>
        </div>
        <Textarea
          id="mh-surgeries"
          v-model="formData.pastSurgeries"
          :rows="2"
          placeholder="List approximate year and procedure (e.g., Appendectomy 2016, Knee Arthroscopy 2021)..."
          class="text-xs"
        />
      </div>

      <Separator />

      <!-- Primary Care Physician -->
      <div class="space-y-3">
        <h4 class="text-foreground text-xs font-semibold">Primary Care Provider / Referring Clinic</h4>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div class="space-y-1.5">
            <Label for="mh-pcp-name" class="text-xs">Physician or Practice Name</Label>
            <Input
              id="mh-pcp-name"
              v-model="formData.primaryCarePhysician"
              placeholder="Dr. Robert Chen, MD"
              size="small"
            />
          </div>
          <div class="space-y-1.5">
            <Label for="mh-clinic-phone" class="text-xs">Clinic Contact / Phone</Label>
            <Input id="mh-clinic-phone" v-model="formData.clinicPhone" placeholder="(555) 601-2290" size="small" />
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- STEP 3: Insurance & Billing                                       -->
    <!-- ================================================================= -->
    <div v-else-if="step === 3" class="space-y-6">
      <!-- Primary Insurance Carrier -->
      <div class="space-y-3">
        <div class="flex flex-wrap items-center justify-between">
          <div class="flex items-center gap-2">
            <Building2 class="text-primary size-4" aria-hidden="true" />
            <h3 class="text-foreground text-xs font-semibold">Primary Medical Insurance Carrier</h3>
          </div>
          <Badge wrap variant="outline" class="text-xs">Primary Plan</Badge>
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div class="space-y-1.5">
            <Label for="ins-carrier" class="text-xs">Insurance Carrier *</Label>
            <Select v-model="formData.insuranceCarrier">
              <SelectTrigger id="ins-carrier" size="sm" class="h-8 text-xs">
                <SelectValue placeholder="Select carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="carrier in INSURANCE_CARRIERS" :key="carrier.id" :value="carrier.id">
                  {{ carrier.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-1.5">
            <Label for="ins-member-id" class="text-xs">Member / Subscriber ID *</Label>
            <Input id="ins-member-id" v-model="formData.memberId" placeholder="e.g. XEH-902814891" size="small" />
          </div>
          <div class="space-y-1.5">
            <Label for="ins-group-num" class="text-xs">Group Number</Label>
            <Input id="ins-group-num" v-model="formData.groupNumber" placeholder="e.g. GRP-44028" size="small" />
          </div>
        </div>
      </div>

      <Separator />

      <!-- Policyholder Details -->
      <div class="space-y-3">
        <h3 class="text-foreground flex items-center gap-2 text-xs font-semibold">
          <User class="text-primary size-3.5" aria-hidden="true" />
          Primary Policyholder Information
        </h3>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div class="space-y-1.5">
            <Label for="ins-holder-name" class="text-xs">Primary Insured Full Legal Name *</Label>
            <Input
              id="ins-holder-name"
              v-model="formData.policyholderName"
              placeholder="Policyholder name"
              size="small"
            />
          </div>
          <div class="space-y-1.5">
            <Label for="ins-holder-rel" class="text-xs">Relationship to Patient *</Label>
            <Select v-model="formData.policyholderRelationship">
              <SelectTrigger id="ins-holder-rel" size="sm" class="h-8 text-xs">
                <SelectValue placeholder="Relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="self">Self (Patient is Policyholder)</SelectItem>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="child">Child / Dependent</SelectItem>
                <SelectItem value="other">Other Legal Custodian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <!-- Insurance Card Photo Upload Placeholders -->
      <div class="space-y-3">
        <div class="flex flex-wrap items-center justify-between">
          <div class="flex items-center gap-2">
            <CreditCard class="text-primary size-4" aria-hidden="true" />
            <h3 class="text-foreground text-xs font-semibold">Insurance Card Photo Verification</h3>
          </div>
          <span class="text-muted-foreground text-xs">PNG, JPG, PDF up to 10MB</span>
        </div>
        <p class="text-muted-foreground text-xs">
          Provide high-resolution photos of both front and back sides of your insurance card for optical character
          recognition (OCR) and benefit eligibility verification.
        </p>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <!-- Front Card Dropzone -->
          <div
            class="border-border bg-card hover:bg-muted/20 flex flex-col justify-between rounded-xl border p-4 text-center transition-colors"
          >
            <div class="space-y-2 py-3">
              <div class="bg-primary/10 text-primary mx-auto flex size-10 items-center justify-center rounded-full">
                <CreditCard class="size-5" aria-hidden="true" />
              </div>
              <div class="space-y-0.5">
                <p class="text-foreground text-xs font-semibold">Front of Insurance Card</p>
                <p class="text-muted-foreground text-xs">Subscriber ID & carrier logo visible</p>
              </div>
            </div>
            <div
              class="border-border/60 bg-muted/40 flex flex-wrap items-center justify-between rounded-md border px-3 py-2 text-xs"
            >
              <span
                v-if="formData.frontCardUploaded"
                class="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400"
              >
                <Check class="size-3.5" aria-hidden="true" />
                card_front_scan.jpg (2.4 MB)
              </span>
              <span v-else class="text-muted-foreground">No file selected</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                class="h-7 text-xs font-medium"
                @click="formData.frontCardUploaded = !formData.frontCardUploaded"
              >
                {{ formData.frontCardUploaded ? 'Replace' : 'Upload Front' }}
              </Button>
            </div>
          </div>

          <!-- Back Card Dropzone -->
          <div
            class="border-border bg-card hover:bg-muted/20 flex flex-col justify-between rounded-xl border p-4 text-center transition-colors"
          >
            <div class="space-y-2 py-3">
              <div class="bg-primary/10 text-primary mx-auto flex size-10 items-center justify-center rounded-full">
                <CreditCard class="size-5" aria-hidden="true" />
              </div>
              <div class="space-y-0.5">
                <p class="text-foreground text-xs font-semibold">Back of Insurance Card</p>
                <p class="text-muted-foreground text-xs">Claims address & Rx BIN visible</p>
              </div>
            </div>
            <div
              class="border-border/60 bg-muted/40 flex flex-wrap items-center justify-between rounded-md border px-3 py-2 text-xs"
            >
              <span
                v-if="formData.backCardUploaded"
                class="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400"
              >
                <Check class="size-3.5" aria-hidden="true" />
                card_back_scan.jpg (1.9 MB)
              </span>
              <span v-else class="text-muted-foreground">No file selected</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                class="h-7 text-xs font-medium"
                @click="formData.backCardUploaded = !formData.backCardUploaded"
              >
                {{ formData.backCardUploaded ? 'Replace' : 'Upload Back' }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- STEP 4: Consent & Sign                                            -->
    <!-- ================================================================= -->
    <div v-else-if="step === 4" class="space-y-6">
      <!-- Legal Notice Accordion Box -->
      <div class="space-y-2">
        <div class="flex flex-wrap items-center justify-between">
          <div class="flex items-center gap-2">
            <FileText class="text-primary size-4" aria-hidden="true" />
            <h3 class="text-foreground text-xs font-semibold">Regulatory Disclosures & Legal Notice</h3>
          </div>
          <Badge wrap variant="secondary" class="text-xs">Mandatory Acknowledgement</Badge>
        </div>
        <div
          class="border-border bg-muted/20 text-muted-foreground max-h-40 space-y-3 overflow-y-auto rounded-lg border p-3.5 text-xs leading-relaxed"
        >
          <div>
            <span class="text-foreground font-semibold">1. HIPAA Notice of Privacy Practices:</span>
            I acknowledge receipt and review of the Notice of Privacy Practices, which describes how my Protected Health
            Information (PHI) may be used and disclosed for clinical treatment, payment processing, and healthcare
            operations in strict compliance with the HIPAA Omnibus Rule (45 CFR § 164.520).
          </div>
          <div>
            <span class="text-foreground font-semibold">2. Informed Consent for Outpatient Treatment:</span>
            I voluntarily authorize the clinical physicians and allied healthcare team to perform diagnostic
            evaluations, blood tests, physical examinations, and outpatient clinical care deemed medically necessary.
          </div>
          <div>
            <span class="text-foreground font-semibold">3. Assignment of Benefits & Financial Agreement:</span>
            I assign all medical insurance benefits directly to the provider. I acknowledge that I remain financially
            responsible for copayments, deductibles, and non-covered services not adjudicated by my carrier.
          </div>
        </div>
      </div>

      <!-- Consent Checkboxes -->
      <div class="divide-border divide-y rounded-lg border">
        <div class="flex items-start gap-3 p-3.5">
          <Checkbox id="cs-hipaa-consent" v-model="formData.hipaaConsent" class="mt-0.5" />
          <div class="space-y-0.5">
            <Label for="cs-hipaa-consent" class="cursor-pointer text-xs font-medium">
              HIPAA Privacy Practices Acknowledgement *
            </Label>
            <p class="text-muted-foreground text-xs">
              I have read, understood, and accept the HIPAA Notice of Privacy Practices and consent to electronic
              medical record management.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3 p-3.5">
          <Checkbox id="cs-treatment-consent" v-model="formData.treatmentConsent" class="mt-0.5" />
          <div class="space-y-0.5">
            <Label for="cs-treatment-consent" class="cursor-pointer text-xs font-medium">
              Informed Treatment Consent & Benefit Assignment *
            </Label>
            <p class="text-muted-foreground text-xs">
              I authorize medical evaluation and agree to the assignment of insurance benefits to the clinical care
              provider.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3 p-3.5">
          <Checkbox id="cs-telehealth-consent" v-model="formData.telehealthConsent" class="mt-0.5" />
          <div class="space-y-0.5">
            <Label for="cs-telehealth-consent" class="cursor-pointer text-xs font-medium">
              Telehealth & Encrypted Digital Communications (Optional)
            </Label>
            <p class="text-muted-foreground text-xs">
              I consent to virtual video consultations and automated SMS/email appointment notifications and lab report
              alerts.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <!-- Electronic Signature Pad -->
      <div class="space-y-4">
        <div class="flex flex-wrap items-center justify-between">
          <div class="flex items-center gap-2">
            <Lock class="text-primary size-4" aria-hidden="true" />
            <h3 class="text-foreground text-xs font-semibold">Electronic Signature & Digital Certification</h3>
          </div>
          <Badge wrap variant="outline" class="border-primary/30 text-primary font-mono text-xs">
            256-bit Certified
          </Badge>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div class="space-y-1.5 sm:col-span-1">
            <Label for="cs-signer-name" class="text-xs">Type Full Legal Name as Signature *</Label>
            <Input
              id="cs-signer-name"
              v-model="formData.signatureName"
              placeholder="e.g. Eleanor R. Vance"
              size="small"
            />
          </div>
          <div class="space-y-1.5 sm:col-span-1">
            <Label for="cs-signer-role" class="text-xs">Signer Capacity / Role *</Label>
            <Select v-model="formData.signerRole">
              <SelectTrigger id="cs-signer-role" size="sm" class="h-8 text-xs">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">Patient (Self)</SelectItem>
                <SelectItem value="parent_guardian">Parent / Legal Guardian</SelectItem>
                <SelectItem value="poa">Medical Power of Attorney</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-1.5 sm:col-span-1">
            <Label for="cs-sig-date" class="text-xs">Signature Date *</Label>
            <Input id="cs-sig-date" v-model="formData.signatureDate" type="date" size="small" />
          </div>
        </div>

        <!-- Live Digital Signature Stamp Preview -->
        <div class="border-primary/30 bg-primary/5 space-y-3 rounded-xl border p-4">
          <div class="flex flex-wrap items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium"> Legal Digital Signature Stamp </span>
            <span class="text-primary flex items-center gap-1 font-mono text-xs">
              <ShieldCheck class="size-3.5" aria-hidden="true" />
              Verified & Timestamped
            </span>
          </div>

          <div class="border-primary/20 border-b pt-1 pb-3">
            <p class="text-primary text-2xl font-medium tracking-wide italic">
              {{ formData.signatureName || 'Your Signature' }}
            </p>
          </div>

          <div class="text-muted-foreground flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
            <span>Signer: {{ formData.signatureName || 'Eleanor Vance' }} ({{ formData.signerRole }})</span>
            <span>Date: {{ formData.signatureDate }} · Ref #SIG-49102-HIPAA</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- STEP 5: Success / Confirmation Receipt                            -->
    <!-- ================================================================= -->
    <div v-else-if="step === 5" class="space-y-6 py-4 text-center">
      <div class="relative mx-auto size-16">
        <span class="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl" aria-hidden="true"></span>
        <span
          class="relative flex size-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 shadow-xs dark:text-emerald-400"
        >
          <Check class="size-8" aria-hidden="true" />
        </span>
      </div>

      <div class="space-y-1">
        <h3 class="text-foreground text-xl font-bold tracking-tight">Patient Intake Submitted Successfully</h3>
        <p class="text-muted-foreground mx-auto max-w-md text-xs sm:text-sm">
          Your new patient registration and encrypted medical disclosures have been received and queued for clinical
          triage.
        </p>
      </div>

      <div class="border-border inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
        <span class="text-muted-foreground">Confirmation ID:</span>
        <span class="text-foreground font-mono font-bold">{{ intakeId }}</span>
      </div>

      <!-- Registration Summary Card -->
      <div class="border-border bg-muted/30 mx-auto max-w-xl space-y-3 rounded-xl border p-4 text-left text-xs">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <span class="text-muted-foreground block">Patient Name:</span>
            <span class="text-foreground font-semibold"
              >{{ formData.firstName }} {{ formData.middleName }} {{ formData.lastName }}</span
            >
          </div>
          <div>
            <span class="text-muted-foreground block">Date of Birth:</span>
            <span class="text-foreground font-medium tabular-nums"
              >{{ formData.dob }} ({{ formData.biologicalSex }})</span
            >
          </div>
          <div>
            <span class="text-muted-foreground block">Primary Insurance:</span>
            <span class="text-foreground font-medium">{{ selectedCarrierLabel }} (ID: {{ formData.memberId }})</span>
          </div>
          <div>
            <span class="text-muted-foreground block">Emergency Contact:</span>
            <span class="text-foreground font-medium"
              >{{ formData.emergencyName }} ({{ formData.emergencyPhone }})</span
            >
          </div>
          <div
            class="border-border/60 col-span-1 flex flex-wrap items-center justify-between border-t pt-2 sm:col-span-2"
          >
            <span class="text-muted-foreground">Legal Signature:</span>
            <span class="text-primary font-medium tracking-wide italic"
              >{{ formData.signatureName }} ({{ formData.signatureDate }})</span
            >
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button aria-label="Download attachment" variant="outline" size="sm" class="gap-1.5 text-xs font-medium">
          <Download class="size-3.5" aria-hidden="true" />
          Download Intake PDF
        </Button>
        <Button size="sm" class="gap-1.5 text-xs font-medium" @click="resetForm">
          <RotateCcw class="size-3.5" aria-hidden="true" />
          Register Another Patient
        </Button>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- FOOTER CONTROLS                                                   -->
    <!-- ================================================================= -->
    <template #footer>
      <div class="border-border bg-muted/20 flex w-full items-center justify-between border-t px-6 py-4">
        <Button
          v-if="step > 1 && step <= 4"
          variant="ghost"
          size="sm"
          class="gap-1.5 text-xs font-medium"
          @click="step -= 1"
        >
          <ChevronLeft class="size-4" aria-hidden="true" />
          Back
        </Button>
        <span v-else aria-hidden="true" />

        <span v-if="step <= 4" class="text-muted-foreground text-xs font-medium">
          Step {{ step }} of 4 — {{ steps[step - 1]?.title }}
        </span>
        <span v-else class="text-muted-foreground text-xs font-medium">Registration Complete</span>

        <Button
          v-if="step < 4"
          size="sm"
          class="gap-1.5 text-xs font-medium"
          :disabled="step === 1 && (formData.firstName.trim() === '' || formData.lastName.trim() === '')"
          @click="goNext"
        >
          Continue
          <ChevronRight class="size-4" aria-hidden="true" />
        </Button>
        <Button
          v-else-if="step === 4"
          size="sm"
          class="bg-primary text-primary-foreground gap-1.5 text-xs font-medium"
          :disabled="!formData.hipaaConsent || !formData.treatmentConsent || formData.signatureName.trim() === ''"
          @click="handleSubmit"
        >
          <FileCheck class="size-4" aria-hidden="true" />
          Submit Registration
        </Button>
        <span v-else aria-hidden="true" />
      </div>
    </template>
  </SectionCard>
</template>
