import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PricingSinglePlan'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PricingSinglePlan'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PricingSinglePlan', Component)
