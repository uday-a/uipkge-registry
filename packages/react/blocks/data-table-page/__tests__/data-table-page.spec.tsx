import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DataTablePage'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DataTablePage'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DataTablePage', Component)
