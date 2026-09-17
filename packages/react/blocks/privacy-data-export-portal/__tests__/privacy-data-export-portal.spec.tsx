import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../PrivacyDataExportPortal'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['PrivacyDataExportPortal'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('PrivacyDataExportPortal', Component)
