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
    console.log(window);

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

function lineareAccelerometerChange() {
    //console.log("getAccelerometerSensor");

    window.addEventListener('devicemotion', function (eventData) {
        // Acceleration
        sensorData.name = 'Linare Beschleunigung';
        sensorData.xField = 'x: ';
        sensorData.yField = 'y: ';
        sensorData.zField = 'z: ';
        sensorData.x = eventData.acceleration.x.toFixed(2) + ' m/s2';
        sensorData.y = eventData.acceleration.y.toFixed(2) + ' m/s2';
        sensorData.z = eventData.acceleration.z.toFixed(2) + ' m/s2';
    }, false);
}



function lineareAccelerometerClickListener() {
    navigator.geolocation.clearWatch(gelocationWatchId);
    if (lightSensor)
        lightSensor.stop();;
    window.removeEventListener('devicemotion', getGPSLocation, false);
    window.removeEventListener('devicemotion', getGyroscopSensorData, false);

    lineareAccelerometerChange();
}

function getLineareAccelerometerSensor() {
    if (window.DeviceMotionEvent) {

        createSensorListItem('Linare Beschleunigung', true, lineareAccelerometerClickListener.bind(this));

    } else {
        createSensorListItem('Linare Beschleunigung', false, null);
    }
}

function batteryChange() {


    window.addEventListener('devicemotion',
        function () {
            navigator.getBattery().then(data => {
                console.log(data);
                sensorData.name = 'Battery';
                sensorData.xField = 'Level: ';
                sensorData.yField = 'Charging: ';
                sensorData.zField = null;
                sensorData.x = data.level * 100 + ' %';
                sensorData.y = data.charging;
                sensorData.z = null;
            })
        }, false);
}

function batteryClickListener() {
    navigator.geolocation.clearWatch(gelocationWatchId);
    if (lightSensor)
        lightSensor.stop();;
    window.removeEventListener('devicemotion', getGPSLocation, false);
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
    console.log(position);
    sensorData.name = 'Location';
    sensorData.xField = 'Latitude: ';
    sensorData.yField = 'Longitude: ';
    sensorData.zField = 'altitude: ';
    sensorData.x = position.coords.latitude;
    sensorData.y = position.coords.longitude;
    sensorData.z = position.coords.altitude;


}

function loactionChange() {
    // TODO umschrieben auf seperaten timer 
    window.addEventListener('devicemotion', getGPSLocation, false);
    var options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
    };
    gelocationWatchId = navigator.geolocation.watchPosition(getGPSLocation, null, options);

}
function loactionClickListener() {
    navigator.geolocation.clearWatch(gelocationWatchId);
    if (lightSensor)
        lightSensor.stop();;
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
    console.log(eventData);
    sensorData.name = 'Gyroskop';
    sensorData.xField = 'x: ';
    sensorData.yField = 'y: ';
    sensorData.zField = 'z: ';
    sensorData.x = eventData.rotationRate.beta.toFixed(2) + ' rad/s';;
    sensorData.y = eventData.rotationRate.gamma.toFixed(2) + ' rad/s';;
    sensorData.z = eventData.rotationRate.alpha.toFixed(2) + ' rad/s';;
}
function gyroscopChange() {
    navigator.geolocation.clearWatch(gelocationWatchId);
    window.addEventListener('devicemotion', getGyroscopSensorData, false);
}

function gyroscopClickListener() {
    if (lightSensor)
        lightSensor.stop();;
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
    sensorData.x = value + 'lux';
    sensorData.y = null;
    sensorData.z = null;

}

function lightClickListener() {

    navigator.geolocation.clearWatch(gelocationWatchId);

    if (lightSensor)
        lightSensor.stop();;
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
    sensorData.x = magSensor.x;
    sensorData.y = magSensor.y;
    sensorData.z = magSensor.z;
}

function magnetometerClickListener() {
    navigator.geolocation.clearWatch(gelocationWatchId);

    //if (magSensor)
      //  magSensor.stop();

    magSensor.onreading = () => {
        magSensorChange(magSensor);
    }

    magSensor.start();
}

function getMagnetSensor() {
    if (window.Magnetometer) {

        magSensor = new Magnetometer({ frequency: 1 });
        createSensorListItem('Magnetometera', true, magnetometerClickListener.bind(this));
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


function accelerometerChange() {
    window.addEventListener('devicemotion',
        function (eventData) {
            sensorData.name = 'Accelerometer';
            sensorData.xField = 'x: ';
            sensorData.yField = 'y: ';
            sensorData.zField = 'z: ';
            sensorData.x = eventData.accelerationIncludingGravity.x.toFixed(2) + ' m/s2';
            sensorData.y = eventData.accelerationIncludingGravity.y.toFixed(2) + ' m/s2';
            sensorData.z = eventData.accelerationIncludingGravity.z.toFixed(2) + ' m/s2';
        }, false);
}

function accelerometerClickListener() {
    navigator.geolocation.clearWatch(gelocationWatchId);
    if (lightSensor)
        lightSensor.stop();;
    window.removeEventListener('devicemotion', getGPSLocation, false);
    window.removeEventListener('devicemotion', getGyroscopSensorData, false);

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
    navigator.geolocation.clearWatch(gelocationWatchId);
    if (lightSensor)
        lightSensor.stop();;
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



