import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sidebar-01',
  title: 'Icon Rail Sidebar',
  type: 'registry:block',
  categories: ['layout', 'sidebar'],
  description:
    'Collapsible icon-rail app sidebar with brand block, two grouped nav sections, and a user dropdown footer. Pure template, no props -- edit Sidebar01.vue to change routes and NavUser.vue to wire your auth session. Pair with SidebarProvider + SidebarInset for the full admin shell.',
  framework: 'vue',
  files: [
    { path: 'Sidebar01.vue', target: 'components/blocks/sidebar-01/Sidebar01.vue' },
    { path: 'NavUser.vue', target: 'components/blocks/sidebar-01/NavUser.vue' },
    { path: 'page.vue', target: 'app/pages/sidebar-01-demo.vue' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/sidebar.json',
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/use-theme.json',
  ],
})
