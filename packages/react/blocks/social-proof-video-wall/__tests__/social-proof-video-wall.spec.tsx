import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SocialProofVideoWall'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SocialProofVideoWall'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SocialProofVideoWall', Component)
