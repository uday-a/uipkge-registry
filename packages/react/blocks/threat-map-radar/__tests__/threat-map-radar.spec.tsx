import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ThreatMapRadar'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ThreatMapRadar'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ThreatMapRadar', Component)
