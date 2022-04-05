const test = require('tape')

const createRamp = require('../')

test('initial calculations', (t) => {
  const ramp = createRamp({
    targetSpeedInStepsPerSec: 50,
    accelerationInStepsPerSecPerSec: 50,
  })

  t.isEqual(ramp.maxAccelerationDistanceInSteps, 25)
  t.isEqual(ramp.baseStepPeriodInMicrosecs, 100000)
  t.isEqual(ramp.targetStepPeriodInMicrosecs, 20000)
  t.isEqual(ramp.accelerationMultiplier, 5e-11)

  t.end()
})

test('movement', (t) => {
  const ramp = createRamp({
    targetSpeedInStepsPerSec: 50,
    accelerationInStepsPerSecPerSec: 50,
  })

  const movement = ramp.movement(100)

  const stepPeriodsInMicrosecs = Array.from(movement)

  t.deepEqual(stepPeriodsInMicrosecs, [
    100000,
    87500,
    73237,
    61497,
    53167,
    47245,
    42855,
    39462,
    36748,
    34518,
    32645,
    31045,
    29657,
    28439,
    27358,
    26392,
    25521,
    24730,
    24009,
    23346,
    22736,
    22171,
    21646,
    21157,
    20699,
    20270,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20000,
    20412,
    20850,
    21318,
    21819,
    22357,
    22937,
    23564,
    24245,
    24989,
    25806,
    26709,
    27712,
    28838,
    30112,
    31570,
    33260,
    35253,
    37648,
    40599,
    44359,
    49368,
    56484,
    67651,
    88445,
    100000
  ])

  t.end()
})
