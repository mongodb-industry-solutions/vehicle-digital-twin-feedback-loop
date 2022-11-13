# MongoDB Atlas Digital-Twin Backend

This folder contains all the MongoDB Atlas backend configuration files.

## Setup The Digital-Twin-Backend MongoDB Backend

1. You need a [MongoDB Cloud](https://cloud.mongodb.com/) user account and access to an organization/project
2. [Create a MongoDB cluster](https://www.mongodb.com/docs/atlas/tutorial/create-new-cluster/) in your preferred region and call it **"Digital-Twin"**. <br>Shared clusters should work. Serverless instances are **not yet** supported!

## Setup the Digital-Twin Application

1. [Install realm-cli](https://www.mongodb.com/docs/atlas/app-services/cli/#installation)
2. [Generate API key](https://www.mongodb.com/docs/atlas/app-services/cli/#generate-an-api-key)
3. [Login with your API key](https://www.mongodb.com/docs/atlas/app-services/cli/#authenticate-with-an-api-key)
4. Import the Connected-Products application `realm-cli push --local ./Connected-Products --remote Connected-Products` and configure the [options](https://www.mongodb.com/docs/atlas/app-services/manage-apps/create/create-with-cli/#run-the-app-creation-command) according your needs
5. Copy the previously created App ID and use it to create the demo user: `realm-cli users create --type email --email demo --password demopw`
7. Unfortunately to get asymmetric sync working, you have to manually [adjust the sync permissions](https://www.mongodb.com/docs/atlas/app-services/sync/data-access-patterns/sync-mode/#flexible-sync) via web ui to meet [this](https://github.com/mongodb-industry-solutions/Connected-Devices/blob/development-fr/atlas-backend/SyncPermissions.JSON). <br>This requires terminating sync, changing permissions and reactivation of sync!
6. Get the created "App ID" `realm-cli apps list` and continue with running the ["Device-TS"](https://github.com/mongodb-industry-solutions/Connected-Devices/tree/development-fr/device-ts), which will create all the required schemas to complete the setup process

## Download Deployed Application Changes

1. Download changes via the UI into your local app folder `realm-cli pull`
