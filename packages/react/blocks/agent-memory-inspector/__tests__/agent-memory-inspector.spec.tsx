import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AgentMemoryInspector'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AgentMemoryInspector'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AgentMemoryInspector', Component)
