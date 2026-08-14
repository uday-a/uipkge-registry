import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LeafletFleetVehicleMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LeafletFleetVehicleMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LeafletFleetVehicleMap', Component)
