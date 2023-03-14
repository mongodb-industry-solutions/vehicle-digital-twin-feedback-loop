# Setup Instructions for Integrating Amazon SageMaker

For visualization purposes, the connected vehicle environment will function like the image below. But we'll get into more detail on that in the [demo section](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/Demo_Instructions.md). 

![image](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/media/EndToEnd.png) 

Now that you've finished the first three parts ([part 1](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/atlas-backend), [part 2](https://github.com/mongodb-industry-solutions/Vehicle-Digital-Twin-Feedback-Loop/tree/main/vehicle-ts), [part 3](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/mobile-swift)) , you can start setting up your AWS SageMaker integration. The AWS SageMaker integration allows you to analyze your data and then send that analyzed data back to MongoDB Atlas and consequently to the the users of the devices. 

## Setup the AWS Backend
1. Create an [AWS Account](https://portal.aws.amazon.com/billing/signup#/start/email).
2. Take note of your AWS Account ID as you'll need it to update your AWS Account ID in the Triggers tab of the Atlas UI as seen in Step 3. 
3. To publish battery telemetry information to Eventbridge, please follow these steps in MongoDB Atlas under the App Services tab: 
       
      * Navigate to the "Triggers" tab
       
      * Click on your eventbridge_publish_battery_telemetry trigger: 
      
      * Under the "Function" Section select "EventBridge" as the Event Type
      
           * Update your AWS Account ID 
              
           * Select an AWS Region 

     ![image](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/media/function.png)
       
      * Now expand the advanced options and copy/paste the following code into the Project Expression: 
      
      ```json 
               {
                     "operationType": {
                      "$numberInt": "1"
                  },
                  "vin": "$fullDocument.vin",
                  "read": {
                      "$map": {
                          "input": "$fullDocument.measurements",
                          "as": "item",
                          "in": [
                              "$$item.voltage",
                              "$$item.current"
                          ]
                      }
                  }
              }
      ```
       
      * You should see the following: 
     ![image](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/media/project_expression.png)



      * After saving the trigger, head on to AWS Console and go-to Amazon EventBridge and choose Partner event sources in the navigation pane. In the Partner event sources table, find and select the **Pending trigger** source and then click Associate with event bus.

          ![image](https://user-images.githubusercontent.com/114057324/224977374-2fded319-8433-4dcd-8c93-7ae2468445ac.png)

      * On the Associate with event bus screen, define any required access permissions for other accounts and organizations and then click Associate.


          ![image](https://user-images.githubusercontent.com/114057324/224977547-bf66e9fb-d545-4db3-8f3c-2b65aee35d80.png)
      
      * Once confirmed, the status of the trigger event source changes from Pending to Active, and the name of the event bus get updated.


          ![image](https://user-images.githubusercontent.com/114057324/224977702-5a8f861b-4877-4cb5-ad7e-414f239f3ab6.png)



## Setup SageMaker 

If not already completed, please refer to the [link](https://docs.aws.amazon.com/sagemaker/latest/dg/studio-launch.html#studio-launch-console-prerequisites) for prerequisites and setup of SageMaker domain. 

Deploy the SageMaker model "Predictive Maintenance for Vehicle Fleets" to get the end-point.

![image](https://user-images.githubusercontent.com/114057324/199462770-84305e10-2a3b-4f10-9f56-7a8cd61e8ee3.png)
![image](https://user-images.githubusercontent.com/114057324/199463222-dcacd80d-1e84-494a-99a7-ba2a5a0f7914.png)

## Building the Code
Replace the SageMaker end-point with the one generated above [here](https://github.com/mongodb-industry-solutions/Vehicle-Digital-Twin-Feedback-Loop/blob/main/aws-sagemaker/code/push_to_mdb/write_to_mdb.py).

## Lambda Functions
Create two lambda functions:

1. For pulling the data from MongoDB cluster, refer this [function](https://github.com/mongodb-industry-solutions/Vehicle-Digital-Twin-Feedback-Loop/tree/main/aws-sagemaker/code/pull_from_mdb).
2. For pushing the predicted data back to MongoDB cluster, refer this [function](https://github.com/mongodb-industry-solutions/Vehicle-Digital-Twin-Feedback-Loop/tree/main/aws-sagemaker/code/push_to_mdb).

Please follow this [guide](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html).

## Create Rules for AWS Eventbus
### 1. Eventbus for capturing MongoDB changes

Add the rule name, description and the eventbus from the dropdown.

![image](https://user-images.githubusercontent.com/114057324/199439272-e4cfa58b-aebb-4bdc-af69-246ef44b80fa.png)

Select the first option for Event source to pull data from MongoDB.

![image](https://user-images.githubusercontent.com/114057324/199439653-511f20ec-020d-4aad-ac1e-d253d04aa56c.png)

Select options for Event source, Partner and Event type as selected below. 

![image](https://user-images.githubusercontent.com/114057324/199439699-d740bfde-7f25-41ad-b9df-a3667abf4cba.png)

Add previously created Lambda as target and create the rule.

![image](https://user-images.githubusercontent.com/114057324/199439940-f122ef69-b105-40ed-a255-d89e05b91133.png)

### 2. Eventbus for capturing events sent from Lambda function  

This rule is created to move data between lambda functions.
![image](https://user-images.githubusercontent.com/114057324/214270431-89650ccf-63d1-43a5-916f-88fa3f97f147.png)

Select other when selecting event source.
![image](https://user-images.githubusercontent.com/114057324/214270442-c722e775-082f-4f60-862a-bef7d5bcebac.png)

Add below event pattern to be able to send data using python function.
```
{
    "source": ["user-event"],
    "detail-type": ["user-preferences"]
}
```
![image](https://user-images.githubusercontent.com/114057324/214270448-4651a768-4c43-4cb6-95cb-6b0044c517ee.png)

## Sample output
On simulating the connected vehichle application the volatage and current of the vehichle are analysed for percentage of failure. The inference is stored back in MongoDB Atlas.

![image](https://user-images.githubusercontent.com/114057324/199904767-1fb432dc-af21-44aa-a236-31d84ad031f2.png)


## Conclusion
This gives a working template to setup an end-to-end flow for connected vehicles, to analyze its telemetric data using MongoDB Atlas and AWS Services. 

For any further information in regards to setting up the AWS integration, please contact partners@mongodb.com


# Congrats!
You've now successfully set up everything you need to run a Digital Twin demonstration:  
  * [Part 1: The MongoDB Atlas Digital-Twin Backend](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/atlas-backend) 
  * [Part 2: The Typescript Vehicle Simulator](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/vehicle-ts) 
  * [Part 3: The iOS Swift Vehicle Controller Mobile Application](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/mobile-swift)
  * [Part 4: The Amazon SageMaker Integration](https://github.com/mongodb-partners/Vehicle-Digital-Twin-Solution)

## Let's run the demo! 
[Step by Step Demonstration: Building your Digital Twin with MongoDB and AWS](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/Demo_Instructions.md)


