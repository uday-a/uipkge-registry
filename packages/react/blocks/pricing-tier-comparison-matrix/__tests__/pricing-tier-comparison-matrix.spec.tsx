import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PricingTierComparisonMatrix'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PricingTierComparisonMatrix'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PricingTierComparisonMatrix', Component)
