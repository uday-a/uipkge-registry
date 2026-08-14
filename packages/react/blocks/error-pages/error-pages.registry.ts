import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'error-pages',
  type: 'registry:block',
  categories: ['layout', 'marketing', 'utility'],
  description:
    'Pack of four status screens — 404, 500, 403, and 503 — each with a matching isometric illustration, code, copy, and actions. `variant` picks a single screen, `size` compacts it. Override title, description, image, code, tag, labels, hrefs, disabled flags, and callbacks. Pass `image=""` to hide the art.',
  files: [{ path: 'ErrorPages.tsx', target: 'components/blocks/ErrorPages.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})
