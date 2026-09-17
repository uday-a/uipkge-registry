import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Hero3dTiltInteractiveCanvas'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['Hero3dTiltInteractiveCanvas'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Hero3dTiltInteractiveCanvas', Component)
