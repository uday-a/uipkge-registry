import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'settings-page',
  type: 'registry:block',
  categories: ['layout', 'dashboard'],
  description:
    'Linear-style settings shell: a nav rail of icon sections (collapses to a horizontal tab strip on narrow screens) switching between fully composed panels — profile form with sticky save bar, notification switches, theme picker, workspace identity, billing summary, and a type-to-confirm danger zone. Swap the panel internals for your own forms.',
  files: [{ path: 'SettingsPage.tsx', target: 'components/blocks/SettingsPage.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/label.json',
    'https://uipkge.dev/r/section-card.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
