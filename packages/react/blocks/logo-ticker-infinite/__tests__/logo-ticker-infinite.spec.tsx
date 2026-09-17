import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../LogoTickerInfinite'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['LogoTickerInfinite'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('LogoTickerInfinite', Component)
