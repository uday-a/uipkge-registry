import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../BillingAccount'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['BillingAccount'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('BillingAccount', Component)
