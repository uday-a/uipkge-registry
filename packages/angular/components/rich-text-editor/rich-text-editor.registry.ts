import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'rich-text-editor',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'WYSIWYG editor with bold/italic/links/lists/headings/blockquote/code plus a configurable toolbar. Drop into forms where plain text is too low-level.',
  files: [
    { path: 'rich-text-editor.component.ts', target: 'components/ui/rich-text-editor/rich-text-editor.component.ts' },
    { path: 'index.ts', target: 'components/ui/rich-text-editor/index.ts' },
  ],
  dependencies: [
    '@angular/forms',
    '@tiptap/core',
    '@tiptap/starter-kit',
    '@tiptap/extension-link',
    '@tiptap/extension-placeholder',
    '@tiptap/extension-task-item',
    '@tiptap/extension-task-list',
    '@tiptap/extension-text-align',
    '@tiptap/extension-underline',
  ],
  registryDependencies: [],
})
