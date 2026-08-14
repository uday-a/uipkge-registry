import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../MultimodalVisionPlayground'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['MultimodalVisionPlayground'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('MultimodalVisionPlayground', Component)
