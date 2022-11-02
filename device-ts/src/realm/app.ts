import { Vehicle, Battery, Component, Sensor, Measurement, Command } from './schemas';
import { appID, realmUser, vehicleConfig } from './config';
import { Collection, CollectionChangeSet } from 'realm';
import { ObjectId } from 'bson';

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
      schema: [Vehicle, Battery, Component, Sensor, Measurement, Command.schema],
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
      subscriptions.add(this.realm!.objects('Command').filtered(deviceID, { name: "command-filter" }));
    });

    // Create vehicle object on application start
    let vehicleInit = vehicleConfig;
    vehicleInit.device_id = this.app.currentUser!.id;
    this.realm.write(() => {
      this.vehicle = new Vehicle(this.realm, vehicleInit);
    });

    // Add a change listener for command objects
    try {
      this.realm!.objects("Command").addListener(this.onCommand.bind(this));
    } catch (error) {
      console.error(
        `An exception was thrown within the change listener: ${error}`
      );
    }
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
      this.realm!.write(() => {
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
    return JSON.stringify(this.vehicle!.toJSON());
  }

  /**
   * Add command listener
   */
  onCommand(commands: Collection<any>, changes: CollectionChangeSet) {
    // Handle newly added commands
    changes.insertions.forEach((index) => {
      const insertedCmd = commands[index];
      console.log(`New command received: ${insertedCmd.command}, created at: ${insertedCmd._id.getTimestamp()}`);
      try {
        this.realm?.write(() => {
          insertedCmd.status = "processed"
          //this.realm?.delete(insertedCmd);
        });
      } catch (err) {
        console.error(err);
      }
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