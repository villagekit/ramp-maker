const MICROSECS_IN_SEC = 1e6

const DEFAULT_TARGET_SPEED_IN_STEPS_PER_SEC = 10
const DEFAULT_ACCELERATION_IN_STEPS_PER_SEC_PER_SEC = 1

module.exports = createStepperRamp

function createStepperRamp(options) {
  return new StepperRamp(options)
}

function StepperRamp(options = {}) {
  const {
    targetSpeedInStepsPerSec = DEFAULT_TARGET_SPEED_IN_STEPS_PER_SEC,
    accelerationInStepsPerSecPerSec = DEFAULT_ACCELERATION_IN_STEPS_PER_SEC_PER_SEC,
  } = options

  this.targetSpeedInStepsPerSec = targetSpeedInStepsPerSec
  this.accelerationInStepsPerSecPerSec = accelerationInStepsPerSecPerSec

  this.maxAccelerationDistanceInSteps = (
    Math.round(
      Math.pow(
        this.targetSpeedInStepsPerSec, 2
      )
      / (2 * this.accelerationInStepsPerSecPerSec)
    )
  )
  this.baseStepPeriodInMicrosecs = (
    Math.round(MICROSECS_IN_SEC / Math.sqrt(2 * this.accelerationInStepsPerSecPerSec))
  )
  this.targetStepPeriodInMicrosecs = (
    Math.round(MICROSECS_IN_SEC / this.targetSpeedInStepsPerSec)
  )
  this.accelerationMultiplier = (
    this.accelerationInStepsPerSecPerSec / Math.pow(MICROSECS_IN_SEC, 2)
  )
}

StepperRamp.prototype.movement = function move(steps) {
  if (steps == null || typeof steps !== 'number') {
    throw new Error("Expected steps number argument.")
  }
  
  return new StepperRampMovement(this, steps)
}

function StepperRampMovement(ramp, steps) {
  this.ramp = ramp

  this.movementStepsTotal = steps
  this.movementStepsCompleted = 0
  this.movementAccelerationSteps = Math.min(this.ramp.maxAccelerationDistanceInSteps, this.movementStepsTotal / 2)

  this.currentStatus = Status.STARTING
  this.currentStepPeriodInMicrosecs = this.ramp.baseStepPeriodInMicrosecs
}

StepperRampMovement.prototype[Symbol.iterator] = function iterator() {
  return this
}

StepperRampMovement.prototype.next = function next() {
  this.currentStatus = this.calculateStatus()

  switch (this.currentStatus) {
    case Status.STOPPED:
    case Status.COMPLETED:
      return {
        done: true,
        value: null,
      }
    case Status.STARTING:
      break
    case Status.RAMP_UP:
    case Status.MAXING:
    case Status.RAMP_DOWN:
      this.currentStepPeriodInMicrosecs = this.calculateNextStepPeriodInMicrosecs()
      break
  }

  this.movementStepsCompleted++

  return {
    done: false,
    value: Math.floor(this.currentStepPeriodInMicrosecs),
  }
}

StepperRampMovement.prototype.calculateStatus = function calculateStatus() {
  if (this.currentStatus === Status.STOPPED) {
    return Status.STOPPED
  }

  if (this.movementStepsCompleted === 0) {
    return Status.STARTING
  }

  if (this.movementStepsCompleted >= this.movementStepsTotal) {
    return Status.COMPLETED
  }

  if (this.movementStepsCompleted <= this.movementAccelerationSteps) {
    return Status.RAMP_UP;
  }

  const stepsRemaining = this.movementStepsTotal - this.movementStepsCompleted;
  if (stepsRemaining <= this.movementAccelerationSteps) {
    return Status.RAMP_DOWN;
  }

  if (this.movementStepsCompleted > this.movementAccelerationSteps) {
    return Status.MAXING;
  }

  throw new Error("Programming error: Unknown status.")
}

    // equation [23] in http://hwml.com/LeibRamp.htm
StepperRampMovement.prototype.calculateNextStepPeriodInMicrosecs = function calculateNextStepPeriodInMicrosecs() {
  if (
    this.currentStatus === Status.STARTING
    || this.currentStatus === Status.STOPPED
    || this.currentStatus === Status.COMPLETED
  ) throw new Error("Programming error: Unexpected status.")

  if (this.currentStatus === Status.MAXING) return this.ramp.targetStepPeriodInMicrosecs

  const p = this.currentStepPeriodInMicrosecs

  const m = this.currentStatus == Status.RAMP_UP
    ? -this.ramp.accelerationMultiplier
    : this.ramp.accelerationMultiplier

  const q = m * p * p
  
  const nextStepPeriodInMicrosecs = (p * (1 + q + (3 / 2) * q * q))
  
  return constrain(
    nextStepPeriodInMicrosecs,
    this.ramp.targetStepPeriodInMicrosecs,
    this.ramp.baseStepPeriodInMicrosecs
  )
}

const Status = {
  STARTING: 'STARTING',
  STOPPED: 'STOPPED',
  COMPLETED: 'COMPLETED',
  RAMP_UP: 'RAMP_UP',
  MAXING: 'MAXING',
  RAMP_DOWN: 'RAMP_DOWN',
}

function constrain(value, min, max) {
  return Math.min(Math.max(value, min), max)
}
