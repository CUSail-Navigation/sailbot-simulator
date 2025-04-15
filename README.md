# Sailbot Simulator

This simulator is a web-app designed to visualize the behavior of our sailboat. It allows developers to test and visualize our navigation algorithms in a controlled environment with simulated sensor inputs.

There is no underlying physics engine. All simulation requires manually adjusting sensor state. 

## Prerequisites

- Be sure you have [Node.js](https://nodejs.org/) installed (v20.11.1 is what I use, other versions are probably OK but untested) 
- The ```ros2_humble_custom``` docker image is built. (see step 2 of [ROS setup](https://cusail-navigation.github.io/intrasite/ros/rossetup.html))

## Frontend Setup

1. Navigate to the sailbot-simulator project directory
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the local development server

## Sailboat Code Setup

1. Navigate to the root of the sailbot directory. 
2. On windows, start the docker image with ```docker run -it --rm -p 9089:7000 -p 9090:9090 --name ros2_container -v ${PWD}/src:/home/ros2_user/ros2_ws/src ros2_humble_custom``` (check [ROS setup](https://cusail-navigation.github.io/intrasite/ros/rossetup.html) for your OS-specific command)
3. Run `ros2 launch sailboat_launch sailboat_algo_sim.launch.py`


