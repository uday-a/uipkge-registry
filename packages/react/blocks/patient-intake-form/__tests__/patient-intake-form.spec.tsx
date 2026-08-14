import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PatientIntakeForm'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PatientIntakeForm'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PatientIntakeForm', Component)
