import ROSLIB from 'roslib';
import ros from './index';

// GPS Topic
const boatGPSTopic = new ROSLIB.Topic({
    ros,
    name: '/gps',
    messageType: 'sensor_msgs/NavSatFix',
});

export function publishGPS(latitude: number, longitude: number) {
    const msg = new ROSLIB.Message({
        latitude,
        longitude,
    });
    boatGPSTopic.publish(msg);
}

// IMU Topic
const boatIMUTopic = new ROSLIB.Topic({
    ros,
    name: '/imu',
    messageType: 'geometry_msgs/Vector3',
});

export function publishIMU(x: number, y: number, z: number) {
    // z is yaw
    const msg = new ROSLIB.Message({ x, y, z });
    boatIMUTopic.publish(msg);
}

// Wind Topic
const boatWindTopic = new ROSLIB.Topic({
    ros,
    name: '/sailbot/wind',
    messageType: 'std_msgs/Int32',
});

export function publishWind(value: number) {
    const msg = new ROSLIB.Message({ data: value });
    boatWindTopic.publish(msg);
}

// Waypoint Service
const waypointService = new ROSLIB.Service({
    ros,
    name: '/sailbot/mutate_waypoint_queue',
    serviceType: 'sailboat_interface/srv/Waypoint',
});
// Add waypoint to queue
export function setWaypointQueue(waypoints: Array<{ latitude: number; longitude: number }>) {
    const waypointsString = waypoints
        .map(waypoint => `${waypoint.latitude},${waypoint.longitude}`)
        .join(';');

    const request = new ROSLIB.ServiceRequest({
        command: "set",
        argument: waypointsString
    });

    waypointService.callService(request, function (result) {
        if (result.success) {
            console.log(result.message);
        } else {
            console.error(result.message);
        }
    });
}