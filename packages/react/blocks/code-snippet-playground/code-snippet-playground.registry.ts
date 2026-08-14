import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'code-snippet-playground',
  type: 'registry:block',
  categories: ['devops', 'app', 'developer', 'education'],
  description:
    'Multi-file interactive code runner, editor tabs, and terminal console output for components with live render sandbox, syntax highlighting, and test execution.',
  files: [{ path: 'CodeSnippetPlayground.tsx', target: 'components/blocks/CodeSnippetPlayground.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
