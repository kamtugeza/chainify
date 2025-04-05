export { RechainifyPredicate as RechainifyPredicate } from './utils/predicate.js'

import every from './every.js'
import map from './map.js'
import some from './some.js'

/** A set of utilities for building chains of responsibility and decorator-style sequences. */
const Rechainify = { every, map, some }

export default Rechainify
