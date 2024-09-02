import { init, Ditto, Document } from "@dittolive/ditto";

class DittoApp {
  private ditto: Ditto;
  private vehicle: any | null = null;
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
    this.ditto.sync.registerSubscription(`
        SELECT * FROM vehicle 
    `);

    this.ditto.store.registerObserver(
      `
          SELECT *
          FROM vehicle
      `,
      (result: any) => {
        this.vehicle =
          result.items.map((doc: any) => {
            return doc.value;
          })[0] || null;

        this.notifyClients(this.vehicle);
      }
    );
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

  async getVehicleAsJSON() {
    try {
      const queryResult = await this.ditto.store.execute(
        `
        SELECT * FROM "vehicle" 
        `
      );

      if (queryResult.items.length > 0) {
        const vehicle = queryResult.items[0].value;
        console.log(queryResult);
        return JSON.stringify(vehicle);
      } else {
        throw new Error("No vehicle data found");
      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      throw error;
    }
  }
}

export default DittoApp;
