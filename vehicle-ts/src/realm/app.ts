import { Vehicle, Battery, Command, Component, Sensor, Measurement } from './schemas';
import { appID, realmUser, vehicleConfig } from './config';
import { setTimeout } from "timers/promises";
import Realm, {BSON, ObjectChangeSet, Unmanaged } from 'realm';

class RealmApp {

  self;
  app;
  realm!: Realm;
  vehicle!: Vehicle; // Reference to the vehicle object
  batteryMeasurements: Array<Unmanaged<Measurement>> = []   // Battery measurements bucket

  constructor() {
    this.app = new Realm.App({ id: appID });
    this.self = this;
  }

  /**
   * Atlas application services email/password authentication
   */
  async login() {
    const user = await this.app.logIn(Realm.Credentials.emailPassword(realmUser.username, realmUser.password));
    this.realm = await Realm.open({
      schema: [Vehicle, Battery, Command, Component, Sensor, Measurement],
      sync: {
        user, // shorthand for user: user;
        flexible: true
      }
    });
    // Add flexible sync subscriptions
    const ownerID = `owner_id = ${JSON.stringify(user.id)}`;
    await this.realm.subscriptions.update(subscriptions => {
      subscriptions.add(this.realm!.objects(Vehicle).filtered(ownerID), { name: "vehicle-filter" });
      subscriptions.add(this.realm!.objects(Component).filtered(ownerID), { name: "component-filter" });
    });

    // Create vehicle object on application start
    let vehicleInit = vehicleConfig;
    vehicleInit.owner_id = this.app.currentUser!.id;
    this.realm.write(() => {
      // @ts-expect-error SDK TS Bug: Will fix being able to pass nested unmanaged object.
      this.vehicle = new Vehicle(this.realm, vehicleInit);
      // this.vehicle = new Vehicle(this.realm, { ...vehicleInit, battery: new Battery(this.realm, vehicleInit.battery) });
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
        let component = new Component(this.realm, { _id: new BSON.ObjectId(), name: name, owner_id: this.app.currentUser!.id });
        this.vehicle.components!.push(component);
      });
      return { result: "Component created and related to " + this.vehicle.name };
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
    // Update vehicle battery fields on the vehicle object
    try {
      this.realm.write(() => {
        this.vehicle.battery!.voltage = Number(measurement.voltage);
        this.vehicle.battery!.current = Number(measurement.current);
      })
    } catch (err) {
      console.error(err);
    }
    // An example for a bucket pattern, when sensor measurements are too frequent to be sent to the backend
    if (this.batteryMeasurements.length < 20) {
      this.batteryMeasurements.push(measurement)
    } else if (this.batteryMeasurements.length === 20) {
      // When batteryMeasurements bucket contains 20 measurements, push it to the backend
      try {
        this.realm.write(() => {
          const sensor = {
            _id: new BSON.ObjectId(),
            vin: this.vehicle._id,
            type: "battery",
            measurements: this.batteryMeasurements
          };
          this.realm.create(Sensor, sensor);
          this.batteryMeasurements = [];
        });
      } catch (err) {
        console.error(err);
      }
    }
    return ({ result: `Battery status updated: voltage:${values.voltage}, current:${values.current}, Bucket: ${this.batteryMeasurements.length}/20` });
  }

  /**
   * Provide vehicle object as JSON string
   */
  getVehicleAsJSON(): string {
    const vehicle = this.vehicle!.toJSON();
    vehicle['measurements'] = this.batteryMeasurements.length;
    return JSON.stringify(vehicle);
  }

  /**
   * Process commands
   */
  processCommands(vehicle: Vehicle, changes: ObjectChangeSet<Vehicle>) {
    if (changes.deleted) {
      console.log(`Vehicle removed! ${changes}`);
    } else if (changes.changedProperties.includes("commands")) {
      for (const command of vehicle.commands) {
        if (command.status === "submitted") {
          console.log(JSON.stringify(command));
          this.realm.write(() => {
            command.status = "inProgress";
          });
  
          setTimeout(5000).then(() => {
            this.resetBattery();
            this.realm.write(() => {
              command.status = "completed";
              console.log(JSON.stringify(command));
            });
          });
        }
      }
    }
  }

  // Set the battery status back to ok
  resetBattery() {
    this.self.realm.write(() => {
      this.vehicle.battery!.status = "OK";
    });
  }

  /**
   * Remove all change listeners,delete created vehicles/components
   */
  async cleanupRealm() {
    try {
      // Remove all change listener
      this.vehicle.removeAllListeners();
      // Delete all vehicle and component entries of the current subscription
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