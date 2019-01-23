var sensor_output;
var sensor_list_html;
var getSensorData;
var sensorData = {
    name: 'Sensor',
    xField: '',
    yField: '',
    zField: '',
    x: null,
    y: null,
    z: null,
    unit: '',
}

var lightSensor;
var magSensor;
var gelocationWatchId;

var camerainput;

function init() {

    sensor_list_html = document.getElementsByClassName('sensor_list_html')[0];
    sensor_output = document.getElementsByClassName('sensor_output')[0];
    getBattery();
    getLocationSensor();
    getWifiSensor();
    getCamera();
    getAccelerometerSensor();
    getMagnetSensor();
    getGyroscopSensor();
    getProximitySensor();
    getLightSensor();
    getGravtitationSensor();
    getLineareAccelerometerSensor();
    getRotationVector();

    setInterval(() => {
        getSensorData = true;

        fillSensorOutput();
    }, 200);




}

function resetAllListener() {
    if (magSensor) {
        magSensor.stop();
    }
    if (lightSensor) {
        lightSensor.stop();
    }
    navigator.geolocation.clearWatch(gelocationWatchId);
    window.removeEventListener('devicemotion', getGPSLocation, false);
    window.removeEventListener('devicemotion', getGyroscopSensorData, false);
    window.removeEventListener('devicemotion', getAccelerometerData, false);
    window.removeEventListener('devicemotion', getLineareAccelerometerData, false);
    window.removeEventListener('devicemotion', getBatteryData, false);

}
function fixTo(value, toFix) {
    if (value) {
        return value.toFixed(toFix);
    } else {
        return value;
    }
}

function getRotationVector() {
    createSensorListItem('Drehvektor', false, null);
}

function getGravtitationSensor() {
    createSensorListItem('Gravitationssensor', false, null);
}

function cameraClickListener() {
    camerainput.click();
}
function getCamera() {
    camerainput = document.getElementById("camerainput");
    createSensorListItem('Kamera', true, cameraClickListener);
};

function getLineareAccelerometerData(eventData) {
    sensorData.name = 'Linare Beschleunigung';
    sensorData.xField = 'x: ';
    sensorData.yField = 'y: ';
    sensorData.zField = 'z: ';
    sensorData.x = fixTo(eventData.acceleration.x, 2) + ' m/s2';
    sensorData.y = fixTo(eventData.acceleration.y, 2) + ' m/s2';
    sensorData.z = fixTo(eventData.acceleration.z, 2) + ' m/s2';
}

function lineareAccelerometerChange() {

    window.addEventListener('devicemotion', getLineareAccelerometerData, false);
}



function lineareAccelerometerClickListener() {
    resetAllListener();
    lineareAccelerometerChange();
}

function getLineareAccelerometerSensor() {
    if (window.DeviceMotionEvent) {

        createSensorListItem('Linare Beschleunigung', true, lineareAccelerometerClickListener.bind(this));

    } else {
        createSensorListItem('Linare Beschleunigung', false, null);
    }
}

function getBatteryData() {
    navigator.getBattery().then(data => {
        sensorData.name = 'Battery';
        sensorData.xField = 'Level: ';
        sensorData.yField = 'Charging: ';
        sensorData.zField = null;
        sensorData.x = data.level * 100 + ' %';
        sensorData.y = data.charging;
        sensorData.z = null;
    })
}
function batteryChange() {
    window.addEventListener('devicemotion', getBatteryData, false);
}

function batteryClickListener() {
    resetAllListener();
    batteryChange();
}

function getBattery() {
    if (navigator.getBattery()) {

        createSensorListItem('Battery', true, batteryClickListener.bind(this));

    } else {
        createSensorListItem('Battery', false, null);
    }
}

function getGPSLocation(position) {
    sensorData.name = 'Location';
    sensorData.xField = 'Latitude: ';
    sensorData.yField = 'Longitude: ';
    sensorData.zField = 'altitude: ';
    sensorData.x = position.coords.latitude;
    sensorData.y = position.coords.longitude;
    sensorData.z = position.coords.altitude;


}

function loactionChange() {
    var options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
    };
    gelocationWatchId = navigator.geolocation.watchPosition(getGPSLocation, null, options);

}
function loactionClickListener() {
    resetAllListener();
    loactionChange();
}

function getLocationSensor() {
    if ("geolocation" in navigator) {

        createSensorListItem('Location', true, loactionClickListener.bind(this));

    } else {
        createSensorListItem('Location', false, null);
    }
}


function getGyroscopSensorData(eventData) {
    sensorData.name = 'Gyroskop';
    sensorData.xField = 'x: ';
    sensorData.yField = 'y: ';
    sensorData.zField = 'z: ';
    sensorData.x = fixTo(eventData.rotationRate.beta, 2) + '°/s';
    sensorData.y = fixTo(eventData.rotationRate.gamma, 2) + '°/s';
    sensorData.z = fixTo(eventData.rotationRate.alpha, 2) + '°/s';
}
function gyroscopChange() {
    window.addEventListener('devicemotion', getGyroscopSensorData, false);

}

function gyroscopClickListener() {
    resetAllListener();
    gyroscopChange();
}

function getGyroscopSensor() {
    if (window.DeviceMotionEvent) {
        createSensorListItem('Gyroskop', true, gyroscopClickListener.bind(this));
    } else {
        createSensorListItem('Gyroskop', false, null);
    }
}


function lightChange(value) {
    //light level is returned in lux units
    sensorData.name = 'Licht';
    sensorData.xField = 'Lichtstärke: ';
    sensorData.yField = null;
    sensorData.zField = null;
    sensorData.x = fixTo(value, 1) + 'lux';
    sensorData.y = null;
    sensorData.z = null;

}

function lightClickListener() {

    resetAllListener();
    // Detect changes in the light
    lightSensor.onreading = () => {
        lightChange(lightSensor.illuminance);
    }

    lightSensor.start();
}

function getLightSensor() {

    //const details = document.getElementById("sensor_name");

    if (window.AmbientLightSensor) {

        lightSensor = new AmbientLightSensor({ frequency: 1 });

        createSensorListItem('Licht', true, lightClickListener.bind(this));
    } else {
        createSensorListItem('Licht', false, null);
    }
}

function magSensorChange(magSensor) {
    sensorData.name = 'Magnetometer';
    sensorData.xField = 'x: ';
    sensorData.yField = 'y: ';
    sensorData.zField = 'z: ';
    sensorData.x = fixTo(magSensor.x, 2) + 'μT';
    sensorData.y = fixTo(magSensor.y, 2) + 'μT';
    sensorData.z = fixTo(magSensor.z, 2) + 'μT';
}

function magnetometerClickListener() {
    resetAllListener();
    magSensor.onreading = () => {
        magSensorChange(magSensor);
    }

    magSensor.start();
}

function getMagnetSensor() {
    if (window.Magnetometer) {

        magSensor = new Magnetometer({ frequency: 1 });
        createSensorListItem('Magnetometer', true, magnetometerClickListener.bind(this));
    } else {
        createSensorListItem('Magnetometer', false, null);
    }
}

function getProximitySensor() {
    if ('ondeviceproximity' in window) {
        createSensorListItem('Nähe', true, lightClickListener.bind(this));
    } else {
        createSensorListItem('Nähe', false, null);
    }
}

function getWifiSensor() {
    if (navigator.connection) {
        createSensorListItem('WIFI', true, wifiClickListener.bind(this));
    } else {
        createSensorListItem('WIFI', false, null);
    }
}

function getAccelerometerData(eventData) {
    sensorData.name = 'Accelerometer';
    sensorData.xField = 'x: ';
    sensorData.yField = 'y: ';
    sensorData.zField = 'z: ';
    sensorData.x = fixTo(eventData.accelerationIncludingGravity.x, 2) + ' m/s2';
    sensorData.y = fixTo(eventData.accelerationIncludingGravity.y, 2) + ' m/s2';
    sensorData.z = fixTo(eventData.accelerationIncludingGravity.z, 2) + ' m/s2';
}
function accelerometerChange() {
    window.addEventListener('devicemotion', getAccelerometerData, false);
}

function accelerometerClickListener() {
    resetAllListener();
    accelerometerChange();
}




function wifiChange() {
    navigator.connection.onChange =
        function (connection) {
            sensorData.name = 'Netzwerk';
            sensorData.xField = 'Type: ';
            sensorData.yField = 'Downlink: ';
            sensorData.zField = 'Rtt: ';
            sensorData.x = connection.type;
            sensorData.y = connection.downlink + ' Mbps';
            sensorData.z = connection.rtt + ' ms';
        }
        ;
}
function wifiClickListener() {
    resetAllListener();
    wifiChange();
}

function getAccelerometerSensor() {
    if (window.DeviceMotionEvent) {

        createSensorListItem('Accelerometer', true, accelerometerClickListener.bind(this));

    } else {
        createSensorListItem('Accelerometer', false, null);
    }
}



function createSensorListItem(sensorName, availability, clickListener) {
    var sensor_list_element = document.createElement("div");
    sensor_list_element.classList.add('sensor_list_element');

    var sensor_list_element_name = document.createElement("div");
    sensor_list_element_name.innerText = sensorName;
    sensor_list_element_name.classList.add('sensor_list_element_name');

    var sensor_list_element_availability = document.createElement("div");
    if (availability) {
        sensor_list_element_availability.innerText = 'available'
    } else {
        sensor_list_element_availability.innerText = 'not available'
    }
    sensor_list_element_availability.classList.add('sensor_list_element_availability');

    if (clickListener) {
        sensor_list_element.addEventListener('click', clickListener, false);
    };

    sensor_list_element.appendChild(sensor_list_element_name);
    sensor_list_element.appendChild(sensor_list_element_availability);
    sensor_list_html.appendChild(sensor_list_element);

}

function fillSensorOutput() {

    var sensorName_div = document.getElementById('sensor_name');
    var xField_div = document.getElementById('x_field');
    var yField_div = document.getElementById('y_field');
    var zField_div = document.getElementById('z_field');

    var xValue_div = document.getElementById('x_value');
    var yValue_div = document.getElementById('y_value');
    var zValue_div = document.getElementById('z_value');

    sensorName_div.innerText = sensorData.name;
    xField_div.innerText = sensorData.xField;
    yField_div.innerText = sensorData.yField;
    zField_div.innerText = sensorData.zField;

    xValue_div.innerText = sensorData.x;
    yValue_div.innerText = sensorData.y;
    zValue_div.innerText = sensorData.z;

    if (sensorData.xValue == null) {
        xField_div.style.visibility = false;
        xValue_div.style.visibility = false;
    }
    if (sensorData.yValue == null) {
        yField_div.style.visibility = false;
        yValue_div.style.visibility = false;
    }
    if (sensorData.zValue == null) {
        zValue_div.style.visibility = false;
        zValue_div.style.visibility = false;
    }


}



