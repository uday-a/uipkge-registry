import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'exit-intent-survey',
  title: 'Exit Intent — Survey',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'One-question exit survey asking what the visitor did not find, with preset answers, an optional free-text field, and a thank-you state that closes itself.',
  files: [{ path: 'ExitIntentSurvey.tsx', target: 'components/blocks/ExitIntentSurvey.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/textarea.json',
    'https://uipkge.dev/r/toggle-group.json',
  ],
})
