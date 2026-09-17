import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HeroWaitlistGlow'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HeroWaitlistGlow'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HeroWaitlistGlow', Component)
