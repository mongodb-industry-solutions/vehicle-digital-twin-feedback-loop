# Setup Instructions for Integrating Amazon SageMaker

For visualization purposes, the connected vehicle environment will function like the image below. But we'll get into more detail on that in the [demo section](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/Demo_Instructions.md). 

![image](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/media/EndToEnd.png) 

Now that you've finished the first three parts ([part 1](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/atlas-backend), [part 2](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/device-ts), [part 3](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/mobile-swift)) , you can start setting up your AWS SageMaker integration. The AWS SageMaker integration allows you to analyze your data and then send that analyzed data back to MongoDB Atlas and consequently to the the users of the devices.

For demonstration purposes, we've set up a quick intermediary step so that you do not have to create an AWS account and can quickly see the demo come into action! However, if you are interested in running the demo with AWS integration, please refer to our Partner repository: [Setup Instructions for MongoDB and Amazon SageMaker Integration](https://github.com/mongodb-partners/Vehicle-Digital-Twin-Solution)

## Intermediary Step:
* Navigate to App Services 
* Navigate to Triggers 
* Select the Database trigger type and name it "eventbridge_publish_battery_telemetry" 
![image](https://github.com/mongodb-industry-solutions/Vehicle-Digital-Twin-Feedback-Loop/blob/main/media/eventbridge.png)
* Under the Functions section, select "Function" and "copyToSagemakerCollection" 
![image](https://github.com/mongodb-industry-solutions/Vehicle-Digital-Twin-Feedback-Loop/blob/main/media/copytosagemaker.png) 

## Congrats!
You've now successfully set up everything you need to run a Digital Twin demonstration:  
  * [Part 1: The MongoDB Atlas Digital-Twin Backend](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/atlas-backend) 
  * [Part 2: The Typescript Vehicle Simulator](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/device-ts) 
  * [Part 3: The iOS Swift Vehicle Controller Mobile Application](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/mobile-swift)
  * [Part 4 - Quick demo](
     [Part 4 - AWS: The Amazon SageMaker Integration](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/aws-sagemaker) 

## Let's run the demo! 
[Step by Step Demonstration: Building your Digital Twin with MongoDB and AWS](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/Demo_Instructions.md)


