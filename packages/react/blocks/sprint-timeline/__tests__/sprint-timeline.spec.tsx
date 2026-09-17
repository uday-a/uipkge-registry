import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SprintTimeline'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SprintTimeline'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SprintTimeline', Component)
