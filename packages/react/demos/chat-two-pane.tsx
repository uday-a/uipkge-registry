import Story from '../../components/story/Story'
import { ChatTwoPane } from '@react-registry-blocks/chat-two-pane/ChatTwoPane'

export default function ChatTwoPaneDemo() {
  return (
    <Story
      title="Chat Two Pane"
      description="Slack/iMessage-style two-pane messaging. Left rail: searchable conversation list with avatars, online dots, pinned section, unread badges, mute icons, smart timestamps. Right pane: active thread with day separators, own/peer bubbles, read ticks, typing indicator, attach/emoji/send composer."
    >
      <ChatTwoPane />
    </Story>
  )
}
