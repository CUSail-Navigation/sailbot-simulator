import ROSLIB from 'roslib';
import { publishGPS, publishIMU, publishWind } from './publishers';
import { useBoatStore } from '../state/useBoatStore';

const ros = new ROSLIB.Ros();
let reconnectInterval: NodeJS.Timeout | null = null;
let isConnecting = false;

function connectToROS() {
    if (ros.isConnected || isConnecting) {
        return; // 🚫 Don't connect if already connected or trying
    }

    isConnecting = true;
    console.log('🌐 Connecting to rosbridge...');
    ros.connect('ws://localhost:9090');
}

ros.on('connection', () => {
    console.log('✅ Connected to rosbridge');
    useBoatStore.getState().setRosConnected(true);
    isConnecting = false;

    if (reconnectInterval) {
        clearInterval(reconnectInterval);
        reconnectInterval = null;
    }
});

ros.on('close', () => {
    console.warn('🔌 Disconnected from rosbridge');
    useBoatStore.getState().setRosConnected(false);
    isConnecting = false;

    if (!reconnectInterval) {
        reconnectInterval = setInterval(() => {
            connectToROS();
        }, 3000);
    }
});

ros.on('error', (err) => {
    console.error('❌ ROS connection error:', err);
    isConnecting = false;
});

connectToROS(); // 👈 Only called once when this module is first loaded

export default ros;
