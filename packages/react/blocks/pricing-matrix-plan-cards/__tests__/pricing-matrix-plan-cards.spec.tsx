import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PricingMatrixPlanCards'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PricingMatrixPlanCards'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PricingMatrixPlanCards', Component)
