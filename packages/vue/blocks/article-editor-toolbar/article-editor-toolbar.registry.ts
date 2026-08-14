import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'article-editor-toolbar',
  type: 'registry:block',
  categories: ['media', 'app', 'content'],
  description:
    'Medium and Substack style rich text formatting toolbar and article drafting canvas with typography controls, syntax highlighted code blocks, callouts, and publishing drawer.',
  framework: 'vue',
  files: [{ path: 'ArticleEditorToolbar.vue', target: 'components/blocks/ArticleEditorToolbar.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
