import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'dropdown-menu',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'svelte',
  description:
    'Floating menu launched from a trigger button — for account switchers, row actions, editor menus, and any short list of commands. Supports labels, icons, separators, keyboard shortcuts, checkbox/radio items, and nested submenus. Hand-rolled on Svelte 5 runes (no headless dependency); ARIA + keyboard navigation handled.',
  files: [
    { path: 'DropdownMenu.svelte', target: 'components/ui/dropdown-menu/DropdownMenu.svelte' },
    { path: 'DropdownMenuCheckboxItem.svelte', target: 'components/ui/dropdown-menu/DropdownMenuCheckboxItem.svelte' },
    { path: 'DropdownMenuContent.svelte', target: 'components/ui/dropdown-menu/DropdownMenuContent.svelte' },
    {
      path: 'dropdown-menu-content.variants.ts',
      target: 'components/ui/dropdown-menu/dropdown-menu-content.variants.ts',
    },
    { path: 'dropdown-menu-context.ts', target: 'components/ui/dropdown-menu/dropdown-menu-context.ts' },
    { path: 'DropdownMenuGroup.svelte', target: 'components/ui/dropdown-menu/DropdownMenuGroup.svelte' },
    { path: 'DropdownMenuItem.svelte', target: 'components/ui/dropdown-menu/DropdownMenuItem.svelte' },
    { path: 'DropdownMenuLabel.svelte', target: 'components/ui/dropdown-menu/DropdownMenuLabel.svelte' },
    { path: 'DropdownMenuRadioGroup.svelte', target: 'components/ui/dropdown-menu/DropdownMenuRadioGroup.svelte' },
    { path: 'DropdownMenuRadioItem.svelte', target: 'components/ui/dropdown-menu/DropdownMenuRadioItem.svelte' },
    { path: 'DropdownMenuSeparator.svelte', target: 'components/ui/dropdown-menu/DropdownMenuSeparator.svelte' },
    { path: 'DropdownMenuShortcut.svelte', target: 'components/ui/dropdown-menu/DropdownMenuShortcut.svelte' },
    { path: 'DropdownMenuSub.svelte', target: 'components/ui/dropdown-menu/DropdownMenuSub.svelte' },
    { path: 'DropdownMenuSubContent.svelte', target: 'components/ui/dropdown-menu/DropdownMenuSubContent.svelte' },
    { path: 'DropdownMenuSubTrigger.svelte', target: 'components/ui/dropdown-menu/DropdownMenuSubTrigger.svelte' },
    { path: 'DropdownMenuTrigger.svelte', target: 'components/ui/dropdown-menu/DropdownMenuTrigger.svelte' },
    { path: 'DropdownMenuPortal.svelte', target: 'components/ui/dropdown-menu/DropdownMenuPortal.svelte' },
    { path: 'portal.ts', target: 'components/ui/dropdown-menu/portal.ts' },
    { path: 'index.ts', target: 'components/ui/dropdown-menu/index.ts' },
  ],
  dependencies: ['@lucide/svelte', 'class-variance-authority'],
  registryDependencies: [],
})
