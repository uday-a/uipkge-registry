import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HeroTypingCommandCenter'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HeroTypingCommandCenter'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HeroTypingCommandCenter', Component)
