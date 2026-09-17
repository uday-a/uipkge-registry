import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HeroDeveloperTerminal'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HeroDeveloperTerminal'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HeroDeveloperTerminal', Component)
