import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sidebar-07',
  title: 'Toolbar Action Sidebar',
  type: 'registry:block',
  categories: ['layout', 'sidebar'],
  description:
    'App sidebar with a bottom action bar -- workspace pill, ⌘K search, grouped nav with section labels (Dashboard / Management / Content), badge counts, user pill above an icon toolbar (Settings, Help, Notifications, Command, Log out). Built on sidebar-01.',
  framework: 'vue',
  files: [
    { path: 'Sidebar07.vue', target: 'components/blocks/Sidebar07.vue' },
    { path: 'page.vue', target: 'app/pages/sidebar-07-demo.vue' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/sidebar.json',
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/use-theme.json',
  ],
})
