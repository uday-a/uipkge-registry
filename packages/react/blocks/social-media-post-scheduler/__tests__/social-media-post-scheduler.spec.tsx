import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SocialMediaPostScheduler'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SocialMediaPostScheduler'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SocialMediaPostScheduler', Component)
