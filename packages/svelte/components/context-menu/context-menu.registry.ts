import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'context-menu',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'svelte',
  description:
    'Right-click menu with items, checkbox/radio items, submenus, labels, and shortcuts. Hand-rolled runes behavior: cursor-anchored portal, viewport clamping, outside/Escape close, and arrow-key navigation with roving focus.',
  files: [
    { path: 'ContextMenu.svelte', target: 'components/ui/context-menu/ContextMenu.svelte' },
    { path: 'ContextMenuCheckboxItem.svelte', target: 'components/ui/context-menu/ContextMenuCheckboxItem.svelte' },
    { path: 'ContextMenuContent.svelte', target: 'components/ui/context-menu/ContextMenuContent.svelte' },
    { path: 'ContextMenuGroup.svelte', target: 'components/ui/context-menu/ContextMenuGroup.svelte' },
    { path: 'ContextMenuItem.svelte', target: 'components/ui/context-menu/ContextMenuItem.svelte' },
    {
      path: 'context-menu-item.variants.ts',
      target: 'components/ui/context-menu/context-menu-item.variants.ts',
    },
    { path: 'ContextMenuLabel.svelte', target: 'components/ui/context-menu/ContextMenuLabel.svelte' },
    { path: 'ContextMenuPortal.svelte', target: 'components/ui/context-menu/ContextMenuPortal.svelte' },
    { path: 'ContextMenuRadioGroup.svelte', target: 'components/ui/context-menu/ContextMenuRadioGroup.svelte' },
    { path: 'ContextMenuRadioItem.svelte', target: 'components/ui/context-menu/ContextMenuRadioItem.svelte' },
    { path: 'ContextMenuSeparator.svelte', target: 'components/ui/context-menu/ContextMenuSeparator.svelte' },
    { path: 'ContextMenuShortcut.svelte', target: 'components/ui/context-menu/ContextMenuShortcut.svelte' },
    { path: 'ContextMenuSub.svelte', target: 'components/ui/context-menu/ContextMenuSub.svelte' },
    { path: 'ContextMenuSubContent.svelte', target: 'components/ui/context-menu/ContextMenuSubContent.svelte' },
    { path: 'ContextMenuSubTrigger.svelte', target: 'components/ui/context-menu/ContextMenuSubTrigger.svelte' },
    { path: 'ContextMenuTrigger.svelte', target: 'components/ui/context-menu/ContextMenuTrigger.svelte' },
    { path: 'context.ts', target: 'components/ui/context-menu/context.ts' },
    { path: 'portal.ts', target: 'components/ui/context-menu/portal.ts' },
    { path: 'index.ts', target: 'components/ui/context-menu/index.ts' },
  ],
  dependencies: ['@lucide/svelte', 'class-variance-authority'],
  registryDependencies: [],
})
