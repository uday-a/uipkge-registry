import { describeBlock } from '../../../test-utils/test-render'
import * as BlockModule from '../EventList'

const Component =
  (BlockModule as any).default || (BlockModule as any)['EventList'] || (BlockModule as any)[Object.keys(BlockModule)[0]]

describeBlock('EventList', Component, {
  props: {
    events: [{ id: '1', title: 'Event 1', date: 'Today' }],
  },
})
