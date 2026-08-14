import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureInteractiveTabs'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeatureInteractiveTabs'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeatureInteractiveTabs', Component)
