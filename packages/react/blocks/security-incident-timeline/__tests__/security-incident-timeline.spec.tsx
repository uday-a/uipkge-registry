import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SecurityIncidentTimeline'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SecurityIncidentTimeline'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SecurityIncidentTimeline', Component)
