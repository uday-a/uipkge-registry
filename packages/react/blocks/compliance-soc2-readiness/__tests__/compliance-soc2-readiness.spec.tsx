import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ComplianceSoc2Readiness'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ComplianceSoc2Readiness'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ComplianceSoc2Readiness', Component)
