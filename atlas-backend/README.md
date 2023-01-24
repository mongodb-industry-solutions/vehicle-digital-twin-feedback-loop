# MongoDB Atlas Digital-Twin Backend

In order to the make the demo work end-to-end, you will need to set up the backend. Let's get started! 

## Setup the MongoDB Atlas Backend

1. Create a [MongoDB Cloud](https://cloud.mongodb.com/) user account and ensure that you have access to an organization/project. 
2. [Create a free MongoDB cluster](https://www.mongodb.com/docs/atlas/tutorial/create-new-cluster/) in your preferred region and call it **"Connected-Products"**. <br>Shared clusters should work. Serverless instances are **not yet** supported!

## Setup the AWS Backend
1. Create an [AWS Account](https://portal.aws.amazon.com/billing/signup#/start/email).
2. Take note of your AWS Account ID as you'll need it to set up your Digital Twin Application.

## Setup the Digital-Twin Application

1. [Install realm-cli](https://www.mongodb.com/docs/atlas/app-services/cli/#installation)
2. [Generate API key](https://www.mongodb.com/docs/atlas/app-services/cli/#generate-an-api-key)
3. [Login with your API key](https://www.mongodb.com/docs/atlas/app-services/cli/#authenticate-with-an-api-key)
4. Update your AWS Account ID in `./Connected-Products/triggers/eventbridge_publish_battery_telemetry.json`
5. Navigate into the folder Digital-Twins-With-AWS/atlas-backend and import the Connected-Products application `realm-cli push --local ./Connected-Products --remote Connected-Products` and configure the [options](https://www.mongodb.com/docs/atlas/app-services/manage-apps/create/create-with-cli/#run-the-app-creation-command) according your needs. If you are unsure which options to choose, the default ones are usually a good way to start! 

    After you've chosen your options, you should see the following appear: 

        App created successfully
    
        ...
    
        Successfully pushed app up: Your App ID 


6. Copy the returned App ID and use it to create the demo user by pasting the following into your command shell: `realm-cli users create --type email --email demo --password demopw`

    You should see the following appear: 
        
        App ID or Name (here you'll insert your App ID) 
        Successfully created user
        {
            "id": , 
            "enabled": , 
            "email": ,
            "type":
        }
7. Run the following command: `realm-cli apps list` to check if your app has been created. 
    
    You should see the following appear: 
        
        Found 1 apps 
            Your App ID (Session ID) 


8. Congrats! The first part is done. Now you'll continue with configuring / running the vehicle simulator ["device-ts"](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/device-ts).
