import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ContractorTimesheetApproval'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ContractorTimesheetApproval'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ContractorTimesheetApproval', Component)
