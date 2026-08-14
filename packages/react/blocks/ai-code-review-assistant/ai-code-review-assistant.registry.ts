import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'ai-code-review-assistant',
  type: 'registry:block',
  categories: ['devops', 'app', 'ai'],
  description:
    'GitHub PR automated AI code review assistant with AST syntax diff annotations, performance suggestions, and 1-click patch application.',
  files: [{ path: 'AiCodeReviewAssistant.tsx', target: 'components/blocks/AiCodeReviewAssistant.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
