import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'dropdown-menu',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'vue',
  description:
    'Floating menu launched from a trigger button — for account switchers, row actions, editor menus, and any short list of commands. Supports labels, icons, separators, keyboard shortcuts, checkbox/radio items, and nested submenus. Built on reka-ui; ARIA + keyboard navigation handled.',
  files: [
    { path: 'DropdownMenu.vue', target: 'components/ui/dropdown-menu/DropdownMenu.vue' },
    { path: 'DropdownMenuCheckboxItem.vue', target: 'components/ui/dropdown-menu/DropdownMenuCheckboxItem.vue' },
    { path: 'DropdownMenuContent.vue', target: 'components/ui/dropdown-menu/DropdownMenuContent.vue' },
    {
      path: 'dropdown-menu-content.variants.ts',
      target: 'components/ui/dropdown-menu/dropdown-menu-content.variants.ts',
    },
    { path: 'DropdownMenuGroup.vue', target: 'components/ui/dropdown-menu/DropdownMenuGroup.vue' },
    { path: 'DropdownMenuItem.vue', target: 'components/ui/dropdown-menu/DropdownMenuItem.vue' },
    { path: 'DropdownMenuLabel.vue', target: 'components/ui/dropdown-menu/DropdownMenuLabel.vue' },
    { path: 'DropdownMenuRadioGroup.vue', target: 'components/ui/dropdown-menu/DropdownMenuRadioGroup.vue' },
    { path: 'DropdownMenuRadioItem.vue', target: 'components/ui/dropdown-menu/DropdownMenuRadioItem.vue' },
    { path: 'DropdownMenuSeparator.vue', target: 'components/ui/dropdown-menu/DropdownMenuSeparator.vue' },
    { path: 'DropdownMenuShortcut.vue', target: 'components/ui/dropdown-menu/DropdownMenuShortcut.vue' },
    { path: 'DropdownMenuSub.vue', target: 'components/ui/dropdown-menu/DropdownMenuSub.vue' },
    { path: 'DropdownMenuSubContent.vue', target: 'components/ui/dropdown-menu/DropdownMenuSubContent.vue' },
    { path: 'DropdownMenuSubTrigger.vue', target: 'components/ui/dropdown-menu/DropdownMenuSubTrigger.vue' },
    { path: 'DropdownMenuTrigger.vue', target: 'components/ui/dropdown-menu/DropdownMenuTrigger.vue' },
    { path: 'index.ts', target: 'components/ui/dropdown-menu/index.ts' },
  ],
  dependencies: ['@vueuse/core', 'class-variance-authority', 'lucide-vue-next', 'reka-ui'],
  registryDependencies: [],
})
