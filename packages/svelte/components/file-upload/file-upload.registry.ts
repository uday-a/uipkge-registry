import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'file-upload',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'svelte',
  description:
    'Drag-and-drop file dropzone with click-to-browse fallback, file-type filtering, multi-file support, and per-file progress + remove controls. Wraps native `<input type="file">` with proper a11y.',
  files: [
    { path: 'FileUpload.svelte', target: 'components/ui/file-upload/FileUpload.svelte' },
    { path: 'FileUploadContent.svelte', target: 'components/ui/file-upload/FileUploadContent.svelte' },
    { path: 'FileUploadItem.svelte', target: 'components/ui/file-upload/FileUploadItem.svelte' },
    { path: 'FileUploadItemName.svelte', target: 'components/ui/file-upload/FileUploadItemName.svelte' },
    { path: 'FileUploadItemSize.svelte', target: 'components/ui/file-upload/FileUploadItemSize.svelte' },
    { path: 'FileUploadTrigger.svelte', target: 'components/ui/file-upload/FileUploadTrigger.svelte' },
    { path: 'index.ts', target: 'components/ui/file-upload/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: [],
})
