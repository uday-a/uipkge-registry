import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../RatingsStarSummary'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['RatingsStarSummary'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('RatingsStarSummary', Component)
