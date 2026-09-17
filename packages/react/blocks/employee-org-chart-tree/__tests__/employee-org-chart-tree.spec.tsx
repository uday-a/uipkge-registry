import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../EmployeeOrgChartTree'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['EmployeeOrgChartTree'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('EmployeeOrgChartTree', Component)
