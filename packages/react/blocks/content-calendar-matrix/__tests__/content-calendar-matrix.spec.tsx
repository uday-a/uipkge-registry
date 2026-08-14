import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ContentCalendarMatrix'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ContentCalendarMatrix'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ContentCalendarMatrix', Component)
