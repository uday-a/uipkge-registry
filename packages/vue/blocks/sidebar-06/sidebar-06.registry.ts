import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sidebar-06',
  title: 'Starred Project Sidebar',
  type: 'registry:block',
  categories: ['layout', 'sidebar'],
  description:
    'Colorful, customised app sidebar -- branded project tiles with star favorites, badge counts, team avatars with status dots, and a user pill footer. Inline search input with ⌘F shortcut. Modeled on a HRMS workspace shell.',
  framework: 'vue',
  files: [
    { path: 'Sidebar06.vue', target: 'components/blocks/Sidebar06.vue' },
    { path: 'page.vue', target: 'app/pages/sidebar-06-demo.vue' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/sidebar.json',
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/use-theme.json',
  ],
})
