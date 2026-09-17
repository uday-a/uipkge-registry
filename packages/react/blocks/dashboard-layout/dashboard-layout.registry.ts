import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'dashboard-layout',
  type: 'registry:block',
  categories: ['layout', 'dashboard'],
  description:
    'Full dashboard shell — collapsible sidebar + sticky topbar (sidebar trigger, breadcrumb, theme switch, notifications) + main content children. Drop it around a page: `<DashboardLayout>{page}</DashboardLayout>`.',
  files: [{ path: 'DashboardLayout.tsx', target: 'components/blocks/DashboardLayout.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/sidebar-02.json',
    'https://uipkge.dev/r/command-palette.json',
    'https://uipkge.dev/r/notifications-popover.json',
    'https://uipkge.dev/r/theme-switch.json',
    'https://uipkge.dev/r/use-theme.json',
    'https://uipkge.dev/r/sidebar.json',
    'https://uipkge.dev/r/breadcrumb.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/separator.json',
  ],
})
