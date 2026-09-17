import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../VirtualCardManager'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['VirtualCardManager'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('VirtualCardManager', Component)
