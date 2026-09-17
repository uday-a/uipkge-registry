import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sidebar-05',
  title: 'Dual-Rail Sidebar',
  type: 'registry:block',
  categories: ['layout', 'sidebar'],
  description:
    "Dual-rail sidebar -- a thin always-visible icon column on the far left holds quick shortcuts (a subset of the full nav), paired with a wider main panel for the brand, search, sections, and footer. Uses collapsible=\"icon\": when the user collapses, only the rail stays. On mobile the kit Sheet shows the full dual rail. Requires the parent SidebarProvider to set both widths: :style=\"{ '--sidebar-width': '19.5rem', '--sidebar-width-icon': '3.5rem' }\". Modeled on the GR8R HRMS admin shell.",
  framework: 'vue',
  files: [
    { path: 'Sidebar05.vue', target: 'components/blocks/Sidebar05.vue' },
    { path: 'page.vue', target: 'app/pages/sidebar-05-demo.vue' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/sidebar.json',
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/use-theme.json',
  ],
})
