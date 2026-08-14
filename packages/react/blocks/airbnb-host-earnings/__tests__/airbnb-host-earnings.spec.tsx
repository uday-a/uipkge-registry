import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AirbnbHostEarnings'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AirbnbHostEarnings'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AirbnbHostEarnings', Component)
