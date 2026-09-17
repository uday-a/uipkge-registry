import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../IntegrationsFeaturedPairs'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['IntegrationsFeaturedPairs'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('IntegrationsFeaturedPairs', Component)
