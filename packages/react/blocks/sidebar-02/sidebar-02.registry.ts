import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sidebar-02',
  title: 'Team Switcher Sidebar',
  type: 'registry:block',
  categories: ['layout', 'sidebar'],
  description:
    'Full-featured app sidebar -- collapsible="icon" rail with TeamSwitcher header, primary nav, projects section, secondary nav, and user dropdown footer. Each section ships as a sibling file in the same folder so consumers can edit one piece at a time.',
  files: [
    { path: 'Sidebar02.tsx', target: 'components/blocks/sidebar-02/Sidebar02.tsx' },
    { path: 'TeamSwitcher.tsx', target: 'components/blocks/sidebar-02/TeamSwitcher.tsx' },
    { path: 'NavMain.tsx', target: 'components/blocks/sidebar-02/NavMain.tsx' },
    { path: 'NavProjects.tsx', target: 'components/blocks/sidebar-02/NavProjects.tsx' },
    { path: 'NavSecondary.tsx', target: 'components/blocks/sidebar-02/NavSecondary.tsx' },
    { path: 'NavUser.tsx', target: 'components/blocks/sidebar-02/NavUser.tsx' },
    { path: 'page.tsx', target: 'app/sidebar-02-demo/page.tsx' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/sidebar.json',
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/collapsible.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/use-theme.json',
  ],
})
