import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HowItWorksTabbedSteps'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HowItWorksTabbedSteps'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HowItWorksTabbedSteps', Component)
