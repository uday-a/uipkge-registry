import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'file-upload',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'Drag-and-drop file dropzone with click / Enter / Space to browse, file-type filtering and multi-file support, plus composable Content / Item (with remove) / ItemName / ItemSize parts for the file list. Wraps a native `<input type="file">`.',
  files: [
    { path: 'file-upload.component.ts', target: 'components/ui/file-upload/file-upload.component.ts' },
    { path: 'index.ts', target: 'components/ui/file-upload/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})
