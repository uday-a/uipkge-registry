import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'quiz-assessment-runner',
  type: 'registry:block',
  categories: ['education', 'app'],
  description:
    'Interactive multiple-choice exam & quiz assessment runner: 2-column test canvas with real-time countdown timer, question navigator grid with status indicators (completed, active, flagged, unanswered), syntax-highlighted code snippets, single-choice selection cards, submit confirmation modal, and comprehensive score breakdown with review explanations.',
  framework: 'vue',
  files: [{ path: 'QuizAssessmentRunner.vue', target: 'components/blocks/QuizAssessmentRunner.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
