import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'error-404',
  title: '404 Not Found',
  type: 'registry:block',
  categories: ['layout', 'feedback'],
  description:
    'Full-page 404 with an isometric missing-page illustration, HTTP code, headline, and Back to home + Contact support. Prop-driven: pass title, description, image, action labels, hrefs, and layout (`page` | `contained`). Pass `image=""` to hide the art.',
  framework: 'vue',
  files: [{ path: 'Error404.vue', target: 'components/blocks/Error404.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/button.json'],
})
