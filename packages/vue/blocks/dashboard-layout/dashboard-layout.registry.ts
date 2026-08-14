import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'dashboard-layout',
  type: 'registry:block',
  categories: ['layout', 'dashboard'],
  description:
    'Full dashboard shell — collapsible sidebar (sidebar-02) + sticky topbar (sidebar trigger, breadcrumb, command palette, theme switch, notifications, profile menu) + main content slot. Drop it in a Nuxt layout: `<DashboardLayout><slot /></DashboardLayout>`. Auto-pulls every transitive piece (sidebar-02, command-palette, notifications-popover, profile-menu, theme-switch).',
  framework: 'vue',
  files: [{ path: 'DashboardLayout.vue', target: 'components/blocks/DashboardLayout.vue' }],
  dependencies: ['lucide-vue-next'],
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
