import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HotelBookingReservation'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HotelBookingReservation'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HotelBookingReservation', Component)
