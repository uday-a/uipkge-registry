import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HeroSplitDeviceMockup'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HeroSplitDeviceMockup'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HeroSplitDeviceMockup', Component)
