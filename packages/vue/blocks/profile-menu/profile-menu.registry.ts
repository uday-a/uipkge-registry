import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'profile-menu',
  type: 'registry:block',
  categories: ['layout', 'dashboard', 'overlay'],
  description:
    'Header-grade profile/account dropdown. Slot-trigger DropdownMenu the consumer wraps around their own avatar button (default trigger ships an Avatar fallback). Sections: upgrade, account/billing/notifications/settings, log out. Emits `select` with the chosen item key so consumers wire navigation and auth themselves.',
  framework: 'vue',
  files: [{ path: 'ProfileMenu.vue', target: 'components/blocks/ProfileMenu.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/avatar.json', 'https://uipkge.dev/r/dropdown-menu.json'],
})
