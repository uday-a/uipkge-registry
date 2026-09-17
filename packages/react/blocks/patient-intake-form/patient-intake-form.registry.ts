import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'patient-intake-form',
  type: 'registry:block',
  categories: ['healthcare', 'app', 'forms'],
  description:
    'HIPAA-compliant new patient registration and medical history questionnaire in a SectionCard. Features a 4-step Stepper (Personal Information → Medical History → Insurance & Billing → Consent & Sign), demographic inputs with biological sex and emergency contact, chronic conditions checklist with allergy details and medication textareas, insurance carrier selection with card photo upload dropzones, regulatory HIPAA disclosure accordion with electronic signature pad, and a post-submission confirmation receipt with patient ID.',
  files: [{ path: 'PatientIntakeForm.tsx', target: 'components/blocks/PatientIntakeForm.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/label.json',
    'https://uipkge.dev/r/radio-group.json',
    'https://uipkge.dev/r/section-card.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/stepper.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
