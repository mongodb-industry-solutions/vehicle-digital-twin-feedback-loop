import { Device, Battery, Component, Sensor } from './schemas';
import { appID, realmUser } from './config';
import Realm from 'realm';

class RealmApp {

  app;
  realm?: Realm;
  // Reference to the created device object
  device!: Device & Realm.Object;

  constructor() {
    this.app = new Realm.App({ id: appID });
  }

  /**
   * Atlas application services email/password authentication
   */
  async login() {
    await this.app.logIn(Realm.Credentials.emailPassword(realmUser.username, realmUser.password));
    this.realm = await Realm.open({
      schema: [Device.schema, Battery.schema, Component.schema, Sensor.schema],
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
    });
    // Create Device object on application start
    this.createDevice("Device Name Login");
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
    this.realm!.write(() => {
      this.realm!.create(Sensor.schema.name, measurement);
      this.device!.voltage = Number(sensor.voltage);
      this.device!.current = Number(sensor.current);
    });
    return ({ result: `Updated sensor measurement voltage:${sensor.voltage} and current:${sensor.current} added!` });
  }

  /**
   * Refresh device on web application
   */
  getDeviceAsJSON(): string {
    return JSON.stringify(this.device!.toJSON());
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