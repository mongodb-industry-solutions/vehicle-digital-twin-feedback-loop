# MongoDB Atlas Digital-Twin Backend

This folder contains all the MongoDB Atlas backend configuration files.

## Setup The Digital-Twin-Backend Application

1. You need a [MongoDB Cloud](https://cloud.mongodb.com/) user account and access to an organization/project
2. [Create a MongoDB cluster](https://www.mongodb.com/docs/atlas/tutorial/create-new-cluster/) in your preffered region. Serverless instances not yet supported!
2. [Install realm-cli](https://www.mongodb.com/docs/atlas/app-services/cli/#installation)
3. [Generate API key](https://www.mongodb.com/docs/atlas/app-services/cli/#generate-an-api-key)
4. [Login with your API key](https://www.mongodb.com/docs/atlas/app-services/cli/#authenticate-with-an-api-key)
5. Import the Digital-Twin-Backend application ```realm-cli push --local ./Digital-Twin-Backend```


## Download Deployed Application

1. ```realm-cli pull --local ./Digital-Twin-Backend --remote <-- YOUR APP ID -->```
