import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../OrderManagementPage'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['OrderManagementPage'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('OrderManagementPage', Component)
