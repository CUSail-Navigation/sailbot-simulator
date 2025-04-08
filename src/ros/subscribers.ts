import ROSLIB from 'roslib';
import ros from './index';
import { useBoatStore } from '../state/useBoatStore';
import { useAlgoStore } from '../state/useAlgoStore';


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
    });
}