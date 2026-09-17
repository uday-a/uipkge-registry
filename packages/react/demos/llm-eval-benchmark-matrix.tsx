import Story from '../../components/story/Story'
import { LlmEvalBenchmarkMatrix } from '@react-registry-blocks/llm-eval-benchmark-matrix/LlmEvalBenchmarkMatrix'

export default function LlmEvalBenchmarkMatrixDemo() {
  return (
    <Story
      title="Default"
      description="LangSmith and DeepEval style LLM evaluation scorecard, automated golden dataset assertions, and multi-model benchmark matrix with faithfulness, answer relevancy, context recall metrics, and evaluator judge reasoning inspection."
    >
      <LlmEvalBenchmarkMatrix />
    </Story>
  )
}
