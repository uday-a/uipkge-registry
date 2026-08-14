import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PatientMedicalRecord'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PatientMedicalRecord'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PatientMedicalRecord', Component)
