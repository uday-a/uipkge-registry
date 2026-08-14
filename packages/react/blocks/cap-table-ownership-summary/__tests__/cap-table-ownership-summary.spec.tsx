import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CapTableOwnershipSummary'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CapTableOwnershipSummary'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CapTableOwnershipSummary', Component)
