import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'dispatch-assignment-board',
  type: 'registry:block',
  categories: ['logistics', 'app'],
  description:
    'Last-mile route dispatching, delivery driver stop sequencing, and vehicle payload load balancing: live dispatch overview KPIs, zone filtering, AI route auto-sequencing, and driver route cards with vehicle payload load balancing, live progress tracking, interactive stops timeline, driver communications, and telemetry actions.',
  files: [{ path: 'DispatchAssignmentBoard.tsx', target: 'components/blocks/DispatchAssignmentBoard.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
