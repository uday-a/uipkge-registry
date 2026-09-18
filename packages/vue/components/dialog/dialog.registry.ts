import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'dialog',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'vue',
  description:
    'Free-form modal primitive — composable from `Dialog`, `DialogTrigger`, `DialogContent`, and friends. Use for forms, info cards, pickers, and any custom modal layout. For confirm/destructive prompts, prefer the prebuilt `AlertModal` shortcut.',
  files: [
    { path: 'Dialog.vue', target: 'components/ui/dialog/Dialog.vue' },
    { path: 'DialogClose.vue', target: 'components/ui/dialog/DialogClose.vue' },
    { path: 'DialogContent.vue', target: 'components/ui/dialog/DialogContent.vue' },
    { path: 'DialogDescription.vue', target: 'components/ui/dialog/DialogDescription.vue' },
    { path: 'DialogFooter.vue', target: 'components/ui/dialog/DialogFooter.vue' },
    { path: 'DialogHeader.vue', target: 'components/ui/dialog/DialogHeader.vue' },
    { path: 'DialogOverlay.vue', target: 'components/ui/dialog/DialogOverlay.vue' },
    { path: 'DialogScrollContent.vue', target: 'components/ui/dialog/DialogScrollContent.vue' },
    { path: 'DialogTitle.vue', target: 'components/ui/dialog/DialogTitle.vue' },
    { path: 'DialogTrigger.vue', target: 'components/ui/dialog/DialogTrigger.vue' },
    { path: 'index.ts', target: 'components/ui/dialog/index.ts' },
  ],
  dependencies: ['@vueuse/core', 'lucide-vue-next', 'reka-ui'],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})
