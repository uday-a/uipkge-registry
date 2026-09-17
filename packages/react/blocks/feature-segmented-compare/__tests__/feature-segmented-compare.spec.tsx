import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureSegmentedCompare'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeatureSegmentedCompare'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeatureSegmentedCompare', Component)
