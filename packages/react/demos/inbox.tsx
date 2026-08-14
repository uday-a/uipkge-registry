import Story from '../../components/story/Story'
import { Inbox } from '@react-registry-blocks/inbox/Inbox'
// Inbox is a single-file three-pane mail surface. It defaults to a stubbed
// `messages` list — pass your own `messages` prop after installing into
// `components/blocks/Inbox.tsx`.

export default function InboxDemo() {
  return (
    <Story
      title="Inbox"
      description="Three-pane mail surface. Left rail: Compose button, folders with unread counts, colour-coded labels. Middle: searchable message list with sender/subject/preview/labels/attachment glyphs/star toggle/smart timestamps. Right: reader pane with subject, from/to, body, attachment chip, reply/forward/archive actions."
    >
      <Inbox />
    </Story>
  )
}
