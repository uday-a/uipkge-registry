import Story from '../../components/story/Story'
import { AiLlmChat } from '@react-registry-blocks/ai-llm-chat/AiLlmChat'

export default function AiLlmChatDemo() {
  return (
    <Story
      title="AI LLM Chat"
      description="ChatGPT/Claude-style LLM chat surface. Collapsible left sidebar with New chat, searchable thread history grouped by Today/Yesterday/Previous 7 days/Earlier. Centered conversation: empty state with suggested-prompt tiles, user/assistant turns with code-block rendering and copy/regenerate/feedback actions, streaming dots, stop button. Composer with model picker, attach, Enter-to-send."
    >
      <AiLlmChat />
    </Story>
  )
}
