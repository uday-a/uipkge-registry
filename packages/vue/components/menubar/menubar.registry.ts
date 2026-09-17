import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'menubar',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'vue',
  description:
    'Top-level menu bar — File / Edit / View — for desktop-style apps. Same primitives as Dropdown Menu but laid out horizontally and keyboard-navigable across siblings (left/right arrows).',
  files: [
    { path: 'Menubar.vue', target: 'components/ui/menubar/Menubar.vue' },
    { path: 'MenubarCheckboxItem.vue', target: 'components/ui/menubar/MenubarCheckboxItem.vue' },
    { path: 'MenubarContent.vue', target: 'components/ui/menubar/MenubarContent.vue' },
    { path: 'MenubarGroup.vue', target: 'components/ui/menubar/MenubarGroup.vue' },
    { path: 'MenubarItem.vue', target: 'components/ui/menubar/MenubarItem.vue' },
    { path: 'MenubarLabel.vue', target: 'components/ui/menubar/MenubarLabel.vue' },
    { path: 'MenubarMenu.vue', target: 'components/ui/menubar/MenubarMenu.vue' },
    { path: 'MenubarRadioGroup.vue', target: 'components/ui/menubar/MenubarRadioGroup.vue' },
    { path: 'MenubarRadioItem.vue', target: 'components/ui/menubar/MenubarRadioItem.vue' },
    { path: 'MenubarSeparator.vue', target: 'components/ui/menubar/MenubarSeparator.vue' },
    { path: 'MenubarShortcut.vue', target: 'components/ui/menubar/MenubarShortcut.vue' },
    { path: 'MenubarSub.vue', target: 'components/ui/menubar/MenubarSub.vue' },
    { path: 'MenubarSubContent.vue', target: 'components/ui/menubar/MenubarSubContent.vue' },
    { path: 'MenubarSubTrigger.vue', target: 'components/ui/menubar/MenubarSubTrigger.vue' },
    { path: 'MenubarTrigger.vue', target: 'components/ui/menubar/MenubarTrigger.vue' },
    { path: 'index.ts', target: 'components/ui/menubar/index.ts' },
  ],
  dependencies: ['@vueuse/core', 'lucide-vue-next', 'reka-ui'],
  registryDependencies: [],
})
