import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FineTuningJobMonitor'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FineTuningJobMonitor'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FineTuningJobMonitor', Component)
