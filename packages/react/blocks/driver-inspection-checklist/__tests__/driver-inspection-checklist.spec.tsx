import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DriverInspectionChecklist'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DriverInspectionChecklist'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DriverInspectionChecklist', Component)
