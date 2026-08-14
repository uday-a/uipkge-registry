import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FlightRadarMap'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FlightRadarMap'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FlightRadarMap', Component)
