import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HeroGlobeInteractiveNodes'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HeroGlobeInteractiveNodes'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HeroGlobeInteractiveNodes', Component)
