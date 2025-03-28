export { ChainifyPredicate } from './utils/predicate.js'
export { ChainifyStep, ChainifyStepType } from './utils/step.js'

import every from './every.js'
import map from './map.js'
import some from './some.js'

/** A set of utilities for building chains of responsibility and decorator-style sequences. */
const Chainify = { every, map, some }

export default Chainify
