import {InfluxDB} from "influx";
import {mean} from "mathjs"
import {DataBuffer} from "./DataBuffer";

let dataSendInterval;
const dataBuffer = new DataBuffer();

// UI Elements
const contextInput = document.getElementById("context")
const subjectInput = document.getElementById("subject")
const enableSwitch = document.querySelector("#enable-switch > input")
const errorOutput = document.getElementById("error-output")

// Connection to InfluxDB
const influx = new InfluxDB({
    host: '192.168.178.119',
    database: 'training',
})
// Check if InfluxDB is accessible
influx.ping(1000).then(hosts => {
    if (hosts.length === 0 || !hosts[0].online) {
        errorOutput.innerText += "Connection to influx db failed.\n"
    }else {
        console.log("Connected to influx db")
    }
}).catch(() => {
    errorOutput.innerText += "Connection to influx db failed.\n"
})

// Start recording with switch
enableSwitch.onchange = function () {
    if (enableSwitch.checked) {
        startRecording()
    } else {
        stopRecording()
    }
}

let startRecordingTimeout;
function startRecording() {
    // Check if subject and activity are specified
    if (contextInput.value === "") {
        alert("Please specify an activity before starting the recording.")
        enableSwitch.checked = false
    } else if (subjectInput.value === "") {
        alert("Please specify subject before starting the recording.")
        enableSwitch.checked = false
    } else {
        // Start recording with a delay of 1.5 seconds
        startRecordingTimeout = setTimeout(() => {
            dataBuffer.clear()
            // Register event listeners
            if (!registerDeviceOrientationListener()) {
                enableSwitch.checked = false
                errorOutput.innerText += "Browser not supported!\n"
            } else {
                // Setup data sending in regular intervals
                dataSendInterval = window.setInterval(sendData, 1000 / 10)
                contextInput.disabled = subjectInput.disabled = true
            }
        }, 1500);
    }
}

// Stops current recording process by clearing timeout, unregistering listeners and sending remaining data
function stopRecording() {
    clearTimeout(startRecordingTimeout)
    removeDeviceOrientationListener();
    window.clearInterval(dataSendInterval)
    sendData()
    contextInput.disabled = subjectInput.disabled = false
}

// Add device orientation events to buffer
function handleDeviceOrientation(event) {
    if (enableSwitch.checked === true) {
        dataBuffer.addOrientationEvent(event)
    }
}

// Add device motion events to buffer
function handleDeviceMotion(event) {
    if (enableSwitch.checked === true) {
        dataBuffer.addMotionEvent(event)
    }
}

// Check if browser supports motion events and register listeners
function registerDeviceOrientationListener() {
    if (window.DeviceOrientationEvent && window.DeviceMotionEvent) {
        window.addEventListener("deviceorientation", handleDeviceOrientation)
        window.addEventListener("devicemotion", handleDeviceMotion)
        return true
    } else {
        return false
    }
}

// Removes event listeners
function removeDeviceOrientationListener() {
    window.removeEventListener("deviceorientation", handleDeviceOrientation)
    window.removeEventListener("devicemotion", handleDeviceMotion)
}

// Send data in the buffer to influxDB
function sendData() {
    if (!dataBuffer.isEmpty()) {
        influx.writePoints([{
            measurement: "sensorData",
            fields: dataBuffer.reduceValues(mean), // Compute mean of values
            tags: {
                context: contextInput.value,
                subject: subjectInput.value
            },
            timestamp: Date.now()
        }])
        dataBuffer.clear()
    }
}