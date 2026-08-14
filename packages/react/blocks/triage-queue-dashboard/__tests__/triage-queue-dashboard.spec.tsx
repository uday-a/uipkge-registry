import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../TriageQueueDashboard'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['TriageQueueDashboard'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('TriageQueueDashboard', Component)
