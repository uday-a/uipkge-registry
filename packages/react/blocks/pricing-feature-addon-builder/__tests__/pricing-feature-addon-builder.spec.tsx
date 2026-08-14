import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PricingFeatureAddonBuilder'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PricingFeatureAddonBuilder'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PricingFeatureAddonBuilder', Component)
