import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FreightQuoteCalculator'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FreightQuoteCalculator'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FreightQuoteCalculator', Component)
