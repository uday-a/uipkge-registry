import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HowItWorksScrollStepper'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HowItWorksScrollStepper'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HowItWorksScrollStepper', Component)
