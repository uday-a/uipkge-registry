import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'multimodal-vision-playground',
  type: 'registry:block',
  categories: ['ai', 'app', 'dashboard'],
  description:
    'GPT-4o/Claude 3.5 Vision multimodal visual analysis studio with interactive bounding box overlays, OCR entity extraction, tabular line item parsing, raw RFC-8259 JSON viewer, and visual question answering (VQA).',
  framework: 'vue',
  files: [{ path: 'MultimodalVisionPlayground.vue', target: 'components/blocks/MultimodalVisionPlayground.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
