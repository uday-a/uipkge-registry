import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FeatureTabbedDeepdive'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FeatureTabbedDeepdive'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FeatureTabbedDeepdive', Component)
