import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'patient-medical-record',
  type: 'registry:block',
  categories: ['healthcare', 'app'],
  description:
    'Epic/Cerner-style EHR patient chart and clinical summary: patient demographics header with allergy alerts, latest vitals strip, active diagnoses and ICD-10 problem list, active medications table, recent clinical encounter notes (HPI and Assessment & Plan), upcoming appointments schedule, care team directory, and emergency contacts.',
  framework: 'vue',
  files: [{ path: 'PatientMedicalRecord.vue', target: 'components/blocks/PatientMedicalRecord.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
