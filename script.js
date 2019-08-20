var enableSwitch = document.querySelector("#enable-switch > input")
function handleDeviceOrientation(event){
    if(enableSwitch.checked === true){
        console.log(event)
    }
}

if(window.DeviceOrientationEvent){
    window.addEventListener("deviceorientation", handleDeviceOrientation)
}else {
    document.getElementById("error-output").innerText = "Browser not supported!"
}