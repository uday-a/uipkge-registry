import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../OrderConfirmation'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['OrderConfirmation'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('OrderConfirmation', Component)
