import Story from '../../components/story/Story'
import { PeerDiscussionForum } from '@react-registry-blocks/peer-discussion-forum/PeerDiscussionForum'

export default function PeerDiscussionForumDemo() {
  return (
    <Story
      title="Default"
      description="StackOverflow and EdStem style student community Q&A thread with upvoting, accepted instructor answers, markdown code formatting, rich answer composer, and related discussions sidebar."
    >
      <PeerDiscussionForum />
    </Story>
  )
}
