import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PricingUsageCalculatorSlider'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PricingUsageCalculatorSlider'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PricingUsageCalculatorSlider', Component)
