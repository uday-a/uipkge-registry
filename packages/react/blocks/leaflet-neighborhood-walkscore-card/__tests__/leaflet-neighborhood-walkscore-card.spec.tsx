import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LeafletNeighborhoodWalkscoreCard'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LeafletNeighborhoodWalkscoreCard'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LeafletNeighborhoodWalkscoreCard', Component)
