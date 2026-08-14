import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DecisionMatrixTable'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DecisionMatrixTable'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DecisionMatrixTable', Component)
