import { Vehicle, Battery, Component, Sensor, Measurement, Command } from './schemas';
import { appID, realmUser, vehicleConfig } from './config';
import { Collection, CollectionChangeSet } from 'realm';
import { ObjectId } from 'bson';

class RealmApp {

  self;
  app;
  realm!: Realm;
  // Reference to the created vehicle object
  vehicle!: Vehicle;

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
    // Create and add flexible sync subscription filters
    const deviceID = `device_id = ${JSON.stringify(this.app.currentUser!.id)}`;
    this.realm.subscriptions.update(subscriptions => {
      subscriptions.add(this.realm!.objects('Vehicle').filtered(deviceID, { name: "device-filter" }));
      subscriptions.add(this.realm!.objects('Component').filtered(deviceID, { name: "component-filter" }));
      subscriptions.add(this.realm!.objects('Command').filtered(deviceID, { name: "command-filter" }));
    });

    // Create vehicle object on application start
    let vehicleInit = vehicleConfig;
    // Set user id
    vehicleInit.device_id = this.app.currentUser!.id;

    console.log(JSON.stringify(vehicleInit))

    this.realm.write(() => {
      this.vehicle = new Vehicle(this.realm, vehicleInit);
      console.log("Hello " + this.vehicle.name);
    });

    // Add command change listener
    // Add the listener callback to the collection of dogs
    try {
      this.realm!.objects("Command").addListener(this.onCommand.bind(this));
    } catch (error) {
      console.error(
        `An exception was thrown within the change listener: ${error}`
      );
    }
  }

  /**
   * Creates a new component with the provided name and relates it to the first previously created Device object
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
      return { result: "Add component failed, no device available!" };
    }
  }


  /**
   * Pauses synchronization of a previously opened Realm
   * @returns JSON object
   */
  pauseRealm() {
    this.realm!.syncSession?.pause();
    return ({ result: 'Sync paused!' });
  }

  /**
   * Resumes synchronization of a previsouly paused Realm 
   */
  resumeRealm() {
    this.realm!.syncSession?.resume();
    return ({ result: 'Sync resumed!' });
  }

  /**
   * Uses the asymmetric sync functionality to efficiently push a time series object to the backend
   */
  addSensor(measurement: { voltage: string, current: string }) {
    //let old_measurement = new Sensor(this.app.currentUser!.id, this.vehicle.battery!.sn, Number(sensor.voltage), Number(sensor.current));
    const sensor = {
      device_id: this.app.currentUser!.id,
      timestamp: new Date(),
      voltage: Number(measurement.voltage),
      current: Number(measurement.current)
    }

    console.log(JSON.stringify(sensor));
    try {
      this.realm!.write(() => {
        // TODO -> change to push measurements array
        this.realm.create("Sensor", sensor);
        this.vehicle.battery!.voltage = Number(measurement.voltage);
        this.vehicle.battery!.current = Number(measurement.current);
      });
    } catch (err) {
      console.error(err);
    }
    return ({ result: `Updated sensor measurement voltage:${sensor.voltage} and current:${sensor.current} added!` });
  }

  /**
   * Refresh device on web application
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