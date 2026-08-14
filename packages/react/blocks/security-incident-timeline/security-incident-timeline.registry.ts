import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'security-incident-timeline',
  type: 'registry:block',
  categories: ['security', 'app', 'devops'],
  description:
    'Security Operations Center (SOC) incident response timeline and post-mortem tracker with telemetry KPIs, chronological audit trail, log snippets, and corrective action items.',
  files: [{ path: 'SecurityIncidentTimeline.tsx', target: 'components/blocks/SecurityIncidentTimeline.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
