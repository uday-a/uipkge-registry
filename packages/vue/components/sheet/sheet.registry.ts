import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sheet',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'vue',
  description:
    'Side-mounted modal that slides in from the top, right, bottom, or left edge. Use for filter panels, edit drawers, and mobile menus.',
  files: [
    { path: 'Sheet.vue', target: 'components/ui/sheet/Sheet.vue' },
    { path: 'SheetClose.vue', target: 'components/ui/sheet/SheetClose.vue' },
    { path: 'SheetContent.vue', target: 'components/ui/sheet/SheetContent.vue' },
    { path: 'SheetDescription.vue', target: 'components/ui/sheet/SheetDescription.vue' },
    { path: 'SheetFooter.vue', target: 'components/ui/sheet/SheetFooter.vue' },
    { path: 'SheetHeader.vue', target: 'components/ui/sheet/SheetHeader.vue' },
    { path: 'SheetOverlay.vue', target: 'components/ui/sheet/SheetOverlay.vue' },
    { path: 'SheetTitle.vue', target: 'components/ui/sheet/SheetTitle.vue' },
    { path: 'SheetTrigger.vue', target: 'components/ui/sheet/SheetTrigger.vue' },
    { path: 'index.ts', target: 'components/ui/sheet/index.ts' },
  ],
  dependencies: ['@vueuse/core', 'lucide-vue-next', 'reka-ui'],
  registryDependencies: [],
})
