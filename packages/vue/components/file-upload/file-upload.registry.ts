import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'file-upload',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'vue',
  description:
    'Drag-and-drop file dropzone with click-to-browse fallback, file-type filtering, multi-file support, and per-file progress + remove controls. Wraps native `<input type="file">` with proper a11y.',
  files: [
    { path: 'FileUpload.vue', target: 'components/ui/file-upload/FileUpload.vue' },
    { path: 'FileUploadContent.vue', target: 'components/ui/file-upload/FileUploadContent.vue' },
    { path: 'FileUploadItem.vue', target: 'components/ui/file-upload/FileUploadItem.vue' },
    { path: 'FileUploadItemName.vue', target: 'components/ui/file-upload/FileUploadItemName.vue' },
    { path: 'FileUploadItemSize.vue', target: 'components/ui/file-upload/FileUploadItemSize.vue' },
    { path: 'FileUploadTrigger.vue', target: 'components/ui/file-upload/FileUploadTrigger.vue' },
    { path: 'index.ts', target: 'components/ui/file-upload/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [],
})
