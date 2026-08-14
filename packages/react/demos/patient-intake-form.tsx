import Story from '../../components/story/Story'
import { PatientIntakeForm } from '@react-registry-blocks/patient-intake-form/PatientIntakeForm'

export default function PatientIntakeFormDemo() {
  return (
    <>
      <Story
        title="Default"
        description="HIPAA-compliant patient registration starting at Step 1 (Personal Information) with demographics and emergency contact."
      >
        <PatientIntakeForm />
      </Story>

      <Story
        title="Step 2 · Medical History"
        description="Clinical questionnaire for chronic conditions, known allergies, active medications, and surgical history."
      >
        <PatientIntakeForm initialStep={2} />
      </Story>

      <Story
        title="Step 3 · Insurance & Billing"
        description="Primary carrier selection, policyholder relationships, and dual-sided insurance card photo verification."
      >
        <PatientIntakeForm initialStep={3} />
      </Story>

      <Story
        title="Step 4 · Consent & Sign"
        description="HIPAA privacy disclosures, informed treatment authorization, and 256-bit certified electronic signature stamp."
      >
        <PatientIntakeForm initialStep={4} />
      </Story>

      <Story
        title="Step 5 · Completed Receipt"
        description="Successful submission confirmation with intake ID, summary review card, and PDF export action."
      >
        <PatientIntakeForm initialStep={5} />
      </Story>
    </>
  )
}
