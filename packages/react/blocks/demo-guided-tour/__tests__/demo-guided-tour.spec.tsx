import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DemoGuidedTour'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DemoGuidedTour'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DemoGuidedTour', Component)
