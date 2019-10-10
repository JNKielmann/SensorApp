import {DataBuffer} from "./DataBuffer";
import {mean, min, max, std} from "mathjs"
import {RandomForestClassifier} from "./random_forest"

const dataBuffer = new DataBuffer()
const classifier = new RandomForestClassifier()
const status = document.getElementById("status")

let currentContext = 0

function classifyContext() {
    if (!dataBuffer.isEmpty()) {
        const reductionFunctions = [min, max, mean, std]
        const features = reductionFunctions.map(reductionFunc => dataBuffer.reduceValues(reductionFunc))
        dataBuffer.clear()
        const featureNames = [
            "accel_magnitude",
            "accelerationIncludingGravityX","accelerationIncludingGravityY","accelerationIncludingGravityZ",
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
        if(currentContext === 0){
            status.innerText = "You are sitting "
            document.body.style.background = "red";
        }else if(currentContext === 1){
            status.innerText = "You are walking "
            document.body.style.background = "blue";
        }else {
            status.innerText = "You are riding a bike " + currentContext
            document.body.style.background = "green";
        }
    }
}


if (window.DeviceOrientationEvent && window.DeviceMotionEvent) {
    window.addEventListener("deviceorientation", ev => dataBuffer.addOrientationEvent(ev))
    window.addEventListener("devicemotion", ev => dataBuffer.addMotionEvent(ev))
}else {
    alert("Browser not supported")
}
window.setInterval(classifyContext, 500)