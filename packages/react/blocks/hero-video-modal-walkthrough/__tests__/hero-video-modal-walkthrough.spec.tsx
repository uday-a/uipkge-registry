import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HeroVideoModalWalkthrough'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HeroVideoModalWalkthrough'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HeroVideoModalWalkthrough', Component)
