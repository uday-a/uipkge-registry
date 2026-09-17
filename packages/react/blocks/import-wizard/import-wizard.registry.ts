import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'import-wizard',
  type: 'registry:block',
  categories: ['devops', 'dashboard', 'data'],
  description:
    'CSV import flow in a SectionCard: four-step state machine (Upload → Map fields → Preview → Result) with an interactive Stepper, auto-mapped column targets carrying confidence badges, required-field validation that gates the footer action, flagged-cell highlighting in the preview table, and a success/partial result screen. Data is stubbed post-parse — wire the file reader of your choice.',
  files: [{ path: 'ImportWizard.tsx', target: 'components/blocks/ImportWizard.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/alert.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/section-card.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/stepper.json',
  ],
})
