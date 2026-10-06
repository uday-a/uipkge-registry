import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'dropdown-menu',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'angular',
  description:
    'Floating menu launched from a trigger button — for account switchers, row actions, editor menus, and any short list of commands. Labels, icons, separators, shortcuts, checkbox/radio items, and nested submenus. Portalled + positioned like Radix (flip, shift, keyboard nav, typeahead).',
  files: [
    { path: 'dropdown-menu.component.ts', target: 'components/ui/dropdown-menu/dropdown-menu.component.ts' },
    {
      path: 'dropdown-menu-content.variants.ts',
      target: 'components/ui/dropdown-menu/dropdown-menu-content.variants.ts',
    },
    { path: 'index.ts', target: 'components/ui/dropdown-menu/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})
