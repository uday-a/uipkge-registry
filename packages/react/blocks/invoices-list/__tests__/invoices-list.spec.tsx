import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../InvoicesList'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['InvoicesList'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('InvoicesList', Component)
