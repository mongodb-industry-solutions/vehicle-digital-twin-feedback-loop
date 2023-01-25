# Step by Step Demonstration: 

## Building your Digital Twin with MongoDB and AWS: Telemetry Feedback Loop Use Case 

Now that we’ve set up data management in the vehicle, the cloud, and how to sync those worlds, let’s bring it all together with an example use case and architecture demonstrating how vehicle battery telemetry can be collected within the vehicle, moved to the cloud backend for inference and how the result is then shared with the driver, owner and workshop people in real time.

(If you're interested in watching the video format of this, feel free to click [here](https://youtu.be/8SztdPe6wJA).) 

![image](https://user-images.githubusercontent.com/114057324/199659004-49177737-3e80-4656-9a5b-e219dbedc296.png) 

*Quick Take* 

Looking at the architecture above, the demo setup includes a vehicle simulator built in TypeScript, which connects to a mobile device and a MongoDB Atlas backend using the Realm JavaScript SDK. The telemetry data collected from the vehicle is stored in MongoDB Atlas and sent to Amazon SageMaker for analysis through database triggers, and Event Bridge. The analyzed results are then returned to MongoDB and shared with all connected devices, including the mobile device, in near real-time.

# Let's get started!

## Navigate to your [MongoDB Atlas Account](https://account.mongodb.com/account/login) 

   * In the MongoDB Atlas Cloud dashboard we can see 3 collections: Vehicle information, Sensor, Components.
    
      [screenshot here with red box around Vehicles, Component, Sensor, Vehicle] 

## Run npm start to start the vehicle
   
   [screenshot here of code starting the vehicle] 

## Web UI and Mobile app
    
   1. Type localhost:3000 in your browser, and you should see the following WebUI of the connected vehicle
   
   [screenshot of WebUI] 
   
   2. **Turning your engine on/off:** 
  To illustratate how fast data is synchronized between the vehicle model and the mobile app you can for example turn on the engine, by clicking on the       toggle button on your app and see how the engine gif starts moving indicated the negine has been turned on. 
  
   3. **Adding components**:To further explain a little bit of the data modeling, we've also added a functionality to create related components. You can add a component by clicking "add component" in in the web UI and you see that information (that object) which is created for the spoiler is immediately synchronized with the mobile device as well. 
    
    [screenshot of add component part and mobile app] 
   
   4. **Offline capablities**: You can also simulate what happens when the vehicle is not online. Since we are using a database inside the vehicle, all the   data changes are tracked and once you resume and click "sync", you will see that the status is immediately updated. Offline capabilities are intact! 

    [screenshot of sync here] 
   
   5. **Offline capablities**: You can also simulate what happens when the vehicle is not online. Since we are using a database inside the vehicle, all the   data changes are tracked and once you resume and click "sync", you will see that the status is immediately updated. Offline capabilities are intact! This is exciting, because you get actual live information about the vehicle. Think of how many sensors change way too frequently and need to be synchronized with every single change to the cloud backend. What we've implemented here with MongoDB Realm's offline capabilities is a bucketing pattern. 
   
   [screenshot here] 
   
   6. **Bucketing pattern in action**: Let's store 20 records in our bucket. You'll see this number on the "Bucket: x number" button. Click the "Track Telemetry Button" until you've reached 20 items in the "Bucket" button. 

    [screenshot here] 

   8. **Sensor record**: Navigate back to your MongoDB Atlas account and into the Sensor collection. There you'll see under "measurements" 20 different objects representing: timestamp, voltage and current. 
   
    [screenshot here] 

## App Services & Telemetry Information 

1. Navigate to App Services. 
2. Navigate to Triggers under App Services. You'll see three triggers: 
    * publish_battery_inference 
    * sagemaker_demo_workaround 
    * eventbridge_publish_battery
3. Navigate into the publish_battery_inference Trigger. This database trigger pushes the sensor record information to AWS Eventbridge. You'll notice the following: 
    * Cluster Name: Connected-Products 
    * Database Name: Integrations 
    * Collection Name: Sagemaker 
    * etc. 
    
    [insert Screenshot here] 
 
 4. You'll see that the publish battery inference function is run. If you want, you can navigate to the Functions tab in Atlas and you'll see that the publish_battery_inference JavaScrip function updates the vehicle model. 
 
    [insert screenshot here] 
    
## WebUI and Mobile App 




## Status alerts
