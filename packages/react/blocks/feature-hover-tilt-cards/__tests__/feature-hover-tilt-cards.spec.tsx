import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureHoverTiltCards'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeatureHoverTiltCards'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeatureHoverTiltCards', Component)
