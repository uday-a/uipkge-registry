import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PersonalFinanceBudget'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PersonalFinanceBudget'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PersonalFinanceBudget', Component)
