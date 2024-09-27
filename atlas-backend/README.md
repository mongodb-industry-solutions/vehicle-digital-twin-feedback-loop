# MongoDB Atlas Digital-Twin Backend

In order to the make the demo work end-to-end, you will need to set up the backendas part of prerequisites to run the project Demo.
Let's get started! 

## Installations
1. Inside your `vehicle-ts` folder, execute the following command in the terminal to install your `build` folder: `npm run build`.

## Install **Mongo Database Tools**

2. Run this commands in the terminal at the `root` folder of the project. If you prefer, they can be installed at your main user's folder to execute in other projects:

```
brew tap mongodb/brew
brew install mongodb-database-tools
```

To learn more about Mongo Database Tools [click here](https://www.mongodb.com/docs/database-tools/)


## Setup the MongoDB Atlas Backend

3. Create a [MongoDB Cloud](https://cloud.mongodb.com/) user account and ensure that you have access to an organization/project. 

4. Under the Database tab, click "Build A Database" and [create a free MongoDB cluster](https://www.mongodb.com/docs/atlas/tutorial/create-new-cluster/) in your preferred region and call it ```Connected-Vehicle-DB```. <br>You can choose a Free Tier (Shared), Serverless, or Dedicated cluster.

### Obtain your Connection String

5. Once the MongoDB Atlas Cluster is set up, locate your newly created cluster, click the "Connect" button and select the "Compass" section. 

### Replicate the Demo Database

6. To replicate the demo database on your MongoDB Atlas cluster, run the following command in your terminal:

   ```bash
   mongorestore --uri <your-connection-string> dump/
   ```

## Setup the Digital-Twin Application + Ditto

7. Create your **Ditto** account ([here](https://ditto.live/)) 

8. Set-up a new App by selecting `New App` under `Apps` tab and assign it as *"Playgorund"* Auth mode.
You'll be given your **App ID** and **Playground token** as well as an URL (store it safely since you'll only see it once).

For a deeper understanding into **Ditto**, you can see [React Native Guide](https://docs.ditto.live/install-guides/react-native) & [API Auth](https://docs.ditto.live/cloud/http-api/authorization)

9. Inside your `vehicle-ts` folder, run the following commands:

```
npm install @dittolive/ditto
```

10. Once you've finalized the aboce installations, navigate towards your `root` folder in the terminal and also run: `npm install`.

11. Remember that for the proper execution and sync of **Ditto's Big Peer**, you'll need to create a `.env` file with:

```
DITTO_APP_ID=<yourID>
DITTO_PLAYGROUND_TOKEN=<yourtokenID>
```
<!-- Make sure to replace `<your-connection-string>` with your MongoDB Atlas connection string. If you've already followed the initial configuration steps, you should have obtained this connection string. Ensure that the URI includes the username, password, and cluster details. -->

<!-- After executing these commands, you can verify the successful restoration of the demo database by checking the last line of the command output -->

12. Congrats! The first part is done. Now you'll continue with configuring / running the vehicle simulator ["Part 2: Set up the Typescript Vehicle Simulator"](https://github.com/mongodb-industry-solutions/Digital-Twins-With-AWS/tree/feature/ReadMe/vehicle-ts).

