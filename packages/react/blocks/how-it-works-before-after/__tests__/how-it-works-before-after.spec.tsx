import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HowItWorksBeforeAfter'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HowItWorksBeforeAfter'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HowItWorksBeforeAfter', Component)
