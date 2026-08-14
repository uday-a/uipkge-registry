import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'compliance-soc2-readiness',
  type: 'registry:block',
  categories: ['legal', 'app', 'security'],
  description:
    'Vanta/Drata-style SOC 2 Type II, ISO 27001, and HIPAA compliance readiness dashboard with framework selector tabs, audit readiness scorecards, 4 control pillar health bars, continuous automated evidence test tables with verified artifact badges, and auditor trust center portal controls.',
  files: [{ path: 'ComplianceSoc2Readiness.tsx', target: 'components/blocks/ComplianceSoc2Readiness.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
