'use client'

import * as React from 'react'
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
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

export interface PatientIntakeFormProps {
  initialStep?: number
  initialData?: Partial<PatientIntakeData>
  className?: string
  onSubmit?: (data: PatientIntakeData) => void
  onStepChange?: (step: number) => void
}

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

const DEFAULT_DATA: PatientIntakeData = {
  firstName: 'Eleanor',
  middleName: 'Rose',
  lastName: 'Vance',
  preferredName: 'Ellie',
  dob: '1988-10-14',
  biologicalSex: 'female',
  maritalStatus: 'married',
  phone: '(555) 234-8921',
  email: 'eleanor.vance@example.com',
  streetAddress: '742 Evergreen Terrace',
  city: 'Springfield',
  state: 'OR',
  zipCode: '97477',
  emergencyName: 'Marcus Vance',
  emergencyRelationship: 'spouse',
  emergencyPhone: '(555) 987-6543',

  chronicConditions: ['hypertension', 'asthma'],
  hasAllergies: true,
  allergyDetails: 'Penicillin (Anaphylaxis/hives), Sulfa antibiotics (severe skin rash)',
  currentMedications:
    'Lisinopril 10mg PO once daily in morning, Albuterol HFA 90mcg inhaler 1-2 puffs Q4H PRN for bronchospasm, Multivitamin daily',
  pastSurgeries: 'Appendectomy (Laparoscopic, 2016), Right knee arthroscopy / meniscus debridement (2021)',
  primaryCarePhysician: 'Dr. Robert Chen, MD',
  clinicPhone: '(555) 601-2290 — Northwest Health Partners',

  insuranceCarrier: 'bcbs',
  memberId: 'XEH-902814891',
  groupNumber: 'GRP-44028',
  policyholderName: 'Eleanor Vance',
  policyholderRelationship: 'self',
  frontCardUploaded: true,
  backCardUploaded: true,

  hipaaConsent: true,
  treatmentConsent: true,
  telehealthConsent: true,
  signatureName: 'Eleanor R. Vance',
  signatureDate: '2026-08-21',
  signerRole: 'patient',
}

export function PatientIntakeForm({
  initialStep = 1,
  initialData = {},
  className,
  onSubmit,
  onStepChange,
}: PatientIntakeFormProps) {
  const [step, setStep] = React.useState(initialStep)
  const [, setSubmitted] = React.useState(false)
  const [intakeId] = React.useState('INTAKE-2026-8942')

  const [formData, setFormData] = React.useState<PatientIntakeData>(() => ({
    ...DEFAULT_DATA,
    ...initialData,
  }))

  const updateField = <K extends keyof PatientIntakeData>(key: K, value: PatientIntakeData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const toggleCondition = (conditionId: string, checked: boolean) => {
    setFormData((prev) => {
      const exists = prev.chronicConditions.includes(conditionId)
      if (checked && !exists) {
        return { ...prev, chronicConditions: [...prev.chronicConditions, conditionId] }
      }
      if (!checked && exists) {
        return { ...prev, chronicConditions: prev.chronicConditions.filter((id) => id !== conditionId) }
      }
      return prev
    })
  }

  const selectedCarrierLabel = React.useMemo(() => {
    const found = INSURANCE_CARRIERS.find((c) => c.id === formData.insuranceCarrier)
    return found ? found.label : formData.insuranceCarrier
  }, [formData.insuranceCarrier])

  function onStepperInput(value: number) {
    if (value < step && step !== 5) {
      setStep(value)
      onStepChange?.(value)
    }
  }

  function goNext() {
    if (step < 4) {
      const next = step + 1
      setStep(next)
      onStepChange?.(next)
    }
  }

  function handleSubmit() {
    setSubmitted(true)
    setStep(5)
    onSubmit?.({ ...formData })
    onStepChange?.(5)
  }

  function resetForm() {
    setStep(1)
    setSubmitted(false)
    onStepChange?.(1)
  }

  return (
    <SectionCard
      data-slot="patient-intake-form"
      title="New Patient Registration"
      description="HIPAA-compliant digital intake questionnaire & clinical onboarding portal."
      className={cn('max-w-4xl', className)}
      headerAction={
        <div className="flex items-center gap-2">
          <Badge
            wrap
            variant="outline"
            className="gap-1 border-emerald-500/30 bg-emerald-500/10 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
          >
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            HIPAA Protected
          </Badge>
          <Badge wrap variant="secondary" className="hidden font-mono text-xs sm:inline-flex">
            Form #PHI-2026-894
          </Badge>
        </div>
      }
      footer={
        <div className="border-border bg-muted/20 flex w-full items-center justify-between border-t px-6 py-4">
          {step > 1 && step <= 4 ? (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs font-medium"
              onClick={() => {
                const prev = step - 1
                setStep(prev)
                onStepChange?.(prev)
              }}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Back
            </Button>
          ) : (
            <span aria-hidden="true" />
          )}

          {step <= 4 ? (
            <span className="text-muted-foreground text-xs font-medium">
              Step {step} of 4 — {steps[step - 1]?.title}
            </span>
          ) : (
            <span className="text-muted-foreground text-xs font-medium">Registration Complete</span>
          )}

          {step < 4 ? (
            <Button
              size="sm"
              className="gap-1.5 text-xs font-medium"
              disabled={step === 1 && (formData.firstName.trim() === '' || formData.lastName.trim() === '')}
              onClick={goNext}
            >
              Continue
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          ) : step === 4 ? (
            <Button
              size="sm"
              className="bg-primary text-primary-foreground gap-1.5 text-xs font-medium"
              disabled={!formData.hipaaConsent || !formData.treatmentConsent || formData.signatureName.trim() === ''}
              onClick={handleSubmit}
            >
              <FileCheck className="size-4" aria-hidden="true" />
              Submit Registration
            </Button>
          ) : (
            <span aria-hidden="true" />
          )}
        </div>
      }
    >
      {/* Stepper Navigation */}
      {step <= 4 && <Stepper steps={steps} value={step} onValueChange={onStepperInput} className="mb-6" />}

      {/* ================================================================= */}
      {/* STEP 1: Personal Information                                      */}
      {/* ================================================================= */}
      {step === 1 && (
        <div className="space-y-6">
          {/* PHI Notice Banner */}
          <div className="border-border/80 bg-muted/40 flex items-start gap-3 rounded-lg border p-3.5 text-xs">
            <ShieldCheck className="text-primary mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div className="space-y-0.5">
              <p className="text-foreground font-semibold">Protected Health Information (PHI) Notice</p>
              <p className="text-muted-foreground leading-relaxed">
                All legal demographics and medical history submitted through this portal are encrypted in accordance
                with federal HIPAA Omnibus rules and directly synchronized with the clinic&apos;s Electronic Health
                Record (EHR).
              </p>
            </div>
          </div>

          {/* Legal Name Section */}
          <div className="space-y-3">
            <h3 className="text-foreground flex items-center gap-2 text-xs font-semibold">
              <User className="text-primary size-3.5" aria-hidden="true" />
              Legal Patient Identification
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="pi-first-name" className="text-xs">
                  Legal First Name *
                </Label>
                <Input
                  id="pi-first-name"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder="First name"
                  size="small"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="pi-middle-name" className="text-xs">
                  Middle Name
                </Label>
                <Input
                  id="pi-middle-name"
                  value={formData.middleName}
                  onChange={(e) => updateField('middleName', e.target.value)}
                  placeholder="Middle name"
                  size="small"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="pi-last-name" className="text-xs">
                  Legal Last Name *
                </Label>
                <Input
                  id="pi-last-name"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder="Last name"
                  size="small"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="pi-preferred-name" className="text-xs">
                  Preferred Name
                </Label>
                <Input
                  id="pi-preferred-name"
                  value={formData.preferredName}
                  onChange={(e) => updateField('preferredName', e.target.value)}
                  placeholder="Nickname / Preferred"
                  size="small"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Demographics Section */}
          <div className="space-y-3">
            <h3 className="text-foreground flex items-center gap-2 text-xs font-semibold">
              <Calendar className="text-primary size-3.5" aria-hidden="true" />
              Birth & Clinical Demographics
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="pi-dob" className="text-xs">
                  Date of Birth *
                </Label>
                <Input
                  id="pi-dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => updateField('dob', e.target.value)}
                  size="small"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pi-biological-sex" className="text-xs">
                  Biological Sex Assigned at Birth *
                </Label>
                <Select value={formData.biologicalSex} onValueChange={(val) => updateField('biologicalSex', val)}>
                  <SelectTrigger id="pi-biological-sex" size="sm" className="h-8 text-xs">
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
              <div className="space-y-1.5">
                <Label htmlFor="pi-marital-status" className="text-xs">
                  Marital Status
                </Label>
                <Select value={formData.maritalStatus} onValueChange={(val) => updateField('maritalStatus', val)}>
                  <SelectTrigger id="pi-marital-status" size="sm" className="h-8 text-xs">
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

          {/* Contact & Residential Address */}
          <div className="space-y-3">
            <h3 className="text-foreground flex items-center gap-2 text-xs font-semibold">
              <Phone className="text-primary size-3.5" aria-hidden="true" />
              Contact & Residential Address
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="pi-phone" className="text-xs">
                  Mobile Phone Number *
                </Label>
                <Input
                  id="pi-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="(555) 234-8921"
                  size="small"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pi-email" className="text-xs">
                  Email Address *
                </Label>
                <Input
                  id="pi-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="patient@example.com"
                  size="small"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="pi-address" className="text-xs">
                  Street Address *
                </Label>
                <Input
                  id="pi-address"
                  value={formData.streetAddress}
                  onChange={(e) => updateField('streetAddress', e.target.value)}
                  placeholder="Street, Apt / Suite"
                  size="small"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:col-span-2 sm:grid-cols-3">
                <div className="col-span-1 space-y-1.5">
                  <Label htmlFor="pi-city" className="text-xs">
                    City
                  </Label>
                  <Input
                    id="pi-city"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="City"
                    size="small"
                  />
                </div>
                <div className="col-span-1 space-y-1.5">
                  <Label htmlFor="pi-state" className="text-xs">
                    State
                  </Label>
                  <Input
                    id="pi-state"
                    value={formData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    placeholder="State / Province"
                    size="small"
                  />
                </div>
                <div className="col-span-1 space-y-1.5">
                  <Label htmlFor="pi-zip" className="text-xs">
                    ZIP Code
                  </Label>
                  <Input
                    id="pi-zip"
                    value={formData.zipCode}
                    onChange={(e) => updateField('zipCode', e.target.value)}
                    placeholder="ZIP code"
                    size="small"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Emergency Contact Box */}
          <div className="border-border bg-muted/20 space-y-3 rounded-lg border p-4">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="text-primary size-4" aria-hidden="true" />
                <h4 className="text-foreground text-xs font-semibold">
                  Emergency Contact (Designated Healthcare Surrogate)
                </h4>
              </div>
              <Badge wrap variant="secondary" className="text-xs">
                Required
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="pi-emg-name" className="text-xs">
                  Contact Full Name *
                </Label>
                <Input
                  id="pi-emg-name"
                  value={formData.emergencyName}
                  onChange={(e) => updateField('emergencyName', e.target.value)}
                  placeholder="Full legal name"
                  size="small"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pi-emg-rel" className="text-xs">
                  Relationship to Patient *
                </Label>
                <Select
                  value={formData.emergencyRelationship}
                  onValueChange={(val) => updateField('emergencyRelationship', val)}
                >
                  <SelectTrigger id="pi-emg-rel" size="sm" className="h-8 text-xs">
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
              <div className="space-y-1.5">
                <Label htmlFor="pi-emg-phone" className="text-xs">
                  Emergency Phone *
                </Label>
                <Input
                  id="pi-emg-phone"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => updateField('emergencyPhone', e.target.value)}
                  placeholder="(555) 987-6543"
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* STEP 2: Medical History                                           */}
      {/* ================================================================= */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Chronic Conditions Checklist */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="text-primary size-4" aria-hidden="true" />
                <h3 className="text-foreground text-xs font-semibold">Chronic & Pre-Existing Health Conditions</h3>
              </div>
              <Badge wrap variant="secondary" className="font-mono text-xs tabular-nums">
                {formData.chronicConditions.length} selected
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              Select any conditions diagnosed or treated in the past 5 years. If none apply, leave unchecked.
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {CHRONIC_CONDITIONS.map((cond) => (
                <div
                  key={cond.id}
                  className="border-border hover:bg-muted/30 flex items-center gap-2.5 rounded-lg border p-2.5 transition-colors"
                >
                  <Checkbox
                    id={`condition-${cond.id}`}
                    checked={formData.chronicConditions.includes(cond.id)}
                    onCheckedChange={(checked) => toggleCondition(cond.id, checked === true)}
                  />
                  <Label
                    htmlFor={`condition-${cond.id}`}
                    className="flex-1 cursor-pointer text-xs font-normal select-none"
                  >
                    {cond.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Known Allergies */}
          <div className="border-border bg-muted/20 space-y-3 rounded-lg border p-4">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-500" aria-hidden="true" />
                <h4 className="text-foreground text-xs font-semibold">Known Drug, Latex, or Food Allergies</h4>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="mh-has-allergies"
                  checked={formData.hasAllergies}
                  onCheckedChange={(checked) => updateField('hasAllergies', checked === true)}
                  label="I have known allergies"
                />
              </div>
            </div>
            {formData.hasAllergies ? (
              <div className="space-y-1.5 pt-1">
                <Label htmlFor="mh-allergy-details" className="text-xs">
                  List Specific Allergens & Adverse Reactions *
                </Label>
                <Input
                  id="mh-allergy-details"
                  value={formData.allergyDetails}
                  onChange={(e) => updateField('allergyDetails', e.target.value)}
                  placeholder="e.g., Penicillin (Anaphylaxis), Sulfa (Severe Rash), Peanuts (Hives), Latex"
                  size="small"
                />
              </div>
            ) : (
              <p className="text-muted-foreground text-xs italic">No known drug, latex, or food allergies reported.</p>
            )}
          </div>

          <Separator />

          {/* Current Medications */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Stethoscope className="text-primary size-4" aria-hidden="true" />
              <Label htmlFor="mh-medications" className="text-xs font-semibold">
                Current Prescription & OTC Medications
              </Label>
            </div>
            <Textarea
              id="mh-medications"
              value={formData.currentMedications}
              onValueChange={(val) => updateField('currentMedications', val)}
              rows={3}
              placeholder="Include drug name, dosage, and schedule (e.g., Lisinopril 10mg once daily in AM, Metformin 500mg BID with meals)..."
              className="text-xs"
            />
            <p className="text-muted-foreground text-xs">
              Include all daily vitamins, herbal supplements, inhalers, and injections.
            </p>
          </div>

          <Separator />

          {/* Past Surgeries */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="text-primary size-4" aria-hidden="true" />
              <Label htmlFor="mh-surgeries" className="text-xs font-semibold">
                Past Surgeries, Major Injuries & Hospitalizations
              </Label>
            </div>
            <Textarea
              id="mh-surgeries"
              value={formData.pastSurgeries}
              onValueChange={(val) => updateField('pastSurgeries', val)}
              rows={2}
              placeholder="List approximate year and procedure (e.g., Appendectomy 2016, Knee Arthroscopy 2021)..."
              className="text-xs"
            />
          </div>

          <Separator />

          {/* Primary Care Physician */}
          <div className="space-y-3">
            <h4 className="text-foreground text-xs font-semibold">Primary Care Provider / Referring Clinic</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="mh-pcp-name" className="text-xs">
                  Physician or Practice Name
                </Label>
                <Input
                  id="mh-pcp-name"
                  value={formData.primaryCarePhysician}
                  onChange={(e) => updateField('primaryCarePhysician', e.target.value)}
                  placeholder="Dr. Robert Chen, MD"
                  size="small"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mh-clinic-phone" className="text-xs">
                  Clinic Contact / Phone
                </Label>
                <Input
                  id="mh-clinic-phone"
                  value={formData.clinicPhone}
                  onChange={(e) => updateField('clinicPhone', e.target.value)}
                  placeholder="(555) 601-2290"
                  size="small"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* STEP 3: Insurance & Billing                                       */}
      {/* ================================================================= */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Primary Insurance Carrier */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="text-primary size-4" aria-hidden="true" />
                <h3 className="text-foreground text-xs font-semibold">Primary Medical Insurance Carrier</h3>
              </div>
              <Badge wrap variant="outline" className="text-xs">
                Primary Plan
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="ins-carrier" className="text-xs">
                  Insurance Carrier *
                </Label>
                <Select value={formData.insuranceCarrier} onValueChange={(val) => updateField('insuranceCarrier', val)}>
                  <SelectTrigger id="ins-carrier" size="sm" className="h-8 text-xs">
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    {INSURANCE_CARRIERS.map((carrier) => (
                      <SelectItem key={carrier.id} value={carrier.id}>
                        {carrier.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ins-member-id" className="text-xs">
                  Member / Subscriber ID *
                </Label>
                <Input
                  id="ins-member-id"
                  value={formData.memberId}
                  onChange={(e) => updateField('memberId', e.target.value)}
                  placeholder="e.g. XEH-902814891"
                  size="small"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ins-group-num" className="text-xs">
                  Group Number
                </Label>
                <Input
                  id="ins-group-num"
                  value={formData.groupNumber}
                  onChange={(e) => updateField('groupNumber', e.target.value)}
                  placeholder="e.g. GRP-44028"
                  size="small"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Policyholder Details */}
          <div className="space-y-3">
            <h3 className="text-foreground flex items-center gap-2 text-xs font-semibold">
              <User className="text-primary size-3.5" aria-hidden="true" />
              Primary Policyholder Information
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="ins-holder-name" className="text-xs">
                  Primary Insured Full Legal Name *
                </Label>
                <Input
                  id="ins-holder-name"
                  value={formData.policyholderName}
                  onChange={(e) => updateField('policyholderName', e.target.value)}
                  placeholder="Policyholder name"
                  size="small"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ins-holder-rel" className="text-xs">
                  Relationship to Patient *
                </Label>
                <Select
                  value={formData.policyholderRelationship}
                  onValueChange={(val) => updateField('policyholderRelationship', val)}
                >
                  <SelectTrigger id="ins-holder-rel" size="sm" className="h-8 text-xs">
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

          {/* Insurance Card Photo Upload Placeholders */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="text-primary size-4" aria-hidden="true" />
                <h3 className="text-foreground text-xs font-semibold">Insurance Card Photo Verification</h3>
              </div>
              <span className="text-muted-foreground text-xs">PNG, JPG, PDF up to 10MB</span>
            </div>
            <p className="text-muted-foreground text-xs">
              Provide high-resolution photos of both front and back sides of your insurance card for optical character
              recognition (OCR) and benefit eligibility verification.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Front Card Dropzone */}
              <div className="border-border bg-card hover:bg-muted/20 flex flex-col justify-between rounded-xl border p-4 text-center transition-colors">
                <div className="space-y-2 py-3">
                  <div className="bg-primary/10 text-primary mx-auto flex size-10 items-center justify-center rounded-full">
                    <CreditCard className="size-5" aria-hidden="true" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-foreground text-xs font-semibold">Front of Insurance Card</p>
                    <p className="text-muted-foreground text-xs">Subscriber ID & carrier logo visible</p>
                  </div>
                </div>
                <div className="border-border/60 bg-muted/40 flex flex-wrap items-center justify-between rounded-md border px-3 py-2 text-xs">
                  {formData.frontCardUploaded ? (
                    <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                      <Check className="size-3.5" aria-hidden="true" />
                      card_front_scan.jpg (2.4 MB)
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No file selected</span>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs font-medium"
                    onClick={() => updateField('frontCardUploaded', !formData.frontCardUploaded)}
                  >
                    {formData.frontCardUploaded ? 'Replace' : 'Upload Front'}
                  </Button>
                </div>
              </div>

              {/* Back Card Dropzone */}
              <div className="border-border bg-card hover:bg-muted/20 flex flex-col justify-between rounded-xl border p-4 text-center transition-colors">
                <div className="space-y-2 py-3">
                  <div className="bg-primary/10 text-primary mx-auto flex size-10 items-center justify-center rounded-full">
                    <CreditCard className="size-5" aria-hidden="true" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-foreground text-xs font-semibold">Back of Insurance Card</p>
                    <p className="text-muted-foreground text-xs">Claims address & Rx BIN visible</p>
                  </div>
                </div>
                <div className="border-border/60 bg-muted/40 flex flex-wrap items-center justify-between rounded-md border px-3 py-2 text-xs">
                  {formData.backCardUploaded ? (
                    <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                      <Check className="size-3.5" aria-hidden="true" />
                      card_back_scan.jpg (1.9 MB)
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No file selected</span>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs font-medium"
                    onClick={() => updateField('backCardUploaded', !formData.backCardUploaded)}
                  >
                    {formData.backCardUploaded ? 'Replace' : 'Upload Back'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* STEP 4: Consent & Sign                                            */}
      {/* ================================================================= */}
      {step === 4 && (
        <div className="space-y-6">
          {/* Legal Notice Accordion Box */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="text-primary size-4" aria-hidden="true" />
                <h3 className="text-foreground text-xs font-semibold">Regulatory Disclosures & Legal Notice</h3>
              </div>
              <Badge wrap variant="secondary" className="text-xs">
                Mandatory Acknowledgement
              </Badge>
            </div>
            <div className="border-border bg-muted/20 text-muted-foreground max-h-40 space-y-3 overflow-y-auto rounded-lg border p-3.5 text-xs leading-relaxed">
              <div>
                <span className="text-foreground font-semibold">1. HIPAA Notice of Privacy Practices:</span> I
                acknowledge receipt and review of the Notice of Privacy Practices, which describes how my Protected
                Health Information (PHI) may be used and disclosed for clinical treatment, payment processing, and
                healthcare operations in strict compliance with the HIPAA Omnibus Rule (45 CFR § 164.520).
              </div>
              <div>
                <span className="text-foreground font-semibold">2. Informed Consent for Outpatient Treatment:</span> I
                voluntarily authorize the clinical physicians and allied healthcare team to perform diagnostic
                evaluations, blood tests, physical examinations, and outpatient clinical care deemed medically
                necessary.
              </div>
              <div>
                <span className="text-foreground font-semibold">3. Assignment of Benefits & Financial Agreement:</span>{' '}
                I assign all medical insurance benefits directly to the provider. I acknowledge that I remain
                financially responsible for copayments, deductibles, and non-covered services not adjudicated by my
                carrier.
              </div>
            </div>
          </div>

          {/* Consent Checkboxes */}
          <div className="divide-border divide-y rounded-lg border">
            <div className="flex items-start gap-3 p-3.5">
              <Checkbox
                id="cs-hipaa-consent"
                checked={formData.hipaaConsent}
                onCheckedChange={(checked) => updateField('hipaaConsent', checked === true)}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <Label htmlFor="cs-hipaa-consent" className="cursor-pointer text-xs font-medium">
                  HIPAA Privacy Practices Acknowledgement *
                </Label>
                <p className="text-muted-foreground text-xs">
                  I have read, understood, and accept the HIPAA Notice of Privacy Practices and consent to electronic
                  medical record management.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5">
              <Checkbox
                id="cs-treatment-consent"
                checked={formData.treatmentConsent}
                onCheckedChange={(checked) => updateField('treatmentConsent', checked === true)}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <Label htmlFor="cs-treatment-consent" className="cursor-pointer text-xs font-medium">
                  Informed Treatment Consent & Benefit Assignment *
                </Label>
                <p className="text-muted-foreground text-xs">
                  I authorize medical evaluation and agree to the assignment of insurance benefits to the clinical care
                  provider.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5">
              <Checkbox
                id="cs-telehealth-consent"
                checked={formData.telehealthConsent}
                onCheckedChange={(checked) => updateField('telehealthConsent', checked === true)}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <Label htmlFor="cs-telehealth-consent" className="cursor-pointer text-xs font-medium">
                  Telehealth & Encrypted Digital Communications (Optional)
                </Label>
                <p className="text-muted-foreground text-xs">
                  I consent to virtual video consultations and automated SMS/email appointment notifications and lab
                  report alerts.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Electronic Signature Pad */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="text-primary size-4" aria-hidden="true" />
                <h3 className="text-foreground text-xs font-semibold">Electronic Signature & Digital Certification</h3>
              </div>
              <Badge wrap variant="outline" className="border-primary/30 text-primary font-mono text-xs">
                256-bit Certified
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="cs-signer-name" className="text-xs">
                  Type Full Legal Name as Signature *
                </Label>
                <Input
                  id="cs-signer-name"
                  value={formData.signatureName}
                  onChange={(e) => updateField('signatureName', e.target.value)}
                  placeholder="e.g. Eleanor R. Vance"
                  size="small"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="cs-signer-role" className="text-xs">
                  Signer Capacity / Role *
                </Label>
                <Select value={formData.signerRole} onValueChange={(val) => updateField('signerRole', val)}>
                  <SelectTrigger id="cs-signer-role" size="sm" className="h-8 text-xs">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient (Self)</SelectItem>
                    <SelectItem value="parent_guardian">Parent / Legal Guardian</SelectItem>
                    <SelectItem value="poa">Medical Power of Attorney</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="cs-sig-date" className="text-xs">
                  Signature Date *
                </Label>
                <Input
                  id="cs-sig-date"
                  type="date"
                  value={formData.signatureDate}
                  onChange={(e) => updateField('signatureDate', e.target.value)}
                  size="small"
                />
              </div>
            </div>

            {/* Live Digital Signature Stamp Preview */}
            <div className="border-primary/30 bg-primary/5 space-y-3 rounded-xl border p-4">
              <div className="flex flex-wrap items-center justify-between">
                <span className="text-muted-foreground text-xs font-medium">Legal Digital Signature Stamp</span>
                <span className="text-primary flex items-center gap-1 font-mono text-xs">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  Verified & Timestamped
                </span>
              </div>

              <div className="border-primary/20 border-b pt-1 pb-3">
                <p className="text-primary text-2xl font-medium tracking-wide italic">
                  {formData.signatureName || 'Your Signature'}
                </p>
              </div>

              <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                <span>
                  Signer: {formData.signatureName || 'Eleanor Vance'} ({formData.signerRole})
                </span>
                <span>Date: {formData.signatureDate} · Ref #SIG-49102-HIPAA</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* STEP 5: Success / Confirmation Receipt                            */}
      {/* ================================================================= */}
      {step === 5 && (
        <div className="space-y-6 py-4 text-center">
          <div className="relative mx-auto size-16">
            <span className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl" aria-hidden="true" />
            <span className="relative flex size-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 shadow-xs dark:text-emerald-400">
              <Check className="size-8" aria-hidden="true" />
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-foreground text-xl font-bold tracking-tight">Patient Intake Submitted Successfully</h3>
            <p className="text-muted-foreground mx-auto max-w-md text-xs sm:text-sm">
              Your new patient registration and encrypted medical disclosures have been received and queued for clinical
              triage.
            </p>
          </div>

          <div className="border-border inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
            <span className="text-muted-foreground">Confirmation ID:</span>
            <span className="text-foreground font-mono font-bold">{intakeId}</span>
          </div>

          {/* Registration Summary Card */}
          <div className="border-border bg-muted/30 mx-auto max-w-xl space-y-3 rounded-xl border p-4 text-left text-xs">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <span className="text-muted-foreground block">Patient Name:</span>
                <span className="text-foreground font-semibold">
                  {formData.firstName} {formData.middleName} {formData.lastName}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Date of Birth:</span>
                <span className="text-foreground font-medium tabular-nums">
                  {formData.dob} ({formData.biologicalSex})
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Primary Insurance:</span>
                <span className="text-foreground font-medium">
                  {selectedCarrierLabel} (ID: {formData.memberId})
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Emergency Contact:</span>
                <span className="text-foreground font-medium">
                  {formData.emergencyName} ({formData.emergencyPhone})
                </span>
              </div>
              <div className="border-border/60 col-span-1 flex flex-wrap items-center justify-between border-t pt-2 sm:col-span-2">
                <span className="text-muted-foreground">Legal Signature:</span>
                <span className="text-primary font-medium tracking-wide italic">
                  {formData.signatureName} ({formData.signatureDate})
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              aria-label="Download attachment"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-medium"
            >
              <Download className="size-3.5" aria-hidden="true" />
              Download Intake PDF
            </Button>
            <Button size="sm" className="gap-1.5 text-xs font-medium" onClick={resetForm}>
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Register Another Patient
            </Button>
          </div>
        </div>
      )}
    </SectionCard>
  )
}
