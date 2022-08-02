# MongoDB Atlas Digital-Twin Backend

This folder contains all the MongoDB Atlas backend configuration files.

## Setup The Digital-Twin-Backend MongoDB Backend

1. You need a [MongoDB Cloud](https://cloud.mongodb.com/) user account and access to an organization/project
2. [Create a MongoDB cluster](https://www.mongodb.com/docs/atlas/tutorial/create-new-cluster/) in your preffered region. Serverless instances not yet supported!
3. Once your cluster is up and running, create the database "Digital-Twins" and the collections "Device", "Component" and "Sensor"

## Setup the Digital-Twin Application

1. [Install realm-cli](https://www.mongodb.com/docs/atlas/app-services/cli/#installation)
2. [Generate API key](https://www.mongodb.com/docs/atlas/app-services/cli/#generate-an-api-key)
3. [Login with your API key](https://www.mongodb.com/docs/atlas/app-services/cli/#authenticate-with-an-api-key)
4. Import the Digital-Twin-Backend application ```realm-cli push --local ./Digital-Twin-Backend```


## Download Deployed Application

1. ```realm-cli pull --local ./Digital-Twin-Backend --remote <-- YOUR APP ID -->```
