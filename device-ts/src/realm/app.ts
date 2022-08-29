import { Component, Device, Sensor } from './schemas';
import { appID, realmUser } from './config';
import Realm from 'realm';

/**
 * Initialize a new Realm application instance
 */
const app = new Realm.App({ id: appID });
let realm: Realm;
// Reference to the created device object
export let device: Device & Realm.Object<unknown>;

/**
 * Main function
 */
async function run() {
  await login().catch(err => {
    console.error("Error: " + JSON.stringify(err));
  });
  // Create and add flexible sync subscription filters
  const deviceID = `device_id = ${JSON.stringify(app.currentUser!.id)}`
  realm.subscriptions.update(subscriptions => {
    subscriptions.add(realm.objects('Device').filtered(deviceID, { name: "device-filter" }));
    subscriptions.add(realm.objects('Component').filtered(deviceID, { name: "component-filter" }));
  });
  // Create Device object on application start
  createDevice("Device Name");
}

/**
 * Atlas application services email/password authentication
 */
async function login() {
  await app.logIn(Realm.Credentials.emailPassword(realmUser.username, realmUser.password));
  realm = await Realm.open({
    schema: [Device.schema, Component.schema, Sensor.schema],
    sync: {
      user: app.currentUser!,
      flexible: true
    }
  });
}

/**
 * Creates a new Device object with the provided name
 * @param name Name of the device
 * @returns Attributes of the created device as JSON object
 */
export function createDevice(name: string) {
  const newDevice = new Device(name, app.currentUser!.id);
  try {
    realm.write(() => {
      device = realm.create(Device.schema.name, newDevice);
    });
  } catch (error) {
    console.error(error);
  }
  //device = realm.objects<Device>('Device').filtered(`device_id = '${app.currentUser!.id}'`)[0];
}

/**
 * Creates a new component with the provided name and relates it to the first previously created Device object
 * @param name Name of the component to be created
 * @returns Result of the component creation procedure as JSON object or the resulting error
 */
export function addComponent(name: string) {
  try {
    realm.write(() => {
      let component = new Component(name, app.currentUser!.id);
      device.components.push(component);
    });
    return { result: "Component created and related to id: " + device.name };
  } catch (error) {
    console.error(error);
    return { result: "Add component failed, no device available!" };
  }
}

/**
 * Pauses synchronization of a previously opened Realm
 * @returns JSON object
 */
export function pauseRealm() {
  console.log('pause')
  realm.syncSession?.pause();
  return ({ result: 'Sync paused!' });
}

/**
 * Resumes synchronization of a previsouly paused Realm 
 * @returns JSON object
 */
export function resumeRealm() {
  console.log('Sync paused!');
  realm.syncSession?.resume();
  return ({ result: 'Sync resumed!' });
}

/**
 * Uses the asymmetric sync functionality to efficiently push a time series object to the backend
 * @param value String type e.g. a sensor value
 * @returns JSON object
 */
export function addSensor(sensor: {voltage: string, current: string}) {
  let measurement = new Sensor(app.currentUser!.id, Number(sensor.voltage), Number(sensor.current));
  realm.write(() => {
    realm.create(Sensor.schema.name, measurement);
    device.voltage = Number(sensor.voltage);
    device.current = Number(sensor.current);
  });
  return ({ result: `Sensor measurement ${sensor.current} inserted!` });
}

/**
 * Refresh device on web application
 * @returns Device as JSON string
 */
export function getDeviceAsJSON(): string {
  return JSON.stringify(device.toJSON());
}

/**
 * Add a devices collection change listener
 */
export function addDevicesChangeListener(listener: any) {
  const devices = realm.objects('Device');
  devices.addListener(listener);
}

/**
 * Remove all change listeners,delete created devices/components
 */
export function cleanupRealm() {
  try {
    // Remove all change listener
    realm.removeAllListeners();
    // Delete all device and component entries of the current subscription
    realm.write(() => {
      realm.deleteAll();
    });
    // Remove all flexible sync subscriptions
    realm.subscriptions.update((subscriptions) => {
      subscriptions.removeAll();
    })
    console.log("Realm cleaned up!")
  } catch (err) {
    console.error("Failed: ", err);
  }
}

/**
 * Execute main function
 */
run().catch((err) => {
  console.error("Failed: ", err);
});
