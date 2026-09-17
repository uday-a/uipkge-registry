import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'skill-assessment-radar',
  type: 'registry:block',
  categories: ['hr', 'dashboard', 'education', 'analytics', 'app'],
  description:
    'Developer skill proficiency scorecard and radar matrix: domain percentile rankings, dual candidate vs industry benchmark progress bars, competency breakdown, radar telemetry polygon, and personalized learning pathways.',
  framework: 'react',
  files: [{ path: 'SkillAssessmentRadar.tsx', target: 'components/blocks/SkillAssessmentRadar.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
