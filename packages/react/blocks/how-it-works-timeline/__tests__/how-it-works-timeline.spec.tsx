import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HowItWorksTimeline'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HowItWorksTimeline'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HowItWorksTimeline', Component)
