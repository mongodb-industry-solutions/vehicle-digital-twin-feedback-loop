import { init, Ditto, MutableDocument,TransportConfig } from "@dittolive/ditto";
import { BSON } from "bson";
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../../src/.env') });

// Now you can access the variables using process.env
const appID = process.env.DITTO_APP_ID || 'cant read env var DITTO_APP_ID';
const token = process.env.DITTO_PLAYGROUND_TOKEN || 'cant read env var DITTO_PLAYGROUND_TOKEN';
const customAuthURL = process.env.DITTO_CUSTOM_AUTH_URL ||'cant read env var DITTO_CUSTOM_AUTH_URL';
const dittoWebSocketURLs = process.env.DITTO_WEBSOCKET_URL || 'cant read env var DITTO_WEBSOCKET_URL';

interface Component {
  _id: string;
  name: string
  owner_id: string;
}
interface Command {
  ts: string
  command: string;
  status: string;
}

class DittoApp {
  private ditto: Ditto;
  private vehicle: any | null = null;
  private batteryMeasurements: Array<any> = [];
  private clients: Array<any> = [];

  constructor() {
    init();

    this.ditto = new Ditto({
      type: "onlinePlayground",
      appID: appID,
      token: token,
      customAuthURL: customAuthURL,
      enableDittoCloudSync: false
    });

     // Set the Ditto Websocket URL
    const config = new TransportConfig()
    config.connect.websocketURLs.push(dittoWebSocketURLs)
    this.ditto.setTransportConfig(config)
    this.ditto.disableSyncWithV3();
    this.ditto.startSync();
    this.initialize();
  }

  async initialize() {
    console.log("DittoApp initialized.");
    this.ditto.sync.registerSubscription(`
        SELECT * FROM Vehicle 
    `);

    this.ditto.store.registerObserver(
      `
          SELECT *
          FROM Vehicle
      `,
      (result: any) => {
        this.vehicle =
          result.items.map((doc: any) => {
            return doc.value;
          })[0] || null;

        this.notifyClients(this.vehicle);
      }
    );
    console.log("Connected to Ditto and listening for changes");
  }

  notifyClients(vehicle: any | null) {
    const data = vehicle ? JSON.stringify(vehicle) : "null";
    this.clients.forEach((client) => {
      client.write(`data: ${data}\n\n`);
    });
  }

  addClient(client: any) {
    this.clients.push(client);
    client.on("close", () => {
      this.clients = this.clients.filter((c) => c !== client);
    });
  }

  async resetBattery() {
    if (this.vehicle) {
      try {
        //console.log(this.vehicle);
        const updateQuery = `
          UPDATE COLLECTION Vehicle SET battery=(:doc1) WHERE _id=='${this.vehicle._id}'
          `;

        const args = {
          doc1: {
            capacity: 1000,
            current: 50,
            sn: "123",
            status: "OK",
            voltage: 60,
          },
        };

        await this.ditto.store.execute(updateQuery, args);
        console.log("Vehicle battery reseted updated successfully.");
      } catch (err) {
        console.error("Error reseting vehicle battery in Ditto:", err);
      }
    } else {
      console.error("Vehicle not found in Ditto store.");
    }
  }

  async addSensor(values: { voltage: string; current: string }) {
    const measurement = {
      voltage: Number(values.voltage),
      current: Number(values.current),
    };
    if (this.vehicle) {
      try {
        //console.log(this.vehicle);
        const updateQuery = `
          UPDATE COLLECTION Vehicle SET battery=(:doc1) WHERE _id=='${this.vehicle._id}'
          `;

        const args = {
          doc1: {
            capacity: this.vehicle.battery.capacity,
            current: measurement.current,
            sn: this.vehicle.battery.sn,
            status: this.vehicle.battery.status,
            voltage: measurement.voltage,
          },
        };

        await this.ditto.store.execute(updateQuery, args);
        console.log("Vehicle battery status updated successfully.");
      } catch (err) {
        console.error("Error updating vehicle battery status in Ditto:", err);
      }
    } else {
      console.error("Vehicle not found in Ditto store.");
    }

    if (this.batteryMeasurements.length < 20) {
      this.batteryMeasurements.push(measurement);
    } else if (this.batteryMeasurements.length === 20) {
      try {
        const newSensor = {
          _id: new BSON.ObjectId().toString(),
          vin: this.vehicle._id,
          type: "battery",
          measurements: this.batteryMeasurements,
        };

        await this.ditto.store.execute(
          `
          INSERT INTO sensor
          DOCUMENTS (:newSensor)
        `,
          { newSensor }
        );

        console.log("Inserted the 20 readings of the sensor to Ditto");
        this.batteryMeasurements = [];
      } catch (err) {
        console.error("Error writing sensor data to Ditto:", err);
      }
    }

    return {
      result: `Battery status updated: voltage: ${values.voltage}, current: ${values.current}, Bucket: ${this.batteryMeasurements.length}/20`,
    };
  }

  async addComponent(values: { name: string }) {
    let vehicleUpdated = null;
    if (this.vehicle) {
      try {
        const doc1: Component = {
          _id: new BSON.ObjectId().toString(),
          name: values.name,
          owner_id: this.vehicle.owner_id
        }
        let updateResultsMap = await this.ditto.store.collection("Vehicle")
          .find("_id == $args._id", { _id: this.vehicle._id })
          .update((mutableDocs: MutableDocument[]) => {
            mutableDocs.forEach(doc => {
              doc.at('components').set([doc1])
              vehicleUpdated = doc.value
            })
          });
        if(updateResultsMap['updateResultsByDocumentIDString'][this.vehicle._id].length > 0)
          console.log("Vehicle components updated successfully.");
        else
          console.log("Vehicle components did not updated.");
      } catch (err) {
        console.error("Error updating vehicle components in Ditto:", err);
      }
    } else {
      console.error("Vehicle not found in Ditto store.");
    }
    return {
      message: `Component with name ${values.name} added to vehicle ${this.vehicle.name}`,
      vehicle: vehicleUpdated
    };
  }

  async clearComponent() {
    if (this.vehicle) {
      try {
        const updateQuery = ` UPDATE COLLECTION Vehicle SET components=(:doc1) WHERE _id=='${this.vehicle._id}' `;
        const args = {
          doc1: [],
        };

        await this.ditto.store.execute(updateQuery, args);
        console.log("Vehicle cleared components successfully.");
      } catch (err) {
        console.error("Error clearing components in Ditto:", err);
      }
    } else {
      console.error("Vehicle not found in Ditto store.");
    }
  }

  async getVehicleAsJSON() {
    try {
      const queryResult = await this.ditto.store.execute(
        `
        SELECT * FROM Vehicle 
        `
      );

      if (queryResult.items.length > 0) {
        const vehicle = queryResult.items[0].value;
        //console.log(queryResult);
        return JSON.stringify(vehicle);
      } else {
        throw new Error("No vehicle data found");
      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      throw error;
    }
  }

  async startSync() {
    try {
      this.ditto.startSync()
      return true
    } catch (err) {
      return false
    }
  }

  async stopSync() {
    try {
      this.ditto.stopSync()
      return true
    } catch (err) {
      return false
    }
  }

  async stopEngine() {
    if (this.vehicle) {
      try {
        const updateQuery = ` UPDATE COLLECTION Vehicle SET isOn=(:doc1) WHERE _id=='${this.vehicle._id}' `;
        const args = {
          doc1: false,
        };

        await this.ditto.store.execute(updateQuery, args);
        console.log("Vehicle engine stopped successfully.");
      } catch (err) {
        console.error("Error engine stopped in Ditto:", err);
      }
    } else {
      console.error("Vehicle not found in Ditto store.");
    }
  }

  async processCommands( commands: Command[]) {
    if(!commands)
        return
    console.log('processCommands dittoApp', commands)
    let vehicleUpdated = null;
    let processedCommands : Command[] = []
    for (const command of commands) {
      command.status = (command.status === "submitted") ? "inProgress" : command.status;
      const processedCommand: Command = {
        ts: command.ts,
        command: command.command,
        status: command.status
      }
      processedCommands.push(processedCommand)
    }
    await this.ditto.store.collection("vehicle")
      .find("_id == $args._id", { _id: this.vehicle._id })
      .update((mutableDocs: MutableDocument[]) => {
        mutableDocs.forEach(doc => {
          doc.at('commands').set(processedCommands)
          vehicleUpdated = doc.value
        })
      });

    // Create a delay function that returns a Promise
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(5000);

    this.resetBattery();

    for (const command of processedCommands) {
      command.status = (command.status === "inProgress") ? "completed" : command.status;
    }
    await this.ditto.store.collection("vehicle")
      .find("_id == $args._id", { _id: this.vehicle._id })
      .update((mutableDocs: MutableDocument[]) => {
        mutableDocs.forEach(doc => {
          doc.at('commands').set(processedCommands)
          vehicleUpdated = doc.value
        })
      });
    return {
      message: `Commands processed to vehicle ${this.vehicle.name}`,
      vehicle: vehicleUpdated
    };
  }

  async clearCommands() {
    if (this.vehicle) {
      try {
        const updateQuery = ` UPDATE COLLECTION Vehicle SET commands=(:doc1) WHERE _id=='${this.vehicle._id}' `;
        const args = {
          doc1: [],
        };

        await this.ditto.store.execute(updateQuery, args);
        console.log("Vehicle cleared commands successfully.");
      } catch (err) {
        console.error("Error clearing commands in Ditto:", err);
      }
    } else {
      console.error("Vehicle not found in Ditto store.");
    }
  }
}

export default DittoApp;
