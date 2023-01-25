# Setup Instructions for AWS Sagemaker Integration

Now that you've finished the first three parts ([part 1](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/atlas-backend), [part 2](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/device-ts), [part 3](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/mobile-swift)) , you can start setting up your AWS Sagemaker integration. The AWS Sagemaker integration allows you to analyze your data and then send that analyzed data back to MongoDB Atlas and consequently to the the users of the devices. 

For visualization purposes, the connected vehicle environment will function like the image below. But we'll get into more detail on that in the [demo section](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/Demo_Instructions.md)! For now let's set up the AWS Sagemaker Integration. 

![image](https://user-images.githubusercontent.com/114057324/199659004-49177737-3e80-4656-9a5b-e219dbedc296.png) 

## Setup the AWS Backend
1. Create an [AWS Account](https://portal.aws.amazon.com/billing/signup#/start/email).
2. Take note of your AWS Account ID as you'll need it to set up your Digital Twin Application.
3. Update your AWS Account ID in `./Connected-Products/triggers/eventbridge_publish_battery_telemetry.json`

## Set up the AWS Integration
1. You can skip directly to the *"Setup Eventbridge triggers from MongoDB Atlas"* section: [Vehicle-Digital-Twin Solution](https://github.com/mongodb-partners/Vehicle-Digital-Twin-Solution)

## Congrats!
You've now successfully set up everything you need to run a Digital Twin demonstration:  
  * [Part 1: The MongoDB Atlas Digital-Twin Backend](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/atlas-backend) 
  * [Part 2: The Typescript Vehicle Simulator](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/device-ts) 
  * [Part 3: The iOS Swift Vehicle Controller Mobile Application](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/mobile-swift)
  * [Part 4: The AWS Sagemaker Integration](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/aws-sagemaker) 

## Let's run the demo! 
[Step by Step Demonstration: Building your Digital Twin with MongoDB and AWS](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/Demo_Instructions.md)


