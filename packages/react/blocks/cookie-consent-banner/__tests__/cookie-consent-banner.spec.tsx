import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CookieConsentBanner'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CookieConsentBanner'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CookieConsentBanner', Component)
