import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'deployment-pipeline',
  type: 'registry:block',
  categories: ['devops', 'app'],
  description:
    'CI/CD deployment history, active environment status, execution stepper, collapsible build log terminal with stdout timestamps, and filterable deployments table.',
  files: [{ path: 'DeploymentPipeline.tsx', target: 'components/blocks/DeploymentPipeline.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
