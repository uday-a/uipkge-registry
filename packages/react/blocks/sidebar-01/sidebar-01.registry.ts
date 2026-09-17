import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sidebar-01',
  title: 'Icon Rail Sidebar',
  type: 'registry:block',
  categories: ['layout', 'sidebar'],
  description:
    'Collapsible icon-rail app sidebar with brand block, two grouped nav sections, and a user dropdown footer. Pure markup, no props -- edit Sidebar01.tsx to change routes and NavUser.tsx to wire your auth session. Pair with SidebarProvider + SidebarInset for the full admin shell.',
  files: [
    { path: 'Sidebar01.tsx', target: 'components/blocks/sidebar-01/Sidebar01.tsx' },
    { path: 'NavUser.tsx', target: 'components/blocks/sidebar-01/NavUser.tsx' },
    { path: 'page.tsx', target: 'app/sidebar-01-demo/page.tsx' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/sidebar.json',
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/use-theme.json',
  ],
})
