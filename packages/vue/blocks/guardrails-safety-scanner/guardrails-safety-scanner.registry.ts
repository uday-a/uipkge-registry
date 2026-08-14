import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'guardrails-safety-scanner',
  type: 'registry:block',
  categories: ['ai', 'app', 'dashboard', 'devops'],
  description:
    'NVIDIA NeMo Guardrails and LlamaGuard style input/output safety scanner with real-time prompt injection detection, PII redactor, telemetry metrics, and configurable safety policy enforcement table.',
  framework: 'vue',
  files: [{ path: 'GuardrailsSafetyScanner.vue', target: 'components/blocks/GuardrailsSafetyScanner.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/textarea.json',
  ],
})
