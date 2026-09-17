import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PricingMatrixGrouped'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PricingMatrixGrouped'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PricingMatrixGrouped', Component)
