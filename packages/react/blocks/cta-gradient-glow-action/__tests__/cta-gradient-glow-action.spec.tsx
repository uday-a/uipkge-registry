import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CtaGradientGlowAction'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CtaGradientGlowAction'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CtaGradientGlowAction', Component)
