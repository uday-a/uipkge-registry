import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../CodeTabsMultiLanguage'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['CodeTabsMultiLanguage'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('CodeTabsMultiLanguage', Component)
