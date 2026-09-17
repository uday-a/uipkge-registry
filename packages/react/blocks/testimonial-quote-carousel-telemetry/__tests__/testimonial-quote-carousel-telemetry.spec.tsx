import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../TestimonialQuoteCarouselTelemetry'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['TestimonialQuoteCarouselTelemetry'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('TestimonialQuoteCarouselTelemetry', Component)
