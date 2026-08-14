import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DailyStandupSummary'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DailyStandupSummary'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DailyStandupSummary', Component)
