import { Device, Battery, Component, Sensor, Command } from './schemas';
import { appID, realmUser } from './config';
import Realm, { Collection, CollectionChangeSet } from 'realm';

class RealmApp {

  self;
  app;
  realm?: Realm;
  // Reference to the created device object
  device!: Device & Realm.Object;

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
      schema: [Device.schema, Battery.schema, Component.schema, Sensor.schema, Command.schema],
      sync: {
        user: this.app.currentUser!,
        flexible: true
      }
    });
    // Create and add flexible sync subscription filters
    const deviceID = `device_id = ${JSON.stringify(this.app.currentUser!.id)}`
    this.realm?.subscriptions.update(subscriptions => {
      subscriptions.add(this.realm!.objects('Device').filtered(deviceID, { name: "device-filter" }));
      subscriptions.add(this.realm!.objects('Component').filtered(deviceID, { name: "component-filter" }));
      subscriptions.add(this.realm!.objects('Command').filtered(deviceID, { name: "command-filter" }));
    });
    // Create Device object on application start
    this.createDevice("My Car");
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
   * Creates a new Device object with the provided name
   * @param name Name of the device
   * @returns Attributes of the created device as JSON object
   */
  createDevice(name: string) {
    const newDevice = new Device(name, this.app.currentUser!.id, new Battery('123', 100));
    try {
      this.realm!.write(() => {
        this.realm!.create(Device.schema.name, newDevice);
      });
      this.device = this.realm!.objects<Device>('Device').filtered(`device_id = '${this.app.currentUser!.id}'`)[0];
    } catch (error) {
      console.error(error);
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
        let component = new Component(name, this.app.currentUser!.id);
        this.device!.components.push(component);
      });
      return { result: "Component created and related to id: " + this.device!.name };
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
  addSensor(sensor: { voltage: string, current: string }) {
    let measurement = new Sensor(this.app.currentUser!.id, this.device.battery!.sn, Number(sensor.voltage), Number(sensor.current));
    try {
      this.realm!.write(() => {
        this.realm!.create(Sensor.schema.name, measurement);
        this.device.battery!.voltage = Number(sensor.voltage);
        this.device.battery!.current = Number(sensor.current);
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
    return JSON.stringify(this.device!.toJSON());
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
          this.realm?.delete(insertedCmd);
        });
      } catch (err) {
        console.error(err);
      }
    });
  }

  /**
   * Remove all change listeners,delete created devices/components
   */
  cleanupRealm() {
    try {
      // Remove all change listener
      this.realm!.removeAllListeners();
      // Delete all device and component entries of the current subscription
      this.realm!.write(() => {
        this.realm!.deleteAll();
      });
      console.log("Realm cleaned up!")
      // Remove all flexible sync subscriptions
      this.realm!.subscriptions.update((subscriptions) => {
        subscriptions.removeAll();
      })
    } catch (err) {
      console.error("Failed: ", err);
    }
  }
}

export default RealmApp;