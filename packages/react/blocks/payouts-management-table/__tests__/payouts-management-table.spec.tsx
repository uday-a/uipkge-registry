import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PayoutsManagementTable'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PayoutsManagementTable'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PayoutsManagementTable', Component)
