import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sidebar-03',
  title: 'Documentation Sidebar',
  type: 'registry:block',
  categories: ['layout', 'sidebar'],
  description:
    'Docs-style sidebar with a version switcher at the top, a search input below, and collapsible navigation groups. All sample data inlined so consumers edit routes in place.',
  files: [
    { path: 'Sidebar03.tsx', target: 'components/blocks/sidebar-03/Sidebar03.tsx' },
    { path: 'SearchForm.tsx', target: 'components/blocks/sidebar-03/SearchForm.tsx' },
    { path: 'VersionSwitcher.tsx', target: 'components/blocks/sidebar-03/VersionSwitcher.tsx' },
    { path: 'page.tsx', target: 'app/sidebar-03-demo/page.tsx' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/sidebar.json',
    'https://uipkge.dev/r/collapsible.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/label.json',
  ],
})
