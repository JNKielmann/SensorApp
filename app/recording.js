import {InfluxDB} from "influx";
import {mean} from "mathjs"
import {DataBuffer} from "./DataBuffer";

let dataSendInterval;
const dataBuffer = new DataBuffer();

const contextInput = document.getElementById("context")
const subjectInput = document.getElementById("subject")
const enableSwitch = document.querySelector("#enable-switch > input")
const errorOutput = document.getElementById("error-output")

const influx = new InfluxDB({
    host: '192.168.178.119',
    database: 'training',
})
influx.ping(1000).then(hosts => {
    if (hosts.length === 0 || !hosts[0].online) {
        errorOutput.innerText += "Connection to influx db failed.\n"
    }else {
        console.log("Connected to influx db")
    }
}).catch(() => {
    errorOutput.innerText += "Connection to influx db failed.\n"
})

enableSwitch.onchange = function () {
    if (enableSwitch.checked) {
        startRecording()
    } else {
        stopRecording()
    }
}

let startRecordingTimeout;
function startRecording() {
    if (contextInput.value === "") {
        alert("Please specify an activity before starting the recording.")
        enableSwitch.checked = false
    } else if (subjectInput.value === "") {
        alert("Please specify subject before starting the recording.")
        enableSwitch.checked = false
    } else {
        startRecordingTimeout = setTimeout(() => {
            dataBuffer.clear()
            if (!registerDeviceOrientationListener()) {
                enableSwitch.checked = false
                errorOutput.innerText += "Browser not supported!\n"
            } else {
                dataSendInterval = window.setInterval(sendData, 1000 / 10)
                contextInput.disabled = subjectInput.disabled = true
            }
        }, 1500);
    }
}

function stopRecording() {
    clearTimeout(startRecordingTimeout)
    removeDeviceOrientationListener();
    window.clearInterval(dataSendInterval)
    sendData()
    contextInput.disabled = subjectInput.disabled = false
}

function handleDeviceOrientation(event) {
    if (enableSwitch.checked === true) {
        dataBuffer.addOrientationEvent(event)
    }
}

function handleDeviceMotion(event) {
    if (enableSwitch.checked === true) {
        dataBuffer.addMotionEvent(event)
    }
}

function registerDeviceOrientationListener() {
    if (window.DeviceOrientationEvent && window.DeviceMotionEvent) {
        window.addEventListener("deviceorientation", handleDeviceOrientation)
        window.addEventListener("devicemotion", handleDeviceMotion)
        return true
    } else {
        return false
    }
}

function removeDeviceOrientationListener() {
    window.removeEventListener("deviceorientation", handleDeviceOrientation)
    window.removeEventListener("devicemotion", handleDeviceMotion)
}

function sendData() {
    if (!dataBuffer.isEmpty()) {
        influx.writePoints([{
            measurement: "sensorData",
            fields: dataBuffer.reduceValues(mean),
            tags: {
                context: contextInput.value,
                subject: subjectInput.value
            },
            timestamp: Date.now()
        }])
        dataBuffer.clear()
    }
}