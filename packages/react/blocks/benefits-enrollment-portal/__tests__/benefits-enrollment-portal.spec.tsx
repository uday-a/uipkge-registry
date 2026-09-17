import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../BenefitsEnrollmentPortal'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['BenefitsEnrollmentPortal'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('BenefitsEnrollmentPortal', Component)
