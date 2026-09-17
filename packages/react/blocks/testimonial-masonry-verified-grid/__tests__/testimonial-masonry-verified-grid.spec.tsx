import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../TestimonialMasonryVerifiedGrid'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['TestimonialMasonryVerifiedGrid'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('TestimonialMasonryVerifiedGrid', Component)
