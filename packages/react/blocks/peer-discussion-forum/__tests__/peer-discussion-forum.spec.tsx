import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PeerDiscussionForum'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PeerDiscussionForum'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PeerDiscussionForum', Component)
