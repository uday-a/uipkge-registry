import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../UserProfilePage'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['UserProfilePage'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('UserProfilePage', Component)
