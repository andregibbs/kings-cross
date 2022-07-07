import '../../../bootstrap.js'

import FetchQudiniEvents from '../../../util/FetchQudiniEvents';

// using modified versions of old event scripts
import singleEvent from '../../../components/singleEventV2'

FetchQudiniEvents(FetchQudiniEvents.ALL_SERIES).then(seriesData => {
  singleEvent(seriesData)
})
