import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-accordion-media',
  title: 'Features — Accordion with Media',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Single-open accordion of features beside a media pane that follows the open item, collapsing to inline panes on narrow screens where a side pane would be unreadable.',
  framework: 'vue',
  files: [{ path: 'FeatureAccordionMedia.vue', target: 'components/blocks/FeatureAccordionMedia.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/accordion.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})
