import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CookieConsentBar'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CookieConsentBar'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CookieConsentBar', Component)
