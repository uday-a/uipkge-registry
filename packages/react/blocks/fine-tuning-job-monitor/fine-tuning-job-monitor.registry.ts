import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'fine-tuning-job-monitor',
  type: 'registry:block',
  categories: ['ai', 'dashboard', 'app'],
  description:
    'LLM fine-tuning job telemetry, loss curve convergence tracking, GPU cluster utilization, hyperparameter manifests, and LoRA checkpoint exporter.',
  files: [{ path: 'FineTuningJobMonitor.tsx', target: 'components/blocks/FineTuningJobMonitor.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})
