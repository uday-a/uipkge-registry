import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ComplianceSanctionsScreener'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ComplianceSanctionsScreener'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ComplianceSanctionsScreener', Component)
