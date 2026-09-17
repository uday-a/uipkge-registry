import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../DoctorAppointmentScheduler'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['DoctorAppointmentScheduler'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('DoctorAppointmentScheduler', Component)
