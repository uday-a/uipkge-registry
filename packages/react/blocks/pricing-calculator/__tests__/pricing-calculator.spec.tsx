import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PricingCalculator'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PricingCalculator'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PricingCalculator', Component)
