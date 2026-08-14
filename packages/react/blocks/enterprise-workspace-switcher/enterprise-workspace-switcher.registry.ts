import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'enterprise-workspace-switcher',
  type: 'registry:block',
  categories: ['layout', 'dashboard', 'navigation', 'overlay'],
  description:
    'Multi-organization workspace switcher dropdown and creation modal inspired by Portico/Riter. Features active organization display with emerald ring, 3 tier levels (Enterprise Scale, Pro Team, Free Sandbox), team role badges, member counts, and an organization creation dialog with dynamic slug preview, region selector, and tier plan radios.',
  files: [
    {
      path: 'EnterpriseWorkspaceSwitcher.tsx',
      target: 'components/blocks/EnterpriseWorkspaceSwitcher.tsx',
    },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/radio-group.json',
    'https://uipkge.dev/r/select.json',
  ],
})
