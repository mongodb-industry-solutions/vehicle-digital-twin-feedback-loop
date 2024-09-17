# Setup Instructions for Integrating Amazon SageMaker

For visualization purposes, the connected vehicle environment will function like the image below. But we'll get into more detail on that in the [demo section](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/Demo_Instructions.md). 

![image](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/media/EndToEnd.png) 

Now that you've finished the first three parts ([part 1](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/atlas-backend), [part 2](https://github.com/mongodb-industry-solutions/Vehicle-Digital-Twin-Feedback-Loop/tree/main/vehicle-ts), [part 3](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/mobile-swift)) , you can start setting up your AWS SageMaker integration. The AWS SageMaker integration allows you to analyze your data and then send that analyzed data back to MongoDB Atlas and consequently to the the users of the devices. 

## Prerequisite 

1. AWS Account access for Amazon SageMaker, Amazon EventBridge, ECR, Lambda
2. AWS CLI
3. Docker (or) Docker Desktop

## Setup Amazon SageMaker

Setting up Amazon Sagemaker will take some time! Please find the instructions to setup an Amazon SageMaker Domain and create an endpoint for "Predictive Maintenance for Vehicle Fleets" here [AmazonSageMaker.md](AmazonSageMaker.md)

## Setup the Amazon EventBridge Integration
1. Create an [AWS Account](https://portal.aws.amazon.com/billing/signup#/start/email).
2. Take note of your AWS Account ID as you'll need it to update your AWS Account ID in the Triggers tab of the Atlas UI as seen in Step 3. 
3. To publish battery telemetry information to Eventbridge, please follow these steps in MongoDB Atlas under the App Services tab: 
       
      * Navigate to the "Triggers" tab
       
      * Click on your eventbridge_publish_battery_telemetry trigger: 
      
      * Make sure the Full Document is turned ON 
        <img width="692" alt="image" src="https://user-images.githubusercontent.com/114057324/225280604-ac9d0ad5-17f6-4f1c-b096-ffb91ed5048b.png">

      
      * Under the "Function" Section select "EventBridge" as the Event Type
      
           * Update your AWS Account ID 
              
           * Select an AWS Region 

     ![image](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/media/function.png)

      * Then save the trigger, head on to AWS Console and go-to Amazon EventBridge and choose Partner event sources in the navigation pane. In the Partner event sources table, find and select the **Pending trigger** source and then click Associate with event bus.

          ![image](https://user-images.githubusercontent.com/114057324/224977374-2fded319-8433-4dcd-8c93-7ae2468445ac.png)

      * On the Associate with event bus screen, define any required access permissions for other accounts and organizations and then click Associate.


          ![image](https://user-images.githubusercontent.com/114057324/224977547-bf66e9fb-d545-4db3-8f3c-2b65aee35d80.png)
      
      * Once confirmed, the status of the trigger event source changes from Pending to Active, and the name of the event bus get updated. Note down the event bus name for future reference.


          ![image](https://user-images.githubusercontent.com/114057324/224977702-5a8f861b-4877-4cb5-ad7e-414f239f3ab6.png)



## Create Elastic Container Registry (ECR)

create the two repositories for the lambda functions.

<img width="659" alt="image" src="https://user-images.githubusercontent.com/101570105/226830565-83c5a921-0a5b-4382-bce9-3e99f84c4bf5.png">


<img width="659" alt="image" src="https://user-images.githubusercontent.com/101570105/226830962-1adf2c2c-166f-4162-a1db-3aa3c80e7957.png">


## Upload the docker image to ECR
              

Update the region-name, eventbus-name and model-endpoint to your values. Sample reference shown below.


Change to the _pull_from_mdb_ directory 

       cd aws-sagemaker/code/pull_from_mdb


Update the configuration parameter in the lambda code (line 32 to 34). Ensure the eventbus-name in the above code is  `pushing_to_mongodb` as the same name is used in the next step. Otherwise, please note down the name you entered.

<img width="1233" alt="image" src="https://user-images.githubusercontent.com/101570105/226831670-682fb2f2-4aa7-47fc-8a25-78805b0345a3.png">
 
 

 
 
Connect to ECR repository. 

Note: to connect to the ECR repo, the docker should be up and running. Please refer the [link](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) for further assistance. 

       aws ecr get-login-password --region <region-name> | docker login --username AWS --password-stdin <account-name>.dkr.ecr.<region>.amazonaws.com

       docker build -t connected_vehicle_atlas_to_sagemaker .
       
       docker tag connected_vehicle_atlas_to_sagemaker:latest <accoutn_id>.dkr.ecr.<region>.amazonaws.com/connected_vehicle_atlas_to_sagemaker:latest
       
       docker push <account_id>.dkr.ecr.<region>.amazonaws.com/connected_vehicle_atlas_to_sagemaker:latest

Ensure the image is successfully loaded to the ECR 

<img width="1497" alt="image" src="https://user-images.githubusercontent.com/101570105/226839993-62b80f37-0727-4fa1-bb92-0dfaa95dfa47.png">


Simillarly repeat the steps for "push_to_mdb" also and ensure it's image is uploaded successfully into connected_vehicle_sagemaker_to_atlas repo. 


Note the code needs to be updated for the Database credentials. Refer to the screenshot below for reference (line no 16).


<img width="1720" alt="image" src="https://github.com/mongodb-industry-solutions/Vehicle-Digital-Twin-Feedback-Loop/assets/101570105/dbd7c6d0-d9fa-46e0-a9fa-f1d6fa46382f">

       aws ecr get-login-password --region <region-name> | docker login --username AWS --password-stdin <account-name>.dkr.ecr.<region>.amazonaws.com
       
       docker build -t connected_vehicle_sagemaker_to_atlas .
       
       docker tag connected_vehicle_sagemaker_to_atlas:latest <account_id>.dkr.ecr.<region>.amazonaws.com/connected_vehicle_sagemaker_to_atlas:latest
       
       docker push <account_id>.dkr.ecr.<region>.amazonaws.com/connected_vehicle_sagemaker_to_atlas:latest
              
              


<img width="1518" alt="image" src="https://user-images.githubusercontent.com/101570105/226843032-72d3a39c-8d2b-4f74-b971-ff97ed731dd5.png">


## Lambda Functions 

1. For pulling the data from MongoDB cluster, refer this [function](https://github.com/mongodb-industry-solutions/Vehicle-Digital-Twin-Feedback-Loop/tree/main/aws-sagemaker/code/pull_from_mdb).


<img width="1624" alt="image" src="https://user-images.githubusercontent.com/101570105/226857255-2f9d7945-44ff-48ad-90e4-0a7fab6ce634.png">


Note down the execution role name from Lamdba Permission tab

<img width="1101" alt="image" src="https://user-images.githubusercontent.com/101570105/226877911-3c081fd9-6828-4c3d-bca5-3604b26db8ac.png">


Grant the SageMaker and Lambda permissions to the above role. Add an in-line policy for permissions to Events.

       {
              "Version": "2012-10-17",
              "Statement": [
              {
                     "Effect" : "Allow",
                     "Action" :"events:*",
                     "Resource": "arn:aws:logs:<region>:<account_ID>:*"

              }

              ]
       }


<img width="1494" alt="image" src="https://user-images.githubusercontent.com/101570105/226893184-089f637d-111f-49fe-b827-4182e576b85e.png">






2. For pushing the predicted data back to MongoDB cluster, refer this [function](https://github.com/mongodb-industry-solutions/Vehicle-Digital-Twin-Feedback-Loop/tree/main/aws-sagemaker/code/push_to_mdb).


<img width="1624" alt="image" src="https://user-images.githubusercontent.com/101570105/226858124-3bf4c09d-a3da-4b99-8fe4-4f2265c80279.png">


Please follow this [guide](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html) to create Lambda functions using Docker images.

## Create Rules for AWS Eventbus

### 1.  Eventbus for capturing MongoDB changes

Add the rule name, description and the eventbus from the dropdown.

![image](https://user-images.githubusercontent.com/114057324/199439272-e4cfa58b-aebb-4bdc-af69-246ef44b80fa.png)

Select the first option for Event source to pull data from MongoDB.

![image](https://user-images.githubusercontent.com/114057324/199439653-511f20ec-020d-4aad-ac1e-d253d04aa56c.png)

Select options for Event source, Partner and Event type as selected below. 

![image](https://user-images.githubusercontent.com/114057324/199439699-d740bfde-7f25-41ad-b9df-a3667abf4cba.png)

Add previously created Lambda as target and create the rule.

![image](https://user-images.githubusercontent.com/114057324/199439940-f122ef69-b105-40ed-a255-d89e05b91133.png)

### 2.  Eventbus for capturing events sent from Lambda function  

In the navigation pane, choose Event buses.

Choose Create event bus.

Create an Event bus with name `pushing_to_mongodb` 

![image](https://user-images.githubusercontent.com/114057324/225210796-3517b008-836e-4d08-b36a-6ca6f5b54131.png)

Next, create a rule to move data between lambda functions.
![image](https://user-images.githubusercontent.com/114057324/225212123-f48df2ac-2f02-41ea-96ab-1409a1ad07ae.png)

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

Set the target of the Rule as the lambda function which you created earlier i.e. `push_to_mdb` as shown below.

![image](https://user-images.githubusercontent.com/114057324/225212873-490792e0-9b50-4105-a60f-f00641540f66.png)

Verify and save the rule.


## Sample output
*  On simulating the connected vehichle application the volatage and current of the vehichle are analysed for percentage of failure. The inference is stored back in MongoDB Atlas.

![image](https://user-images.githubusercontent.com/114057324/199904767-1fb432dc-af21-44aa-a236-31d84ad031f2.png)


## Troubleshoot

a. (Mandatory) Redeploy the correct/latest docker image, when a new image is pushed into Elastic Container Repository(ECS).

<img width="1105" alt="image" src="https://user-images.githubusercontent.com/101570105/236819974-965a683d-a48c-4865-987c-b08627429b0c.png">

b. Check the log of Atlas Application Services to confirm all the triggers are working properly.

<img width="1304" alt="image" src="https://user-images.githubusercontent.com/101570105/236820267-49489d99-8b31-4ff4-a085-deff90b44bf7.png">


c. Check the cloudwatch log of lambda to confirm if the lambda execution is successful.

<img width="1087" alt="image" src="https://user-images.githubusercontent.com/101570105/236820537-180ee097-e4b3-4157-802b-85dda3e6d604.png">

d. Please ensure your docker environment is running before trying out the ECR push.


## Conclusion
* This gives a working template to setup an end-to-end flow for connected vehicles, to analyze its telemetric data using MongoDB Atlas and AWS Services. 

* For any further information in regards to setting up the AWS integration, please contact partners@mongodb.com


# Congrats!
You've now successfully set up everything you need to run a Digital Twin demonstration:  
  * [Part 1: The MongoDB Atlas Digital-Twin Backend](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/atlas-backend) 
  * [Part 2: The Typescript Vehicle Simulator](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/vehicle-ts) 
  * [Part 3: The iOS Swift Vehicle Controller Mobile Application](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/mobile-swift)
  * [Part 4: The Amazon SageMaker Integration](https://github.com/mongodb-partners/Vehicle-Digital-Twin-Solution)

## Let's run the demo! 
[Step by Step Demonstration: Building your Digital Twin with MongoDB and AWS](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/blob/main/Demo_Instructions.md)


