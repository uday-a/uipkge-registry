import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LessonVideoPlayer'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LessonVideoPlayer'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LessonVideoPlayer', Component)
