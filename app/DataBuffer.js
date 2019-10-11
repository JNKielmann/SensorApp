import {square, sqrt} from "mathjs"

// Buffer that contains the last sensor values.
// Provides a way to reduce them to a single value.
export class DataBuffer {
    constructor() {
        // Set initial values
        this.lastValues = {
            alpha: 0,
            beta: 0,
            gamma: 0,
            accelerationX: 0,
            accelerationY: 0,
            accelerationZ: 0,
            accel_magnitude: 0,
            accelerationIncludingGravityX: 0,
            accelerationIncludingGravityY: 0,
            accelerationIncludingGravityZ: 0,
            rotationRateAlpha: 0,
            rotationRateBeta: 0,
            rotationRateGamma: 0,
        }
        this.clear()
    }

    clear() {
        this.buffer = []
    }

    addOrientationEvent(event) {
        // Add new orientation data
        this.lastValues = {
            ...this.lastValues,
            alpha: event.alpha,
            beta: event.beta,
            gamma: event.gamma
        }
        this.buffer.push(this.lastValues)
    }

    addMotionEvent(event) {
        // Add new acceleration data
        if (event.acceleration.x != null) {
            this.lastValues = {
                ...this.lastValues,
                accelerationX: event.acceleration.x,
                accelerationY: event.acceleration.y,
                accelerationZ: event.acceleration.z,
                accelerationIncludingGravityX: event.accelerationIncludingGravity.x,
                accelerationIncludingGravityY: event.accelerationIncludingGravity.y,
                accelerationIncludingGravityZ: event.accelerationIncludingGravity.z,
                accel_magnitude: sqrt(
                    square(event.acceleration.x) +
                    square(event.acceleration.y) +
                    square(event.acceleration.z)),
                rotationRateAlpha: event.rotationRate.alpha,
                rotationRateBeta: event.rotationRate.beta,
                rotationRateGamma: event.rotationRate.gamma,
            }
            this.buffer.push(this.lastValues)
        }
    }

    isEmpty() {
        return this.buffer.length === 0
    }

    reduceValues(reductionFunc) {
        // Take reduction function an apply it so each series of sensor data
        let meanValues = {}
        for (let key of Object.keys(this.lastValues)) {
            meanValues[key] = reductionFunc(this.buffer.map(obj => obj[key]))
        }
        return meanValues
    }
}
