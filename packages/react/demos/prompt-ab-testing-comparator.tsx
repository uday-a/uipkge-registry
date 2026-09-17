import Story from '../../components/story/Story'
import { PromptAbTestingComparator } from '@react-registry-blocks/prompt-ab-testing-comparator/PromptAbTestingComparator'

export default function PromptAbTestingComparatorDemo() {
  return (
    <>
      <Story
        title="Prompt A/B Testing Comparator"
        description="Side-by-side prompt variation comparison shootout with automated LLM judge scoring, win rates, and token diffs for AI code generation prompts."
      >
        <PromptAbTestingComparator />
      </Story>

      <Story
        title="Custom Benchmark Scope"
        description="Prompt comparator configured for specialized AST transformer prompt evaluation."
      >
        <PromptAbTestingComparator
          experimentTitle="AST Optimization: TypeScript Interface Transformer"
          testSampleCount="100 Evaluation Prompts"
        />
      </Story>
    </>
  )
}
