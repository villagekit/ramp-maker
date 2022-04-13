# `@villagekit/stepper-ramp`

## install

```shell
npm install @villagekit/stepper-ramp
```

## example

```js
const ramp = createRamp({
  targetSpeedInStepsPerSec: 50,
  accelerationInStepsPerSecPerSec: 50,
})

const movement = ramp.movement(100)

const stepPeriodsInMicrosecs = Array.from(movement)

console.log(stepPeriodsInMicrosecs)
```

## `stepperRamp = createStepperRamp(options)`

`options` is an object with shape:

- `targetSpeedInStepsPerSec`: max speed in (steps / second)
- `accelerationInStepsPerSecPerSec`: acceleration in (steps / second^2)

## `stepPeriods = stepperRamp.movement(steps)`

`steps` is a number.

`stepPeriods` is an `Iterable` of step periods in microsecs.
