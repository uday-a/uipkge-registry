import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'shortcuts-dialog',
  type: 'registry:block',
  categories: ['layout', 'dashboard', 'navigation'],
  description:
    "Linear-style keyboard reference sheet: a '?' dialog listing shortcut groups (label, description, Kbd combo) in a responsive two-column grid. Ships a built-in trigger button, controlled/uncontrolled open, custom groups via prop, and an Esc footer hint. Display only — wire real handlers in your app.",
  files: [{ path: 'ShortcutsDialog.tsx', target: 'components/blocks/ShortcutsDialog.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/kbd.json',
  ],
})
