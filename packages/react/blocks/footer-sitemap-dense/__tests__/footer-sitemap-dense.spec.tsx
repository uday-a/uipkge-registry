import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FooterSitemapDense'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FooterSitemapDense'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FooterSitemapDense', Component)
