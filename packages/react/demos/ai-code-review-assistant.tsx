import Story from '../../components/story/Story'
import { AiCodeReviewAssistant } from '@react-registry-blocks/ai-code-review-assistant/AiCodeReviewAssistant'

export default function AiCodeReviewAssistantDemo() {
  return (
    <>
      <Story
        title="Default"
        description="GitHub PR automated AI code review assistant with AST syntax diff annotations, performance suggestions, and 1-click patch application."
      >
        <AiCodeReviewAssistant />
      </Story>

      <Story
        title="Custom PR Context"
        description="AI code review assistant configured with custom repository branch targets and author metadata."
      >
        <AiCodeReviewAssistant
          prNumber={528}
          prTitle="feat(engine): stream AST node transforms via Web Workers"
          authorName="Marcus Vance"
          authorHandle="marcus-vance"
          authorRole="Lead Compiler Architect"
          sourceBranch="feat/worker-ast-stream"
          targetBranch="main"
        />
      </Story>
    </>
  )
}
