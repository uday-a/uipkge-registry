import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'shortcuts-dialog',
  type: 'registry:block',
  categories: ['layout', 'dashboard', 'navigation'],
  description:
    "Linear-style keyboard reference sheet: a '?' dialog listing shortcut groups (label, description, Kbd combo) in a responsive two-column grid. Ships a built-in trigger button, controlled/uncontrolled open, custom groups via prop, and an Esc footer hint. Display only — wire real handlers in your app.",
  framework: 'vue',
  files: [{ path: 'ShortcutsDialog.vue', target: 'components/blocks/ShortcutsDialog.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/kbd.json',
  ],
})
