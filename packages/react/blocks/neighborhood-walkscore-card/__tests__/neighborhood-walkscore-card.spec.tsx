import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../NeighborhoodWalkscoreCard'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['NeighborhoodWalkscoreCard'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('NeighborhoodWalkscoreCard', Component)
