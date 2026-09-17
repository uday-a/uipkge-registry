import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'vitals-tracker-chart',
  type: 'registry:block',
  categories: ['healthcare', 'dashboard', 'app'],
  description:
    'Biometric vitals monitoring dashboard with multi-day trends, threshold bands, device sync status, 7-day vitals table with risk indicators, clinician alert limits, and quick-entry logging dialog.',
  framework: 'react',
  files: [{ path: 'VitalsTrackerChart.tsx', target: 'components/blocks/VitalsTrackerChart.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/label.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
