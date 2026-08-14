import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PayrollRunSummary'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PayrollRunSummary'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PayrollRunSummary', Component)
