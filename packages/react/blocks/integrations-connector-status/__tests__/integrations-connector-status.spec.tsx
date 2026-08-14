import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../IntegrationsConnectorStatus'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['IntegrationsConnectorStatus'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('IntegrationsConnectorStatus', Component)
