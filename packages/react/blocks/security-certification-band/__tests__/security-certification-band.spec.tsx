import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SecurityCertificationBand'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SecurityCertificationBand'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SecurityCertificationBand', Component)
