import {DataBuffer} from "./DataBuffer";
import {mean, min, max, std} from "mathjs"
import {RandomForestClassifier} from "./random_forest"

// UI Elements
const status = document.getElementById("status")
const clock = document.getElementById("clock")

// Data buffer and classifier
const dataBuffer = new DataBuffer()
const classifier = new RandomForestClassifier()
let currentContext = 0

// Timer for each context
let sittingTimer = 0
let ridingTimer = 0
let walkingTimer = 0
let working = true
let lastTime = new Date().getTime()

// Classifies the current context using the data in the buffer
function classifyContext() {
    if (!dataBuffer.isEmpty()) {
        // Compute min, max, mean and std as features
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
        // Build feature vector
        const inputVector = []
        for (let featureName of featureNames) {
            for (let feature of features) {
                inputVector.push(feature[featureName])
            }
        }
        // Update context with new prediction
        currentContext = classifier.predict(inputVector)
    }
}

// Update loop for UI changes
let vibrateInterval = null;
window.setInterval(() => {
    const currentTime = new Date().getTime()
    if (currentContext === 0) {
        // Current context is sitting
        status.innerText = "You are sitting "
        sittingTimer +=  currentTime - lastTime
        // Reset other timers when context stays sitting for a while
        if (sittingTimer > 10000) {
            walkingTimer = 0
            ridingTimer = 0
        }
        // If user sitting for too long, enable alarm
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
        // Current context is walking
        status.innerText = "You are walking "
        walkingTimer += currentTime - lastTime
        // Disable alarm when context is walking for long enough
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
        // Current context is riding
        status.innerText = "You are riding a bike "
        ridingTimer += currentTime - lastTime
        // Set working to true if user bikes for more than 10 min and time is between 8:00 and 10:00
        if (ridingTimer > 1000 * 60 * 10) {
            const hours = new Date().getHours()
            working = hours > 8 && hours < 10;
        }
        clock.innerText = "Timer: " + Math.floor(ridingTimer / 1000) + " seconds"
    }
    lastTime = currentTime
}, 250)


// Register event listeners
if (window.DeviceOrientationEvent && window.DeviceMotionEvent) {
    window.addEventListener("deviceorientation", ev => dataBuffer.addOrientationEvent(ev))
    window.addEventListener("devicemotion", ev => dataBuffer.addMotionEvent(ev))
} else {
    alert("Browser not supported")
}
window.setInterval(classifyContext, 2000)