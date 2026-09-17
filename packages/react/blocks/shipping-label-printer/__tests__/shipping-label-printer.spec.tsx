import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ShippingLabelPrinter'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ShippingLabelPrinter'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ShippingLabelPrinter', Component)
