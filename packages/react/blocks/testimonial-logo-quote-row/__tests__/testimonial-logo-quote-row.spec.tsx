import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../TestimonialLogoQuoteRow'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['TestimonialLogoQuoteRow'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('TestimonialLogoQuoteRow', Component)
