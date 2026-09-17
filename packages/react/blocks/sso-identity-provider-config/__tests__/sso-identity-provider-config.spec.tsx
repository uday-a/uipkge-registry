import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../SsoIdentityProviderConfig'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['SsoIdentityProviderConfig'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('SsoIdentityProviderConfig', Component)
