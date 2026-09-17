import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../McpServerRegistryManager'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['McpServerRegistryManager'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('McpServerRegistryManager', Component)
