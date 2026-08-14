import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PrescriptionRefillManager'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PrescriptionRefillManager'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PrescriptionRefillManager', Component)
