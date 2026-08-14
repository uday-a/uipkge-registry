import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../TimeOffPortal'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['TimeOffPortal'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('TimeOffPortal', Component)
