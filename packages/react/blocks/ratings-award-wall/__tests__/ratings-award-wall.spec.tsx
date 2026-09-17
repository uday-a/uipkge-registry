import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../RatingsAwardWall'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['RatingsAwardWall'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('RatingsAwardWall', Component)
