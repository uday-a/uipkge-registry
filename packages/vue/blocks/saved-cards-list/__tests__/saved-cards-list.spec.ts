import { describeBlock } from '../../../test-utils/test-render'
import SavedCardsList from '../SavedCardsList.vue'

describeBlock('SavedCardsList', SavedCardsList, {
  props: {
    cards: [],
  },
})
