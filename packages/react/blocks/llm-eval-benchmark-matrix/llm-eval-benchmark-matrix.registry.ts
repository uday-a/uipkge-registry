import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'llm-eval-benchmark-matrix',
  type: 'registry:block',
  categories: ['ai', 'dashboard', 'developer', 'table'],
  description:
    'LangSmith/Braintrust/DeepEval style LLM evaluation scorecard, automated golden dataset assertions, and model benchmark matrix with faithfulness, answer relevancy, context recall metrics, and evaluator judge reasoning inspection.',
  framework: 'react',
  files: [{ path: 'LlmEvalBenchmarkMatrix.tsx', target: 'components/blocks/LlmEvalBenchmarkMatrix.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
