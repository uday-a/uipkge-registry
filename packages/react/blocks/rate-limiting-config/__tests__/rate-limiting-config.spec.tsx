import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../RateLimitingConfig'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['RateLimitingConfig'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('RateLimitingConfig', Component)
