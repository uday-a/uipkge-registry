import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'error-500',
  title: '500 Server Error',
  type: 'registry:block',
  categories: ['layout', 'feedback'],
  description:
    'Full-page 500 with an isometric crashed-server illustration, HTTP code, headline, and Try again + Back to home + Contact support. Prop-driven: pass title, description, image, action labels, hrefs, and layout (`page` | `contained`). Pass `image=""` to hide the art.',
  files: [{ path: 'Error500.tsx', target: 'components/blocks/Error500.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})
