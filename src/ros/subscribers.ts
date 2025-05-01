import ROSLIB from 'roslib';
import ros from './index';
import { useBoatStore } from '../state/useBoatStore';
import { useWaypointStore } from '../state/useWaypointStore';
import { useAlgoStore } from '../state/useAlgoStore';
import { setWaypointQueue } from './publishers';


export function startROSSubscriptions() {
    const rudderTopic = new ROSLIB.Topic({
        ros,
        name: 'sailbot/rudder_angle',
        messageType: 'std_msgs/Int32',
    });

    rudderTopic.subscribe((msg) => {
        useBoatStore.getState().setRudderAngle(msg.data);
    });

    const sailTopic = new ROSLIB.Topic({
        ros,
        name: 'sailbot/sail', // TODO: find the right sail topic
        messageType: 'std_msgs/Int32',
    });

    sailTopic.subscribe((msg) => {
        console.log(msg.data);
        useBoatStore.getState().setSailAngle(msg.data);
    });

    const algoDebugTopic = new ROSLIB.Topic({
        ros,
        name: 'sailbot/main_algo_debug',
        messageType: 'sailboat_interface/msg/AlgoDebug',
    });

    algoDebugTopic.subscribe((msg) => {
        useAlgoStore.getState().setTacking(msg.tacking);
        useAlgoStore.getState().setTackingPoint(msg.tacking_point);
        useAlgoStore.getState().setHeadingDir(msg.heading_dir);
        useAlgoStore.getState().setCurrDest(msg.curr_dest);
        useAlgoStore.getState().setDiff(msg.diff);
        useAlgoStore.getState().setDistDiff(msg.dist_to_dest);
    });

    const current_waypoint = new ROSLIB.Topic({
        ros,
        name: 'sailbot/current_waypoint',
        messageType: 'sensor_msgs/NavSatFix',
    });

    current_waypoint.subscribe((msg) => {
        getWaypointQueue();
    })
}

// Add waypoint to queue
export function getWaypointQueue() {

    // Waypoint Service
    const waypointService = new ROSLIB.Service({
        ros,
        name: '/sailbot/mutate_waypoint_queue',
        serviceType: 'sailboat_interface/srv/Waypoint',
    });

    const request = new ROSLIB.ServiceRequest({
        command: "get",
        argument: ""
    });

    waypointService.callService(request, function (result) {
        if (result.success) {
            // get rid of '[]()' in the string
            result.message = result.message.replace(/[\[\]\(\)]/g, '');
            // Assuming result.message is a string like:
            // "46.50056625,-76.50024511363637,46.50050125,-76.5001578409091"
            const waypoints = result.message.split(',').map((_, index, array) => {
                if (index % 2 === 0 && array[index + 1] !== undefined) {
                    return { latitude: parseFloat(array[index]), longitude: parseFloat(array[index + 1]) };
                }
            })

            // Remove all undefined values from the waypoints array
            const filteredWaypoints = waypoints.filter((waypoint) => waypoint !== undefined);
            useWaypointStore.getState().setWaypoints(filteredWaypoints); // Set the waypoints in the store
        }
    });
}
