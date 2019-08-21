const Influx = require('influx');

class DataBuffer {
    constructor() {
        this.clear()
    }

    clear() {
        this.alpha = []
        this.beta = []
        this.gamma = []
    }

    add(event) {
        this.alpha.push(event.alpha)
        this.beta.push(event.beta)
        this.gamma.push(event.gamma)
    }

    isEmpty() {
        return this.alpha.length == 0
    }

    getMeanValues() {
        return {
            alpha: computeMean(this.alpha),
            beta: computeMean(this.beta),
            gamma: computeMean(this.gamma)
        }
    }
}

function computeMean(values) {
    return values.reduce(function(a, b) { return a + b; })
}

var dataSendInterval
var dataBuffer = new DataBuffer()

const contextInput = document.getElementById("context")
const enableSwitch = document.querySelector("#enable-switch > input")
const errorOutput = document.getElementById("error-output")

const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'training',
})

enableSwitch.onchange = function (event) {
    if (enableSwitch.checked) {
        startRecording()
    } else {
        stopRecording()
    }
}

function startRecording() {
    window.clearInterval(dataSendInterval)
    dataBuffer.clear()
    if (!registerDeviceOrientationListener()) {
        enableSwitch.checked = false
        errorOutput.innerText = "Browser not supported!"
    } else {
        dataSendInterval = window.setInterval(sendData, 1000 / 20)
        contextInput.disabled = true
    }
}

function stopRecording() {
    removeDeviceOrientationListener();
    window.clearInterval(dataSendInterval)
    sendData()
    contextInput.disabled = false
}

function handleDeviceOrientation(event) {
    if (enableSwitch.checked === true) {
        dataBuffer.add(event)
    }
}

function registerDeviceOrientationListener() {
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", handleDeviceOrientation)
        return true
    } else {
        return false
    }
}

function removeDeviceOrientationListener() {
    window.removeEventListener("deviceorientation", handleDeviceOrientation)
}

function sendData() {
    if (!dataBuffer.isEmpty()) {
        influx.writePoints([{
            measurement: "orientation",
            fields: dataBuffer.getMeanValues(),
            tags: {
                context: contextInput.value
            },
            timestamp: Date.now()
        }])
        dataBuffer.clear()
    }
}