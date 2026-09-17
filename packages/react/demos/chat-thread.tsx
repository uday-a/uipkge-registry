import Story from '../../components/story/Story'
import { ChatThread } from '@react-registry-blocks/chat-thread/ChatThread'

export default function ChatThreadDemo() {
  return (
    <Story
      title="Chat Thread"
      description="Single-pane conversation surface. Peer header with online dot, grouped messages with day separators (Today/Yesterday/date), own vs. peer bubbles, read/delivered/sent ticks, typing indicator, composer with attach/emoji and Enter-to-send."
    >
      <ChatThread />
    </Story>
  )
}
