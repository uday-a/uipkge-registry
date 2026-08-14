import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ServiceHealthMatrix'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ServiceHealthMatrix'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ServiceHealthMatrix', Component)
