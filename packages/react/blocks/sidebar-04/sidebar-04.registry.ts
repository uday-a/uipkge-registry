import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sidebar-04',
  title: 'Floating Inset Sidebar',
  type: 'registry:block',
  categories: ['layout', 'sidebar'],
  description:
    'Floating sidebar variant with rounded corners and inset margins. Uses Sidebar variant="floating" and SidebarMenuSub for nested routes. Sample data inlined so consumers edit routes in place.',
  files: [
    { path: 'Sidebar04.tsx', target: 'components/blocks/sidebar-04/Sidebar04.tsx' },
    { path: 'page.tsx', target: 'app/sidebar-04-demo/page.tsx' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/sidebar.json'],
})
