import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'logos-01',
  title: 'Static Logo Grid',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Customer-logo cloud strip. "Trusted by teams at" eyebrow over a responsive grid of six grayscale wordmarks (2 / 3 / 6 columns by breakpoint). Each logo is an inline SVG sitting on currentColor so the muted-foreground → foreground hover swap works. Ships with placeholder marks — swap the SVGs with real customer logos before shipping.',
  framework: 'vue',
  files: [{ path: 'Logos01.vue', target: 'components/blocks/Logos01.vue' }],
  dependencies: [],
  registryDependencies: [],
})
