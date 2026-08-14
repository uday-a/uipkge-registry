import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureStickyMediaScroll'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeatureStickyMediaScroll'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeatureStickyMediaScroll', Component)
