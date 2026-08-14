import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../IntegrationsDirectory'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['IntegrationsDirectory'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('IntegrationsDirectory', Component)
