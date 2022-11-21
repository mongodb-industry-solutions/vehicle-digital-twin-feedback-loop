import { Vehicle, Battery, Command, Component, Sensor, Measurement } from './schemas';
import { appID, realmUser, vehicleConfig } from './config';
import { ObjectId } from 'bson';
import { setTimeout } from "timers/promises";

class RealmApp {

  self;
  app;
  realm!: Realm;
  // Reference to the vehicle object
  vehicle!: Vehicle;
  // Battery measurements bucket
  batteryMeasurements: Array<Unmanaged<Measurement>> = []

  constructor() {
    this.app = new Realm.App({ id: appID });
    this.self = this;
  }

  /**
   * Atlas application services email/password authentication
   */
  async login() {
    await this.app.logIn(Realm.Credentials.emailPassword(realmUser.username, realmUser.password));
    this.realm = await Realm.open({
      schema: [Vehicle, Battery, Command, Component, Sensor, Measurement],
      sync: {
        user: this.app.currentUser!,
        flexible: true
      }
    });
    // Add flexible sync subscriptions
    const deviceID = `device_id = ${JSON.stringify(this.app.currentUser!.id)}`;
    this.realm.subscriptions.update(subscriptions => {
      subscriptions.add(this.realm!.objects('Vehicle').filtered(deviceID, { name: "device-filter" }));
      subscriptions.add(this.realm!.objects('Component').filtered(deviceID, { name: "component-filter" }));
    });

    // Create vehicle object on application start
    let vehicleInit = vehicleConfig;
    vehicleInit.device_id = this.app.currentUser!.id;
    this.realm.write(() => {
      this.vehicle = new Vehicle(this.realm, vehicleInit);
    });
    this.vehicle.addListener(this.processCommands.bind(this));
  }

  /**
   * Creates a new component object and relates it to the parent vehicle object
   * @param name Name of the component to be created
   * @returns Result of the component creation procedure as JSON object or the resulting error
   */
  addComponent(name: string) {
    try {
      this.realm!.write(() => {
        let component = new Component(this.realm, { _id: new ObjectId, name: name, device_id: this.app.currentUser!.id });
        this.vehicle.components!.push(component);
      });
      return { result: "Component created and related to id: " + this.vehicle.name };
    } catch (error) {
      console.error(error);
      return { result: "Add component failed, no vehicle available!" };
    }
  }


  /**
   * Pause synchronization of the Realm
   */
  pauseRealm() {
    this.realm!.syncSession?.pause();
    return ({ result: 'Sync paused!' });
  }

  /**
   * Resume synchronization of the paused Realm 
   */
  resumeRealm() {
    this.realm!.syncSession?.resume();
    return ({ result: 'Sync resumed!' });
  }

  /**
   * Store and sync battery sensor values
   */
  addSensor(values: { voltage: string, current: string }) {

    const measurement = { ts: new Date(), voltage: Number(values.voltage), current: Number(values.current) };
    // Collect 20 measurements before using asymmetric sync for pushing to backend
    if (this.batteryMeasurements.length < 20) {
      this.batteryMeasurements.push(measurement)
    }

    try {
      this.realm.write(() => {
        if (this.batteryMeasurements.length == 20) {
          const sensor = {
            _id: new ObjectId,
            vin: this.vehicle.vin,
            type: "battery",
            measurements: this.batteryMeasurements
          };
          this.realm.create("Sensor", sensor);
          this.batteryMeasurements = [];
        }
        // Update vehicle battery fields and sync with backend
        this.vehicle.battery!.voltage = Number(measurement.voltage);
        this.vehicle.battery!.current = Number(measurement.current);
      });
    } catch (err) {
      console.error(err);
    }
    return ({ result: `Battery status updated: voltage:${values.voltage}, current:${values.current}. Bucket: ${this.batteryMeasurements.length}/20` });
  }

  /**
   * Provide vehicle object as JSON string
   */
  getDeviceAsJSON(): string {
    let vehicle = this.vehicle!.toJSON();
    vehicle['measurements'] = this.batteryMeasurements.length;
    return JSON.stringify(vehicle);
  }

  /**
   * Process commands
   */
  processCommands(vehicle: Vehicle, changes: any) {
    console.log(`Changes: ${JSON.stringify(changes)}`);
    console.log(`Vehicle: ${JSON.stringify(vehicle)}`);
    if (changes.changedProperties == "commands") {
      vehicle.commands?.forEach(async (command) => {
        if (command.status == "submitted") {
          console.log(JSON.stringify(command));
          await this.self.realm.write(() => {
            command.status = "inProgress";
          });
          await setTimeout(5000).then(() => {
            this.resetBattery();
            this.self.realm.write(() => {
              command.status = "completed";
            });
          });
        };
      });
    }
    if (changes.deleted) {
      console.log(`Commands deleted: ${changes.deleted}`);
    }
  }

  // Set the battery status back to ok
  resetBattery() {
    this.self.realm.write(() => {
      this.vehicle.battery!.status = "OK";
    });
  }

  /**
   * Remove all change listeners,delete created devices/components
   */
  async cleanupRealm() {
    try {
      // Remove all change listener
      this.realm!.removeAllListeners();
      // Delete all device and component entries of the current subscription
      this.realm!.write(() => {
        this.realm!.deleteAll();
      });
      await this.realm?.syncSession?.uploadAllLocalChanges()
      console.log("Realm cleaned up!")
    } catch (err) {
      console.error("Failed: ", err);
    }
  }
}

export default RealmApp;