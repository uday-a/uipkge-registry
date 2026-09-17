import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HowItWorksSteps'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HowItWorksSteps'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HowItWorksSteps', Component)
