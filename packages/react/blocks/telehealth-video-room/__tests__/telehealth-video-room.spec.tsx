import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../TelehealthVideoRoom'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['TelehealthVideoRoom'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('TelehealthVideoRoom', Component)
