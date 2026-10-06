import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'alert-modal',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'angular',
  description:
    'Props-driven shortcut for confirm and destructive prompts — pass `title`, `description`, `actionLabel`, and a `tone` and you get a fully styled modal with a leading icon ring, action button, and optional async loading state. Built on Dialog (role=alertdialog, no outside-click dismiss, focus trap, Escape). Skip it and use Dialog when you need a free-form modal instead.',
  files: [
    { path: 'alert-modal.component.ts', target: 'components/ui/alert-modal/alert-modal.component.ts' },
    { path: 'index.ts', target: 'components/ui/alert-modal/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/popper.json',
  ],
})
