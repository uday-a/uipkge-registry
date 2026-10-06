import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'menubar',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'angular',
  description:
    'Top-level menu bar — File / Edit / View — for desktop-style apps. Same item family as Dropdown Menu (items, checkbox/radio items, labels, separators, shortcuts, submenus). Radix Menubar behaviour: roving focus across triggers, ArrowLeft/Right move between open menus, hovering another trigger switches menus; portalled + positioned with flip/shift.',
  files: [
    { path: 'menubar.component.ts', target: 'components/ui/menubar/menubar.component.ts' },
    { path: 'index.ts', target: 'components/ui/menubar/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})
