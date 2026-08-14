import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../TenantRentLedger'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['TenantRentLedger'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('TenantRentLedger', Component)
