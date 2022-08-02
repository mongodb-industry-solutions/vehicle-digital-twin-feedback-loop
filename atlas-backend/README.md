# MongoDB Atlas Digital-Twin Backend

This folder contains all the MongoDB Atlas backend configuration files.

## Setup The Digital-Twin-Backend MongoDB Backend

1. You need a [MongoDB Cloud](https://cloud.mongodb.com/) user account and access to an organization/project
2. [Create a MongoDB cluster](https://www.mongodb.com/docs/atlas/tutorial/create-new-cluster/) in your preferred region and call it "Digital-Twin". Shared clusters should work. Serverless instances are **not yet** supported!

## Setup the Digital-Twin Application

1. [Install realm-cli](https://www.mongodb.com/docs/atlas/app-services/cli/#installation)
2. [Generate API key](https://www.mongodb.com/docs/atlas/app-services/cli/#generate-an-api-key)
3. [Login with your API key](https://www.mongodb.com/docs/atlas/app-services/cli/#authenticate-with-an-api-key)
4. Navigate into the "Digital-Twin-Backend" folder
4. Import the Digital-Twin-Backend application ```realm-cli push``` and configure the [options](https://www.mongodb.com/docs/atlas/app-services/manage-apps/create/create-with-cli/#run-the-app-creation-command) according your needs
5. Create the demo user: ```realm-cli users create --type email --email demo --password demopw```
6. Remember the "App ID" and continue with running the ["Device-TS"](https://github.com/mongodb-industry-solutions/Connected-Devices/tree/development-fr/device-ts) which will create all the required schemas to complete the setup process

## Download Deployed Application

1. ```realm-cli pull --local ./Digital-Twin-Backend --remote <-- YOUR APP ID -->```
