import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HowItWorksArrowFlow'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HowItWorksArrowFlow'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HowItWorksArrowFlow', Component)
