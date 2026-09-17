import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FooterDeveloperDenseGrid'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FooterDeveloperDenseGrid'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FooterDeveloperDenseGrid', Component)
