import { init, Ditto, Document } from "@dittolive/ditto";

interface Vehicle {
  _id: string;
  name: string;
  owner_id: string;
  mixedTypes: string;
  device_id: string;
  isOn: boolean;
  commands: Array<any>;
  battery: {
    sn: string;
    capacity: number;
    voltage: number;
    current: number;
    status: string;
  };
  components: Array<any>;
}

class DittoApp {
  private ditto: Ditto;
  private vehicle: Vehicle | null = null;
  private batteryMeasurements: Array<any> = [];
  private clients: Array<any> = [];

  constructor() {
    init();
    this.ditto = new Ditto({
      type: "onlinePlayground",
      appID: "", // Replace with your actual app ID
      token: "", // Replace with your actual token
    });
    this.ditto.startSync();
    this.initialize();
  }

  async initialize() {
    const vehicle = {
      _id: "1234",
      name: "My Car",
      owner_id: "6508d7bc73e92d4da43bb271",
      mixedTypes: "Change Type",
      isOn: false,
      commands: [],
      device_id: "",
      battery: {
        capacity: 1000,
        current: 28,
        sn: "123",
        status: "OK",
        voltage: 50,
      },
      components: [],
    };

    this.vehicle = vehicle;

    this.ditto.sync.registerSubscription(`
        SELECT * FROM Vehicle 
    `);

    this.ditto.store.registerObserver(
      `
          SELECT *
          FROM Vehicle
      `,
      (result) => {
        this.vehicle =
          result.items.map((doc) => {
            return doc.value;
          })[0] || null;

        this.notifyClients(this.vehicle);
      }
    );

    //const vehicleCol = this.ditto.store.collection("Vehicle");
    //await vehicleCol.upsert(vehicle);

    try {
      await this.ditto.store.execute(
        `
            INSERT INTO Vehicle
            DOCUMENTS (:vehicle)
        `,
        { vehicle }
      );
      console.log("Test vehicle inserted successfully!");
    } catch (err) {
      console.error("Failed to insert test vehicle: ", err);
    }
  }

  notifyClients(vehicle: Vehicle | null) {
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

  async getVehicleAsJSON() {
    try {
      const queryResult = await this.ditto.store.execute(
        `
        SELECT * FROM "Vehicle" 
        `
      );

      if (queryResult.items.length > 0) {
        const vehicle = queryResult.items[0].value;
        //console.log(vehicle);
        return JSON.stringify(vehicle);
      } else {
        throw new Error("No vehicle data found");
      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      throw error;
    }
  }

  async cleanup() {
    try {
      if (this.vehicle) {
        await this.ditto.store.execute(
          `
            UPDATE vehicle
            SET isDeleted = true
            WHERE _id = :id
          `,
          { id: this.vehicle._id }
        );

        console.log("Ditto store cleaned up!");
      } else {
        console.log("No vehicle found to clean up.");
      }
    } catch (err) {
      console.error("Failed to cleanup: ", err);
    }
  }
}

export default DittoApp;
