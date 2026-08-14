import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../UseCasesPersonaTabs'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['UseCasesPersonaTabs'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('UseCasesPersonaTabs', Component)
