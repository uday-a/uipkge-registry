import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CodeTerminalSession'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CodeTerminalSession'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CodeTerminalSession', Component)
