import {DataBuffer} from "./DataBuffer";
import {mean, min, max, std} from "mathjs"
import {RandomForestClassifier} from "./random_forest"

const dataBuffer = new DataBuffer()
const classifier = new RandomForestClassifier()
const status = document.getElementById("status")
const clock = document.getElementById("clock")

let currentContext = 0

let sittingTimer = 0
let ridingTimer = 0
let walkingTimer = 0
let working = true
let lastTime = new Date().getTime()

function classifyContext() {
    if (!dataBuffer.isEmpty()) {
        const reductionFunctions = [min, max, mean, std]
        const features = reductionFunctions.map(reductionFunc => dataBuffer.reduceValues(reductionFunc))
        dataBuffer.clear()
        const featureNames = [
            "accel_magnitude",
            "accelerationIncludingGravityX", "accelerationIncludingGravityY", "accelerationIncludingGravityZ",
            "accelerationX", "accelerationY", "accelerationZ",
            "alpha", "beta", "gamma",
            "rotationRateAlpha", "rotationRateBeta", "rotationRateGamma",
        ]
        const inputVector = []
        for (let featureName of featureNames) {
            for (let feature of features) {
                inputVector.push(feature[featureName])
            }
        }
        currentContext = classifier.predict(inputVector)
        // status.innerText = JSON.stringify(dataBuffer.buffer, null, 2)
        // console.log(currentContext)
        // return
    }
}

let vibrateInterval = null;
window.setInterval(() => {
    const currentTime = new Date().getTime()
    if (currentContext === 0) {
        status.innerText = "You are sitting "
        sittingTimer +=  currentTime - lastTime
        if (sittingTimer > 10000) {
            walkingTimer = 0
            ridingTimer = 0
        }
        // if (sittingTimer > 1000 * 60 * 30) {
        if (sittingTimer > 20000 && working) {
            if(!vibrateInterval){
                vibrateInterval = window.setInterval(() => {
                    window.navigator.vibrate(200);
                    window.document.body.style.background = "red"
                }, 2000)
            }
        }
        clock.innerText = "Timer: " + Math.floor(sittingTimer / 1000) + " seconds"
    } else if (currentContext === 1) {
        status.innerText = "You are walking "
        walkingTimer += currentTime - lastTime
        if (walkingTimer > 5000) {
            sittingTimer = 0
            ridingTimer = 0
            if(vibrateInterval) clearInterval(vibrateInterval);
            vibrateInterval = null
            navigator.vibrate(0);
            window.document.body.style.background = "white"
        }
        clock.innerText = "Timer: " + Math.floor(walkingTimer / 1000) + " seconds"
    } else {
        status.innerText = "You are riding a bike "
        ridingTimer += currentTime - lastTime
        if (ridingTimer > 1000 * 60 * 10) {
            const hours = new Date().getHours()
            working = hours > 8 && hours < 10;
        }
        clock.innerText = "Timer: " + Math.floor(ridingTimer / 1000) + " seconds"
    }
    lastTime = currentTime
}, 250)


if (window.DeviceOrientationEvent && window.DeviceMotionEvent) {
    window.addEventListener("deviceorientation", ev => dataBuffer.addOrientationEvent(ev))
    window.addEventListener("devicemotion", ev => dataBuffer.addMotionEvent(ev))
} else {
    alert("Browser not supported")
}
window.setInterval(classifyContext, 2000)