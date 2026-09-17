import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HeaderSearchCommand'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HeaderSearchCommand'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HeaderSearchCommand', Component)
