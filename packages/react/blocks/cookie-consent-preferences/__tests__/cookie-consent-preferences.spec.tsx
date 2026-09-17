import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CookieConsentPreferences'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CookieConsentPreferences'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CookieConsentPreferences', Component)
