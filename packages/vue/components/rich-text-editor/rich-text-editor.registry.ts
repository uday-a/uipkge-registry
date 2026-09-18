import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'rich-text-editor',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'vue',
  description:
    'WYSIWYG editor wrapped around TipTap — bold/italic/links/lists/headings/blockquote/code, plus a configurable toolbar. Drop into forms where Markdown is too low-level.',
  files: [
    { path: 'RichTextEditor.vue', target: 'components/ui/rich-text-editor/RichTextEditor.vue' },
    { path: 'index.ts', target: 'components/ui/rich-text-editor/index.ts' },
  ],
  dependencies: [
    '@tiptap/extension-link',
    '@tiptap/extension-placeholder',
    '@tiptap/extension-task-item',
    '@tiptap/extension-task-list',
    '@tiptap/extension-text-align',
    '@tiptap/extension-underline',
    '@tiptap/starter-kit',
    '@tiptap/vue-3',
    'lucide-vue-next',
  ],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/popover.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/toggle.json',
  ],
})
