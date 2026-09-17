import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'rich-text-editor',
  type: 'registry:ui',
  categories: ['form'],
  description:
    'WYSIWYG editor wrapped around TipTap — bold/italic/links/lists/headings/blockquote/code, plus a configurable toolbar. Drop into forms where Markdown is too low-level.',
  files: [
    { path: 'rich-text-editor.tsx', target: 'components/ui/rich-text-editor/rich-text-editor.tsx' },
    { path: 'index.ts', target: 'components/ui/rich-text-editor/index.ts' },
  ],
  dependencies: [
    '@tiptap/react',
    '@tiptap/starter-kit',
    '@tiptap/pm',
    '@tiptap/extension-link',
    '@tiptap/extension-placeholder',
    '@tiptap/extension-task-item',
    '@tiptap/extension-task-list',
    '@tiptap/extension-text-align',
    '@tiptap/extension-underline',
    'lucide-react',
  ],
  registryDependencies: ['https://uipkge.dev/r/separator.json', 'https://uipkge.dev/r/toggle.json'],
})
