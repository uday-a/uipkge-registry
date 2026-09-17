import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PackingSlipGenerator'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PackingSlipGenerator'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PackingSlipGenerator', Component)
