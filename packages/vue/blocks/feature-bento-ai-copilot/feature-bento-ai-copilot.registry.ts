import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-bento-ai-copilot',
  type: 'registry:block',
  categories: ['feature', 'marketing'],
  framework: 'vue',
  description:
    'AI agent copilot bento workbench with model tuning sliders, live inference streaming, and token speed telemetry.',
  files: [
    {
      path: 'FeatureBentoAiCopilot.vue',
      target: 'components/blocks/feature-bento-ai-copilot/FeatureBentoAiCopilot.vue',
    },
    { path: 'index.ts', target: 'components/blocks/feature-bento-ai-copilot/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})
