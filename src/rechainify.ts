export type {
  RechainifyFn,
  RechainifyFactoryFn,
  RechainifyTupleStep,
  RechainifyTupleSteps,
  RechainifyRecordSteps,
  RechainifySteps,
  RechainifyHandler,
} from './handler.ts'

import every from './every.ts'
import map from './map.ts'
import some from './some.ts'

const Rechainify = { every, map, some }

export default Rechainify
