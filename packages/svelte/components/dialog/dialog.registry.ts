import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'dialog',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'svelte',
  description:
    'Free-form modal primitive — composable from `Dialog`, `DialogTrigger`, `DialogContent`, and friends. Use for forms, info cards, pickers, and any custom modal layout. Hand-rolled runes behavior: portal, Escape/outside close, scroll lock, focus trap, and labelledby wiring.',
  files: [
    { path: 'Dialog.svelte', target: 'components/ui/dialog/Dialog.svelte' },
    { path: 'DialogClose.svelte', target: 'components/ui/dialog/DialogClose.svelte' },
    { path: 'DialogContent.svelte', target: 'components/ui/dialog/DialogContent.svelte' },
    { path: 'DialogDescription.svelte', target: 'components/ui/dialog/DialogDescription.svelte' },
    { path: 'DialogFooter.svelte', target: 'components/ui/dialog/DialogFooter.svelte' },
    { path: 'DialogHeader.svelte', target: 'components/ui/dialog/DialogHeader.svelte' },
    { path: 'DialogOverlay.svelte', target: 'components/ui/dialog/DialogOverlay.svelte' },
    { path: 'DialogScrollContent.svelte', target: 'components/ui/dialog/DialogScrollContent.svelte' },
    { path: 'DialogTitle.svelte', target: 'components/ui/dialog/DialogTitle.svelte' },
    { path: 'DialogTrigger.svelte', target: 'components/ui/dialog/DialogTrigger.svelte' },
    { path: 'context.ts', target: 'components/ui/dialog/context.ts' },
    { path: 'portal.ts', target: 'components/ui/dialog/portal.ts' },
    { path: 'index.ts', target: 'components/ui/dialog/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})
