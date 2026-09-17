import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../IntegrationsHubDiagram'

const Component =
  (BlockModule as any).default ||
  (BlockModule as any)['IntegrationsHubDiagram'] ||
  (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('IntegrationsHubDiagram', Component)
