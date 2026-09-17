import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'exit-interview-survey',
  type: 'registry:block',
  categories: ['hr', 'app', 'forms'],
  description:
    'Structured employee offboarding survey with department sentiment analysis, departure drivers, 5-star experience ratings, qualitative feedback textareas, and a knowledge handover & asset return checklist.',
  framework: 'vue',
  files: [{ path: 'ExitInterviewSurvey.vue', target: 'components/blocks/ExitInterviewSurvey.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/label.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/radio-group.json',
    'https://uipkge.dev/r/rating.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
