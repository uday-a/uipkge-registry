import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FleetVehicleMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FleetVehicleMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FleetVehicleMap', Component)
