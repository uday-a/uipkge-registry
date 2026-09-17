import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../AnalyticsOverview'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['AnalyticsOverview'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('AnalyticsOverview', Component)
