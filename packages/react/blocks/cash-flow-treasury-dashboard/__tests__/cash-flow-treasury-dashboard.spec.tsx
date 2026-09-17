import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CashFlowTreasuryDashboard'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CashFlowTreasuryDashboard'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CashFlowTreasuryDashboard', Component)
