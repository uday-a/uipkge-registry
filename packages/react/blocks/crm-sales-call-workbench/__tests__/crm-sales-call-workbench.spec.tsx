import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CrmSalesCallWorkbench'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CrmSalesCallWorkbench'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CrmSalesCallWorkbench', Component)
