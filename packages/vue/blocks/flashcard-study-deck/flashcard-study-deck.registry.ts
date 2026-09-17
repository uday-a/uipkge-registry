import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'flashcard-study-deck',
  type: 'registry:block',
  categories: ['education', 'app'],
  description:
    'Anki and Quizlet style spaced-repetition flashcard study deck with smooth 3D flip card interaction, WCAG 2.2 accessibility curriculum, hint drawer, mastery percentage tracking, keyboard shortcuts, and SM-2 interval rating buttons.',
  framework: 'vue',
  files: [{ path: 'FlashcardStudyDeck.vue', target: 'components/blocks/FlashcardStudyDeck.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
