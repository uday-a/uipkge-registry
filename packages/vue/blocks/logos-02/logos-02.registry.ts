import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'logos-02',
  title: 'Single Marquee Logos',
  type: 'registry:block',
  framework: 'vue',
  categories: ['marketing'],
  description:
    'Single-row infinite marquee of customer logos. Track is duplicated and translated -50% on a 30s linear loop for a seamless seam; edges fade out via CSS mask-image; pauses on hover; respects prefers-reduced-motion.',
  files: [{ path: 'Logos02.vue', target: 'components/blocks/Logos02.vue' }],
  dependencies: [],
  registryDependencies: [],
})
