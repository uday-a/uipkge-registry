import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../VitalsTrackerChart'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['VitalsTrackerChart'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('VitalsTrackerChart', Component)
