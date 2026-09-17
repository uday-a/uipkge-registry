import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FooterMinimalRow'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FooterMinimalRow'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FooterMinimalRow', Component)
