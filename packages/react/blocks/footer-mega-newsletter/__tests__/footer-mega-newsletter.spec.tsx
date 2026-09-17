import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../FooterMegaNewsletter'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['FooterMegaNewsletter'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('FooterMegaNewsletter', Component)
