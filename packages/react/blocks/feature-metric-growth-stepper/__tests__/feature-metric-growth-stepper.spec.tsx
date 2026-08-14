import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureMetricGrowthStepper'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeatureMetricGrowthStepper'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeatureMetricGrowthStepper', Component)
