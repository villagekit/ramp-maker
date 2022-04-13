# stepper-ramp 📈📉

Stepper motor acceleration ramp generator 

## install

with `npm`:

```shell
npm install @villagekit/stepper-ramp
```

## example

```js
const createRamp = require('@villagekit/stepper-ramp')

const ramp = createRamp({
  targetSpeedInStepsPerSec: 50,
  accelerationInStepsPerSecPerSec: 50,
})

const movement = ramp.movement(100)

const stepPeriodsInMicrosecs = Array.from(movement)

console.log(stepPeriodsInMicrosecs)
```

## api

### `createRamp = require('@villagekit/stepper-ramp')`

### `ramp = createRamp(options)`

`options` is an object with shape:

- `targetSpeedInStepsPerSec`: max speed in (steps / second)
- `accelerationInStepsPerSecPerSec`: acceleration in (steps / second^2)

### `stepPeriods = ramp.movement(steps)`

`steps` is a number.

`stepIterable` is an [`Iterable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol) of step periods in microsecs. to convert the `Iterable` to an array, use [`Array.from`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from).

## license

The Apache License

Copyright &copy; 2022 Michael Williams

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
