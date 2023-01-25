# Step by Step Demonstration: 

## Building your Digital Twin with MongoDB and AWS: Telemetry Feedback Loop Use Case 

Now that we’ve set up data management in the vehicle, the cloud, and how to sync those worlds, let’s bring it all together with an example use case and architecture demonstrating how vehicle battery telemetry can be collected within the vehicle, moved to the cloud backend for inference and how the result is then shared with the driver, owner and workshop people in real time.

(If you're interested in watching the video format of this, feel free to click [here](https://youtu.be/8SztdPe6wJA).) 

![image](https://user-images.githubusercontent.com/114057324/199659004-49177737-3e80-4656-9a5b-e219dbedc296.png) 



The demo environment consists of a vehicle simulator written in TypeScript which uses the Realm JavaScript SDK to sync via device sync with the mobile device and the MongoDB Atlas backend. We've also added a workflow to process telemetry information retrieved from the vehicle into MongoDB Atlas and sent via database triggers, change streams, and Event Bridge into Sagemaker for analysis. Once that telemetry information has been analyzed, the result is written back into MongoDB and shared across the different devices and the mobile device more or less in real time.

Add figure?

1. MongoDB Atlas 

In the MongoDB Atlas Cloud dashboard we can see 3 collections: Vehicle information, Sensor, Components.

Run npm start to start the vehicle

2. Web UI and Mobile app 

## Turning engine on/off
To illustratate how fast data is synchronized between the vehicle model and the mobile app you can for example turn on the engine, by clicking on the toggle button on your app and see how the engine gif starts moving indicated the negine has been turned on. 

## Adding components
To further explain a little bit of the data modeling, I’ve also added a functionality to create related components. For example, we can add a component by tippibg in in the web UI and you see that information (that object) which is created for the spoiler is immediately synchronized with the mobile device as well. 

## Telemetry information
We can then synchronize Telemetry information, you see the vehicle is updated to the same information is shared with the mobile app as well. 

## Status alerts
