import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'code-block',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'svelte',
  description:
    'Syntax-highlighted code preview with a language header, copy button, optional line numbers, and collapsible `<pre>` content. Shiki `codeToTokens` highlighting with github-light/github-dark dual themes and plain-text fallback. Use for installation snippets, API examples, and source you want users to copy verbatim.',
  files: [
    { path: 'CodeBlock.svelte', target: 'components/ui/code-block/CodeBlock.svelte' },
    { path: 'index.ts', target: 'components/ui/code-block/index.ts' },
  ],
  dependencies: ['@lucide/svelte', 'shiki'],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})
