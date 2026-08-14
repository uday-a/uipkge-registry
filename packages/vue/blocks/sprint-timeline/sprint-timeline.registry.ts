import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sprint-timeline',
  type: 'registry:block',
  categories: ['productivity', 'dashboard', 'data'],
  framework: 'vue',
  description:
    'Agile sprint tracking timeline block: 2-week deliverable Gantt schedule with story point burndown indicators, milestone demos, dependency handoffs, and assignee tags.',
  files: [
    { path: 'SprintTimeline.vue', target: 'components/blocks/sprint-timeline/SprintTimeline.vue' },
    { path: 'index.ts', target: 'components/blocks/sprint-timeline/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/gantt.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})
