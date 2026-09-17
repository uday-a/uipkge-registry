import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CommuteReimbursementClaims'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CommuteReimbursementClaims'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CommuteReimbursementClaims', Component)
