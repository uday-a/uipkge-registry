import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../RoiCalculatorInputs'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['RoiCalculatorInputs'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('RoiCalculatorInputs', Component)
