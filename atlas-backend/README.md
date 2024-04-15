# MongoDB Atlas Digital-Twin Backend

In order to the make the demo work end-to-end, you will need to set up the backend. Let's get started! 

## Setup the MongoDB Atlas Backend

1. Create a [MongoDB Cloud](https://cloud.mongodb.com/) user account and ensure that you have access to an organization/project. 
2. Under the Database tab, click "Build A Database" and [create a free MongoDB cluster](https://www.mongodb.com/docs/atlas/tutorial/create-new-cluster/) in your preferred region and call it ```Connected-Vehicle-DB```. <br>You can choose a Free Tier (Shared), Serverless, or Dedicated cluster.

## Setup the Digital-Twin Application

1. [Install appservice-cli](https://www.mongodb.com/docs/atlas/app-services/cli/#app-services-cli)
2. [Generate API key](https://www.mongodb.com/docs/atlas/app-services/cli/#generate-an-api-key), assign the ```Project Owner``` permission and add your IP address to the access list
3. [Login with your API key](https://www.mongodb.com/docs/atlas/app-services/realm-cli/v2/#authenticate-with-an-api-key)
   
    `appservices login --api-key="<API-Key>" --private-api-key="<Private-Key>"`
4. Navigate into the folder Vehicle-Digital-Twin-Feedback-Loop/atlas-backend and import the Connected-Vehicle application `appservices push --local ./Connected-Vehicle --remote Connected-Vehicle` and configure the [options](https://www.mongodb.com/docs/atlas/app-services/manage-apps/create/create-with-cli/#run-the-app-creation-command) according your needs. If you are unsure which options to choose, the default ones are usually a good way to start! 

    After you've chosen your options, you should see the following appear: 

        App created successfully
    
        ...
    
        Successfully pushed app up: Your App ID 
    
    Your App ID should be in the following format: YourAppName-XXXXX


5. Create the demo user by pasting the following into your command shell: `realm-cli users create --type email --email demo --password demopw`. Be sure to change the default password. You then have to provide the previously received App ID or just type the application name `Connected-Vehicle`.

    You should see the following appear: 
        
        App ID or Name (here you'll insert your App ID) 
        Successfully created user
        {
            "id": , 
            "enabled": , 
            "email": ,
            "type":
        }
6. Run the following command: `realm-cli apps list` to check if your app has been created. 
    
    You should see the following appear: 
        
        Found 1 apps 
            Your App ID  


7. Congrats! The first part is done. Now you'll continue with configuring / running the vehicle simulator ["Part 2: Set up the Typescript Vehicle Simulator"](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/main/vehicle-ts).
