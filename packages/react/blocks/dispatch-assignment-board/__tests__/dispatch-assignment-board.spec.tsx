import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DispatchAssignmentBoard'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DispatchAssignmentBoard'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DispatchAssignmentBoard', Component)
