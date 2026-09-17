import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../Features2x2Spotlight'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['Features2x2Spotlight'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('Features2x2Spotlight', Component)
