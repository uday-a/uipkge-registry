import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PricingFeatureTierSlider'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PricingFeatureTierSlider'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PricingFeatureTierSlider', Component)
