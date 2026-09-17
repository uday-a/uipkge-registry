import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PricingMatrixStickyHeader'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PricingMatrixStickyHeader'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PricingMatrixStickyHeader', Component)
