import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../StatusMonitoring'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['StatusMonitoring'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('StatusMonitoring', Component)
