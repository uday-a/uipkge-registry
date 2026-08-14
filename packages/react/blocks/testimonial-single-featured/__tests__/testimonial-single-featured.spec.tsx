import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../TestimonialSingleFeatured'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['TestimonialSingleFeatured'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('TestimonialSingleFeatured', Component)
