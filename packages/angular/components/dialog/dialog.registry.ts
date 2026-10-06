import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'dialog',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'angular',
  description:
    'Free-form modal primitive — composable from `UiDialogComponent`, trigger, content, and friends. Use for forms, info cards, pickers, and any custom modal layout. Radix Dialog behaviour: body portal + overlay, focus trap and restore, scroll lock, Escape / overlay dismiss, aria-labelledby / aria-describedby wiring.',
  files: [
    { path: 'dialog.component.ts', target: 'components/ui/dialog/dialog.component.ts' },
    { path: 'index.ts', target: 'components/ui/dialog/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/popper.json', 'https://uipkge.dev/r/button.json'],
})
