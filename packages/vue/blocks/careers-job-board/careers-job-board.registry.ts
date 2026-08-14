import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'careers-job-board',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Careers page and job openings board with perks overview, live department & location filtering, keyword search, grouped department openings, and general application CTA.',
  framework: 'vue',
  files: [{ path: 'CareersJobBoard.vue', target: 'components/blocks/CareersJobBoard.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
  ],
})
