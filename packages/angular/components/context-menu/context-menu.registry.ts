import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'context-menu',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'angular',
  description:
    'Right-click menu — same item family as Dropdown Menu (items, checkbox/radio items, labels, separators, shortcuts, submenus) but opened at the pointer by `contextmenu` or a touch long-press. Radix ContextMenu behaviour: portalled + flipped to stay on screen, roving focus, typeahead, Escape / outside-click dismiss, hover submenus with a pointer grace area.',
  files: [
    { path: 'context-menu.component.ts', target: 'components/ui/context-menu/context-menu.component.ts' },
    { path: 'context-menu-item.variants.ts', target: 'components/ui/context-menu/context-menu-item.variants.ts' },
    { path: 'index.ts', target: 'components/ui/context-menu/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})
