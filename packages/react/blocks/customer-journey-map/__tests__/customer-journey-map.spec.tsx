import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CustomerJourneyMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CustomerJourneyMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CustomerJourneyMap', Component)
