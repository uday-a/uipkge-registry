import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'habit-streak-tracker',
  type: 'registry:block',
  categories: ['productivity', 'dashboard', 'app'],
  description:
    'GitHub style 52-week contribution habit heatmap, flame streak counter, consistency metrics, and daily completion tracker with 7-day mini checkbox strip and progress bars.',
  framework: 'vue',
  files: [{ path: 'HabitStreakTracker.vue', target: 'components/blocks/HabitStreakTracker.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
