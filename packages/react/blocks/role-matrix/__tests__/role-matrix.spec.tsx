import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../RoleMatrix'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['RoleMatrix'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('RoleMatrix', Component)
