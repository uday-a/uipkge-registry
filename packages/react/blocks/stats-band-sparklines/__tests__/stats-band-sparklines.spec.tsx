import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../StatsBandSparklines'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['StatsBandSparklines'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('StatsBandSparklines', Component)
