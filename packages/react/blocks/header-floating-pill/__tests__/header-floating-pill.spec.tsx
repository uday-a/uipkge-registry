import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HeaderFloatingPill'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HeaderFloatingPill'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HeaderFloatingPill', Component)
