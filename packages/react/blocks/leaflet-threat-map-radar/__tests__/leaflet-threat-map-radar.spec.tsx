import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LeafletThreatMapRadar'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LeafletThreatMapRadar'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LeafletThreatMapRadar', Component)
