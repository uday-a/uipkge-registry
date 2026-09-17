import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../ReferralProgramWidget'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['ReferralProgramWidget'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('ReferralProgramWidget', Component)
