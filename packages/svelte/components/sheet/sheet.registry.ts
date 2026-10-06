import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sheet',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'svelte',
  description:
    'Side-mounted modal that slides in from the top, right, bottom, or left edge. Use for filter panels, edit drawers, and mobile menus.',
  files: [
    { path: 'Sheet.svelte', target: 'components/ui/sheet/Sheet.svelte' },
    { path: 'SheetClose.svelte', target: 'components/ui/sheet/SheetClose.svelte' },
    { path: 'SheetContent.svelte', target: 'components/ui/sheet/SheetContent.svelte' },
    { path: 'SheetDescription.svelte', target: 'components/ui/sheet/SheetDescription.svelte' },
    { path: 'SheetFooter.svelte', target: 'components/ui/sheet/SheetFooter.svelte' },
    { path: 'SheetHeader.svelte', target: 'components/ui/sheet/SheetHeader.svelte' },
    { path: 'SheetOverlay.svelte', target: 'components/ui/sheet/SheetOverlay.svelte' },
    { path: 'SheetTitle.svelte', target: 'components/ui/sheet/SheetTitle.svelte' },
    { path: 'SheetTrigger.svelte', target: 'components/ui/sheet/SheetTrigger.svelte' },
    { path: 'context.ts', target: 'components/ui/sheet/context.ts' },
    { path: 'index.ts', target: 'components/ui/sheet/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: [],
})
