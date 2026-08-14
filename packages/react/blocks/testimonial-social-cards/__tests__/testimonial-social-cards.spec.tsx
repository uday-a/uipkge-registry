import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../TestimonialSocialCards'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['TestimonialSocialCards'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('TestimonialSocialCards', Component)
