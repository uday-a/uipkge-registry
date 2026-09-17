import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ReturnsPortal'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ReturnsPortal'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ReturnsPortal', Component)
