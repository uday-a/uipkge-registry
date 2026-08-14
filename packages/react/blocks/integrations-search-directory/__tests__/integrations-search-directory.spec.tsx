import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../IntegrationsSearchDirectory'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['IntegrationsSearchDirectory'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('IntegrationsSearchDirectory', Component)
