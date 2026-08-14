import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ProfileMenu'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ProfileMenu'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ProfileMenu', Component)
