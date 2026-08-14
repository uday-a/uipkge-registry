import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CronJobScheduler'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CronJobScheduler'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CronJobScheduler', Component)
