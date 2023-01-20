# MongoDB Atlas Digital-Twin Backend

This folder contains all the MongoDB Atlas backend configuration files.

## Setup The Digital-Twin MongoDB Backend

1. Create a [MongoDB Cloud](https://cloud.mongodb.com/) user account and ensure that you have access to an organization/project. 
2. [Create a free MongoDB cluster](https://www.mongodb.com/docs/atlas/tutorial/create-new-cluster/) in your preferred region and call it **"Connected-Products"**. <br>Shared clusters should work. Serverless instances are **not yet** supported!

## Setup the Digital-Twin Application

1. [Install realm-cli](https://www.mongodb.com/docs/atlas/app-services/cli/#installation)
2. [Generate API key](https://www.mongodb.com/docs/atlas/app-services/cli/#generate-an-api-key)
3. [Login with your API key](https://www.mongodb.com/docs/atlas/app-services/cli/#authenticate-with-an-api-key)
4. Update your AWS Account ID in `./Connected-Products/triggers/eventbridge_publish_battery_telemetry.json`
4. Import the Connected-Products application `realm-cli push --local ./Connected-Products --remote Connected-Products` and configure the [options](https://www.mongodb.com/docs/atlas/app-services/manage-apps/create/create-with-cli/#run-the-app-creation-command) according your needs
5. Copy the returned App ID and use it to create the demo user: `realm-cli users create --type email --email demo --password demopw`
6. Copy the App ID `realm-cli apps list` and continue with configuring / running the vehicle simulator ["device-ts"](https://github.com/mongodb-industry-solutions/Connected-Devices/tree/main/device-ts).
