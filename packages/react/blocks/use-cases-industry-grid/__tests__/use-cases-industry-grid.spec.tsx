import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../UseCasesIndustryGrid'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['UseCasesIndustryGrid'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('UseCasesIndustryGrid', Component)
