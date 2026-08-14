import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'email-template-previewer',
  type: 'registry:block',
  categories: ['marketing', 'preview', 'app'],
  description:
    'Resend and Klaviyo style marketing email designer preview with viewport switcher, subject line tester, deliverability & spam score analyzer, and live test dispatch modal.',
  files: [{ path: 'EmailTemplatePreviewer.tsx', target: 'components/blocks/EmailTemplatePreviewer.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
