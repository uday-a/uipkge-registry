import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'file-manager',
  type: 'registry:block',
  categories: ['media', 'app'],
  description:
    'Storage/files page with breadcrumbs, search, grid/list view toggle, upload action, and a storage meter over hardcoded folders and files.',
  files: [{ path: 'FileManager.tsx', target: 'components/blocks/FileManager.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/breadcrumb.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/toggle-group.json',
  ],
})
