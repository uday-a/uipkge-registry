import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'file-upload',
  type: 'registry:ui',
  categories: ['form'],
  description:
    'Drag-and-drop file dropzone with click-to-browse fallback, file-type filtering, multi-file support, and per-file progress + remove controls. Wraps native `<input type="file">` with proper a11y.',
  files: [
    { path: 'file-upload.tsx', target: 'components/ui/file-upload/file-upload.tsx' },
    { path: 'index.ts', target: 'components/ui/file-upload/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [],
})
