import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sidebar-07',
  title: 'Toolbar Action Sidebar',
  type: 'registry:block',
  categories: ['layout', 'sidebar'],
  description:
    'App sidebar with a bottom action bar -- workspace pill, ⌘K search, grouped nav with section labels (Dashboard / Management / Content), badge counts, user pill above an icon toolbar (Settings, Help, Notifications, Command, Log out). Built on sidebar-01.',
  files: [
    { path: 'Sidebar07.tsx', target: 'components/blocks/Sidebar07.tsx' },
    { path: 'page.tsx', target: 'app/sidebar-07-demo/page.tsx' },
  ],
  dependencies: ['lucide-react', 'next-themes'],
  registryDependencies: [
    'https://uipkge.dev/r/sidebar.json',
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/use-theme.json',
  ],
})
