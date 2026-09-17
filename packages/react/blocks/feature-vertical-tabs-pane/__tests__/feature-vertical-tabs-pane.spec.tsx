import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureVerticalTabsPane'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeatureVerticalTabsPane'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeatureVerticalTabsPane', Component)
