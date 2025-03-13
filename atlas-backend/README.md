# MongoDB Atlas Digital-Twin Backend

In order to the make the demo work end-to-end, you will need to set up the backendas part of prerequisites to run the project Demo.
Let's get started! 

## Installations
1. Inside your `vehicle-ts` folder, execute the following command in the terminal to install your `build` folder:
   
```bash
npm run build
```

## Install **Mongo Database Tools**

2. Run this commands in the terminal at the `root` folder of the project. If you prefer, they can be installed at your main user's folder to execute in other projects:

```bash
brew tap mongodb/brew
brew install mongodb-database-tools
```

To learn more about Mongo Database Tools ☞ [click here](https://www.mongodb.com/docs/database-tools/)


## Setup the MongoDB Atlas Backend

3. Create a [MongoDB Cloud](https://cloud.mongodb.com/) user account and ensure that you have access to an organization/project. 
4. Under the Database tab, click "Build A Database" and [create a free MongoDB cluster](https://www.mongodb.com/docs/atlas/tutorial/create-new-cluster/) in your preferred region and call it ```Connected-Vehicle-DB```. <br>You can choose a Free Tier (Shared), Serverless, or Dedicated cluster.

5. Under the Database tab, click "Build A Database" and [create a free MongoDB cluster](https://www.mongodb.com/docs/atlas/tutorial/create-new-cluster/) in your preferred region and call it ```Connected-Vehicle-DB```.
<a></a>
<li>        You can choose a Free Tier (Shared), Serverless, or Dedicated cluster.</li>

### Obtain your Connection String

6. Once the MongoDB Atlas Cluster is set up, locate your newly created cluster, click the "Connect" button and select the "Compass" section. 

### Replicate the Demo Database

7. To replicate the demo database on your MongoDB Atlas cluster, run the following command in your terminal:

   ```bash
   mongorestore --uri <your-connection-string> dump/
   ```

## Setup the Digital-Twin Application + Ditto

8. Create your **Ditto** account ([here](https://ditto.live/)) 

9. Set-up a new App by selecting `New App` under `Apps` tab and assign it as *"Playground"* Auth mode.
You'll be given your **App ID**, **Playground token**, **Auth URL** and **Websocket URL** as well as an URL

---
**ⓘ :**
Store it safely since you'll only see it once and won't be able to retrieve them in the future.
---


For a deeper understanding into **Ditto**, you can see [React Native Guide](https://docs.ditto.live/install-guides/react-native) & [API Auth](https://docs.ditto.live/cloud/http-api/authorization)

10. Inside your `vehicle-ts` folder, run the following commands:

```bash
npm install @dittolive/ditto
```

11. Once you've finalized the above installation, at the same `vehicle-ts` folder in the terminal  also run:
    
```bash
    npm install
```

12. Remember that for the proper execution and sync of **Ditto's Big Peer**, you'll need to create two `.env` files, one inside `vehicle-ts/src` and the other inside `mobile-swift`, both with:

```bash
DITTO_APP_ID=<yourID>
DITTO_PLAYGROUND_TOKEN=<yourtokenID>
DITTO_CUSTOM_AUTH_URL =<yourCustomAuthUrl>
DITTO_WEBSOCKET_URL=<yourDittoWebsocketUrl>
```

13. Congrats! The first part is done. Now you'll continue with configuring / running the vehicle simulator ["Part 2: Set up the Typescript Vehicle Simulator"](..//vehicle-ts).

