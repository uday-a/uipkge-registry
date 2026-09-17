import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CartDrawer'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CartDrawer'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CartDrawer', Component)
