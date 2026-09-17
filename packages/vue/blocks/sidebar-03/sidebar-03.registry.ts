import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sidebar-03',
  title: 'Documentation Sidebar',
  type: 'registry:block',
  categories: ['layout', 'sidebar'],
  description:
    'Docs-style sidebar with a version switcher at the top, a search input below, and collapsible navigation groups. All sample data inlined so consumers edit routes in place.',
  framework: 'vue',
  files: [
    { path: 'Sidebar03.vue', target: 'components/blocks/sidebar-03/Sidebar03.vue' },
    { path: 'SearchForm.vue', target: 'components/blocks/sidebar-03/SearchForm.vue' },
    { path: 'VersionSwitcher.vue', target: 'components/blocks/sidebar-03/VersionSwitcher.vue' },
    { path: 'page.vue', target: 'app/pages/sidebar-03-demo.vue' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/sidebar.json',
    'https://uipkge.dev/r/collapsible.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/label.json',
  ],
})
