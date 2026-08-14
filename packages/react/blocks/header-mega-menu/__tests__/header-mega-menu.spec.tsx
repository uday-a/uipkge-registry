import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HeaderMegaMenu'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HeaderMegaMenu'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HeaderMegaMenu', Component)
