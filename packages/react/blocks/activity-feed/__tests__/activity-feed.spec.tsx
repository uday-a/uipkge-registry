import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ActivityFeed'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ActivityFeed'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ActivityFeed', Component)
