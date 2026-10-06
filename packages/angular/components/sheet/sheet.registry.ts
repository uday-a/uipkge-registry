import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sheet',
  type: 'registry:ui',
  categories: ['overlay'],
  framework: 'angular',
  description:
    'Side-mounted modal that slides in from the top, right, bottom, or left edge. Use for filter panels, edit drawers, and mobile menus. Focus trap, scroll lock and Escape / outside-click dismissal come from the built-in popper helpers — no @angular/cdk needed.',
  files: [
    { path: 'sheet.component.ts', target: 'components/ui/sheet/sheet.component.ts' },
    { path: 'index.ts', target: 'components/ui/sheet/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})
