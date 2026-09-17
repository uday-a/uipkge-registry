import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../BillingUsageCenter'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['BillingUsageCenter'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('BillingUsageCenter', Component)
