import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../BoardResolutionSignoff'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['BoardResolutionSignoff'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('BoardResolutionSignoff', Component)
