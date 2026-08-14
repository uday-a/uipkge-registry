import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LoanCalculator'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LoanCalculator'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LoanCalculator', Component)
