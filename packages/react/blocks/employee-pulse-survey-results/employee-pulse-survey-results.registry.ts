import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'employee-pulse-survey-results',
  type: 'registry:block',
  categories: ['hr', 'app', 'dashboard', 'analytics'],
  description:
    'Culture Amp style company pulse and eNPS engagement survey results dashboard featuring executive KPI scorecards, department sentiment heatmaps, and priority engagement drivers with action items.',
  files: [{ path: 'EmployeePulseSurveyResults.tsx', target: 'components/blocks/EmployeePulseSurveyResults.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
