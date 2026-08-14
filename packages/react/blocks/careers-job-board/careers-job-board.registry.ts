import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'careers-job-board',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Careers page and job openings board with perks overview, live department & location filtering, keyword search, grouped department openings, and general application CTA.',
  files: [{ path: 'CareersJobBoard.tsx', target: 'components/blocks/CareersJobBoard.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
  ],
})
