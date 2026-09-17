import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureComparisonSlider'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeatureComparisonSlider'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeatureComparisonSlider', Component)
