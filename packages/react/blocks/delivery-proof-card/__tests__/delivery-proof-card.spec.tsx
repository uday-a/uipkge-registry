import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DeliveryProofCard'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DeliveryProofCard'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DeliveryProofCard', Component)
