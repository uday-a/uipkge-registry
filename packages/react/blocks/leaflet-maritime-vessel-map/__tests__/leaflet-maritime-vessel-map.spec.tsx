import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LeafletMaritimeVesselMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LeafletMaritimeVesselMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LeafletMaritimeVesselMap', Component)
