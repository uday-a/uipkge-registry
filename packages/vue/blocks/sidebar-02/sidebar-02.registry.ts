import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sidebar-02',
  title: 'Team Switcher Sidebar',
  type: 'registry:block',
  categories: ['layout', 'sidebar'],
  description:
    'Full-featured app sidebar -- collapsible="icon" rail with TeamSwitcher header, primary nav, projects section, secondary nav, and user dropdown footer. Each section ships as a sibling file in the same folder so consumers can edit one piece at a time.',
  framework: 'vue',
  files: [
    { path: 'Sidebar02.vue', target: 'components/blocks/sidebar-02/Sidebar02.vue' },
    { path: 'TeamSwitcher.vue', target: 'components/blocks/sidebar-02/TeamSwitcher.vue' },
    { path: 'NavMain.vue', target: 'components/blocks/sidebar-02/NavMain.vue' },
    { path: 'NavProjects.vue', target: 'components/blocks/sidebar-02/NavProjects.vue' },
    { path: 'NavSecondary.vue', target: 'components/blocks/sidebar-02/NavSecondary.vue' },
    { path: 'NavUser.vue', target: 'components/blocks/sidebar-02/NavUser.vue' },
    { path: 'page.vue', target: 'app/pages/sidebar-02-demo.vue' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/sidebar.json',
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/collapsible.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/use-theme.json',
  ],
})
