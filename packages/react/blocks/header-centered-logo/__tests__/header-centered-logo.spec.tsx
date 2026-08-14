import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../HeaderCenteredLogo'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['HeaderCenteredLogo'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('HeaderCenteredLogo', Component)
