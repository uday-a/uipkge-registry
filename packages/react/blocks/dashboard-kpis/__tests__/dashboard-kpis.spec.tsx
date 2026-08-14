import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DashboardKpis'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DashboardKpis'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DashboardKpis', Component)
