import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'use-cases-scenario-walkthrough',
  title: 'Use Cases — Scenario Walkthrough',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'One concrete scenario walked end to end as a numbered sequence of what happens, who does it, and what the system records at each step.',
  files: [{ path: 'UseCasesScenarioWalkthrough.tsx', target: 'components/blocks/UseCasesScenarioWalkthrough.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
